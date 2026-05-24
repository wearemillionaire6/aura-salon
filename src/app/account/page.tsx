import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/badge";
import { AccountTabs } from "./_components/AccountTabs";

export const metadata = { title: "My Account" };

export default function AccountPage() {
  return (
    <Container className="py-10 lg:py-16">
      <div className="mx-auto mb-8 max-w-3xl rounded-lg border border-[var(--color-mist-400)] bg-[var(--color-bone-100)] p-4 text-sm">
        <Badge variant="secondary" className="mr-2">
          Demo
        </Badge>
        Signed in as <strong>Jordan Cole</strong> — this is a mocked Phase-1 portal with no real backend.
      </div>
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-sans uppercase tracking-[0.22em] text-[var(--color-ink-500)]">
            My account
          </p>
          <h1 className="mt-2 font-display text-4xl text-[var(--color-ink-900)] sm:text-5xl">
            Welcome back, Jordan.
          </h1>
        </div>
      </div>
      <AccountTabs />
    </Container>
  );
}
