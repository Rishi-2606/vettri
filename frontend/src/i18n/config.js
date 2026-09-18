import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./en.json";
import ta from "./ta.json";
import hi from "./hi.json";

const saved =
  typeof window !== "undefined" ? window.localStorage.getItem("vettri.lang") : null;

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ta: { translation: ta },
    hi: { translation: hi },
  },
  lng: saved || "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

// keep <html lang="..."> in sync
i18n.on("languageChanged", (lng) => {
  if (typeof document !== "undefined") {
    document.documentElement.lang = lng;
    window.localStorage.setItem("vettri.lang", lng);
  }
});

export default i18n;