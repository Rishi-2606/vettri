import { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../services/api.js";

export default function Checklist() {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage || "en";

  const [data, setData] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [error, setError] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    api.documents
      .getChecklist(slug)
      .then((res) => {
        setData(res);
        setItems(res.items);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    load();
  }, [load]);

  const haveCount = useMemo(
    () => items.filter((i) => i.has_it).length,
    [items]
  );
  const total = items.length;
  const pct = total === 0 ? 0 : Math.round((haveCount / total) * 100);

  async function persist(nextItems) {
    setSaving(true);
    try {
      await api.documents.updateChecklist(slug, nextItems);
      setSavedAt(new Date());
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  function toggle(index) {
    const next = items.map((it, i) =>
      i === index ? { ...it, has_it: !it.has_it } : it
    );
    setItems(next);
    persist(next);
  }

  function markAll(has_it) {
    const next = items.map((it) => ({ ...it, has_it }));
    setItems(next);
    persist(next);
  }

  function printPage() {
    window.print();
  }

  if (loading) {
    return (
      <section className="container" style={{ padding: "60px 24px" }}>
        <p style={{ color: "var(--color-muted)" }}>Loading checklist...</p>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="container" style={{ padding: "60px 24px" }}>
        <h1>{t("checklist.not_found")}</h1>
        <Link to="/schemes" className="btn btn-ghost" style={{ marginTop: 16 }}>
          ← {t("checklist.back_to_schemes")}
        </Link>
      </section>
    );
  }

  const schemeName =
    data.scheme_name?.[lang] || data.scheme_name?.en || data.scheme_short_name;

  return (
    <section
      className="container checklist-page"
      style={{ padding: "60px 24px", maxWidth: 800 }}
    >
      <Link
        to={`/schemes/${slug}`}
        style={{ fontSize: 13, color: "var(--color-muted)" }}
        className="no-print"
      >
        ← {t("checklist.back_to_scheme")}
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ marginTop: 16, marginBottom: 24 }}
      >
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1,
            color: "var(--color-gold-700)",
            textTransform: "uppercase",
          }}
        >
          {data.scheme_short_name}
        </div>
        <h1 style={{ marginTop: 6 }}>{t("checklist.title")}</h1>
        <div style={{ color: "var(--color-muted)", fontSize: 14 }}>
          {schemeName}
        </div>
      </motion.div>

      {/* Progress bar */}
      <div className="checklist-progress-card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 600 }}>
            {t("checklist.progress")}
          </span>
          <span
            style={{
              fontSize: 13,
              color: "var(--color-gold-700)",
              fontWeight: 700,
            }}
          >
            {haveCount} / {total} ({pct}%)
          </span>
        </div>
        <div className="checklist-progress-track">
          <motion.div
            className="checklist-progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        {saving ? (
          <div
            style={{ fontSize: 11, color: "var(--color-muted)", marginTop: 6 }}
          >
            {t("checklist.saving")}
          </div>
        ) : savedAt ? (
          <div
            style={{ fontSize: 11, color: "var(--color-muted)", marginTop: 6 }}
          >
            {t("checklist.saved")}
          </div>
        ) : null}
      </div>

      {/* Actions */}
      <div className="checklist-actions no-print">
        <button
          className="btn btn-ghost"
          style={{ padding: "8px 14px", fontSize: 13 }}
          onClick={() => markAll(true)}
        >
          ✓ {t("checklist.mark_all")}
        </button>
        <button
          className="btn btn-ghost"
          style={{ padding: "8px 14px", fontSize: 13 }}
          onClick={() => markAll(false)}
        >
          ⟲ {t("checklist.clear_all")}
        </button>
        <button
          className="btn btn-ghost"
          style={{ padding: "8px 14px", fontSize: 13 }}
          onClick={printPage}
        >
          🖨 {t("checklist.print")}
        </button>
      </div>

      {/* Items */}
      <div className="checklist-list">
        <AnimatePresence>
          {items.map((item, i) => (
            <motion.label
              key={item.document_name}
              className={`checklist-item ${item.has_it ? "has-it" : ""}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.4), duration: 0.3 }}
            >
              <input
                type="checkbox"
                checked={item.has_it}
                onChange={() => toggle(i)}
                className="checklist-checkbox"
              />
              <span className="checklist-check-icon">
                {item.has_it ? "✅" : "⬜"}
              </span>
              <span className="checklist-doc-name">{item.document_name}</span>
            </motion.label>
          ))}
        </AnimatePresence>
      </div>

      {haveCount === total && total > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="checklist-complete"
        >
          🎉 {t("checklist.all_set")}
        </motion.div>
      )}

      <div style={{ marginTop: 32 }} className="checklist-actions no-print">
        <Link to={`/schemes/${slug}`} className="btn btn-ghost">
          ← {t("checklist.back_to_scheme")}
        </Link>
        <Link to="/schemes" className="btn btn-ghost">
          {t("checklist.back_to_schemes")}
        </Link>
      </div>
    </section>
  );
}