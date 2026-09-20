import { Link, useRouterState } from "@tanstack/react-router";
import {
  Fingerprint,
  Home,
  LineChart,
  Lock,
  Radio,
  ScrollText,
  Users,
} from "lucide-react";
import { CapsuleMark } from "@/components/capsule-mark";
import { useActiveSession, useGuardianStore } from "@/lib/guardian/store";
import { cn } from "@/lib/utils";

type NavItem = {
  to: "/" | "/session/new" | "/capsules" | "/circle" | "/protocol" | "/dexter";
  label: string;
  icon: typeof Home;
  match: (p: string) => boolean;
  liveTo?: boolean;
};

const NAV: NavItem[] = [
  { to: "/", label: "Home", icon: Home, match: (p) => p === "/" },
  {
    to: "/session/new",
    label: "Session",
    icon: Radio,
    match: (p) => p.startsWith("/session"),
    liveTo: true,
  },
  {
    to: "/capsules",
    label: "Vault",
    icon: Lock,
    match: (p) => p.startsWith("/capsules") || p.startsWith("/verify"),
  },
  {
    to: "/circle",
    label: "Circle",
    icon: Users,
    match: (p) => p.startsWith("/circle"),
  },
  {
    to: "/dexter",
    label: "Dexter",
    icon: LineChart,
    match: (p) => p.startsWith("/dexter"),
  },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const session = useActiveSession();
  const liveId = useGuardianStore((s) => s.activeSessionId);

  if (path === "/decoy" || path === "/campaign") return <>{children}</>;

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-56 flex-col border-r border-border bg-surface px-3 py-5 md:flex">
        <Link to="/" className="mb-8 flex items-center gap-2 px-2">
          <CapsuleMark className="size-7" live={Boolean(session)} />
          <div>
            <div className="text-sm font-medium tracking-tight">GuardianOS</div>
            <div className="text-[10px] tracking-[0.16em] text-subtle uppercase">
              {session ? "Recording" : "Standby"}
            </div>
          </div>
        </Link>
        <nav className="flex flex-1 flex-col gap-1">
          {NAV.map((item) => {
            const active = item.match(path);
            const Icon = item.icon;
            if (item.liveTo && liveId) {
              return (
                <Link
                  key={item.label}
                  to="/session/$id"
                  params={{ id: liveId }}
                  className={cn(
                    "flex h-11 items-center gap-3 rounded-md px-3 text-sm transition-colors duration-150",
                    active
                      ? "bg-elevated text-fg shadow-[var(--shadow-border)]"
                      : "text-muted hover:bg-elevated hover:text-fg",
                  )}
                >
                  <Icon className="size-4" />
                  {item.label}
                  <span className="ml-auto size-1.5 rounded-full bg-live live-dot" />
                </Link>
              );
            }
            return (
              <Link
                key={item.label}
                to={item.to}
                className={cn(
                  "flex h-11 items-center gap-3 rounded-md px-3 text-sm transition-colors duration-150",
                  active
                    ? "bg-elevated text-fg shadow-[var(--shadow-border)]"
                    : "text-muted hover:bg-elevated hover:text-fg",
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto space-y-1">
          <Link
            to="/protocol"
            className={cn(
              "flex h-11 items-center gap-3 rounded-md px-3 text-sm",
              path.startsWith("/protocol")
                ? "bg-elevated text-fg shadow-[var(--shadow-border)]"
                : "text-muted hover:bg-elevated hover:text-fg",
            )}
          >
            <ScrollText className="size-4" />
            Protocol
          </Link>
          <Link
            to="/triggers"
            className={cn(
              "flex h-11 items-center gap-3 rounded-md px-3 text-sm",
              path.startsWith("/triggers")
                ? "bg-elevated text-fg shadow-[var(--shadow-border)]"
                : "text-muted hover:bg-elevated hover:text-fg",
            )}
          >
            <Fingerprint className="size-4" />
            Triggers
          </Link>
        </div>
      </aside>

      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-bg/90 px-4 py-3 backdrop-blur-sm md:hidden">
        <Link to="/" className="flex items-center gap-2">
          <CapsuleMark className="size-6" live={Boolean(session)} />
          <span className="text-sm font-medium">GuardianOS</span>
        </Link>
        <span className="flex items-center gap-2 text-[10px] tracking-[0.16em] text-subtle uppercase">
          {session ? (
            <>
              <span className="size-1.5 rounded-full bg-live live-dot" />
              Recording
            </>
          ) : (
            "Standby"
          )}
        </span>
      </header>

      <main className="md:pl-56">
        <div className="mx-auto w-full max-w-5xl px-4 pt-5 pb-28 md:px-8 md:pb-12">
          {children}
        </div>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-border bg-surface/95 px-1 pt-1 pb-[max(0.4rem,env(safe-area-inset-bottom))] backdrop-blur-sm md:hidden">
        {NAV.map((item) => {
          const active = item.match(path);
          const Icon = item.icon;
          const className = cn(
            "flex h-12 min-h-11 flex-1 flex-col items-center justify-center gap-0.5 text-[10px] tracking-wide",
            active ? "text-fg" : "text-subtle",
          );
          const inner = (
            <>
              <span className="relative">
                <Icon className="size-4" />
                {item.liveTo && session ? (
                  <span className="absolute -top-0.5 -right-1 size-1.5 rounded-full bg-live" />
                ) : null}
              </span>
              {item.label}
            </>
          );
          if (item.liveTo && liveId) {
            return (
              <Link
                key={item.label}
                to="/session/$id"
                params={{ id: liveId }}
                className={className}
              >
                {inner}
              </Link>
            );
          }
          return (
            <Link key={item.label} to={item.to} className={className}>
              {inner}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
