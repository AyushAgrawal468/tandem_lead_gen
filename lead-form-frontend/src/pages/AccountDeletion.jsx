import React from "react";
import LegalNavbar from "../components/LegalNavbar";

const sectionHeading = {
  marginTop: "36px",
  marginBottom: "12px",
  fontSize: "clamp(17px, 2.2vw, 22px)",
  fontWeight: "700",
  color: "#00FFC8",
  letterSpacing: "0.01em",
};

const liStyle = { marginBottom: "10px", paddingLeft: "8px" };

const AccountDeletion = () => {
  return (
    <div style={{ minHeight: "100vh", background: "#111111", color: "#F2F2F2", fontFamily: '"Anek Latin", Helvetica, sans-serif', position: "relative" }}>

      <LegalNavbar />

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "clamp(24px, 5vw, 60px) clamp(16px, 4vw, 40px) 80px", position: "relative", zIndex: 60 }}>

        <h1 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: "700", marginBottom: "8px", color: "#F2F2F2" }}>
          Tandem Account Deletion
        </h1>
        <p style={{ color: "#969696", fontSize: "14px", marginBottom: "36px" }}>
          Orbitandem Technologies Private Limited
        </p>

        <hr style={{ borderColor: "#2a2a2a", marginBottom: "36px" }} />

        <div style={{ fontSize: "clamp(14px, 1.8vw, 17px)", lineHeight: "1.8", color: "#BCBCBC" }}>

          <p>
            Tandem complies with Google Play Store policies by providing a clear process for users to request
            account and data deletion. This meets obligations under data privacy laws like GDPR and CCPA for
            permanent removal of your profile and associated data.
          </p>

          <h2 style={sectionHeading}>Deletion Steps</h2>

          <p>To delete your Tandem account and all related data:</p>

          <ul style={{ paddingLeft: "20px", listStyleType: "disc", marginTop: "10px" }}>
            <li style={liStyle}>Open the Tandem app on your Android device.</li>
            <li style={liStyle}>Navigate to the Profile section in the bottom navigation menu.</li>
            <li style={liStyle}>Scroll to the bottom and tap Delete Account.</li>
            <li style={liStyle}>Follow the on-screen prompts to confirm, including entering your OTP.</li>
          </ul>

          <p style={{ marginTop: "12px" }}>
            Deletion is permanent and removes your profile, plans, chats, and personal data from our servers
            within 30 days.
          </p>

          <h2 style={sectionHeading}>Important Notes</h2>

          <ul style={{ paddingLeft: "20px", listStyleType: "disc", marginTop: "10px" }}>
            <li style={liStyle}>Back up any important plans or data before deleting, as recovery is not possible.</li>
            <li style={liStyle}>If logged out, log in first to access Profile.</li>
            <li style={liStyle}>
              For questions, contact{" "}
              <a href="mailto:support@tandem.app" style={{ color: "#00FFC8", textDecoration: "none" }}>
                support@tandem.app
              </a>.
            </li>
          </ul>

          <p style={{ marginTop: "12px" }}>
            This process fully handles data deletion requests as required by Play Store guidelines.
          </p>

        </div>

        <hr style={{ borderColor: "#2a2a2a", marginTop: "60px", marginBottom: "24px" }} />
        <p style={{ color: "#969696", fontSize: "13px" }}>
          By using Tandem, you acknowledge that you have read, understood, and agree to be bound by
          these Terms &amp; Conditions.
        </p>

      </div>
    </div>
  );
};

export default AccountDeletion;