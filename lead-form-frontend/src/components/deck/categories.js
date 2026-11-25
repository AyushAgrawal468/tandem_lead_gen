// Backend categories (handoff "Feed item fields"): social, games, workshop, art, music, comedy. Unknown → social
export const CATEGORIES = {
  social: { color: "#8349FF", d: "M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 20a6 6 0 0 1 12 0M16 5.2a3 3 0 0 1 0 5.6M17 14a6 6 0 0 1 4 6" },
  games: { color: "#00FFC8", d: "M6 11h4M8 9v4M15 12h.01M18 10h.01M7 6h10a5 5 0 0 1 4.9 6l-.7 3.5a3 3 0 0 1-5.3 1.2L14 14h-4l-1.9 2.7a3 3 0 0 1-5.3-1.2L2.1 12A5 5 0 0 1 7 6z" },
  workshop: { color: "#C1F546", d: "M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z" },
  art: { color: "#FF7AB6", d: "M12 3a9 9 0 1 0 0 18c1 0 1.5-.8 1.5-1.6 0-1.3-1-1.6-1-2.9 0-.9.7-1.5 1.6-1.5H16a5 5 0 0 0 5-5c0-3.9-4-7-9-7zM7.5 11h.01M10 7.5h.01M15 7.5h.01" },
  music: { color: "#4FA3FF", d: "M9 18V5l12-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM21 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" },
  comedy: { color: "#FFB020", d: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" },
};
export const catOf = (c) => CATEGORIES[c] || CATEGORIES.social;
