import React from "react";
import Header from "./components/Header";
// import PhoneMockup from "./components/PhoneMockup";
import PhonePreview from "./components/PhonePreview";
// import Hero from "./components/Hero";
import Features from "./components/Features";
import BlogSection from "./components/BlogSection";
import LeadForm from "./components/LeadForm";
import Footer from "./components/Footer";
import ExperienceSection from "./components/ExperienceSection";
// import HeroGradient from "./components/HeroGradient";
import LaunchingSoon from "./components/LaunchingSoon";

function App() {
  return (
    <div className="font-sans min-h-screen bg-[#181927]">
      <Header />
      {/* <PhoneMockup /> */}
      <PhonePreview />
      {/* <Hero /> */}
      {/* <HeroGradient /> */}
      <ExperienceSection />
      <Features />
      <BlogSection />
      <LeadForm />
      <LaunchingSoon />
      <Footer />
    </div>
  );
}

export default App;