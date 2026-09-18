// Weighted match algorithm.
// Eligibility = HARD GATE. Score = weighted fit across soft factors.

import { SCHEMES } from "../data/schemes.js";

const WEIGHTS = {
  category: 30,   // business category ↔ scheme category fit
  income: 15,     // proximity to income limit
  age: 15,        // proximity to age midpoint
  status: 10,     // business status match
  subsidy: 15,    // scheme subsidy attractiveness
  costFit: 15,    // project cost vs max loan
};

// Map profile businessCategory → scheme categories that fit best
const CATEGORY_FIT = {
  "Manufacturing": ["business", "youth"],
  "Agriculture / Agri-processing": ["agriculture", "food_processing"],
  "Retail / Shop": ["business", "youth"],
  "Food / Restaurant": ["business", "youth", "food_processing"],
  "Textile / Garments": ["business", "women", "textile"],
  "Handicrafts": ["handicraft", "women", "sc_st"],
  "Services": ["business", "youth", "startup"],
  "IT / Software": ["startup"],
  "Transport": ["business", "youth"],
  "Other": ["business"],
};

function subCategoryFit(profile, scheme) {
  if (!profile.businessCategory) return 0.5;
  const fits = CATEGORY_FIT[profile.businessCategory] || [];
  if (fits.includes(scheme.category)) return 1;
  // partial: any business-adjacent scheme gets 0.4
  if (scheme.category === "business") return 0.4;
  return 0.2;
}

function subIncomeFit(profile, scheme) {
  const limit = scheme.eligibility.maxIncome;
  if (!limit) return 0.75;                    // no limit → mild bonus
  const income = Number(profile.annualIncome || 0);
  if (income === 0) return 0.5;
  if (income > limit) return 0;               // gate should have caught this
  const ratio = income / limit;               // 0..1
  return 1 - ratio * 0.5;                     // lower income → higher fit
}

function subAgeFit(profile, scheme) {
  const { minAge, maxAge } = scheme.eligibility;
  const age = Number(profile.age || 0);
  if (!minAge && !maxAge) return 0.75;
  if (!maxAge) return age >= (minAge || 0) ? 1 : 0;
  const mid = ((minAge || 0) + maxAge) / 2;
  const half = (maxAge - (minAge || 0)) / 2;
  const dist = Math.abs(age - mid);
  return Math.max(0, 1 - dist / (half || 1));
}

function subStatusFit(profile, scheme) {
  const allowed = scheme.eligibility.businessStatus;
  if (!allowed) return 0.75;
  if (allowed.includes(profile.businessStatus)) return 1;
  return 0;
}

function subSubsidyFit(scheme) {
  const p = scheme.benefits.subsidyPercent || 0;
  return Math.min(1, p / 35);                 // 35%+ → max
}

function subCostFit(profile, scheme) {
  const maxLoan = scheme.benefits.maxLoan;
  const cost = Number(profile.projectCost || 0);
  if (!maxLoan || !cost) return 0.75;
  if (cost <= maxLoan) return 1;
  return Math.max(0.3, maxLoan / cost);
}

export function evaluateScheme(scheme, profile) {
  const el = scheme.eligibility;
  const issues = [];      // hard fails
  const missing = [];     // missing profile fields
  const reasons = [];     // positive reasons

  // ---- AGE ----
  if (!profile.age) missing.push("age");
  else {
    const age = Number(profile.age);
    if (el.minAge && age < el.minAge)
      issues.push({ field: "age", min: el.minAge });
    else if (el.maxAge && age > el.maxAge)
      issues.push({ field: "age", max: el.maxAge });
    else
      reasons.push({
        field: "age",
        value: `${age}`,
        range: `${el.minAge ?? 0}–${el.maxAge ?? "∞"}`,
      });
  }

  // ---- INCOME ----
  if (el.maxIncome) {
    if (!profile.annualIncome) missing.push("income");
    else if (Number(profile.annualIncome) > el.maxIncome)
      issues.push({ field: "income", max: el.maxIncome });
    else
      reasons.push({
        field: "income",
        value: `₹${Number(profile.annualIncome).toLocaleString("en-IN")}`,
        max: `₹${el.maxIncome.toLocaleString("en-IN")}`,
      });
  }

  // ---- CATEGORY ----
  if (el.category) {
    if (!profile.category) missing.push("category");
    else if (!el.category.includes(profile.category))
      issues.push({ field: "category" });
    else reasons.push({ field: "category", value: profile.category });
  }

  // ---- GENDER ----
  if (el.gender) {
    if (!profile.gender) missing.push("gender");
    else if (!el.gender.includes(profile.gender))
      issues.push({ field: "gender" });
    else reasons.push({ field: "gender", value: profile.gender });
  }

  // ---- BUSINESS STATUS ----
  if (el.businessStatus) {
    if (!profile.businessStatus) missing.push("businessStatus");
    else if (!el.businessStatus.includes(profile.businessStatus))
      issues.push({ field: "businessStatus" });
    else reasons.push({ field: "businessStatus", value: profile.businessStatus });
  }

  // ---- STATUS ----
  let status = "eligible";
  if (issues.length > 0) status = "not_eligible";
  else if (missing.length > 0) status = "need_info";

  // ---- SCORE ----
  let score = 0;
  if (status === "eligible") {
    const parts = [
      { w: WEIGHTS.category, s: subCategoryFit(profile, scheme) },
      { w: WEIGHTS.income,   s: subIncomeFit(profile, scheme) },
      { w: WEIGHTS.age,      s: subAgeFit(profile, scheme) },
      { w: WEIGHTS.status,   s: subStatusFit(profile, scheme) },
      { w: WEIGHTS.subsidy,  s: subSubsidyFit(scheme) },
      { w: WEIGHTS.costFit,  s: subCostFit(profile, scheme) },
    ];
    const total = parts.reduce((a, p) => a + p.w, 0);
    const raw = parts.reduce((a, p) => a + p.w * p.s, 0) / total;
    score = Math.round(50 + raw * 50); // 50..100 for eligible schemes
  } else if (status === "need_info") {
    // partial score
    const parts = [
      { w: WEIGHTS.category, s: subCategoryFit(profile, scheme) },
      { w: WEIGHTS.subsidy,  s: subSubsidyFit(scheme) },
    ];
    const total = parts.reduce((a, p) => a + p.w, 0);
    const raw = parts.reduce((a, p) => a + p.w * p.s, 0) / total;
    score = Math.round(30 + raw * 30); // 30..60
  } else {
    score = 0;
  }

  return { status, score, issues, reasons, missing };
}

export function getRankedRecommendations(profile) {
  if (!profile) return [];
  return SCHEMES.map((scheme) => {
    const ev = evaluateScheme(scheme, profile);
    return { scheme, ...ev };
  }).sort((a, b) => {
    // eligible first, then by score
    const rankOrder = { eligible: 0, need_info: 1, not_eligible: 2 };
    if (rankOrder[a.status] !== rankOrder[b.status])
      return rankOrder[a.status] - rankOrder[b.status];
    return b.score - a.score;
  });
}