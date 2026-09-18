import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "../../services/api.js";

export default function AdminUsers() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.admin
      .listUsers({ limit: 100 })
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <div className="error-box">{error}</div>;
  if (!data)
    return <p style={{ color: "var(--color-muted)" }}>Loading users...</p>;

  return (
    <>
      <motion.h1
        className="admin-page-title"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Users ({data.total})
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        style={{ color: "var(--color-muted)", marginBottom: 20 }}
      >
        Showing the most recent {data.items.length}.
      </motion.p>

      <motion.div
        className="card"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.45 }}
        style={{ padding: 0, overflow: "hidden" }}
      >
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}
        >
          <thead>
            <tr
              style={{
                background:
                  "linear-gradient(90deg, rgba(212,175,55,0.12), rgba(212,175,55,0.04))",
              }}
            >
              <th style={th}>ID</th>
              <th style={th}>Name</th>
              <th style={th}>Email</th>
              <th style={th}>Lang</th>
              <th style={th}>Profile</th>
              <th style={th}>Admin</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((u, i) => (
              <motion.tr
                key={u.id}
                className="admin-row"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: Math.min(i * 0.02, 0.4),
                  duration: 0.3,
                }}
                style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}
              >
                <td style={td}>{u.id}</td>
                <td style={td}>{u.name}</td>
                <td style={td}>{u.email}</td>
                <td style={td}>{u.language?.toUpperCase()}</td>
                <td style={td}>{u.has_profile ? "✅" : "—"}</td>
                <td style={td}>{u.is_admin ? "🛡️" : ""}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
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

const td = { padding: "14px" };