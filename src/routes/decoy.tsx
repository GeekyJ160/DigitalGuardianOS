import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useGuardianStore } from "@/lib/guardian/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/decoy")({
  component: DecoyCalculator,
});

const KEYS = [
  ["AC", "±", "%", "÷"],
  ["7", "8", "9", "×"],
  ["4", "5", "6", "−"],
  ["1", "2", "3", "+"],
  ["0", ".", "="],
];

function DecoyCalculator() {
  const pin = useGuardianStore((s) => s.triggers.pin);
  const triggerCovert = useGuardianStore((s) => s.triggerCovert);
  const active = useGuardianStore((s) => s.activeSessionId);
  const covert = useGuardianStore((s) => {
    const id = s.activeSessionId;
    if (!id) return false;
    return s.sessions.find((x) => x.id === id)?.covert ?? false;
  });
  const [display, setDisplay] = useState("0");
  const [armedHere, setArmedHere] = useState(false);

  const tap = (key: string) => {
    if (key === "AC") {
      setDisplay("0");
      return;
    }
    if (key === "=") {
      if (display.replace(/\D/g, "") === pin) {
        triggerCovert("pin");
        setArmedHere(true);
      }
      return;
    }
    if (["±", "%", "÷", "×", "−", "+"].includes(key)) {
      return;
    }
    setDisplay((d) => {
      const next = d === "0" && key !== "." ? key : d + key;
      const digits = next.replace(/\D/g, "");
      if (digits === pin && pin.length > 0) {
        triggerCovert("pin");
        setArmedHere(true);
      }
      return next.slice(0, 12);
    });
  };

  return (
    <div className="decoy-shell flex min-h-dvh flex-col">
      <div className="flex items-center justify-between px-5 pt-4">
        <span className="decoy-muted text-xs tracking-wide">Calculator</span>
        <span
          className={cn(
            "size-1.5 rounded-full",
            armedHere || covert ? "decoy-led" : "bg-transparent",
          )}
          aria-hidden
        />
      </div>
      <div className="flex flex-1 flex-col justify-end px-4 pb-6">
        <div className="mb-4 min-h-20 text-right text-6xl font-light tabular tracking-tight">
          {display}
        </div>
        <div className="grid grid-cols-4 gap-3">
          {KEYS.flatMap((row, ri) =>
            row.map((key) => {
              const op = ["÷", "×", "−", "+", "="].includes(key);
              const util = ["AC", "±", "%"].includes(key);
              const span = key === "0";
              return (
                <button
                  key={`${ri}-${key}`}
                  type="button"
                  onClick={() => tap(key)}
                  className={cn(
                    "h-16 rounded-full text-xl transition-transform duration-150 active:scale-[0.96]",
                    span && "col-span-2 px-7 text-left",
                    op ? "decoy-op" : util ? "decoy-util" : "decoy-key",
                  )}
                >
                  {key}
                </button>
              );
            }),
          )}
        </div>
      </div>
      {active && (armedHere || covert) ? (
        <span className="sr-only">Guardian is recording</span>
      ) : null}
    </div>
  );
}
