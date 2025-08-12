import React from "react";
import Header from "./components/Header";
import Features from "./components/Features";
import LeadForm from "./components/LeadForm";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="font-sans">
      <Header />
      <Features />
      <LeadForm />
      <Footer />
    </div>
  );
}

export default App;