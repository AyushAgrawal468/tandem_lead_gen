
import React from "react";

const Footer = () => (
  <footer className="bg-[#14151e] text-white py-8 mt-16 border-t border-[#23243a]">
    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
      <div className="flex items-center gap-2 mb-4 md:mb-0">
        <img src="/logo.jpg" alt="Logo" className="h-8 w-8 rounded-full border-2 border-white" />
        <span className="font-bold text-lg">Tandem</span>
      </div>
      <div className="text-sm opacity-80">© 2025 Tandem. All rights reserved.</div>
      <div className="space-x-4">
        <a href="#features" className="hover:underline">Features</a>
        <a href="#form" className="hover:underline">Join Waitlist</a>
      </div>
    </div>
  </footer>
);

export default Footer;