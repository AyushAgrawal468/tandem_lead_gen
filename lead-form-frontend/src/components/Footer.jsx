import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import linkedinLogo from '../assets/linkedinlogo.png'
import youtubeLogo from '../assets/youtubelogo.png'
import whatsappLogo from '../assets/whatsapplogo.png'

const Footer = () => {
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  return (
  <footer id="footer"
      className="w-full border-t border-gray-800"
      style={{ backgroundColor: '#121212', flexShrink: 0 }}
    >
      {/* Mobile & md only: remove orange tap/click highlight & prevent color shift on legal buttons */}
      <style>{`
        @media (max-width: 1023.98px) {
          #footer button.legal-link { 
            -webkit-tap-highlight-color: transparent; 
            outline: none; 
          }
          #footer button.legal-link:focus,
          #footer button.legal-link:active,
          #footer button.legal-link:hover {
            color: #ffffff !important; /* keep white */
            text-decoration: none; 
          }
        }
      `}</style>
      {/* desktop-only: disable color/border animation on legal buttons */}
      <style>{`
        @media (min-width: 1024px) {
          #footer button.legal-link {
            transition: none !important; /* override tailwind transition-colors */
            outline: none !important;
          }
          #footer button.legal-link:focus,
          #footer button.legal-link:active,
          #footer button.legal-link:hover {
            color: #ffffff !important; /* keep white */
            text-decoration: none !important;
            background: transparent !important;
            border-color: transparent !important;
            box-shadow: none !important; /* prevent any focus ring visuals */
          }
        }
      `}</style>
      {/* md-only: disable color animation on legal buttons */}
      <style>{`
        @media (min-width: 768px) and (max-width: 1023.98px) {
          #footer button.legal-link {
            transition: none !important; /* override tailwind transition-colors */
            -webkit-tap-highlight-color: transparent; 
          }
          #footer button.legal-link:focus,
          #footer button.legal-link:active,
          #footer button.legal-link:hover {
            color: #ffffff !important; /* keep white */
            text-decoration: none !important;
            background: transparent !important;
          }
        }
      `}</style>
      {/* Consistent thin scrollbars for legal modals across desktop, tablet, mobile */}
      <style>{`
        .legal-scroll { 
          scrollbar-color: rgba(255,255,255,0.35) transparent; /* Firefox */
          scrollbar-width: thin; /* Firefox */
          -webkit-overflow-scrolling: touch; /* iOS momentum scroll */
        }
        .legal-scroll::-webkit-scrollbar { width: 8px; height: 8px; }
        .legal-scroll::-webkit-scrollbar-track { background: transparent; }
        .legal-scroll::-webkit-scrollbar-thumb { 
          background: rgba(255,255,255,0.35); 
          border-radius: 8px; 
          border: 2px solid transparent; 
        }
        .legal-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.5); }
      `}</style>
      {/* Terms and Conditions Popup */}
      {showTerms && typeof document !== 'undefined' && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Terms & Conditions"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.55)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowTerms(false) }}
        >
          <div
            className="border border-gray-700 rounded-lg w-full max-w-xl overflow-y-auto legal-scroll"
            style={{
              background: 'rgba(255, 255, 255, 0.10)',
              backdropFilter: 'blur(50px)',
              WebkitBackdropFilter: 'blur(50px)',
              color: '#ffffff',
              padding: '28px 30px 32px',
              maxHeight: 'min(700px, 90vh)',
              boxShadow: '0 4px 32px rgba(0,0,0,0.4)'
            }}
          >
            <h3 className="text-texthigh font-semibold text-[26px] leading-tight mb-5">Terms & Conditions</h3>
            <div className="text-textmid text-[15px] leading-relaxed space-y-4">
              <div>
                <strong className="text-texthigh">1. Acceptance of Terms</strong>
                <p>By registering or using Tandem, you accept these terms, our Privacy Policy, and any referenced guidelines.</p>
              </div>
              <div>
                <strong className="text-texthigh">2. Eligibility</strong>
                <p>Only users aged 18 and above may use Tandem. Tandem reserves the right to remove underage accounts without notice.</p>
              </div>
              <div>
                <strong className="text-texthigh">3. User Account Responsibility</strong>
                <p>Users agree to maintain confidentiality of their login credentials and are responsible for all account activity. Tandem is not responsible for unauthorized use due to negligence.</p>
              </div>
              <div>
                <strong className="text-texthigh">4. Prohibited Activities</strong>
                <p>Any abuse, harassment, illegal conduct, spamming, or behavior inconsistent with Tandem’s mission will result in immediate suspension or termination of your account.</p>
              </div>
              <div>
                <strong className="text-texthigh">5. Content & Intellectual Property Rights</strong>
                <p>By submitting content (text, images, event details), users grant Tandem a license to use such content solely for app-related features. Tandem will not share or sell user content to third parties for marketing unless explicit consent is given.</p>
              </div>
              <div>
                <strong className="text-texthigh">6. Payments & Third-Party Transactions</strong>
                <p>Where applicable, all ticketing, payment, or booking transactions are handled via secure third-party processors. Tandem is not liable for errors, failures or frauds committed by third-party payment gateways; users must follow up directly for dispute resolution.</p>
              </div>
              <div>
                <strong className="text-texthigh">7. Account Suspension or Termination</strong>
                <p>Tandem may suspend or terminate accounts at its sole discretion for breach of these terms or unlawful activity. Users may request account deletion by email.</p>
              </div>
              <div>
                <strong className="text-texthigh">8. Data & Privacy Protection</strong>
                <p>All user data is handled per Tandem’s Privacy Policy. For any privacy violation, contact the director at the provided emails.</p>
              </div>
              <div>
                <strong className="text-texthigh">9. Limitation of Liability</strong>
                <p>Tandem, Orbitandem Technologies Private Limited, its directors, or affiliates are not liable for any direct, indirect, incidental, consequential, or punitive damages resulting from use or inability to use the app, except as required by law.</p>
              </div>
              <div>
                <strong className="text-texthigh">10. Indemnification</strong>
                <p>Users indemnify Tandem and affiliates against any claims, liabilities, or expenses arising from breach of these terms or misuse of the service.</p>
              </div>
              <div>
                <strong className="text-texthigh">11. Governing Law</strong>
                <p>All disputes are governed by the laws of India, with exclusive jurisdiction in Bangalore courts.</p>
              </div>
              <div>
                <strong className="text-texthigh">12. Modifications</strong>
                <p>Tandem reserves the right to change these Terms & Conditions at any time. Continued use of the app after changes means acceptance of revised terms.</p>
              </div>
              <div>
                <strong className="text-texthigh">13. Contact Information</strong>
                <p>Legal Entity: Orbitandem Technologies Private Limited<br/>Director Contacts: shreyas.phadke@tandem.it.com , ayush.agrawal@tandem.it.com</p>
              </div>
            </div>
            <div className="mt-8 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowTerms(false)}
                className="px-5 py-2.5 rounded-md font-semibold text-[14px] tracking-wide shadow-sm transition-colors"
                style={{
                  background: '#4DBBFF',
                  color: '#0B1A24',
                  border: '1px solid rgba(255,255,255,0.15)'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#6AC6FF' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#4DBBFF' }}
              >Close</button>
            </div>
          </div>
        </div>,
        document.body
      )}
      {/* Privacy Policy Popup */}
      {showPrivacy && typeof document !== 'undefined' && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Privacy Policy"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.55)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowPrivacy(false) }}
        >
          <div
            className="border border-gray-700 rounded-lg w-full max-w-xl overflow-y-auto legal-scroll"
            style={{
              background: 'rgba(255, 255, 255, 0.10)',
              backdropFilter: 'blur(50px)',
              WebkitBackdropFilter: 'blur(50px)',
              color: '#ffffff',
              padding: '28px 30px 32px',
              maxHeight: 'min(700px, 90vh)',
              boxShadow: '0 4px 32px rgba(0,0,0,0.4)'
            }}
          >
            <h3 className="text-texthigh font-semibold text-[26px] leading-tight mb-5">Privacy Policy</h3>
            <div className="text-textmid text-[15px] leading-relaxed space-y-4">
              <div>
                <strong className="text-texthigh">1. Introduction</strong>
                <p>Tandem is operated by Orbitandem Technologies Private Limited. Tandem is committed to protecting your privacy and personal information. This Privacy Policy outlines what data we collect, how we use it, your rights, and our safeguards.</p>
              </div>
              <div>
                <strong className="text-texthigh">2. Data Collected</strong>
                <p>We collect only the necessary personal data: name, phone number, and gender. Additional data such as event and usage information may be collected when you use features like calendar sync, photos, or messaging.</p>
              </div>
              <div>
                <strong className="text-texthigh">3. Data Usage</strong>
                <p>Your data is used to personalize your experience, enable social planning features, improve our app quality, and ensure safety. No personal data is shared with external partners except under legal compulsion or to deliver app features (e.g., payment processors), with clear user consent if required.</p>
              </div>
              <div>
                <strong className="text-texthigh">4. User Control and Deletion</strong>
                <p>You can request data correction or deletion by emailing us. In future releases, Tandem will enable self-serve data deletion, and portability features directly in the app.</p>
              </div>
              <div>
                <strong className="text-texthigh">5. Data Retention</strong>
                <p>If you delete your account, user data is retained for 12 months unless deletion is specifically requested earlier for regulatory compliance or user safety.</p>
              </div>
              <div>
                <strong className="text-texthigh">6. Age Restrictions</strong>
                <p>Only users of 18+ years old may register for Tandem. Any underage account will be removed, especially where events involve alcohol.</p>
              </div>
              <div>
                <strong className="text-texthigh">7. Security Measures</strong>
                <p>Tandem uses encryption, multi-level access controls, periodic vulnerability monitoring, and secure storage to protect your information. Compliance audits may be conducted periodically.</p>
              </div>
              <div>
                <strong className="text-texthigh">8. Third-Party Processing and Sharing</strong>
                <p>Personal data is not shared externally, except with trusted service providers strictly necessary for Tandem’s functionality (e.g., cloud hosts, analytics), all bound by confidentiality and security agreements. No user data is ever sold or monetized for advertising.</p>
              </div>
              <div>
                <strong className="text-texthigh">9. Abuse & Reporting</strong>
                <p>To report abuse, privacy breaches, or complaints, users can email: shreyas.phadke@tandem.it.com or ayush.agrawal@tandem.it.com. Additional in-app reporting features will be rolled out soon.</p>
              </div>
              <div>
                <strong className="text-texthigh">10. International Transfers and Compliance</strong>
                <p>Tandem currently serves Indian users and complies with Indian privacy regulations. As Tandem grows globally, policies will adapt to GDPR, CCPA, and regional data regimes, giving users expanded privacy rights and protections.</p>
              </div>
              <div>
                <strong className="text-texthigh">11. Changes & Updates</strong>
                <p>We reserve the right to update this Privacy Policy, with changes notified in-app and on our website.</p>
              </div>
              <div>
                <strong className="text-texthigh">12. Contact and Legal Entity</strong>
                <p>Legal Entity: Orbitandem Technologies Private Limited<br/>Director Contacts: shreyas.phadke@tandem.it.com, ayush.agrawal@tandem.it.com.</p>
              </div>
            </div>
            <div className="mt-8 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowPrivacy(false)}
                className="px-5 py-2.5 rounded-md font-semibold text-[14px] tracking-wide shadow-sm transition-colors"
                style={{
                  background: '#4DBBFF',
                  color: '#0B1A24',
                  border: '1px solid rgba(255,255,255,0.15)'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#6AC6FF' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#4DBBFF' }}
              >Close</button>
            </div>
          </div>
        </div>,
        document.body
      )}
      <div className="w-full p-0 sm:h-[98px]">
        {/* Mobile layout (<640px) */}
        <div className="block sm:hidden w-full px-4 py-4">
          <div className="flex flex-col space-y-3">
            <div className="flex items-center space-x-6">
              <button onClick={() => setShowTerms(true)} className="text-white text-[14px] leading-[21px] legal-link" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                Terms and Conditions
              </button>
              <button onClick={() => setShowPrivacy(true)} className="text-white text-[14px] leading-[21px] legal-link" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                Privacy policy
              </button>
            </div>
            <div className="flex items-center space-x-6">
              <p className="text-white text-[14px] leading-[21px] m-0">Social Links</p>
              <div className="flex items-center space-x-6">
                {/* YouTube */}
                <a href="https://www.youtube.com/@Get_Tandem" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-6 h-6 flex items-center justify-center" style={{width: '24px', height: '24px', aspectRatio: '1/1'}}>
                  <img src={youtubeLogo} alt="YouTube" width={24} height={24} loading="lazy" decoding="async" style={{display: 'block', width: '24px', height: '24px'}} />
                </a>
                {/* LinkedIn */}
                <a href="https://www.linkedin.com/company/orbitandem/?viewAsMember=true" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-6 h-6 flex items-center justify-center" style={{width: '24px', height: '24px', aspectRatio: '1/1'}}>
                  <img src={linkedinLogo} alt="LinkedIn" width={24} height={24} loading="lazy" decoding="async" style={{display: 'block', width: '24px', height: '24px'}} />
                </a>
                {/* WhatsApp */}
                <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="w-6 h-6 flex items-center justify-center" style={{width: '24px', height: '24px', aspectRatio: '1/1'}}>
                  <img src={whatsappLogo} alt="WhatsApp" width={24} height={24} loading="lazy" decoding="async" style={{display: 'block', width: '24px', height: '24px'}} />
                </a>
                {/* Facebook (original icon styling retained) */}
                <a href="https://www.facebook.com/share/1ECumqAJ5t" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-6 h-6 flex items-center justify-center" style={{width: '24px', height: '24px', aspectRatio: '1/1'}}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none" style={{display: 'block'}}>
                    <path d="M12 2.75C10.0716 2.75 8.18657 3.32183 6.58319 4.39317C4.97982 5.46451 3.73013 6.98726 2.99218 8.76884C2.25422 10.5504 2.06114 12.5108 2.43735 14.4021C2.81355 16.2934 3.74215 18.0307 5.10571 19.3943C6.46928 20.7579 8.20656 21.6865 10.0979 22.0627C11.9892 22.4389 13.9496 22.2458 15.7312 21.5078C17.5127 20.7699 19.0355 19.5202 20.1068 17.9168C21.1782 16.3134 21.75 14.4284 21.75 12.5C21.7473 9.91498 20.7192 7.43661 18.8913 5.60872C17.0634 3.78084 14.585 2.75273 12 2.75ZM12.75 20.7153V14.75H15C15.1989 14.75 15.3897 14.671 15.5303 14.5303C15.671 14.3897 15.75 14.1989 15.75 14C15.75 13.8011 15.671 13.6103 15.5303 13.4697C15.3897 13.329 15.1989 13.25 15 13.25H12.75V11C12.75 10.6022 12.908 10.2206 13.1893 9.93934C13.4706 9.65804 13.8522 9.5 14.25 9.5H15.75C15.9489 9.5 16.1397 9.42098 16.2803 9.28033C16.421 9.13968 16.5 8.94891 16.5 8.75C16.5 8.55109 16.421 8.36032 16.2803 8.21967C16.1397 8.07902 15.9489 8 15.75 8H14.25C13.4544 8 12.6913 8.31607 12.1287 8.87868C11.5661 9.44129 11.25 10.2044 11.25 11V13.25H9C8.80109 13.25 8.61033 13.329 8.46967 13.4697C8.32902 13.6103 8.25 13.8011 8.25 14C8.25 14.1989 8.32902 14.3897 8.46967 14.5303C8.61033 14.671 8.80109 14.75 9 14.75H11.25V20.7153C9.13575 20.5223 7.17728 19.5217 5.78198 17.9215C4.38667 16.3214 3.66195 14.2449 3.75855 12.1241C3.85515 10.0032 4.76564 8.00127 6.30064 6.5346C7.83563 5.06793 9.87696 4.24947 12 4.24947C14.1231 4.24947 16.1644 5.06793 17.6994 6.5346C19.2344 8.00127 20.1449 10.0032 20.2415 12.1241C20.3381 14.2449 19.6133 16.3214 18.218 17.9215C16.8227 19.5217 14.8643 20.5223 12.75 20.7153Z" fill="white"/>
                  </svg>
                </a>
                {/* X (Twitter) */}
                <a href="https://x.com/get_tandem2025?t=WOhsnDog5fU4lXgefUOJmA&s=08" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="w-6 h-6 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" style={{display: 'block'}}>
                    <path d="M20.133 20.3478L14.2643 11.1247L20.0552 4.75438C20.1862 4.60674 20.2537 4.41343 20.2431 4.21636C20.2325 4.01929 20.1446 3.83435 19.9986 3.70161C19.8525 3.56888 19.66 3.49907 19.4628 3.50731C19.2657 3.51555 19.0797 3.60117 18.9452 3.74562L13.4289 9.81312L9.633 3.84781C9.56531 3.74127 9.47183 3.65353 9.36121 3.59274C9.25059 3.53194 9.12642 3.50004 9.00019 3.5H4.50019C4.36571 3.49993 4.2337 3.53603 4.11796 3.60449C4.00222 3.67296 3.90702 3.77129 3.84232 3.88918C3.77763 4.00707 3.74582 4.14018 3.75023 4.27458C3.75463 4.40898 3.7951 4.53973 3.86738 4.65313L9.73613 13.8753L3.94519 20.2503C3.87756 20.323 3.82503 20.4083 3.79063 20.5014C3.75623 20.5945 3.74065 20.6935 3.74479 20.7927C3.74894 20.8918 3.77272 20.9892 3.81477 21.0791C3.85681 21.169 3.91628 21.2496 3.98973 21.3164C4.06318 21.3831 4.14915 21.4346 4.24265 21.4679C4.33615 21.5012 4.43533 21.5156 4.53443 21.5103C4.63354 21.5049 4.7306 21.48 4.81999 21.4369C4.90938 21.3937 4.98932 21.3333 5.05519 21.2591L10.5714 15.1916L14.3674 21.1569C14.4356 21.2625 14.5293 21.3494 14.6399 21.4093C14.7505 21.4693 14.8744 21.5005 15.0002 21.5H19.5002C19.6345 21.5 19.7664 21.4638 19.882 21.3954C19.9976 21.327 20.0927 21.2288 20.1573 21.111C20.222 20.9933 20.2539 20.8604 20.2496 20.7261C20.2453 20.5918 20.205 20.4612 20.133 20.3478ZM15.4118 20L5.86613 5H8.58488L18.1343 20H15.4118Z" fill="white"/>
                  </svg>
                </a>
                {/* Instagram */}
                <a href="https://www.instagram.com/get.tandem?utm_source=qr&igsh=cDFmMXB1MmRobjFz" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-6 h-6 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" style={{display: 'block'}}>
                    <path d="M12 8C11.11 8 10.24 8.26392 9.49993 8.75839C8.75991 9.25285 8.18314 9.95566 7.84254 10.7779C7.50195 11.6002 7.41283 12.505 7.58647 13.3779C7.7601 14.2508 8.18868 15.0526 8.81802 15.682C9.44736 16.3113 10.2492 16.7399 11.1221 16.9135C11.995 17.0872 12.8998 16.9981 13.7221 16.6575C14.5443 16.3169 15.2471 15.7401 15.7416 15.0001C16.2361 14.26 16.5 13.39 16.5 12.5C16.4988 11.3069 16.0243 10.163 15.1806 9.31939C14.337 8.47575 13.1931 8.00124 12 8ZM12 15.5C11.4067 15.5 10.8266 15.3241 10.3333 14.9944C9.83994 14.6648 9.45542 14.1962 9.22836 13.6481C9.0013 13.0999 8.94189 12.4967 9.05764 11.9147C9.1734 11.3328 9.45912 10.7982 9.87868 10.3787C10.2982 9.95912 10.8328 9.6734 11.4147 9.55764C11.9967 9.44189 12.5999 9.5013 13.1481 9.72836C13.6962 9.95542 14.1648 10.3399 14.4944 10.8333C14.8241 11.3266 15 11.9067 15 12.5C15 13.2956 14.6839 14.0587 14.1213 14.6213C13.5587 15.1839 12.7956 15.5 12 15.5ZM16.5 2.75H7.5C6.10807 2.75149 4.77358 3.30509 3.78933 4.28933C2.80509 5.27358 2.25149 6.60807 2.25 8V17C2.25149 18.3919 2.80509 19.7264 3.78933 20.7107C4.77358 21.6949 6.10807 22.2485 7.5 22.25H16.5C17.8919 22.2485 19.2264 21.6949 20.2107 20.7107C21.1949 19.7264 21.7485 18.3919 21.75 17V8C21.7485 6.60807 21.1949 5.27358 20.2107 4.28933C19.2264 3.30509 17.8919 2.75149 16.5 2.75ZM20.25 17C20.25 17.9946 19.8549 18.9484 19.1516 19.6516C18.4484 20.3549 17.4946 20.75 16.5 20.75H7.5C6.50544 20.75 5.55161 20.3549 4.84835 19.6516C4.14509 18.9484 3.75 17.9946 3.75 17V8C3.75 7.00544 4.14509 6.05161 4.84835 5.34835C5.55161 4.64509 6.50544 4.25 7.5 4.25H16.5C17.4946 4.25 18.4484 4.64509 19.1516 5.34835C19.8549 6.05161 20.25 7.00544 20.25 8V17ZM18 7.625C18 7.8475 17.934 8.06501 17.8104 8.25002C17.6868 8.43502 17.5111 8.57922 17.3055 8.66436C17.1 8.74951 16.8738 8.77179 16.6555 8.72838C16.4373 8.68498 16.2368 8.57783 16.0795 8.4205C15.9222 8.26316 15.815 8.06271 15.7716 7.84448C15.7282 7.62625 15.7505 7.40005 15.8356 7.19448C15.9208 6.98891 16.065 6.81321 16.25 6.6896C16.435 6.56598 16.6525 6.5 16.875 6.5C17.1734 6.5 17.4595 6.61853 17.6705 6.8295C17.8815 7.04048 18 7.32663 18 7.625Z" fill="white"/>
                  </svg>
                </a>
              </div>
            </div>
            <p className="text-white text-[14px] leading-[21px]" style={{ fontFamily: '"Anek Latin", sans-serif' }}>
              © 2025 Tandem. All rights reserved.
            </p>
          </div>
        </div>

        {/* Desktop & tablet layout (>=640px) — unchanged */}
  <div className="hidden sm:flex h-full flex-row justify-between items-center w-full px-4 md:px-4 md:pr-10 lg:px-8 md:gap-x-6 lg:gap-x-0">
          <div className="mb-0 flex-shrink-0">
            <p
              className="text-white text-[18px] leading-[27px] font-normal whitespace-nowrap"
              style={{ fontFamily: '"Anek Latin", sans-serif', paddingLeft: 0, marginLeft: 0 }}
            >
              © 2025 Tandem. All Rights Reserved.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 lg:space-x-8 flex-shrink-0" style={{paddingRight: 0, marginRight: 0}}>
            <div className="flex space-x-3 md:space-x-3 lg:space-x-6">
              <button onClick={() => setShowTerms(true)} className="text-white transition-colors legal-link" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 'inherit', padding: 0 }}>Terms and Conditions</button>
              <button onClick={() => setShowPrivacy(true)} className="text-white transition-colors legal-link" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 'inherit', padding: 0 }}>Privacy policy</button>
              <a href="#" className="text-white transition-colors" onClick={e => e.preventDefault()}>
                Social Links
              </a>
            </div>

            <div className="flex space-x-4 md:space-x-3 lg:space-x-4">
              {/* YouTube */}
              <a href="https://www.youtube.com/@Get_Tandem" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-6 h-6 flex items-center justify-center" style={{width: '24px', height: '24px', aspectRatio: '1/1'}}>
                <img src={youtubeLogo} alt="YouTube" width={24} height={24} loading="lazy" decoding="async" style={{display: 'block', width: '24px', height: '24px'}} />
              </a>
              {/* LinkedIn */}
              <a href="https://www.linkedin.com/company/orbitandem/?viewAsMember=true" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-6 h-6 flex items-center justify-center" style={{width: '24px', height: '24px', aspectRatio: '1/1'}}>
                <img src={linkedinLogo} alt="LinkedIn" width={24} height={24} loading="lazy" decoding="async" style={{display: 'block', width: '24px', height: '24px'}} />
              </a>
              {/* WhatsApp */}
              <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="w-6 h-6 flex items-center justify-center" style={{width: '24px', height: '24px', aspectRatio: '1/1'}}>
                <img src={whatsappLogo} alt="WhatsApp" width={24} height={24} loading="lazy" decoding="async" style={{display: 'block', width: '24px', height: '24px'}} />
              </a>
              {/* First Logo (provided SVG) */}
              <a href="https://www.facebook.com/share/1ECumqAJ5t" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-6 h-6 flex items-center justify-center" style={{width: '24px', height: '24px', aspectRatio: '1/1'}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none" style={{display: 'block'}}>
                  <path d="M12 2.75C10.0716 2.75 8.18657 3.32183 6.58319 4.39317C4.97982 5.46451 3.73013 6.98726 2.99218 8.76884C2.25422 10.5504 2.06114 12.5108 2.43735 14.4021C2.81355 16.2934 3.74215 18.0307 5.10571 19.3943C6.46928 20.7579 8.20656 21.6865 10.0979 22.0627C11.9892 22.4389 13.9496 22.2458 15.7312 21.5078C17.5127 20.7699 19.0355 19.5202 20.1068 17.9168C21.1782 16.3134 21.75 14.4284 21.75 12.5C21.7473 9.91498 20.7192 7.43661 18.8913 5.60872C17.0634 3.78084 14.585 2.75273 12 2.75ZM12.75 20.7153V14.75H15C15.1989 14.75 15.3897 14.671 15.5303 14.5303C15.671 14.3897 15.75 14.1989 15.75 14C15.75 13.8011 15.671 13.6103 15.5303 13.4697C15.3897 13.329 15.1989 13.25 15 13.25H12.75V11C12.75 10.6022 12.908 10.2206 13.1893 9.93934C13.4706 9.65804 13.8522 9.5 14.25 9.5H15.75C15.9489 9.5 16.1397 9.42098 16.2803 9.28033C16.421 9.13968 16.5 8.94891 16.5 8.75C16.5 8.55109 16.421 8.36032 16.2803 8.21967C16.1397 8.07902 15.9489 8 15.75 8H14.25C13.4544 8 12.6913 8.31607 12.1287 8.87868C11.5661 9.44129 11.25 10.2044 11.25 11V13.25H9C8.80109 13.25 8.61033 13.329 8.46967 13.4697C8.32902 13.6103 8.25 13.8011 8.25 14C8.25 14.1989 8.32902 14.3897 8.46967 14.5303C8.61033 14.671 8.80109 14.75 9 14.75H11.25V20.7153C9.13575 20.5223 7.17728 19.5217 5.78198 17.9215C4.38667 16.3214 3.66195 14.2449 3.75855 12.1241C3.85515 10.0032 4.76564 8.00127 6.30064 6.5346C7.83563 5.06793 9.87696 4.24947 12 4.24947C14.1231 4.24947 16.1644 5.06793 17.6994 6.5346C19.2344 8.00127 20.1449 10.0032 20.2415 12.1241C20.3381 14.2449 19.6133 16.3214 18.218 17.9215C16.8227 19.5217 14.8643 20.5223 12.75 20.7153Z" fill="white"/>
                </svg>
              </a>
              {/* X (Twitter) */}
              <a href="https://x.com/get_tandem2025?t=WOhsnDog5fU4lXgefUOJmA&s=08" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="w-6 h-6 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" style={{display: 'block'}}>
                  <path d="M20.133 20.3478L14.2643 11.1247L20.0552 4.75438C20.1862 4.60674 20.2537 4.41343 20.2431 4.21636C20.2325 4.01929 20.1446 3.83435 19.9986 3.70161C19.8525 3.56888 19.66 3.49907 19.4628 3.50731C19.2657 3.51555 19.0797 3.60117 18.9452 3.74562L13.4289 9.81312L9.633 3.84781C9.56531 3.74127 9.47183 3.65353 9.36121 3.59274C9.25059 3.53194 9.12642 3.50004 9.00019 3.5H4.50019C4.36571 3.49993 4.2337 3.53603 4.11796 3.60449C4.00222 3.67296 3.90702 3.77129 3.84232 3.88918C3.77763 4.00707 3.74582 4.14018 3.75023 4.27458C3.75463 4.40898 3.7951 4.53973 3.86738 4.65313L9.73613 13.8753L3.94519 20.2503C3.87756 20.323 3.82503 20.4083 3.79063 20.5014C3.75623 20.5945 3.74065 20.6935 3.74479 20.7927C3.74894 20.8918 3.77272 20.9892 3.81477 21.0791C3.85681 21.169 3.91628 21.2496 3.98973 21.3164C4.06318 21.3831 4.14915 21.4346 4.24265 21.4679C4.33615 21.5012 4.43533 21.5156 4.53443 21.5103C4.63354 21.5049 4.7306 21.48 4.81999 21.4369C4.90938 21.3937 4.98932 21.3333 5.05519 21.2591L10.5714 15.1916L14.3674 21.1569C14.4356 21.2625 14.5293 21.3494 14.6399 21.4093C14.7505 21.4693 14.8744 21.5005 15.0002 21.5H19.5002C19.6345 21.5 19.7664 21.4638 19.882 21.3954C19.9976 21.327 20.0927 21.2288 20.1573 21.111C20.222 20.9933 20.2539 20.8604 20.2496 20.7261C20.2453 20.5918 20.205 20.4612 20.133 20.3478ZM15.4118 20L5.86613 5H8.58488L18.1343 20H15.4118Z" fill="white"/>
                </svg>
              </a>
              {/* Instagram */}
              <a href="https://www.instagram.com/get.tandem?utm_source=qr&igsh=cDFmMXB1MmRobjFz" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-6 h-6 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" style={{display: 'block'}}>
                  <path d="M12 8C11.11 8 10.24 8.26392 9.49993 8.75839C8.75991 9.25285 8.18314 9.95566 7.84254 10.7779C7.50195 11.6002 7.41283 12.505 7.58647 13.3779C7.7601 14.2508 8.18868 15.0526 8.81802 15.682C9.44736 16.3113 10.2492 16.7399 11.1221 16.9135C11.995 17.0872 12.8998 16.9981 13.7221 16.6575C14.5443 16.3169 15.2471 15.7401 15.7416 15.0001C16.2361 14.26 16.5 13.39 16.5 12.5C16.4988 11.3069 16.0243 10.163 15.1806 9.31939C14.337 8.47575 13.1931 8.00124 12 8ZM12 15.5C11.4067 15.5 10.8266 15.3241 10.3333 14.9944C9.83994 14.6648 9.45542 14.1962 9.22836 13.6481C9.0013 13.0999 8.94189 12.4967 9.05764 11.9147C9.1734 11.3328 9.45912 10.7982 9.87868 10.3787C10.2982 9.95912 10.8328 9.6734 11.4147 9.55764C11.9967 9.44189 12.5999 9.5013 13.1481 9.72836C13.6962 9.95542 14.1648 10.3399 14.4944 10.8333C14.8241 11.3266 15 11.9067 15 12.5C15 13.2956 14.6839 14.0587 14.1213 14.6213C13.5587 15.1839 12.7956 15.5 12 15.5ZM16.5 2.75H7.5C6.10807 2.75149 4.77358 3.30509 3.78933 4.28933C2.80509 5.27358 2.25149 6.60807 2.25 8V17C2.25149 18.3919 2.80509 19.7264 3.78933 20.7107C4.77358 21.6949 6.10807 22.2485 7.5 22.25H16.5C17.8919 22.2485 19.2264 21.6949 20.2107 20.7107C21.1949 19.7264 21.7485 18.3919 21.75 17V8C21.7485 6.60807 21.1949 5.27358 20.2107 4.28933C19.2264 3.30509 17.8919 2.75149 16.5 2.75ZM20.25 17C20.25 17.9946 19.8549 18.9484 19.1516 19.6516C18.4484 20.3549 17.4946 20.75 16.5 20.75H7.5C6.50544 20.75 5.55161 20.3549 4.84835 19.6516C4.14509 18.9484 3.75 17.9946 3.75 17V8C3.75 7.00544 4.14509 6.05161 4.84835 5.34835C5.55161 4.64509 6.50544 4.25 7.5 4.25H16.5C17.4946 4.25 18.4484 4.64509 19.1516 5.34835C19.8549 6.05161 20.25 7.00544 20.25 8V17ZM18 7.625C18 7.8475 17.934 8.06501 17.8104 8.25002C17.6868 8.43502 17.5111 8.57922 17.3055 8.66436C17.1 8.74951 16.8738 8.77179 16.6555 8.72838C16.4373 8.68498 16.2368 8.57783 16.0795 8.4205C15.9222 8.26316 15.815 8.06271 15.7716 7.84448C15.7282 7.62625 15.7505 7.40005 15.8356 7.19448C15.9208 6.98891 16.065 6.81321 16.25 6.6896C16.435 6.56598 16.6525 6.5 16.875 6.5C17.1734 6.5 17.4595 6.61853 17.6705 6.8295C17.8815 7.04048 18 7.32663 18 7.625Z" fill="white"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
