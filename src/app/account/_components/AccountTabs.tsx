"use client";

import * as React from "react";
import Link from "next/link";
import { useForm, type Resolver } from "react-hook-form";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import {
  Calendar,
  Clock,
  Heart,
  Star,
  Award,
  User,
  Gift,
  Mail,
  Phone,
  ArrowRight,
  Check,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/form";

import { services, stylists } from "@/data";
import { formatPrice, formatDuration } from "@/lib/booking-helpers";
import { cn } from "@/lib/utils";
import {
  accountUser,
  favoriteServiceIds,
  favoriteStylistIds,
  loyaltyCatalog,
  loyaltyTiers,
  type MockAppointment,
} from "@/lib/account-data";

/* ----------------------------- helpers --------------------------------- */

function serviceById(id: string) {
  return services.find((s) => s.id === id);
}

function stylistById(id: string) {
  return stylists.find((s) => s.id === id);
}

function fmtDate(dateISO: string) {
  return format(parseISO(dateISO), "EEE, MMM d, yyyy");
}

function fmtTime(time: string) {
  const [h, m] = time.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return format(d, "h:mm a");
}

function statusBadge(status: MockAppointment["status"]) {
  switch (status) {
    case "confirmed":
      return (
        <Badge className="border-transparent bg-[var(--color-terracotta-500)] text-[var(--color-bone-50)]">
          Confirmed
        </Badge>
      );
    case "deposit-pending":
      return (
        <Badge
          variant="outline"
          className="border-[var(--color-mist-400)] bg-[var(--color-mist-100,#EEF1EE)] text-[var(--color-ink-700)]"
        >
          Deposit pending
        </Badge>
      );
    case "completed":
      return (
        <Badge variant="secondary">Completed</Badge>
      );
    case "cancelled":
      return <Badge variant="destructive">Cancelled</Badge>;
  }
}

/* --------------------------- Upcoming card ----------------------------- */

function UpcomingCard({ appt }: { appt: MockAppointment }) {
  const stylist = stylistById(appt.stylistId);
  const appointmentServices = appt.serviceIds
    .map((id) => serviceById(id))
    .filter((s): s is NonNullable<ReturnType<typeof serviceById>> => Boolean(s));
  const [openReschedule, setOpenReschedule] = React.useState(false);
  const [openCancel, setOpenCancel] = React.useState(false);

  return (
    <Card className="border-[var(--color-mist-400)]">
      <CardContent className="flex flex-col gap-5 px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            {stylist ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={stylist.avatarUrl}
                alt={stylist.name}
                className="size-12 rounded-full object-cover ring-1 ring-[var(--color-mist-400)]"
              />
            ) : null}
            <div className="flex flex-col gap-1">
              <p className="font-display text-xl text-[var(--color-ink-900)]">
                {appointmentServices.map((s) => s.name).join(" + ") || "Appointment"}
              </p>
              {stylist ? (
                <p className="text-sm text-[var(--color-ink-500)]">
                  with <span className="text-[var(--color-ink-900)]">{stylist.name}</span>
                </p>
              ) : null}
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink-500)]">
                Ref {appt.ref}
              </p>
            </div>
          </div>
          {statusBadge(appt.status)}
        </div>

        <div className="grid grid-cols-1 gap-3 rounded-lg bg-[var(--color-bone-100)] p-4 text-sm sm:grid-cols-3">
          <div className="flex items-center gap-2 text-[var(--color-ink-700)]">
            <Calendar className="size-4 text-[var(--color-ink-500)]" />
            <span>{fmtDate(appt.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-[var(--color-ink-700)]">
            <Clock className="size-4 text-[var(--color-ink-500)]" />
            <span>
              {fmtTime(appt.time)} · {formatDuration(appt.durationMin)}
            </span>
          </div>
          <div className="text-[var(--color-ink-700)] sm:text-right">
            {formatPrice(appt.priceUSD)}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Dialog open={openReschedule} onOpenChange={setOpenReschedule}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                Reschedule
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reschedule appointment</DialogTitle>
                <DialogDescription>
                  We&apos;ll text you to confirm a new time within the hour. Your stylist
                  and service will be held.
                </DialogDescription>
              </DialogHeader>
              <div className="rounded-md border border-[var(--color-mist-400)] bg-[var(--color-bone-100)] p-3 text-sm">
                <p className="text-[var(--color-ink-900)]">
                  {appointmentServices.map((s) => s.name).join(" + ")}
                </p>
                <p className="mt-1 text-[var(--color-ink-500)]">
                  {fmtDate(appt.date)} at {fmtTime(appt.time)}
                </p>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="ghost">Cancel</Button>
                </DialogClose>
                <Button
                  onClick={() => {
                    setOpenReschedule(false);
                    toast.success("Reschedule request sent — we&apos;ll text you shortly.");
                  }}
                >
                  Confirm
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={openCancel} onOpenChange={setOpenCancel}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                Cancel
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cancel appointment?</DialogTitle>
                <DialogDescription>
                  Aura&apos;s 24-hour cancellation policy applies. Cancellations within
                  24 hours of your appointment may be charged 50% of the service price.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="ghost">Keep appointment</Button>
                </DialogClose>
                <Button
                  variant="destructive"
                  onClick={async () => {
                    setOpenCancel(false);
                    const { cancelBooking } = await import("../actions");
                    const res = await cancelBooking(appt.id);
                    if (res?.error) {
                      toast.error(res.error);
                    } else {
                      toast.success("Appointment cancelled. A confirmation email is on its way.");
                    }
                  }}
                >
                  Confirm cancellation
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}

/* ----------------------------- History row ----------------------------- */

function HistoryRow({ appt }: { appt: MockAppointment }) {
  const stylist = stylistById(appt.stylistId);
  const svc = serviceById(appt.serviceIds[0]);
  const rebookHref = `/book?service=${svc?.slug ?? ""}&stylist=${stylist?.slug ?? ""}`;
  return (
    <div className="grid grid-cols-1 items-center gap-3 rounded-lg border border-[var(--color-mist-400)] bg-card px-4 py-4 sm:grid-cols-[1.2fr_2fr_1.5fr_1fr_auto]">
      <div className="text-sm text-[var(--color-ink-700)]">
        <p className="font-medium text-[var(--color-ink-900)]">{fmtDate(appt.date)}</p>
        <p className="text-xs text-[var(--color-ink-500)]">{fmtTime(appt.time)}</p>
      </div>
      <div className="text-sm text-[var(--color-ink-900)]">{svc?.name ?? "Service"}</div>
      <div className="text-sm text-[var(--color-ink-700)]">
        {stylist ? `with ${stylist.name}` : ""}
      </div>
      <div className="text-sm text-[var(--color-ink-700)]">
        {formatPrice(appt.priceUSD)}
      </div>
      <Button asChild size="sm" variant="outline">
        <Link href={rebookHref}>
          Rebook <ArrowRight className="ml-1 size-3.5" />
        </Link>
      </Button>
    </div>
  );
}

/* ----------------------------- Loyalty --------------------------------- */

function LoyaltyPanel() {
  const points = accountUser.loyaltyPoints;
  const currentIdx = loyaltyTiers.findIndex((t) => t.name === accountUser.loyaltyTier);
  const next = loyaltyTiers[currentIdx + 1] ?? loyaltyTiers[loyaltyTiers.length - 1];
  const pct = Math.min(100, Math.round((points / next.min) * 100));

  return (
    <div className="flex flex-col gap-6">
      <Card className="border-[var(--color-mist-400)] bg-[var(--color-bone-100)]">
        <CardContent className="flex flex-col gap-4 px-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-sans uppercase tracking-[0.22em] text-[var(--color-ink-500)]">
                Aura loyalty
              </p>
              <p className="mt-1 font-display text-4xl text-[var(--color-ink-900)]">
                {points} <span className="text-2xl text-[var(--color-ink-500)]">pts</span>{" "}
                <span className="ml-2 align-middle text-base text-[var(--color-ink-700)]">
                  · {accountUser.loyaltyTier} tier
                </span>
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-card px-3 py-1 text-sm text-[var(--color-ink-700)]">
              <Gift className="size-4 text-[var(--color-terracotta-500)]" />
              Gift card balance: <strong>${accountUser.giftCardBalance}</strong>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs text-[var(--color-ink-500)]">
              <span>{accountUser.loyaltyTier}</span>
              <span>
                {points} / {next.min} to {next.name}
              </span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[var(--color-mist-100,#EEF1EE)]">
              <div
                className="h-full rounded-full bg-[var(--color-terracotta-500)] transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h3 className="font-display text-xl text-[var(--color-ink-900)]">Rewards catalog</h3>
        <p className="mt-1 text-sm text-[var(--color-ink-500)]">
          Redeem points toward services, retail, and add-ons. Rewards apply at checkout.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {loyaltyCatalog.map((r) => {
            const disabled = r.costPts > points;
            return (
              <Card key={r.id} className="border-[var(--color-mist-400)]">
                <CardContent className="flex h-full flex-col justify-between gap-4 px-6">
                  <div>
                    <div className="flex items-center gap-2 text-[var(--color-terracotta-500)]">
                      <Award className="size-4" />
                      <span className="text-xs font-medium uppercase tracking-[0.18em]">
                        {r.costPts} pts
                      </span>
                    </div>
                    <p className="mt-2 font-display text-lg text-[var(--color-ink-900)]">
                      {r.name}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant={disabled ? "outline" : "default"}
                    disabled={disabled}
                    onClick={() => toast.success(`Reward redeemed: ${r.name}.`)}
                  >
                    {disabled
                      ? `Need ${r.costPts - points} more pts`
                      : "Redeem"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- Favorites ------------------------------- */

function FavoritesPanel() {
  const favStylists = favoriteStylistIds
    .map((id) => stylistById(id))
    .filter((s): s is NonNullable<ReturnType<typeof stylistById>> => Boolean(s));
  const favServices = favoriteServiceIds
    .map((id) => serviceById(id))
    .filter((s): s is NonNullable<ReturnType<typeof serviceById>> => Boolean(s));

  return (
    <div className="flex flex-col gap-10">
      <section>
        <h3 className="font-display text-xl text-[var(--color-ink-900)]">Favorite stylists</h3>
        <p className="mt-1 text-sm text-[var(--color-ink-500)]">
          Your go-to team. Tap to start a booking pre-filled with their chair.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favStylists.map((s) => {
            const first = s.name.split(" ")[0];
            return (
              <Card key={s.id} className="border-[var(--color-mist-400)]">
                <CardContent className="flex items-center gap-4 px-6">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.avatarUrl}
                    alt={s.name}
                    className="size-16 rounded-full object-cover ring-1 ring-[var(--color-mist-400)]"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-lg text-[var(--color-ink-900)]">{s.name}</p>
                    <p className="truncate text-xs text-[var(--color-ink-500)]">{s.title}</p>
                    <Button asChild size="sm" variant="outline" className="mt-3">
                      <Link href={`/book?stylist=${s.slug}`}>
                        Book with {first}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section>
        <h3 className="font-display text-xl text-[var(--color-ink-900)]">Favorite services</h3>
        <p className="mt-1 text-sm text-[var(--color-ink-500)]">
          Quick rebooks for the appointments you keep coming back for.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favServices.map((s) => (
            <Card key={s.id} className="border-[var(--color-mist-400)]">
              <CardContent className="flex h-full flex-col justify-between gap-4 px-6">
                <div>
                  <div className="flex items-center gap-2 text-[var(--color-terracotta-500)]">
                    <Star className="size-4" />
                    <span className="text-xs font-medium uppercase tracking-[0.18em]">
                      {s.category}
                    </span>
                  </div>
                  <p className="mt-2 font-display text-lg text-[var(--color-ink-900)]">
                    {s.name}
                  </p>
                  <p className="mt-1 text-sm text-[var(--color-ink-700)]">
                    {formatPrice(s.priceUSD, s.priceFrom)} · {formatDuration(s.durationMin)}
                  </p>
                </div>
                <Button asChild size="sm">
                  <Link href={`/book?service=${s.slug}`}>Book this</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ----------------------------- Profile --------------------------------- */

type ProfileForm = {
  name: string;
  email: string;
  phone: string;
  notes: string;
  sms: boolean;
  email_opt: boolean;
  marketing: boolean;
};

function ProfilePanel({ customer }: { customer: any }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProfileForm>({
    defaultValues: {
      name: customer?.full_name || "",
      email: customer?.email || "",
      phone: customer?.phone || "",
      notes: customer?.notes || "",
      sms: true,
      email_opt: true,
      marketing: false,
    },
    mode: "onBlur",
  });

  const sms = watch("sms");
  const emailOpt = watch("email_opt");
  const marketing = watch("marketing");

  const onSubmit = handleSubmit(async (values) => {
    const { updateCustomerProfile } = await import("../actions");
    const res = await updateCustomerProfile({
      name: values.name,
      phone: values.phone,
      notes: values.notes,
    });
    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success("Profile saved.");
    }
  });

  const toggle = (key: "sms" | "email_opt" | "marketing", current: boolean) =>
    setValue(key, !current, { shouldDirty: true });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          id="acct-name"
          label="Full name"
          required
          error={errors.name?.message}
        >
          <Input
            autoComplete="name"
            {...register("name", { required: "Please enter your name." })}
          />
        </FormField>
        <FormField
          id="acct-email"
          label="Email"
          required
          error={errors.email?.message}
        >
          <Input
            type="email"
            autoComplete="email"
            {...register("email", { required: "Enter a valid email." })}
          />
        </FormField>
      </div>
      <FormField
        id="acct-phone"
        label="Phone"
        required
        error={errors.phone?.message}
      >
        <Input
          type="tel"
          autoComplete="tel"
          {...register("phone", { required: "Enter a phone number." })}
        />
      </FormField>
      <FormField
        id="acct-notes"
        label="Notes for your stylist"
        description="Allergies, sensitivities, anything we should plan for."
      >
        <Textarea rows={4} maxLength={500} {...register("notes")} />
      </FormField>

      <Separator />

      <fieldset className="flex flex-col gap-3">
        <legend className="text-sm font-medium text-[var(--color-ink-900)]">
          Communication preferences
        </legend>
        {[
          { key: "sms" as const, label: "SMS reminders", desc: "Appointment reminders and reschedule alerts.", checked: sms },
          { key: "email_opt" as const, label: "Email confirmations", desc: "Booking confirmations and receipts.", checked: emailOpt },
          { key: "marketing" as const, label: "Marketing emails", desc: "Seasonal offers and Aura news. About once a month.", checked: marketing },
        ].map((opt) => (
          <label
            key={opt.key}
            className="flex cursor-pointer items-start gap-3 rounded-lg border border-[var(--color-mist-400)] bg-card p-4 text-sm transition-colors hover:bg-[var(--color-bone-100)]"
          >
            <input
              type="checkbox"
              className="sr-only"
              checked={opt.checked}
              onChange={() => toggle(opt.key, opt.checked)}
            />
            <span
              className={cn(
                "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border",
                opt.checked
                  ? "border-[var(--color-terracotta-500)] bg-[var(--color-terracotta-500)] text-[var(--color-bone-50)]"
                  : "border-[var(--color-mist-400)] bg-[var(--color-bone-50)]",
              )}
              aria-hidden
            >
              {opt.checked ? <Check className="size-3" /> : null}
            </span>
            <span className="flex flex-col">
              <span className="font-medium text-[var(--color-ink-900)]">{opt.label}</span>
              <span className="text-xs text-[var(--color-ink-500)]">{opt.desc}</span>
            </span>
          </label>
        ))}
      </fieldset>

      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={isSubmitting}>
          Save changes
        </Button>
      </div>
    </form>
  );
}

/* ----------------------------- Main tabs ------------------------------- */

export function AccountTabs({ customer, bookings }: { customer: any; bookings: any[] }) {
  const formattedBookings = bookings.map((b) => {
    const chosenServices = b.service_ids
      .map((id: string) => services.find((x) => x.id === id))
      .filter(Boolean) as any[];
    const chosenAddOns = b.booking_addons || [];

     const durationMin =
      chosenServices.reduce((acc: number, s: any) => acc + s.durationMin, 0) +
      chosenAddOns.reduce((acc: number, a: any) => acc + 15, 0);

    const totalUSD =
      chosenServices.reduce((acc: number, s: any) => acc + s.priceUSD, 0) +
      chosenAddOns.reduce((acc: number, a: any) => acc + (a.price_cents / 100), 0);

    return {
      id: b.id,
      ref: b.reference,
      stylistId: b.stylist_id || "any",
      serviceIds: b.service_ids,
      date: b.booking_date,
      time: b.start_time.substring(0, 5),
      durationMin,
      priceUSD: totalUSD,
      status: b.status,
    };
  });

  const todayStr = new Date().toISOString().split("T")[0];
  const upcomingAppointments = formattedBookings.filter(
    (b) => b.date >= todayStr && b.status !== "cancelled" && b.status !== "completed"
  );
  const pastAppointments = formattedBookings.filter(
    (b) => b.date < todayStr || b.status === "completed" || b.status === "cancelled"
  );

  return (
    <Tabs defaultValue="upcoming" className="w-full gap-6">
      <TabsList className="grid h-auto w-full grid-cols-2 gap-1 bg-[var(--color-bone-100)] p-1 sm:grid-cols-5">
        <TabsTrigger value="upcoming" className="gap-1.5 py-2">
          <Calendar className="size-4" />
          <span>Upcoming</span>
        </TabsTrigger>
        <TabsTrigger value="history" className="gap-1.5 py-2">
          <Clock className="size-4" />
          <span>History</span>
        </TabsTrigger>
        <TabsTrigger value="favorites" className="gap-1.5 py-2">
          <Heart className="size-4" />
          <span>Favorites</span>
        </TabsTrigger>
        <TabsTrigger value="loyalty" className="gap-1.5 py-2">
          <Award className="size-4" />
          <span>Loyalty</span>
        </TabsTrigger>
        <TabsTrigger value="profile" className="gap-1.5 py-2">
          <User className="size-4" />
          <span>Profile</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="upcoming" className="flex flex-col gap-4">
        {upcomingAppointments.length === 0 ? (
          <Card className="border-dashed border-[var(--color-mist-400)]">
            <CardContent className="flex flex-col items-center gap-3 px-6 py-12 text-center">
              <Calendar className="size-6 text-[var(--color-ink-500)]" />
              <p className="text-sm text-[var(--color-ink-500)]">
                No upcoming appointments. Ready for your next visit?
              </p>
              <Button asChild>
                <Link href="/book">Book an appointment</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          upcomingAppointments.map((a) => <UpcomingCard key={a.id} appt={a} />)
        )}
      </TabsContent>

      <TabsContent value="history">
        <Card className="border-[var(--color-mist-400)]">
          <CardHeader>
            <CardTitle className="font-display text-xl text-[var(--color-ink-900)]">
              Recent visits
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 px-6">
            <div className="hidden grid-cols-[1.2fr_2fr_1.5fr_1fr_auto] gap-3 px-4 text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--color-ink-500)] sm:grid">
              <span>Date</span>
              <span>Service</span>
              <span>Stylist</span>
              <span>Price</span>
              <span className="text-right">Action</span>
            </div>
            {pastAppointments.map((a) => (
              <HistoryRow key={a.id} appt={a} />
            ))}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="favorites">
        <FavoritesPanel />
      </TabsContent>

      <TabsContent value="loyalty">
        <LoyaltyPanel />
      </TabsContent>

      <TabsContent value="profile">
        <Card className="border-[var(--color-mist-400)]">
          <CardHeader>
            <CardTitle className="font-display text-xl text-[var(--color-ink-900)]">
              Personal details
            </CardTitle>
            <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--color-ink-500)]">
              <span className="inline-flex items-center gap-1.5">
                <Mail className="size-3" /> {customer?.email}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Phone className="size-3" /> {customer?.phone}
              </span>
              <span>Member since {customer?.created_at ? format(parseISO(customer.created_at), "MMM yyyy") : "—"}</span>
            </p>
          </CardHeader>
          <CardContent className="px-6">
            <ProfilePanel customer={customer} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
