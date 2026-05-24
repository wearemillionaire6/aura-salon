"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bell,
  Boxes,
  Calendar as CalendarIcon,
  ChartBar,
  Clock,
  DollarSign,
  FileText,
  Info,
  MessageSquare,
  Menu,
  Settings,
  Sparkles,
  Star,
  Tag,
  TrendingUp,
  Users,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { SectionHeader } from "@/components/layout/SectionHeader";
import {
  sidebarNav,
  type SidebarIconName,
} from "@/lib/admin-data";
import { cn } from "@/lib/utils";
import { DayCalendar } from "./DayCalendar";

const ICONS: Record<SidebarIconName, React.ComponentType<{ className?: string }>> = {
  Calendar: CalendarIcon,
  Tag: Tag,
  Users: Users,
  MessageSquare: MessageSquare,
  Boxes: Boxes,
  ChartBar: ChartBar,
  Settings: Settings,
};

const ACTIVITY_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  booking: CalendarIcon,
  walkin: Users,
  cancellation: FileText,
  lowstock: Boxes,
  review: Star,
};

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex h-full flex-col gap-1 p-3">
      <div className="mb-4 px-3 pt-2">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-xl tracking-tight text-[var(--color-ink-900)]"
        >
          <span className="inline-flex size-7 items-center justify-center rounded-full bg-[var(--color-terracotta-500)] text-[var(--color-primary-foreground)]">
            <Sparkles className="size-3.5" />
          </span>
          Aura
        </Link>
        <div className="mt-1 text-[10px] uppercase tracking-[0.22em] text-[var(--color-ink-500)]">
          Studio admin
        </div>
      </div>

      <div className="space-y-0.5">
        {sidebarNav.map((item) => {
          const Icon = ICONS[item.icon];
          const active = item.available && item.id === "calendar";
          return (
            <button
              key={item.id}
              type="button"
              disabled={!item.available}
              onClick={onNavigate}
              className={cn(
                "group flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                active &&
                  "bg-[var(--color-terracotta-500)]/12 font-medium text-[var(--color-terracotta-700)]",
                !active &&
                  item.available &&
                  "text-[var(--color-ink-700)] hover:bg-[var(--color-muted)]",
                !item.available &&
                  "cursor-not-allowed text-[var(--color-ink-500)]/70",
              )}
            >
              <span className="flex items-center gap-3">
                <Icon
                  className={cn(
                    "size-4",
                    active && "text-[var(--color-terracotta-700)]",
                  )}
                />
                {item.label}
              </span>
              {!item.available ? (
                <Badge
                  variant="outline"
                  className="border-[var(--color-border)] bg-transparent px-1.5 py-0 text-[9px] uppercase tracking-wider text-[var(--color-ink-500)]"
                >
                  Phase 2
                </Badge>
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="mt-auto rounded-md border border-[var(--color-border)] bg-[var(--color-muted)] p-3 text-xs text-[var(--color-ink-500)]">
        <div className="font-medium text-[var(--color-ink-700)]">
          Mock environment
        </div>
        <p className="mt-1 leading-relaxed">
          UI prototype only. Bookings, inventory, and reports are illustrative.
        </p>
      </div>
    </nav>
  );
}

interface KpiCardProps {
  label: string;
  value: string;
  sub?: string;
  Icon: React.ComponentType<{ className?: string }>;
}

function KpiCard({ label, value, sub, Icon }: KpiCardProps) {
  return (
    <Card className="gap-3 py-5">
      <CardHeader className="px-5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--color-ink-500)]">
            {label}
          </CardTitle>
          <span className="flex size-8 items-center justify-center rounded-md bg-[var(--color-muted)] text-[var(--color-ink-700)]">
            <Icon className="size-4" />
          </span>
        </div>
      </CardHeader>
      <CardContent className="px-5">
        <div className="font-display text-3xl text-[var(--color-ink-900)]">
          {value}
        </div>
        {sub ? (
          <div className="mt-0.5 text-xs text-[var(--color-ink-500)]">
            {sub}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

interface DashboardShellProps {
  kpis: {
    bookingsToday: number;
    revenueToday: number;
    occupancyPct: number;
    newClientsThisWeek: number;
  };
  todaysAppointments: any[];
  activityFeed: any[];
}

export function DashboardShell({ kpis, todaysAppointments, activityFeed }: DashboardShellProps) {
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
      {/* Live status banner */}
      <div className="flex items-center justify-center gap-2 border-b border-[var(--color-border)] bg-[var(--color-sage-400)]/10 px-4 py-2 text-xs text-[var(--color-sage-600)]">
        <Info className="size-3.5" />
        <span>
          Live dashboard — connected to real Supabase database.
        </span>
      </div>

      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 border-r border-[var(--color-border)] bg-[var(--color-card)] md:block">
          <SidebarNav />
        </aside>

        {/* Mobile drawer */}
        <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
          <SheetContent side="left" className="w-64 p-0">
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation</SheetTitle>
            </SheetHeader>
            <SidebarNav onNavigate={() => setDrawerOpen(false)} />
          </SheetContent>
        </Sheet>

        {/* Main */}
        <main className="min-w-0 flex-1">
          {/* Topbar */}
          <header className="flex items-center justify-between gap-3 border-b border-[var(--color-border)] bg-[var(--color-card)] px-5 py-4 sm:px-8">
            <div className="flex items-center gap-3">
              <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    aria-label="Open navigation"
                  >
                    <Menu className="size-5" />
                  </Button>
                </SheetTrigger>
              </Sheet>
              <div>
                <div className="text-[10px] uppercase tracking-[0.22em] text-[var(--color-ink-500)]">
                  Dashboard
                </div>
                <h1 className="font-display text-xl text-[var(--color-ink-900)] sm:text-2xl">
                  Today at Aura
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" aria-label="Notifications">
                <Bell className="size-4" />
              </Button>
              <div className="hidden items-center gap-2 sm:flex">
                <div className="flex size-9 items-center justify-center rounded-full bg-[var(--color-terracotta-500)] text-sm font-medium text-[var(--color-primary-foreground)]">
                  EV
                </div>
                <div className="hidden text-right lg:block">
                  <div className="text-xs font-medium text-[var(--color-ink-900)]">
                    Elena Vasquez
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-[var(--color-ink-500)]">
                    Owner
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="space-y-8 px-5 py-6 sm:px-8 sm:py-8">
            {/* KPI strip */}
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <KpiCard
                label="Bookings today"
                value={String(kpis.bookingsToday)}
                sub={`${todaysAppointments.length} on the books`}
                Icon={CalendarIcon}
              />
              <KpiCard
                label="Revenue today"
                value={`$${kpis.revenueToday.toLocaleString("en-US")}`}
                sub="Projected from booked services"
                Icon={DollarSign}
              />
              <KpiCard
                label="Occupancy"
                value={`${kpis.occupancyPct}%`}
                sub="Across 6 stylists"
                Icon={TrendingUp}
              />
              <KpiCard
                label="New clients · week"
                value={String(kpis.newClientsThisWeek)}
                sub="Acquired in the last 7 days"
                Icon={Users}
              />
            </section>

            {/* Calendar */}
            <section className="space-y-4">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <SectionHeader
                  eyebrow="Schedule"
                  title="Today · Friday May 22"
                  subtitle="Tap any block to check in or mark complete."
                />
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="border-[var(--color-terracotta-500)]/30 bg-[var(--color-terracotta-500)]/10 text-[var(--color-terracotta-700)]"
                  >
                    Hair
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-[var(--color-sage-400)]/40 bg-[var(--color-sage-400)]/15 text-[var(--color-sage-600)]"
                  >
                    Nails
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-[var(--color-mist-400)]/60 bg-[var(--color-mist-200)] text-[var(--color-ink-700)]"
                  >
                    Skin
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-[var(--color-bone-200)] bg-[var(--color-bone-200)] text-[var(--color-ink-700)]"
                  >
                    Spa
                  </Badge>
                </div>
              </div>

              <DayCalendar appointments={todaysAppointments} />
            </section>

            {/* Activity */}
            <section>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-display text-xl text-[var(--color-ink-900)]">
                      Recent activity
                    </CardTitle>
                    <span className="text-xs text-[var(--color-ink-500)]">
                      Last 24 hours
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="divide-y divide-[var(--color-border)]/60">
                    {activityFeed.map((item) => {
                      const Icon = ACTIVITY_ICONS[item.type] ?? FileText;
                      return (
                        <li
                          key={item.id}
                          className="flex items-start gap-3 py-3 first:pt-0 last:pb-0"
                        >
                          <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-muted)] text-[var(--color-ink-700)]">
                            <Icon className="size-3.5" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm text-[var(--color-ink-900)]">
                              {item.msg}
                            </div>
                            <div className="mt-0.5 flex items-center gap-1 text-[10px] uppercase tracking-wider text-[var(--color-ink-500)]">
                              <Clock className="size-3" />
                              {item.ts}
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                  <Separator className="my-4" />
                  <div className="flex items-center justify-between text-xs text-[var(--color-ink-500)]">
                    <span>Showing {activityFeed.length} recent event{activityFeed.length === 1 ? "" : "s"}</span>
                    <Button variant="link" className="h-auto p-0 text-xs">
                      View full log
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
