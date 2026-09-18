import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function SchemeCard({ scheme }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage || "en";

  const name = scheme.name?.[lang] || scheme.name?.en || scheme.short_name;
  const dept = scheme.department?.[lang] || scheme.department?.en || "";
  const desc = scheme.description?.[lang] || scheme.description?.en || "";

  return (
    <Link
      to={`/schemes/${scheme.slug}`}
      className="scheme-card"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 8,
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 1,
            color: "var(--color-gold-700)",
            textTransform: "uppercase",
          }}
        >
          {scheme.short_name}
        </span>
        <span
          style={{
            fontSize: 11,
            background: "var(--color-navy-100)",
            color: "var(--color-navy-800)",
            padding: "3px 8px",
            borderRadius: 999,
            fontWeight: 600,
          }}
        >
          {t(`schemes.cat_${scheme.category}`, scheme.category)}
        </span>
      </div>

      <h3 style={{ fontSize: 18, margin: 0, lineHeight: 1.3 }}>{name}</h3>

      <div style={{ fontSize: 12, color: "var(--color-muted)" }}>{dept}</div>

      <p
        style={{
          fontSize: 13,
          color: "var(--color-muted)",
          margin: 0,
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {desc}
      </p>

      <div
        style={{
          display: "flex",
          gap: 16,
          fontSize: 12,
          color: "var(--color-navy-800)",
          marginTop: 6,
          fontWeight: 600,
        }}
      >
        {scheme.max_loan ? (
          <span>
            ₹{(scheme.max_loan / 100000).toFixed(0)}L{" "}
            {t("schemes.max_loan_short")}
          </span>
        ) : null}
        {scheme.subsidy_percent > 0 && (
          <span style={{ color: "var(--color-emerald-600)" }}>
            {scheme.subsidy_percent}% {t("schemes.subsidy_short")}
          </span>
        )}
      </div>

      <div
        style={{
          marginTop: "auto",
          color: "var(--color-gold-700)",
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        {t("schemes.view_details")} →
      </div>
    </Link>
  );
}