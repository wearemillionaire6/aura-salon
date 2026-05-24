export const contact = {
  hero: {
    headline: "Visit us in the West Village.",
    subhead:
      "A few blocks from the 1 train, plate-glass front, ground floor.",
  },
  address: {
    line1: "342 Bleecker Street",
    line2: "Ground Floor",
    city: "New York",
    state: "NY",
    postal: "10014",
    country: "USA",
  },
  hours: [
    { day: "Tuesday", open: "10:00", close: "20:00" },
    { day: "Wednesday", open: "10:00", close: "20:00" },
    { day: "Thursday", open: "10:00", close: "20:00" },
    { day: "Friday", open: "10:00", close: "21:00" },
    { day: "Saturday", open: "09:00", close: "20:00" },
    { day: "Sunday", open: "10:00", close: "18:00" },
    { day: "Monday", open: null, close: null },
  ],
  phone: "+1 (212) 555-0148",
  email: "hello@aurasalon.example",
  parking:
    "Street parking is rare in the West Village. Closest garages: Christopher St ($), Greenwich Ave ($$). The 1 train at Christopher St–Sheridan Sq is a 4-minute walk.",
  social: { instagram: "@aurasalon", pinterest: "aurasalon" },
  formIntro:
    "Have a question that isn't about booking? Send us a note — we read everything and answer within a business day.",
} as const;
