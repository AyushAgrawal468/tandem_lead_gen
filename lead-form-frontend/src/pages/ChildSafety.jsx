import React from "react";

const ChildSafety = () => {
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
        Child Safety Standards – Tandem : Events & Experiences
      </h1>

      <p style={{ fontSize: "clamp(14px, 1.8vw, 18px)" }}>
        Tandem : Events & Experiences is committed to protecting children and preventing any form of
        child sexual abuse and exploitation (CSAE).
      </p>

      {/* Commitment */}
      <h2
        style={{
          marginTop: "30px",
          fontSize: "clamp(18px, 2.5vw, 24px)",
          fontWeight: "700"
        }}
      >
        Our Commitment
      </h2>

      <p style={{ fontSize: "clamp(14px, 1.8vw, 18px)" }}>
        We maintain zero tolerance toward content or behavior that involves
        child sexual abuse or exploitation.
      </p>

      <p style={{ fontSize: "clamp(14px, 1.8vw, 18px)" }}>
        The following activities are strictly prohibited on Tandem : Events & Experiences:
      </p>

      <ul style={{ paddingLeft: "22px", fontSize: "clamp(14px, 1.8vw, 18px)" }}>
        <li>• Sexual content involving minors</li>
        <li>• Grooming or solicitation of minors</li>
        <li>• Sharing or requesting explicit images of minors</li>
        <li>• Any activity promoting harm to children</li>
      </ul>

      <p style={{ fontSize: "clamp(14px, 1.8vw, 18px)" }}>
        Violations result in immediate account suspension and permanent banning.
      </p>

      {/* Safety Measures */}
      <h2
        style={{
          marginTop: "30px",
          fontSize: "clamp(18px, 2.5vw, 24px)",
          fontWeight: "700"
        }}
      >
        Safety Measures
      </h2>

      <ul style={{ paddingLeft: "22px", fontSize: "clamp(14px, 1.8vw, 18px)" }}>
        <li>• We actively moderate content using automated systems and manual review.</li>
        <li>• Users can report inappropriate behavior directly within the app.</li>
        <li>• Reported content is reviewed promptly by our moderation team.</li>
        <li>• We cooperate fully with law enforcement agencies when required.</li>
      </ul>

      {/* Reporting */}
      <h2
        style={{
          marginTop: "30px",
          fontSize: "clamp(18px, 2.5vw, 24px)",
          fontWeight: "700"
        }}
      >
        Reporting
      </h2>

      <p style={{ fontSize: "clamp(14px, 1.8vw, 18px)" }}>
        If you encounter any content that violates our policies, please report it
        immediately in the app or email:
      </p>

      <p style={{ fontSize: "clamp(14px, 1.8vw, 18px)", fontWeight: "600" }}>
        ayushagrawal468@gmail.com
      </p>

      {/* Contact */}
      <h2
        style={{
          marginTop: "30px",
          fontSize: "clamp(18px, 2.5vw, 24px)",
          fontWeight: "700"
        }}
      >
        Contact
      </h2>

      <p style={{ fontSize: "clamp(14px, 1.8vw, 18px)" }}>
        For child safety concerns or compliance inquiries:
      </p>

      <p style={{ fontSize: "clamp(14px, 1.8vw, 18px)" }}>
        Email: <strong>ayushagrawal468@gmail.com</strong>
        <br />
        
      </p>

      <p
        style={{
          marginTop: "40px",
          fontSize: "14px",
          color: "#666"
        }}
      >
        Last updated: February 2026
      </p>
    </div>
  );
};

export default ChildSafety;
