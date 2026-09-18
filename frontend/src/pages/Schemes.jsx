import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { SCHEME_CATEGORIES } from "../data/schemes.js";
import { api } from "../services/api.js";
import SchemeCard from "../components/SchemeCard.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { SchemeGridSkeleton } from "../components/Skeletons.jsx";

export default function Schemes() {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage || "en";

  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .listSchemes()
      .then((data) => {
        if (!cancelled) setSchemes(data);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return schemes.filter((s) => {
      if (category && s.category !== category) return false;
      if (!q) return true;
      const hay = [
        s.name?.en,
        s.name?.ta,
        s.name?.hi,
        s.short_name,
        s.description?.en,
        s.description?.ta,
        s.description?.hi,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [query, category, schemes]);

  return (
    <section className="container" style={{ padding: "60px 24px" }}>
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {t("schemes.title")}
      </motion.h1>
      <p style={{ color: "var(--color-muted)", maxWidth: 640 }}>
        {t("schemes.subtitle")}
      </p>

      {/* Search + filter */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginTop: 24,
          marginBottom: 24,
          flexWrap: "wrap",
        }}
      >
        <input
          type="search"
          placeholder={t("schemes.search_ph")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label={t("schemes.search_ph")}
          style={{
            flex: 1,
            minWidth: 220,
            padding: "11px 14px",
            borderRadius: "var(--radius-md)",
            border: "1px solid #00000022",
            background: "#fff",
            fontFamily: "inherit",
            fontSize: 14,
          }}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label={t("schemes.all_categories")}
          style={{
            padding: "11px 14px",
            borderRadius: "var(--radius-md)",
            border: "1px solid #00000022",
            background: "#fff",
            fontFamily: "inherit",
            fontSize: 14,
            minWidth: 180,
          }}
        >
          <option value="">{t("schemes.all_categories")}</option>
          {SCHEME_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label[lang] || c.label.en}
            </option>
          ))}
        </select>
      </div>

      {/* Result count */}
      {!loading && !error && filtered.length > 0 && (
        <div
          style={{
            fontSize: 13,
            color: "var(--color-muted)",
            marginBottom: 16,
          }}
        >
          {t("schemes.results_count", { count: filtered.length })}
        </div>
      )}

      {/* Error */}
      {error && (
        <EmptyState
          icon="⚠️"
          title="Could not load schemes"
          subtitle={error}
          action={
            <button
              className="btn btn-ghost"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          }
        />
      )}

      {/* Content */}
      {loading ? (
        <SchemeGridSkeleton count={6} />
      ) : error ? null : filtered.length === 0 ? (
        <EmptyState
          icon="🔍"
          title={t("schemes.no_results")}
          subtitle="Try a different keyword or clear the filter."
          action={
            <button
              className="btn btn-ghost"
              onClick={() => {
                setQuery("");
                setCategory("");
              }}
            >
              {t("profile.reset")}
            </button>
          }
        />
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 20,
          }}
        >
          {filtered.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.3), duration: 0.3 }}
            >
              <SchemeCard scheme={s} />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}