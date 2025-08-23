import React, { useState } from "react";
import { Link } from "react-router-dom"; // ✅ Added Link

const LeadForm = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    phone: "",
    email: "",
    city: "",
    agree: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.agree) {
      alert("You must agree to the Terms of Service and Privacy Policy.");
      return;
    }
    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    setFormData({ firstname: "", lastname: "", phone: "", email: "", city: "", agree: true });
    alert("Thank you for joining the waitlist!");
  };

  return (
    <section id="form" className="min-h-screen flex flex-col justify-center items-center bg-[#181927] py-16 px-4">
      <div className="text-center mb-2 text-gray-300 text-sm">
        Join the waitlist to discover events near you <span className='inline-block'>🎯</span>
      </div>
      <h2 className="text-4xl md:text-5xl font-extrabold mb-2 text-white">
        Join the <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">waitlist</span>
      </h2>
      <p className="text-lg text-gray-300 mb-10">Be the first to get access when we launch in your city</p>
      <form
        onSubmit={handleSubmit}
        className="bg-[#23243a] rounded-2xl shadow-xl max-w-xl w-full p-8 space-y-6 text-left transition-all duration-200 border border-transparent hover:border-purple-400/60 hover:shadow-[0_0_0_3px_rgba(168,85,247,0.2)]"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-gray-300 font-semibold mb-1">First Name</label>
            <input
              name="firstname"
              type="text"
              placeholder="First name"
              value={formData.firstname}
              onChange={handleChange}
              required
              className="w-full bg-[#26273a] border border-gray-600 rounded px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-400"
            />
          </div>
          <div className="flex-1">
            <label className="block text-gray-300 font-semibold mb-1">Last Name</label>
            <input
              name="lastname"
              type="text"
              placeholder="Last name"
              value={formData.lastname}
              onChange={handleChange}
              required
              className="w-full bg-[#26273a] border border-gray-600 rounded px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-400"
            />
          </div>
        </div>
        <div>
          <label className="block text-gray-300 font-semibold mb-1">Phone</label>
          <input
            name="phone"
            type="tel"
            placeholder="Your phone number"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full bg-[#26273a] border border-gray-600 rounded px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-400"
          />
        </div>
        <div>
          <label className="block text-gray-300 font-semibold mb-1">Email</label>
          <input
            name="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full bg-[#26273a] border border-gray-600 rounded px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-400"
          />
        </div>
        <div>
          <label className="block text-gray-300 font-semibold mb-1">City</label>
          <input
            name="city"
            type="text"
            placeholder="Where do you live?"
            value={formData.city}
            onChange={handleChange}
            required
            className="w-full bg-[#26273a] border border-gray-600 rounded px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-400"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            name="agree"
            type="checkbox"
            checked={formData.agree}
            onChange={handleChange}
            className="accent-indigo-500 w-5 h-5"
            required
          />
          <span className="text-gray-200 text-sm">
            I agree to the{" "}
            <Link to="/terms" className="underline text-indigo-300">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="underline text-indigo-300">
              Privacy Policy
            </Link>
          </span>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-full font-bold text-lg bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 text-white shadow-lg hover:opacity-90 transition"
        >
          Join the Waitlist
        </button>
      </form>
    </section>
  );
};

export default LeadForm;
