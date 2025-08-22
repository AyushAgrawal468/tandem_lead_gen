import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function TermsPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ Always scroll to top when opening the page
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleClose = () => {
    navigate("/", { replace: false });
    setTimeout(() => {
      const el = document.getElementById("form");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 pt-24 pb-12 flex flex-col min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-white">Terms & Conditions</h1>
      <p className="text-gray-300 leading-relaxed mb-4">
        This is our sample T&C. You can replace this with your real policy
        content. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis
        euismod, nisi vel consectetur euismod, nisl nunc consectetur nisi,
        euismod consectetur nisl nunc euismod.
      </p>
      <p className="text-gray-300 leading-relaxed mb-4">
        We respect your privacy and are committed to protecting your personal
        information. This page describes how your data is collected, used, and
        safeguarded.
      </p>
      <p className="text-gray-300 leading-relaxed flex-1">
        By using our services, you agree to the terms outlined in this privacy
        policy. For further details, please contact our support team.
      </p>

      {/* ✅ Close button at bottom center (filled) */}
      <div className="flex justify-center mt-8">
        <button
          onClick={handleClose}
          className="bg-white text-black px-6 py-2 rounded-lg font-medium hover:bg-gray-200 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}
