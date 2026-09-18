import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../services/api.js";

const STATUS_STYLES = {
  eligible: { bg: "#E6F4EA", border: "#1E9E63", color: "#046A38" },
  need_info: { bg: "#FFF7E0", border: "#D4AF37", color: "#8C6B1F" },
  not_eligible: { bg: "#FDECEC", border: "#B42318", color: "#B42318" },
};

function scoreColor(score) {
  if (score >= 80) return "#046A38";
  if (score >= 60) return "#8C6B1F";
  if (score >= 40) return "#B54708";
  return "#B42318";
}

function confidenceColor(label) {
  if (label === "high") return "#046A38";
  if (label === "medium") return "#8C6B1F";
  return "#B54708";
}

export default function RecommendationCard({ rank, data }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage || "en";

  const {
    scheme, status, score, confidence, confidence_label,
    issues, reasons, missing, factor_breakdown,
    narrative_key, comparisons,
  } = data;

  const [vote, setVote] = useState(null);
  const [showFactors, setShowFactors] = useState(false);

  const name = scheme.name?.[lang] || scheme.name?.en || scheme.short_name;
  const dept = scheme.department?.[lang] || scheme.department?.en || "";
  const st = STATUS_STYLES[status] || STATUS_STYLES.not_eligible;

  async function onVote(newVote) {
    setVote(newVote);
    try {
      await api.feedback.submit(scheme.slug, newVote);
    } catch {
      // revert on error
      setVote(null);
    }
  }

  const narrative = t(`rec.${narrative_key}`, {
    name,
    score,
    age: reasons.find((r) => r.field === "age")?.value,
    income: reasons.find((r) => r.field === "income")?.value,
    category: reasons.find((r) => r.field === "category")?.value,
    default: "",
  });

  return (
    <div className="rec-card">
      <div className="rec-rank">#{rank}</div>

      <div className="rec-body">
        <div className="rec-head">
          <div>
            <div className="rec-short">{scheme.short_name}</div>
            <h3 className="rec-title">{name}</h3>
            <div className="rec-dept">{dept}</div>
          </div>

          <div className="rec-score-box">
            <div className="rec-score" style={{ color: scoreColor(score) }}>
              {score}%
            </div>
            <div className="rec-score-label">{t("rec.match_score")}</div>
            <div
              className="rec-status"
              style={{
                background: st.bg,
                color: st.color,
                border: `1px solid ${st.border}`,
              }}
            >
              {t(`rec.status_${status}`)}
            </div>
            <div
              style={{
                fontSize: 10,
                marginTop: 6,
                color: confidenceColor(confidence_label),
                fontWeight: 600,
              }}
              title={`Confidence: ${Math.round(confidence * 100)}%`}
            >
              ● {t(`rec.confidence_${confidence_label}`)}
            </div>
          </div>
        </div>

        {/* Narrative */}
        {narrative && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              marginTop: 12,
              padding: "10px 14px",
              background: "rgba(212,175,55,0.06)",
              borderLeft: "3px solid var(--color-gold-500)",
              borderRadius: 8,
              fontSize: 13.5,
              lineHeight: 1.55,
              color: "var(--color-navy-800)",
            }}
          >
            {narrative}
          </motion.div>
        )}

        {/* Why this scheme */}
        {reasons.length > 0 && (
          <div className="rec-block">
            <div className="rec-block-title">{t("rec.why_this")}</div>
            <ul className="rec-list rec-list-ok">
              {reasons.map((r, i) => (
                <li key={i}>{renderReason(r, t)}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Missing info */}
        {missing.length > 0 && (
          <div className="rec-block">
            <div className="rec-block-title warn">{t("rec.missing_info")}</div>
            <ul className="rec-list rec-list-warn">
              {missing.map((m, i) => (
                <li key={i}>{t(`rec.field_${m}`)}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Issues */}
        {issues.length > 0 && (
          <div className="rec-block">
            <div className="rec-block-title bad">
              {t("rec.not_eligible_reasons")}
            </div>
            <ul className="rec-list rec-list-bad">
              {issues.map((x, i) => (
                <li key={i}>{renderIssue(x, t)}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Comparison */}
        {comparisons && comparisons.length > 0 && (
          <div className="rec-block">
            <div className="rec-block-title">{t("rec.compared_with")}</div>
            <ul className="rec-list" style={{ fontSize: 12.5 }}>
              {comparisons.map((c) => {
                const cName = c.name?.[lang] || c.name?.en || c.short_name;
                return (
                  <li key={c.slug}>
                    {t("rec.comparison_line", {
                      name: cName,
                      score: c.score,
                      delta: c.difference > 0 ? `+${c.difference}` : c.difference,
                    })}{" "}
                    <em style={{ color: "var(--color-muted)" }}>
                      ({t(`rec.reason_${c.reason}`)})
                    </em>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Factor breakdown toggle */}
        <button
          type="button"
          onClick={() => setShowFactors((v) => !v)}
          style={{
            marginTop: 14,
            background: "transparent",
            border: "none",
            color: "var(--color-gold-700)",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            padding: 0,
          }}
        >
          {showFactors ? "▾" : "▸"} {t("rec.factor_breakdown")}
        </button>

        <AnimatePresence>
          {showFactors && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              style={{ overflow: "hidden", marginTop: 10 }}
            >
              <div style={{ display: "grid", gap: 8 }}>
                {factor_breakdown.map((f) => {
                  const pct = Math.round((f.value / 1) * 100);
                  return (
                    <div key={f.factor}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: 11.5,
                          color: "var(--color-muted)",
                          marginBottom: 3,
                        }}
                      >
                        <span>{t(`rec.factor_${f.factor}`)}</span>
                        <span style={{ fontWeight: 600 }}>
                          {pct}% · {t("rec.weight")} {f.weight}
                        </span>
                      </div>
                      <div className="admin-bar" style={{ height: 5 }}>
                        <motion.div
                          className="admin-bar-fill"
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="rec-actions">
          <Link
            to={`/schemes/${scheme.slug}`}
            className="btn btn-primary"
            style={{ padding: "8px 16px", fontSize: 13 }}
          >
            {t("rec.view_details")}
          </Link>
          <Link
            to="/profile"
            className="btn btn-ghost"
            style={{ padding: "8px 16px", fontSize: 13 }}
          >
            {t("rec.edit_profile")}
          </Link>

          {/* Feedback */}
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              gap: 6,
              alignItems: "center",
              fontSize: 12,
              color: "var(--color-muted)",
            }}
          >
            <span>{t("rec.was_this_helpful")}</span>
            <button
              type="button"
              onClick={() => onVote("up")}
              title={t("rec.vote_up")}
              style={{
                background: vote === "up" ? "#E6F4EA" : "transparent",
                border: "1px solid #00000015",
                borderRadius: 6,
                padding: "4px 8px",
                cursor: "pointer",
                fontSize: 14,
              }}
            >
              👍
            </button>
            <button
              type="button"
              onClick={() => onVote("down")}
              title={t("rec.vote_down")}
              style={{
                background: vote === "down" ? "#FDECEC" : "transparent",
                border: "1px solid #00000015",
                borderRadius: 6,
                padding: "4px 8px",
                cursor: "pointer",
                fontSize: 14,
              }}
            >
              👎
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function renderReason(r, t) {
  const label = t(`rec.field_${r.field}`);
  if (r.field === "income") {
    return `${label}: ₹${Number(r.value).toLocaleString("en-IN")}`;
  }
  if (r.field === "gender") {
    return `${label}: ${t(`profile.gender_${r.value}`)}`;
  }
  if (r.field === "businessStatus") {
    return `${label}: ${t(`profile.businessStatus_${r.value}`)}`;
  }
  return `${label}: ${r.value}`;
}

function renderIssue(x, t) {
  const label = t(`rec.field_${x.field}`);
  if (x.field === "age") {
    if (x.min) return `${label}: ${t("rec.min_age")} ${x.min}`;
    if (x.max) return `${label}: ${t("rec.max_age")} ${x.max}`;
  }
  if (x.field === "income") {
    return `${label}: ${t("rec.max_income")} ₹${Number(x.max).toLocaleString("en-IN")}`;
  }
  return label;
}