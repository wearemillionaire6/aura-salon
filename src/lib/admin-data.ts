import { services, stylists, availability } from "@/data";

// Today (relative to the prototype; we hardcode 2026-05-22 so timezone weirdness can't shift things)
export const todayISO = "2026-05-22";

export type AppointmentStatus = "confirmed" | "deposit-pending";

export interface TodaysAppointment {
  id: string;
  stylistId: string;
  serviceId: string;
  serviceName: string;
  category: string;
  priceUSD: number;
  startTime: string;
  durationMin: number;
  clientName: string;
  status: AppointmentStatus;
}

// Mock today's appointments — synth from availability.bookedSlots but only those on todayISO
export const todaysAppointments: TodaysAppointment[] = stylists.flatMap((sty) => {
  const av = availability.find((a) => a.stylistId === sty.id);
  if (!av) return [];
  return av.bookedSlots
    .filter((b) => b.date === todayISO)
    .map((b, i): TodaysAppointment => {
      // pick a deterministic service from this stylist's eligibleServiceIds
      const svcId = sty.eligibleServiceIds[i % sty.eligibleServiceIds.length];
      const svc = services.find((s) => s.id === svcId);
      return {
        id: `${sty.id}-${b.time}`,
        stylistId: sty.id,
        serviceId: svcId,
        serviceName: svc?.name ?? "Service",
        category: svc?.category ?? "Hair",
        priceUSD: svc?.priceUSD ?? 100,
        startTime: b.time,
        durationMin: b.durationMin,
        clientName: [
          "Mae Z.",
          "Theo B.",
          "Sara P.",
          "Olivia R.",
          "Daniel K.",
          "Aisha O.",
          "Joon L.",
          "Marisol G.",
        ][i % 8],
        status: i % 5 === 0 ? "deposit-pending" : "confirmed",
      };
    });
});

export const kpis = {
  bookingsToday: todaysAppointments.length,
  revenueToday: todaysAppointments.reduce((a, x) => a + x.priceUSD, 0),
  occupancyPct: Math.min(
    95,
    Math.round((todaysAppointments.length / (stylists.length * 8)) * 100),
  ),
  newClientsThisWeek: 7,
};

export interface ActivityItem {
  id: number;
  type: "booking" | "walkin" | "cancellation" | "lowstock" | "review";
  msg: string;
  ts: string;
}

export const activityFeed: ActivityItem[] = [
  {
    id: 1,
    type: "booking",
    msg: "New booking · Aura Manicure · with Priya · 17:00",
    ts: "2 min ago",
  },
  {
    id: 2,
    type: "walkin",
    msg: "Walk-in checked in · Signature Cut & Style · assigned to Marcus",
    ts: "12 min ago",
  },
  {
    id: 3,
    type: "cancellation",
    msg: "Cancellation inside policy · Single-Process Color · 15:00",
    ts: "1 hr ago",
  },
  {
    id: 4,
    type: "lowstock",
    msg: "Low stock alert · Davines OI Conditioner (2 left)",
    ts: "3 hr ago",
  },
  {
    id: 5,
    type: "review",
    msg: "★★★★★ from Olivia R. · facials with Naomi",
    ts: "yesterday",
  },
];

export type SidebarIconName =
  | "Calendar"
  | "Tag"
  | "Users"
  | "MessageSquare"
  | "Boxes"
  | "ChartBar"
  | "Settings";

export interface SidebarNavItem {
  id: string;
  label: string;
  icon: SidebarIconName;
  available: boolean;
}

export const sidebarNav: SidebarNavItem[] = [
  { id: "calendar", label: "Calendar", icon: "Calendar", available: true },
  { id: "services", label: "Services", icon: "Tag", available: false },
  { id: "staff", label: "Staff", icon: "Users", available: false },
  { id: "customers", label: "Customers", icon: "MessageSquare", available: false },
  { id: "inventory", label: "Inventory", icon: "Boxes", available: false },
  { id: "reports", label: "Reports", icon: "ChartBar", available: false },
  { id: "settings", label: "Settings", icon: "Settings", available: false },
];
