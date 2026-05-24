import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { services, addons, stylists } from "@/data";
import type { Service, AddOn } from "@/data/types";

export type BookingStep =
  | "service"
  | "stylist"
  | "slot"
  | "details"
  | "review"
  | "confirmed";

export interface BookingDetails {
  name: string;
  email: string;
  phone: string;
  notes: string;
  consent: boolean;
}

export interface BookingState {
  step: BookingStep;
  serviceIds: string[];
  addOnIds: string[];
  stylistId: string | "any";
  date: string | null; // ISO "YYYY-MM-DD"
  time: string | null; // "HH:mm"
  details: BookingDetails;
  slotLockUntil: number | null;
  confirmationRef: string | null;
  submitting: boolean;
  errors: Record<string, string>;
}

interface BookingActions {
  // step navigation
  goTo: (step: BookingStep) => void;
  next: () => void;
  prev: () => void;
  // service
  toggleService: (id: string) => void;
  setServiceFromSlug: (slug: string) => void;
  // addons
  toggleAddOn: (id: string) => void;
  // stylist
  setStylist: (id: string | "any") => void;
  setStylistFromSlug: (slug: string) => void;
  // slot
  setSlot: (date: string, time: string) => void;
  clearSlot: () => void;
  // details
  setDetails: (patch: Partial<BookingDetails>) => void;
  // submit
  submit: () => Promise<void>;
  reset: () => void;
  // derived helpers exposed as actions (return values, not setters)
  getTotals: () => { durationMin: number; priceUSD: number; priceFrom: boolean };
  isSlotLockActive: () => boolean;
  refreshIfLockExpired: () => void;
}

const STEPS: BookingStep[] = [
  "service",
  "stylist",
  "slot",
  "details",
  "review",
  "confirmed",
];

const initial: BookingState = {
  step: "service",
  serviceIds: [],
  addOnIds: [],
  stylistId: "any",
  date: null,
  time: null,
  details: { name: "", email: "", phone: "", notes: "", consent: false },
  slotLockUntil: null,
  confirmationRef: null,
  submitting: false,
  errors: {},
};

function generateRef(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // omit ambiguous
  let out = "AURA-";
  for (let i = 0; i < 6; i++)
    out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

// SSR-safe no-op storage shim for createJSONStorage
const noopStorage: Storage = {
  length: 0,
  clear: () => {},
  getItem: () => null,
  key: () => null,
  removeItem: () => {},
  setItem: () => {},
};

export const useBookingStore = create<BookingState & BookingActions>()(
  persist(
    (set, get) => ({
      ...initial,

      goTo: (step) => set({ step, errors: {} }),
      next: () => {
        const s = get();
        const i = STEPS.indexOf(s.step);
        if (i < 0 || i >= STEPS.length - 1) return;
        // validate per step
        if (s.step === "service" && s.serviceIds.length === 0) {
          set({ errors: { service: "Pick at least one service." } });
          return;
        }
        if (s.step === "slot" && (!s.date || !s.time)) {
          set({ errors: { slot: "Pick a date and time." } });
          return;
        }
        if (s.step === "details") {
          const { name, email, phone, consent } = s.details;
          if (!name || name.length < 2) {
            set({ errors: { name: "Please enter your name." } });
            return;
          }
          if (!email.includes("@")) {
            set({ errors: { email: "Enter a valid email." } });
            return;
          }
          if (phone.replace(/\D/g, "").length < 10) {
            set({ errors: { phone: "Enter a valid phone number." } });
            return;
          }
          if (!consent) {
            set({ errors: { consent: "Please agree to the cancellation policy." } });
            return;
          }
        }
        set({ step: STEPS[i + 1], errors: {} });
      },
      prev: () => {
        const s = get();
        const i = STEPS.indexOf(s.step);
        if (i <= 0) return;
        set({ step: STEPS[i - 1], errors: {} });
      },

      toggleService: (id) =>
        set((s) => ({
          serviceIds: s.serviceIds.includes(id)
            ? s.serviceIds.filter((x) => x !== id)
            : [...s.serviceIds, id],
        })),
      setServiceFromSlug: (slug) => {
        const svc = services.find((s) => s.slug === slug);
        if (svc)
          set((s) => ({
            serviceIds: s.serviceIds.includes(svc.id)
              ? s.serviceIds
              : [...s.serviceIds, svc.id],
          }));
      },

      toggleAddOn: (id) =>
        set((s) => ({
          addOnIds: s.addOnIds.includes(id)
            ? s.addOnIds.filter((x) => x !== id)
            : [...s.addOnIds, id],
        })),

      setStylist: (id) => set({ stylistId: id }),
      setStylistFromSlug: (slug) => {
        const sty = stylists.find((s) => s.slug === slug);
        if (sty) set({ stylistId: sty.id });
      },

      setSlot: (date, time) =>
        set({ date, time, slotLockUntil: Date.now() + 10 * 60 * 1000 }),
      clearSlot: () => set({ date: null, time: null, slotLockUntil: null }),

      setDetails: (patch) =>
        set((s) => ({ details: { ...s.details, ...patch } })),

      submit: async () => {
        set({ submitting: true });
        await new Promise((r) => setTimeout(r, 1200));
        set({
          submitting: false,
          step: "confirmed",
          confirmationRef: generateRef(),
          slotLockUntil: null,
        });
      },

      reset: () => set(initial),

      getTotals: () => {
        const s = get();
        const svcs = s.serviceIds
          .map((id) => services.find((x) => x.id === id))
          .filter(Boolean) as Service[];
        const adds = s.addOnIds
          .map((id) => addons.find((x) => x.id === id))
          .filter(Boolean) as AddOn[];
        const durationMin =
          svcs.reduce((a, x) => a + x.durationMin, 0) +
          adds.reduce((a, x) => a + x.durationMin, 0);
        const priceUSD =
          svcs.reduce((a, x) => a + x.priceUSD, 0) +
          adds.reduce((a, x) => a + x.priceUSD, 0);
        const priceFrom = svcs.some((x) => x.priceFrom);
        return { durationMin, priceUSD, priceFrom };
      },

      isSlotLockActive: () => {
        const s = get();
        return s.slotLockUntil != null && s.slotLockUntil > Date.now();
      },
      refreshIfLockExpired: () => {
        const s = get();
        if (
          s.slotLockUntil != null &&
          s.slotLockUntil <= Date.now() &&
          s.step === "details"
        ) {
          set({
            slotLockUntil: null,
            date: null,
            time: null,
            step: "slot",
            errors: { slot: "Your hold expired — please choose another time." },
          });
        }
      },
    }),
    {
      name: "aura-booking",
      storage: createJSONStorage(() =>
        typeof window === "undefined" ? noopStorage : window.sessionStorage,
      ),
      partialize: (s) => ({
        step: s.step,
        serviceIds: s.serviceIds,
        addOnIds: s.addOnIds,
        stylistId: s.stylistId,
        date: s.date,
        time: s.time,
        details: s.details,
        slotLockUntil: s.slotLockUntil,
        confirmationRef: s.confirmationRef,
      }),
    },
  ),
);

// Convenience selectors (exported for components)
export const selectStep = (s: BookingState) => s.step;
export const selectErrors = (s: BookingState) => s.errors;
