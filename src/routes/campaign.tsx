import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Download, Film, Presentation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CapsuleMark } from "@/components/capsule-mark";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/campaign")({
  component: Campaign,
});

const SLIDES = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

const CAPTIONS = [
  "The black box for your real life.",
  "The moments nobody knows will matter until they do.",
  "Not a tracker. Not a panic app. A black box.",
  "Prevent · Detect · Preserve · Escalate · Reconstruct.",
  "Authorize a session. Guardian records facts — not danger.",
  "Original evidence. Observed events. Never a verdict.",
  "Your circle. Your protocol. Including dead-man escrow.",
  "PIN, phrase, gesture. Decoy calculator. Covert by design.",
  "Start a Guardian Session. Keep the record original.",
];

function Campaign() {
  const [mode, setMode] = useState<"deck" | "reel">("deck");
  const [i, setI] = useState(0);

  useEffect(() => {
    if (mode !== "deck") return;

    const onKey = (event: KeyboardEvent) => {
      const target = event.target;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        (target instanceof HTMLElement && target.isContentEditable)
      ) {
        return;
      }

      if (event.key === "ArrowRight") {
        setI((current) => Math.min(SLIDES.length - 1, current + 1));
      } else if (event.key === "ArrowLeft") {
        setI((current) => Math.max(0, current - 1));
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode]);

  const previousSlide = () => setI((current) => Math.max(0, current - 1));
  const nextSlide = () =>
    setI((current) => Math.min(SLIDES.length - 1, current + 1));

  return (
    <div className="flex min-h-dvh flex-col bg-bg text-fg">
      <header className="flex items-center justify-between gap-3 px-4 py-3 md:px-6">
        <Link to="/" className="flex h-11 items-center gap-2 text-sm text-muted hover:text-fg">
          <CapsuleMark className="size-6" />
          <span className="hidden sm:inline">GuardianOS</span>
        </Link>
        <div
          className="flex rounded-full bg-elevated p-1 shadow-[var(--shadow-border)]"
          role="group"
          aria-label="Campaign format"
        >
          <button
            type="button"
            aria-pressed={mode === "deck"}
            className={cn(
              "flex h-11 items-center gap-1.5 rounded-full px-4 text-xs",
              mode === "deck" ? "bg-surface text-fg" : "text-muted",
            )}
            onClick={() => setMode("deck")}
          >
            <Presentation className="size-3.5" />
            Deck
          </button>
          <button
            type="button"
            aria-pressed={mode === "reel"}
            className={cn(
              "flex h-11 items-center gap-1.5 rounded-full px-4 text-xs",
              mode === "reel" ? "bg-surface text-fg" : "text-muted",
            )}
            onClick={() => setMode("reel")}
          >
            <Film className="size-3.5" />
            Reel
          </button>
        </div>
        <Button asChild size="sm" variant="secondary">
          <a href="/campaign/GuardianOS-campaign.pptx" download>
            <Download className="size-3.5" />
            PPTX
          </a>
        </Button>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-3 pb-6">
        {mode === "deck" ? (
          <>
            <button
              type="button"
              className="relative w-full max-w-6xl overflow-hidden rounded-lg bg-black shadow-[var(--shadow-border)] disabled:cursor-default"
              onClick={nextSlide}
              aria-label={i === SLIDES.length - 1 ? "Final slide" : "Next slide"}
              disabled={i === SLIDES.length - 1}
            >
              <img
                src={`/campaign/s${SLIDES[i]}.png`}
                alt={`GuardianOS briefing slide ${SLIDES[i]} of ${SLIDES.length}`}
                className="aspect-video w-full object-contain"
              />
            </button>
            <p className="mt-4 max-w-xl text-center text-sm text-muted">
              {CAPTIONS[i]}
            </p>
            <div className="mt-3 flex items-center gap-3">
              <Button
                size="icon"
                variant="secondary"
                aria-label="Previous slide"
                disabled={i === 0}
                onClick={previousSlide}
              >
                <ChevronLeft className="size-4" />
              </Button>
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  {SLIDES.map((slide, index) => (
                    <button
                      key={slide}
                      type="button"
                      aria-label={`Show slide ${slide}`}
                      aria-current={index === i ? "true" : undefined}
                      className={cn(
                        "h-11 min-w-3 px-0.5",
                        index === i ? "w-8" : "w-3",
                      )}
                      onClick={() => setI(index)}
                    >
                      <span
                        className={cn(
                          "block h-1.5 rounded-full transition-[width,background-color] duration-150",
                          index === i ? "w-6 bg-accent" : "w-2 bg-border",
                        )}
                      />
                    </button>
                  ))}
                </div>
                <span className="tabular-nums text-xs text-subtle" aria-live="polite">
                  {String(i + 1).padStart(2, "0")} /{" "}
                  {String(SLIDES.length).padStart(2, "0")}
                </span>
              </div>
              <Button
                size="icon"
                variant="secondary"
                aria-label="Next slide"
                disabled={i === SLIDES.length - 1}
                onClick={nextSlide}
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
            <p className="mt-3 text-[11px] tracking-[0.16em] text-subtle uppercase">
              Arrow keys or tap the frame
            </p>
          </>
        ) : (
          <div className="w-full max-w-sm space-y-3">
            <div className="overflow-hidden rounded-xl bg-black shadow-[var(--shadow-border)]">
              <video
                className="aspect-[9/16] w-full"
                src="/campaign/GuardianOS-campaign-reel.mp4"
                controls
                playsInline
                preload="metadata"
                poster="/campaign/poster.png"
              >
                Your browser does not support embedded video.
              </video>
            </div>
            <Button asChild variant="secondary" className="w-full">
              <a href="/campaign/GuardianOS-campaign-reel.mp4" download>
                <Download className="size-3.5" />
                Download reel
              </a>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
