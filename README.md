# Apple Box

A career and management sim of the film industry (working title). The design doc lives in Claude Docs
("Industry — Game Design Doc"); this repo holds the playable prototype.

- `index.html`: the whole game, one self-contained page (also published as the "Apple Box World Core" artifact).
- `src/career-sim.js`, `src/career-ui.js`: phase 2, the player's career. `src/career-depth.js` adds the full job
  catalogue as listings, NPC job titles, school, agents and life events; `src/home.js` is the player's room and
  furniture; `src/portrait.js` draws faces and the wardrobe. `src/life.js` is the day engine (seven days of
  morning, day and evening; energy, sleep and conditions); `src/life-scenes.js` the job scenes for every career,
  interviews and days off; `src/life-voice.js` scripts, themes and taste; `src/life-city.js` housing, vehicles
  and venues; `src/life-story.js` the résumé and timeline.
- `tools/fuzz.js [careers] [weeks]`: lives random careers day by day with random choices and fails on any exception. Edit these, then run
  `python3 tools/build.py` to inject them into `index.html`.
- `tools/harness.js`: runs the simulation headlessly in Node.
- `tools/playtest.js [weeks] [depth]`: plays a career with a bot and checks that the save replays identically.
- `tools/uitest.js <outdir>`: drives the page in Chromium (Playwright) and takes screenshots.

Catalogue tools:

- `node tools/fill-build.js`: builds `src/cat-fill.js` (the filmography-completion batch) from `data/fill/`:
  `people.tsv`, `films-*.tsv` (missing films), `cast-*.tsv` (cast added to films already catalogued) and
  `facts-*.tsv` (trivia and rumours; `{Real Name}` shows a person's game name). Credits are written with
  real names and checked against the catalogue; run `build.py` afterwards.
- `node tools/credit-audit.js`: flags impossible credits (too young, after death, unknown people, duplicates,
  two directed in a year) in `data/audit/credits.tsv`, and thin filmographies in `data/audit/thin.tsv`.
- `node tools/rename-quality.js`: flags game names too close to the real ones, including padded surnames;
  deliberate puns are listed in `data/rename/puns-kept.txt`. `tools/rename-apply.py` applies `data/rename/*.tsv`.

## Status

- Phase 1, world core: done. Phase 3, catalogue (1888–2026): done.
- Phase 2, career: first playable. Character creator, the New Year's Eve party, a weekly schedule,
  a job board of tier 1–2 jobs drawn from films actually in production, on-set decisions, money,
  energy, stress, contacts with trust and favours, screen credits, and saves (seed plus action log,
  replayed on load).

**Picking this up on another account?** Start with [`handoff/START-HERE.md`](handoff/START-HERE.md), then [`HANDOFF.md`](HANDOFF.md).
