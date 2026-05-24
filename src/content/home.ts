export const home = {
  hero: {
    eyebrow: "Aura Salon & Spa · West Village",
    headline: "A destination salon for the way you actually live.",
    subhead:
      "Hair, nails, skin, and bodywork in a quiet, considered space — by stylists who take the time to listen.",
    primaryCta: { label: "Book an appointment", href: "/book" },
    secondaryCta: { label: "Meet the team", href: "/team" },
  },
  valueProps: [
    {
      icon: "Sparkles",
      title: "Consultative, not transactional",
      blurb:
        "Every visit starts with a few honest questions about your hair, your routine, and your time. No upsells.",
    },
    {
      icon: "Leaf",
      title: "Quietly thoughtful products",
      blurb:
        "We choose what we use carefully — independent brands, ingredient-led formulas, lower-tox where it matters.",
    },
    {
      icon: "Clock",
      title: "Generous time, generous space",
      blurb:
        "Appointments are booked with breathing room. You'll never feel rushed in or out of the chair.",
    },
  ],
  testimonialsHeader: {
    eyebrow: "What guests say",
    title: "A salon you'd recommend to a friend who's careful about hers.",
  },
  finalCta: {
    headline: "We saved you a chair.",
    subhead:
      "Book online any time. Walk-ins welcome when we have the space.",
    label: "Find your appointment",
    href: "/book",
  },
} as const;
