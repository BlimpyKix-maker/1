# Apple Box

A career and management sim of the film industry (working title). The design doc lives in Claude Docs
("Industry — Game Design Doc"); this repo holds the playable prototype.

- `index.html`: the whole game, one self-contained page (also published as the "Apple Box World Core" artifact).
- `src/career-sim.js`, `src/career-ui.js`: phase 2, the player's career. Edit these, then run
  `python3 tools/build.py` to inject them into `index.html`.
- `tools/harness.js`: runs the simulation headlessly in Node.
- `tools/playtest.js [weeks] [depth]`: plays a career with a bot and checks that the save replays identically.
- `tools/uitest.js <outdir>`: drives the page in Chromium (Playwright) and takes screenshots.

## Status

- Phase 1, world core: done. Phase 3, catalogue (1888–2026): done.
- Phase 2, career: first playable. Character creator, the New Year's Eve party, a weekly schedule,
  a job board of tier 1–2 jobs drawn from films actually in production, on-set decisions, money,
  energy, stress, contacts with trust and favours, screen credits, and saves (seed plus action log,
  replayed on load).
