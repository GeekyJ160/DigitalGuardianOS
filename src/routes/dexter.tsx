import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LineChart, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { runDexterResearch } from "@/lib/guardian/dexter";
import { useGuardianStore } from "@/lib/guardian/store";
import { cn, formatDateTime } from "@/lib/utils";

export const Route = createFileRoute("/dexter")({
  component: DexterDesk,
});

const STARTERS = [
  "AAPL DCF snapshot vs current price",
  "NVDA last two quarters: revenue, FCF, margins",
  "Is TSLA cash flow covering capex this year?",
];

const WORKFLOW = [
  "Plan 3–6 research steps",
  "Pull live price, filings, news",
  "Validate figures against sources",
  "Write the memo",
];

function DexterDesk() {
  const memos = useGuardianStore((s) => s.dexterMemos ?? []);
  const saveDexterMemo = useGuardianStore((s) => s.saveDexterMemo);
  const removeDexterMemo = useGuardianStore((s) => s.removeDexterMemo);
  const [query, setQuery] = useState("");
  const [working, setWorking] = useState(false);
  const [phase, setPhase] = useState(0);
  const [activeId, setActiveId] = useState<string | null>(memos[0]?.id ?? null);
  const active = memos.find((m) => m.id === activeId) ?? memos[0] ?? null;

  useEffect(() => {
    if (!working) {
      setPhase(0);
      return;
    }
    setPhase(0);
    const timers = [900, 2400, 9000].map((ms, i) =>
      window.setTimeout(() => setPhase(i + 1), ms),
    );
    return () => timers.forEach(clearTimeout);
  }, [working]);

  const run = async (q: string) => {
    const next = q.trim();
    if (!next || working) return;
    setWorking(true);
    try {
      const res = await runDexterResearch({ data: { query: next } });
      if (!res.ok) {
        toast(res.error);
        return;
      }
      const id = saveDexterMemo({
        query: next,
        memo: res.memo,
        citations: res.citations,
      });
      setActiveId(id);
      setQuery("");
    } catch {
      toast("Dexter could not finish this brief.");
    } finally {
      setWorking(false);
    }
  };

  return (
    <div className="stagger-in space-y-6">
      <header className="space-y-2">
        <p className="text-xs tracking-[0.2em] text-subtle uppercase">
          Dexter skill · active
        </p>
        <h1 className="font-display text-3xl tracking-tight">
          Financial research desk
        </h1>
        <p className="max-w-xl text-sm text-muted">
          Dexter plans the work, searches live sources, checks its own numbers,
          and writes a memo. Educational research only — not advice.
        </p>
      </header>

      <Card className="space-y-3 p-5">
        <label htmlFor="dexter-q" className="text-xs font-medium text-muted">
          Research question
        </label>
        <Textarea
          id="dexter-q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What is MSFT worth on free cash flow?"
          className="min-h-24"
          disabled={working}
        />
        <div className="flex flex-wrap gap-2">
          {STARTERS.map((s) => (
            <button
              key={s}
              type="button"
              disabled={working}
              className="h-11 rounded-full bg-elevated px-3 text-xs text-muted shadow-[var(--shadow-border)] hover:text-fg disabled:opacity-50"
              onClick={() => setQuery(s)}
            >
              {s}
            </button>
          ))}
        </div>
        <Button
          onClick={() => void run(query)}
          disabled={working || !query.trim()}
        >
          <LineChart className="size-4" />
          {working ? "Dexter is researching…" : "Run Dexter"}
        </Button>
      </Card>

      {working ? (
        <Card className="p-5" aria-live="polite" aria-busy="true">
          <p className="text-xs tracking-[0.16em] text-live uppercase">
            Live search in progress
          </p>
          <h2 className="mt-2 font-display text-2xl tracking-tight">
            Dexter is working the brief
          </h2>
          <p className="mt-1 text-sm text-muted">
            Plan → search → validate → memo. This usually takes under a minute.
          </p>
          <ol className="mt-4 space-y-2">
            {WORKFLOW.map((step, i) => (
              <li
                key={step}
                className={cn(
                  "flex items-center gap-3 text-sm",
                  i < phase
                    ? "text-ok"
                    : i === phase
                      ? "text-fg"
                      : "text-subtle",
                )}
              >
                <span
                  className={cn(
                    "size-1.5 shrink-0 rounded-full",
                    i < phase
                      ? "bg-ok"
                      : i === phase
                        ? "bg-live live-dot"
                        : "bg-border",
                  )}
                />
                {step}
              </li>
            ))}
          </ol>
        </Card>
      ) : active ? (
        <Card className="p-5">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-medium">{active.query}</h2>
              <p className="text-xs text-subtle">
                {formatDateTime(active.createdAt)}
              </p>
            </div>
            <Button
              size="icon-sm"
              variant="ghost"
              aria-label="Remove memo"
              onClick={() => {
                removeDexterMemo(active.id);
                setActiveId(null);
              }}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
          <pre className="overflow-x-auto font-sans text-sm leading-relaxed whitespace-pre-wrap text-fg">
            {active.memo}
          </pre>
          {active.citations.length > 0 ? (
            <ul className="mt-4 space-y-1 border-t border-border pt-3">
              {active.citations.map((c) => (
                <li key={c} className="truncate text-xs">
                  <a
                    href={c}
                    target="_blank"
                    rel="noreferrer"
                    className="text-muted hover:text-fg"
                  >
                    {c}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </Card>
      ) : (
        <p className="text-sm text-muted">
          No memos yet. Ask a ticker, a filing, or a valuation question.
        </p>
      )}

      {memos.length > 1 ? (
        <section className="space-y-2">
          <h2 className="text-sm font-medium">Prior briefs</h2>
          <ul className="space-y-2">
            {memos
              .filter((m) => m.id !== active?.id)
              .map((m) => (
                <li key={m.id}>
                  <button
                    type="button"
                    className="min-h-11 w-full rounded-lg bg-surface px-4 py-3 text-left text-sm shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]"
                    onClick={() => setActiveId(m.id)}
                  >
                    <span className="text-fg">{m.query}</span>
                    <span className="mt-1 block text-xs text-subtle">
                      {formatDateTime(m.createdAt)}
                    </span>
                  </button>
                </li>
              ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
