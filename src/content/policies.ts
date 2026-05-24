export const policies = {
  cancellation: {
    title: "Cancellation & Reschedule",
    body: "We hold your appointment time exclusively for you, so we ask for 24 hours' notice on cancellations and reschedules. Inside 24 hours, we charge 50% of the booked service price to the card on file. Same-day no-shows are charged in full. We do make exceptions for emergencies — just tell us.",
  },
  deposit: {
    title: "Deposits",
    body: "Color services, bridal hair, and any appointment over 90 minutes require a 25% deposit at booking, applied to your final bill. Standard services don't require a deposit, but a card on file is required to hold the appointment.",
  },
  privacy: {
    title: "Privacy",
    body: "We collect the minimum information needed to book, remind, and bill — name, contact, service history, and tokenized payment via Stripe. We don't sell or share your information with marketers. You can request a copy or deletion of your data at hello@aurasalon.example.",
  },
  terms: {
    title: "Terms of Service",
    body: "By booking, you agree to our cancellation policy, deposit policy, and standard salon-service terms. We reserve the right to refuse service for behavior that affects the safety or comfort of our team or other guests.",
  },
  accessibility: {
    title: "Accessibility",
    body: "Our entrance is street-level with no step. Two of our four shampoo stations have adjustable chairs that accommodate mobility devices. If you have a specific need we can prepare for, please tell us in your booking notes.",
  },
} as const;
