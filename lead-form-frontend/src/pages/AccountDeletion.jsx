import React from "react";

const AccountDeletion = () => {
  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        color: "#111",
        lineHeight: "1.7"
      }}
    >
      <h1 style={{ fontSize: "32px", fontWeight: "700", marginBottom: "20px" }}>
        Tandem Account Deletion
      </h1>

      <p>
        Tandem complies with Google Play Store policies by providing a clear process for users to request
        account and data deletion. This meets obligations under data privacy laws like GDPR and CCPA for
        permanent removal of your profile and associated data.
      </p>

      <h2 style={{ marginTop: "30px", fontSize: "24px", fontWeight: "700" }}>
        Deletion Steps
      </h2>

      <p>To delete your Tandem account and all related data:</p>

      <ul style={{ paddingLeft: "20px" }}>
        <li>• Open the Tandem app on your Android device.</li>
        <li>• Navigate to the Profile section in the bottom navigation menu.</li>
        <li>• Scroll to the bottom and tap Delete Account.</li>
        <li>• Follow the on-screen prompts to confirm, including entering your OTP.</li>
      </ul>

      <p>
        Deletion is permanent and removes your profile, plans, chats, and personal data from our servers
        within 30 days.
      </p>

      <h2 style={{ marginTop: "30px", fontSize: "24px", fontWeight: "700" }}>
        Important Notes
      </h2>

      <ul style={{ paddingLeft: "20px" }}>
        <li>• Back up any important plans or data before deleting, as recovery is not possible.</li>
        <li>• If logged out, log in first to access Profile.</li>
        <li>
          • For questions, contact <strong>support@tandem.app</strong>.
        </li>
      </ul>

      <p>
        This process fully handles data deletion requests as required by Play Store guidelines.
      </p>
    </div>
  );
};

export default AccountDeletion;
