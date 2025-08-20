import React, { useState } from "react";

const cities = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Surat", "Lucknow", "Kanpur", "Nagpur", "Indore", "Bhopal"
];

const experiences = [
  {
    id: 1,
    title: "Rooftop Sunset Yoga",
    location: "Bandra",
    date: "Today, 6:00 PM",
    tag: { label: "Chill", emoji: "🧘" },
    category: "Chill",
    image: "", // Add image url later
  },
  {
    id: 2,
    title: "Underground DJ Night",
    location: "Andheri",
    date: "Tomorrow, 10:30 PM",
    tag: { label: "Party", emoji: "🎉" },
    category: "Party",
    image: "",
  },
  {
    id: 3,
    title: "Popup Art Exhibition",
    location: "Colaba",
    date: "Saturday, 2:00 PM",
    tag: { label: "Creative", emoji: "🎨" },
    category: "Creative",
    image: "",
  },
  {
    id: 4,
    title: "Secret Food Truck Meet",
    location: "Powai",
    date: "Tonight, 7:30 PM",
    tag: { label: "Food", emoji: "🍔" },
    category: "Food",
    image: "",
  },
];

const Features = () => {
  const [selectedCity, setSelectedCity] = useState(cities[0]);

  return (
    <section id="features" className="py-20 px-4 bg-[#181927] text-center">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between max-w-6xl mx-auto mb-8">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 md:mb-0">
          Preview <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent font-bold">experiences</span>
        </h2>
        <select
          className="bg-[#23243a] text-white px-6 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-indigo-400 text-lg"
          value={selectedCity}
          onChange={e => setSelectedCity(e.target.value)}
        >
          {cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>
      <div className="flex gap-6 overflow-x-auto pb-4 max-w-6xl mx-auto scrollbar-hide">
        {experiences.map(exp => (
          <div
            key={exp.id}
            className="min-w-[320px] max-w-[340px] rounded-2xl shadow-xl flex flex-col justify-between relative bg-[#23243a]"
            style={{ height: 300 }}
          >
            {/* Top gradient section */}
            <div className="rounded-t-2xl p-5 pb-0 relative" style={{ background: 'linear-gradient(135deg, #4b256e 0%, #2d193c 100%)', height: 170 }}>
              <div className="absolute top-5 right-5 bg-[#23243a] text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 font-semibold shadow">
                {exp.tag.label} <span>{exp.tag.emoji}</span>
              </div>
              {/* Image placeholder */}
              {exp.image ? (
                <img src={exp.image} alt={exp.title} className="w-full h-24 object-cover rounded-xl" />
              ) : (
                <div className="w-full h-24 rounded-xl flex items-center justify-center text-3xl text-gray-400">🖼️</div>
              )}
            </div>
            {/* Bottom solid section */}
            <div className="rounded-b-2xl bg-[#23243a] p-5 flex flex-col items-start justify-between h-[130px]">
              <h3 className="text-lg font-semibold text-white mb-1 leading-tight">{exp.title}</h3>
              <div className="text-gray-300 text-sm mb-1">{exp.location}</div>
              <div className="flex items-center justify-between w-full">
                <div className="text-gray-400 text-xs">{exp.date}</div>
                <span className="text-white text-xl ml-2">→</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
    </section>
  );
};

export default Features;