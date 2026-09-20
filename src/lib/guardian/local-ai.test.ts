import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  assessFacts,
  buildChronology,
  replyToGuardian,
} from "./local-ai.ts";

describe("buildChronology", () => {
  it("writes observed-event lines without inference", () => {
    const text = buildChronology([
      { at: "10:42 PM", label: "Session started" },
      { at: "11:38 PM", label: "Scheduled check-in missed" },
    ]);
    assert.equal(
      text,
      "10:42 PM — Session started\n11:38 PM — Scheduled check-in missed",
    );
    assert.doesNotMatch(text, /abduct|danger|assault|guilty/i);
  });

  it("handles an empty record", () => {
    assert.equal(buildChronology([]), "No observed events were recorded.");
  });
});

describe("assessFacts", () => {
  it("lists measurable differences and asks if the user is okay", () => {
    const text = assessFacts({
      title: "Guardian Date — West 7th",
      expectedEnd: "Sat 11:30 PM",
      facts: [
        "Status: alert",
        "Route deviation: yes",
        "Missed check-ins: 2",
        "Online: no",
        "Battery: 12%",
      ],
    });
    assert.match(text, /Path no longer matches/);
    assert.match(text, /2 scheduled check-in/);
    assert.match(text, /offline/i);
    assert.match(text, /low band \(12%\)/);
    assert.match(text, /Are you okay\?/);
    assert.doesNotMatch(text, /you are unsafe|abduct|in danger/i);
  });
});

describe("replyToGuardian", () => {
  it("does not diagnose a date as unsafe", () => {
    const text = replyToGuardian("I have a Facebook date tonight");
    assert.match(text, /Date session/i);
    assert.doesNotMatch(text, /he is dangerous|you are in danger/i);
  });

  it("refuses to dispatch emergency services", () => {
    const text = replyToGuardian("I feel unsafe");
    assert.match(text, /does not dispatch 911/);
    assert.match(text, /local emergency services/);
  });
});
