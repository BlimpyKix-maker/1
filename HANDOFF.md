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
| `src/life-scenes.js`, `src/life-scenes-more.js` | work scenes per job family (with `teach` notes), life scenes, interviews |
| `src/life-voice.js` | scripts: premise/notes, trait-driven writing, grades, sharing, contests |
| `src/life-city.js` | housing, vehicles, venues, commutes |
| `src/life-social.js` | phone (threads), appointments, invitations/favours, relationships (friend→close/partner/mentor/rival/ex), `relConditions` |
| `src/life-world.js` | NPC backstories + life events, world events (heatwave, strike, recession, tax credit…) |
| `src/life-deals.js` | options, green lights, job on your own film, producing (market + pitches), your company, investors, casting, festivals, awards night |
| `src/life-story.js` | milestones, résumé, timeline |
| `src/trivia.js` | Cinephile notes: curated (fictionalised) + generated trivia, revealed by Taste |
| `src/life-phone.js` | texting styles by personality, replies and conversations |
| `src/computer.js` | the desk computer: mail, CrewList, trades, GEA search, bank, Flick, notes, Clapper Sweep |
| `src/city-plus.js` | 26 venues in categories, weekly what's-on, weekend trips |
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
- Avatars for real-world counterparts don't resemble the real people yet: would need a per-person look table (hair, skin, glasses, beard) for the famous names.
- A few catalogue names are still close to real ones (e.g. a studio called "YRF Films"); run a rename pass on studios and people.
- Distributors bidding for your films at festivals; hiring a composer and production designer; a troupe page.
- Player-side family background (born into the business) as a character-creation option.

1. Hire your own crew (DP, editor, composer) when producing/directing; a "troupe" of regulars who want to work with you again.
2. Sell your company's films to distributors at festivals (bids, territories).
3. Gentle difficulty tuning: energy/stress feel easy for steady jobs.
4. More scenes per job family and more NPC life events; more world events with choices.
5. Spot-check `src/fiction.js` for any real reference that slipped through.
