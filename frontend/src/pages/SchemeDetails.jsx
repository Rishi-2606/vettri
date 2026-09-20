import { useParams, Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { api } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

function getFundingSourceKey(dept) {
  if (!dept) return "govt_department";
  const text = [dept.en || "", dept.ta || "", dept.hi || ""]
    .join(" ")
    .toLowerCase();
  if (text.includes("nabard") || text.includes("sidbi") || text.includes("mudra")) {
    return "govt_financial_institution";
  }
  if (
    text.includes("ministry") ||
    text.includes("department") ||
    text.includes("government") ||
    text.includes("govt") ||
    text.includes("board")
  ) {
    return "govt_department";
  }
  return "govt_department";
}

export default function SchemeDetails() {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const lang = i18n.resolvedLanguage || "en";

  const [scheme, setScheme] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .getScheme(slug)
      .then((s) => {
        if (!cancelled) setScheme(s);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  // Fetch profile if user is logged in
  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }
    api
      .getProfile()
      .then((p) => setProfile(p))
      .catch(() => setProfile(null));
  }, [user]);

  if (loading) {
    return (
      <section className="container" style={{ padding: "60px 24px" }}>
        <p style={{ color: "var(--color-muted)" }}>Loading scheme...</p>
      </section>
    );
  }

  if (error || !scheme) {
    return (
      <section className="container" style={{ padding: "60px 24px" }}>
        <h1>{t("scheme.not_found")}</h1>
        <Link to="/schemes" className="btn btn-ghost" style={{ marginTop: 16 }}>
          ← {t("scheme.back")}
        </Link>
      </section>
    );
  }

  const name = scheme.name?.[lang] || scheme.name?.en || scheme.short_name;
  const dept = scheme.department?.[lang] || scheme.department?.en || "";
  const desc = scheme.description?.[lang] || scheme.description?.en || "";

  function handleCheckEligibility() {
    navigate("/recommendations");
  }

  // -------- Max Subsidy Amount (ceiling) --------
  const maxSubsidyAmount =
    scheme.max_loan && scheme.subsidy_percent
      ? Math.round((scheme.max_loan * scheme.subsidy_percent) / 100)
      : null;

  // -------- Eligible Loan Amount (dynamic) --------
  // Logic:
  //   1. If user's project cost is known:
  //      subsidy_for_project = min(project_cost * subsidy%, max_subsidy_amount)
  //      loan_gap = project_cost - subsidy_for_project
  //      eligible_loan = min(max_loan, loan_gap)
  //   2. If no project cost, fall back to scheme's max loan
  const eligibleLoanAmount = (() => {
    if (!scheme.max_loan) return null;

    const projectCost = Number(profile?.project_cost) || 0;

    if (!projectCost || projectCost <= 0) {
      return scheme.max_loan;
    }

    const subsidyPct = scheme.subsidy_percent || 0;
    const subsidyForProject = subsidyPct
      ? Math.min(
          Math.round((projectCost * subsidyPct) / 100),
          maxSubsidyAmount ?? Infinity
        )
      : 0;

    const loanGap = Math.max(0, projectCost - subsidyForProject);
    return Math.min(scheme.max_loan, loanGap);
  })();

  const fundingKey = getFundingSourceKey(scheme.department);
  const affordabilityUrl = `/affordability?scheme=${scheme.slug}`;

  return (
    <section
      className="container"
      style={{ padding: "60px 24px", maxWidth: 900 }}
    >
      <Link to="/schemes" style={{ fontSize: 13, color: "var(--color-muted)" }}>
        ← {t("scheme.back")}
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ marginTop: 16 }}
      >
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1,
            color: "var(--color-gold-700)",
            textTransform: "uppercase",
          }}
        >
          {scheme.short_name}
        </div>
        <h1 style={{ marginTop: 6 }}>{name}</h1>
        <div style={{ color: "var(--color-muted)", fontSize: 14 }}>{dept}</div>
      </motion.div>

      <p style={{ marginTop: 20, fontSize: 15, lineHeight: 1.7 }}>{desc}</p>

      {/* Benefits */}
      <div className="form-section">
        <h2>{t("scheme.benefits")}</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 14,
            marginTop: 12,
          }}
        >
          {scheme.max_loan ? (
            <InfoTile
              label={t("scheme.max_loan")}
              value={`₹${scheme.max_loan.toLocaleString("en-IN")}`}
            />
          ) : null}
          {scheme.interest_rate ? (
            <InfoTile
              label={t("scheme.interest_rate")}
              value={scheme.interest_rate}
            />
          ) : null}
          {scheme.subsidy_percent > 0 ? (
            <InfoTile
              label={t("scheme.subsidy")}
              value={`${scheme.subsidy_percent}%`}
            />
          ) : null}
          {maxSubsidyAmount ? (
            <InfoTile
              label={t("scheme.max_subsidy_amount")}
              value={`₹${maxSubsidyAmount.toLocaleString("en-IN")}`}
            />
          ) : null}
          {eligibleLoanAmount ? (
            <InfoTile
              label={t("scheme.eligible_loan_amount")}
              value={`₹${eligibleLoanAmount.toLocaleString("en-IN")}`}
              highlight
            />
          ) : null}
          {scheme.moratorium ? (
            <InfoTile
              label={t("scheme.moratorium")}
              value={scheme.moratorium}
            />
          ) : null}
          {scheme.repayment_years ? (
            <InfoTile
              label={t("scheme.repayment")}
              value={scheme.repayment_years}
            />
          ) : null}
          <InfoTile
            label={t("scheme.funding_source")}
            value={t(`scheme.${fundingKey}`)}
          />
        </div>

        {eligibleLoanAmount && profile?.project_cost ? (
          <p
            style={{
              fontSize: 12,
              color: "var(--color-muted)",
              marginTop: 12,
              fontStyle: "italic",
            }}
          >
            {t("scheme.eligible_loan_hint", {
              projectCost: `₹${Number(profile.project_cost).toLocaleString("en-IN")}`,
            })}
          </p>
        ) : null}
      </div>

      {/* Eligibility */}
      <div className="form-section">
        <h2>{t("scheme.eligibility")}</h2>
        <ul
          style={{
            lineHeight: 1.9,
            color: "var(--color-muted)",
            fontSize: 14,
          }}
        >
          {(scheme.min_age || scheme.max_age) && (
            <li>
              <strong>{t("scheme.age")}:</strong> {scheme.min_age ?? "—"}
              {scheme.max_age ? ` – ${scheme.max_age}` : "+"}
            </li>
          )}
          {scheme.max_income && (
            <li>
              <strong>{t("scheme.income")}:</strong> ≤ ₹
              {scheme.max_income.toLocaleString("en-IN")}
            </li>
          )}
          {scheme.eligible_categories && (
            <li>
              <strong>{t("scheme.category")}:</strong>{" "}
              {scheme.eligible_categories.join(", ")}
            </li>
          )}
          {scheme.eligible_genders && (
            <li>
              <strong>{t("scheme.gender")}:</strong>{" "}
              {scheme.eligible_genders.join(", ")}
            </li>
          )}
          {scheme.eligible_business_status && (
            <li>
              <strong>{t("scheme.business_status")}:</strong>{" "}
              {scheme.eligible_business_status.join(", ")}
            </li>
          )}
          {scheme.education && (
            <li>
              <strong>{t("scheme.education")}:</strong> {scheme.education}
            </li>
          )}
        </ul>
      </div>

      {/* Documents */}
      {scheme.documents && scheme.documents.length > 0 && (
        <div className="form-section">
          <h2>{t("scheme.documents")}</h2>
          <ul style={{ lineHeight: 1.9, fontSize: 14 }}>
            {scheme.documents.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="form-actions">
        <button className="btn btn-primary" onClick={handleCheckEligibility}>
          {t("scheme.check_eligibility")}
        </button>

        <Link to={`/checklist/${scheme.slug}`} className="btn btn-ghost">
          📄 {t("scheme.checklist_btn")}
        </Link>

        {scheme.max_loan ? (
          <Link to={affordabilityUrl} className="btn btn-ghost">
            💰 {t("scheme.check_affordability")}
          </Link>
        ) : null}

        {scheme.source_url && (
          <a
            className="btn btn-ghost"
            href={scheme.source_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("scheme.official_source")} ↗
          </a>
        )}
      </div>

      {scheme.last_verified && (
        <div
          style={{
            marginTop: 20,
            fontSize: 12,
            color: "var(--color-muted)",
          }}
        >
          {t("scheme.last_verified")}: {scheme.last_verified}
        </div>
      )}
    </section>
  );
}

function InfoTile({ label, value, highlight }) {
  return (
    <div
      style={{
        background: highlight
          ? "linear-gradient(135deg, rgba(212, 175, 55, 0.10), rgba(246, 214, 122, 0.18))"
          : "var(--color-paper)",
        border: highlight
          ? "1px solid rgba(212, 175, 55, 0.55)"
          : "1px solid #00000010",
        borderRadius: "var(--radius-md)",
        padding: "12px 14px",
        boxShadow: highlight ? "0 4px 14px rgba(212, 175, 55, 0.18)" : "none",
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: highlight ? "var(--color-gold-700)" : "var(--color-muted)",
          letterSpacing: 0.5,
          fontWeight: highlight ? 700 : 500,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 15,
          fontWeight: 700,
          marginTop: 4,
          color: highlight ? "var(--color-navy-900)" : "inherit",
        }}
      >
        {value}
      </div>
    </div>
  );
}