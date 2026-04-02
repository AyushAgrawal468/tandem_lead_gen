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
  marginTop: "24px",
  marginBottom: "8px",
  fontSize: "clamp(15px, 1.9vw, 19px)",
  fontWeight: "600",
  color: "#F2F2F2",
};

const refundSectionHeading = {
  marginTop: "40px",
  marginBottom: "10px",
  fontSize: "clamp(16px, 2vw, 20px)",
  fontWeight: "700",
  color: "#F2F2F2",
  paddingBottom: "8px",
  borderBottom: "1px solid #2a2a2a",
};

const refundSubHeading = {
  marginTop: "24px",
  marginBottom: "8px",
  fontSize: "clamp(14px, 1.8vw, 17px)",
  fontWeight: "600",
  color: "#A77DFF",
};

const liStyle = { marginBottom: "10px", paddingLeft: "8px" };

const calloutBox = {
  margin: "20px 0",
  padding: "14px 18px",
  background: "#1a1a1a",
  borderLeft: "3px solid #A77DFF",
  borderRadius: "4px",
};

const TermsAndConditions = () => {
  return (
    <div style={{ minHeight: "100vh", background: "#111111", color: "#F2F2F2", fontFamily: '"Anek Latin", Helvetica, sans-serif', position: "relative" }}>

      <LegalNavbar />

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "clamp(24px, 5vw, 60px) clamp(16px, 4vw, 40px) 80px", position: "relative", zIndex: 60 }}>

        <h1 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: "700", marginBottom: "8px", color: "#F2F2F2" }}>
          Terms &amp; Conditions &amp; Refund Policy
        </h1>
        <p style={{ color: "#969696", fontSize: "14px", marginBottom: "36px" }}>
          Last updated: 24th March 2026 &nbsp;·&nbsp; Orbitandem Technologies Private Limited
        </p>

        <hr style={{ borderColor: "#2a2a2a", marginBottom: "36px" }} />

        <div style={{ fontSize: "clamp(14px, 1.8vw, 17px)", lineHeight: "1.8", color: "#BCBCBC" }}>

          {/* ── AGREEMENT ── */}
          <h2 style={sectionHeading}>AGREEMENT TO OUR LEGAL TERMS</h2>

          <p>
            We are Orbitandem Technologies Private Limited, doing business as "Tandem", "Tandem : Events &amp; Experiences" (hereinafter referred to as "Company," "we," "us," or "our"), a company registered in India at Karnataka.
          </p>
          <p style={{ marginTop: "12px" }}>
            We operate the website https://tandem.it.com (the "Site"), the mobile application Tandem: Events &amp; Experiences (the "App"), as well as any other related products and services that refer or link to these legal terms (the "Legal Terms") (collectively, the "Services").
          </p>
          <p style={{ marginTop: "12px" }}>
            Tandem is a social planning app that makes coordinating activities with friends effortless and fun. Instead of swiping on people, you swipe together on things to do, finalizing plans in just a few taps instead of endless group chat debates.
          </p>
          <p style={{ marginTop: "12px" }}>
            You can contact us at{" "}
            <a href="mailto:grievance@tandem.it.com" style={{ color: "#00FFC8", textDecoration: "none" }}>
              grievance@tandem.it.com
            </a>.
          </p>

          {/* ── A ── */}
          <h2 style={sectionHeading}>A. ACCEPTANCE OF TERMS</h2>
          <ul style={{ paddingLeft: "20px", listStyleType: "disc" }}>
            <li style={liStyle}>
              These Legal Terms constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you"), and Tandem, and concerning your access to and use of the Services. You agree that by accessing the Services, you have read, understood, and agreed to be bound by all of these Legal Terms. IF YOU DO NOT AGREE WITH ALL OF THESE LEGAL TERMS, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SERVICES AND YOU MUST DISCONTINUE USE IMMEDIATELY.
            </li>
            <li style={liStyle}>
              Supplemental terms and conditions or documents that may be posted on the Services from time to time are hereby expressly incorporated herein by reference. We reserve the right, in our sole discretion, to make changes or modifications to these Legal Terms from time to time. We will alert you about any changes by updating the "Last updated" date of these Legal Terms, and you waive any right to receive specific notice of each such change. It is your responsibility to periodically review these Legal Terms to stay informed of updates. You will be subject to, and will be deemed to have been made aware of and to have accepted, the changes in any revised Legal Terms by your continued use of the Services after the date such revised Legal Terms are posted.
            </li>
          </ul>

          {/* ── B ── */}
          <h2 style={sectionHeading}>B. Eligibility</h2>
          <ul style={{ paddingLeft: "20px", listStyleType: "disc" }}>
            <li style={liStyle}>
              The Services are intended for users who are at least 18 years old. Persons under the age of 18 are not permitted to use or register for the Services. All users who are minors in the jurisdiction in which they reside (generally under the age of 18) must have the permission of, and be directly supervised by, their parent or guardian to use the Services.
            </li>
          </ul>

          {/* ── C ── */}
          <h2 style={sectionHeading}>C. USER REGISTRATION</h2>
          <ul style={{ paddingLeft: "20px", listStyleType: "disc" }}>
            <li style={liStyle}>
              You may be required to register to use the Services. You agree to keep your password confidential and will be responsible for all use of your account and password. We reserve the right to remove, reclaim, or change a username you select if we determine, in our sole discretion, that such username is inappropriate, obscene, or otherwise objectionable.
            </li>
          </ul>

          {/* ── D ── */}
          <h2 style={sectionHeading}>D. USER REPRESENTATIONS</h2>
          <ul style={{ paddingLeft: "20px", listStyleType: "disc" }}>
            <li style={liStyle}>
              By using the Services, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information and promptly update such registration information as necessary; (3) you have the legal capacity and you agree to comply with these Legal Terms; (4) you are not under the age of 18; (5) you are not a minor in the jurisdiction in which you reside; (6) you will not access the Services through automated or non-human means, whether through a bot, script, or otherwise; (7) you will not use the Services for any illegal or unauthorized purpose; and (8) your use of the Services will not violate any applicable law or regulation.
            </li>
            <li style={liStyle}>
              If you provide any information that is untrue, inaccurate, not current, or incomplete, we have the right to suspend or terminate your account and refuse any and all current or future use of the Services (or any portion thereof).
            </li>
          </ul>

          {/* ── E ── */}
          <h2 style={sectionHeading}>E. INTELLECTUAL PROPERTY RIGHTS</h2>

          <h3 style={subHeading}>Our intellectual property</h3>
          <ul style={{ paddingLeft: "20px", listStyleType: "disc" }}>
            <li style={liStyle}>
              We are the owner or the licensee of all intellectual property rights in our Services, including all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics in the Services (collectively, the "Content"), as well as the trademarks, service marks, and logos contained therein (the "Marks").
            </li>
            <li style={liStyle}>
              Our Content and Marks are protected by copyright and trademark laws (and various other intellectual property rights and unfair competition laws) and treaties in India and around the world.
            </li>
            <li style={liStyle}>
              The Content and Marks are provided in or through the Services "AS IS" for your personal, non-commercial use only.
            </li>
          </ul>

          <h3 style={subHeading}>Your use of our Services</h3>
          <p>
            Subject to your compliance with these Legal Terms, including the activities described below, we grant you a non-exclusive, non-transferable, revocable license to:
          </p>
          <ul style={{ paddingLeft: "20px", marginTop: "10px", listStyle: "none" }}>
            <li style={{ marginBottom: "10px", paddingLeft: "8px" }}>&#9632; access the Services; and</li>
            <li style={{ marginBottom: "10px", paddingLeft: "8px" }}>&#9632; download or print a copy of any portion of the Content to which you have properly gained access,</li>
          </ul>
          <p style={{ marginTop: "10px" }}>solely for your personal, non-commercial use.</p>
          <p style={{ marginTop: "12px" }}>
            Except as set out in this section or elsewhere in our Legal Terms, no part of the Services and no Content or Marks may be copied, reproduced, aggregated, republished, uploaded, posted, publicly displayed, encoded, translated, transmitted, distributed, sold, licensed, or otherwise exploited for any purpose whatsoever, without our express prior written permission.
          </p>
          <p style={{ marginTop: "12px" }}>
            If you wish to make any use of the Services, Content, or Marks other than as set out in this section or elsewhere in our Legal Terms, please address your request to:{" "}
            <a href="mailto:legal@tandem.it.com" style={{ color: "#00FFC8", textDecoration: "none" }}>legal@tandem.it.com</a>.
            {" "}If we ever grant you the permission to post, reproduce, or publicly display any part of our Services or Content, you must identify us as the owners or licensors of the Services, Content, or Marks and ensure that any copyright or proprietary notice appears or is visible on posting, reproducing, or displaying our Content.
          </p>
          <p style={{ marginTop: "12px" }}>
            We reserve all rights not expressly granted to you in and to the Services, Content, and Marks.
          </p>
          <p style={{ marginTop: "12px" }}>
            Any breach of these Intellectual Property Rights will constitute a material breach of our Legal Terms and your right to use our Services will terminate immediately.
          </p>

          <h3 style={subHeading}>Your submissions and contributions</h3>
          <p>
            Please review this section and other sections carefully prior to using our Services to understand the (a) rights you give us and (b) obligations you have when you post or upload any content through the Services.
          </p>
          <p style={{ marginTop: "12px" }}>
            <strong style={{ color: "#F2F2F2" }}>Submissions:</strong> By directly sending us any question, comment, suggestion, idea, feedback, or other information about the Services ("Submissions"), you agree to assign to us all intellectual property rights in such Submission. You agree that we shall own this Submission and be entitled to its unrestricted use and dissemination for any lawful purpose, commercial or otherwise, without acknowledgment or compensation to you.
          </p>
          <p style={{ marginTop: "12px" }}>
            <strong style={{ color: "#F2F2F2" }}>Contributions:</strong> The Services may invite you to chat, contribute to, or participate in blogs, message boards, online forums, and other functionality during which you may create, submit, post, display, transmit, publish, distribute, or broadcast content and materials to us or through the Services, including but not limited to text, writings, video, audio, photographs, music, graphics, comments, reviews, rating suggestions, personal information, or other material ("Contributions"). Any Submission that is publicly posted shall also be treated as a Contribution.
          </p>
          <p style={{ marginTop: "12px" }}>
            You understand that Contributions may be viewable by other users of the Services and possibly through third-party websites.
          </p>
          <p style={{ marginTop: "12px" }}>
            <strong style={{ color: "#F2F2F2" }}>When you post Contributions, you grant us a license (including use of your name, trademarks, and logos):</strong> By posting any Contributions, you grant us an unrestricted, unlimited, irrevocable, perpetual, non-exclusive, transferable, royalty-free, fully-paid, worldwide right, and license to: use, copy, reproduce, distribute, sell, resell, publish, broadcast, retitle, store, publicly perform, publicly display, reformat, translate, excerpt (in whole or in part), and exploit your Contributions (including, without limitation, your image, name, and voice) for any purpose, commercial, advertising, or otherwise, to prepare derivative works of, or incorporate into other works, your Contributions, and to sublicense the licenses granted in this section. Our use and distribution may occur in any media formats and through any media channels.
          </p>
          <p style={{ marginTop: "12px" }}>
            This license includes our use of your name, company name, and franchise name, as applicable, and any of the trademarks, service marks, trade names, logos, and personal and commercial images you provide.
          </p>
          <p style={{ marginTop: "12px" }}>
            <strong style={{ color: "#F2F2F2" }}>You are responsible for what you post or upload:</strong> By sending us Submissions and/or posting Contributions through any part of the Services or making Contributions accessible through the Services by linking your account through the Services to any of your social networking accounts, you:
          </p>
          <ul style={{ paddingLeft: "20px", marginTop: "10px", listStyle: "none" }}>
            <li style={{ marginBottom: "10px", paddingLeft: "8px" }}>&#9632; confirm that you have read and agree with our terms and conditions, and will not post, send, publish, upload, or transmit through the Services any Submission nor post any Contribution that is illegal, harassing, hateful, harmful, defamatory, obscene, bullying, abusive, discriminatory, threatening to any person or group, sexually explicit, false, inaccurate, deceitful, or misleading;</li>
            <li style={{ marginBottom: "10px", paddingLeft: "8px" }}>&#9632; to the extent permissible by applicable law, waive any and all moral rights to any such Submission and/or Contribution;</li>
            <li style={{ marginBottom: "10px", paddingLeft: "8px" }}>&#9632; warrant that any such Submissions and/or Contributions are original to you or that you have the necessary rights and licenses to submit such Submissions and/or Contributions and that you have full authority to grant us the above-mentioned rights in relation to your Submissions and/or Contributions; and</li>
            <li style={{ marginBottom: "10px", paddingLeft: "8px" }}>&#9632; warrant and represent that your Submissions and/or Contributions do not constitute confidential information.</li>
            <li style={{ marginBottom: "10px", paddingLeft: "8px" }}>&#9632; You are solely responsible for your Submissions and/or Contributions and you expressly agree to reimburse us for any and all losses that we may suffer because of your breach of (a) this section, (b) any third party's intellectual property rights, or (c) applicable law.</li>
          </ul>
          <ul style={{ paddingLeft: "20px", listStyleType: "disc", marginTop: "10px" }}>
            <li style={liStyle}>
              <strong style={{ color: "#F2F2F2" }}>We may remove or edit your Content:</strong> Although we have no obligation to monitor any Contributions, we shall have the right to remove or edit any Contributions at any time without notice if in our reasonable opinion we consider such Contributions harmful or in breach of these Legal Terms. If we remove or edit any such Contributions, we may also suspend or disable your account and report you to the authorities.
            </li>
          </ul>

          {/* ── F ── */}
          <h2 style={sectionHeading}>F. PURCHASES AND PAYMENT</h2>
          <ul style={{ paddingLeft: "20px", listStyleType: "disc" }}>
            <li style={liStyle}>
              You agree to provide current, complete, and accurate purchase and account information for all purchases made via the Services. You further agree to promptly update account and payment information, including email address, payment method, and payment card expiration date, so that we can complete your transactions and contact you as needed. Sales tax will be added to the price of purchases as deemed required by us. We may change prices at any time. All payments shall be in the applicable currency.
            </li>
            <li style={liStyle}>
              You agree to pay all charges at the prices then in effect for your purchases and any applicable fees, and you authorize us to charge your chosen payment provider for any such amounts upon placing your order. We reserve the right to correct any errors or mistakes in pricing, even if we have already requested or received payment.
            </li>
            <li style={liStyle}>
              We reserve the right to refuse any order placed through the Services. We may, in our sole discretion, limit or cancel quantities purchased per person, per household, or per order. These restrictions may include orders placed by or under the same customer account, the same payment method, and/or orders that use the same billing or shipping address. We reserve the right to limit or prohibit orders that, in our sole judgment, appear to be placed by dealers, resellers, or distributors.
            </li>
          </ul>

          {/* ── G ── */}
          <h2 style={sectionHeading}>G. LIMITATIONS OF LIABILITY</h2>
          <ul style={{ paddingLeft: "20px", listStyleType: "disc" }}>
            <li style={liStyle}>
              IN NO EVENT WILL WE OR OUR DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY DIRECT, INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFIT, LOST REVENUE, LOSS OF DATA, OR OTHER DAMAGES ARISING FROM YOUR USE OF THE SERVICES, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. NOTWITHSTANDING ANYTHING TO THE CONTRARY CONTAINED HEREIN, OUR LIABILITY TO YOU FOR ANY CAUSE WHATSOEVER AND REGARDLESS OF THE FORM OF THE ACTION, WILL AT ALL TIMES BE LIMITED TO THE LESSER OF THE AMOUNT PAID, IF ANY, BY YOU TO US DURING THE TERM OF USAGE TO ANY CAUSE OF ACTION ARISING. IF THESE LAWS APPLY TO YOU, SOME OR ALL OF THE ABOVE DISCLAIMERS OR LIMITATIONS MAY NOT APPLY TO YOU, AND YOU MAY HAVE ADDITIONAL RIGHTS.
            </li>
          </ul>

          {/* ── H ── */}
          <h2 style={sectionHeading}>H. INDEMNIFICATION</h2>
          <ul style={{ paddingLeft: "20px", listStyleType: "disc" }}>
            <li style={liStyle}>
              You agree to defend, indemnify, and hold us harmless, including our subsidiaries, affiliates, and all of our respective officers, agents, partners, and employees, from and against any loss, damage, liability, claim, or demand, including reasonable attorneys' fees and expenses, made by any third party due to or arising out of: (1) your Contributions; (2) use of the Services; (3) breach of these Legal Terms; (4) any breach of your representations and warranties set forth in these Legal Terms; (5) your violation of the rights of a third party, including but not limited to intellectual property rights; or (6) any overt harmful act toward any other user of the Services with whom you connected via the Services. Notwithstanding the foregoing, we reserve the right, at your expense, to assume the exclusive defense and control of any matter for which you are required to indemnify us, and you agree to cooperate, at your expense, with our defense of such claims. We will use reasonable efforts to notify you of any such claim, action, or proceeding which is subject to this indemnification upon becoming aware of it.
            </li>
          </ul>

          {/* ── I ── */}
          <h2 style={sectionHeading}>I. USER DATA</h2>
          <ul style={{ paddingLeft: "20px", listStyleType: "disc" }}>
            <li style={liStyle}>
              We will maintain certain data that you transmit to the Services for the purpose of managing the performance of the Services, as well as data relating to your use of the Services. Although we perform regular routine backups of data, you are solely responsible for all data that you transmit or that relates to any activity you have undertaken using the Services. You agree that we shall have no liability to you for any loss or corruption of any such data, and you hereby waive any right of action against us arising from any such loss or corruption of such data.
            </li>
          </ul>

          {/* ── J ── */}
          <h2 style={sectionHeading}>J. PRIVACY POLICY</h2>
          <p>
            We care about data privacy and security. Please review our{" "}
            <a href="/legal/privacy-policy" style={{ color: "#00FFC8", textDecoration: "none" }}>Privacy Policy</a>.
            {" "}By using the Services, you agree to be bound by our Privacy Policy, which is incorporated into these Legal Terms. Please be advised the Services are hosted in India. If you access the Services from any other region of the world with laws or other requirements governing personal data collection, use, or disclosure that differ from applicable laws in India, then through your continued use of the Services, you are transferring your data to India, and you expressly consent to have your data transferred to and processed in India.
          </p>

          {/* ── K ── */}
          <h2 style={sectionHeading}>K. DISPUTE RESOLUTION</h2>
          <ul style={{ paddingLeft: "20px", listStyleType: "disc" }}>
            <li style={liStyle}>
              To expedite resolution and control the cost of any dispute, controversy, or claim related to these Legal Terms (each a "Dispute" and collectively, the "Disputes") brought by either you or us (individually, a "Party" and collectively, the "Parties"), the Parties agree to first attempt to negotiate any Dispute in the court situated in Bangalore, Karnataka.
            </li>
          </ul>

        </div>

        {/* ════════════════════════════════════════
            REFUND POLICY
        ════════════════════════════════════════ */}
        <hr style={{ borderColor: "#2a2a2a", marginTop: "60px", marginBottom: "48px" }} />

        <div style={{ fontSize: "clamp(14px, 1.8vw, 17px)", lineHeight: "1.8", color: "#BCBCBC" }}>

          <h2 style={{ fontSize: "clamp(24px, 3.5vw, 36px)", fontWeight: "700", marginBottom: "6px", color: "#F2F2F2" }}>
            Refund Policy
          </h2>
          <p style={{ color: "#969696", fontSize: "14px", marginBottom: "32px" }}>
            Effective Date: 24 March 2026 &nbsp;|&nbsp; Last Updated: 24 March 2026
          </p>

          {/* 1 */}
          <h3 style={refundSectionHeading}>1. Introduction &amp; Scope</h3>
          <p>
            This Refund Policy ("Policy") is published by Orbitandem Technologies Private Limited, the company behind Tandem: Events &amp; Experiences ("Tandem", "we", "us", or "our"), a phygital social-networking platform that lets users discover events and experiences, swipe to express interest, and connect with friends and contacts who share the same preferences.
          </p>
          <p style={{ marginTop: "12px" }}>
            This Policy applies to all purchases made on or through Tandem, including the Tandem website, iOS application, and Android application (collectively, the "Platform"). Depending on the nature of your purchase and the channel through which it was made, different rules apply. Please read this Policy in full before completing any transaction on the Platform.
          </p>
          <p style={{ marginTop: "12px" }}>
            By making a purchase on the Platform, you confirm that you have read, understood, and agree to this Policy.
          </p>

          {/* 2 */}
          <h3 style={refundSectionHeading}>2. Types of Purchases &amp; Applicable Refund Rules</h3>
          <p>
            Tandem offers several categories of paid products and services. The refund rules for each category are set out below.
          </p>

          <h4 style={refundSubHeading}>2.1 Subscriptions (Premium Plans)</h4>
          <ul style={{ paddingLeft: "20px", listStyleType: "disc" }}>
            <li style={liStyle}>Tandem subscription plans (monthly or annual) may be cancelled by the user at any time through the Platform or the relevant app store settings.</li>
            <li style={liStyle}>Upon cancellation, your subscription will not be renewed at the next billing cycle. You will, however, retain access to all premium features until the last day of your current paid billing period.</li>
            <li style={liStyle}>No partial or pro-rated refunds will be issued for the unused portion of a billing cycle, except where required by applicable law.</li>
            <li style={liStyle}>Annual plan holders who cancel within 7 (seven) days of their initial purchase date (and have not used any premium features) may request a full refund by writing to our support team at{" "}
              <a href="mailto:support@tandem.it.com" style={{ color: "#00FFC8", textDecoration: "none" }}>support@tandem.it.com</a>.
            </li>
          </ul>

          <h4 style={refundSubHeading}>2.2 Event &amp; Experience Tickets — Tandem-Managed Events</h4>
          <ul style={{ paddingLeft: "20px", listStyleType: "disc" }}>
            <li style={liStyle}>Tickets purchased through Tandem for events directly managed or hosted by Tandem may be eligible for a refund, subject to the cancellation window specified at the time of purchase.</li>
            <li style={liStyle}>If no specific cancellation window is stated, requests submitted more than 48 hours before the event start time will be reviewed on a case-by-case basis.</li>
            <li style={liStyle}>No refund will be issued for tickets cancelled within 48 hours of the event start time, or for no-shows (see Section 4).</li>
          </ul>

          <h4 style={refundSubHeading}>2.3 Event &amp; Experience Tickets — Third-Party Hosted Events</h4>
          <ul style={{ paddingLeft: "20px", listStyleType: "disc" }}>
            <li style={liStyle}>For events and experiences listed on Tandem but organised or managed by third-party hosts, the refund policy of the relevant host or organiser applies.</li>
            <li style={liStyle}>Tandem acts solely as a discovery and booking facilitator in such cases and is not responsible for processing or honouring refunds on behalf of third-party organisers.</li>
            <li style={liStyle}>Users are strongly advised to review the organiser's refund terms before purchasing tickets for third-party events.</li>
            <li style={liStyle}>Where a third-party organiser cancels a paid event, the provisions of Section 3 below apply.</li>
          </ul>

          <h4 style={refundSubHeading}>2.4 In-App Credits &amp; Virtual Currency</h4>
          <ul style={{ paddingLeft: "20px", listStyleType: "disc" }}>
            <li style={liStyle}>In-app credits or virtual currency credited to your Tandem account are granted on a rolling basis.</li>
            <li style={liStyle}>Credits expire 6 (six) months from the date they are credited to your account if unused. Each credit batch carries its own 6-month expiry calculated from its individual credit date.</li>
            <li style={liStyle}>Expired credits cannot be reinstated or refunded.</li>
            <li style={liStyle}>Credits that have been used or applied towards a purchase are non-refundable.</li>
            <li style={liStyle}>Unused, non-expired credits are generally non-refundable except in the case of account closure initiated by Tandem without cause, in which case Tandem will review refund eligibility at its sole discretion.</li>
          </ul>

          <h4 style={refundSubHeading}>2.5 One-Time Feature Purchases</h4>
          <ul style={{ paddingLeft: "20px", listStyleType: "disc" }}>
            <li style={liStyle}>One-time in-app feature purchases (such as event boosts, spotlight placements, or similar consumable features) are non-refundable once purchased, regardless of whether they have been used.</li>
            <li style={liStyle}>These features are made available to you immediately upon purchase and are therefore consumed at the point of sale.</li>
          </ul>

          {/* 3 */}
          <h3 style={refundSectionHeading}>3. Event Cancellations by Hosts or Organisers</h3>
          <p>
            If a paid event or experience listed on the Platform is cancelled by the host or organiser (whether Tandem-managed or third-party), the following rules apply:
          </p>
          <ul style={{ paddingLeft: "20px", listStyleType: "disc", marginTop: "12px" }}>
            <li style={liStyle}>All amounts paid by users to book tickets for the cancelled event will be refunded in full.</li>
            <li style={liStyle}>Refunds will be processed within 7 (seven) working days from the date Tandem or the organiser confirms the cancellation.</li>
            <li style={liStyle}>Refunds will be credited to the original payment method used at the time of booking (see Section 7).</li>
            <li style={liStyle}>Tandem will make reasonable efforts to notify affected users of the cancellation and the refund timeline by email and/or in-app notification.</li>
            <li style={liStyle}>In cases where an event is postponed or rescheduled rather than cancelled outright, Tandem will communicate available options (attend the rescheduled event or request a refund) and users will have a reasonable window to decide, as communicated at the time.</li>
          </ul>

          <div style={calloutBox}>
            <p style={{ color: "#969696", fontSize: "13px", marginBottom: "6px", fontWeight: "600" }}>Important Note on Third-Party Cancellations</p>
            <p style={{ fontStyle: "italic", fontSize: "clamp(13px, 1.6vw, 15px)" }}>
              Where a third-party organiser cancels an event, Tandem will facilitate the refund process to the best of its ability. However, Tandem&apos;s ability to issue refunds is contingent on receiving the corresponding funds from the organiser. Tandem shall not be held liable for delays caused by a third-party organiser&apos;s failure to remit funds in a timely manner.
            </p>
          </div>

          {/* 4 */}
          <h3 style={refundSectionHeading}>4. No-Show Policy</h3>
          <p>
            If you have purchased a ticket and do not attend the event or experience — whether because you forgot, were unable to make it, or for any other personal reason — your ticket is non-refundable. No exceptions will be made for no-shows. We encourage users to carefully review event details and ensure availability before purchasing tickets.
          </p>

          {/* 5 */}
          <h3 style={refundSectionHeading}>5. Platform-Specific Refund Rules (iOS &amp; Android)</h3>
          <p>
            Purchases made through the Apple App Store or Google Play Store are subject to the respective refund policies of Apple Inc. and Google LLC. Tandem does not control, and cannot override, the refund policies of these third-party platforms.
          </p>

          <h4 style={refundSubHeading}>5.1 Apple App Store (iOS)</h4>
          <ul style={{ paddingLeft: "20px", listStyleType: "disc" }}>
            <li style={liStyle}>If you purchased a Tandem subscription or in-app purchase through the Apple App Store, any refund request must be submitted directly to Apple.</li>
            <li style={liStyle}>You may request a refund via reportaproblem.apple.com or through your Apple ID account settings.</li>
            <li style={liStyle}>Apple&apos;s refund decisions are final and are not within Tandem&apos;s control.</li>
          </ul>

          <h4 style={refundSubHeading}>5.2 Google Play Store (Android)</h4>
          <ul style={{ paddingLeft: "20px", listStyleType: "disc" }}>
            <li style={liStyle}>If you purchased a Tandem subscription or in-app purchase through Google Play, any refund request must be submitted directly to Google.</li>
            <li style={liStyle}>You may request a refund via play.google.com/store/account/subscriptions or by contacting Google Play support.</li>
            <li style={liStyle}>Google&apos;s refund decisions are final and are not within Tandem&apos;s control.</li>
          </ul>

          <div style={calloutBox}>
            <p style={{ color: "#969696", fontSize: "13px", marginBottom: "6px", fontWeight: "600" }}>Platform Purchases</p>
            <p style={{ fontStyle: "italic", fontSize: "clamp(13px, 1.6vw, 15px)" }}>
              For clarity: if you see a charge from "Apple" or "Google Play" on your statement, your purchase was processed by that platform and must be refunded through them. If you see a charge from "Tandem" or "Orbitandem Technologies" or "Tandem : Events &amp; Experiences", please contact us directly.
            </p>
          </div>

          {/* 6 */}
          <h3 style={refundSectionHeading}>6. How to Request a Refund</h3>
          <p>To request a refund for a Tandem-processed purchase, please use one of the following channels:</p>
          <ul style={{ paddingLeft: "20px", listStyleType: "disc", marginTop: "12px" }}>
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
          <ul style={{ paddingLeft: "20px", listStyleType: "circle", marginTop: "8px" }}>
            <li style={liStyle}>Your registered phone number</li>
            <li style={liStyle}>Order ID or transaction reference number</li>
            <li style={liStyle}>Name and date of the event or purchase</li>
            <li style={liStyle}>Reason for the refund request</li>
            <li style={liStyle}>Any supporting documentation (e.g., cancellation confirmation)</li>
          </ul>
          <p style={{ marginTop: "12px" }}>
            We aim to acknowledge all refund requests within 3 (three) business days of receipt.
          </p>

          {/* 7 */}
          <h3 style={refundSectionHeading}>7. Refund Method &amp; Timeline</h3>
          <ul style={{ paddingLeft: "20px", listStyleType: "disc" }}>
            <li style={liStyle}>Approved refunds will be credited to the original payment method used at the time of the transaction (credit card, debit card, UPI, net banking, or other supported payment method).</li>
            <li style={liStyle}>Tandem does not issue refunds via cash, cheque, or alternative payment methods unless expressly agreed in writing.</li>
            <li style={liStyle}>Once a refund is approved and processed by Tandem, the time taken for the credit to appear in your account depends on your bank or payment provider and is typically 5–10 business days.</li>
            <li style={liStyle}>For event cancellation refunds, please refer to the 7 working-day processing window outlined in Section 3.</li>
            <li style={liStyle}>Tandem reserves the right to deduct applicable payment gateway fees from the refund amount where such fees are non-recoverable by Tandem, and will notify you of any such deduction prior to processing.</li>
          </ul>

          {/* 8 */}
          <h3 style={refundSectionHeading}>8. Exceptional Circumstances &amp; Limitation of Liability</h3>
          <p>
            Tandem will give reasonable consideration to refund requests arising from the following exceptional circumstances, provided they are supported by appropriate evidence:
          </p>
          <ul style={{ paddingLeft: "20px", listStyleType: "disc", marginTop: "12px" }}>
            <li style={liStyle}><strong style={{ color: "#F2F2F2" }}>Technical errors:</strong> Duplicate charges or failed transactions caused directly by a verifiable error in the Tandem Platform or its payment processing systems.</li>
            <li style={liStyle}><strong style={{ color: "#F2F2F2" }}>Unauthorised transactions:</strong> Purchases made as a result of documented unauthorised access to your Tandem account. Users must report such incidents to{" "}
              <a href="mailto:support@tandem.it.com" style={{ color: "#00FFC8", textDecoration: "none" }}>support@tandem.it.com</a>{" "}
              and to the relevant authorities promptly.
            </li>
            <li style={liStyle}><strong style={{ color: "#F2F2F2" }}>Significant service unavailability:</strong> Where a paid feature or ticketed event is rendered wholly inaccessible due to a Tandem platform outage or technical failure attributable to Tandem, and no equivalent remedy (rescheduling or alternative access) is offered.</li>
          </ul>
          <p style={{ marginTop: "16px" }}>The following circumstances do not qualify for a refund under this Policy:</p>
          <ul style={{ paddingLeft: "20px", listStyleType: "disc", marginTop: "8px" }}>
            <li style={liStyle}>Change of mind after purchase.</li>
            <li style={liStyle}>Failure to use a purchased feature, subscription, or ticket.</li>
            <li style={liStyle}>Third-party service disruptions (internet outages, device failures, etc.) outside Tandem&apos;s control.</li>
            <li style={liStyle}>Events of force majeure, including natural disasters, pandemics, government restrictions, war, or any circumstances beyond Tandem&apos;s reasonable control.</li>
          </ul>

          <div style={calloutBox}>
            <p style={{ color: "#969696", fontSize: "13px", marginBottom: "6px", fontWeight: "600" }}>Limitation of Liability</p>
            <p style={{ fontStyle: "italic", fontSize: "clamp(13px, 1.6vw, 15px)" }}>
              To the fullest extent permitted by applicable law, Orbitandem Technologies Private Limited&apos;s total liability in connection with any refund claim shall be limited to the amount actually paid by the user for the specific purchase in dispute. Tandem shall not be liable for any indirect, incidental, or consequential loss arising from any purchase or refund decision.
            </p>
          </div>

          {/* 9 */}
          <h3 style={refundSectionHeading}>9. Legal Compliance</h3>
          <p>
            This Policy is intended to comply with, and should be read in conjunction with, the following legal frameworks:
          </p>

          <h4 style={refundSubHeading}>9.1 Indian Consumer Protection Act, 2019</h4>
          <p>
            For users in India, this Policy is governed by and complies with the Consumer Protection Act, 2019, and the rules framed thereunder, including the Consumer Protection (E-Commerce) Rules, 2020. Where any provision of this Policy is inconsistent with mandatory consumer rights under Indian law, those legal provisions shall prevail.
          </p>

          <h4 style={refundSubHeading}>9.2 App Store &amp; Play Store Policies</h4>
          <p>
            Where purchases are made through the Apple App Store or Google Play Store, Apple&apos;s and Google&apos;s respective developer and consumer policies apply in addition to this Policy. In the event of any conflict between this Policy and those platform policies, the platform&apos;s policy shall prevail for purchases made through that platform.
          </p>

          {/* 10 */}
          <h3 style={refundSectionHeading}>10. Changes to This Policy</h3>
          <p>
            Tandem reserves the right to update, modify, or replace this Policy at any time, at its sole discretion, without prior notice. Changes will be effective immediately upon publication of the revised Policy on the Platform.
          </p>
          <p style={{ marginTop: "12px" }}>
            We will make reasonable efforts to notify registered users of material changes via email to the address associated with your Tandem account and/or via an in-app notification. Your continued use of the Platform following any changes constitutes your acceptance of the revised Policy.
          </p>
          <p style={{ marginTop: "12px" }}>
            We recommend checking this page periodically to stay informed of the current terms.
          </p>

          {/* 11 */}
          <h3 style={refundSectionHeading}>11. Contact &amp; Dispute Resolution</h3>
          <p>For any refund-related queries, disputes, or concerns, please contact us at:</p>

          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "16px", fontSize: "clamp(13px, 1.6vw, 15px)" }}>
            <tbody>
              {[
                { label: "Legal / Refunds", value: <a href="mailto:legal@tandem.it.com" style={{ color: "#00FFC8", textDecoration: "none" }}>legal@tandem.it.com</a> },
                { label: "General Support", value: <><a href="mailto:support@tandem.it.com" style={{ color: "#00FFC8", textDecoration: "none" }}>support@tandem.it.com</a>{" | tandem.it.com/help"}</> },
                { label: "Registered Entity", value: "Orbitandem Technologies Private Limited" },
                { label: "Website", value: "www.tandem.it.com" },
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #2a2a2a" }}>
                  <td style={{ padding: "10px 14px", fontWeight: "600", color: "#F2F2F2", whiteSpace: "nowrap", width: "200px", background: "#1a1a1a" }}>{row.label}</td>
                  <td style={{ padding: "10px 14px", color: "#BCBCBC" }}>{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p style={{ marginTop: "20px" }}>
            If your concern is not resolved to your satisfaction through our support channels, you may escalate the matter as follows:
          </p>
          <ul style={{ paddingLeft: "20px", listStyleType: "disc", marginTop: "8px" }}>
            <li style={liStyle}><strong style={{ color: "#F2F2F2" }}>In India:</strong> File a complaint with the National Consumer Disputes Redressal Commission (NCDRC) or the appropriate State Consumer Disputes Redressal Commission, as applicable.</li>
            <li style={liStyle}><strong style={{ color: "#F2F2F2" }}>Via App Stores:</strong> Contact Apple or Google support for purchases processed through their respective platforms.</li>
          </ul>
          <p style={{ marginTop: "16px" }}>
            Tandem is committed to resolving all disputes fairly and in good faith. We encourage users to contact us before initiating any formal proceedings, as most concerns can be resolved quickly through direct communication.
          </p>

        </div>

        <hr style={{ borderColor: "#2a2a2a", marginTop: "60px", marginBottom: "24px" }} />
        <p style={{ color: "#969696", fontSize: "13px" }}>
          &copy; 2026 Orbitandem Technologies Private Limited. All rights reserved.{" "}
          Tandem: Events &amp; Experiences | www.tandem.it.com
        </p>

      </div>
    </div>
  );
};

export default TermsAndConditions;
