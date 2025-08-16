



import React, { useRef } from "react";

const phoneImages = [
  "/previews/10.png",
  "/previews/10.5.png"
];

const PhonePreview = () => {
  const scrollRef = useRef(null);

  return (
    <section className="w-full flex flex-col items-center justify-center py-12 px-4 bg-[#181927]">
      <div
        className="relative w-[260px] h-[520px] rounded-3xl bg-[#23243a] shadow-2xl border-4 border-[#23243a] flex items-center justify-center overflow-hidden"
        style={{ position: 'relative' }}
      >
        <div
          ref={scrollRef}
          className="w-full h-full overflow-x-auto whitespace-nowrap scrollbar-hide snap-x snap-mandatory"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {phoneImages.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={`App preview ${idx + 1}`}
              className="inline-block w-[260px] h-[520px] object-cover rounded-2xl align-top select-none snap-center"
              draggable={false}
              style={{ marginRight: idx !== phoneImages.length - 1 ? 8 : 0 }}
            />
          ))}
        </div>
        <div className="absolute inset-0 rounded-3xl border-4 border-[#23243a] pointer-events-none" />
      </div>
    </section>
  );
};

export default PhonePreview;
