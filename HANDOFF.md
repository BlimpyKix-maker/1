# Apple Box — handoff notes

A film-industry life sim (Football Manager / Persona / Crusader Kings feel). One self-contained page, `index.html`,
published as a claude.ai artifact: https://claude.ai/artifact/8siqt3XdWb4DhTz4su2cMZ (declares the `sample`
capability for "Read the pages"). Work branch: `claude/cool-sagan-4jiu5s`.

## How it's built
- `index.html` (~2.8 MB) holds the world simulation, the film/people catalogue and the core UI.
- Game systems live in `src/*.js` and are **injected** into `index.html` between `// <name>` and `// </name>` markers by
  `python3 tools/build.py`. Edit `src/`, then rebuild. Order is listed in `tools/build.py`.
- Catalogue fill data: `data/fill/*.tsv` → `node tools/fill-build.js` → `src/cat-fill.js`.
- Fictionalised trivia: `node tools/fictionalise.js` → `src/fiction.js` (rewrites real names to in-game ones, drops
  lines naming anything real, swaps real awards/festivals for the game's own).

## Source map
| file | what |
|---|---|
| `src/career-sim.js` | career state (`S.me`), contacts, rolls (`roll`, `checkMods`), inbox, `closeWeek`, scenes resolver, `applyAct` dispatcher |
| `src/career-depth.js` | levels, job board depth, school, agencies (focus + style), life events |
| `src/life.js` | the diary: 7 days × morning/afternoon/evening blocks, `liveOn` (Next/End day/End week), energy, sleep |
| `src/life-scenes.js`, `src/life-scenes-more.js`, `src/life-scenes-third.js` | work scenes per job family (with `teach` notes), life scenes, interviews |
| `src/life-voice.js` | scripts: premise/notes, trait-driven writing, grades, sharing, contests |
| `src/life-city.js` | housing, vehicles, venues, commutes |
| `src/life-social.js` | phone (threads), appointments, invitations/favours, relationships (friend→close/partner/mentor/rival/ex), `relConditions` |
| `src/life-world.js` | NPC backstories + life events, world events (heatwave, strike, recession, tax credit…) |
| `src/life-deals.js` | options, green lights, job on your own film, producing (market + pitches), your company, investors, casting, festivals, awards night |
| `src/life-story.js` | milestones, résumé, timeline, year in review (`yearWeek`, `yearsHTML`) |
| `src/trivia.js` | Cinephile notes: curated (fictionalised) + generated trivia, revealed by Taste |
| `src/life-phone.js` | texting styles by personality, replies and conversations |
| `src/computer.js` | the desk computer: mail, CrewList, trades, GEA search, bank, Flick, notes, Clapper Sweep |
| `src/city-plus.js` | 26 venues in categories, weekly what's-on, weekend trips |
| `src/real-looks.js` | `REAL_LOOKS`: faces for famous real-based people (keyed by hidden real name; compact codes) |
| `src/gea.js` | the archive: posters, stills, trailers, loglines, full credits, bios |
| `src/press.js` | trade press articles |
| `src/companies.js` | company terminal: valuation, share price history, structure, logo, lore |
| `src/strategy.js` | company departments, release strategy, reputation flags, Awards screen |
| `src/career-ui.js` | all career screens; desk tabs (Today/Your week/Phone/Work/Create/Life/People), forms, space bar, "Read the pages" |

## Rules that keep it working
- **Determinism.** The world uses `rnd()` (seeded); the player uses `prnd()` (`S.me.rng`). A save is the seed + a log
  of actions (`doAct` → `applyAct`); loading replays the log. So: every state change must happen inside an action
  in `applyAct`; **rendering must never call `rnd()`/`prnd()`**; any UI randomness must be passed into the logged
  action. Save version is in `saveCareer`/`loadSave` (bump it when old logs would replay differently).
- **One global namespace.** All files share one script; never reuse a top-level name. Check:
  `grep -oE "^(const|function|let|var) [A-Za-z_$][A-Za-z0-9_$]*" index.html | awk '{print $2}' | sort | uniq -d`
- New clickable `data-*` attributes must be added to `CAREER_CLICKS` in `career-ui.js`.
- Scenes: `{ id, title, text, teach, opts: [{ k, label, check: [stat, dc], ok: {...}, bad: {...}, t, tb }] }`.
  Effect keys: tie, trust, tag, due, stand, stress, energy, cash, xp, shadow, risk, fire, fame, refs, meet, script,
  rel, cohab. Hard checks (DC > 12) scale rewards up.
- Money: player cash in dollars (`usd()` adjusts for place and era); companies/films in the world's millions.
- Nothing about real films/people should be shown as fact; real titles survive only as hidden search aliases.

## Tests (run all before publishing)
```
python3 tools/build.py
node tools/playtest.js 60          # bot career; must print "replayed … IDENTICAL"
node tools/fuzz.js 5 60            # random careers; every line must say "ok"
NODE_PATH=$(npm root -g) node tools/uitest.js <outdir>   # Playwright; needs "SAVE OK", overflow 0
```

## Recent balance decisions
- Script grades compress above 72; first drafts land around C, rewrites lift them.
- Options mostly lapse (~0.2–1%/week greenlight chance); writer fee 1.2% of budget, capped.
- Producing: one pitch a week, each company says yes to you at most once a year.
- Player company is exempt from the world's monthly overhead; pays a small weekly office cost instead.
- Investors: you put in ≥25%; Finance roll; they take a share of returns; 4-week wait after a no.

## Ideas queue (after the big notes pass)
- `REAL_LOOKS` covers ~230 famous names; extend it for more (codes documented at the top of the file). The dead are drawn at ≤50.
- People and studios use deliberate parody names ("Harrison Fjord"); only exact real names were removed (YRF, agencies).
- Done: festival bids are split into home-market and international rights, settled per territory.

1. Done: hire DP, editor, composer, production designer; 'Your regulars' panel on the People tab.
2. Done: festival selections bring distributor bids (advance + share, settled after release); the 'parent' background links you into a real family and gives a hiring edge. Careers screen runs job text through `deReal()` to hide real employers/unions.
3. Done: `workCost()` (shooting days, seniority, two jobs) and the grind (`M.grind`: consecutive working weeks without a light week → stress, 'Worn down' condition at 12; trips reset; autopilot protects evenings at 8). Probe: scratch `diff.js`-style bot comparing employed vs idle weeks.
4. Done for world events: most events carry a choice scene (`EV_SCENES` in life-world.js, `scene:` key on WORLD_EVENTS; `needs: 'friend'` picks a friend by week number, no dice). Job families now have 5–11 scenes each (third reel in life-scenes-third.js).
5. Done: fictionalise.js never swaps place/common words (ALLOW) or after 'Mount', and drops lines where a swap is glued to another name. 129 fake titles that equalled or contained a real title were retitled (catalogue + data/fill).
