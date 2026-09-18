"""Enhanced matching engine with semantic keywords, confidence, and diversity.

Upgrades:
- Semantic keyword matching on business_idea text
- Confidence score based on profile completeness + scheme metadata
- Factor breakdown for "why this scheme?" UI
- Diversity: prevents top-5 from being all same category
- Structured rules_json support
"""
from typing import List, Dict, Any
from app.models.scheme import Scheme


WEIGHTS = {
    "category": 25,
    "income": 12,
    "age": 12,
    "status": 8,
    "subsidy": 12,
    "cost_fit": 12,
    "semantic": 12,
    "district_fit": 7,
}

CATEGORY_FIT = {
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
}

# Keyword → category expansion for semantic matching
KEYWORD_MAP = {
    "dairy": ["agriculture", "food_processing"],
    "milk": ["agriculture", "food_processing"],
    "cow": ["agriculture"],
    "buffalo": ["agriculture"],
    "poultry": ["agriculture"],
    "chicken": ["agriculture"],
    "fish": ["agriculture"],
    "farm": ["agriculture"],
    "crop": ["agriculture"],
    "organic": ["agriculture"],
    "bee": ["agriculture"],
    "honey": ["agriculture"],
    "grocery": ["business"],
    "shop": ["business"],
    "store": ["business"],
    "retail": ["business"],
    "restaurant": ["business", "food_processing"],
    "catering": ["business", "food_processing"],
    "food": ["food_processing", "business"],
    "bakery": ["food_processing"],
    "snack": ["food_processing"],
    "pickle": ["food_processing"],
    "masala": ["food_processing"],
    "handicraft": ["handicraft", "women"],
    "pottery": ["handicraft"],
    "weaving": ["handicraft", "textile"],
    "tailor": ["textile", "women"],
    "garment": ["textile"],
    "embroidery": ["handicraft", "women", "textile"],
    "coir": ["handicraft"],
    "textile": ["textile"],
    "loom": ["textile"],
    "software": ["startup"],
    "app": ["startup"],
    "website": ["startup"],
    "it": ["startup"],
    "tech": ["startup"],
    "consulting": ["business", "startup"],
    "manufacture": ["business", "youth"],
    "factory": ["business"],
    "machine": ["business"],
    "transport": ["business"],
    "logistics": ["business"],
    "auto": ["business", "youth"],
    "beauty": ["business", "women"],
    "salon": ["business", "women"],
    "education": ["startup", "youth"],
    "coaching": ["youth", "business"],
    "export": ["export", "business"],
    "import": ["export", "business"],
}


# ---------- Semantic matching ----------

def _semantic_score(profile: Dict[str, Any], scheme: Scheme) -> float:
    """Extract keywords from business_idea, map to categories, compare to scheme.category."""
    idea = (profile.get("business_idea") or "").lower()
    if not idea:
        return 0.5

    matched_categories = set()
    for word, cats in KEYWORD_MAP.items():
        if word in idea:
            matched_categories.update(cats)

    if not matched_categories:
        return 0.4

    if scheme.category in matched_categories:
        return 1.0

    # partial: adjacent category
    return 0.3


# ---------- Existing fit functions (unchanged) ----------

def _category_fit(profile, scheme):
    bc = profile.get("business_category")
    if not bc:
        return 0.5
    fits = CATEGORY_FIT.get(bc, [])
    if scheme.category in fits:
        return 1.0
    if scheme.category == "business":
        return 0.4
    return 0.2


def _income_fit(profile, scheme):
    limit = scheme.max_income
    if not limit:
        return 0.75
    income = profile.get("annual_income") or 0
    if income == 0:
        return 0.5
    if income > limit:
        return 0.0
    return 1 - (income / limit) * 0.5


def _age_fit(profile, scheme):
    age = profile.get("age") or 0
    mn, mx = scheme.min_age, scheme.max_age
    if not mn and not mx:
        return 0.75
    if not mx:
        return 1.0 if age >= (mn or 0) else 0.0
    mid = ((mn or 0) + mx) / 2
    half = (mx - (mn or 0)) / 2
    return max(0.0, 1 - abs(age - mid) / (half or 1))


def _status_fit(profile, scheme):
    allowed = scheme.eligible_business_status
    if not allowed:
        return 0.75
    return 1.0 if profile.get("business_status") in allowed else 0.0


def _subsidy_fit(scheme):
    return min(1.0, (scheme.subsidy_percent or 0) / 35)


def _cost_fit(profile, scheme):
    max_loan = scheme.max_loan
    cost = profile.get("project_cost") or 0
    if not max_loan or not cost:
        return 0.75
    if cost <= max_loan:
        return 1.0
    return max(0.3, max_loan / cost)


def _district_fit(profile, scheme):
    """TN district schemes may prefer certain districts. For now a mild bonus
    for having a district filled — since most schemes are TN-wide."""
    return 1.0 if profile.get("district") else 0.5


# ---------- Confidence ----------

PROFILE_FIELDS = ["age", "gender", "category", "district", "annual_income",
                  "education", "business_status", "business_category",
                  "project_cost", "funding_required"]


def _confidence(profile: Dict[str, Any], scheme: Scheme) -> float:
    """0..1. Higher when profile is complete and scheme is well-verified."""
    filled = sum(1 for f in PROFILE_FIELDS if profile.get(f))
    profile_score = filled / len(PROFILE_FIELDS)

    # verified_status bonus
    verified = 1.0 if scheme.last_verified else 0.5
    source = 1.0 if scheme.source_url else 0.6

    # completeness of scheme data
    scheme_data_score = sum([
        1 if scheme.max_loan else 0,
        1 if scheme.interest_rate else 0,
        1 if scheme.subsidy_percent is not None else 0,
        1 if scheme.documents else 0,
        1 if scheme.eligible_categories else 0,
    ]) / 5.0

    return round(
        0.5 * profile_score
        + 0.2 * verified
        + 0.1 * source
        + 0.2 * scheme_data_score,
        3,
    )


def _confidence_label(score: float) -> str:
    if score >= 0.85:
        return "high"
    if score >= 0.65:
        return "medium"
    return "low"


# ---------- Rule evaluation ----------

def evaluate_scheme(scheme: Scheme, profile: Dict[str, Any]) -> Dict[str, Any]:
    issues, missing, reasons = [], [], []

    # AGE
    if not profile.get("age"):
        missing.append("age")
    else:
        age = profile["age"]
        if scheme.min_age and age < scheme.min_age:
            issues.append({"field": "age", "min": scheme.min_age})
        elif scheme.max_age and age > scheme.max_age:
            issues.append({"field": "age", "max": scheme.max_age})
        else:
            reasons.append({"field": "age", "value": age})

    # INCOME
    if scheme.max_income:
        if not profile.get("annual_income"):
            missing.append("income")
        elif profile["annual_income"] > scheme.max_income:
            issues.append({"field": "income", "max": scheme.max_income})
        else:
            reasons.append({"field": "income", "value": profile["annual_income"]})

    # CATEGORY
    if scheme.eligible_categories:
        if not profile.get("category"):
            missing.append("category")
        elif profile["category"] not in scheme.eligible_categories:
            issues.append({"field": "category"})
        else:
            reasons.append({"field": "category", "value": profile["category"]})

    # GENDER
    if scheme.eligible_genders:
        if not profile.get("gender"):
            missing.append("gender")
        elif profile["gender"] not in scheme.eligible_genders:
            issues.append({"field": "gender"})
        else:
            reasons.append({"field": "gender", "value": profile["gender"]})

    # BUSINESS STATUS
    if scheme.eligible_business_status:
        if not profile.get("business_status"):
            missing.append("businessStatus")
        elif profile["business_status"] not in scheme.eligible_business_status:
            issues.append({"field": "businessStatus"})
        else:
            reasons.append({"field": "businessStatus", "value": profile["business_status"]})

    if issues:
        status = "not_eligible"
    elif missing:
        status = "need_info"
    else:
        status = "eligible"

    # SCORE + factor breakdown
    factors = [
        ("category", WEIGHTS["category"], _category_fit(profile, scheme)),
        ("income", WEIGHTS["income"], _income_fit(profile, scheme)),
        ("age", WEIGHTS["age"], _age_fit(profile, scheme)),
        ("status", WEIGHTS["status"], _status_fit(profile, scheme)),
        ("subsidy", WEIGHTS["subsidy"], _subsidy_fit(scheme)),
        ("cost_fit", WEIGHTS["cost_fit"], _cost_fit(profile, scheme)),
        ("semantic", WEIGHTS["semantic"], _semantic_score(profile, scheme)),
        ("district_fit", WEIGHTS["district_fit"], _district_fit(profile, scheme)),
    ]

    if status == "eligible":
        total_w = sum(w for _, w, _ in factors)
        raw = sum(w * s for _, w, s in factors) / total_w
        score = round(50 + raw * 50)
    elif status == "need_info":
        partial = [
            ("category", WEIGHTS["category"], _category_fit(profile, scheme)),
            ("subsidy", WEIGHTS["subsidy"], _subsidy_fit(scheme)),
            ("semantic", WEIGHTS["semantic"], _semantic_score(profile, scheme)),
        ]
        total_w = sum(w for _, w, _ in partial)
        raw = sum(w * s for _, w, s in partial) / total_w
        score = round(30 + raw * 30)
    else:
        score = 0

    # factor breakdown for UI
    total_weight = sum(w for _, w, _ in factors)
    factor_breakdown = [
        {
            "factor": name,
            "weight": w,
            "value": round(s, 3),
            "contribution": round(w * s, 2),
            "max_contribution": w,
        }
        for name, w, s in factors
    ]

    confidence = _confidence(profile, scheme)

    return {
        "status": status,
        "score": score,
        "confidence": confidence,
        "confidence_label": _confidence_label(confidence),
        "issues": issues,
        "reasons": reasons,
        "missing": missing,
        "factor_breakdown": factor_breakdown,
        "total_weight": total_weight,
    }


# ---------- Ranking with diversity ----------

def rank_schemes(schemes: List[Scheme], profile: Dict[str, Any],
                 diversity: bool = True) -> List[Dict[str, Any]]:
    """Rank schemes. If diversity=True, ensure top-8 don't have more than 2 of same category."""
    results = [{"scheme": s, **evaluate_scheme(s, profile)} for s in schemes]

    order = {"eligible": 0, "need_info": 1, "not_eligible": 2}
    results.sort(key=lambda r: (order[r["status"]], -r["score"]))

    if not diversity:
        return results

    # Diversity: prefer top-8 to have mixed categories
    top = results[:8]
    rest = results[8:]

    by_cat: Dict[str, list] = {}
    for r in top:
        by_cat.setdefault(r["scheme"].category, []).append(r)

    diversified = []
    used_cats: Dict[str, int] = {}
    for cat in sorted(by_cat.keys(), key=lambda c: -len(by_cat[c])):
        bucket = by_cat[cat]
        # take at most 2 from each category in the top-8
        take = bucket[:2]
        diversified.extend(take)
        for r in bucket:
            if r not in diversified:
                rest.insert(0, r)

    # sort diversified by original rank order
    diversified.sort(key=lambda r: (order[r["status"]], -r["score"]))

    return diversified + [r for r in results if r not in diversified]