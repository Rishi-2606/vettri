import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function AdminRoute({ children }) {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="container" style={{ padding: 60 }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!isAdmin) {
    return (
      <section
        className="container"
        style={{ padding: "60px 24px", maxWidth: 620 }}
      >
        <div className="card" style={{ textAlign: "center" }}>
          <h1>403 — Access Denied</h1>
          <p style={{ color: "var(--color-muted)" }}>
            This page requires administrator privileges.
          </p>
        </div>
      </section>
    );
  }

  return children;
}