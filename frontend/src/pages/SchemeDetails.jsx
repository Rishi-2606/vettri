import { useParams, Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { api } from "../services/api.js";

export default function SchemeDetails() {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const lang = i18n.resolvedLanguage || "en";

  const [scheme, setScheme] = useState(null);
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

  // Build affordability link with prefilled query params
  const affordabilityUrl = (() => {
    const params = new URLSearchParams();
    if (scheme.max_loan) params.set("loan", scheme.max_loan);
    if (scheme.interest_rate) {
      const match = scheme.interest_rate.match(/(\d+(?:\.\d+)?)/);
      if (match) params.set("rate", match[1]);
    }
    const qs = params.toString();
    return `/affordability${qs ? `?${qs}` : ""}`;
  })();

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
        </div>
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

function InfoTile({ label, value }) {
  return (
    <div
      style={{
        background: "var(--color-paper)",
        border: "1px solid #00000010",
        borderRadius: "var(--radius-md)",
        padding: "12px 14px",
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: "var(--color-muted)",
          letterSpacing: 0.5,
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 15, fontWeight: 700, marginTop: 4 }}>{value}</div>
    </div>
  );
}