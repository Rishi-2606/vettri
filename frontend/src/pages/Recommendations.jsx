import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { api } from "../services/api.js";
import RecommendationCard from "../components/RecommendationCard.jsx";

export default function Recommendations() {
  const { t } = useTranslation();

  const [ranked, setRanked] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [needProfile, setNeedProfile] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .getRecommendations()
      .then((data) => {
        if (!cancelled) setRanked(data);
      })
      .catch((e) => {
        if (cancelled) return;
        if (e.message.toLowerCase().includes("profile")) {
          setNeedProfile(true);
        } else {
          setError(e.message);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const counts = useMemo(() => {
    const c = { eligible: 0, need_info: 0, not_eligible: 0 };
    ranked.forEach((r) => (c[r.status] = (c[r.status] || 0) + 1));
    return c;
  }, [ranked]);

  // Loading
  if (loading) {
    return (
      <section className="container" style={{ padding: "60px 24px" }}>
        <h1>{t("rec.title")}</h1>
        <p style={{ color: "var(--color-muted)" }}>Analysing your profile...</p>
      </section>
    );
  }

  // No profile
  if (needProfile) {
    return (
      <section className="container" style={{ padding: "60px 24px" }}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="card"
          style={{ textAlign: "center", maxWidth: 620, margin: "40px auto" }}
        >
          <h1 style={{ marginBottom: 12 }}>{t("rec.no_profile_title")}</h1>
          <p style={{ color: "var(--color-muted)" }}>
            {t("rec.no_profile_subtitle")}
          </p>
          <Link
            to="/profile"
            className="btn btn-primary"
            style={{ marginTop: 20 }}
          >
            {t("rec.no_profile_cta")}
          </Link>
        </motion.div>
      </section>
    );
  }

  // Error
  if (error) {
    return (
      <section className="container" style={{ padding: "60px 24px" }}>
        <h1>{t("rec.title")}</h1>
        <div className="error-box" style={{ marginTop: 16 }}>
          {error}
        </div>
        <Link
          to="/profile"
          className="btn btn-ghost"
          style={{ marginTop: 20 }}
        >
          {t("rec.edit_profile")}
        </Link>
      </section>
    );
  }

  // Main view
  return (
    <section
      className="container"
      style={{ padding: "60px 24px", maxWidth: 1000 }}
    >
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {t("rec.title")}
      </motion.h1>
      <p style={{ color: "var(--color-muted)", maxWidth: 640 }}>
        {t("rec.subtitle")}
      </p>

      {/* Summary */}
      <div className="rec-summary">
        <div className="rec-summary-item ok">
          <div className="rec-summary-num">{counts.eligible}</div>
          <div className="rec-summary-label">{t("rec.status_eligible")}</div>
        </div>
        <div className="rec-summary-item warn">
          <div className="rec-summary-num">{counts.need_info}</div>
          <div className="rec-summary-label">{t("rec.status_need_info")}</div>
        </div>
        <div className="rec-summary-item bad">
          <div className="rec-summary-num">{counts.not_eligible}</div>
          <div className="rec-summary-label">
            {t("rec.status_not_eligible")}
          </div>
        </div>
      </div>

      {/* Ranked list */}
      <div className="rec-list-wrap">
        {ranked.map((r, i) => (
          <RecommendationCard key={r.scheme.id} rank={i + 1} data={r} />
        ))}
      </div>

      <div style={{ marginTop: 40, textAlign: "center" }}>
        <Link to="/profile" className="btn btn-ghost">
          {t("rec.edit_profile")}
        </Link>
      </div>
    </section>
  );
}