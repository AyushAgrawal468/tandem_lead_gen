import React from "react";

const Features = () => (
  <section id="features" className="py-16 px-6 bg-gray-50 text-center">
    <h2 className="text-3xl font-semibold text-indigo-600 mb-6">Features</h2>
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <h3 className="text-xl font-bold">Swipe to Connect</h3>
        <p>Seamlessly match with like-minded people through intuitive swiping.</p>
      </div>
      <div>
        <h3 className="text-xl font-bold">In-App Messaging</h3>
        <p>Chat instantly with your connections without leaving the app.</p>
      </div>
      <div>
        <h3 className="text-xl font-bold">Community Events</h3>
        <p>Stay in the loop with events tailored to your vibe and preferences.</p>
      </div>
    </div>
  </section>
);

export default Features;