import React from "react";
import { motion } from "framer-motion";
import PhoneSlideshow from "./PhoneSlideshow";
import "./FeatureSection.css";

const FeatureSection = ({ title, description, images, reverse }) => {
  return (
    <section className={`feature-section ${reverse ? "reverse" : ""}`}>
      {/* Text Section */}
      <motion.div
        className="feature-text"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h2>{title}</h2>
        <p>{description}</p>
      </motion.div>

      {/* Phone Section */}
      <motion.div
        className="feature-phone"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      >
        {/* Each phone slideshow receives its own images array */}
        <PhoneSlideshow images={images} />
      </motion.div>
    </section>
  );
};

export default FeatureSection;
