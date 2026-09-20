import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { TN_DISTRICTS } from "../data/tnDistricts.js";
import { api } from "../services/api.js";

const EMPTY_PROFILE = {
  age: "",
  gender: "",
  category: "",
  district: "",
  annualIncome: "",
  education: "",
  businessStatus: "",
  businessIdea: "",
  businessCategory: "",
  projectCost: "",
  fundingRequired: "",
};

// -------- Option lists --------
// `value` = what goes to database (kept in English for AI matching)
// `key`   = translation key used for display only

const COMMUNITY_CATEGORIES = [
  { value: "General", key: "general" },
  { value: "OBC", key: "obc" },
  { value: "BC", key: "bc" },
  { value: "MBC", key: "mbc" },
  { value: "SC", key: "sc" },
  { value: "ST", key: "st" },
];

const EDUCATION_LEVELS = [
  { value: "Below 10th", key: "below_10th" },
  { value: "10th Pass", key: "10th_pass" },
  { value: "12th Pass", key: "12th_pass" },
  { value: "ITI / Diploma", key: "iti_diploma" },
  { value: "Undergraduate", key: "undergraduate" },
  { value: "Postgraduate", key: "postgraduate" },
  { value: "Other", key: "other" },
];

const BUSINESS_STATUS = [
  { value: "new", key: "businessStatus_new" },
  { value: "existing", key: "businessStatus_existing" },
];

const BUSINESS_CATEGORIES = [
  { value: "Manufacturing", key: "manufacturing" },
  { value: "Agriculture / Agri-processing", key: "agriculture" },
  { value: "Retail / Shop", key: "retail" },
  { value: "Food / Restaurant", key: "food" },
  { value: "Textile / Garments", key: "textile" },
  { value: "Handicrafts", key: "handicrafts" },
  { value: "Services", key: "services" },
  { value: "IT / Software", key: "it" },
  { value: "Transport", key: "transport" },
  { value: "Other", key: "other" },
];

export default function Profile() {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage || "en";

  const [form, setForm] = useState(EMPTY_PROFILE);
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    api
      .getProfile()
      .then((p) => {
        if (cancelled || !p) return;
        setForm({
          age: p.age ?? "",
          gender: p.gender ?? "",
          category: p.category ?? "",
          district: p.district ?? "",
          annualIncome: p.annual_income ?? "",
          education: p.education ?? "",
          businessStatus: p.business_status ?? "",
          businessIdea: p.business_idea ?? "",
          businessCategory: p.business_category ?? "",
          projectCost: p.project_cost ?? "",
          fundingRequired: p.funding_required ?? "",
        });
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const districtLabel = useMemo(
    () => (d) => (lang === "ta" ? d.ta : d.en),
    [lang]
  );

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field] || errors.form) {
      setErrors((e) => ({ ...e, [field]: undefined, form: undefined }));
    }
    setSaved(false);
  }

  function validate() {
    const e = {};
    if (!form.age || Number(form.age) < 18 || Number(form.age) > 100)
      e.age = t("profile.err_age");
    if (!form.gender) e.gender = t("profile.err_required");
    if (!form.category) e.category = t("profile.err_required");
    if (!form.district) e.district = t("profile.err_required");
    if (!form.annualIncome || Number(form.annualIncome) < 0)
      e.annualIncome = t("profile.err_income");
    if (!form.education) e.education = t("profile.err_required");
    if (!form.businessStatus) e.businessStatus = t("profile.err_required");
    if (!form.businessIdea.trim()) e.businessIdea = t("profile.err_required");
    if (!form.businessCategory) e.businessCategory = t("profile.err_required");
    if (!form.projectCost || Number(form.projectCost) < 0)
      e.projectCost = t("profile.err_cost");
    if (!form.fundingRequired || Number(form.fundingRequired) < 0)
      e.fundingRequired = t("profile.err_funding");
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(ev) {
    ev.preventDefault();
    if (!validate()) {
      const firstKey = Object.keys(errors)[0];
      if (firstKey) document.querySelector(`[name="${firstKey}"]`)?.focus();
      return;
    }
    setSubmitting(true);
    try {
      await api.saveProfile({
        age: Number(form.age),
        gender: form.gender,
        category: form.category,
        district: form.district,
        annual_income: Number(form.annualIncome),
        education: form.education,
        business_status: form.businessStatus,
        business_idea: form.businessIdea.trim(),
        business_category: form.businessCategory,
        project_cost: Number(form.projectCost),
        funding_required: Number(form.fundingRequired),
      });
      setSaved(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      setErrors({ form: e.message });
    } finally {
      setSubmitting(false);
    }
  }

  function onReset() {
    setForm(EMPTY_PROFILE);
    setErrors({});
    setSaved(false);
  }

  if (loading) {
    return (
      <section className="container" style={{ padding: "60px 24px" }}>
        <p style={{ color: "var(--color-muted)" }}>Loading profile...</p>
      </section>
    );
  }

  return (
    <section
      className="container"
      style={{ padding: "60px 24px", maxWidth: 900 }}
    >
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {t("profile.title")}
      </motion.h1>
      <p style={{ color: "var(--color-muted)" }}>{t("profile.subtitle")}</p>

      {saved && <div className="saved-banner">{t("profile.saved_message")}</div>}
      {errors.form && (
        <div className="error-box" style={{ marginTop: 16 }}>
          {errors.form}
        </div>
      )}

      <form onSubmit={onSubmit} noValidate>
        {/* ---------- PERSONAL ---------- */}
        <div className="form-section">
          <h2>{t("profile.section_personal")}</h2>
          <p className="hint">{t("profile.section_personal_hint")}</p>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="age">{t("profile.age")} *</label>
              <input
                id="age"
                name="age"
                type="number"
                min="18"
                max="100"
                value={form.age}
                onChange={(e) => update("age", e.target.value)}
                placeholder="18 – 100"
              />
              {errors.age && <span className="error">{errors.age}</span>}
            </div>

            <div className="field">
              <label htmlFor="gender">{t("profile.gender")} *</label>
              <select
                id="gender"
                name="gender"
                value={form.gender}
                onChange={(e) => update("gender", e.target.value)}
              >
                <option value="">{t("profile.select_placeholder")}</option>
                <option value="female">{t("profile.gender_female")}</option>
                <option value="male">{t("profile.gender_male")}</option>
                <option value="other">{t("profile.gender_other")}</option>
              </select>
              {errors.gender && <span className="error">{errors.gender}</span>}
            </div>

            <div className="field">
              <label htmlFor="category">{t("profile.category")} *</label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
              >
                <option value="">{t("profile.select_placeholder")}</option>
                {COMMUNITY_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {t(`profile.comcat_${c.key}`)}
                  </option>
                ))}
              </select>
              {errors.category && (
                <span className="error">{errors.category}</span>
              )}
            </div>
          </div>
        </div>

        {/* ---------- LOCATION ---------- */}
        <div className="form-section">
          <h2>{t("profile.section_location")}</h2>
          <p className="hint">{t("profile.section_location_hint")}</p>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="district">{t("profile.district")} *</label>
              <select
                id="district"
                name="district"
                value={form.district}
                onChange={(e) => update("district", e.target.value)}
              >
                <option value="">{t("profile.select_placeholder")}</option>
                {TN_DISTRICTS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {districtLabel(d)}
                  </option>
                ))}
              </select>
              {errors.district && (
                <span className="error">{errors.district}</span>
              )}
            </div>
          </div>
        </div>

        {/* ---------- FINANCIAL ---------- */}
        <div className="form-section">
          <h2>{t("profile.section_financial")}</h2>
          <p className="hint">{t("profile.section_financial_hint")}</p>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="annualIncome">{t("profile.annualIncome")} *</label>
              <input
                id="annualIncome"
                name="annualIncome"
                type="number"
                min="0"
                step="any"
                value={form.annualIncome}
                onChange={(e) => update("annualIncome", e.target.value)}
                placeholder="₹ e.g. 250000"
              />
              {errors.annualIncome && (
                <span className="error">{errors.annualIncome}</span>
              )}
            </div>

            <div className="field">
              <label htmlFor="education">{t("profile.education")} *</label>
              <select
                id="education"
                name="education"
                value={form.education}
                onChange={(e) => update("education", e.target.value)}
              >
                <option value="">{t("profile.select_placeholder")}</option>
                {EDUCATION_LEVELS.map((ed) => (
                  <option key={ed.value} value={ed.value}>
                    {t(`profile.edu_${ed.key}`)}
                  </option>
                ))}
              </select>
              {errors.education && (
                <span className="error">{errors.education}</span>
              )}
            </div>
          </div>
        </div>

        {/* ---------- BUSINESS ---------- */}
        <div className="form-section">
          <h2>{t("profile.section_business")}</h2>
          <p className="hint">{t("profile.section_business_hint")}</p>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="businessStatus">
                {t("profile.businessStatus")} *
              </label>
              <select
                id="businessStatus"
                name="businessStatus"
                value={form.businessStatus}
                onChange={(e) => update("businessStatus", e.target.value)}
              >
                <option value="">{t("profile.select_placeholder")}</option>
                {BUSINESS_STATUS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {t(`profile.${s.key}`)}
                  </option>
                ))}
              </select>
              {errors.businessStatus && (
                <span className="error">{errors.businessStatus}</span>
              )}
            </div>

            <div className="field">
              <label htmlFor="businessCategory">
                {t("profile.businessCategory")} *
              </label>
              <select
                id="businessCategory"
                name="businessCategory"
                value={form.businessCategory}
                onChange={(e) => update("businessCategory", e.target.value)}
              >
                <option value="">{t("profile.select_placeholder")}</option>
                {BUSINESS_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {t(`profile.bizcat_${c.key}`)}
                  </option>
                ))}
              </select>
              {errors.businessCategory && (
                <span className="error">{errors.businessCategory}</span>
              )}
            </div>

            <div className="field full">
              <label htmlFor="businessIdea">{t("profile.businessIdea")} *</label>
              <textarea
                id="businessIdea"
                name="businessIdea"
                rows={3}
                value={form.businessIdea}
                onChange={(e) => update("businessIdea", e.target.value)}
                placeholder={t("profile.businessIdea_ph")}
              />
              {errors.businessIdea && (
                <span className="error">{errors.businessIdea}</span>
              )}
            </div>

            <div className="field">
              <label htmlFor="projectCost">{t("profile.projectCost")} *</label>
              <input
                id="projectCost"
                name="projectCost"
                type="number"
                min="0"
                step="any"
                value={form.projectCost}
                onChange={(e) => update("projectCost", e.target.value)}
                placeholder="₹ e.g. 500000"
              />
              {errors.projectCost && (
                <span className="error">{errors.projectCost}</span>
              )}
            </div>

            <div className="field">
              <label htmlFor="fundingRequired">
                {t("profile.fundingRequired")} *
              </label>
              <input
                id="fundingRequired"
                name="fundingRequired"
                type="number"
                min="0"
                step="any"
                value={form.fundingRequired}
                onChange={(e) => update("fundingRequired", e.target.value)}
                placeholder="₹ e.g. 300000"
              />
              {errors.fundingRequired && (
                <span className="error">{errors.fundingRequired}</span>
              )}
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting ? "..." : t("profile.save")}
          </button>
          <button type="button" className="btn btn-ghost" onClick={onReset}>
            {t("profile.reset")}
          </button>
        </div>
      </form>
    </section>
  );
}