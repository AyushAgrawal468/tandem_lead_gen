import React from "react";

const Header = () => (
  <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
    <h1 className="text-xl font-bold text-indigo-600">Tandem Vibe</h1>
    <nav className="space-x-4">
      <a href="#features" className="text-gray-700 hover:text-indigo-600">Features</a>
      <a href="#form" className="text-gray-700 hover:text-indigo-600">Join</a>
    </nav>
  </header>
);

export default Header;