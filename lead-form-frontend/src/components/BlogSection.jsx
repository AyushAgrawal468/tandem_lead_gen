import React, { useState } from "react";

const blogPosts = [
  {
    id: 1,
    title: "How Tandem is Changing Collaboration",
    image: "/previews/10.png",
    excerpt: "Discover how Tandem helps teams work together more efficiently, no matter where they are.",
    content: "Tandem is revolutionizing the way teams collaborate by providing seamless communication tools, real-time updates, and a user-friendly interface. With Tandem, remote and hybrid teams can stay connected, share ideas instantly, and manage projects with ease. Our platform integrates with popular productivity apps, making workflow smoother and more efficient than ever before."
  },
  {
    id: 2,
    title: "Productivity Tips for Remote Teams",
    image: "/previews/10.5.png",
    excerpt: "Explore actionable tips to boost productivity and keep your team connected.",
    content: "Remote teams face unique challenges, but with the right strategies, productivity can soar. Tandem recommends setting clear goals, using collaborative tools, scheduling regular check-ins, and fostering a culture of transparency. Our platform offers features designed to keep everyone on track and engaged, no matter where they work."
  }
];

const BlogSection = () => {
  const [openPost, setOpenPost] = useState(null);

  return (
    <section className="w-full py-12 px-4 bg-[#181927] text-center">
      <h2 className="text-3xl font-bold text-white mb-6">Latest from the Tandem Blog</h2>
      <div className="flex flex-col gap-6 max-w-2xl mx-auto">
        {blogPosts.map(post => (
          <article key={post.id} className="bg-[#23243a] rounded-lg p-6 shadow flex flex-col md:flex-row items-center gap-6">
            <img src={post.image} alt={post.title} className="w-32 h-32 object-cover rounded-lg" />
            <div className="text-left flex-1">
              <h3 className="text-xl font-semibold text-white mb-2">{post.title}</h3>
              <p className="text-gray-300 mb-2">{openPost === post.id ? post.content : post.excerpt}</p>
              {openPost === post.id ? (
                <button
                  className="text-blue-400 underline text-sm mt-2"
                  onClick={() => setOpenPost(null)}
                >
                  Show less
                </button>
              ) : (
                <button
                  className="text-blue-400 underline text-sm mt-2"
                  onClick={() => setOpenPost(post.id)}
                >
                  Read more
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default BlogSection;
