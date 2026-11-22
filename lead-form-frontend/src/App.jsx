import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Outlet, useLocation, useNavigationType } from "react-router-dom";
import { Helmet } from "react-helmet";

function ScrollToTop() {
  const { pathname } = useLocation();
  const navType = useNavigationType();

  useEffect(() => {
    window.history.scrollRestoration = "manual";
  }, []);

  // Save scroll position on every scroll event
  useEffect(() => {
    const save = () => {
      sessionStorage.setItem(`scrollY:${pathname}`, String(window.scrollY));
    };
    window.addEventListener("scroll", save, { passive: true });
    return () => window.removeEventListener("scroll", save);
  }, [pathname]);

  useEffect(() => {
    if (navType === "PUSH") {
      window.scrollTo(0, 0);
    } else if (navType === "POP") {
      const y = parseInt(sessionStorage.getItem(`scrollY:${pathname}`) ?? "0", 10);
      if (y > 0) {
        // Keep scrolling to target every frame for ~500ms to fight any layout
        // shifts from lazy-loaded sections rendering after navigation.
        let frames = 0;
        const MAX_FRAMES = 30;
        const restore = () => {
          window.scrollTo(0, y);
          if (frames++ < MAX_FRAMES) requestAnimationFrame(restore);
        };
        requestAnimationFrame(restore);
      }
    }
  }, [pathname, navType]);

  return null;
}
import DownloadRedirect from "./components/DownloadRedirect";
import AccountDeletion from "./pages/AccountDeletion";
import ChildSafety from "./pages/ChildSafety";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import RefundPolicy from "./pages/RefundPolicy";
import AmbassadorPage from "./pages/AmbassadorPage";
import SwipePage from "./pages/SwipePage";
import HomePage from "./pages/HomePage";
import FaqPage from "./pages/FaqPage";
import NotFound from "./pages/NotFound";
import CityPage from "./pages/CityPage";
import LinkPage from "./pages/LinkPage";

// Handoff 3.3: personal links (someone's invite, referral or ambassador wallet) stay out of search results
function NoIndex() {
  return (
    <>
      <Helmet><meta name="robots" content="noindex" /></Helmet>
      <Outlet />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Homepage (Journey 3): promise + live deck, then crawlable answers */}
        <Route path="/" element={<HomePage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/bengaluru" element={<CityPage key="bengaluru" slug="bengaluru" />} />
        <Route path="/mumbai" element={<CityPage key="mumbai" slug="mumbai" />} />

        <Route element={<NoIndex />}>
          {/* Journey 2 (3.4): one shared link page for invites, event links and referral links.
              If the app is installed, Universal/App Links open it before any of these load. */}
          <Route path="/l/links" element={<LinkPage />} />
          <Route path="/e/:eventId" element={<LinkPage />} />
          <Route path="/r" element={<LinkPage />} />

          {/* Ambassador magic-link page — wallet, referrals, payout history, leaderboard */}
          <Route path="/a/:token" element={<AmbassadorPage />} />
        </Route>

        {/* Journey 1: cards first, phone step, 35 web swipes */}
        <Route path="/swipe" element={<SwipePage />} />

        {/* Download redirect — sends user to App Store or Play Store based on UA */}
        <Route path="/download" element={<DownloadRedirect />} />


        {/*Account-Deletion Page */}
        <Route path="/help/account-deletion" element={<AccountDeletion />} />

        {/* Child-Safety Page */}
        <Route path="/help/child-safety" element={<ChildSafety />} />
        <Route path="/help/refund-policy" element={<RefundPolicy />} />

        {/* Legal Pages */}
        <Route path="/legal/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/legal/terms-and-conditions" element={<TermsAndConditions />} />

        {/* Everything else: 404 with noindex (nginx serves unknown routes with a 200) */}
        <Route path="*" element={<NotFound />} />
        

      </Routes>
    </BrowserRouter>
  );
}
