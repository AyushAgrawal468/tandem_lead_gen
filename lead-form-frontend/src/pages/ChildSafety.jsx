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

const ChildSafety = () => {
  return (
    <div style={{ minHeight: "100vh", background: "#111111", color: "#F2F2F2", fontFamily: '"Anek Latin", Helvetica, sans-serif', position: "relative" }}>

      <LegalNavbar />

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "clamp(24px, 5vw, 60px) clamp(16px, 4vw, 40px) 80px", position: "relative", zIndex: 60 }}>

        <h1 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: "700", marginBottom: "8px", color: "#F2F2F2" }}>
          Child Safety Standards – Tandem : Events &amp; Experiences
        </h1>
        <p style={{ color: "#969696", fontSize: "14px", marginBottom: "36px" }}>
          Last updated: February 2026 &nbsp;·&nbsp; Orbitandem Technologies Private Limited
        </p>

        <hr style={{ borderColor: "#2a2a2a", marginBottom: "36px" }} />

        <div style={{ fontSize: "clamp(14px, 1.8vw, 17px)", lineHeight: "1.8", color: "#BCBCBC" }}>

          <p>
            Tandem : Events &amp; Experiences is committed to protecting children and preventing any form of
            child sexual abuse and exploitation (CSAE).
          </p>

          <h2 style={sectionHeading}>Our Commitment</h2>

          <p>
            We maintain zero tolerance toward content or behavior that involves
            child sexual abuse or exploitation.
          </p>

          <p style={{ marginTop: "12px" }}>
            The following activities are strictly prohibited on Tandem : Events &amp; Experiences:
          </p>

          <ul style={{ paddingLeft: "20px", listStyleType: "disc", marginTop: "10px" }}>
            <li style={liStyle}>Sexual content involving minors</li>
            <li style={liStyle}>Grooming or solicitation of minors</li>
            <li style={liStyle}>Sharing or requesting explicit images of minors</li>
            <li style={liStyle}>Any activity promoting harm to children</li>
          </ul>

          <p style={{ marginTop: "12px" }}>
            Violations result in immediate account suspension and permanent banning.
          </p>

          <h2 style={sectionHeading}>Safety Measures</h2>

          <ul style={{ paddingLeft: "20px", listStyleType: "disc", marginTop: "10px" }}>
            <li style={liStyle}>We actively moderate content using automated systems and manual review.</li>
            <li style={liStyle}>Users can report inappropriate behavior directly within the app.</li>
            <li style={liStyle}>Reported content is reviewed promptly by our moderation team.</li>
            <li style={liStyle}>We cooperate fully with law enforcement agencies when required.</li>
          </ul>

          <h2 style={sectionHeading}>Reporting</h2>

          <p>
            If you encounter any content that violates our policies, please report it
            immediately in the app or email:
          </p>

          <p style={{ marginTop: "12px" }}>
            <a href="mailto:ayushagrawal468@gmail.com" style={{ color: "#00FFC8", textDecoration: "none", fontWeight: "600" }}>
              ayushagrawal468@gmail.com
            </a>
          </p>

          <h2 style={sectionHeading}>Contact</h2>

          <p>For child safety concerns or compliance inquiries:</p>

          <p style={{ marginTop: "12px" }}>
            Email:{" "}
            <a href="mailto:ayushagrawal468@gmail.com" style={{ color: "#00FFC8", textDecoration: "none" }}>
              ayushagrawal468@gmail.com
            </a>
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

export default ChildSafety;