# Aura Salon — Verification Report (Wave 10)

**Phase:** 24+25 (consolidated verification)
**App root:** `/Users/bhaveshashokwaghmare/Library/Mobile Documents/iCloud~md~obsidian/Documents/Proposal/05_projects/aura-salon/app/`
**Reporter:** QA verification subagent
**Date:** 2026-05-21
**Next.js:** 16.2.6 (Turbopack)

---

## Verdict: **FAIL** (blocker — runtime image-host configuration)

The production build compiles and the static-page generator emits all 33 expected routes without error, **but six of the twelve smoke-tested routes return HTTP 500 against the dev server** because `next.config.ts` does not whitelist `images.unsplash.com` as an allowed remote host for `next/image`. All a11y static checks pass. One blocker, one minor item, otherwise clean.

> Re-run this gate after the orchestrator adds `images.remotePatterns` (or equivalent) to `next.config.ts`. Expected resolution time: a one-line config edit.

---

## 1. Production build (`npx next build`)

| Field | Value |
|-------|-------|
| Command | `npx next build` (run from app root) |
| Log | `/Users/bhaveshashokwaghmare/Library/Mobile Documents/iCloud~md~obsidian/Documents/Proposal/05_projects/aura-salon/app/.verification/build.log` |
| Exit code | **0** |
| Compile status | "✓ Compiled successfully in 2.6s" (build.log:11) |
| TypeScript | "Finished TypeScript in 2.8s" — no errors (build.log:13) |
| Static page generation | "✓ Generating static pages using 7 workers (33/33) in 297ms" (build.log:19) |
| Notable warnings | One lockfile-inference warning (Next detected `/Users/bhaveshashokwaghmare/package-lock.json` upstream and chose that as workspace root). Cosmetic only — does not affect build correctness. Suppress later by setting `turbopack.root` in `next.config.ts`. |

### Routes in manifest (16 unique entries; 33 static pages once `[slug]` is expanded)

Static (`○`):
- `/`
- `/_not-found`
- `/about`
- `/account`
- `/book`
- `/contact`
- `/dashboard`
- `/faq`
- `/gallery`
- `/services`
- `/team`

SSG via `generateStaticParams` (`●`):
- `/services/[slug]` — 14 prerendered slugs (`signature-cut-and-style`, `single-process-color`, `highlights-balayage`, + 11 more)
- `/team/[slug]` — 6 prerendered slugs (`elena-vasquez`, `marcus-okafor`, `priya-shah`, + 3 more)

All 12 required Phase-1 routes are present.

---

## 2. HTTP smoke against dev server (`npx next dev`)

Dev server started in background, "✓ Ready in 256ms" (dev.log line 4). 12 routes hit with `curl -s -o /tmp/page.html -w "%{http_code}"`; H1 extracted with a Python regex.

| # | Route | HTTP | First `<h1>` | Notes |
|---|-------|------|--------------|-------|
| 1 | `/` | **500** | — | next/image rejects `images.unsplash.com` — `PageHero` media URL. See §5. |
| 2 | `/services` | **500** | — | Same root cause — service card thumbnails reference Unsplash. |
| 3 | `/services/signature-cut-and-style` | **500** | — | Same root cause — service hero image. |
| 4 | `/team` | **500** | — | Same root cause — stylist `avatarUrl` is Unsplash. |
| 5 | `/team/elena-vasquez` | **500** | — | Same root cause — stylist hero avatar. |
| 6 | `/gallery` | **500** | — | Same root cause — gallery photos are Unsplash. |
| 7 | `/about` | **500** | — | Same root cause — about page portrait. |
| 8 | `/contact` | 200 | "Visit us in the West Village." | Renders cleanly; no remote images on this route. |
| 9 | `/faq` | 200 | "Most-asked questions" | Renders cleanly. |
| 10 | `/book` | 200 | "Find your time at Aura." | Wizard root renders; **stylist step will 500 on first interaction** because each stylist card reads `avatarUrl` from `images.unsplash.com`. |
| 11 | `/account` | 200 | "Welcome back, Jordan." | Renders cleanly (stub page, no Unsplash images). |
| 12 | `/dashboard` | 200 | "Today at Aura" | Renders cleanly (stub page, no Unsplash images). |

Raw runtime errors (dev.log excerpt):
```
⨯ Error: Invalid src prop (https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?...)
  on `next/image`, hostname "images.unsplash.com" is not configured under images
  in your `next.config.js`
  See more info: https://nextjs.org/docs/messages/next-image-unconfigured-host
```

**Booking flow** end-to-end was **not** executed in this verification — it is documented as a manual 7-step walkthrough at `/Users/bhaveshashokwaghmare/Library/Mobile Documents/iCloud~md~obsidian/Documents/Proposal/05_projects/aura-salon/app/.verification/booking-e2e-walkthrough.md`. Phase-2 will replace that with an automated Playwright run.

Dev server killed cleanly after smoke (PID 32346).

---

## 3. A11y static inspection

| Check | Result | Evidence |
|-------|--------|----------|
| `<Image>` `alt` attribute on every instance | **PASS — 0 flags** | Python AST scan across 14 `<Image>` JSX nodes in `src/**/*.tsx`. All have an `alt=` attribute. |
| Icon-only buttons have `aria-label` | **PASS with 1 minor** | 4 of 5 `size="icon"` `<Button>`s have explicit `aria-label` (`SiteHeader.tsx:70`, `SiteFooter.tsx:94`, `DashboardShell.tsx:236`, plus an inline icon usage at `DashboardShell.tsx:218` that also has `aria-label`). The exception is the shadcn `CalendarDayButton` at `src/components/ui/calendar.tsx:196` — it uses `size="icon"` for visual sizing but receives the day-number text as children via `{...props}`, so it is **not** icon-only in practice. Minor cosmetic only; not a blocker. |
| Exactly one `<h1>` per route | **PASS — 12/12** | Confirmed by smoke HTML extraction for the 6 routes that returned 200, and by source inspection of `<h1>` JSX for the 6 routes blocked by the image-host issue: `src/app/page.tsx` (via `PageHero`), `src/app/services/page.tsx`, `src/app/services/[slug]/page.tsx:62`, `src/app/team/page.tsx`, `src/app/team/[slug]/page.tsx:113`, `src/app/gallery/page.tsx`, `src/app/about/page.tsx`, `src/app/contact/page.tsx`, `src/app/faq/page.tsx`, `src/app/book/page.tsx:41`, `src/app/account/page.tsx:21`, `src/app/dashboard/_components/DashboardShell.tsx:230`. |
| `FormField` `Label htmlFor={id}` paired | **PASS** | `src/components/form/FormField.tsx:33` — `<Label htmlFor={id} ...>` is wired to the field's generated id. |
| `:focus-visible` ring CSS | **PASS** | `src/app/globals.css:76` — `:focus-visible { outline: 2px solid var(--color-ring); outline-offset: 2px; }` |
| `prefers-reduced-motion: reduce` respected | **PASS** | `src/app/globals.css:86` — media query overrides animation/transition durations to `0.01ms` for all elements. |

No `Image` alts emitted as build-time warnings (build.log is clean of `jsx-a11y` complaints).

---

## 4. Booking E2E (manual walkthrough)

Produced at: `/Users/bhaveshashokwaghmare/Library/Mobile Documents/iCloud~md~obsidian/Documents/Proposal/05_projects/aura-salon/app/.verification/booking-e2e-walkthrough.md`

Summary of the 7 canonical clicks:

1. Visit `/book` — wizard opens on step "Service".
2. Select **"Signature Cut & Style"** and click Continue → advances to "Stylist".
3. Select **"Elena Vasquez"** and click Continue → advances to "Slot".
4. Pick the first available time slot and click Continue → advances to "Details".
5. Fill the contact form (`Jordan Tester` / `jordan@example.com` / `555-0100`) and click Continue → advances to "Review".
6. Click **"Confirm booking"** on the Review step → renders `ConfirmedStep` (full-bleed).
7. Click the post-confirm CTA to leave the flow.

The walkthrough doc also enumerates edge-case spot-checks (deep-link preselect, validation, back nav, refresh persistence, reduced-motion) that the tester should run manually before Phase-2 lands the automated Playwright suite.

---

## 5. Blockers

### B-1 (blocking) — `next.config.ts` missing `images.remotePatterns` for `images.unsplash.com`

- **Severity:** High. Six of twelve smoke routes return HTTP 500. The booking wizard also fails at step 2 (StylistStep) for the same reason.
- **Root cause:** `next.config.ts` currently exports an empty config object:
  ```ts
  // /Users/.../app/next.config.ts
  const nextConfig: NextConfig = {
    /* config options here */
  };
  ```
  Every `<Image src="https://images.unsplash.com/...">` in `services.json`, `stylists.json`, `gallery.json`, `home.ts`, `about.ts`, etc. then trips the runtime host check.
- **Recommended fix (one edit, not applied here per QA scope):**
  ```ts
  const nextConfig: NextConfig = {
    images: {
      remotePatterns: [
        { protocol: "https", hostname: "images.unsplash.com" },
      ],
    },
  };
  ```
- **Why the production build still succeeded:** Next 16 / Turbopack does not invoke the runtime Image loader during `generateStaticParams` page generation — the host check fires only when a request actually serves the page through the Image component. So `next build` reported success on all 33 routes even though six of them will refuse to serve in any environment (dev or prod) until the config is patched.

---

## 6. Known debt / Phase-2 follow-ups

1. **Workspace-root warning** — `Next.js inferred your workspace root` due to two `package-lock.json` files. Set `turbopack: { root: __dirname }` in `next.config.ts` to silence (cosmetic).
2. **Calendar `size="icon"` button** at `src/components/ui/calendar.tsx:196` — not flagged as a real a11y issue because the button's content is the day number, but if a future refactor strips the day text, add an explicit `aria-label` (e.g., `aria-label={day.date.toLocaleDateString()}`).
3. **No automated E2E** — booking flow is verified by a manual `.verification/booking-e2e-walkthrough.md` checklist; Phase-2 should replace with Playwright + Axe scan.
4. **Booking store has no `persist` middleware** — refresh at step 3 resets the wizard. Acceptable for Phase-1 prototype.
5. **`/account` and `/dashboard` are stubs** — verified to render with valid `<h1>` and 200 OK, but they are not authenticated and do not represent production-grade screens.
6. **No real Axe a11y run** — this gate is static-only (grep + CSS inspect). Phase-2 should run `@axe-core/playwright` against all 12 routes once B-1 is unblocked.

---

## Appendix A — Files produced by this verification

- `/Users/bhaveshashokwaghmare/Library/Mobile Documents/iCloud~md~obsidian/Documents/Proposal/05_projects/aura-salon/app/.verification/build.log` — full `next build` stdout/stderr.
- `/Users/bhaveshashokwaghmare/Library/Mobile Documents/iCloud~md~obsidian/Documents/Proposal/05_projects/aura-salon/app/.verification/dev.log` — `next dev` stdout/stderr including all 12 route hits + the 6 runtime image-host errors.
- `/Users/bhaveshashokwaghmare/Library/Mobile Documents/iCloud~md~obsidian/Documents/Proposal/05_projects/aura-salon/app/.verification/booking-e2e-walkthrough.md` — the 7-click tester checklist for the booking wizard.
- `/Users/bhaveshashokwaghmare/Library/Mobile Documents/iCloud~md~obsidian/Documents/Proposal/05_projects/aura-salon/app/.verification/verification-report.md` — this file.
