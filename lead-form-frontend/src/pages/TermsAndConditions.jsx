import React from "react";
import Navbar from "../components/Navbar";

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

const liStyle = { marginBottom: "10px" };

const TermsAndConditions = () => {
  return (
    <div style={{ minHeight: "100vh", background: "#111111", color: "#F2F2F2", fontFamily: '"Anek Latin", Helvetica, sans-serif' }}>
      <Navbar />

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "clamp(24px, 5vw, 60px) clamp(16px, 4vw, 40px) 80px", position: "relative", zIndex: 60 }}>

        <h1 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: "700", marginBottom: "8px", color: "#F2F2F2" }}>
          Terms &amp; Conditions
        </h1>
        <p style={{ color: "#969696", fontSize: "14px", marginBottom: "36px" }}>
          Last updated: 27th January 2026 &nbsp;·&nbsp; Orbitandem Technologies Private Limited
        </p>

        <hr style={{ borderColor: "#2a2a2a", marginBottom: "36px" }} />

        <div style={{ fontSize: "clamp(14px, 1.8vw, 17px)", lineHeight: "1.8", color: "#BCBCBC" }}>

          {/* Intro */}
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

          {/* A */}
          <h2 style={sectionHeading}>A. Acceptance of Terms</h2>
          <ul style={{ paddingLeft: "20px" }}>
            <li style={liStyle}>
              These Legal Terms constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you"), and Tandem, and concerning your access to and use of the Services. You agree that by accessing the Services, you have read, understood, and agreed to be bound by all of these Legal Terms. IF YOU DO NOT AGREE WITH ALL OF THESE LEGAL TERMS, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SERVICES AND YOU MUST DISCONTINUE USE IMMEDIATELY.
            </li>
            <li style={liStyle}>
              Supplemental terms and conditions or documents that may be posted on the Services from time to time are hereby expressly incorporated herein by reference. We reserve the right, in our sole discretion, to make changes or modifications to these Legal Terms from time to time. We will alert you about any changes by updating the "Last updated" date of these Legal Terms, and you waive any right to receive specific notice of each such change. It is your responsibility to periodically review these Legal Terms to stay informed of updates. You will be subject to, and will be deemed to have been made aware of and to have accepted, the changes in any revised Legal Terms by your continued use of the Services after the date such revised Legal Terms are posted.
            </li>
          </ul>

          {/* B */}
          <h2 style={sectionHeading}>B. Eligibility</h2>
          <ul style={{ paddingLeft: "20px" }}>
            <li style={liStyle}>
              The Services are intended for users who are at least 18 years old. Persons under the age of 18 are not permitted to use or register for the Services. All users who are minors in the jurisdiction in which they reside (generally under the age of 18) must have the permission of, and be directly supervised by, their parent or guardian to use the Services.
            </li>
          </ul>

          {/* C */}
          <h2 style={sectionHeading}>C. User Registration</h2>
          <ul style={{ paddingLeft: "20px" }}>
            <li style={liStyle}>
              You may be required to register to use the Services. You agree to keep your password confidential and will be responsible for all use of your account and password. We reserve the right to remove, reclaim, or change a username you select if we determine, in our sole discretion, that such username is inappropriate, obscene, or otherwise objectionable.
            </li>
          </ul>

          {/* D */}
          <h2 style={sectionHeading}>D. User Representations</h2>
          <ul style={{ paddingLeft: "20px" }}>
            <li style={liStyle}>
              By using the Services, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information and promptly update such registration information as necessary; (3) you have the legal capacity and you agree to comply with these Legal Terms; (4) you are not under the age of 18; (5) you are not a minor in the jurisdiction in which you reside; (6) you will not access the Services through automated or non-human means, whether through a bot, script, or otherwise; (7) you will not use the Services for any illegal or unauthorized purpose; and (8) your use of the Services will not violate any applicable law or regulation.
            </li>
            <li style={liStyle}>
              If you provide any information that is untrue, inaccurate, not current, or incomplete, we have the right to suspend or terminate your account and refuse any and all current or future use of the Services (or any portion thereof).
            </li>
          </ul>

          {/* E */}
          <h2 style={sectionHeading}>E. Intellectual Property Rights</h2>

          <h3 style={subHeading}>Our intellectual property</h3>
          <ul style={{ paddingLeft: "20px" }}>
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
          <p>Subject to your compliance with these Legal Terms, including the activities described below, we grant you a non-exclusive, non-transferable, revocable license to:</p>
          <ul style={{ paddingLeft: "20px", marginTop: "10px" }}>
            <li style={liStyle}>access the Services; and</li>
            <li style={liStyle}>download or print a copy of any portion of the Content to which you have properly gained access,</li>
          </ul>
          <p style={{ marginTop: "10px" }}>solely for your personal, non-commercial use.</p>
          <p style={{ marginTop: "12px" }}>
            Except as set out in this section or elsewhere in our Legal Terms, no part of the Services and no Content or Marks may be copied, reproduced, aggregated, republished, uploaded, posted, publicly displayed, encoded, translated, transmitted, distributed, sold, licensed, or otherwise exploited for any purpose whatsoever, without our express prior written permission.
          </p>
          <p style={{ marginTop: "12px" }}>
            If you wish to make any use of the Services, Content, or Marks other than as set out in this section or elsewhere in our Legal Terms, please address your request to:{" "}
            <a href="mailto:legal@tandem.it.com" style={{ color: "#00FFC8", textDecoration: "none" }}>legal@tandem.it.com</a>.
            If we ever grant you the permission to post, reproduce, or publicly display any part of our Services or Content, you must identify us as the owners or licensors of the Services, Content, or Marks and ensure that any copyright or proprietary notice appears or is visible on posting, reproducing, or displaying our Content.
          </p>
          <p style={{ marginTop: "12px" }}>
            We reserve all rights not expressly granted to you in and to the Services, Content, and Marks.
          </p>
          <p style={{ marginTop: "12px" }}>
            Any breach of these Intellectual Property Rights will constitute a material breach of our Legal Terms and your right to use our Services will terminate immediately.
          </p>

          <h3 style={subHeading}>Your submissions and contributions</h3>
          <p>Please review this section and other sections carefully prior to using our Services to understand the (a) rights you give us and (b) obligations you have when you post or upload any content through the Services.</p>
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
          <ul style={{ paddingLeft: "20px", marginTop: "10px" }}>
            <li style={liStyle}>confirm that you have read and agree with our terms and conditions, and will not post, send, publish, upload, or transmit through the Services any Submission nor post any Contribution that is illegal, harassing, hateful, harmful, defamatory, obscene, bullying, abusive, discriminatory, threatening to any person or group, sexually explicit, false, inaccurate, deceitful, or misleading;</li>
            <li style={liStyle}>to the extent permissible by applicable law, waive any and all moral rights to any such Submission and/or Contribution;</li>
            <li style={liStyle}>warrant that any such Submissions and/or Contributions are original to you or that you have the necessary rights and licenses to submit such Submissions and/or Contributions and that you have full authority to grant us the above-mentioned rights in relation to your Submissions and/or Contributions; and</li>
            <li style={liStyle}>warrant and represent that your Submissions and/or Contributions do not constitute confidential information.</li>
            <li style={liStyle}>You are solely responsible for your Submissions and/or Contributions and you expressly agree to reimburse us for any and all losses that we may suffer because of your breach of (a) this section, (b) any third party's intellectual property rights, or (c) applicable law.</li>
          </ul>
          <p style={{ marginTop: "12px" }}>
            We may remove or edit your Content: Although we have no obligation to monitor any Contributions, we shall have the right to remove or edit any Contributions at any time without notice if in our reasonable opinion we consider such Contributions harmful or in breach of these Legal Terms. If we remove or edit any such Contributions, we may also suspend or disable your account and report you to the authorities.
          </p>

          {/* F */}
          <h2 style={sectionHeading}>F. Purchases and Payment</h2>
          <ul style={{ paddingLeft: "20px" }}>
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

          {/* G */}
          <h2 style={sectionHeading}>G. Limitations of Liability</h2>
          <ul style={{ paddingLeft: "20px" }}>
            <li style={liStyle}>
              IN NO EVENT WILL WE OR OUR DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY DIRECT, INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFIT, LOST REVENUE, LOSS OF DATA, OR OTHER DAMAGES ARISING FROM YOUR USE OF THE SERVICES, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. NOTWITHSTANDING ANYTHING TO THE CONTRARY CONTAINED HEREIN, OUR LIABILITY TO YOU FOR ANY CAUSE WHATSOEVER AND REGARDLESS OF THE FORM OF THE ACTION, WILL AT ALL TIMES BE LIMITED TO THE LESSER OF THE AMOUNT PAID, IF ANY, BY YOU TO US DURING THE TERM OF USAGE TO ANY CAUSE OF ACTION ARISING. IF THESE LAWS APPLY TO YOU, SOME OR ALL OF THE ABOVE DISCLAIMERS OR LIMITATIONS MAY NOT APPLY TO YOU, AND YOU MAY HAVE ADDITIONAL RIGHTS.
            </li>
          </ul>

          {/* H */}
          <h2 style={sectionHeading}>H. Indemnification</h2>
          <ul style={{ paddingLeft: "20px" }}>
            <li style={liStyle}>
              You agree to defend, indemnify, and hold us harmless, including our subsidiaries, affiliates, and all of our respective officers, agents, partners, and employees, from and against any loss, damage, liability, claim, or demand, including reasonable attorneys' fees and expenses, made by any third party due to or arising out of: (1) your Contributions; (2) use of the Services; (3) breach of these Legal Terms; (4) any breach of your representations and warranties set forth in these Legal Terms; (5) your violation of the rights of a third party, including but not limited to intellectual property rights; or (6) any overt harmful act toward any other user of the Services with whom you connected via the Services. Notwithstanding the foregoing, we reserve the right, at your expense, to assume the exclusive defense and control of any matter for which you are required to indemnify us, and you agree to cooperate, at your expense, with our defense of such claims. We will use reasonable efforts to notify you of any such claim, action, or proceeding which is subject to this indemnification upon becoming aware of it.
            </li>
          </ul>

          {/* I */}
          <h2 style={sectionHeading}>I. User Data</h2>
          <ul style={{ paddingLeft: "20px" }}>
            <li style={liStyle}>
              We will maintain certain data that you transmit to the Services for the purpose of managing the performance of the Services, as well as data relating to your use of the Services. Although we perform regular routine backups of data, you are solely responsible for all data that you transmit or that relates to any activity you have undertaken using the Services. You agree that we shall have no liability to you for any loss or corruption of any such data, and you hereby waive any right of action against us arising from any such loss or corruption of such data.
            </li>
          </ul>

          {/* J */}
          <h2 style={sectionHeading}>J. Privacy Policy</h2>
          <p>
            We care about data privacy and security. Please review our{" "}
            <a href="/legal/privacy-policy" style={{ color: "#00FFC8", textDecoration: "none" }}>Privacy Policy</a>.
            By using the Services, you agree to be bound by our Privacy Policy, which is incorporated into these Legal Terms. Please be advised the Services are hosted in India. If you access the Services from any other region of the world with laws or other requirements governing personal data collection, use, or disclosure that differ from applicable laws in India, then through your continued use of the Services, you are transferring your data to India, and you expressly consent to have your data transferred to and processed in India.
          </p>

          {/* K */}
          <h2 style={sectionHeading}>K. Dispute Resolution</h2>
          <ul style={{ paddingLeft: "20px" }}>
            <li style={liStyle}>
              To expedite resolution and control the cost of any dispute, controversy, or claim related to these Legal Terms (each a "Dispute" and collectively, the "Disputes") brought by either you or us (individually, a "Party" and collectively, the "Parties"), the Parties agree to first attempt to negotiate any Dispute in the court situated in Bangalore, Karnataka.
            </li>
          </ul>

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

export default TermsAndConditions;
