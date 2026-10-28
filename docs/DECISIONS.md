# Decisions

Standing decisions about what the game is. Each one says what was decided, who decided it, and what it commits
the code and the content to. A lawyer's review is still to come for the first one; until then it stands.

## 1. Real people, renamed, simulated forward (owner, October 2026)

**Decision.** The game's world is built from the real history of film and the other fields: real films, real
careers, real companies, under renamed (pun-on-meaning) names. From the year the player starts, everything that
happens is simulated: nothing after the start reflects what the real person did or will do.

**What it commits us to.**
- Every real person, company, festival, prize and brand appears under an invented name; the matching tables live in
  `data/rename/` (and `real:` fields) for checking only. `tools/blocklist.js` must report 0 real names in anything
  the page can show; `tools/rename-quality.js` must report 0 names too close to the real one.
- People still alive in reality are protected (`src/safety.js`, checked by `tools/safetytest.js`): no negative
  traits or events, no simulated death, no lookalike portrait. The dead are historical figures.
- History before the start may follow the record (credits, release years); after the start it may diverge freely.
- No real person's words: taglines, quotes and dialogue are the game's own (audit L9).

**Why the top of the industry used to freeze, and what keeps it moving.** Real legends start with real fame. The
world now ages them, lets breakouts and newcomers rise on merit (`src/world2.js`), and pays reputation for work
made in the simulation, so the top of the fame table turns over (probe target: at least 8 newcomers in the top 30
after 15 years; recent runs give 12–16).

**Open items (owner).** A lawyer's review of the approach. The repository is public for now, which exposes the
renaming tables; making it private is the owner's call, to be made before a public release.

## 2. Free release, no AI in the game (owner, Round 19; AI removed Round 25)

The game is free. The optional AI-written pages ("Read the pages") were removed in Round 25 at the owner's request:
the game no longer calls any model. Scripts, songs, plays, reviews and trailer lines are assembled from a hand-written
library committed with the game (`docs/WRITING-LIBRARY.md`), and the "Read it" button shows those pages.

## 3. Data from outside is fetched once and committed (Round 19–22)

The game never contacts the network. Research figures are recorded in `docs/RESEARCH.md`; the only machine-read
outside data is Wikidata's per-country film counts (`tools/wikidata_films.js` → `data/wikidata/`, CC0).
