import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
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
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = t("auth.err_email");
    if (!form.password) e.password = t("auth.err_required");
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(ev) {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await login({
        email: form.email.trim(),
        password: form.password,
      });
      if (!res.ok) {
        if (res.error?.toLowerCase().includes("invalid")) {
          setErrors({ form: t("auth.err_bad_password") });
        } else {
          setErrors({ form: res.error || t("auth.err_unknown") });
        }
        return;
      }
      const from = location.state?.from || "/profile";
      navigate(from, { replace: true });
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
        <h1>{t("auth.login_title")}</h1>
        <p className="auth-sub">{t("auth.login_subtitle")}</p>

        <form onSubmit={onSubmit} noValidate>
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
              autoComplete="current-password"
              disabled={submitting}
            />
            {errors.password && <span className="error">{errors.password}</span>}
          </div>

          {errors.form && <div className="error-box">{errors.form}</div>}

          <button
            type="submit"
            className="btn btn-primary auth-btn"
            disabled={submitting}
          >
            {submitting ? "..." : t("auth.login_cta")}
          </button>
        </form>

        <p className="auth-alt">
          {t("auth.no_account")}{" "}
          <Link to="/register">{t("auth.register_link")}</Link>
        </p>
      </motion.div>
    </section>
  );
}