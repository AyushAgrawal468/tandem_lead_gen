import React from "react";

const LaunchingSoon = () => (
  <section className="flex justify-center items-center py-16 px-4">
    <div className="bg-[#23243a] rounded-2xl border border-purple-500/30 shadow-2xl max-w-xl w-full mx-auto p-10 text-center relative transition-all duration-200 hover:border-purple-400/60 hover:shadow-[0_0_0_3px_rgba(168,85,247,0.2)]">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
        Be the <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent font-bold">first</span> to experience Tandem
      </h2>
      <p className="text-lg text-gray-300 mb-8">Our app is launching soon. Join the waitlist to be notified when we're live.</p>
      <div className="flex flex-col md:flex-row gap-4 justify-center mb-6">
        <button className="flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-500/40 bg-[#23243a] text-white text-base font-semibold opacity-70 cursor-not-allowed">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" rx="6" fill="#fff" fillOpacity="0.08"/><path d="M8.5 7.5v9l7-4.5-7-4.5z" fill="#fff"/></svg>
          Download on the <span className="font-bold">App Store</span>
        </button>
        <button className="flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-500/40 bg-[#23243a] text-white text-base font-semibold opacity-70 cursor-not-allowed">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" rx="6" fill="#fff" fillOpacity="0.08"/><path d="M6 18l12-6-12-6v12z" fill="#fff"/></svg>
          Get it on <span className="font-bold">Google Play</span>
        </button>
      </div>
      <div className="text-gray-400 text-sm">Launching soon. You'll be first.</div>
    </div>
  </section>
);

export default LaunchingSoon;

