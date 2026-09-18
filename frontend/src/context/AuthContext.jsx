import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api.js";

const AuthContext = createContext(null);
const AUTH_KEY = "vettri.auth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_KEY);
    if (!stored) {
      setLoading(false);
      return;
    }
    api
      .me()
      .then((u) => setUser(u))
      .catch(() => localStorage.removeItem(AUTH_KEY))
      .finally(() => setLoading(false));
  }, []);

  async function register({ name, email, password, language = "en" }) {
    try {
      const res = await api.register({ name, email, password, language });
      localStorage.setItem(AUTH_KEY, JSON.stringify(res));
      const u = await api.me();
      setUser(u);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }

  async function login({ email, password }) {
    try {
      const res = await api.login({ email, password });
      localStorage.setItem(AUTH_KEY, JSON.stringify(res));
      const u = await api.me();
      setUser(u);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }

  function logout() {
    localStorage.removeItem(AUTH_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin: !!user?.is_admin,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}