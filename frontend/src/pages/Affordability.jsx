import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { api } from "../services/api.js";

const VERDICT_STYLES = {
  comfortable: { bg: "#E6F4EA", color: "#046A38", border: "#1E9E63", icon: "✅" },
  manageable: { bg: "#FFF7E0", color: "#8C6B1F", border: "#D4AF37", icon: "⚠️" },
  risky: { bg: "#FDECEC", color: "#B42318", border: "#B42318", icon: "⛔" },
};

export default function Affordability() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();

  const [form, setForm] = useState({
    loan_amount: searchParams.get("loan") || "",
    interest_rate: searchParams.get("rate") || "10",
    tenure_years: "5",
    moratorium_months: "0",
    monthly_income: "",
    monthly_expenses: "",
    existing_obligations: "0",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pre-fill monthly income from profile
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

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setError(null);
  }

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const payload = {
        loan_amount: Number(form.loan_amount),
        interest_rate: Number(form.interest_rate),
        tenure_years: Number(form.tenure_years),
        moratorium_months: Number(form.moratorium_months) || 0,
        monthly_income: Number(form.monthly_income),
        monthly_expenses: Number(form.monthly_expenses) || 0,
        existing_obligations: Number(form.existing_obligations) || 0,
      };
      const res = await api.affordability(payload);
      setResult(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

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
      <p
        style={{
          color: "var(--color-muted)",
          marginBottom: 24,
          maxWidth: 620,
        }}
      >
        {t("afford.subtitle")}
      </p>

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
              />
            </Field>
            <Field label={t("afford.tenure_years")}>
              <input
                type="number"
                min="1"
                max="30"
                step="1"
                required
                value={form.tenure_years}
                onChange={(e) => update("tenure_years", e.target.value)}
              />
            </Field>
            <Field label={t("afford.moratorium_months")}>
              <input
                type="number"
                min="0"
                max="24"
                step="1"
                value={form.moratorium_months}
                onChange={(e) => update("moratorium_months", e.target.value)}
              />
            </Field>
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
                onChange={(e) =>
                  update("existing_obligations", e.target.value)
                }
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
            style={{
              marginTop: 20,
              width: "100%",
              justifyContent: "center",
            }}
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
                <div
                  style={{ display: "flex", alignItems: "center", gap: 12 }}
                >
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
                <ResultRow
                  label={t("afford.total_interest")}
                  value={`₹${result.total_interest.toLocaleString("en-IN")}`}
                />
                {result.moratorium_interest > 0 && (
                  <ResultRow
                    label={t("afford.moratorium_interest")}
                    value={`₹${result.moratorium_interest.toLocaleString("en-IN")}`}
                  />
                )}
                <ResultRow
                  label={t("afford.tenure_months")}
                  value={result.tenure_months}
                />
              </div>

              {/* Tips based on verdict */}
              <div
                className="card"
                style={{
                  padding: 16,
                  fontSize: 13,
                  color: "var(--color-muted)",
                }}
              >
                {result.verdict === "comfortable" &&
                  t("afford.tip_comfortable")}
                {result.verdict === "manageable" &&
                  t("afford.tip_manageable")}
                {result.verdict === "risky" && t("afford.tip_risky")}
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

function ResultRow({ label, value, bold, positive }) {
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
      <span style={{ color: "var(--color-muted)" }}>{label}</span>
      <span
        style={{
          fontWeight: bold ? 700 : 500,
          color:
            positive === false
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