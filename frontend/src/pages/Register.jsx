import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { t, i18n } = useTranslation();
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field] || errors.form) {
      setErrors((e) => ({ ...e, [field]: undefined, form: undefined }));
    }
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = t("auth.err_required");
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = t("auth.err_email");
    if (form.password.length < 6) e.password = t("auth.err_password_short");
    if (form.password !== form.confirm)
      e.confirm = t("auth.err_password_mismatch");
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(ev) {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        language: i18n.resolvedLanguage || "en",
      });

      if (!res.ok) {
        if (res.error?.toLowerCase().includes("already")) {
          setErrors({ email: t("auth.err_email_taken") });
        } else {
          setErrors({ form: res.error || t("auth.err_unknown") });
        }
        return;
      }
      navigate("/profile", { replace: true });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="container auth-wrap">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="auth-card"
      >
        <h1>{t("auth.register_title")}</h1>
        <p className="auth-sub">{t("auth.register_subtitle")}</p>

        <form onSubmit={onSubmit} noValidate>
          <div className="field">
            <label htmlFor="name">{t("auth.name")}</label>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder={t("auth.name_ph")}
              autoComplete="name"
              disabled={submitting}
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>

          <div className="field">
            <label htmlFor="email">{t("auth.email")}</label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder={t("auth.email_ph")}
              autoComplete="email"
              disabled={submitting}
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          <div className="field">
            <label htmlFor="password">{t("auth.password")}</label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              placeholder={t("auth.password_ph")}
              autoComplete="new-password"
              disabled={submitting}
            />
            {errors.password && <span className="error">{errors.password}</span>}
          </div>

          <div className="field">
            <label htmlFor="confirm">{t("auth.confirm_password")}</label>
            <input
              id="confirm"
              type="password"
              value={form.confirm}
              onChange={(e) => update("confirm", e.target.value)}
              placeholder={t("auth.password_ph")}
              autoComplete="new-password"
              disabled={submitting}
            />
            {errors.confirm && <span className="error">{errors.confirm}</span>}
          </div>

          {errors.form && <div className="error-box">{errors.form}</div>}

          <button
            type="submit"
            className="btn btn-primary auth-btn"
            disabled={submitting}
          >
            {submitting ? "..." : t("auth.register_cta")}
          </button>
        </form>

        <p className="auth-alt">
          {t("auth.have_account")}{" "}
          <Link to="/login">{t("auth.login_link")}</Link>
        </p>
      </motion.div>
    </section>
  );
}