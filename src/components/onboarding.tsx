import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CapsuleMark } from "@/components/capsule-mark";
import { useGuardianStore } from "@/lib/guardian/store";

const STEPS = [
  {
    kicker: "The black box for your real life",
    title: "GuardianOS protects the moments nobody knows will matter until they do.",
    body: "It does not decide if you are in danger. It records authorized facts and recognizes the rules you wrote.",
  },
  {
    kicker: "Prevent · Detect · Preserve · Escalate · Reconstruct",
    title: "Every protected session writes a Guardian Capsule.",
    body: "Location, check-ins, connectivity, and notes stay original. Chronologies say “observed event,” never a verdict.",
  },
  {
    kicker: "Your circle. Your protocol.",
    title: "Stay protected. Preserve the truth.",
    body: "If a check-in is missed, Guardian follows only the protocol you authorized — including dead-man evidence escrow.",
  },
];

export function Onboarding() {
  const complete = useGuardianStore((s) => s.completeOnboarding);
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const current = STEPS[step];

  return (
    <div className="flex min-h-dvh flex-col bg-bg px-5 py-8 text-fg">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
        <div className="flex items-center gap-2 text-muted">
          <CapsuleMark className="size-6" />
          <span className="text-xs tracking-[0.22em] uppercase">GuardianOS</span>
        </div>
        <div className="stagger-in mt-auto mb-auto space-y-5 pt-16">
          <p className="text-xs tracking-[0.18em] text-live uppercase">
            {current.kicker}
          </p>
          <h1 className="font-display text-[2rem] leading-tight tracking-tight">
            {current.title}
          </h1>
          <p className="text-muted">{current.body}</p>
          {step === 2 && (
            <div className="space-y-2 pt-2">
              <label className="text-xs text-muted" htmlFor="display-name">
                What should Circle notices call you?
              </label>
              <Input
                id="display-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Optional"
                autoComplete="given-name"
              />
            </div>
          )}
        </div>
        <div className="flex items-center justify-between gap-3 pt-8">
          <div className="flex gap-1.5">
            {STEPS.map((_, i) => (
              <span
                key={i}
                className={
                  i === step
                    ? "h-1 w-6 rounded-full bg-accent"
                    : "h-1 w-3 rounded-full bg-border"
                }
              />
            ))}
          </div>
          {step < STEPS.length - 1 ? (
            <Button onClick={() => setStep((s) => s + 1)}>Continue</Button>
          ) : (
            <Button onClick={() => complete(name)}>Enter GuardianOS</Button>
          )}
        </div>
      </div>
    </div>
  );
}
