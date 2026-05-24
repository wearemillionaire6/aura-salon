export type ServiceCategory = "Hair" | "Nails" | "Skin" | "Spa";

export interface Service {
  id: string;
  slug: string;
  name: string;
  category: ServiceCategory;
  durationMin: number;
  priceUSD: number;
  priceFrom?: boolean;
  description: string;
  includes: string[];
  addOnIds: string[];
  eligibleStylistIds: string[];
  image?: string;
}

export interface AddOn {
  id: string;
  name: string;
  durationMin: number;
  priceUSD: number;
  description: string;
}

export interface Stylist {
  id: string;
  slug: string;
  name: string;
  title: string;
  specialties: string[];
  bio: string;
  avatarUrl: string;
  yearsExperience: number;
  instagramHandle: string;
  eligibleServiceIds: string[];
}

export interface GalleryImage {
  id: string;
  imageUrl: string;
  alt: string;
  category: ServiceCategory | "Interior";
  stylistId?: string;
  caption?: string;
}

export interface AvailabilityWindow {
  from: string;
  to: string;
}

export interface StylistAvailability {
  stylistId: string;
  weekly: Record<"mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun", AvailabilityWindow[]>;
  daysOff: string[];
  bookedSlots: { date: string; time: string; durationMin: number }[];
}

export interface Testimonial {
  id: string;
  name: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  serviceSlug: string;
  date: string;
}
