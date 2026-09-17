import { useEffect, useRef } from "react";
import { useGuardianStore } from "@/lib/guardian/store";

function sequenceMatch(buf: string[], target: string[]) {
  if (buf.length < target.length) return false;
  const slice = buf.slice(-target.length);
  return slice.every((k, i) => k === target[i]);
}

export function GuardianRuntime() {
  const tick = useGuardianStore((s) => s.tick);
  const triggerCovert = useGuardianStore((s) => s.triggerCovert);
  const volumeGesture = useGuardianStore((s) => s.triggers.volumeGesture);
  const phrase = useGuardianStore((s) => s.triggers.voicePhrase);
  const keys = useRef<string[]>([]);
  const hold = useRef<number | null>(null);
  const typed = useRef("");

  useEffect(() => {
    const id = window.setInterval(() => tick(), 1000);
    return () => window.clearInterval(id);
  }, [tick]);

  useEffect(() => {
    if (!volumeGesture) return;

    const onDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        keys.current = [...keys.current, e.key].slice(-6);
        if (e.key === "ArrowUp") {
          hold.current = window.setTimeout(() => {
            if (sequenceMatch(keys.current, ["ArrowUp", "ArrowDown", "ArrowUp"])) {
              triggerCovert("gesture");
              keys.current = [];
            }
          }, 700);
        }
      }

      if (e.key.length === 1) {
        typed.current = (typed.current + e.key).slice(-80);
        if (
          phrase &&
          typed.current.toLowerCase().includes(phrase.toLowerCase())
        ) {
          triggerCovert("phrase");
          typed.current = "";
        }
      }
    };
    const onUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" && hold.current) {
        window.clearTimeout(hold.current);
        hold.current = null;
      }
    };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, [volumeGesture, phrase, triggerCovert]);

  return null;
}
