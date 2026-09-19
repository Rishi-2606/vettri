import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

const STORAGE_KEY = "vettri.onboarding.seen";

const SLIDES = [
  {
    key: "schemes",
    icon: "🎯",
    bg: "linear-gradient(135deg, #0B1B3A 0%, #1B3A75 100%)",
  },
  {
    key: "match",
    icon: "📊",
    bg: "linear-gradient(135deg, #8C6B1F 0%, #D4AF37 100%)",
  },
  {
    key: "afford",
    icon: "💰",
    bg: "linear-gradient(135deg, #046A38 0%, #1E9E63 100%)",
  },
];

export default function Onboarding({ onComplete }) {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY);
    if (!seen) {
      setVisible(true);
    }
  }, []);

  function finish() {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
    if (onComplete) onComplete();
  }

  function next() {
    if (index < SLIDES.length - 1) {
      setIndex((i) => i + 1);
    } else {
      finish();
    }
  }

  function skip() {
    finish();
  }

  if (!visible) return null;

  const slide = SLIDES[index];
  const isLast = index === SLIDES.length - 1;

  return (
    <AnimatePresence>
      <motion.div
        key="onboarding-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="onboarding-backdrop"
      >
        <motion.div
          key={`slide-${index}`}
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.98 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="onboarding-card"
        >
          {/* Skip button */}
          <button
            type="button"
            onClick={skip}
            className="onboarding-skip"
            aria-label={t("onboarding.skip")}
          >
            {t("onboarding.skip")} ✕
          </button>

          {/* Icon */}
          <div
            className="onboarding-icon"
            style={{ background: slide.bg }}
          >
            <span>{slide.icon}</span>
          </div>

          {/* Content */}
          <h1 className="onboarding-title">
            {t(`onboarding.${slide.key}_title`)}
          </h1>
          <p className="onboarding-subtitle">
            {t(`onboarding.${slide.key}_subtitle`)}
          </p>

          {/* Feature list */}
          <ul className="onboarding-points">
            {(t(`onboarding.${slide.key}_points`, { returnObjects: true }) || [])
              .slice?.(0, 3)
              .map((point, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.08, duration: 0.35 }}
                >
                  <span className="onboarding-check">✓</span>
                  <span>{point}</span>
                </motion.li>
              ))}
          </ul>

          {/* Dots */}
          <div className="onboarding-dots" aria-hidden="true">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                className={`onboarding-dot ${i === index ? "active" : ""}`}
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                type="button"
              />
            ))}
          </div>

          {/* Actions */}
          <div className="onboarding-actions">
            {index > 0 && (
              <button
                type="button"
                onClick={() => setIndex((i) => i - 1)}
                className="btn btn-ghost"
                style={{ padding: "10px 20px", fontSize: 14 }}
              >
                ← {t("onboarding.back")}
              </button>
            )}
            <button
              type="button"
              onClick={next}
              className="btn btn-primary onboarding-next"
            >
              {isLast ? t("onboarding.get_started") : t("onboarding.next")} →
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}