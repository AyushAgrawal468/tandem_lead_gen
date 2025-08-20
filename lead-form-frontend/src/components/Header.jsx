import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigation = (sectionId) => {
    setIsOpen(false); // close menu on click
    if (location.pathname !== "/") {
      navigate("/", { replace: false });
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="w-full bg-[#14151e] py-3 shadow-lg border-b border-[#23243a] fixed top-0 left-0 z-50">
      <div className="max-w-7xl w-full mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo + Brand */}
        <div className="flex items-center gap-2">
          <img
            src="/logo.jpg"
            alt="Logo"
            className="h-9 w-9 sm:h-10 sm:w-10 rounded-full border-2 border-white"
          />
          <span className="text-white text-xl sm:text-2xl font-bold tracking-wide">
            Tandem
          </span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex space-x-6 lg:space-x-8">
          <button
            onClick={() => handleNavigation("features")}
            className="text-white hover:underline font-medium text-sm sm:text-base"
          >
            Features
          </button>
          <Link
            to="/blogs"
            className="text-white hover:underline font-medium text-sm sm:text-base"
          >
            Blogs
          </Link>
          <button
            onClick={() => handleNavigation("form")}
            className="text-white hover:underline font-medium text-sm sm:text-base"
          >
            Join Waitlist
          </button>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {/* Simple hamburger icon */}
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-[#14151e] border-t border-[#23243a] px-6 py-4 space-y-4">
          <button
            onClick={() => handleNavigation("features")}
            className="block w-full text-left text-white hover:underline font-medium text-base"
          >
            Features
          </button>
          <Link
            to="/blogs"
            className="block w-full text-left text-white hover:underline font-medium text-base"
            onClick={() => setIsOpen(false)}
          >
            Blogs
          </Link>
          <button
            onClick={() => handleNavigation("form")}
            className="block w-full text-left text-white hover:underline font-medium text-base"
          >
            Join Waitlist
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
