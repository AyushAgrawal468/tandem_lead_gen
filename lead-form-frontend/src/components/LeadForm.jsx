import React, { useState } from "react";

const LeadForm = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:8084/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    setFormData({ name: "", email: "", message: "" });
    alert("Thank you for joining the waitlist!");
  };

  return (
    <section id="form" className="py-16 px-6 bg-white text-center">
      <h2 className="text-3xl font-semibold text-indigo-600 mb-6">Join the Waitlist</h2>
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4">
        <input
          name="name"
          type="text"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full border rounded px-4 py-2"
        />
        <input
          name="email"
          type="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full border rounded px-4 py-2"
        />
        <textarea
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          className="w-full border rounded px-4 py-2"
        />
        <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded">
          Submit
        </button>
      </form>
    </section>
  );
};

export default LeadForm;