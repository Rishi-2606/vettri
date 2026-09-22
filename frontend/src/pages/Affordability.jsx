import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { api } from "../services/api.js";

const VERDICT_STYLES = {
  comfortable: { bg: "#E6F4EA", color: "#046A38", border: "#1E9E63", icon: "✅" },
  manageable: { bg: "#FFF7E0", color: "#8C6B1F", border: "#D4AF37", icon: "⚠️" },
  risky: { bg: "#FDECEC", color: "#B42318", border: "#B42318", icon: "⛔" },
};

function parseFirstNumber(str) {
  if (!str) return null;
  const match = String(str).match(/(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : null;
}

function parseTenureRange(str) {
  if (!str) return { min: 1, max: 30, isRange: false, isFixed: false };
  const s = String(str).trim().toLowerCase();

  const monthsMatch = s.match(/^(\d+)\s*months?$/);
  if (monthsMatch) {
    const years = Math.max(1, Math.ceil(parseInt(monthsMatch[1], 10) / 12));
    return { min: years, max: years, isRange: false, isFixed: true };
  }

  const rangeMatch = s.match(/(\d+)\s*(?:–|-|to)\s*(\d+)\s*years?/);
  if (rangeMatch) {
    const a = parseInt(rangeMatch[1], 10);
    const b = parseInt(rangeMatch[2], 10);
    const min = Math.max(1, Math.min(a, b));
    const max = Math.max(a, b);
    return { min, max, isRange: true, isFixed: false };
  }

  const singleMatch = s.match(/^(\d+)\s*years?/);
  if (singleMatch) {
    const v = Math.max(1, parseInt(singleMatch[1], 10));
    return { min: v, max: v, isRange: false, isFixed: true };
  }

  return { min: 1, max: 30, isRange: false, isFixed: false };
}

export default function Affordability() {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const schemeSlug = searchParams.get("scheme");
  const lang = i18n.resolvedLanguage || "en";

  const [scheme, setScheme] = useState(null);
  const [schemeLoading, setSchemeLoading] = useState(!!schemeSlug);

  const [form, setForm] = useState({
    loan_amount: "",
    interest_rate: "10",
    tenure_years: "5",
    monthly_income: "",
    monthly_expenses: "",
    existing_obligations: "0",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!schemeSlug) {
      setSchemeLoading(false);
      return;
    }
    api
      .getScheme(schemeSlug)
      .then((s) => {
        setScheme(s);
        const rate = parseFirstNumber(s.interest_rate) || 10;
        const tenure = parseTenureRange(s.repayment_years);
        setForm((f) => ({
          ...f,
          loan_amount: String(s.max_loan || ""),
          interest_rate: String(rate),
          tenure_years: String(tenure.max),
        }));
      })
      .catch(() => {})
      .finally(() => setSchemeLoading(false));
  }, [schemeSlug]);

  useEffect(() => {
    api
      .getProfile()
      .then((p) => {
        if (p && p.annual_income) {
          setForm((f) => ({
            ...f,
            monthly_income: String(Math.round(p.annual_income / 12)),
          }));
        }
      })
      .catch(() => {});
  }, []);

  const tenureRange = useMemo(() => {
    if (!scheme) return { min: 1, max: 30, isRange: false, isFixed: false };
    return parseTenureRange(scheme.repayment_years);
  }, [scheme]);

  // Dynamic subsidy amount (only if scheme has subsidy)
  const subsidyAmount = useMemo(() => {
    if (!scheme || !scheme.subsidy_percent) return 0;
    const loan = Number(form.loan_amount) || 0;
    if (!loan) return 0;
    // Cap subsidy at max_subsidy_amount if derived
    const raw = (loan * scheme.subsidy_percent) / 100;
    return Math.round(raw);
  }, [scheme, form.loan_amount]);

  const hasSubsidy = scheme && scheme.subsidy_percent > 0;

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setError(null);
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    setResult(null);

    const t = Number(form.tenure_years);
    if (scheme) {
      if (t < tenureRange.min || t > tenureRange.max) {
        setError(
          i18n.t("afford.err_tenure_range", {
            min: tenureRange.min,
            max: tenureRange.max,
          })
        );
        return;
      }
    }

    setLoading(true);
    try {
      const payload = {
        loan_amount: Number(form.loan_amount),
        interest_rate: Number(form.interest_rate),
        tenure_years: t,
        moratorium_months: 0,
        monthly_income: Number(form.monthly_income),
        monthly_expenses: Number(form.monthly_expenses) || 0,
        existing_obligations: Number(form.existing_obligations) || 0,
      };
      const res = await api.affordability(payload);
      // Attach subsidy to result
      setResult({
        ...res,
        subsidy_amount: subsidyAmount,
        subsidy_percent: scheme?.subsidy_percent || 0,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const schemeName = scheme
    ? scheme.name?.[lang] || scheme.name?.en || scheme.short_name
    : null;

  const tenureHint = useMemo(() => {
    if (!scheme) return "";
    if (tenureRange.isFixed) {
      return i18n.t("afford.tenure_fixed_hint", { years: tenureRange.max });
    }
    if (tenureRange.isRange) {
      return i18n.t("afford.tenure_range_hint", {
        min: tenureRange.min,
        max: tenureRange.max,
      });
    }
    return i18n.t("afford.tenure_flexible_hint");
  }, [scheme, tenureRange, i18n]);

  // Net cost after subsidy
  const netCost = result ? Math.max(0, result.total_payment - (result.subsidy_amount || 0)) : 0;

  return (
    <section
      className="container"
      style={{ padding: "60px 24px", maxWidth: 1000 }}
    >
      <motion.h1
        className="admin-page-title"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {t("afford.title")}
      </motion.h1>
      <p style={{ color: "var(--color-muted)", marginBottom: 24, maxWidth: 640 }}>
        {t("afford.subtitle")}
      </p>

      {/* Scheme banner */}
      {schemeLoading ? (
        <p style={{ color: "var(--color-muted)" }}>Loading scheme...</p>
      ) : scheme ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="afford-scheme-banner"
        >
          <div className="afford-scheme-short">{scheme.short_name}</div>
          <div className="afford-scheme-name">{schemeName}</div>
          <div className="afford-scheme-stats">
            <div>
              <span>{t("afford.scheme_max_loan")}</span>
              <strong>₹{(scheme.max_loan || 0).toLocaleString("en-IN")}</strong>
            </div>
            <div>
              <span>{t("afford.scheme_rate")}</span>
              <strong>{scheme.interest_rate || "—"}</strong>
            </div>
            <div>
              <span>{t("afford.scheme_tenure")}</span>
              <strong>{scheme.repayment_years || "—"}</strong>
            </div>
            {scheme.subsidy_percent > 0 && (
              <div>
                <span>{t("afford.scheme_subsidy")}</span>
                <strong>{scheme.subsidy_percent}%</strong>
              </div>
            )}
          </div>
        </motion.div>
      ) : null}

      <div className="afford-layout">
        {/* FORM */}
        <motion.form
          onSubmit={onSubmit}
          className="card"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          style={{ padding: 24 }}
        >
          <h2 style={{ fontSize: 16 }}>{t("afford.loan_section")}</h2>
          <div className="form-grid">
            <Field label={t("afford.loan_amount") + " (₹)"}>
              <input
                type="number"
                min="1000"
                step="any"
                required
                value={form.loan_amount}
                onChange={(e) => update("loan_amount", e.target.value)}
                placeholder="e.g. 500000"
              />
            </Field>

            <Field label={t("afford.interest_rate") + " (%)"}>
              <input
                type="number"
                min="0"
                max="50"
                step="0.1"
                required
                value={form.interest_rate}
                onChange={(e) => update("interest_rate", e.target.value)}
                readOnly={!!scheme}
                style={scheme ? { background: "#F5F1E8", cursor: "not-allowed" } : undefined}
              />
              {scheme && (
                <span className="field-hint">{t("afford.rate_from_scheme")}</span>
              )}
            </Field>

            <Field label={t("afford.tenure_years")}>
              <input
                type="number"
                min={scheme ? tenureRange.min : 1}
                max={scheme ? tenureRange.max : 30}
                step="1"
                required
                value={form.tenure_years}
                onChange={(e) => update("tenure_years", e.target.value)}
              />
              {scheme && <span className="field-hint">{tenureHint}</span>}
            </Field>

            {/* NEW: Subsidy field (only if scheme has subsidy) */}
            {hasSubsidy && (
              <Field label={t("afford.subsidy_amount") + " (₹)"}>
                <input
                  type="text"
                  readOnly
                  value={subsidyAmount.toLocaleString("en-IN")}
                  style={{
                    background: "linear-gradient(135deg, rgba(212, 175, 55, 0.10), rgba(246, 214, 122, 0.18))",
                    cursor: "not-allowed",
                    fontWeight: 700,
                    color: "var(--color-gold-700)",
                    border: "1px solid rgba(212, 175, 55, 0.45)",
                  }}
                />
                <span className="field-hint">
                  {t("afford.subsidy_from_scheme", {
                    percent: scheme.subsidy_percent,
                  })}
                </span>
              </Field>
            )}
          </div>

          <h2 style={{ fontSize: 16, marginTop: 24 }}>
            {t("afford.income_section")}
          </h2>
          <div className="form-grid">
            <Field label={t("afford.monthly_income") + " (₹)"}>
              <input
                type="number"
                min="1"
                step="any"
                required
                value={form.monthly_income}
                onChange={(e) => update("monthly_income", e.target.value)}
                placeholder="e.g. 30000"
              />
            </Field>
            <Field label={t("afford.monthly_expenses") + " (₹)"}>
              <input
                type="number"
                min="0"
                step="any"
                value={form.monthly_expenses}
                onChange={(e) => update("monthly_expenses", e.target.value)}
                placeholder="e.g. 15000"
              />
            </Field>
            <Field label={t("afford.existing_obligations") + " (₹)"}>
              <input
                type="number"
                min="0"
                step="any"
                value={form.existing_obligations}
                onChange={(e) => update("existing_obligations", e.target.value)}
                placeholder="e.g. 0"
              />
            </Field>
          </div>

          {error && (
            <div className="error-box" style={{ marginTop: 16 }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary admin-btn-glow"
            disabled={loading}
            style={{ marginTop: 20, width: "100%", justifyContent: "center" }}
          >
            {loading ? "..." : t("afford.calculate")}
          </button>

          <p
            style={{
              fontSize: 11,
              color: "var(--color-muted)",
              marginTop: 12,
              lineHeight: 1.5,
            }}
          >
            {t("afford.disclaimer")}
          </p>
        </motion.form>

        {/* RESULTS */}
        <div>
          {!result && (
            <div
              className="card"
              style={{
                padding: 32,
                textAlign: "center",
                color: "var(--color-muted)",
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 12 }}>💰</div>
              <p>{t("afford.empty_hint")}</p>
            </div>
          )}

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{ display: "flex", flexDirection: "column", gap: 14 }}
            >
              {/* Verdict */}
              <div
                className="card"
                style={{
                  padding: 20,
                  background: VERDICT_STYLES[result.verdict].bg,
                  borderLeft: `5px solid ${VERDICT_STYLES[result.verdict].border}`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 32 }}>
                    {VERDICT_STYLES[result.verdict].icon}
                  </span>
                  <div>
                    <div
                      style={{
                        fontSize: 12,
                        letterSpacing: 1,
                        color: "var(--color-muted)",
                        textTransform: "uppercase",
                      }}
                    >
                      {t("afford.verdict")}
                    </div>
                    <div
                      style={{
                        fontSize: 22,
                        fontWeight: 700,
                        color: VERDICT_STYLES[result.verdict].color,
                      }}
                    >
                      {t(`afford.verdict_${result.verdict}`)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Reasons */}
              {result.reasons && result.reasons.length > 0 && (
                <div className="card" style={{ padding: 20 }}>
                  <h3 style={{ fontSize: 14, marginBottom: 12 }}>
                    {t("afford.why_result")}
                  </h3>
                  <ul className="afford-reasons">
                    {result.reasons.map((r, i) => (
                      <li key={i}>{t(`afford.${r.key}`, { value: r.value })}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Key numbers */}
              <div className="card" style={{ padding: 20 }}>
                <ResultRow
                  label={t("afford.emi")}
                  value={`₹${result.emi.toLocaleString("en-IN")}`}
                  bold
                />
                <ResultRow
                  label={t("afford.dscr")}
                  value={result.dscr.toFixed(2)}
                  bold
                />
                <ResultRow
                  label={t("afford.monthly_surplus")}
                  value={`₹${result.monthly_surplus.toLocaleString("en-IN")}`}
                  positive={result.monthly_surplus >= 0}
                />
                <ResultRow
                  label={t("afford.net_income")}
                  value={`₹${result.net_monthly_income.toLocaleString("en-IN")}`}
                />
              </div>

              {/* Breakdown */}
              <div className="card" style={{ padding: 20 }}>
                <h3 style={{ fontSize: 14, marginBottom: 12 }}>
                  {t("afford.breakdown")}
                </h3>
                <ResultRow
                  label={t("afford.total_payment")}
                  value={`₹${result.total_payment.toLocaleString("en-IN")}`}
                />
                {result.subsidy_amount > 0 && (
                  <ResultRow
                    label={t("afford.subsidy_benefit")}
                    value={`− ₹${result.subsidy_amount.toLocaleString("en-IN")}`}
                    highlight
                  />
                )}
                {result.subsidy_amount > 0 && (
                  <ResultRow
                    label={t("afford.net_cost_after_subsidy")}
                    value={`₹${netCost.toLocaleString("en-IN")}`}
                    bold
                  />
                )}
                <ResultRow
                  label={t("afford.total_interest")}
                  value={`₹${result.total_interest.toLocaleString("en-IN")}`}
                />
                <ResultRow
                  label={t("afford.tenure_months")}
                  value={result.tenure_months}
                />
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div style={{ marginTop: 32 }}>
        <Link to="/schemes" className="btn btn-ghost">
          ← {t("afford.back_to_schemes")}
        </Link>
      </div>
    </section>
  );
}

function Field({ label, children }) {
  return (
    <div className="field">
      <label>{label}</label>
      {children}
    </div>
  );
}

function ResultRow({ label, value, bold, positive, highlight }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px 0",
        borderBottom: "1px solid rgba(0,0,0,0.05)",
        fontSize: 14,
      }}
    >
      <span
        style={{
          color: highlight ? "var(--color-gold-700)" : "var(--color-muted)",
          fontWeight: highlight ? 600 : 400,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontWeight: bold ? 700 : highlight ? 600 : 500,
          color:
            highlight
              ? "var(--color-gold-700)"
              : positive === false
                ? "#B42318"
                : positive === true
                  ? "#046A38"
                  : "inherit",
        }}
      >
        {value}
      </span>
    </div>
  );
}