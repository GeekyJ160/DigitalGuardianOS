import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Bot, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { askGuardian } from "@/lib/guardian/ai";
import { replyToGuardian } from "@/lib/guardian/local-ai";
import { useActiveSession, useGuardianStore } from "@/lib/guardian/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/ai")({
  component: GuardianAI,
});

const STARTERS = [
  "I'm meeting someone from an app tonight",
  "My phone is dying",
  "I missed a turn and feel lost",
  "I'm not comfortable",
];

type Message = { from: "ai" | "you"; text: string };

function GuardianAI() {
  const session = useActiveSession();
  const name = useGuardianStore((s) => s.displayName);
  const [input, setInput] = useState("");
  const [working, setWorking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      from: "ai",
      text: "I'm GuardianAI. I can help you prepare a session, explain verified device signals, and organize information for your Circle. I do not decide whether someone is in danger. This preview does not dispatch emergency services.",
    },
  ]);

  const ctx = {
    title: session?.title,
    destination: session?.destination,
    battery: session?.battery,
    active: Boolean(session),
  };

  const ask = async (raw: string) => {
    const text = raw.trim();
    if (!text || working) return;
    setWorking(true);
    setMessages((rows) => [...rows, { from: "you", text }]);
    setInput("");
    try {
      const res = await askGuardian({
        data: {
          text,
          title: ctx.title,
          destination: ctx.destination,
          battery: ctx.battery,
          active: ctx.active,
        },
      });
      const reply = res.ok ? res.text : replyToGuardian(text, ctx);
      setMessages((rows) => [...rows, { from: "ai", text: reply }]);
    } catch {
      setMessages((rows) => [
        ...rows,
        { from: "ai", text: replyToGuardian(text, ctx) },
      ]);
    } finally {
      setWorking(false);
    }
  };

  return (
    <div className="stagger-in space-y-6">
      <header className="space-y-2">
        <p className="text-xs tracking-[0.2em] text-subtle uppercase">
          GuardianAI
        </p>
        <h1 className="font-display text-3xl tracking-tight">
          {name ? `${name}, ask in facts.` : "Ask GuardianAI."}
        </h1>
        <p className="max-w-xl text-sm text-muted">
          Preparation, explanation, and coordination — not diagnosis, intent, or
          emergency decisions.
        </p>
      </header>

      <Card className="flex min-h-[28rem] flex-col p-5">
        <div className="flex-1 space-y-3 overflow-y-auto">
          {messages.map((m, i) => (
            <div
              key={`${m.from}-${i}`}
              className={cn(
                "max-w-[90%] rounded-xl px-3 py-2 text-sm",
                m.from === "you"
                  ? "ml-auto bg-accent text-accent-fg"
                  : "bg-elevated text-fg",
              )}
            >
              {m.from === "ai" ? (
                <p className="mb-1 flex items-center gap-1.5 text-[10px] tracking-[0.16em] text-subtle uppercase">
                  <Bot className="size-3" />
                  GuardianAI
                </p>
              ) : null}
              {m.text}
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {STARTERS.map((s) => (
            <button
              key={s}
              type="button"
              disabled={working}
              className="h-11 rounded-full bg-elevated px-3 text-xs text-muted shadow-[var(--shadow-border)] hover:text-fg disabled:opacity-50"
              onClick={() => void ask(s)}
            >
              {s}
            </button>
          ))}
        </div>
        <form
          className="mt-3 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            void ask(input);
          }}
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about a session, a signal, or a next step"
            className="min-h-16"
            disabled={working}
          />
          <Button type="submit" disabled={working || !input.trim()}>
            <Send className="size-4" />
            Ask
          </Button>
        </form>
      </Card>

      <div className="flex flex-wrap gap-2">
        <Button asChild>
          <Link to="/session/new">Start a session</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link to="/protocol">Review protocol</Link>
        </Button>
      </div>
    </div>
  );
}
