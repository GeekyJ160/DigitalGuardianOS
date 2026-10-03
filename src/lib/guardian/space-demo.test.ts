import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { recordSpaceSos, sealSpaceDemo, startSpaceDemo } from "./space-demo.ts";

describe("public space demo", () => {
  it("starts a session without a location claim", () => {
    const session = startSpaceDemo("Downtown walk", 1_700_000_000_000);
    assert.equal(session.events[0]?.kind, "session_started");
    assert.match(session.events[0]?.detail ?? "", /Location is not recorded/);
    assert.equal(JSON.stringify(session).includes("lat"), false);
  });

  it("records SOS once and does not claim dispatch", () => {
    const session = startSpaceDemo("Downtown walk", 1_700_000_000_000);
    const once = recordSpaceSos(session, 1_700_000_060_000);
    const twice = recordSpaceSos(once, 1_700_000_120_000);
    const sos = twice.events.filter((event) => event.kind === "sos");
    assert.equal(sos.length, 1);
    assert.match(sos[0]?.detail ?? "", /not contacted/i);
    assert.equal(/dispatched help|calling 911/i.test(sos[0]?.detail ?? ""), false);
  });

  it("seals a device-local capsule with a fingerprint and no dispatch", () => {
    const session = recordSpaceSos(
      startSpaceDemo("Downtown walk", 1_700_000_000_000),
      1_700_000_060_000,
    );
    const capsule = sealSpaceDemo(session, 1_700_000_180_000);
    assert.equal(capsule.locationRecorded, false);
    assert.equal(capsule.dispatched, false);
    assert.equal(capsule.integrityHash.length, 64);
    assert.equal(capsule.events.some((event) => event.kind === "session_sealed"), true);
    assert.equal(capsule.events.some((event) => event.kind === "sos"), true);
  });
});
