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
          Last updated: 30th June 2026 &nbsp;·&nbsp; Orbitandem Technologies Private Limited
        </p>

        <hr style={{ borderColor: "#2a2a2a", marginBottom: "36px" }} />

        <div style={{ fontSize: "clamp(14px, 1.8vw, 17px)", lineHeight: "1.8", color: "#BCBCBC" }}>

          {/* 1. General */}
          <h2 style={sectionHeading}>1. General</h2>
          <p>
            In addition to our Terms and Conditions, Tandem respects your privacy and is committed to protecting it.
            This Privacy Policy (the "Policy") explains the types of information collected by Tandem when you use the
            Application (as defined in Terms and Conditions) that references this Policy, how we collect, use, share
            and store such information collected and also explains the rationale for collection of such information,
            the privacy rights and choices you have regarding your information submitted to us when you use the Services.
          </p>
          <p style={{ marginTop: "12px" }}>
            For ease of reference, use of the terms "Tandem", "Tandem : Events &amp; Experiences", "we", "us" and/or
            "our" refer to Orbitandem Technologies Private Limited — a company incorporated in India, trading as
            Tandem : Events &amp; Experiences — and all of its affiliates which have license to host the Application
            and offer Services. Similarly, use of the terms "you", "yours" and/or "User(s)" refers to all users of
            the Application.
          </p>
          <p style={{ marginTop: "12px" }}>
            The Services are governed by this Policy, Terms and Conditions, and any other rules, policies or guidelines
            published on the Application as applicable to you. Please read this Policy carefully prior to accessing our
            Application and using the Services. By accessing and using the Application, providing your Personal
            Information (defined below), or by otherwise signalling your agreement when the option is presented to you,
            you consent to the collection, use, disclosure, sharing and storing of information described in this Policy
            and any other rules, policies or guidelines published on the Application as applicable to you (collectively
            referred to as the{" "}
            <strong style={{ color: "#F2F2F2" }}>"Application Terms"</strong>), and Tandem disclaims all the liabilities
            arising therefrom.
          </p>
          <p style={{ marginTop: "12px" }}>
            If any information you have provided or uploaded on the Application violates the Application Terms, Tandem
            may be required to delete such information upon informing you of the same and revoke your access to the
            Application if required.
          </p>
          <p style={{ marginTop: "12px" }}>
            Capitalized terms used but not defined in this Policy can be found in our Terms and Conditions.
          </p>

          {/* 2. Applicability */}
          <h2 style={sectionHeading}>2. Applicability</h2>
          <p>This Policy applies to all Users of the Application.</p>
          <p style={{ marginTop: "12px" }}>
            Tandem owns and/or manages the Application that is a social planning app that makes coordinating activities
            with friends effortless and fun. Instead of swiping on people, you swipe together on things to do,
            finalizing plans in just a few taps instead of endless group chat debates. This only applies to the
            collection of your information through the Application.
          </p>
          <p style={{ marginTop: "12px" }}>
            Tandem has taken reasonable precautions as per applicable laws and implemented industry standards to treat
            Personal Information as confidential and to protect it from unauthorized access, improper use or disclosure,
            modification and unlawful destruction or accidental loss of the Personal Information.
          </p>
          <p style={{ marginTop: "12px" }}>
            <strong style={{ color: "#F2F2F2" }}>Not directed at children:</strong> The Application is not directed at,
            and we do not knowingly collect Personal Information from, individuals under the age of 18. If we become
            aware that a minor has registered or provided Personal Information to us, we will promptly delete the account
            and all associated data. If you are a parent or guardian and believe your child has registered on Tandem,
            please contact us at{" "}
            <a href="mailto:shreyas.phadke@tandem.it.com" style={{ color: "#00FFC8", textDecoration: "none" }}>
              shreyas.phadke@tandem.it.com
            </a>.
          </p>

          {/* 3. Access */}
          <h2 style={sectionHeading}>3. Access</h2>
          <p>
            To create an account, you are required to provide certain Personal Information as may be required during
            the time of registration and all other information requested on the registration page, including the ability
            to receive promotional offers from Tandem, is optional. Tandem may, in future, include other optional
            requests for information from you to help Tandem to customize the Application to deliver personalized
            information to you. Tandem may keep records of telephone calls or emails received from or made by you for
            making enquiries, feedback, or other purposes for the purpose of rendering Services effectively and efficiently.
          </p>

          {/* 4. Personal Information */}
          <h2 style={sectionHeading}>4. Personal Information</h2>
          <p>
            <strong style={{ color: "#F2F2F2" }}>"Personal Information"</strong> shall mean the information which
            identifies a User i.e., first and last name, identification number, email address, age, gender, location,
            photograph and/or phone number provided at the time of registration or any time thereafter on the Application.
          </p>
          <p style={{ marginTop: "12px" }}>
            <strong style={{ color: "#F2F2F2" }}>"Sensitive Personal Information"</strong> shall include (i) passwords
            and financial data (except the truncated last four digits of credit/debit card), (ii) phone storage data,
            (iii) official identifier (such as biometric data, Aadhaar number, social security number, driver's license,
            passport, etc.), (iv) information about sexual life, sexual identifier, race, ethnicity, political or religious
            belief or affiliation, (v) account details and passwords, or (vi) other data/information categorized as
            'sensitive personal data' or 'special categories of data' under the Information Technology (Reasonable
            Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, General Data
            Protection Regulation (GDPR) and/or the California Consumer Privacy Act (CCPA){" "}
            (<strong style={{ color: "#F2F2F2" }}>"Data Protection Laws"</strong>) and in context of this Policy or
            other equivalent/similar legislations.
          </p>
          <p style={{ marginTop: "12px" }}>
            Usage of the term <strong style={{ color: "#F2F2F2" }}>'Personal Information'</strong> shall include{" "}
            <strong style={{ color: "#F2F2F2" }}>'Sensitive Personal Information'</strong> as may be applicable to the
            context of its usage.
          </p>
          <p style={{ marginTop: "12px" }}>
            We request you to not provide Tandem with any Personal Information unless specifically requested by us. In
            the event you share with Tandem any Personal Information without us having specifically requested for the
            same, we will nonetheless handle such information in accordance with this Policy.
          </p>

          {/* 5. Information We Collect */}
          <h2 style={sectionHeading}>5. Information We Collect</h2>
          <p>
            We only collect information about you if we have a reason to do so — for example, to provide our Services
            on the Application, to communicate with you, or to make our Services better.
          </p>
          <p style={{ marginTop: "12px" }}>We collect this information from the following sources:</p>

          <h3 style={subHeading}>Information we collect from You:</h3>
          <ol style={{ paddingLeft: "22px", listStyleType: "decimal" }}>
            <li style={olLiStyle}>
              <strong style={{ color: "#F2F2F2" }}>Basic account information:</strong> In order to access certain
              features of the Application, you will need to create an account and register with us. We ask for basic
              information which may include your name, an email address, state of residence, country, and password,
              along with a username and phone/mobile number.
            </li>
            <li style={olLiStyle}>
              <strong style={{ color: "#F2F2F2" }}>Public profile information:</strong> We may collect certain
              additional information from you to enable creation of your public profile on the Application. Your public
              profile will only contain information you choose to share, such as your username, photo, and a brief bio.
            </li>
            <li style={olLiStyle}>
              <strong style={{ color: "#F2F2F2" }}>Information when you communicate with us:</strong> When you write
              to us with a question or to ask for help, we will keep that correspondence, and the email address, for
              future reference. You may also provide us your Personal Information when you respond to surveys, enter
              any form of contests, events, or competitions hosted by Tandem, or when you otherwise communicate with
              us via form, email, phone, or otherwise. We store a copy of such communications as permitted by
              applicable law.
            </li>
            <li style={olLiStyle}>
              <strong style={{ color: "#F2F2F2" }}>Information related to location:</strong> You may also choose to
              provide location related information, including but not limited to access to GPS, which will enable us,
              with your consent, to offer customized offerings for specific services where location data is relevant
              and/or applicable such as informing you whether services on the Application that you have expressed
              interest in may be availed of at or near your location.
            </li>
          </ol>

          <h3 style={subHeading}>Information we collect automatically:</h3>
          <ol style={{ paddingLeft: "22px", listStyleType: "decimal" }}>
            <li style={olLiStyle}>
              <strong style={{ color: "#F2F2F2" }}>Device and Log information:</strong> When you access our
              Application, we collect information that mobile devices and servers typically make available, including
              the device type, IP address, unique device identifiers, language preference, the date and time of access,
              operating system, and mobile network information. We collect log information when you use our Application
              — for example, when you create or make changes to your account information on the Application.
            </li>
            <li style={olLiStyle}>
              <strong style={{ color: "#F2F2F2" }}>Usage information:</strong> We collect information about your usage
              of our Application, including page views, features enabled for your account, interactions with other parts
              of our Services, and information about your device (e.g., screen size and mobile device manufacturer). We
              use this information to provide our Application to you, get insights on how people use our Application so
              that we can make our Application better, and understand and make predictions about User retention.
            </li>
            <li style={olLiStyle}>
              <strong style={{ color: "#F2F2F2" }}>Camera and Photo Library:</strong> With your permission, Tandem
              accesses your device's camera and photo library solely when you choose to upload or share photos within
              the app. We do not access your camera or photo library in the background. Photos you upload are stored
              securely on our servers (hosted in India) and are visible to the other members of your group. They are
              retained until you or your group deletes them, or until your account is deleted, whichever comes first.
            </li>
            <li style={olLiStyle}>
              <strong style={{ color: "#F2F2F2" }}>Location Information:</strong> We may determine the approximate
              location of your device from your Internet Protocol (IP) address. We may collect and use this information
              to calculate how many people visit from certain geographic regions or to improve our Application Services.
            </li>
            <li style={olLiStyle}>
              <strong style={{ color: "#F2F2F2" }}>Contact Information:</strong> With your permission, Tandem accesses
              your device's contact list (names and phone numbers) to identify which of your existing contacts are also
              on Tandem, making it easier to connect with people you already know. Contact data is used solely for this
              matching purpose, is not stored on our servers beyond what is required to perform the match, and is never
              shared with third parties or used for advertising. Contacts who are not on Tandem are not stored or
              contacted by us.
            </li>
            <li style={olLiStyle}>
              <strong style={{ color: "#F2F2F2" }}>Information from tracking technologies:</strong> We may collect
              information about you through the use of cookies and similar tracking technologies within the app to
              maintain session state and improve your experience. These technologies cannot be disabled without
              affecting core app functionality.
            </li>
            <li style={olLiStyle}>
              <strong style={{ color: "#F2F2F2" }}>Push Notifications:</strong> If you grant permission, we send you
              push notifications to alert you about new plan matches, friend activity, upcoming events, and other
              relevant updates. You can disable push notifications at any time in your device's Settings.
            </li>
          </ol>

          <h3 style={subHeading}>Information we collect from other sources:</h3>
          <p>
            We might receive and collect information about you from other sources in the course of their services to us
            or from publicly available sources, as permitted by law, which we may combine with other information we
            receive from or about you.
          </p>
          <p style={{ marginTop: "12px" }}>
            <strong style={{ color: "#F2F2F2" }}>Google Sign-In:</strong> If you choose to register or sign in using
            Google, we receive your name, email address, and profile photo from Google, which we use solely to create
            and authenticate your Tandem account. We do not receive your Google password or any other Google account
            data. Google's handling of your data is governed by Google's Privacy Policy.
          </p>

          {/* 5A. Mobile Attribution and Advertising Tracking */}
          <h2 style={sectionHeading}>5A. Mobile Attribution and Advertising Tracking</h2>
          <p>
            Tandem uses the following third-party SDKs for mobile attribution, analytics, and advertising measurement.
            Each of these services may collect certain device and usage data as described below:
          </p>
          <ul style={{ paddingLeft: "20px", listStyleType: "disc", marginTop: "12px" }}>
            <li style={liStyle}>
              <strong style={{ color: "#F2F2F2" }}>AppsFlyer (Mobile Attribution):</strong> Collects your Google
              Advertising ID (GAID), IP address, app install events, and referral source to determine which marketing
              campaigns drove your app install.
            </li>
            <li style={liStyle}>
              <strong style={{ color: "#F2F2F2" }}>Firebase / Google Analytics (Analytics &amp; Crash Reporting):</strong>{" "}
              Collects app usage events, crash reports, device information, and Firebase Installation ID to help us
              understand how the app is used and to diagnose technical issues. Data is processed by Google in accordance
              with Google's Privacy Policy.
            </li>
            <li style={liStyle}>
              <strong style={{ color: "#F2F2F2" }}>Meta (Facebook) SDK (Ad Attribution):</strong> Collects your GAID
              and app events to measure the effectiveness of our advertising campaigns on Facebook and Instagram. We do
              not use this SDK to serve ads within Tandem.
            </li>
          </ul>
          <p style={{ marginTop: "12px" }}>
            All three partners are contractually prohibited from using your data for their own advertising purposes
            beyond what is described above. Android users can limit attribution tracking by going to{" "}
            <strong style={{ color: "#F2F2F2" }}>Google Settings &gt; Privacy &gt; Ads &gt; Opt out of Ads Personalization</strong>,
            or by resetting your Google Advertising ID.
          </p>

          {/* 6. Basis of Collection */}
          <h2 style={sectionHeading}>6. Basis of Collection and Processing of Your Personal Information</h2>
          <p>
            We collect and process your Personal Information based on the following legal parameters depending upon the
            nature of Personal Information and the purposes for which it is processed:
          </p>

          <h3 style={subHeading}>Basis for collection:</h3>
          <ol style={{ paddingLeft: "22px", listStyleType: "decimal" }}>
            <li style={olLiStyle}>
              <strong style={{ color: "#F2F2F2" }}>Consent:</strong> We rely on your consent to process your Personal
              Information in certain situations. If we require your consent to collect and process certain Personal
              Information, as per the requirements under the applicable Data Protection Laws, your consent is sought at
              the time of collection of your Personal Information and such processing will be performed where consent
              is secured.
            </li>
            <li style={olLiStyle}>
              <strong style={{ color: "#F2F2F2" }}>Compliance with a legal obligation:</strong> Your Personal
              Information may be processed by us, to the extent that such processing is necessary to comply with a
              legal obligation.
            </li>
          </ol>

          <h3 style={subHeading}>Processing of your Personal Information:</h3>
          <p>
            We may process your Personal Information in connection with any of the purposes and uses set out in this
            Policy on one or more of the following legal grounds:
          </p>
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
            We do not use Personal Information for making any automated decisions affecting or creating profiles other
            than what is described in this Policy. Where the processing of your Personal Information is based on your
            consent, you have the right to withdraw your consent at any point in time in accordance with this Policy.
            Please note that should the withdrawal of consent result in us not being able to continue offering our
            Services to you, we reserve the right to withdraw or cease from offering our Services to you upon your
            consent withdrawal.
          </p>

          {/* 7. How we Use and Share */}
          <h2 style={sectionHeading}>7. How we Use and Share the Information Collected</h2>

          <h3 style={subHeading}>We use/process your information in the following manner:</h3>
          <ol style={{ paddingLeft: "22px", listStyleType: "decimal" }}>
            <li style={olLiStyle}>
              <strong style={{ color: "#F2F2F2" }}>To provide Services on our Application:</strong> We use your
              information as collected by us to allow you to access the Application and the Services offered therein,
              including without limitation to set-up and maintain your account, provide customer service, fulfil
              purchases through the Application, as and when required, verify User information and to resolve any
              glitches with our Application. The legal basis for this processing is consent or, where applicable, our
              legitimate interests in the proper administration of our Application, and/or the performance of a contract
              between you and us.
            </li>
            <li style={olLiStyle}>
              <strong style={{ color: "#F2F2F2" }}>To improve our Application and maintain safety:</strong> We use your
              information to improve and customize the Application and Services offered by us, including providing
              automatic updates to newer versions of our Application and creating new features based on the Application
              usage analysis. Further, we also use your information to prevent, detect, investigate, and take measures
              against criminal activity, fraud, misuse of or damage to our Application or network, and other threats
              and violations to Tandem's or a third party's rights and property, or the safety of Tandem, its users,
              or others.
            </li>
            <li style={olLiStyle}>
              <strong style={{ color: "#F2F2F2" }}>To market our Application and communicate with You:</strong> We will
              use your information to develop a more targeted marketing of our Application, to communicate with you about
              our offers, new products, services or even receive your feedback on the Application. The legal basis for
              this processing is consent or, where applicable, our legitimate interests in the proper administration of
              our Application.
            </li>
            <li style={olLiStyle}>
              <strong style={{ color: "#F2F2F2" }}>To establish, exercise, or defend legal claims:</strong> We may
              process any Personal Information identified in this Policy when necessary for establishing, exercising,
              or defending legal claims, whether in court, administrative, or other proceedings.
            </li>
            <li style={olLiStyle}>
              <strong style={{ color: "#F2F2F2" }}>To manage risk and obtain professional advice:</strong> We may
              process any of the Personal Information identified in this Policy to manage risk or obtain professional
              advice.
            </li>
            <li style={olLiStyle}>
              <strong style={{ color: "#F2F2F2" }}>Consent:</strong> We may otherwise use your information with your
              consent or at your direction.
            </li>
            <li style={olLiStyle}>
              <strong style={{ color: "#F2F2F2" }}>To Better Understand Our Users:</strong> We may use information we
              gather to determine which areas of the Services are most frequently visited to understand how to enhance
              the Services.
            </li>
          </ol>

          <p style={{ marginTop: "16px" }}>
            We share the information collected as per terms of this Policy only in the manner specified hereinbelow. We
            do not sell or otherwise disclose Personal Information we collect about you for monetary or other valuable
            consideration.
          </p>

          <h3 style={subHeading}>We share information with:</h3>
          <ol style={{ paddingLeft: "22px", listStyleType: "decimal" }}>
            <li style={olLiStyle}>
              <strong style={{ color: "#F2F2F2" }}>Third-party vendors/service providers:</strong> We may share
              information about you with third-party vendors or service providers (including consultants, payment
              processors, and other service providers) who need the information to provide their support services to us
              or you. These services may include providing customer support, performing business and sales analysis, and
              facilitating payment processing. Such third-party vendors are not allowed to use the information for any
              purpose other than what it was provided for.
            </li>
            <li style={olLiStyle}>
              <strong style={{ color: "#F2F2F2" }}>Third-party Applications to facilitate additional offerings:</strong>{" "}
              We may share information about you with third-party applications used to enable additional features of the
              Services. The information shared is limited to what is required to facilitate your participation and is
              based on your consent.
            </li>
            <li style={olLiStyle}>
              <strong style={{ color: "#F2F2F2" }}>Legal Disclosures:</strong> We may disclose information about you in
              response to a court order, or other governmental request where we believe in good faith that such
              disclosure is necessary to:
              <ul style={{ paddingLeft: "20px", listStyleType: "disc", marginTop: "8px" }}>
                <li style={liStyle}>Comply with applicable laws, regulations, court orders, government and law enforcement agencies' requests;</li>
                <li style={liStyle}>Protect and defend Tandem's or a third party's rights and property, or the safety of Tandem, our users, our employees, or others; or</li>
                <li style={liStyle}>Prevent, detect, investigate and take measures against criminal activity, fraud and misuse or unauthorized use of our Application and/or to enforce our Terms and Conditions.</li>
              </ul>
            </li>
            <li style={olLiStyle}>
              <strong style={{ color: "#F2F2F2" }}>Business transfers:</strong> In the event Tandem undergoes any
              merger, acquisition, or sale of company assets, user information would likely be one of the assets that
              is transferred or acquired by a third party. This Privacy Policy would continue to apply to your
              information and the party receiving your information may continue to use your information, but only
              consistent with this Privacy Policy.
            </li>
            <li style={olLiStyle}>
              <strong style={{ color: "#F2F2F2" }}>Advertising and Analytics Partners:</strong> We share data with
              AppsFlyer, Firebase/Google Analytics, and Meta as described in Section 5A above. These partners are
              contractually prohibited from using your data for their own advertising purposes beyond what is described
              in this Policy.
            </li>
            <li style={olLiStyle}>
              <strong style={{ color: "#F2F2F2" }}>With Your Consent:</strong> We may share and disclose information
              with your consent or at your direction.
            </li>
          </ol>

          <div style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "8px", padding: "16px 20px", marginTop: "20px" }}>
            <p style={{ color: "#F2F2F2", margin: 0, lineHeight: "1.7" }}>
              <strong>Your information may be shared for reasons not described in this Policy, however, we will seek
              your consent before we do the same or share information upon your direction.</strong>
            </p>
          </div>

          {/* 8. Duration */}
          <h2 style={sectionHeading}>8. Duration for which your Information is Stored</h2>
          <p>
            We retain your Personal Information only for as long as necessary to provide the Services and fulfil the
            purposes outlined in this Policy, unless a longer retention period is required or permitted by law.
          </p>
          <ul style={{ paddingLeft: "20px", listStyleType: "disc", marginTop: "12px" }}>
            <li style={liStyle}>
              <strong style={{ color: "#F2F2F2" }}>Active accounts:</strong> Personal Information is retained for the
              duration of your account.
            </li>
            <li style={liStyle}>
              <strong style={{ color: "#F2F2F2" }}>Account deletion:</strong> When you delete your account, your
              Personal Information (including profile data, contacts, and activity history) will be deleted from our
              active systems within 30 days of the deletion request.
            </li>
            <li style={liStyle}>
              <strong style={{ color: "#F2F2F2" }}>Photos and shared content:</strong> Photos uploaded to shared group
              spaces are deleted within 30 days of account deletion. Content that other group members have already
              viewed or downloaded cannot be recalled from their devices.
            </li>
            <li style={liStyle}>
              <strong style={{ color: "#F2F2F2" }}>Attribution and analytics data:</strong> Data shared with AppsFlyer,
              Firebase, and Meta for attribution purposes is subject to those providers' own retention policies, which
              are typically 24 months from collection.
            </li>
            <li style={liStyle}>
              <strong style={{ color: "#F2F2F2" }}>Backup copies:</strong> Backup copies of data may persist in our
              secure backup systems for up to 90 days following deletion from active systems, after which they are
              permanently purged.
            </li>
            <li style={liStyle}>
              <strong style={{ color: "#F2F2F2" }}>Legal holds:</strong> We may retain certain information for longer
              periods where required by law, to comply with legal obligations, or to resolve disputes.
            </li>
          </ul>
          <p style={{ marginTop: "12px" }}>
            We will never disclose aggregated or de-identified information in a manner that could identify you as an
            individual.
          </p>
          <p style={{ marginTop: "12px" }}>
            If you wish to exercise any of your rights to access, modify, or delete any or all information stored about
            you, you may do so by using the options provided within the Application or by writing to us at{" "}
            <a href="mailto:shreyas.phadke@tandem.it.com" style={{ color: "#00FFC8", textDecoration: "none" }}>
              shreyas.phadke@tandem.it.com
            </a>.
          </p>

          {/* 9. Your Choices */}
          <h2 style={sectionHeading}>9. Your Choices</h2>
          <ul style={{ paddingLeft: "20px", listStyleType: "disc" }}>
            <li style={liStyle}>
              <strong style={{ color: "#F2F2F2" }}>Limit the information You provide:</strong> You always have an
              option to choose the information you provide to us, including the option to update or delete your
              information. However, please note that lack of certain information may not allow you the access to the
              Application or any of its features, in part or in full.
            </li>
            <li style={liStyle}>
              <strong style={{ color: "#F2F2F2" }}>Limit the communications You receive from us:</strong> You will have
              the option to choose what kind of communication you would like to receive from us. However, there may be
              certain communications that are required for legal or security purposes, including changes to various legal
              agreements, that you may not be able to limit.
            </li>
            <li style={liStyle}>
              <strong style={{ color: "#F2F2F2" }}>Opt out of ad tracking (Android):</strong> You can limit our use of
              your Google Advertising ID (GAID) for attribution and advertising by going to{" "}
              <strong style={{ color: "#F2F2F2" }}>Google Settings &gt; Privacy &gt; Ads &gt; Opt out of Ads Personalization</strong>.
              You may also reset your GAID at any time from the same menu.
            </li>
            <li style={liStyle}>
              <strong style={{ color: "#F2F2F2" }}>Opt out of Meta ad attribution:</strong> You can adjust your
              Facebook/Instagram ad preferences at facebook.com/ads/preferences, or limit data sharing via your
              device's privacy settings.
            </li>
          </ul>

          {/* 10. Your Rights */}
          <h2 style={sectionHeading}>10. Your Rights</h2>
          <p>
            In general, all Users have the rights specified herein this section. However, depending on where you are
            situated, you may have certain specific rights in respect of your Personal Information accorded by the laws
            of the country you are situated in.
          </p>
          <p style={{ marginTop: "12px" }}>
            If you are a User, you may exercise any of these rights by using the options provided to you within the
            Application upon your login. If however, you are facing any issues or require any clarifications, you can
            always write to us at{" "}
            <a href="mailto:shreyas.phadke@tandem.it.com" style={{ color: "#00FFC8", textDecoration: "none" }}>
              shreyas.phadke@tandem.it.com
            </a>.
          </p>
          <ol style={{ paddingLeft: "22px", listStyleType: "decimal", marginTop: "10px" }}>
            <li style={olLiStyle}>
              <strong style={{ color: "#F2F2F2" }}>Right to Confirmation and Access:</strong> You have the right to get
              confirmation and access to your Personal Information that is with us along with other supporting
              information.
            </li>
            <li style={olLiStyle}>
              <strong style={{ color: "#F2F2F2" }}>Right to Correction:</strong> You have the right to ask us to rectify
              your Personal Information that is with us that you think is inaccurate. You also have the right to ask us
              to update your Personal Information that you think is incomplete or out-of-date.
            </li>
            <li style={olLiStyle}>
              <strong style={{ color: "#F2F2F2" }}>Right to be Forgotten:</strong> You have the right to restrict or
              prevent the continuing disclosure of your Personal Information under certain circumstances.
            </li>
            <li style={olLiStyle}>
              <strong style={{ color: "#F2F2F2" }}>Right to Erasure:</strong> If you wish to withdraw/remove your
              Personal Information from our Application, you have the right to request erasure of your Personal
              Information from our Application. However, please note that such erasure will remove all your Personal
              Information from our Application (except as specifically stated in this Policy) and may result in deletion
              of your account on the Application permanently, and the same will not be retrievable.
            </li>
          </ol>
          <p style={{ marginTop: "12px" }}>
            Remember, you are entitled to exercise your rights as stated above only with respect to your information,
            including Personal Information, and not that of other Users.
          </p>

          {/* 11. Information Security */}
          <h2 style={sectionHeading}>11. Information Security</h2>
          <ul style={{ paddingLeft: "20px", listStyleType: "disc" }}>
            <li style={liStyle}>
              We work to protect the security of your information during transmission by using Transport Layer Security
              (TLS) software, which encrypts information you input in addition to maintaining security of your
              information as required under applicable laws.
            </li>
            <li style={liStyle}>
              We maintain electronic and procedural safeguards in connection with the collection, storage, and
              disclosure of Personal Information (including Sensitive Personal Information). Our security procedures
              mean that we may occasionally request proof of identity before we disclose Personal Information to you
              that belongs to you.
            </li>
            <li style={liStyle}>
              However, no form or method of data storage or transmission system is fully secure, and we cannot guarantee
              that security provided by such system(s) is absolute and that your information will not be accessed,
              disclosed, or destroyed in the event of a breach of any of our security measures.
            </li>
            <li style={liStyle}>
              It is important for you to protect your account against unauthorized access to or use of your password. If
              you have any reason to believe that your password has been compromised, you must immediately change your
              password or inform us so that we can help you prevent such unauthorized access.
            </li>
            <li style={liStyle}>
              Access to Personal Information is restricted to authorized Tandem personnel on a need-to-know basis, and
              all such access is logged and monitored.
            </li>
            <li style={liStyle}>
              We try and ensure that the third parties who provide services to us under appropriate contracts take
              appropriate security measures to protect Personal Information in line with our policies.
            </li>
          </ul>

          {/* 12. Data Breach Notification */}
          <h2 style={sectionHeading}>12. Data Breach Notification</h2>
          <p>
            In the event of a personal data breach that is likely to result in a risk to your rights or freedoms, or as
            otherwise required under applicable law (including the Digital Personal Data Protection Act, 2023), we will:
          </p>
          <ul style={{ paddingLeft: "20px", listStyleType: "disc", marginTop: "12px" }}>
            <li style={liStyle}>
              Notify the relevant authorities (including the Data Protection Board of India, where required) without
              undue delay;
            </li>
            <li style={liStyle}>
              Notify you directly if the breach is likely to result in high risk to you, providing details of the nature
              of the breach, the data affected, the likely consequences, and the measures we have taken or propose to
              take to address the breach; and
            </li>
            <li style={liStyle}>
              Maintain an internal record of all breaches, regardless of whether notification to authorities is required.
            </li>
          </ul>
          <p style={{ marginTop: "12px" }}>
            To report a suspected security vulnerability or breach, please contact us immediately at{" "}
            <a href="mailto:shreyas.phadke@tandem.it.com" style={{ color: "#00FFC8", textDecoration: "none" }}>
              shreyas.phadke@tandem.it.com
            </a>.
          </p>

          {/* 13. Modification */}
          <h2 style={sectionHeading}>13. Modification to Privacy Policy</h2>
          <p>
            Our business changes constantly and our Policy may change from time to time. We will alert you about
            material changes by updating the "Last updated" date of this Policy and, where required by law, by notifying
            you via the Application or by email. We stand behind the promises we make and will not materially change our
            policies and practices in ways that make them less protective of customer information collected in the past
            without your consent.
          </p>

          {/* 14. Privacy Grievances */}
          <h2 style={sectionHeading}>14. Privacy Grievances</h2>
          <p>
            If you have any questions about this Policy, wish to exercise your rights, have concerns about privacy of
            your data or any privacy related grievances in respect of the Application, please register your complaint
            with a thorough description via email to our designated Grievance Officer:
          </p>
          <div style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "8px", padding: "16px 20px", marginTop: "16px" }}>
            <p style={{ color: "#F2F2F2", margin: "0 0 8px 0" }}>
              <strong>Grievance Officer:</strong> Shreyas Phadke, Founder &amp; Chief Executive Officer
            </p>
            <p style={{ color: "#F2F2F2", margin: "0 0 8px 0" }}>
              <strong>Company:</strong> Orbitandem Technologies Private Limited (trading as Tandem : Events &amp; Experiences)
            </p>
            <p style={{ color: "#F2F2F2", margin: 0 }}>
              <strong>Email:</strong>{" "}
              <a href="mailto:shreyas.phadke@tandem.it.com" style={{ color: "#00FFC8", textDecoration: "none" }}>
                shreyas.phadke@tandem.it.com
              </a>
            </p>
          </div>
          <p style={{ marginTop: "12px" }}>
            We will acknowledge your grievance within 48 hours and endeavour to resolve it within 30 (thirty) days of
            receipt, in accordance with the Information Technology (Intermediary Guidelines and Digital Media Ethics
            Code) Rules, 2021 and the Digital Personal Data Protection Act, 2023.
          </p>

          {/* 15. Country Specific */}
          <h2 style={sectionHeading}>15. Country Specific Additional Privacy Terms</h2>
          <div style={{ background: "#1a1a1a", border: "1px solid #00FFC8", borderRadius: "8px", padding: "20px 24px", marginTop: "8px" }}>
            <p style={{ color: "#00FFC8", fontWeight: "700", marginBottom: "12px", fontSize: "15px" }}>
              The following terms apply if you are an Indian resident
            </p>
            <p style={{ color: "#BCBCBC", lineHeight: "1.8", marginBottom: "16px" }}>
              <strong style={{ color: "#F2F2F2" }}>Your rights:</strong> If you are located in India, you may have the
              following rights under the Digital Personal Data Protection Act, 2023 (DPDP Act). All requests can be
              made by using the option provided to you within the Application upon your login or by contacting our
              Grievance Officer.
            </p>
            <ol style={{ paddingLeft: "22px", listStyleType: "decimal", color: "#BCBCBC", lineHeight: "1.8", margin: 0 }}>
              <li style={olLiStyle}>
                <strong style={{ color: "#F2F2F2" }}>Right to Confirmation and Access:</strong> You have the right to
                get confirmation and access to your Personal Information that is with us along with other supporting
                information.
              </li>
              <li style={olLiStyle}>
                <strong style={{ color: "#F2F2F2" }}>Right to Correction:</strong> You have the right to ask us to
                rectify your Personal Information that is with us that you think is inaccurate. You also have the right
                to ask us to update your Personal Information that you think is incomplete or out-of-date.
              </li>
              <li style={olLiStyle}>
                <strong style={{ color: "#F2F2F2" }}>Right to Data Portability:</strong> You have the right to ask that
                we transfer the Personal Information you gave us to another organisation, or to you, under certain
                circumstances.
              </li>
              <li style={olLiStyle}>
                <strong style={{ color: "#F2F2F2" }}>Right to be Forgotten:</strong> You have the right to restrict or
                prevent the continuing disclosure of your Personal Information under certain circumstances.
              </li>
              <li style={olLiStyle}>
                <strong style={{ color: "#F2F2F2" }}>Right to Erasure:</strong> If you wish to withdraw/remove your
                Personal Information from our Application, you have the right to request erasure of your Personal
                Information from our Application. However, please note that such erasure will remove all your Personal
                Information from our Application (except as specifically stated in this Policy) and may result in
                deletion of your account on the Application permanently, and the same will not be retrievable.
              </li>
              <li style={{ marginBottom: 0, paddingLeft: "8px" }}>
                <strong style={{ color: "#F2F2F2" }}>Right to Nominate:</strong> Under the DPDP Act, you have the right
                to nominate another individual who shall exercise your rights in the event of your death or incapacity.
              </li>
            </ol>
          </div>

        </div>

        <hr style={{ borderColor: "#2a2a2a", marginTop: "60px", marginBottom: "24px" }} />
        <p style={{ color: "#969696", fontSize: "13px", lineHeight: "1.7" }}>
          Legal Entity: Orbitandem Technologies Private Limited<br />
          Grievance Officer:{" "}
          <a href="mailto:shreyas.phadke@tandem.it.com" style={{ color: "#00FFC8", textDecoration: "none" }}>shreyas.phadke@tandem.it.com</a>
        </p>

      </div>
    </div>
  );
};

export default PrivacyPolicy;
