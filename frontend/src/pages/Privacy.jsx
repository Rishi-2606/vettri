import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Privacy() {
  const { t } = useTranslation();

  return (
    <section className="container" style={{ padding: "60px 24px", maxWidth: 820 }}>
      <Link to="/" style={{ fontSize: 13, color: "var(--color-muted)" }}>
        ← {t("legal.back")}
      </Link>

      <h1 style={{ marginTop: 16 }}>Privacy Policy</h1>
      <p style={{ color: "var(--color-muted)", fontSize: 13 }}>
        Last updated: 16 September 2026
      </p>

      <div className="legal-content">
        <h2>1. Introduction</h2>
        <p>
          Vettri Scheme Matching ("we", "our", "us") is an independent
          information platform that helps entrepreneurs in Tamil Nadu discover
          government schemes they may be eligible for. This Privacy Policy
          explains how we collect, use, store, and protect your personal data,
          in accordance with the{" "}
          <strong>Digital Personal Data Protection Act, 2023</strong> ("DPDP
          Act") and other applicable Indian laws.
        </p>
        <p>
          By using Vettri, you consent to the practices described in this
          policy. If you do not agree, please do not use the platform.
        </p>

        <h2>2. Who We Are</h2>
        <p>
          Vettri Scheme Matching is an independent youth-developed project and
          is{" "}
          <strong>
            not affiliated with the Government of Tamil Nadu or any government
            department
          </strong>
          . All scheme information is sourced from publicly available
          government portals and is verified on a best-effort basis.
        </p>

        <h2>3. What Data We Collect</h2>
        <p>We collect the following categories of data:</p>
        <ul>
          <li>
            <strong>Account data:</strong> name, email address, password
            (hashed)
          </li>
          <li>
            <strong>Profile data:</strong> age, gender, community category,
            district, annual income, education status
          </li>
          <li>
            <strong>Business data:</strong> business type, business idea,
            project cost, funding requirements
          </li>
          <li>
            <strong>Usage data:</strong> pages visited, schemes viewed,
            language preference, device type
          </li>
          <li>
            <strong>Communications:</strong> any messages you send us via
            contact forms
          </li>
        </ul>

        <h2>4. How We Use Your Data</h2>
        <ul>
          <li>To provide scheme recommendations tailored to your profile</li>
          <li>To check your eligibility against scheme criteria</li>
          <li>To generate personalised document checklists</li>
          <li>To compute loan affordability estimates</li>
          <li>To send you notifications if you opt in</li>
          <li>To improve the platform through aggregated analytics</li>
          <li>To respond to your queries and feedback</li>
          <li>To comply with legal obligations</li>
        </ul>

        <h2>5. Legal Basis for Processing</h2>
        <p>
          Under the DPDP Act 2023, we process your personal data on the basis
          of your <strong>free, specific, informed, unconditional, and
          unambiguous consent</strong> given at the time of registration. You
          may withdraw consent at any time by deleting your account.
        </p>

        <h2>6. What We Do Not Do</h2>
        <ul>
          <li>We do not sell your personal data to third parties</li>
          <li>We do not use your data for targeted advertising</li>
          <li>We do not share your data with government agencies without a lawful order</li>
          <li>We do not store your Aadhaar number in full</li>
          <li>We do not process payments on this platform</li>
        </ul>

        <h2>7. Data Sharing</h2>
        <p>We share data only in these limited cases:</p>
        <ul>
          <li>
            <strong>Service providers:</strong> cloud hosting, database, email
            delivery. These providers are contractually bound to protect your
            data.
          </li>
          <li>
            <strong>Legal compliance:</strong> when required by Indian law or a
            valid court order.
          </li>
          <li>
            <strong>Aggregated analytics:</strong> anonymised, non-identifiable
            statistics may be shared publicly.
          </li>
        </ul>

        <h2>8. Data Retention</h2>
        <p>
          We retain your personal data as long as your account is active. If
          you delete your account, we permanently delete your data within{" "}
          <strong>30 days</strong>, except where required by law for a longer
          period. Aggregated anonymous statistics may be retained
          indefinitely.
        </p>

        <h2>9. Your Rights</h2>
        <p>Under the DPDP Act, you have the right to:</p>
        <ul>
          <li><strong>Access</strong> your personal data</li>
          <li><strong>Correct</strong> inaccurate data</li>
          <li><strong>Delete</strong> your data ("right to erasure")</li>
          <li><strong>Withdraw consent</strong> at any time</li>
          <li><strong>Nominate</strong> someone to exercise rights on your behalf</li>
          <li>
            <strong>Grievance redressal</strong> — file a complaint with our
            Grievance Officer
          </li>
        </ul>
        <p>
          To exercise any of these rights, email{" "}
          <strong>privacy@vettri.in</strong>.
        </p>

        <h2>10. Data Security</h2>
        <p>
          We use industry-standard security measures: HTTPS/TLS encryption in
          transit, encrypted storage at rest, hashed passwords (Argon2), access
          controls, and regular security audits. However, no system is 100%
          secure, and we cannot guarantee absolute security.
        </p>

        <h2>11. Children</h2>
        <p>
          Vettri is not intended for users under the age of 18. We do not
          knowingly collect data from minors. If you believe a minor has
          registered, contact us and we will delete the account.
        </p>

        <h2>12. Cookies</h2>
        <p>
          We use essential cookies (for login sessions, language preference).
          We do not use advertising or tracking cookies. See our{" "}
          <Link to="/cookies">Cookie Notice</Link> for details.
        </p>

        <h2>13. Changes to This Policy</h2>
        <p>
          We may update this policy from time to time. Material changes will be
          notified via email or a prominent notice on the platform. The "Last
          updated" date at the top reflects the latest revision.
        </p>

        <h2>14. Governing Law</h2>
        <p>
          This policy is governed by the laws of India. Any disputes will be
          subject to the exclusive jurisdiction of the courts of Tamil Nadu.
        </p>

        <h2>15. Grievance Officer</h2>
        <p>
          In accordance with the DPDP Act 2023 and the IT Rules, 2021, we have
          appointed a Grievance Officer:
        </p>
        <ul>
          <li><strong>Name:</strong> Grievance Officer, Virtual Warrior</li>
          <li><strong>Designation:</strong> Grievance Officer</li>
          <li><strong>Email:</strong> grievance@vettri.in</li>
          <li><strong>Response time:</strong> Within 15 working days</li>
        </ul>

        <h2>16. Contact</h2>
        <p>
          For questions about this Privacy Policy:
          <br />
          Email: <strong>privacy@vettri.in</strong>
        </p>
      </div>
    </section>
  );
}