import React from "react";

const PhoneMockup = () => (
  <section className="w-full flex justify-center items-center py-12 px-4 bg-[#181927]">
    <div className="flex flex-col items-center">
      {/* Phone mockup */}
      <div className="relative w-[260px] h-[520px] rounded-3xl bg-gradient-to-br from-[#23243a] to-[#23243a]/80 shadow-2xl border-4 border-[#23243a] flex flex-col items-center justify-start overflow-hidden">
        {/* Logo */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg z-10">
          <img src="/logo.jpg" alt="Tandem Logo" className="w-12 h-12 object-contain" />
        </div>
        {/* Event card */}
        <div className="absolute top-28 left-1/2 -translate-x-1/2 w-56 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 rounded-2xl shadow-xl p-6 flex flex-col items-center z-10">
          <div className="w-12 h-12 bg-white/80 rounded-full flex items-center justify-center mb-3">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 14.2a7.2 7.2 0 01-6-3.2c.03-2 4-3.1 6-3.1s5.97 1.1 6 3.1a7.2 7.2 0 01-6 3.2z" fill="#a259c6"/></svg>
          </div>
          <div className="text-white font-bold text-lg mb-1">Tandem Event</div>
          <div className="text-white/80 text-sm">Swipe, match, and vibe with new friends!</div>
        </div>
        {/* Phone screen background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#23243a]/80 to-[#181927] z-0" />
      </div>
      {/* Caption */}
      <div className="mt-6 text-white/80 text-base text-center max-w-xs">
        Discover events, connect instantly, and vibe together — all in one app.
      </div>
    </div>
  </section>
);

export default PhoneMockup;
