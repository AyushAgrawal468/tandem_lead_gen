import React, { useState } from "react";

const blogs = [
  {
    id: 1,
    title: "The Loneliness Pandemic—How the World Became Isolated",
    content: `Introduction
In 2024, the World Health Organization (WHO) recognized loneliness as a global public health concern, highlighting its significant impact on individuals across all age groups.

1. The Data Speaks
Surge in Single-Person Households: Approximately 30% of U.S. households consist of individuals living alone, with similar trends observed in Europe and India's major cities.

Mental Health Toll: Chronic loneliness is linked to a 29% increased risk of coronary heart disease and a 32% increased risk of stroke. Additionally, it correlates with a 25% higher risk of dementia.

2. Root Causes
Digital Overload: The prevalence of endless scrolling on social media platforms has replaced meaningful in-person interactions.

Urban Disconnection: Despite bustling city environments, real-world social connections have diminished.

Fragmented Planning: Coordinating meetups across multiple platforms like WhatsApp, Instagram, and various calendars often leads to confusion and cancellations.

3. Why It Matters
Loneliness transcends mere sadness; it's a pressing public health crisis. Isolation contributes to depression, weakens the immune system, and escalates healthcare costs globally.

4. The Tandem Solution
Tandem addresses these challenges by offering synchronized swiping, AI-driven recommendations, and gamified group planning, transforming digital interactions into joyful real-world connections.

Conclusion & Call to Action
Combating loneliness requires more than sporadic events; it necessitates a platform that simplifies and enriches planning with friends. Join the Tandem waitlist today and be part of reconnecting our world.`,
    link: "#",
  },
  {
    id: 2,
    title: "Why Endless Group Chats Are Making Us Lonelier",
    content: `Introduction
Group chats, while intended to foster connection, have become overwhelming threads filled with unanswered questions, conflicting schedules, and decision paralysis.
1. The Group-Chat Quagmire
23-Message Average: Studies indicate it takes an average of 23 messages to finalize dinner plans, leading to frustration and disengagement.


Decision Fatigue: Navigating through hundreds of unread messages often results in plan cancellations or avoidance.


2. The Paradox of Choice
An abundance of options and numerous participants can make decision-making exhausting, often leading to postponed plans that never materialize.
3. From Chaos to Clarity
Tandem streamlines the planning process with real-time synchronized swiping, allowing friends to vote within minutes, resulting in quick and collective decisions.
4. Real Stories, Real Results
"We used to quit at 'Where do you want to go?' Now, in 3 swipes, it's decided!" — Anisha, 28, Bengaluru.
Conclusion & Call to Action
Transform group-chat chaos into instant consensus. Sign up for the Tandem waitlist and reclaim your social life.
`,
    link: "#",
  },
  {
    id: 3,
    title: "The Science of Shared Experiences—and Why They Matter",
    content: `Introduction
Psychological research confirms that shared experiences create stronger bonds than solitary achievements. Planning outings together enhances relationships and well-being.
1. Neurochemistry of Connection
Oxytocin Release: Shared laughter and novel experiences boost oxytocin levels, strengthening social bonds .


Memory Encoding: Co-planning and anticipation enhance the memorability of events.


2. The Role of Intention
Spontaneous meetups are more fulfilling when planned collaboratively, fostering a sense of belonging even before the event occurs.
3. Gamification Amplifies Engagement
Tandem's features like "streaks," "super-likes," and "memory wall" activate dopamine pathways, making planning a rewarding and engaging activity.
4. Behavioral Nudges That Work
Timed Swipes (3 minutes): Creates a sense of urgency, reducing procrastination.


Group Feedback: Real-time likes guide users toward shared preferences.


Conclusion & Call to Action
For deeper, more fulfilling connections, start with collaborative planning. Join Tandem's waitlist and make every outing a memorable experience.
`,
    link: "#",
  },
  {
    id: 4,
    title: "Swipe Right on Real Life—How Tandem Bridges the Digital Gap",
    content: `Introduction
Swipe-based interfaces revolutionized dating apps; Tandem applies this intuitive design to simplify planning real-life meetups with friends.
1. From Dating Apps to Social Planning
Tandem repurposes the familiar swipe gestures for activity planning:
Up: Super-like ("Must do this!")


Right: Like


Left: Dislike


Down: Super-dislike


2. Personalization Meets Spontaneity
AI-Driven Recommendations: Learns from user preferences to suggest enjoyable events.


Randomness for Discovery: Introduces serendipity, keeping social experiences fresh.


3. Group-First vs. Activity-First
Group-First: Assemble friends first, then choose an activity together.


Activity-First: Select an activity, then invite friends to join.


4. Built-In Coordination
Map & Calendar Sync: One-tap RSVPs, map links, and calendar reminders.


Group Chat Integration: Centralizes discussions, eliminating the need to switch between apps.


Conclusion & Call to Action
Don't limit swiping to dating—use it to enhance real-world fun with friends. Sign up now for early access to Tandem.
`,
    link: "#",
  },
  {
    id: 5,
    title:
      "From Maybe Later to See You Tonight—Winning the Battle Against FOMO ",
    content: `Introduction
The Fear of Missing Out (FOMO) is prevalent, yet traditional planning tools haven't evolved to address it. Tandem transforms FOMO into JOMO (Joy of Missing Out) on the right things.
1. The FOMO Loop
Scroll: Viewing friends' stories.


Regret: Feeling left out.


Procrastination: Delayed responses in group chats leading to missed opportunities.


2. The JOMO Antidote
Instant Plans: Three-minute synchronization ensures quick decisions.


Visual Countdown: Tracks group progress, encouraging participation.


3. Memory Wall: Relive Your Best Moments
Automatic Collages: Compiles photos and videos from events.


Shareable Highlights: Provides social proof, encouraging more sign-ups.


4. The Habit Loop
Cue: Morning notification—"Your friends are planning brunch—swipe now!"np
`,
    link: "#",
  },
];

const BlogPage = () => {
  // Track which blogs are expanded
  const [expanded, setExpanded] = useState({});

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-[#14151e] text-white px-6 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">Our Blogs</h1>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
        {blogs.map((blog) => {
          // Show first 3 lines as preview
          const preview = blog.content.split("\n").slice(0, 3).join("\n");

          return (
            <div
              key={blog.id}
              className="bg-[#1b1c29] p-6 rounded-2xl shadow-lg border border-[#23243a] hover:scale-105 transition-transform"
            >
              <h2 className="text-2xl font-semibold mb-3">{blog.title}</h2>

              {/* Show preview if not expanded, full content if expanded */}
              <div className="text-gray-400 mb-4 whitespace-pre-line">
                {expanded[blog.id] ? blog.content : preview + "..."}
              </div>

              <button
                onClick={() => toggleExpand(blog.id)}
                className="font-medium bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent transition duration-300 hover:from-purple-400 hover:to-indigo-400"
              >
                {expanded[blog.id] ? "Show Less ↑" : "Read More →"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BlogPage;
