import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../services/api.js";

export default function AdminSchemes() {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [q, setQ] = useState("");

  function load() {
    setLoading(true);
    api.admin
      .listSchemes(q ? { q } : {})
      .then(setSchemes)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onDelete(scheme) {
    if (!confirm(`Delete "${scheme.short_name}"? This cannot be undone.`))
      return;
    try {
      await api.admin.deleteScheme(scheme.id);
      setSchemes((s) => s.filter((x) => x.id !== scheme.id));
    } catch (e) {
      alert("Delete failed: " + e.message);
    }
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          marginBottom: 20,
          flexWrap: "wrap",
        }}
      >
        <motion.h1
          className="admin-page-title"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ margin: 0 }}
        >
          Schemes
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <Link
            to="/admin/schemes/new"
            className="btn btn-primary admin-btn-glow"
          >
            ➕ Add Scheme
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        style={{ display: "flex", gap: 10, marginBottom: 20 }}
      >
        <input
          type="search"
          placeholder="Search by short name or slug..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load()}
          style={{
            flex: 1,
            padding: "10px 14px",
            borderRadius: "var(--radius-md)",
            border: "1px solid rgba(212, 175, 55, 0.25)",
            fontFamily: "inherit",
            transition: "border-color 200ms, box-shadow 200ms",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "var(--color-gold-500)";
            e.currentTarget.style.boxShadow =
              "0 0 0 3px rgba(212, 175, 55, 0.15)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "rgba(212, 175, 55, 0.25)";
            e.currentTarget.style.boxShadow = "none";
          }}
        />
        <button className="btn btn-ghost" onClick={load}>
          Search
        </button>
      </motion.div>

      {error && <div className="error-box">{error}</div>}

      {loading ? (
        <p style={{ color: "var(--color-muted)" }}>Loading schemes...</p>
      ) : schemes.length === 0 ? (
        <motion.div
          className="card admin-empty"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          style={{ textAlign: "center", padding: 40 }}
        >
          <p style={{ color: "var(--color-muted)" }}>
            No schemes found.{" "}
            <Link to="/admin/schemes/new">Add the first one →</Link>
          </p>
        </motion.div>
      ) : (
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.45 }}
          style={{ padding: 0, overflow: "hidden" }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 14,
            }}
          >
            <thead>
              <tr
                style={{
                  background:
                    "linear-gradient(90deg, rgba(212,175,55,0.12), rgba(212,175,55,0.04))",
                }}
              >
                <th style={th}>ID</th>
                <th style={th}>Short name</th>
                <th style={th}>Category</th>
                <th style={th}>Status</th>
                <th style={th}>Max loan</th>
                <th style={{ ...th, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {schemes.map((s, i) => (
                  <motion.tr
                    key={s.id}
                    className="admin-row"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{
                      delay: Math.min(i * 0.02, 0.4),
                      duration: 0.3,
                    }}
                    style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}
                  >
                    <td style={td}>{s.id}</td>
                    <td style={td}>
                      <strong>{s.short_name}</strong>
                      <div
                        style={{
                          fontSize: 11,
                          color: "var(--color-muted)",
                        }}
                      >
                        {s.slug}
                      </div>
                    </td>
                    <td style={td}>{s.category}</td>
                    <td style={td}>
                      <span
                        style={{
                          padding: "3px 10px",
                          borderRadius: 999,
                          fontSize: 11,
                          fontWeight: 700,
                          background:
                            s.status === "active"
                              ? "rgba(4, 106, 56, 0.1)"
                              : "rgba(180, 35, 24, 0.1)",
                          color:
                            s.status === "active" ? "#046A38" : "#B42318",
                          boxShadow:
                            s.status === "active"
                              ? "0 0 12px rgba(4, 106, 56, 0.15)"
                              : "0 0 12px rgba(180, 35, 24, 0.15)",
                        }}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td style={td}>
                      {s.max_loan
                        ? `₹${Number(s.max_loan).toLocaleString("en-IN")}`
                        : "—"}
                    </td>
                    <td style={{ ...td, textAlign: "right" }}>
                      <Link
                        to={`/admin/schemes/${s.id}`}
                        className="btn btn-ghost"
                        style={{
                          padding: "5px 12px",
                          fontSize: 12,
                          marginRight: 6,
                        }}
                      >
                        Edit
                      </Link>
                      <button
                        className="btn btn-ghost admin-btn-danger"
                        style={{
                          padding: "5px 12px",
                          fontSize: 12,
                          color: "var(--color-danger)",
                          borderColor: "var(--color-danger)",
                        }}
                        onClick={() => onDelete(s)}
                      >
                        Delete
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </motion.div>
      )}
    </>
  );
}

const th = {
  padding: "12px 14px",
  textAlign: "left",
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: 0.6,
  color: "var(--color-navy-900)",
};

const td = { padding: "14px", verticalAlign: "top" };