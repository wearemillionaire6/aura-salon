import type {
  Service,
  AddOn,
  Stylist,
  GalleryImage,
  StylistAvailability,
  Testimonial,
} from "./types";
import servicesRaw from "./services.json";
import addonsRaw from "./addons.json";
import stylistsRaw from "./stylists.json";
import galleryRaw from "./gallery.json";
import availabilityRaw from "./availability.json";
import testimonialsRaw from "./testimonials.json";

export const services = servicesRaw as Service[];
export const addons = addonsRaw as AddOn[];
export const stylists = stylistsRaw as Stylist[];
export const gallery = galleryRaw as GalleryImage[];
export const availability = availabilityRaw as StylistAvailability[];
export const testimonials = testimonialsRaw as Testimonial[];

export const getServiceBySlug = (slug: string) =>
  services.find((s) => s.slug === slug);

export const getStylistBySlug = (slug: string) =>
  stylists.find((s) => s.slug === slug);

export const getEligibleStylists = (serviceIds: string[]) =>
  stylists.filter((s) =>
    serviceIds.every((id) => s.eligibleServiceIds.includes(id))
  );

export * from "./types";
