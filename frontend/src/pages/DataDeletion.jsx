import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function DataDeletion() {
  const { t } = useTranslation();

  return (
    <section className="container" style={{ padding: "60px 24px", maxWidth: 820 }}>
      <Link to="/" style={{ fontSize: 13, color: "var(--color-muted)" }}>
        ← {t("legal.back")}
      </Link>

      <h1 style={{ marginTop: 16 }}>Delete Your Data</h1>
      <p style={{ color: "var(--color-muted)", fontSize: 13 }}>
        Last updated: 16 September 2026
      </p>

      <div className="legal-content">
        <h2>Your Right to Erasure</h2>
        <p>
          Under the Digital Personal Data Protection Act, 2023, you have the
          right to request deletion of your personal data.
        </p>

        <h2>How to Delete Your Data</h2>

        <h3>Option 1 — Email us</h3>
        <p>
          Send an email to <strong>privacy@vettri.in</strong> with:
        </p>
        <ul>
          <li>Subject: "Data Deletion Request"</li>
          <li>Your registered email address</li>
          <li>Reason (optional)</li>
        </ul>
        <p>
          We will confirm within 3 working days and complete the deletion
          within 30 days.
        </p>

        <h3>Option 2 — Contact the Grievance Officer</h3>
        <p>
          If you do not receive a response within 7 days, escalate to{" "}
          <strong>grievance@vettri.in</strong>.
        </p>

        <h2>What Gets Deleted</h2>
        <ul>
          <li>Account information (name, email, password)</li>
          <li>Profile data (age, income, category, district)</li>
          <li>Business details (business idea, project cost)</li>
          <li>Document checklist progress</li>
          <li>Saved recommendations and feedback</li>
          <li>All usage history linked to your account</li>
        </ul>

        <h2>What We Retain</h2>
        <p>We may retain:</p>
        <ul>
          <li>
            Anonymised, aggregated statistics that cannot identify you
            (e.g., "10,000 users searched for dairy schemes")
          </li>
          <li>
            Records required by law (e.g., tax records, court orders), which
            will be deleted after the legal retention period
          </li>
        </ul>

        <h2>Contact</h2>
        <p>
          For questions: <strong>privacy@vettri.in</strong>
        </p>
      </div>
    </section>
  );
}