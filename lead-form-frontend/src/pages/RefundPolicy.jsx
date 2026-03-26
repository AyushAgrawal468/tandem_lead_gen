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

const subHeading = {
  marginTop: "28px",
  marginBottom: "10px",
  fontSize: "clamp(14px, 1.8vw, 18px)",
  fontWeight: "700",
  color: "#00FFC8",
};

const liStyle = { marginBottom: "10px", paddingLeft: "8px" };

const callout = {
  border: "1px solid #2a2a2a",
  borderLeft: "3px solid #00FFC8",
  borderRadius: "6px",
  background: "rgba(0,255,200,0.04)",
  padding: "16px 20px",
  margin: "20px 0",
  fontSize: "clamp(13px, 1.6vw, 15px)",
  lineHeight: "1.7",
  color: "#969696",
  fontStyle: "italic",
};

const calloutTitle = {
  fontStyle: "normal",
  fontWeight: "700",
  color: "#BCBCBC",
  display: "block",
  marginBottom: "8px",
  fontSize: "clamp(13px, 1.6vw, 15px)",
};

const contactTable = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "16px",
  marginBottom: "16px",
  fontSize: "clamp(13px, 1.6vw, 15px)",
};

const RefundPolicy = () => {
  return (
    <div style={{ minHeight: "100vh", background: "#111111", color: "#F2F2F2", fontFamily: '"Anek Latin", Helvetica, sans-serif', position: "relative" }}>

      <LegalNavbar />

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "clamp(24px, 5vw, 60px) clamp(16px, 4vw, 40px) 80px", position: "relative", zIndex: 60 }}>

        <h1 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: "700", marginBottom: "8px", color: "#F2F2F2" }}>
          Refund Policy
        </h1>
        <p style={{ color: "#969696", fontSize: "14px", marginBottom: "4px" }}>
          Orbitandem Technologies Private Limited
        </p>
        <p style={{ color: "#969696", fontSize: "13px", marginBottom: "36px" }}>
          Effective Date: 24 March 2026 &nbsp;|&nbsp; Last Updated: 24 March 2026
        </p>

        <hr style={{ borderColor: "#2a2a2a", marginBottom: "36px" }} />

        <div style={{ fontSize: "clamp(14px, 1.8vw, 17px)", lineHeight: "1.8", color: "#BCBCBC" }}>

          {/* 1 */}
          <h2 style={sectionHeading}>1. Introduction &amp; Scope</h2>
          <p>
            This Refund Policy ("Policy") is published by Orbitandem Technologies Private Limited, the
            company behind Tandem: Events &amp; Experiences ("Tandem", "we", "us", or "our"), a phygital
            social-networking platform that lets users discover events and experiences, swipe to express
            interest, and connect with friends and contacts who share the same preferences.
          </p>
          <p style={{ marginTop: "14px" }}>
            This Policy applies to all purchases made on or through Tandem, including the Tandem website,
            iOS application, and Android application (collectively, the "Platform"). Depending on the nature
            of your purchase and the channel through which it was made, different rules apply. Please read
            this Policy in full before completing any transaction on the Platform.
          </p>
          <p style={{ marginTop: "14px" }}>
            By making a purchase on the Platform, you confirm that you have read, understood, and agree
            to this Policy.
          </p>

          {/* 2 */}
          <h2 style={sectionHeading}>2. Types of Purchases &amp; Applicable Refund Rules</h2>
          <p>
            Tandem offers several categories of paid products and services. The refund rules for each
            category are set out below.
          </p>

          <h3 style={subHeading}>2.1 Subscriptions (Premium Plans)</h3>
          <ul style={{ paddingLeft: "20px", listStyleType: "disc", marginTop: "10px" }}>
            <li style={liStyle}>Tandem subscription plans (monthly or annual) may be cancelled by the user at any time through the Platform or the relevant app store settings.</li>
            <li style={liStyle}>Upon cancellation, your subscription will not be renewed at the next billing cycle. You will, however, retain access to all premium features until the last day of your current paid billing period.</li>
            <li style={liStyle}>No partial or pro-rated refunds will be issued for the unused portion of a billing cycle, except where required by applicable law.</li>
            <li style={liStyle}>Annual plan holders who cancel within 7 (seven) days of their initial purchase date (and have not used any premium features) may request a full refund by writing to our support team at{" "}
              <a href="mailto:support@tandem.it.com" style={{ color: "#00FFC8", textDecoration: "none" }}>support@tandem.it.com</a>.
            </li>
          </ul>

          <h3 style={subHeading}>2.2 Event &amp; Experience Tickets — Tandem-Managed Events</h3>
          <ul style={{ paddingLeft: "20px", listStyleType: "disc", marginTop: "10px" }}>
            <li style={liStyle}>Tickets purchased through Tandem for events directly managed or hosted by Tandem may be eligible for a refund, subject to the cancellation window specified at the time of purchase.</li>
            <li style={liStyle}>If no specific cancellation window is stated, requests submitted more than 48 hours before the event start time will be reviewed on a case-by-case basis.</li>
            <li style={liStyle}>No refund will be issued for tickets cancelled within 48 hours of the event start time, or for no-shows (see Section 4).</li>
          </ul>

          <h3 style={subHeading}>2.3 Event &amp; Experience Tickets — Third-Party Hosted Events</h3>
          <ul style={{ paddingLeft: "20px", listStyleType: "disc", marginTop: "10px" }}>
            <li style={liStyle}>For events and experiences listed on Tandem but organised or managed by third-party hosts, the refund policy of the relevant host or organiser applies.</li>
            <li style={liStyle}>Tandem acts solely as a discovery and booking facilitator in such cases and is not responsible for processing or honouring refunds on behalf of third-party organisers.</li>
            <li style={liStyle}>Users are strongly advised to review the organiser's refund terms before purchasing tickets for third-party events.</li>
            <li style={liStyle}>Where a third-party organiser cancels a paid event, the provisions of Section 3 below apply.</li>
          </ul>

          <h3 style={subHeading}>2.4 In-App Credits &amp; Virtual Currency</h3>
          <ul style={{ paddingLeft: "20px", listStyleType: "disc", marginTop: "10px" }}>
            <li style={liStyle}>In-app credits or virtual currency credited to your Tandem account are granted on a rolling basis.</li>
            <li style={liStyle}>Credits expire 6 (six) months from the date they are credited to your account if unused. Each credit batch carries its own 6-month expiry calculated from its individual credit date.</li>
            <li style={liStyle}>Expired credits cannot be reinstated or refunded.</li>
            <li style={liStyle}>Credits that have been used or applied towards a purchase are non-refundable.</li>
            <li style={liStyle}>Unused, non-expired credits are generally non-refundable except in the case of account closure initiated by Tandem without cause, in which case Tandem will review refund eligibility at its sole discretion.</li>
          </ul>

          <h3 style={subHeading}>2.5 One-Time Feature Purchases</h3>
          <ul style={{ paddingLeft: "20px", listStyleType: "disc", marginTop: "10px" }}>
            <li style={liStyle}>One-time in-app feature purchases (such as event boosts, spotlight placements, or similar consumable features) are non-refundable once purchased, regardless of whether they have been used.</li>
            <li style={liStyle}>These features are made available to you immediately upon purchase and are therefore consumed at the point of sale.</li>
          </ul>

          {/* 3 */}
          <h2 style={sectionHeading}>3. Event Cancellations by Hosts or Organisers</h2>
          <p>
            If a paid event or experience listed on the Platform is cancelled by the host or organiser
            (whether Tandem-managed or third-party), the following rules apply:
          </p>
          <ul style={{ paddingLeft: "20px", listStyleType: "disc", marginTop: "10px" }}>
            <li style={liStyle}>All amounts paid by users to book tickets for the cancelled event will be refunded in full.</li>
            <li style={liStyle}>Refunds will be processed within 7 (seven) working days from the date Tandem or the organiser confirms the cancellation.</li>
            <li style={liStyle}>Refunds will be credited to the original payment method used at the time of booking (see Section 7).</li>
            <li style={liStyle}>Tandem will make reasonable efforts to notify affected users of the cancellation and the refund timeline by email and/or in-app notification.</li>
            <li style={liStyle}>In cases where an event is postponed or rescheduled rather than cancelled outright, Tandem will communicate available options (attend the rescheduled event or request a refund) and users will have a reasonable window to decide, as communicated at the time.</li>
          </ul>

          <div style={callout}>
            <span style={calloutTitle}>Important Note on Third-Party Cancellations</span>
            Where a third-party organiser cancels an event, Tandem will facilitate the refund process to the best
            of its ability. However, Tandem's ability to issue refunds is contingent on receiving the corresponding
            funds from the organiser. Tandem shall not be held liable for delays caused by a third-party
            organiser's failure to remit funds in a timely manner.
          </div>

          {/* 4 */}
          <h2 style={sectionHeading}>4. No-Show Policy</h2>
          <p>
            If you have purchased a ticket and do not attend the event or experience — whether because
            you forgot, were unable to make it, or for any other personal reason — your ticket is
            non-refundable. No exceptions will be made for no-shows. We encourage users to carefully
            review event details and ensure availability before purchasing tickets.
          </p>

          {/* 5 */}
          <h2 style={sectionHeading}>5. Platform-Specific Refund Rules (iOS &amp; Android)</h2>
          <p>
            Purchases made through the Apple App Store or Google Play Store are subject to the
            respective refund policies of Apple Inc. and Google LLC. Tandem does not control, and cannot
            override, the refund policies of these third-party platforms.
          </p>

          <h3 style={subHeading}>5.1 Apple App Store (iOS)</h3>
          <ul style={{ paddingLeft: "20px", listStyleType: "disc", marginTop: "10px" }}>
            <li style={liStyle}>If you purchased a Tandem subscription or in-app purchase through the Apple App Store, any refund request must be submitted directly to Apple.</li>
            <li style={liStyle}>You may request a refund via <span style={{ color: "#969696" }}>reportaproblem.apple.com</span> or through your Apple ID account settings.</li>
            <li style={liStyle}>Apple's refund decisions are final and are not within Tandem's control.</li>
          </ul>

          <h3 style={subHeading}>5.2 Google Play Store (Android)</h3>
          <ul style={{ paddingLeft: "20px", listStyleType: "disc", marginTop: "10px" }}>
            <li style={liStyle}>If you purchased a Tandem subscription or in-app purchase through Google Play, any refund request must be submitted directly to Google.</li>
            <li style={liStyle}>You may request a refund via <span style={{ color: "#969696" }}>play.google.com/store/account/subscriptions</span> or by contacting Google Play support.</li>
            <li style={liStyle}>Google's refund decisions are final and are not within Tandem's control.</li>
          </ul>

          <div style={callout}>
            <span style={calloutTitle}>Platform Purchases</span>
            For clarity: if you see a charge from "Apple" or "Google Play" on your statement, your purchase was
            processed by that platform and must be refunded through them. If you see a charge from "Tandem"
            or "Orbitandem Technologies" or "Tandem : Events &amp; Experiences", please contact us directly.
          </div>

          {/* 6 */}
          <h2 style={sectionHeading}>6. How to Request a Refund</h2>
          <p>To request a refund for a Tandem-processed purchase, please use one of the following channels:</p>
          <ul style={{ paddingLeft: "20px", listStyleType: "disc", marginTop: "10px" }}>
            <li style={liStyle}>
              <strong style={{ color: "#F2F2F2" }}>Email:</strong> Send your refund request to{" "}
              <a href="mailto:support@tandem.it.com" style={{ color: "#00FFC8", textDecoration: "none" }}>support@tandem.it.com</a>{" "}
              with the subject line "Refund Request — [Your Order ID]".
            </li>
            <li style={liStyle}>
              <strong style={{ color: "#F2F2F2" }}>Help Centre:</strong> Submit a support ticket through the Tandem in-app Help Centre or at tandem.it.com/help.
            </li>
          </ul>
          <p style={{ marginTop: "12px" }}>Please include the following information with your request to help us process it efficiently:</p>
          <ul style={{ paddingLeft: "20px", listStyleType: "circle", marginTop: "10px" }}>
            <li style={liStyle}>Your registered phone number</li>
            <li style={liStyle}>Order ID or transaction reference number</li>
            <li style={liStyle}>Name and date of the event or purchase</li>
            <li style={liStyle}>Reason for the refund request</li>
            <li style={liStyle}>Any supporting documentation (e.g., cancellation confirmation)</li>
          </ul>
          <p style={{ marginTop: "12px" }}>
            We aim to acknowledge all refund requests within <strong style={{ color: "#F2F2F2" }}>3 (three) business days</strong> of receipt.
          </p>

          {/* 7 */}
          <h2 style={sectionHeading}>7. Refund Method &amp; Timeline</h2>
          <ul style={{ paddingLeft: "20px", listStyleType: "disc", marginTop: "10px" }}>
            <li style={liStyle}>Approved refunds will be credited to the original payment method used at the time of the transaction (credit card, debit card, UPI, net banking, or other supported payment method).</li>
            <li style={liStyle}>Tandem does not issue refunds via cash, cheque, or alternative payment methods unless expressly agreed in writing.</li>
            <li style={liStyle}>Once a refund is approved and processed by Tandem, the time taken for the credit to appear in your account depends on your bank or payment provider and is typically <strong style={{ color: "#F2F2F2" }}>5–10 business days</strong>.</li>
            <li style={liStyle}>For event cancellation refunds, please refer to the 7 working-day processing window outlined in Section 3.</li>
            <li style={liStyle}>Tandem reserves the right to deduct applicable payment gateway fees from the refund amount where such fees are non-recoverable by Tandem, and will notify you of any such deduction prior to processing.</li>
          </ul>

          {/* 8 */}
          <h2 style={sectionHeading}>8. Exceptional Circumstances &amp; Limitation of Liability</h2>
          <p>
            Tandem will give reasonable consideration to refund requests arising from the following
            exceptional circumstances, provided they are supported by appropriate evidence:
          </p>
          <ul style={{ paddingLeft: "20px", listStyleType: "disc", marginTop: "10px" }}>
            <li style={liStyle}><strong style={{ color: "#F2F2F2" }}>Technical errors:</strong> Duplicate charges or failed transactions caused directly by a verifiable error in the Tandem Platform or its payment processing systems.</li>
            <li style={liStyle}><strong style={{ color: "#F2F2F2" }}>Unauthorised transactions:</strong> Purchases made as a result of documented unauthorised access to your Tandem account. Users must report such incidents to{" "}
              <a href="mailto:support@tandem.it.com" style={{ color: "#00FFC8", textDecoration: "none" }}>support@tandem.it.com</a>{" "}
              and to the relevant authorities promptly.
            </li>
            <li style={liStyle}><strong style={{ color: "#F2F2F2" }}>Significant service unavailability:</strong> Where a paid feature or ticketed event is rendered wholly inaccessible due to a Tandem platform outage or technical failure attributable to Tandem, and no equivalent remedy (rescheduling or alternative access) is offered.</li>
          </ul>
          <p style={{ marginTop: "16px" }}>The following circumstances do not qualify for a refund under this Policy:</p>
          <ul style={{ paddingLeft: "20px", listStyleType: "disc", marginTop: "10px" }}>
            <li style={liStyle}>Change of mind after purchase.</li>
            <li style={liStyle}>Failure to use a purchased feature, subscription, or ticket.</li>
            <li style={liStyle}>Third-party service disruptions (internet outages, device failures, etc.) outside Tandem's control.</li>
            <li style={liStyle}>Events of force majeure, including natural disasters, pandemics, government restrictions, war, or any circumstances beyond Tandem's reasonable control.</li>
          </ul>

          <div style={callout}>
            <span style={calloutTitle}>Limitation of Liability</span>
            To the fullest extent permitted by applicable law, Orbitandem Technologies Private Limited's total
            liability in connection with any refund claim shall be limited to the amount actually paid by the user for
            the specific purchase in dispute. Tandem shall not be liable for any indirect, incidental, or
            consequential loss arising from any purchase or refund decision.
          </div>

          {/* 9 */}
          <h2 style={sectionHeading}>9. Legal Compliance</h2>
          <p>This Policy is intended to comply with, and should be read in conjunction with, the following legal frameworks:</p>

          <h3 style={subHeading}>9.1 Indian Consumer Protection Act, 2019</h3>
          <p>
            For users in India, this Policy is governed by and complies with the Consumer Protection Act,
            2019, and the rules framed thereunder, including the Consumer Protection (E-Commerce)
            Rules, 2020. Where any provision of this Policy is inconsistent with mandatory consumer rights
            under Indian law, those legal provisions shall prevail.
          </p>

          <h3 style={subHeading}>9.2 App Store &amp; Play Store Policies</h3>
          <p>
            Where purchases are made through the Apple App Store or Google Play Store, Apple's and
            Google's respective developer and consumer policies apply in addition to this Policy. In the
            event of any conflict between this Policy and those platform policies, the platform's policy shall
            prevail for purchases made through that platform.
          </p>

          {/* 10 */}
          <h2 style={sectionHeading}>10. Changes to This Policy</h2>
          <p>
            Tandem reserves the right to update, modify, or replace this Policy at any time, at its sole
            discretion, without prior notice. Changes will be effective immediately upon publication of the
            revised Policy on the Platform.
          </p>
          <p style={{ marginTop: "14px" }}>
            We will make reasonable efforts to notify registered users of material changes via email to the
            address associated with your Tandem account and/or via an in-app notification. Your continued
            use of the Platform following any changes constitutes your acceptance of the revised Policy.
          </p>
          <p style={{ marginTop: "14px" }}>
            We recommend checking this page periodically to stay informed of the current terms.
          </p>

          {/* 11 */}
          <h2 style={sectionHeading}>11. Contact &amp; Dispute Resolution</h2>
          <p>For any refund-related queries, disputes, or concerns, please contact us at:</p>

          <table style={contactTable}>
            <tbody>
              {[
                ["Legal / Refunds", <a href="mailto:legal@tandem.it.com" style={{ color: "#00FFC8", textDecoration: "none" }}>legal@tandem.it.com</a>],
                ["General Support", <><a href="mailto:support@tandem.it.com" style={{ color: "#00FFC8", textDecoration: "none" }}>support@tandem.it.com</a> &nbsp;|&nbsp; tandem.it.com/help</>],
                ["Registered Entity", "Orbitandem Technologies Private Limited"],
                ["Website", <span style={{ color: "#00FFC8" }}>www.tandem.it.com</span>],
              ].map(([label, value]) => (
                <tr key={label} style={{ borderBottom: "1px solid #2a2a2a" }}>
                  <td style={{ padding: "12px 16px", fontWeight: "700", color: "#F2F2F2", whiteSpace: "nowrap", width: "200px", background: "rgba(255,255,255,0.03)" }}>{label}</td>
                  <td style={{ padding: "12px 16px", color: "#BCBCBC" }}>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p style={{ marginTop: "16px" }}>
            If your concern is not resolved to your satisfaction through our support channels, you may
            escalate the matter as follows:
          </p>
          <ul style={{ paddingLeft: "20px", listStyleType: "disc", marginTop: "10px" }}>
            <li style={liStyle}><strong style={{ color: "#F2F2F2" }}>In India:</strong> File a complaint with the National Consumer Disputes Redressal Commission (NCDRC) or the appropriate State Consumer Disputes Redressal Commission, as applicable.</li>
            <li style={liStyle}><strong style={{ color: "#F2F2F2" }}>Via App Stores:</strong> Contact Apple or Google support for purchases processed through their respective platforms.</li>
          </ul>
          <p style={{ marginTop: "12px" }}>
            Tandem is committed to resolving all disputes fairly and in good faith. We encourage users to
            contact us before initiating any formal proceedings, as most concerns can be resolved quickly
            through direct communication.
          </p>

        </div>

        <hr style={{ borderColor: "#2a2a2a", marginTop: "60px", marginBottom: "24px" }} />
        <p style={{ color: "#969696", fontSize: "13px" }}>
          © 2026 Orbitandem Technologies Private Limited. All rights reserved. &nbsp;|&nbsp; Tandem: Events &amp; Experiences &nbsp;|&nbsp; www.tandem.it.com
        </p>

      </div>
    </div>
  );
};

export default RefundPolicy;
