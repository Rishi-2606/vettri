import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "../../services/api.js";

const EMPTY = {
  slug: "",
  short_name: "",
  category: "business",
  status: "active",
  name_en: "",
  name_ta: "",
  name_hi: "",
  department_en: "",
  department_ta: "",
  department_hi: "",
  description_en: "",
  description_ta: "",
  description_hi: "",
  min_age: "",
  max_age: "",
  max_income: "",
  eligible_categories: "",
  eligible_genders: "",
  eligible_business_status: "",
  education: "",
  max_loan: "",
  interest_rate: "",
  subsidy_percent: 0,
  moratorium: "",
  repayment_years: "",
  documents: "",
  source_url: "",
};

function fromApi(s) {
  return {
    slug: s.slug,
    short_name: s.short_name,
    category: s.category,
    status: s.status,
    name_en: s.name?.en || "",
    name_ta: s.name?.ta || "",
    name_hi: s.name?.hi || "",
    department_en: s.department?.en || "",
    department_ta: s.department?.ta || "",
    department_hi: s.department?.hi || "",
    description_en: s.description?.en || "",
    description_ta: s.description?.ta || "",
    description_hi: s.description?.hi || "",
    min_age: s.min_age ?? "",
    max_age: s.max_age ?? "",
    max_income: s.max_income ?? "",
    eligible_categories: (s.eligible_categories || []).join(", "),
    eligible_genders: (s.eligible_genders || []).join(", "),
    eligible_business_status: (s.eligible_business_status || []).join(", "),
    education: s.education || "",
    max_loan: s.max_loan ?? "",
    interest_rate: s.interest_rate || "",
    subsidy_percent: s.subsidy_percent ?? 0,
    moratorium: s.moratorium || "",
    repayment_years: s.repayment_years || "",
    documents: (s.documents || []).join("\n"),
    source_url: s.source_url || "",
  };
}

function toApi(form) {
  const splitList = (v) =>
    v
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
  const splitLines = (v) =>
    v
      .split("\n")
      .map((x) => x.trim())
      .filter(Boolean);

  return {
    slug: form.slug.trim(),
    short_name: form.short_name.trim(),
    category: form.category,
    status: form.status,
    name: {
      en: form.name_en.trim(),
      ta: form.name_ta.trim(),
      hi: form.name_hi.trim(),
    },
    department: {
      en: form.department_en.trim(),
      ta: form.department_ta.trim(),
      hi: form.department_hi.trim(),
    },
    description: {
      en: form.description_en.trim(),
      ta: form.description_ta.trim(),
      hi: form.description_hi.trim(),
    },
    min_age: form.min_age === "" ? null : Number(form.min_age),
    max_age: form.max_age === "" ? null : Number(form.max_age),
    max_income: form.max_income === "" ? null : Number(form.max_income),
    eligible_categories: form.eligible_categories
      ? splitList(form.eligible_categories)
      : null,
    eligible_genders: form.eligible_genders
      ? splitList(form.eligible_genders)
      : null,
    eligible_business_status: form.eligible_business_status
      ? splitList(form.eligible_business_status)
      : null,
    education: form.education.trim() || null,
    max_loan: form.max_loan === "" ? null : Number(form.max_loan),
    interest_rate: form.interest_rate.trim() || null,
    subsidy_percent: Number(form.subsidy_percent) || 0,
    moratorium: form.moratorium.trim() || null,
    repayment_years: form.repayment_years.trim() || null,
    documents: splitLines(form.documents),
    source_url: form.source_url.trim() || null,
  };
}

export default function AdminSchemeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isEdit) return;
    api.admin
      .listSchemes()
      .then((list) => {
        const found = list.find((s) => String(s.id) === String(id));
        if (!found) throw new Error("Scheme not found");
        setForm(fromApi(found));
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload = toApi(form);
      if (isEdit) {
        await api.admin.updateScheme(id, payload);
      } else {
        await api.admin.createScheme(payload);
      }
      navigate("/admin/schemes");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <p style={{ color: "var(--color-muted)" }}>Loading...</p>;
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <motion.h1
          className="admin-page-title"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ margin: 0 }}
        >
          {isEdit ? `Edit scheme #${id}` : "Add new scheme"}
        </motion.h1>
        <Link to="/admin/schemes" className="btn btn-ghost">
          ← Back
        </Link>
      </div>

      {error && (
        <div className="error-box" style={{ marginBottom: 16 }}>
          {error}
        </div>
      )}

      <form onSubmit={onSubmit}>
        <Section delay={0.05} title="Basic">
          <div className="form-grid">
            <Field label="Slug (URL-safe, unique) *">
              <input
                value={form.slug}
                onChange={(e) => set("slug", e.target.value)}
                required
                placeholder="e.g. pmegp"
              />
            </Field>
            <Field label="Short name *">
              <input
                value={form.short_name}
                onChange={(e) => set("short_name", e.target.value)}
                required
                placeholder="e.g. PMEGP"
              />
            </Field>
            <Field label="Category *">
              <select
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
              >
                {[
                  "business",
                  "women",
                  "sc_st",
                  "youth",
                  "agriculture",
                  "startup",
                  "handicraft",
                  "food_processing",
                  "textile",
                  "export",
                ].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Status">
              <select
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
              >
                <option value="active">active</option>
                <option value="inactive">inactive</option>
              </select>
            </Field>
          </div>
        </Section>

        <Section delay={0.1} title="Translations">
          <div className="form-grid">
            <Field label="Name — English *">
              <input
                value={form.name_en}
                onChange={(e) => set("name_en", e.target.value)}
                required
              />
            </Field>
            <Field label="Name — Tamil">
              <input
                value={form.name_ta}
                onChange={(e) => set("name_ta", e.target.value)}
              />
            </Field>
            <Field label="Name — Hindi">
              <input
                value={form.name_hi}
                onChange={(e) => set("name_hi", e.target.value)}
              />
            </Field>
          </div>

          <div className="form-grid" style={{ marginTop: 12 }}>
            <Field label="Department — English">
              <input
                value={form.department_en}
                onChange={(e) => set("department_en", e.target.value)}
              />
            </Field>
            <Field label="Department — Tamil">
              <input
                value={form.department_ta}
                onChange={(e) => set("department_ta", e.target.value)}
              />
            </Field>
            <Field label="Department — Hindi">
              <input
                value={form.department_hi}
                onChange={(e) => set("department_hi", e.target.value)}
              />
            </Field>
          </div>

          <Field label="Description — English *" full>
            <textarea
              rows={3}
              value={form.description_en}
              onChange={(e) => set("description_en", e.target.value)}
              required
            />
          </Field>
          <Field label="Description — Tamil" full>
            <textarea
              rows={3}
              value={form.description_ta}
              onChange={(e) => set("description_ta", e.target.value)}
            />
          </Field>
          <Field label="Description — Hindi" full>
            <textarea
              rows={3}
              value={form.description_hi}
              onChange={(e) => set("description_hi", e.target.value)}
            />
          </Field>
        </Section>

        <Section delay={0.15} title="Eligibility">
          <div className="form-grid">
            <Field label="Min age">
              <input
                type="number"
                value={form.min_age}
                onChange={(e) => set("min_age", e.target.value)}
              />
            </Field>
            <Field label="Max age">
              <input
                type="number"
                value={form.max_age}
                onChange={(e) => set("max_age", e.target.value)}
              />
            </Field>
            <Field label="Max annual income (₹)">
              <input
                type="number"
                value={form.max_income}
                onChange={(e) => set("max_income", e.target.value)}
              />
            </Field>
            <Field label="Education">
              <input
                value={form.education}
                onChange={(e) => set("education", e.target.value)}
                placeholder="e.g. 10th Pass or above"
              />
            </Field>
          </div>
          <div className="form-grid" style={{ marginTop: 12 }}>
            <Field label="Eligible categories (comma-separated)">
              <input
                value={form.eligible_categories}
                onChange={(e) => set("eligible_categories", e.target.value)}
                placeholder="General, OBC, SC, ST"
              />
            </Field>
            <Field label="Eligible genders (comma-separated)">
              <input
                value={form.eligible_genders}
                onChange={(e) => set("eligible_genders", e.target.value)}
                placeholder="female"
              />
            </Field>
            <Field label="Eligible business status (comma-separated)">
              <input
                value={form.eligible_business_status}
                onChange={(e) =>
                  set("eligible_business_status", e.target.value)
                }
                placeholder="new, existing"
              />
            </Field>
          </div>
        </Section>

        <Section delay={0.2} title="Benefits">
          <div className="form-grid">
            <Field label="Max loan (₹)">
              <input
                type="number"
                value={form.max_loan}
                onChange={(e) => set("max_loan", e.target.value)}
              />
            </Field>
            <Field label="Interest rate">
              <input
                value={form.interest_rate}
                onChange={(e) => set("interest_rate", e.target.value)}
                placeholder="e.g. 8% – 12%"
              />
            </Field>
            <Field label="Subsidy %">
              <input
                type="number"
                value={form.subsidy_percent}
                onChange={(e) => set("subsidy_percent", e.target.value)}
              />
            </Field>
            <Field label="Moratorium">
              <input
                value={form.moratorium}
                onChange={(e) => set("moratorium", e.target.value)}
                placeholder="e.g. 6 months"
              />
            </Field>
            <Field label="Repayment years">
              <input
                value={form.repayment_years}
                onChange={(e) => set("repayment_years", e.target.value)}
                placeholder="e.g. 3 – 5 years"
              />
            </Field>
          </div>
        </Section>

        <Section delay={0.25} title="Documents & Source">
          <Field label="Required documents (one per line)" full>
            <textarea
              rows={5}
              value={form.documents}
              onChange={(e) => set("documents", e.target.value)}
              placeholder={"Aadhaar Card\nPAN Card\nProject Report"}
            />
          </Field>
          <Field label="Official source URL" full>
            <input
              value={form.source_url}
              onChange={(e) => set("source_url", e.target.value)}
              placeholder="https://..."
            />
          </Field>
        </Section>

        <motion.div
          className="form-actions"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <button
            type="submit"
            className="btn btn-primary admin-btn-glow"
            disabled={submitting}
          >
            {submitting
              ? "Saving..."
              : isEdit
                ? "Save changes"
                : "Create scheme"}
          </button>
          <Link to="/admin/schemes" className="btn btn-ghost">
            Cancel
          </Link>
        </motion.div>
      </form>
    </>
  );
}

function Section({ title, children, delay = 0 }) {
  return (
    <motion.div
      className="admin-form-section"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <h2 style={{ fontSize: 16 }}>{title}</h2>
      {children}
    </motion.div>
  );
}

function Field({ label, children, full }) {
  return (
    <div
      className="field"
      style={full ? { gridColumn: "1 / -1" } : undefined}
    >
      <label>{label}</label>
      {children}
    </div>
  );
}