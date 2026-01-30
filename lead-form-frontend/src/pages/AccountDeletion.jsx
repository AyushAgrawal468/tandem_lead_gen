import React from "react";

const AccountDeletion = () => {
  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        padding: "clamp(16px, 4vw, 40px)",
        fontFamily: "Arial, sans-serif",
        color: "#111",
        lineHeight: "1.7"
      }}
    >
      <h1
        style={{
          fontSize: "clamp(24px, 4vw, 36px)",
          fontWeight: "700",
          marginBottom: "20px"
        }}
      >
        Tandem Account Deletion
      </h1>

      <p style={{ fontSize: "clamp(14px, 1.8vw, 18px)" }}>
        Tandem complies with Google Play Store policies by providing a clear process for users to request
        account and data deletion. This meets obligations under data privacy laws like GDPR and CCPA for
        permanent removal of your profile and associated data.
      </p>

      <h2
        style={{
          marginTop: "30px",
          fontSize: "clamp(18px, 2.5vw, 24px)",
          fontWeight: "700"
        }}
      >
        Deletion Steps
      </h2>

      <p style={{ fontSize: "clamp(14px, 1.8vw, 18px)" }}>
        To delete your Tandem account and all related data:
      </p>

      <ul style={{ paddingLeft: "22px", fontSize: "clamp(14px, 1.8vw, 18px)" }}>
        <li>•Open the Tandem app on your Android device.</li>
        <li>•Navigate to the Profile section in the bottom navigation menu.</li>
        <li>•Scroll to the bottom and tap Delete Account.</li>
        <li>•Follow the on-screen prompts to confirm, including entering your OTP.</li>
      </ul>

      <p style={{ fontSize: "clamp(14px, 1.8vw, 18px)" }}>
        Deletion is permanent and removes your profile, plans, chats, and personal data from our servers
        within 30 days.
      </p>

      <h2
        style={{
          marginTop: "30px",
          fontSize: "clamp(18px, 2.5vw, 24px)",
          fontWeight: "700"
        }}
      >
        Important Notes
      </h2>

      <ul style={{ paddingLeft: "22px", fontSize: "clamp(14px, 1.8vw, 18px)" }}>
        <li>•Back up any important plans or data before deleting, as recovery is not possible.</li>
        <li>•If logged out, log in first to access Profile.</li>
        <li>
          •For questions, contact <strong>support@tandem.app</strong>.
        </li>
      </ul>

      <p style={{ fontSize: "clamp(14px, 1.8vw, 18px)" }}>
        This process fully handles data deletion requests as required by Play Store guidelines.
      </p>
    </div>
  );
};

export default AccountDeletion;
