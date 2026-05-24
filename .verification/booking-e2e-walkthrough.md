# Booking E2E — Manual Walkthrough (Phase-1)

> This document is a tester-facing checklist for the seven canonical clicks through the booking wizard at `/book`. It is **not** automated in this verification gate — Phase-2 will replace it with a Playwright run.

## Preconditions

- Dev server reachable at `http://localhost:3000` (or production preview equivalent).
- Browser viewport ≥ 1024 px (the right-rail SummaryPanel collapses below `lg:`).
- The blocker noted in `verification-report.md` §1 (next/image remote host) must be resolved first, otherwise `/book` itself still loads (it does not embed Unsplash images in the wizard root) but **StylistStep** at step 2 will throw because each stylist card renders `<Image src={stylist.avatarUrl}>` (avatarUrl is an `images.unsplash.com` URL).

## Canonical happy-path (7 clicks)

| # | Action | Expected state |
|---|--------|----------------|
| 1 | Visit `http://localhost:3000/book` | H1 reads "Find your time at Aura." ProgressBar shows step 1/5 "Service". `ServiceStep` lists all services grouped by category. SummaryPanel right-rail shows the empty "Your booking" placeholder. |
| 2 | Click the service card **"Signature Cut & Style"** | Card highlights as selected. A "Continue" CTA appears (or the wizard auto-advances on click — check `ServiceStep` behavior; if a Continue button is rendered, click it once). Wizard advances to step 2/5 "Stylist". SummaryPanel now shows the selected service and "from $120 · 75 min". |
| 3 | Click the stylist card **"Elena Vasquez"** | Card highlights. Continue button activates. Click Continue. Wizard advances to step 3/5 "Slot". SummaryPanel adds "with Elena Vasquez". |
| 4 | Click an available time slot on the calendar (e.g., the first non-disabled slot tomorrow at 10:00 AM) | Slot pill highlights. Continue button activates. Click Continue. Wizard advances to step 4/5 "Details". SummaryPanel adds the date + time. |
| 5 | Fill the contact form: Name = `Jordan Tester`, Email = `jordan@example.com`, Phone = `555-0100`, leave Notes empty. Click Continue. | Validation passes (all required fields filled, email format valid). Wizard advances to step 5/5 "Review". SummaryPanel mirrors the details. |
| 6 | On the Review step, verify the summary card lists: service, stylist, date/time, contact details, total price. Click **"Confirm booking"**. | Wizard advances to the **Confirmed** step (renders full-bleed via `ConfirmedStep`, no Container wrapper). |
| 7 | On the Confirmation page, verify: booking reference / confirmation copy is shown, a "Book another" or "Return home" CTA is present. Click any CTA to leave the flow. | User is returned to either `/` or a clean `/book` (depending on `ConfirmedStep` implementation — both are acceptable Phase-1 behaviors). |

## Edge cases to spot-check (manual; not blocking Phase-1 sign-off)

- **Deep-link preselect** — visit `/book?service=signature-cut-and-style&stylist=elena-vasquez` directly. Wizard should open with those preselected on first render (handled by `BookingWizardInner` effect).
- **Validation** — at step 5 (details), submit with empty name → form should block + show error message under the Name field.
- **Back navigation** — at any step ≥ 2, the wizard should expose a "Back" affordance that returns to the previous step without losing prior selections (verify against `useBookingStore` step machine).
- **Refresh persistence** — refresh the browser at step 3. Phase-1 store is Zustand without persistence, so state will reset; acceptable for Phase-1 (Phase-2 may add `persist` middleware).
- **Reduced motion** — toggle macOS `Reduce motion` system pref and re-walk steps 1–6; motion components (`FadeUp`, `StaggerList`) should respect the rule via the `prefers-reduced-motion` block in `src/app/globals.css:86`.

## Out of scope for this manual walkthrough

- Real payment capture (Phase-2).
- Real calendar availability (Phase-1 uses static `availability.json`).
- Email/SMS notifications on confirm (Phase-2).
- Authenticated booking via `/account` (Phase-1 is a stub; the wizard is anonymous).
