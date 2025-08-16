import React from "react";
import { FaMapMarkerAlt, FaUserFriends, FaUsers, FaHeart, FaCommentDots, FaRegFileAlt } from "react-icons/fa";

const ExperienceSection = () => (
  <section className="bg-[#181927] py-20 px-4 text-center">
    <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-white">
      Find your next <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">experience</span>
    </h2>
    <p className="text-lg text-gray-300 mb-12 max-w-2xl mx-auto">
      Tandem connects you to spontaneous plans in your city based on your vibe
    </p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {/* Make the cards wider and the grid more compact */}
      <div className="bg-[#23243a] rounded-2xl p-8 shadow-2xl shadow-[#00000040] flex flex-col items-center min-w-[340px] max-w-[380px] mx-auto transition-all duration-200 border border-transparent hover:border-purple-400/60 hover:shadow-[0_0_0_3px_rgba(168,85,247,0.2)]">
        <span className="flex items-center justify-center w-14 h-14 rounded-full mb-4" style={{ background: 'rgba(120, 115, 245, 0.10)' }}>
          <FaMapMarkerAlt className="text-3xl text-purple-400" />
        </span>
        <h3 className="text-xl font-bold text-white mb-2">Hyperlocal Discovery</h3>
        <p className="text-gray-300">Instantly find unique events near you based on your exact location.</p>
      </div>
      <div className="bg-[#23243a] rounded-2xl p-8 shadow-2xl shadow-[#00000040] flex flex-col items-center min-w-[340px] max-w-[380px] mx-auto transition-all duration-200 border border-transparent hover:border-fuchsia-400/60 hover:shadow-[0_0_0_3px_rgba(232,121,249,0.2)]">
        <span className="flex items-center justify-center w-14 h-14 rounded-full mb-4" style={{ background: 'rgba(192, 90, 255, 0.10)' }}>
          <FaUserFriends className="text-3xl text-fuchsia-400" />
        </span>
        <h3 className="text-xl font-bold text-white mb-2">Synced Contacts</h3>
        <p className="text-gray-300">Easily connect with friends — your contacts are always in sync for smooth invites.</p>
      </div>
      <div className="bg-[#23243a] rounded-2xl p-8 shadow-2xl shadow-[#00000040] flex flex-col items-center min-w-[340px] max-w-[380px] mx-auto transition-all duration-200 border border-transparent hover:border-orange-400/60 hover:shadow-[0_0_0_3px_rgba(251,191,36,0.2)]">
        <span className="flex items-center justify-center w-14 h-14 rounded-full mb-4" style={{ background: 'rgba(255, 153, 51, 0.10)' }}>
          <FaUsers className="text-3xl text-orange-400" />
        </span>
        <h3 className="text-xl font-bold text-white mb-2">Group or Solo Discovery</h3>
        <p className="text-gray-300">Choose to explore with your crew or adventure solo, plans adapt to you.</p>
      </div>
      <div className="bg-[#23243a] rounded-2xl p-8 shadow-2xl shadow-[#00000040] flex flex-col items-center min-w-[340px] max-w-[380px] mx-auto transition-all duration-200 border border-transparent hover:border-cyan-400/60 hover:shadow-[0_0_0_3px_rgba(34,211,238,0.2)]">
        <span className="flex items-center justify-center w-14 h-14 rounded-full mb-4" style={{ background: 'rgba(0, 255, 255, 0.10)' }}>
          <FaHeart className="text-3xl text-cyan-400" />
        </span>
        <h3 className="text-xl font-bold text-white mb-2">Mood Based Swiping</h3>
        <p className="text-gray-300">Swipe for plans that fit your current vibe — chill, hype, or spontaneous.</p>
      </div>
      <div className="bg-[#23243a] rounded-2xl p-8 shadow-2xl shadow-[#00000040] flex flex-col items-center min-w-[340px] max-w-[380px] mx-auto transition-all duration-200 border border-transparent hover:border-blue-400/60 hover:shadow-[0_0_0_3px_rgba(96,165,250,0.2)]">
        <span className="flex items-center justify-center w-14 h-14 rounded-full mb-4" style={{ background: 'rgba(0, 153, 255, 0.10)' }}>
          <FaCommentDots className="text-3xl text-blue-400" />
        </span>
        <h3 className="text-xl font-bold text-white mb-2">AI Recommended Events</h3>
        <p className="text-gray-300">Get smart suggestions tailored to your tastes & activity with AI.</p>
      </div>
      <div className="bg-[#23243a] rounded-2xl p-8 shadow-2xl shadow-[#00000040] flex flex-col items-center min-w-[340px] max-w-[380px] mx-auto transition-all duration-200 border border-transparent hover:border-violet-400/60 hover:shadow-[0_0_0_3px_rgba(167,139,250,0.2)]">
        <span className="flex items-center justify-center w-14 h-14 rounded-full mb-4" style={{ background: 'rgba(153, 102, 255, 0.10)' }}>
          <FaRegFileAlt className="text-3xl text-violet-300" />
        </span>
        <h3 className="text-xl font-bold text-white mb-2">Wall of Moments</h3>
        <p className="text-gray-300">Showcase and revisit your top event stories — build your own wall of memories.</p>
      </div>
    </div>
  </section>
);

export default ExperienceSection;
