import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "../../services/api.js";
import AdminCard3D from "../../components/admin/AdminCard3D.jsx";
import AnimatedCounter from "../../components/admin/AnimatedCounter.jsx";

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.admin
      .analytics()
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <div className="error-box">{error}</div>;
  if (!data)
    return <p style={{ color: "var(--color-muted)" }}>Loading analytics...</p>;

  const { totals, by_category, by_language } = data;

  const maxCategory = Math.max(1, ...by_category.map((x) => x.count));
  const maxLanguage = Math.max(1, ...by_language.map((x) => x.count));
  const totalUsers = Math.max(1, totals.users);

  return (
    <>
      <motion.h1
        className="admin-page-title"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ marginBottom: 8 }}
      >
        Dashboard
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        style={{ color: "var(--color-muted)", marginBottom: 28 }}
      >
        Real-time overview of the Vettri platform.
      </motion.p>

      {/* KPI grid with 3D + glow */}
      <div className="admin-kpi-grid">
        <KPI
          delay={0.05}
          label="Users"
          value={totals.users}
          accent="#0B1B3A"
        />
        <KPI
          delay={0.10}
          label="Admins"
          value={totals.admins}
          accent="#8C6B1F"
        />
        <KPI
          delay={0.15}
          label="Profiles"
          value={totals.profiles}
          accent="#046A38"
        />
        <KPI
          delay={0.20}
          label="Profile completion"
          value={`${totals.profile_completion_rate}%`}
          accent="#1E9E63"
          isPercent
        />
        <KPI
          delay={0.25}
          label="Total schemes"
          value={totals.schemes}
          accent="#0B1B3A"
        />
        <KPI
          delay={0.30}
          label="Active schemes"
          value={totals.active_schemes}
          accent="#046A38"
        />
      </div>

      {/* Schemes by category */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.45 }}
        className="card"
        style={{ marginTop: 32 }}
      >
        <h2 style={{ fontSize: 18 }}>Schemes by category</h2>
        {by_category.length === 0 ? (
          <p style={{ color: "var(--color-muted)" }}>No data yet.</p>
        ) : (
          <div style={{ display: "grid", gap: 16, marginTop: 16 }}>
            {by_category.map((row, i) => (
              <motion.div
                key={row.category}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.05, duration: 0.35 }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: 13,
                    fontWeight: 600,
                    marginBottom: 2,
                  }}
                >
                  <span style={{ textTransform: "capitalize" }}>
                    {row.category.replace("_", " / ")}
                  </span>
                  <span style={{ color: "var(--color-gold-700)" }}>
                    {row.count}
                  </span>
                </div>
                <div className="admin-bar">
                  <motion.div
                    className="admin-bar-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${(row.count / maxCategory) * 100}%` }}
                    transition={{
                      delay: 0.5 + i * 0.06,
                      duration: 0.9,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Users by language */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.45 }}
        className="card"
        style={{ marginTop: 20 }}
      >
        <h2 style={{ fontSize: 18 }}>Users by language</h2>
        {by_language.length === 0 ? (
          <p style={{ color: "var(--color-muted)" }}>No data yet.</p>
        ) : (
          <div style={{ display: "grid", gap: 16, marginTop: 16 }}>
            {by_language.map((row, i) => (
              <motion.div
                key={row.language}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 + i * 0.05, duration: 0.35 }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: 13,
                    fontWeight: 600,
                    marginBottom: 2,
                  }}
                >
                  <span>{row.language.toUpperCase()}</span>
                  <span style={{ color: "var(--color-gold-700)" }}>
                    {row.count} / {totalUsers}
                  </span>
                </div>
                <div className="admin-bar">
                  <motion.div
                    className="admin-bar-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${(row.count / maxLanguage) * 100}%` }}
                    transition={{
                      delay: 0.65 + i * 0.06,
                      duration: 0.9,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.4 }}
        style={{ marginTop: 32 }}
      >
        <Link
          to="/admin/schemes"
          className="btn btn-primary admin-btn-glow"
        >
          Manage schemes →
        </Link>
      </motion.div>
    </>
  );
}

function KPI({ label, value, accent, delay = 0, isPercent = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <AdminCard3D
        className="admin-kpi"
        style={{ borderLeft: `4px solid ${accent}` }}
      >
        <span
          className="admin-kpi-pulse"
          style={{ "--kpi-accent": accent }}
        />
        <div className="admin-kpi-value">
          {typeof value === "number" ? (
            <AnimatedCounter value={value} />
          ) : isPercent ? (
            <AnimatedCounter
              value={parseFloat(value) || 0}
              suffix="%"
            />
          ) : (
            value
          )}
        </div>
        <div className="admin-kpi-label">{label}</div>
      </AdminCard3D>
    </motion.div>
  );
}