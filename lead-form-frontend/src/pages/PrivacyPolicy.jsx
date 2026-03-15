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
  marginTop: "22px",
  marginBottom: "8px",
  fontSize: "clamp(14px, 1.8vw, 17px)",
  fontWeight: "600",
  color: "#BCBCBC",
  fontStyle: "italic",
};

const liStyle = { marginBottom: "10px", paddingLeft: "8px" };
const olLiStyle = { marginBottom: "10px", paddingLeft: "8px" };

const PrivacyPolicy = () => {
  return (
    <div style={{ minHeight: "100vh", background: "#111111", color: "#F2F2F2", fontFamily: '"Anek Latin", Helvetica, sans-serif', position: "relative" }}>

      <LegalNavbar />

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "clamp(24px, 5vw, 60px) clamp(16px, 4vw, 40px) 80px", position: "relative", zIndex: 60 }}>

        <h1 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: "700", marginBottom: "8px", color: "#F2F2F2" }}>
          Privacy Policy
        </h1>
        <p style={{ color: "#969696", fontSize: "14px", marginBottom: "36px" }}>
          Effective Date: January 1, 2026 &nbsp;·&nbsp; Orbitandem Technologies Private Limited
        </p>

        <hr style={{ borderColor: "#2a2a2a", marginBottom: "36px" }} />

        <div style={{ fontSize: "clamp(14px, 1.8vw, 17px)", lineHeight: "1.8", color: "#BCBCBC" }}>

          {/* A. General */}
          <h2 style={sectionHeading}>A. General</h2>
          <p>
            In addition to our Terms and Conditions, Tandem respects your privacy and is committed to
            protecting it. This Privacy Policy (the "Policy") explains the types of information collected
            by Tandem when you use the Application that references this Policy, how we collect, use, share
            and store such information, and also explains the rationale for collection of such information,
            the privacy rights and choices you have regarding your information submitted to us when you use
            the Services.
          </p>
          <p style={{ marginTop: "12px" }}>
            For ease of reference, "Tandem", "Tandem : Events &amp; Experiences", "we", "us", and/or "our"
            refer to Orbitandem Technologies Private Limited — a company incorporated in India and all of
            its affiliates which have license to host the Application and offer Services. "You", "yours"
            and/or "User(s)" refer to all users of the Application.
          </p>
          <p style={{ marginTop: "12px" }}>
            By accessing and using the Application, providing your Personal Information, or by otherwise
            signalling your agreement, you consent to the collection, use, disclosure, sharing and storing
            of information described in this Policy (collectively the{" "}
            <strong style={{ color: "#F2F2F2" }}>"Application Terms"</strong>). If you do not agree with
            the way your Personal Information is collected, stored, or used, you may access, modify and/or
            delete your Personal Information in accordance with the{" "}
            <strong style={{ color: "#F2F2F2" }}>Your Choices</strong> and{" "}
            <strong style={{ color: "#F2F2F2" }}>Your Rights</strong> sections below.
          </p>
          <p style={{ marginTop: "12px" }}>
            If any information you have provided or uploaded violates the Application Terms, Tandem may be
            required to delete such information upon informing you and revoke your access to the Application.
          </p>
          <p style={{ marginTop: "12px" }}>
            Capitalized terms used but not defined in this Policy can be found in our Terms and Conditions.
          </p>

          {/* B. Applicability */}
          <h2 style={sectionHeading}>B. Applicability</h2>
          <p>This Policy applies to all Users of the Application.</p>
          <p style={{ marginTop: "12px" }}>
            Tandem is a social planning app that makes coordinating activities with friends effortless and
            fun. Instead of swiping on people, you swipe together on things to do, finalizing plans in just
            a few taps instead of endless group chat debates. This Policy only applies to the collection of
            your information through the Application.
          </p>
          <p style={{ marginTop: "12px" }}>
            Tandem has taken reasonable precautions as per applicable laws and implemented industry
            standards to treat Personal Information as confidential and to protect it from unauthorized
            access, improper use or disclosure, modification and unlawful destruction or accidental loss.
          </p>

          {/* C. Access */}
          <h2 style={sectionHeading}>C. Access</h2>
          <p>
            To create an account, you are required to provide certain Personal Information as may be
            required during registration. All other information requested on the registration page,
            including the ability to receive promotional offers from Tandem, is optional. Tandem may keep
            records of telephone calls or emails received from or made by you for the purpose of rendering
            Services effectively and efficiently.
          </p>

          {/* D. Personal Information */}
          <h2 style={sectionHeading}>D. Personal Information</h2>
          <p>
            <strong style={{ color: "#F2F2F2" }}>"Personal Information"</strong> shall mean the information
            which identifies a User i.e., first and last name, identification number, email address, age,
            gender, location, photograph and/or phone number provided at the time of registration or any
            time thereafter on the Application.
          </p>
          <p style={{ marginTop: "12px" }}>
            <strong style={{ color: "#F2F2F2" }}>"Sensitive Personal Information"</strong> shall include
            (i) passwords and financial data, (ii) phone storage data, (iii) official identifiers such as
            biometric data, Aadhar number, social security number, driver's license, passport, etc.,
            (iv) information about sexual life, sexual identifier, race, ethnicity, political or religious
            belief or affiliation, (v) account details and passwords, or (vi) other data categorized as
            'sensitive personal data' under the IT Rules 2011, GDPR, and/or CCPA
            (<strong style={{ color: "#F2F2F2" }}>"Data Protection Laws"</strong>).
          </p>
          <p style={{ marginTop: "12px" }}>
            We request you not to provide Tandem with any Personal Information unless specifically requested
            by us. We bear no liability in respect of Personal Information provided without our request.
          </p>

          {/* E. Information We Collect */}
          <h2 style={sectionHeading}>E. Information We Collect</h2>
          <p>
            We only collect information about you if we have a reason to do so — for example, to provide
            our Services, to communicate with you, or to make our Services better.
          </p>

          <h3 style={subHeading}>Information we collect from You:</h3>
          <ol style={{ paddingLeft: "22px", listStyleType: "decimal" }}>
            <li style={olLiStyle}>
              <strong style={{ color: "#F2F2F2" }}>Basic account information:</strong> In order to access
              certain features of the Application, you will need to create an account and register with us.
              We ask for basic information which may include your name, an email address, state of residence,
              country, and password, along with a username and phone/mobile number.
            </li>
            <li style={olLiStyle}>
              <strong style={{ color: "#F2F2F2" }}>Public profile information:</strong> If you are a Content
              Provider, we may collect additional information to enable creation of your public profile. We
              do not share KYC information or documents on these profiles.
            </li>
            <li style={olLiStyle}>
              <strong style={{ color: "#F2F2F2" }}>Information when you communicate with us:</strong> When
              you write to us with a question or to ask for help, we will keep that correspondence, and the
              email address, for future reference. We may also store information provided in surveys,
              contests, events, or competitions hosted by Tandem.
            </li>
            <li style={olLiStyle}>
              <strong style={{ color: "#F2F2F2" }}>Information related to location:</strong> You may choose
              to provide GPS-based location data, which enables us — with your consent — to offer customized
              services relevant to your location.
            </li>
          </ol>

          <h3 style={subHeading}>Information we collect automatically:</h3>
          <ol style={{ paddingLeft: "22px", listStyleType: "decimal" }}>
            <li style={olLiStyle}>
              <strong style={{ color: "#F2F2F2" }}>Device and Log information:</strong> Browser type, IP
              address, unique device identifiers, language preference, referring site, date and time of
              access, operating system, and mobile network information.
            </li>
            <li style={olLiStyle}>
              <strong style={{ color: "#F2F2F2" }}>Usage information:</strong> Page views, features enabled,
              interactions with our Services, screen size, and device manufacturer — used to improve the
              Application and predict User retention.
            </li>
            <li style={olLiStyle}>
              <strong style={{ color: "#F2F2F2" }}>Camera Rolls:</strong> We collect information from your
              camera roll to facilitate app activity as part of the service experience.
            </li>
            <li style={olLiStyle}>
              <strong style={{ color: "#F2F2F2" }}>Location Information:</strong> Approximate location
              determined from IP address, used to understand geographic usage patterns and improve Services.
            </li>
            <li style={olLiStyle}>
              <strong style={{ color: "#F2F2F2" }}>Contact Information:</strong> Phone contacts to facilitate
              friend circle matching for a better experience.
            </li>
            <li style={olLiStyle}>
              <strong style={{ color: "#F2F2F2" }}>Cookies &amp; other technologies:</strong> We may collect
              information through cookies and similar technologies. Please refer to our Cookie Policy for
              more details.
            </li>
          </ol>

          <h3 style={subHeading}>Information we collect from other sources:</h3>
          <p>
            We might receive information about you from other sources — for example, from a social media
            site or a Google service if you connect through that site or use Google sign-in.
          </p>

          {/* F. Basis of Collection */}
          <h2 style={sectionHeading}>F. Basis of Collection and Processing of Your Personal Information</h2>

          <h3 style={subHeading}>Basis for collection:</h3>
          <ol style={{ paddingLeft: "22px", listStyleType: "decimal" }}>
            <li style={olLiStyle}>
              <strong style={{ color: "#F2F2F2" }}>Consent:</strong> We rely on your consent to process
              your Personal Information in certain situations. If we require your consent to collect and
              process certain Personal Information, your consent is sought at the time of collection.
            </li>
            <li style={olLiStyle}>
              <strong style={{ color: "#F2F2F2" }}>Compliance with a legal obligation:</strong> Your
              Personal Information may be processed to the extent that such processing is necessary to
              comply with a legal obligation.
            </li>
          </ol>

          <h3 style={subHeading}>Processing of your Personal Information:</h3>
          <p>We may process your Personal Information on one or more of the following legal grounds:</p>
          <ol style={{ paddingLeft: "22px", listStyleType: "decimal", marginTop: "10px" }}>
            <li style={olLiStyle}>Because it is necessary to perform the Services you have requested or to comply with your instructions or other contractual obligations between you and us;</li>
            <li style={olLiStyle}>To comply with our legal obligations as well as to keep records of our compliance processes;</li>
            <li style={olLiStyle}>Because our legitimate interests, or those of a third-party recipient of your Personal Information, make the processing necessary, provided those interests are not overridden by your interests or fundamental rights and freedoms;</li>
            <li style={olLiStyle}>Because you have chosen to publish or display your Personal Information on a public area of the Application;</li>
            <li style={olLiStyle}>Because it is necessary to protect your vital interests;</li>
            <li style={olLiStyle}>Because it is necessary in the public interest; or</li>
            <li style={olLiStyle}>Because you have expressly given us your consent to process your Personal Information in a particular manner.</li>
          </ol>
          <p style={{ marginTop: "12px" }}>
            We do not use Personal Information for making automated decisions affecting or creating profiles
            other than what is described in this Policy. You have the right to withdraw your consent at any
            point in time; however, doing so may result in us being unable to continue offering our Services
            to you.
          </p>

          {/* G. How we Use and Share */}
          <h2 style={sectionHeading}>G. How we Use and Share the Information Collected</h2>

          <h3 style={subHeading}>We use/process your information to:</h3>
          <ol style={{ paddingLeft: "22px", listStyleType: "decimal" }}>
            <li style={olLiStyle}>
              <strong style={{ color: "#F2F2F2" }}>Provide Services on our Application:</strong> Set up and
              maintain your account, provide customer service, fulfil purchases, verify User information,
              and resolve any glitches with our Application.
            </li>
            <li style={olLiStyle}>
              <strong style={{ color: "#F2F2F2" }}>Improve our Application and maintain safety:</strong> Customize
              the Application, provide automatic updates, create new features, prevent criminal activity,
              fraud, and misuse.
            </li>
            <li style={olLiStyle}>
              <strong style={{ color: "#F2F2F2" }}>Market our Application and communicate with You:</strong> Develop
              targeted marketing, communicate about offers, new products, and receive feedback.
            </li>
            <li style={olLiStyle}>
              <strong style={{ color: "#F2F2F2" }}>Establish, exercise, or defend legal claims:</strong> When
              necessary for court, administrative, or other proceedings.
            </li>
            <li style={olLiStyle}>
              <strong style={{ color: "#F2F2F2" }}>Manage risk and obtain professional advice:</strong> To
              protect our business and Application.
            </li>
            <li style={olLiStyle}>
              <strong style={{ color: "#F2F2F2" }}>Consent:</strong> We may otherwise use your information
              with your consent or at your direction.
            </li>
            <li style={olLiStyle}>
              <strong style={{ color: "#F2F2F2" }}>Better Understand Our Users:</strong> Determine which
              areas of the Services are most frequently visited to understand how to enhance the Services.
            </li>
          </ol>

          <p style={{ marginTop: "16px" }}>
            We do not sell or disclose Personal Information for monetary or other valuable consideration.
            Only authorized representatives of Tandem on a need-to-know basis use any information received
            from you.
          </p>

          <h3 style={subHeading}>We share information with:</h3>
          <ol style={{ paddingLeft: "22px", listStyleType: "decimal" }}>
            <li style={olLiStyle}>
              <strong style={{ color: "#F2F2F2" }}>Third-party vendors/service providers:</strong> Consultants,
              payment processors, and integrated services who need information to provide their support.
              They are not allowed to use the information for any other purpose.
            </li>
            <li style={olLiStyle}>
              <strong style={{ color: "#F2F2F2" }}>Third-party Applications:</strong> To facilitate
              interactive forums between Content Providers and users, limited to what is required and based
              on your consent.
            </li>
            <li style={olLiStyle}>
              <strong style={{ color: "#F2F2F2" }}>Legal Disclosures:</strong> In response to a court order
              or governmental request, or where we believe in good faith that disclosure is necessary to:
              <ul style={{ paddingLeft: "20px", listStyleType: "disc", marginTop: "8px" }}>
                <li style={liStyle}>Comply with applicable laws, regulations, court orders, government and law enforcement agencies' requests;</li>
                <li style={liStyle}>Protect and defend Tandem's or a third party's rights and property, or the safety of Tandem, our users, or others; or</li>
                <li style={liStyle}>Prevent, detect, investigate and take measures against criminal activity, fraud and misuse of our Application.</li>
              </ul>
              To the extent permitted by law, we will attempt to give you prior notice before disclosing
              your information in response to such a request.
            </li>
            <li style={olLiStyle}>
              <strong style={{ color: "#F2F2F2" }}>Business transfers:</strong> In the event of a merger,
              acquisition, or sale of assets, this Privacy Policy would continue to apply to your information.
            </li>
            <li style={olLiStyle}>
              <strong style={{ color: "#F2F2F2" }}>Advertising and Analytics Partners:</strong> Usage data
              may be shared via cookies and similar technologies.
            </li>
            <li style={olLiStyle}>
              <strong style={{ color: "#F2F2F2" }}>With Your Consent:</strong> We may share and disclose
              information with your consent or at your direction.
            </li>
          </ol>

          <div style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "8px", padding: "16px 20px", marginTop: "20px" }}>
            <p style={{ color: "#F2F2F2", margin: 0, lineHeight: "1.7" }}>
              <strong>Your information may be shared for reasons not described in this Policy, however, we
              will seek your consent before we do so or share information upon your direction.</strong>
            </p>
          </div>

          {/* H. Duration */}
          <h2 style={sectionHeading}>H. Duration for which your Information is Stored</h2>
          <p>
            When you delete your account on the Application, the same will be deleted from our servers.
            However, in certain cases, we will retain your information for as long as required for legal
            obligation or business compliance purposes.
          </p>
          <p style={{ marginTop: "12px" }}>
            We may not be able to delete all public content (e.g., comments, feedback), however, we shall
            anonymize your Personal Information so you can no longer be identified as an individual. We
            will never disclose aggregated or de-identified information in a manner that could identify you.
          </p>
          <p style={{ marginTop: "12px" }}>
            To access, modify or delete your stored information, use the options provided within the
            Application, or write to us at{" "}
            <a href="mailto:shreyas.phadke@tandem.it.com" style={{ color: "#00FFC8", textDecoration: "none" }}>
              shreyas.phadke@tandem.it.com
            </a>
            {" "}or{" "}
            <a href="mailto:ayush.agrawal@tandem.it.com" style={{ color: "#00FFC8", textDecoration: "none" }}>
              ayush.agrawal@tandem.it.com
            </a>.
          </p>

          {/* I. Your Choices */}
          <h2 style={sectionHeading}>I. Your Choices</h2>
          <ul style={{ paddingLeft: "20px", listStyleType: "disc" }}>
            <li style={liStyle}>
              <strong style={{ color: "#F2F2F2" }}>Limit the information You provide:</strong> You can
              choose the information you provide to us, including the option to update or delete it.
              However, lack of certain information may restrict your access to the Application or its
              features.
            </li>
            <li style={liStyle}>
              <strong style={{ color: "#F2F2F2" }}>Limit the communications You receive from us:</strong> You
              can choose what kind of communication you would like to receive from us. Note that certain
              legal or security communications may not be limitable.
            </li>
            <li style={liStyle}>
              <strong style={{ color: "#F2F2F2" }}>Reject Cookies and other similar technologies:</strong> You
              may reject or remove cookies from your web browser. Note that some Services may not function
              when cookies are rejected or disabled.
            </li>
          </ul>

          {/* J. Your Rights */}
          <h2 style={sectionHeading}>J. Your Rights</h2>
          <p>
            All Users have the rights specified herein. Depending on where you are situated, you may have
            certain specific rights accorded by the laws of your country. You may exercise these rights
            using the options within the Application upon login, or by writing to us.
          </p>
          <ol type="a" style={{ paddingLeft: "22px" }}>
            <li style={olLiStyle}>
              <strong style={{ color: "#F2F2F2" }}>Right to Confirmation and Access:</strong> You have the
              right to get confirmation and access to your Personal Information along with other supporting
              information.
            </li>
            <li style={olLiStyle}>
              <strong style={{ color: "#F2F2F2" }}>Right to Correction:</strong> You have the right to ask
              us to rectify inaccurate Personal Information, or update information that is incomplete or
              out-of-date.
            </li>
            <li style={olLiStyle}>
              <strong style={{ color: "#F2F2F2" }}>Right to be Forgotten:</strong> You have the right to
              restrict or prevent the continuing disclosure of your Personal Information under certain
              circumstances.
            </li>
            <li style={olLiStyle}>
              <strong style={{ color: "#F2F2F2" }}>Right to Erasure:</strong> You have the right to request
              erasure of your Personal Information from our Application. Please note this will permanently
              delete your account and the same will not be retrievable.
            </li>
          </ol>
          <p style={{ marginTop: "12px" }}>
            You are entitled to exercise these rights only with respect to your own information. As per
            applicable Data Protection Laws, we may need to verify your identity before processing requests.
          </p>

          {/* K. Information Security */}
          <h2 style={sectionHeading}>K. Information Security</h2>
          <ul style={{ paddingLeft: "20px", listStyleType: "disc" }}>
            <li style={liStyle}>
              We use TLS/SSL software to encrypt information during transmission and maintain security as
              required under applicable laws.
            </li>
            <li style={liStyle}>
              We maintain electronic and procedural safeguards in connection with the collection, storage,
              and disclosure of Personal Information. We may occasionally request proof of identity before
              disclosing your information.
            </li>
            <li style={liStyle}>
              No data storage or transmission system is fully secure. We cannot guarantee absolute security,
              and your information will not be accessed, disclosed, or destroyed in the event of a breach.
            </li>
            <li style={liStyle}>
              If you believe your password has been compromised, change it immediately or inform us so we
              can help prevent unauthorized access. Sign off when using shared computers.
            </li>
            <li style={liStyle}>
              All KYC information collected is fully encrypted and can only be accessed by designated
              authority within Tandem.
            </li>
            <li style={liStyle}>
              We ensure that third-party service providers under appropriate contracts take appropriate
              security measures to protect Personal Information.
            </li>
          </ul>

          {/* L. Modification */}
          <h2 style={sectionHeading}>L. Modification to Privacy Policy</h2>
          <p>
            Our business changes constantly and our Policy may change from time to time. We encourage you
            to check our Application frequently to see recent changes. Unless stated otherwise, our current
            Policy applies to all information we have about you. We will not materially change our policies
            and practices making them less protective of customer information collected in the past without
            your consent.
          </p>

          {/* M. Privacy Grievances */}
          <h2 style={sectionHeading}>M. Privacy Grievances</h2>
          <p>
            If you have any questions about this Policy, wish to exercise your rights, or have concerns
            about privacy of your data, please register your complaint with a thorough description via
            email to{" "}
            <a href="mailto:shreyas.phadke@tandem.it.com" style={{ color: "#00FFC8", textDecoration: "none" }}>
              shreyas.phadke@tandem.it.com
            </a>
            {" "}or{" "}
            <a href="mailto:ayush.agrawal@tandem.it.com" style={{ color: "#00FFC8", textDecoration: "none" }}>
              ayush.agrawal@tandem.it.com
            </a>.
          </p>

          {/* N. Country Specific */}
          <h2 style={sectionHeading}>N. Country Specific Additional Privacy Terms</h2>
          <div style={{ background: "#1a1a1a", border: "1px solid #00FFC8", borderRadius: "8px", padding: "20px 24px", marginTop: "8px" }}>
            <p style={{ color: "#00FFC8", fontWeight: "700", marginBottom: "12px", fontSize: "15px" }}>
              Applicable if you are an Indian resident
            </p>
            <p style={{ color: "#BCBCBC", lineHeight: "1.8", marginBottom: "16px" }}>
              <strong style={{ color: "#F2F2F2" }}>Your rights:</strong> If you are located in India, you
              may have the following rights under the Personal Data Protection Bill (PDPB) when it becomes
              legislation. All requests can be made using the option provided within the Application upon
              login.
            </p>
            <ol style={{ paddingLeft: "22px", listStyleType: "decimal", color: "#BCBCBC", lineHeight: "1.8", margin: 0 }}>
              <li style={olLiStyle}>
                <strong style={{ color: "#F2F2F2" }}>Right to Confirmation and Access:</strong> Get
                confirmation and access to your Personal Information along with other supporting information.
              </li>
              <li style={olLiStyle}>
                <strong style={{ color: "#F2F2F2" }}>Right to Correction:</strong> Ask us to rectify
                inaccurate or incomplete Personal Information.
              </li>
              <li style={olLiStyle}>
                <strong style={{ color: "#F2F2F2" }}>Right to Data Portability:</strong> Ask that we
                transfer your Personal Information to another organisation, or to you, under certain
                circumstances.
              </li>
              <li style={olLiStyle}>
                <strong style={{ color: "#F2F2F2" }}>Right to be Forgotten:</strong> Restrict or prevent
                the continuing disclosure of your Personal Information under certain circumstances.
              </li>
              <li style={{ marginBottom: 0, paddingLeft: "8px" }}>
                <strong style={{ color: "#F2F2F2" }}>Right to Erasure:</strong> Request erasure of your
                Personal Information from our Application. Note this will permanently delete your account
                and cannot be reversed.
              </li>
            </ol>
          </div>

        </div>

        <hr style={{ borderColor: "#2a2a2a", marginTop: "60px", marginBottom: "24px" }} />
        <p style={{ color: "#969696", fontSize: "13px", lineHeight: "1.7" }}>
          Legal Entity: Orbitandem Technologies Private Limited<br />
          Director Contacts:{" "}
          <a href="mailto:shreyas.phadke@tandem.it.com" style={{ color: "#00FFC8", textDecoration: "none" }}>shreyas.phadke@tandem.it.com</a>
          {" "}·{" "}
          <a href="mailto:ayush.agrawal@tandem.it.com" style={{ color: "#00FFC8", textDecoration: "none" }}>ayush.agrawal@tandem.it.com</a>
        </p>

      </div>
    </div>
  );
};

export default PrivacyPolicy;