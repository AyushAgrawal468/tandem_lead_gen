import { SUPPORTED_CITIES } from "./city";

// Copy from the handoff (Journey 3: homepage and FAQ). Each answer's first sentence answers the question.
// Items marked [confirm] in the handoff are kept as written there; update here once confirmed.

export const STEPS = [
  ["Swipe on plans.", "Gigs, comedy, treks, food walks and more in your city."],
  ["Your friends swipe too.", "Your skips stay private."],
  ["Match and go.", "When you and a friend both want the same plan, Tandem tells you both. Then you plan it in the app."],
];

const cities = `${SUPPORTED_CITIES.slice(0, -1).join(", ")} and ${SUPPORTED_CITIES.at(-1)}`;

export const QA = {
  what: ["What is Tandem?", "Tandem is an app where you swipe on things to do in your city and get matched with friends who want to do the same thing."],
  how: ["How does Tandem work?", STEPS.flat().join(" ")],
  groupChat: ["Why not just use the group chat?", "In a group chat, someone has to pitch a plan and chase replies, and most plans die there. On Tandem, everyone swipes on their own, and only the plans more than one of you want come up."],
  free: ["Is Tandem free?", "Yes. Tandem is free, with ads. Plus (₹149 a month) and Premium (₹199 a month) remove ads and add more features. Invite a friend and you both get a month of Premium free."],
  cities: ["Which cities is Tandem in?", `${cities}.`],
  privacy: ["Can my friends see what I swiped?", "Only when you both want the same plan. Your skips are never shown."],
  source: ["Where do the events come from?", "From ticketing and experience platforms across your city, collected in one place, so you don't need five apps to find a plan."],
  app: ["Do I need the app?", "You can swipe and save picks on the web. To see your matches, chat with friends and book, you need the app on iPhone or Android."],
  tickets: ["Can I buy tickets on Tandem?", "Yes, for events that sell tickets through Tandem, in the app."],
  phone: ["Is my phone number shared?", "No. Friends only see your first name and photo, and only when you both like the same plan."],
};

export const FAQ_ORDER = ["what", "how", "groupChat", "free", "cities", "privacy", "source", "app", "tickets", "phone"];

/** FAQPage JSON-LD for the given questions. */
export const faqJsonLd = (keys) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: keys.map((k) => ({ "@type": "Question", name: QA[k][0], acceptedAnswer: { "@type": "Answer", text: QA[k][1] } })),
});

// City pages (handoff 3.2). Title and intro are the handoff's; description is written for the meta tag.
// lat/lng match event-service CityGeoCache.
export const CITY_PAGES = {
  bengaluru: {
    city: "Bengaluru", lat: 12.9716, lng: 77.5946,
    title: "Things to do in Bengaluru with friends this weekend | Tandem",
    description: "Gigs, stand-up, brewery quizzes, sunrise rides and food walks in Bengaluru. Swipe on what you'd do and get matched with friends who want the same plan.",
    intro: "Bengaluru has more going on every weekend than any group chat can keep up with: gigs, stand-up, brewery quizzes, sunrise rides, food walks and workshops. Tandem puts it all in one deck. Swipe right on what you'd actually do, and when a friend wants the same plan, you'll both know.",
  },
  mumbai: {
    city: "Mumbai", lat: 19.076, lng: 72.8777,
    title: "Things to do in Mumbai with friends this weekend | Tandem",
    description: "Open mics, gigs, food trails, treks and late-night shows in Mumbai. Swipe on what you'd do and get matched with friends who want the same plan.",
    intro: "From open mics and gigs to food trails, treks and late-night shows, Mumbai never runs out of plans. Getting friends to agree on one is the hard part. Swipe on what's on, and Tandem matches you with friends who want the same thing.",
  },
};
