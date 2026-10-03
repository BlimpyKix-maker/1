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
| `src/feed.js` | the Feed desk tab: inbox, texts (grouped per person/week), trades stories that touch you, filters, sidebar |
| `src/job-tasks.js` | jobs as deliverables: `JOB_TASKS` per family, `jobTaskBlock` (per work block), `jobScore` → film `qBonus` weighted by tier (`TASK_WEIGHT`), `jobWorkHTML` |
| `src/consequence.js` | temperaments (`temperOf`), blackballing that spreads through circles, champions, `apologise`, `circleFactors` in hiring |
| `src/competitions.js` | `COMPS` (45 contests: major/industry/fun), `enterComp` rolls at entry, `compWeek` results, Contests tab |
| `src/cohort.js` | `pickCohort` (no dice), `cohortWeek` news, `cohortHTML` ranking |
| `src/campaign.js` | awards season Oct–Dec: `CAMPAIGN` moves add `f.camp`, which `nationalAwards` weighs |
| `src/life-scenes-low.js` | early-career scenes: commutes, hunting, mixers, coffees, hustle, classes, evenings, junior work |
| `src/clippings.js` | press about you (`pressAboutYou`, from `milestone`), `nextMoves` advisor (Feed sidebar), `AMBITIONS` ladder (Life tab) |
| `src/media.js` | non-film fields: `PLATFORMS` (Spinly, Vidwire, Blip, Podhaus, library, stage), `WORK_TYPES`, `startWork`/`makeSession`/`releaseWork`, weekly `mediaWeek` (units, pay gated by followers, label recoup, discovery-only follower growth), `portfolioHTML` (Create tab) |
| `src/media-industry.js` | `FIELD_JOBS` (into `ODD_JOBS`), `MEDIA_COS`, parody `MEDIA_LEGENDS` + generated `mediaFigures`, `chartFor`/`viewCharts` (Charts tab), `MEDIA_AWARDS` (January), field contests, `MEDIA_HISTORY` into `TRENDS` |
| `src/computer2.js` | computer apps: Mail (`mailWeek` offers: label deals, gigs, commissions), Ticker (`fieldIndex`, `tradeAct`), Studio (sequencer + podcast cutter), CutRoom, App Store (`SHOP`, `gearFor`), minigames; clicks in `computerClick` |
| `src/mentor.js` | mentors (`mentorCandidates`, `mentorAct` rolls Charisma, `mentorWeek(gain)`: lesson every 3 weeks, intro every 13, graduate at 104), `filmStoryHTML` (film page, own films), `industryYear`/`industryHTML` (stored on each `M.years` entry, shown in Your years) |
| `src/corrections.js` | splits directing duos into individuals (`DUOS`, `DUO_SOLO`, `DUO_FILMS`; films support `codir`), real studio chains of command `STUDIO_HEADS` (`headsOf`, `headsHTML`), renames a stray real festival |
| `src/cinema.js` | stills (`SC_DRAW` 33 settings, `actor()` drawn from the cast's looks, `frameOf`, `stillCaption`, `stillSVG(f, i, w, animated)`) and the moving trailer (`trailerPlan` segments, `playTrailer` with motion, flashes, score via `trailerAudio`, scrubbing) |
| `src/convo.js` | conversations: `msgTopic`, topic reply sets + `replyLabel`, own-words reading (`readIntent`, `answerOwn`: questions, invites booked via `freeSlot`, names, rudeness, echoed words), `ADVICE` with follow-ups, `convoWeek` |
| `src/situations.js` | ~120 job problems (`SITUATIONS`) across 22 families, registered as scenes with fix/ask/bold/colleague options and a teach line |
| `src/jobboard.js` | 22 more field jobs, `FIELD_GUIDE` duties pushed into `JOBS.jobs`, `postIndustry`, cross-industry `TRANSFER`/`fieldFactors`, board filters/sorting (`boardView`), sortable tables (`applyTableSorts`, called from `render`), `viewPost` (route `post:<id>`) |
| `src/schools.js` | `SCHOOLS` worldwide + per-hub college/university, `SCHOOL_PROGS`, `schoolProg(sc)` (used everywhere instead of `PROGRAMS[sc.prog]`), `applySchool` (action `school`), alumni `almaFactors`, browser in Life |
| `src/awardbodies.js` | national ceremony names `CEREMONY`/`ceremony(m)` (used by yearly awards), 107 award bodies with pages (route `award:<id>`), `filmAwardIndex`, the EGOF (`egofWins`, `egofWeek`, `egofHTML`) |
| `src/corporate.js` | 8-rung `LADDER` per company, staff from `hubStaff` (computed fresh, never cached, so sim and UI agree), `corpPosts`, promotions/headhunters/schemes as `corp` pending items (`corpPick`), NPC poaching (`S.poach`), secrets that leak |
| `src/standing.js` | Standing tab: 44 ambitions with claim (action `claimamb`) and pin (`pinamb`), reputation facets/radar/archetype/circles/quotes |
| `src/starmeter.js` | `starScore`/`starmeter`/`myStarRank`, GEA Starmeter tab, `starFactors`, brand endorsements by mail (`endorseWeek`), `marketApp` (Ticker), desktop `menuBar`/`desktopWidgets`/`WALLS` |
| `src/hub.js` | Today hub: `hubAlerts` (data-jump), quick actions, best fits with apply-best, inline text replies |
| `src/codex.js` | `CODEX` (16 fields × 9 lessons), learned by time (`codexWeek`), `codexFactors`, `codexHTML` on Standing |
| `src/autopilot.js` | Opt-out helpers for the early game: `autoBeforeStep` (apply for best fits, handle small scenes), `autoHTML` toggles, `rankedFits`, `jobRelevance`, party auto-play |
| `src/market.js` | The Bourse: cached prices `mktBar`/`mktPrice` (anchored to `companyWorth`), events, candles, `tradeAct` (action `trade`), `watchAct`, dividends in `stockWeek`, `marketApp` |
| `src/festivals.js` | `FEST_INFO` (24 festivals: rules, sections, prizes, statuette kinds), `festFits`, `festPeople` (directors, programmers, juries), `festWinners`/`festRecord`, `STATUETTES` SVGs, trophies (`trophyWeek`, `trophyAct` show/sell, `trophyShelfHTML`), `festivalPage` |
| `src/messaging.js` | Who texts you (`innerCircle`, `recentColleagues`), stakes texts (`STAKES`, `stakeText`, `stakeReply`, `stakesWeek`); `TOPICS` (22 ways to start a text) via `topicText`, `makeLead`/`leadBoard` (real postings from friends), NPC asks (`ASKS`, `askReply`), delayed answers in `msgWeek` (`M.msgq`), email compose (`EMAIL_KINDS`, `emailAct`, `mailReply`, `composeMailHTML`) |
| `src/depth.js` | `GIGS` (one-week jobs, `gigPosts`), more `VENUES` and `COMPS`, the Bazaar computer app (`BAZAAR`, collectibles `bzLots`/`bzValue`, `bazaarAct`, `bazaarWeek`), achievements (`ACH`, `achWeek`, `achHTML`) |
| `src/os.js` | ApplOS, the computer: `osPanel` (sidebar groups `OS_GROUPS`, header, body), apps `osHome`, `osJobs`, `osCal`, `osContacts`, `osBank` (`osNetWorth`), scoped dark theme under `.os` |
| `src/archive2.js` | Pages for media figures (`viewFigure`, ids `hub~i`), songs (`viewSong`), media companies (`viewMediaCo`), your works (`viewWork`); `viewExtra` route hook; The Daily Slate (`paperHTML`, sections, search `npq`, monthly archive); `playerArticle` for stories about you |
| `src/companywork.js` | Named employers for every off-set job (`nameEmployer`, `BIZ_NAMES`, `employerLink`); company slate influence by rung (`SWAY`, `slateWeek`, `f.exec`), big calls (`SLATE_CALLS`, `slatePick`, inbox kind `slate`), `slateHTML`, `companyWorkHTML` |
| `src/awards2.js` | Full winners for every prize: `ceremonyRecord` (`CER_CATS`, `CER_ALIAS` canonical names, `CER_START`), `mediaRecord` (`MEDIA_CATS`), `contestRecord`, `allWinners` (cached), `awardTableHTML` (category chips, `ab-cat`/`ab-y`/`ab-sort`), `festLineup` |
| `src/trailer2.js` | Trailers per film: `trailerPlan2` (genre scripts `TR_LINES`, voice-over `TR_VO`, freeze/stinger/laurel/sub segments, `titleNoun`/`plural`), `trailerScore` (genre sequencer `TR_SCORES`) |
| `src/staff.js` | Company staffs in every industry: `coRef` keys (`f<id>` film, `m<idx>` media, `b<name>|<hub>` small business), `headcount`, `orgChart` (`DEPTS`, rank pyramid), `staffAt`, `bossOf`, `viewEmployee`, `staffDirectoryHTML` (routes `staff:`, `emp:`, `biz:`), `companyHistory`, `filmStaffHTML`; cache `ARCH` keyed to S |
| `src/curric1.js`–`curric4.js` | `CURR`: 28 fields × three years of courses, ~190 lessons `[year, title, idea, how, decision, example, genre?]`; examples use tokens {F} {D} {P} {E} {A} {W} {C} {Y} resolved to this world's films |
| `src/curriculum.js` | Teaching it: weekly classes at school (`currSchoolWeek`, inbox kind `lesson`, `currPick` grades A/B/C), learning on the job (`currWorkLearn` from `jobTaskBlock`), books (`currBook`), DC bonus on tasks (`currDCBonus`), Craft Library app (`libraryHTML`, `data-libf`), `syllabusHTML` on school pages; progress in `M.cur`; term projects (`nextProject`, inbox `lesson` with cid `m:field:k`, `projPick`, progress in `M.curMods`, `sc.proj`) |
| `src/curric5.js` | `CURR_DEEP`: ~100 lessons rebuilt from NFTS MFA outlines, the AFI catalogue, Berklee scoring and the DGA AD trainee programme. Appended after the earlier lessons (no re-sort) so existing lesson ids stay stable |
| `src/curric6.js` | `CURR_MODS` → `CURR[f].mods`: assessed programme projects per field `[year, name, brief, [call, [opt, stat, outcome]...]]` |
| `src/numbers.js` | Industry by numbers (Library → 📊): `IMDB` aggregates from the IMDb non-commercial datasets (attribution line required on the page), `worldNumbers()` display-only cache, `numbersHTML`, `numClick` (`data-numdec`) |
| `src/stories.js`, `src/story1.js`–`story32.js` | Real classic films told accurately: `ST(id, logline, tagline, stills, trailer lines)`; `storyOf`, `storyFrame` feed stills (cinema.js) and trailers (trailer2.js). 1867 films (every catalogue film rated 83 or more, then down the list); note `stripwho.js`-style checks run in a 2025 world, so 2025 films need their cast letters checked by hand; cast letters A/B/C must match the real cast order |
| `src/awards3.js` | Every prize as a page: 25 more `STATUETTES`, trophies per body (`bodyTrophy`), lore and history (`bodyLore`), `bodyLoreHTML`, the awards cabinet (`awardsCabinetHTML`, search `abq`), laurels in hiring (`laurelFactors`) |
| `src/careers.js` | Real career histories under in-world names (`CAREERS`, `EXEC_CAREERS`), `freshHeads()` updates studio heads (co-chairs at Daring Comics Studios etc.), `currentPost`, `careerPathHTML` |
| `src/critics.js` | Roger That (reviews aggregator): outlets, critics, `filmReviews`, `rogerPanelHTML`, critic jobs and blogs (`writeReview`, `criticWeek`, work type `review`) |
| `src/finance.js` | Economy and bank: rates, macro events, sectors and funds (`sTrade`, action `strade`), tips and insider fines, `bankOf`/`bankAct` (action `bank`), FATE events, `bankWeek` |
| `src/osfold.js` | The computer is the hub: every desk tab and world screen as an app (`FOLD`), in-computer page stack (`UI.osStack`, `osCaptureGo`, back/close) |
| `src/shop2.js` | Bazaar expansion (`bzAdd`, era-gated `from`/`to`, Collecting), monthly drops (`DROPS`, `bzDrops`, next month "in production"), relics (`RELICS`; Grand Auction, dealer, estate-sale dig; action `relic`), App Store tools and subscriptions (`M.subs`, `kitFx` folded into `homeFx`, `kitFactors` in hiring), two games, grander homes, vehicles, `FURN2` furniture drawn as icons |
| `src/charts2.js` | Deep charts: `chartAt(field, hub, week)` for any week (this week's desk chart uses it), year-end, number ones, every artist, labels; `moreFigures` long tail (dated from the world's start year); freelance workforces as pseudo-companies `x<field>|<hub>` in staff.js; song crews, artist chart records |
| `src/curric7.js`–`curric9.js` | ~400 more lessons appended per field (`CURR_LONG`, `CURR_MORE2`, `CURR_MORE3`); 699 in all, ≥20 per field. Loaded before curriculum.js |
| `src/amb2.js` | ~580 more ambitions via `amb()`, new groups in `AMB_CAT`; `ambMemo`/`ambFresh` (every list walker must call `ambFresh()` first: replays depend on it) |
| `src/boards.js` | The boardroom: stakes, seats (`M.boards`), quarterly votes (`AGENDA`, inbox kind `board`), bets, executive packages (`M.pkg`), tender offers and mergers (`M.deals`, `dealWeek`, `mergeInto`), controlled companies (`M.ctrl`, dividend policy), Boardroom app; action `board` |
| `src/trivia2.js` | Extra rumour/silly lines plus `GENRE_NOTES`, `eraNote`, `JOB_NOTES` (made-up films/people only); hooks `extraFilmTrivia`, `extraPersonTrivia` in trivia.js |
| `src/shorts.js` | Short films: work type `short`, platform `circuit`, `SHORT_FESTS`; `shortRelease`/`shortWeek`/`shortPick`, `thesisShort(sc)` at mfa/ba graduation; world shorts by future directors (`shortsOf`, `shortsBy`); pages `short`, `shortfest`; Shorts app |
| `src/tv.js` | Television: `TV_NETS_RAW`, `TV_LEGENDS`, `tvAll()` (cached per year), Emmets (`tvEmmets`, September); pages `tvshow`, `tvnet`; Tele-Guide app; player pitches (`tvAct`, action `tv`), `tvWeek` (pilot → order → May renewals), `tv_*` jobs (`tv:1`, excluded from odd jobs) |
| School attendance | `W.studyD[day]` marks days with any study block; `closeWeek` copies to `M.studyDone` before clearing `M.wk`; `schoolDaysDone()` reads either. Each study day auto-learns the next class (`nextClass`/`electiveClass`) |
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
node tools/rendertest.js 40        # same, opening every page each week; catches pages that roll dice
node tools/fuzz.js 5 60            # random careers; every line must say "ok"
NODE_PATH=$(npm root -g) node tools/uitest.js <outdir>   # Playwright; needs "SAVE OK", overflow 0
```

## Recent balance decisions
- Save version is 8 (job tasks changed the dice stream).
- Scenes never repeat for ~26 weeks, longer each time (`sceneFresh`, `M.seenSc`).
- `careerLevel` = credits·.35 + standing/20 + weeks/90 + clamp(work/18, −1, 1.5) + agent: quality of work matters more than time served.
- Task DC = 6 + tier·1.4 (+1 shooting); junior misses −0.5, scene misses −0.5.
- Script grades compress above 72; first drafts land around C, rewrites lift them.
- Options mostly lapse (~0.2–1%/week greenlight chance); writer fee 1.2% of budget, capped.
- Producing: one pitch a week, each company says yes to you at most once a year.
- Player company is exempt from the world's monthly overhead; pays a small weekly office cost instead.
- Investors: you put in ≥25%; Finance roll; they take a share of returns; 4-week wait after a no.
- Hiring has a "crowded field" penalty that standing cuts through (`applicantsFor`); headcounts are shown at real scale.
- Burnout escalates within 26 weeks (1, 2, then 3 weeks off; `burnoutWeeks`); three missed weeks in a job risks being let go.
- Controlled companies pay at most 35% of cash a year in dividends.

## Ideas queue (after the big notes pass)
- `REAL_LOOKS` covers ~230 famous names; extend it for more (codes documented at the top of the file). The dead are drawn at ≤50.
- People and studios use deliberate parody names ("Harrison Fjord"); only exact real names were removed (YRF, agencies).
- Done: festival bids are split into home-market and international rights, settled per territory.

1. Done: hire DP, editor, composer, production designer; 'Your regulars' panel on the People tab.
2. Done: festival selections bring distributor bids (advance + share, settled after release); the 'parent' background links you into a real family and gives a hiring edge. Careers screen runs job text through `deReal()` to hide real employers/unions.
3. Done: `workCost()` (shooting days, seniority, two jobs) and the grind (`M.grind`: consecutive working weeks without a light week → stress, 'Worn down' condition at 12; trips reset; autopilot protects evenings at 8). Probe: scratch `diff.js`-style bot comparing employed vs idle weeks.
4. Done for world events: most events carry a choice scene (`EV_SCENES` in life-world.js, `scene:` key on WORLD_EVENTS; `needs: 'friend'` picks a friend by week number, no dice). Job families now have 5–11 scenes each (third reel in life-scenes-third.js).
5. Done: fictionalise.js never swaps place/common words (ALLOW) or after 'Mount', and drops lines where a swap is glued to another name. 129 fake titles that equalled or contained a real title were retitled (catalogue + data/fill).
