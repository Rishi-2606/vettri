import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Cookies() {
  const { t } = useTranslation();

  return (
    <section className="container" style={{ padding: "60px 24px", maxWidth: 820 }}>
      <Link to="/" style={{ fontSize: 13, color: "var(--color-muted)" }}>
        ← {t("legal.back")}
      </Link>

      <h1 style={{ marginTop: 16 }}>Cookie Notice</h1>
      <p style={{ color: "var(--color-muted)", fontSize: 13 }}>
        Last updated: 16 September 2026
      </p>

      <div className="legal-content">
        <h2>What Are Cookies?</h2>
        <p>
          Cookies are small text files stored on your device by your browser.
          They help websites remember your preferences and keep you signed in.
        </p>

        <h2>Cookies We Use</h2>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 12 }}>
          <thead>
            <tr style={{ background: "var(--color-navy-100)" }}>
              <th style={{ padding: 10, textAlign: "left" }}>Cookie / Storage</th>
              <th style={{ padding: 10, textAlign: "left" }}>Purpose</th>
              <th style={{ padding: 10, textAlign: "left" }}>Duration</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: 10, borderTop: "1px solid #00000010" }}>
                vettri.auth
              </td>
              <td style={{ padding: 10, borderTop: "1px solid #00000010" }}>
                Keeps you signed in
              </td>
              <td style={{ padding: 10, borderTop: "1px solid #00000010" }}>
                Session
              </td>
            </tr>
            <tr>
              <td style={{ padding: 10, borderTop: "1px solid #00000010" }}>
                vettri.lang
              </td>
              <td style={{ padding: 10, borderTop: "1px solid #00000010" }}>
                Remembers your language (English / Tamil / Hindi)
              </td>
              <td style={{ padding: 10, borderTop: "1px solid #00000010" }}>
                1 year
              </td>
            </tr>
            <tr>
              <td style={{ padding: 10, borderTop: "1px solid #00000010" }}>
                vettri.profile
              </td>
              <td style={{ padding: 10, borderTop: "1px solid #00000010" }}>
                Stores your profile form data locally
              </td>
              <td style={{ padding: 10, borderTop: "1px solid #00000010" }}>
                Until you delete
              </td>
            </tr>
          </tbody>
        </table>

        <h2>Third-Party Cookies</h2>
        <p>
          We do not use third-party advertising or tracking cookies. If we add
          analytics (e.g., Vercel Analytics), they are privacy-respecting and
          cookie-free.
        </p>

        <h2>Managing Cookies</h2>
        <p>
          You can block or delete cookies through your browser settings.
          However, disabling essential cookies may break login and language
          preferences.
        </p>

        <h2>Contact</h2>
        <p>
          Questions? Email <strong>privacy@vettri.in</strong>.
        </p>
      </div>
    </section>
  );
}