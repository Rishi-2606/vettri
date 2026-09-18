import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Terms() {
  const { t } = useTranslation();

  return (
    <section className="container" style={{ padding: "60px 24px", maxWidth: 820 }}>
      <Link to="/" style={{ fontSize: 13, color: "var(--color-muted)" }}>
        ← {t("legal.back")}
      </Link>

      <h1 style={{ marginTop: 16 }}>Terms of Service</h1>
      <p style={{ color: "var(--color-muted)", fontSize: 13 }}>
        Last updated: 16 September 2026
      </p>

      <div className="legal-content">
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using Vettri Scheme Matching ("Vettri", "the
          Platform"), you agree to these Terms of Service. If you do not agree,
          you must not use the Platform.
        </p>

        <h2>2. Description of Service</h2>
        <p>
          Vettri provides information about government schemes available to
          entrepreneurs in Tamil Nadu and India, along with:
        </p>
        <ul>
          <li>Personalised scheme recommendations</li>
          <li>Eligibility estimates</li>
          <li>Document checklists</li>
          <li>Loan affordability estimates</li>
        </ul>
        <p>
          <strong>
            Vettri is an information platform only. We are not a lender,
            financial advisor, government agent, or scheme application
            facilitator.
          </strong>
        </p>

        <h2>3. Independence Disclaimer</h2>
        <p>
          Vettri is{" "}
          <strong>
            not affiliated with the Government of Tamil Nadu or any government
            department
          </strong>
          . All scheme details are sourced from public government portals. We
          do not represent the government in any capacity.
        </p>

        <h2>4. Eligibility</h2>
        <p>
          You must be at least 18 years old and legally capable of entering
          into contracts under the Indian Contract Act, 1872, to use Vettri.
        </p>

        <h2>5. Your Responsibilities</h2>
        <p>You agree to:</p>
        <ul>
          <li>Provide accurate, current, and complete information</li>
          <li>Keep your account credentials secure</li>
          <li>Not use the Platform for unlawful purposes</li>
          <li>
            Not attempt to scrape, copy, or redistribute our scheme database
            without permission
          </li>
          <li>Not impersonate others or misrepresent your affiliation</li>
          <li>
            <strong>
              Verify all scheme information on the official government source
              before applying
            </strong>
          </li>
        </ul>

        <h2>6. Account Security</h2>
        <p>
          You are responsible for all activity on your account. If you suspect
          unauthorized access, contact us immediately at{" "}
          <strong>security@vettri.in</strong>.
        </p>

        <h2>7. Accuracy of Information</h2>
        <p>
          Government scheme rules, eligibility criteria, loan limits, and
          interest rates <strong>change frequently</strong>. While we verify
          scheme data on a best-effort basis,{" "}
          <strong>
            we do not guarantee the accuracy, completeness, or currency of any
            information
          </strong>
          . You must verify all details with the official source before acting.
        </p>

        <h2>8. No Guarantee of Eligibility or Approval</h2>
        <p>
          Vettri's recommendations and match scores are{" "}
          <strong>estimates only</strong>. We do not guarantee that you will be
          found eligible, approved, or receive any funds from any scheme. Final
          decisions rest solely with the relevant government department or
          lending institution.
        </p>

        <h2>9. Loan Affordability Estimates</h2>
        <p>
          Any loan affordability calculation is a mathematical estimate based
          on the information you provide. It is{" "}
          <strong>not financial advice</strong>. Consult a qualified financial
          advisor before taking any loan.
        </p>

        <h2>10. Intellectual Property</h2>
        <p>
          The Vettri name, logo, design, and underlying code are owned by us.
          Scheme data is sourced from public government portals. You may not
          reproduce, modify, or redistribute our content without written
          permission.
        </p>

        <h2>11. Third-Party Links</h2>
        <p>
          We link to official government portals for your convenience. We are
          not responsible for their content, availability, or privacy
          practices.
        </p>

        <h2>12. Prohibited Uses</h2>
        <p>You must not:</p>
        <ul>
          <li>Use the Platform for any illegal purpose</li>
          <li>Attempt to gain unauthorized access to our systems</li>
          <li>Upload malware, viruses, or harmful code</li>
          <li>Harass, abuse, or harm other users</li>
          <li>Use bots or automated tools to scrape the Platform</li>
          <li>Misrepresent Vettri's relationship with the government</li>
        </ul>

        <h2>13. Disclaimer of Warranties</h2>
        <p>
          The Platform is provided <strong>"as is"</strong> and{" "}
          <strong>"as available"</strong>. We make no warranties, express or
          implied, regarding the Platform's availability, accuracy, or fitness
          for any purpose.
        </p>

        <h2>14. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, Vettri shall not be liable
          for any indirect, incidental, special, consequential, or punitive
          damages arising from your use of the Platform, including but not
          limited to lost profits, missed scheme opportunities, or reliance on
          inaccurate information.
        </p>

        <h2>15. Indemnification</h2>
        <p>
          You agree to indemnify and hold Vettri harmless from any claims,
          damages, or expenses arising from your use of the Platform or
          violation of these Terms.
        </p>

        <h2>16. Termination</h2>
        <p>
          We may suspend or terminate your account if you violate these Terms.
          You may delete your account at any time.
        </p>

        <h2>17. Changes to Terms</h2>
        <p>
          We may update these Terms. Continued use of the Platform after
          changes constitutes acceptance.
        </p>

        <h2>18. Governing Law & Jurisdiction</h2>
        <p>
          These Terms are governed by the laws of India. Disputes will be
          subject to the exclusive jurisdiction of the courts of Tamil Nadu.
        </p>

        <h2>19. Contact</h2>
        <p>
          Questions about these Terms?
          <br />
          Email: <strong>legal@vettri.in</strong>
        </p>
      </div>
    </section>
  );
}