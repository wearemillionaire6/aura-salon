// Mock account fixture for the Phase-1 demo /account portal.
// Foreign keys are validated against src/data/services.json and stylists.json.

export const accountUser = {
  id: "demo-user",
  name: "Jordan Cole",
  email: "jordan.cole@example.com",
  phone: "(212) 555-0177",
  joined: "2024-03-12",
  loyaltyPoints: 245,
  loyaltyTier: "Sage", // Bronze -> Sage -> Linen -> Bone
  giftCardBalance: 50,
  preferences: {
    sms: true,
    email: true,
    marketing: false,
  },
  notes: "Sensitive scalp — avoid sulfates. Allergic to tea-tree oil.",
};

export const loyaltyTiers = [
  { name: "Bronze", min: 0 },
  { name: "Sage", min: 100 },
  { name: "Linen", min: 500 },
  { name: "Bone", min: 1000 },
] as const;

export type AppointmentStatus = "confirmed" | "deposit-pending" | "completed" | "cancelled";

export type MockAppointment = {
  id: string;
  ref: string;
  serviceIds: string[];
  stylistId: string;
  date: string; // yyyy-MM-dd
  time: string; // HH:mm
  durationMin: number;
  priceUSD: number;
  status: AppointmentStatus;
};

export const upcomingAppointments: MockAppointment[] = [
  {
    id: "appt-up-1",
    ref: "AURA-K9F4M2",
    serviceIds: ["svc-cut-style"],
    stylistId: "sty-elena",
    date: "2026-06-04",
    time: "14:30",
    durationMin: 75,
    priceUSD: 120,
    status: "confirmed",
  },
  {
    id: "appt-up-2",
    ref: "AURA-X3P7L8",
    serviceIds: ["svc-aura-facial"],
    stylistId: "sty-naomi",
    date: "2026-06-18",
    time: "10:00",
    durationMin: 75,
    priceUSD: 165,
    status: "deposit-pending",
  },
];

export const pastAppointments: MockAppointment[] = [
  {
    id: "appt-past-1",
    ref: "AURA-A2C8N4",
    serviceIds: ["svc-cut-style"],
    stylistId: "sty-elena",
    date: "2026-04-22",
    time: "11:00",
    durationMin: 75,
    priceUSD: 120,
    status: "completed",
  },
  {
    id: "appt-past-2",
    ref: "AURA-D5G3R1",
    serviceIds: ["svc-glaze-gloss"],
    stylistId: "sty-priya",
    date: "2026-03-30",
    time: "16:00",
    durationMin: 45,
    priceUSD: 65,
    status: "completed",
  },
  {
    id: "appt-past-3",
    ref: "AURA-T7B6V9",
    serviceIds: ["svc-aura-facial"],
    stylistId: "sty-naomi",
    date: "2026-03-08",
    time: "09:30",
    durationMin: 75,
    priceUSD: 165,
    status: "completed",
  },
  {
    id: "appt-past-4",
    ref: "AURA-M4Q2J7",
    serviceIds: ["svc-massage-60"],
    stylistId: "sty-theo",
    date: "2026-02-19",
    time: "17:00",
    durationMin: 60,
    priceUSD: 130,
    status: "completed",
  },
];

export const favoriteStylistIds = ["sty-elena", "sty-naomi"];
export const favoriteServiceIds = ["svc-cut-style", "svc-aura-facial"];

export type LoyaltyReward = {
  id: string;
  name: string;
  costPts: number;
};

export const loyaltyCatalog: LoyaltyReward[] = [
  { id: "lr-1", name: "Complimentary deep conditioning", costPts: 100 },
  { id: "lr-2", name: "$25 toward any service", costPts: 250 },
  { id: "lr-3", name: "60-minute massage credit", costPts: 800 },
  { id: "lr-4", name: "Custom hair-care duo (retail)", costPts: 600 },
  { id: "lr-5", name: "Bring-a-friend new-guest credit", costPts: 400 },
];
