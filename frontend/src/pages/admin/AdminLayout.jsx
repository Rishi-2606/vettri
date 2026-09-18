import { NavLink, Outlet, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext.jsx";

const NAV_ITEMS = [
  { to: "/admin", end: true, icon: "📊", label: "Dashboard" },
  { to: "/admin/schemes", icon: "📋", label: "Schemes" },
  { to: "/admin/schemes/new", icon: "➕", label: "Add Scheme" },
  { to: "/admin/users", icon: "👥", label: "Users" },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <section className="container" style={{ padding: "40px 24px" }}>
      <div className="admin-shell">
        {/* Sidebar */}
        <aside>
          <motion.div
            className="admin-sidebar"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: "var(--color-paper)",
              border: "1px solid rgba(212, 175, 55, 0.18)",
              borderRadius: "var(--radius-lg)",
              padding: 16,
              position: "sticky",
              top: 90,
              boxShadow: "0 8px 30px rgba(11, 27, 58, 0.06)",
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1.6,
                color: "var(--color-gold-700)",
                marginBottom: 14,
                paddingLeft: 4,
                position: "relative",
                zIndex: 1,
              }}
            >
              ✦ ADMIN PANEL
            </div>

            {NAV_ITEMS.map((item, i) => (
              <motion.div
                key={item.to}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 + i * 0.06, duration: 0.4 }}
              >
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `admin-sidebar-link ${isActive ? "active" : ""}`
                  }
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "11px 14px",
                    borderRadius: 10,
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--color-navy-900)",
                    marginBottom: 4,
                    textDecoration: "none",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <span style={{ fontSize: 16 }}>{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{
                marginTop: 20,
                paddingTop: 16,
                borderTop: "1px solid rgba(0,0,0,0.08)",
                fontSize: 12,
                color: "var(--color-muted)",
                position: "relative",
                zIndex: 1,
              }}
            >
              <div style={{ marginBottom: 4 }}>Signed in as</div>
              <div
                style={{
                  fontWeight: 700,
                  color: "var(--color-navy-900)",
                  marginBottom: 12,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user?.name}
              </div>
              <Link
                to="/"
                className="btn btn-ghost"
                style={{
                  padding: "8px 10px",
                  fontSize: 12,
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                ← Back to site
              </Link>
              <button
                type="button"
                onClick={logout}
                className="btn btn-ghost"
                style={{
                  padding: "8px 10px",
                  fontSize: 12,
                  width: "100%",
                  justifyContent: "center",
                  marginTop: 8,
                }}
              >
                Logout
              </button>
            </motion.div>
          </motion.div>
        </aside>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <Outlet />
        </motion.div>
      </div>
    </section>
  );
}