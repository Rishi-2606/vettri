import { useTranslation } from "react-i18next";
import sihLogo from "../assets/sih-logo.png";
import collegeLogo from "../assets/college-logo.png";

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
          padding: "12px 24px",
          gap: 20,
          flexWrap: "wrap",
        }}
      >
        {/* LEFT — SIH logo (circle) + text */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          <img
            src={sihLogo}
            alt="Smart India Hackathon"
            className="topbar-cm"
            style={{
              height: 90,
              width: 90,
              borderRadius: "50%",
              objectFit: "cover",
              objectPosition: "center",
              border: "3px solid var(--color-gold-500)",
              display: "block",
              background: "#0B1B3A",
              boxShadow: "0 4px 16px rgba(212, 175, 55, 0.45)",
              flexShrink: 0,
            }}
          />

          <div style={{ lineHeight: 1.35 }} className="topbar-govt-text">
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
              Smart India Hackathon 2026
            </div>
            <div
              style={{
                fontSize: 13,
                color: "#E6C15A",
                letterSpacing: 0.3,
              }}
            >
              Adhi College of Engineering and Technology
            </div>
          </div>
        </div>

        {/* RIGHT — College logo in glowing gold rectangular box */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "8px 16px",
            background: "rgba(255, 253, 248, 0.06)",
            border: "2px solid var(--color-gold-500)",
            borderRadius: 10,
            boxShadow:
              "0 0 12px rgba(212, 175, 55, 0.65), 0 0 28px rgba(212, 175, 55, 0.35), inset 0 0 12px rgba(212, 175, 55, 0.15)",
            marginLeft: "auto",
            transition: "box-shadow 300ms ease",
            animation: "goldGlowPulse 3s ease-in-out infinite",
          }}
        >
          <img
            src={collegeLogo}
            alt="Adhi College of Engineering and Technology"
            className="topbar-logo"
            style={{
              height: 60,
              width: "auto",
              maxWidth: 220,
              objectFit: "contain",
              display: "block",
              filter: "drop-shadow(0 2px 6px rgba(0, 0, 0, 0.35))",
            }}
          />
        </div>
      </div>
    </div>
  );
}