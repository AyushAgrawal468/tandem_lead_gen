import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (sectionId) => {
    if (location.pathname !== "/") {
      // Go to home first, then scroll
      navigate("/", { replace: false });
      // Delay scrolling until after navigation
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      // Already on home → just scroll
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="w-full bg-[#14151e] py-6 shadow-lg border-b border-[#23243a]">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <img
            src="/logo.jpg"
            alt="Logo"
            className="h-10 w-10 rounded-full border-2 border-white"
          />
          <span className="text-white text-2xl font-bold tracking-wide">
            Tandem
          </span>
        </div>
        <nav className="space-x-8">
          <button
            onClick={() => handleNavigation("features")}
            className="text-white hover:underline font-medium"
          >
            Features
          </button>
          <Link to="/blogs" className="text-white hover:underline font-medium">
            Blogs
          </Link>
          <button
            onClick={() => handleNavigation("form")}
            className="text-white hover:underline font-medium"
          >
            Join Waitlist
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
