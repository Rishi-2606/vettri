import { useTranslation } from "react-i18next";

const LANGS = [
  { code: "en", label: "English" },
  { code: "ta", label: "தமிழ்" },
  { code: "hi", label: "हिन्दी" },
];

export default function LanguageSelector() {
  const { i18n } = useTranslation();

  return (
    <select
      aria-label="Select language"
      value={i18n.resolvedLanguage || "en"}
      onChange={(e) => i18n.changeLanguage(e.target.value)}
      style={{
        padding: "8px 12px",
        borderRadius: 10,
        border: "1px solid #00000020",
        background: "#fff",
        fontFamily: "inherit",
        cursor: "pointer",
      }}
    >
      {LANGS.map((l) => (
        <option key={l.code} value={l.code}>
          {l.label}
        </option>
      ))}
    </select>
  );
}