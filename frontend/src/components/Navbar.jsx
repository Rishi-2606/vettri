import { Link, NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSelector from "./LanguageSelector.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { t } = useTranslation();
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const linkStyle = ({ isActive }) => ({
    color: isActive ? "var(--color-gold-700)" : "var(--color-navy-900)",
    fontWeight: isActive ? 700 : 500,
    borderBottom: isActive
      ? "2px solid var(--color-gold-500)"
      : "2px solid transparent",
    paddingBottom: 4,
    transition: "color 180ms ease, border-color 180ms ease",
  });

  function onLogout() {
    logout();
    navigate("/");
  }

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: "blur(10px)",
        background: "rgba(255,253,248,0.9)",
        borderBottom: "1px solid #00000010",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 68,
          gap: 16,
        }}
      >
        <Link
          to="/"
          aria-label={t("brand")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 22,
            letterSpacing: 1.5,
            color: "var(--color-navy-900)",
            whiteSpace: "nowrap",
          }}
        >
          {t("brand")}
        </Link>

        <nav
          aria-label="Main navigation"
          style={{
            display: "flex",
            gap: 20,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <NavLink to="/schemes" style={linkStyle}>
            {t("nav.schemes")}
          </NavLink>
          <NavLink to="/recommendations" style={linkStyle}>
            {t("nav.recommendations")}
          </NavLink>
          <NavLink to="/profile" style={linkStyle}>
            {t("nav.profile")}
          </NavLink>

          {isAdmin && (
            <NavLink to="/admin" style={linkStyle}>
              🛡️ Admin
            </NavLink>
          )}

          {user ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                paddingLeft: 10,
                borderLeft: "1px solid #00000015",
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--color-navy-800)",
                  maxWidth: 140,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                title={user.email}
              >
                👤 {user.name}
              </span>
              <button
                type="button"
                onClick={onLogout}
                className="btn btn-ghost"
                style={{ padding: "6px 12px", fontSize: 13 }}
              >
                {t("auth.logout")}
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 8 }}>
              <Link
                to="/login"
                className="btn btn-ghost"
                style={{ padding: "6px 14px", fontSize: 13 }}
              >
                {t("auth.login_cta")}
              </Link>
              <Link
                to="/register"
                className="btn btn-primary"
                style={{ padding: "6px 14px", fontSize: 13 }}
              >
                {t("auth.register_cta")}
              </Link>
            </div>
          )}

          <LanguageSelector />
        </nav>
      </div>
    </header>
  );
}