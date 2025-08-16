
import React from "react";

const Header = () => (
  <header className="w-full bg-[#14151e] py-6 shadow-lg border-b border-[#23243a]">
    <div className="max-w-7xl mx-auto flex items-center justify-between px-6">
      <div className="flex items-center gap-2">
        <img src="/logo.jpg" alt="Logo" className="h-10 w-10 rounded-full border-2 border-white" />
        <span className="text-white text-2xl font-bold tracking-wide">Tandem</span>
      </div>
      <nav className="space-x-8">
        <a href="#features" className="text-white hover:underline font-medium">Features</a>
        <a href="#form" className="text-white hover:underline font-medium">Join Waitlist</a>
      </nav>
    </div>
  </header>
);

export default Header;