# Sources and terms

Everything the game is built from that came from outside this project, and on what terms. Audit item L12. The
licence for the game itself (`LICENSE`) is the owner's decision and is not set here.

## Shipped inside the page

| What | Where it comes from | Terms | Where it lives |
|---|---|---|---|
| Barlow Condensed (500–700) and Barlow (400–600, 400 italic) | The Barlow Project Authors, packaged by Fontsource 5.3.0 (npm) | SIL Open Font License 1.1 | `assets/fonts.css` (base64 woff2), licence text in `assets/FONT-LICENSES.txt` |
| IBM Plex Mono (400, 500) | IBM Corp., packaged by Fontsource 5.3.0 (npm) | SIL Open Font License 1.1 | as above |

The fonts are embedded at build time (`tools/build.py`), so the page makes no outside requests; `tools/rendertest.js`
fails if it ever does. No third-party code libraries are shipped in the page.

## Used for calibration (numbers only, never text)

The economics of each field are tuned against public reports and trade sources. Every figure used, with its URL,
is in `docs/RESEARCH.md`, round by round; Round 19 covers television, music, podcasts, online video, theatre and
boards. Figures marked [U] there are unverified. Only numbers were taken from these sources: no wording, names or
slogans. They were read once by researchers during development; the game never contacts them.

## The film-history catalogue

Films, people, studios and their histories from 1888 on are compiled from general knowledge and public reference
works. In the game:

- every film title, person, studio, festival, prize and brand is invented or renamed (the rules are in `HANDOFF.md`
  and `data/rename/`);
- each catalogue entry keeps its original title or name in a `real:` field so the data can be checked; that field is
  never displayed, and `tools/blocklist.js` scans the built page for real names in anything that is;
- the original reference notes are kept out of the page in `data/catalogue-notes.json`; the page carries only the
  rewritten versions in `src/fiction.js` (`tools/fictionalise.js`);
- synopses, taglines and lines of dialogue are written for the game; copies of real taglines and dialogue were
  rewritten in Round 19 (audit L9);
- people who are alive get no negative traits, scandals or simulated deaths, and no lookalike portraits
  (`src/safety.js`, `tools/safetytest.js`).

## Job titles and pay bands

Job titles, duties and pay bands were researched from public job postings and crew references (2026). Employer
names are not kept (`JOBS.sources` in `index.html`).

## AI

- **During play:** one optional feature, "Read the pages", asks an AI model to write a few pages of the player's
  script. It is labelled as AI-written, the player can turn it off, and a store build drops it entirely
  (`python3 tools/build.py --no-ai`). Nothing else calls a model while the game runs.
- **Authorship:** the code, data and text were written with an AI coding assistant over many sessions, directed and
  reviewed by the owner. `handoff/conversation-log.md` and `handoff/your-requests.md` are the record. How this is
  disclosed on a store page is the owner's decision.

## Deliberately not used

- No real person's likeness for anyone alive.
- No real award, festival, company, platform, brand, slogan, tagline or quote in anything shown.
- No data fetched at run time; anything gathered from outside is fetched once at build time and committed.
