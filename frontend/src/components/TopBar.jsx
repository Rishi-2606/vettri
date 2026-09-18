import { useTranslation } from "react-i18next";
import tnEmblem from "../assets/tn-emblem.jpg";
import cmPortrait from "../assets/cm-portrait.png";
import vettriLogo from "../assets/vettri-logo.png";

export default function TopBar() {
  const { t } = useTranslation();

  return (
    <div
      style={{
        background:
          "linear-gradient(90deg, #0B1B3A 0%, #122B57 50%, #0B1B3A 100%)",
        color: "#F6D67A",
        fontSize: 13,
        borderBottom: "2px solid var(--color-gold-500)",
      }}
    >
      <div
        className="container topbar-inner"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 24px",
          gap: 20,
          flexWrap: "wrap",
        }}
      >
        {/* LEFT — TN emblem + CM portrait + govt text */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <img
            src={tnEmblem}
            alt="Tamil Nadu Emblem"
            className="topbar-emblem"
            style={{
              height: 90,
              width: 90,
              objectFit: "contain",
              display: "block",
              filter: "drop-shadow(0 4px 12px rgba(212, 175, 55, 0.35))",
            }}
          />

          <img
            src={cmPortrait}
            alt="Hon'ble Chief Minister of Tamil Nadu"
            className="topbar-cm"
            style={{
              height: 90,
              width: 90,
              borderRadius: "50%",
              objectFit: "cover",
              objectPosition: "top center",
              border: "3px solid var(--color-gold-500)",
              display: "block",
              background: "#0B1B3A",
              boxShadow: "0 4px 16px rgba(212, 175, 55, 0.45)",
            }}
          />

          <div style={{ lineHeight: 1.3 }} className="topbar-govt-text">
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 20,
                letterSpacing: 0.5,
                color: "#F6D67A",
                textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)",
              }}
            >
              {t("topbar.govt")}
            </div>
            <div
              style={{
                fontSize: 13,
                color: "#E6C15A",
                letterSpacing: 0.3,
              }}
            >
              {t("topbar.tagline")}
            </div>
          </div>
        </div>

        {/* RIGHT — Vettri logo only (no box) */}
        <img
          src={vettriLogo}
          alt="Vettri"
          className="topbar-logo"
          style={{
            height: 70,
            width: "auto",
            maxWidth: 260,
            objectFit: "contain",
            display: "block",
            filter: "drop-shadow(0 2px 10px rgba(246, 214, 122, 0.3))",
          }}
        />
      </div>
    </div>
  );
}