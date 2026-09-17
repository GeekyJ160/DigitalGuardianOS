import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { AppShell } from "@/components/app-shell";
import { CapsuleMark } from "@/components/capsule-mark";
import { GuardianRuntime } from "@/components/guardian-runtime";
import { Onboarding } from "@/components/onboarding";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useGuardianStore } from "@/lib/guardian/store";
import appCss from "../styles.css?url";

const APP_NAME = "GuardianOS";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      { name: "theme-color", content: "#0a0b0d" },
      {
        name: "description",
        content: "Stay protected. Preserve the truth.",
      },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
    ],
  }),
  component: Root,
});

function Root() {
  return (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="bg-bg text-fg">
        <PreviewHostBridge />
        <AuthProvider>
          <TooltipProvider>
            <Boot>
              <Outlet />
            </Boot>
          </TooltipProvider>
        </AuthProvider>
        <Toaster />
        <Scripts />
      </body>
    </html>
  );
}

function Boot({ children }: { children: React.ReactNode }) {
  const onboarded = useGuardianStore((s) => s.onboarded);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const done = () => setReady(true);
    const unsub = useGuardianStore.persist.onFinishHydration(done);
    if (useGuardianStore.persist.hasHydrated()) done();
    const t = window.setTimeout(done, 120);
    return () => {
      unsub();
      window.clearTimeout(t);
    };
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-bg text-fg">
        <CapsuleMark className="size-10" />
        <p className="text-xs tracking-[0.22em] text-muted uppercase">
          GuardianOS
        </p>
      </div>
    );
  }

  if (!onboarded) return <Onboarding />;

  return (
    <>
      <GuardianRuntime />
      <AppShell>{children}</AppShell>
    </>
  );
}
