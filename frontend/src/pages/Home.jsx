import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Hero3D from "../components/Hero3D.jsx";

export default function Home() {
  const { t } = useTranslation();

  const features = [
    { t: t("home.features.ai_title"), d: t("home.features.ai_desc") },
    { t: t("home.features.score_title"), d: t("home.features.score_desc") },
    { t: t("home.features.docs_title"), d: t("home.features.docs_desc") },
    { t: t("home.features.lang_title"), d: t("home.features.lang_desc") },
  ];

  return (
    <section className="container" style={{ padding: "80px 24px" }}>
      <div className="hero-layout">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontSize: "clamp(32px, 5vw, 56px)", lineHeight: 1.1 }}
          >
            {t("home.title_line1")}
            <br />
            <span style={{ color: "var(--color-gold-700)" }}>
              {t("home.title_line2_accent")}
            </span>
            {t("home.title_line2_after")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            style={{
              maxWidth: 640,
              color: "var(--color-muted)",
              fontSize: 18,
              lineHeight: 1.6,
            }}
          >
            {t("home.subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            style={{ display: "flex", gap: 12, marginTop: 32, flexWrap: "wrap" }}
          >
            <Link to="/profile" className="btn btn-primary">
              {t("home.cta_primary")}
            </Link>
            <Link to="/schemes" className="btn btn-ghost">
              {t("home.cta_secondary")}
            </Link>
          </motion.div>
        </div>

        <Hero3D />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 20,
          marginTop: 64,
        }}
      >
        {features.map((f, i) => (
          <motion.div
            key={f.t}
            className="card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.08, duration: 0.4 }}
          >
            <h3 style={{ fontSize: 18 }}>{f.t}</h3>
            <p style={{ color: "var(--color-muted)", margin: 0 }}>{f.d}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}