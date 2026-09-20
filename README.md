# GuardianOS

A prototype personal safety black box: authorize a session, record observed facts, notify a Circle you named, and seal a capsule. It does not decide if anyone is in danger, monitor you live, encrypt a cloud vault, or dispatch emergency services.

## What it does

- **Sessions** — Date, ride, showing, stay, nightlife, work, or custom windows with shortened preview timers.
- **Check-ins** — Prompt, confirm, or miss. Missed checks follow only the protocol you authorized.
- **Guardian Circle** — Named people, per-event permissions, a notice log.
- **Capsules** — Device-local records with event fingerprints and a fact-package export. Not encrypted cloud storage.
- **GuardianAI** — Prepares, explains, and reconstructs chronologies from labels. Falls back to on-device reconstruction if a model key is missing.
- **Covert triggers** — Phrase, decoy calculator PIN, key gesture, watch test. Preview-only.
- **SOS** — Records a demo event and tells you to call 911. Nothing is dispatched.

## Run

```bash
npm install
npm run dev
```

Preview binds `0.0.0.0:8080`. Capsules and Circle data persist in this browser via `localStorage`.

```bash
npm test
npm run typecheck
npm run build
```
