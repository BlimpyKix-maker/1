# Apple Box — handoff notes

A film-industry life sim (Football Manager / Persona / Crusader Kings feel). One self-contained page, `index.html`,
published as a claude.ai artifact: https://claude.ai/artifact/LYwbMRqFNuQ3eMLJLh1qTt (v21; the older link 8siqt3XdWb4DhTz4su2cMZ belongs to the original account) (declares the `sample`
capability for "Read the pages"). Work branch: `claude/game-finishing-polishing-2eiy6a`.

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
| `src/late-game.js` | The long game. `lookingForWork()` (Today toggle `M.looking`; default off with a year's runway at level 2+) gates job nudges. `LATE` opportunities (pools late/indie/life; `need` pre-check, `mk` fills ctx, `needC` post-check, `once`/`cool`) as `late` pending items (`latePick`); delayed payoffs `M.lateQ` → `LATE_DUE`; holdings `M.lateA` earn weekly (`lateWeek`). `lateMorning` adds Tuesday opportunities for the rich and guarantees no quiet weeks (`W.beats`, counted in `inbox()`; `weekBeat` on Fri/Sun). Levels 6–7 (`careerLevel`), `tierLevel()` caps job tiers at 5 |
| `src/tv2.js` | TV front door: `viewTv` (nav tab), `tvAllPlus` (world + your shows in ratings), `tvCreditsHTML` on person pages, `tvSearchHTML` in world search, `tvNewsWeek` (upfronts in May, premieres and Emmets in September), `TV_SCENES` (ROLE_SCENES.tv, added to the pool for jobs with `j.show`), showrunner decisions as `late` items in pool 'tv' (`myAiring`, `tvTweak` change the airing season's q and viewers) |
| `src/legacy.js` | The long arc: `ageSleepTax` (less sleep recovery after 50), late-life moments as `late` items in pool 'age' (`ageMorning`, Thursdays from 55), `legacyOf` score and title, `legacyPanel` (Life tab, with Retire), `epilogueHTML` (shown when `M.over`), actions `retire` and `nextgen` (old self becomes an NPC with `wasPlayer`, `S.legacy` keeps the record; `legacyGreet` introduces the newcomer to them) |
| `src/figure.js` | Full-body figures: appends options to `LOOK` (tops, colours, hair, hats; never reorder) and adds pattern, bottoms, bottomColour, shoes, bag, tattoo, pose. `figureBody` is drawn by `portraitSVG(..., fig=true)`; `figureOf(p, h)`; NPCs get theirs from `npcFigure` (own hash, face untouched). Room styling (`ROOM_STYLE`, `roomStyleAct`) lives in home.js |
| `src/chatter.js` | `CHAT` text pools filled from context (their shoot, your news, month, city, films, gossip) via `chatterText`; `LIFE_MAIL` life emails via `chatterMailWeek(r)`. Hash-driven, never prnd |
| `src/market2.js` | Non-film listings: `ENT_EXTRA`, every tier 1–2 `MEDIA_COS` and every non-public `TV_NETS` join `SECTORS`/`SECTOR` (drivers in finance.js `sectorDriver`). Grouped `sectorsHTML`, `sectorsHeldHTML` in the portfolio |
| `src/reel2.js` | REEL categories: `REEL_CATS`, `geaHead`, `reelView(tab)` for reel_tv / reel_music / reel_creator / reel_podcast / reel_stage, `worksCreditsHTML` (your releases on your profile) |
| `src/market.js` | The Bourse: cached prices `mktBar`/`mktPrice` (anchored to `companyWorth`), events, candles, `tradeAct` (action `trade`), `watchAct`, dividends in `stockWeek`, `marketApp` |
| `src/festivals.js` | `FEST_INFO` (24 festivals: rules, sections, prizes, statuette kinds), `festFits`, `festPeople` (directors, programmers, juries), `festWinners`/`festRecord`, `STATUETTES` SVGs, trophies (`trophyWeek`, `trophyAct` show/sell, `trophyShelfHTML`), `festivalPage` |
| `src/messaging.js` | Who texts you (`innerCircle`, `recentColleagues`), stakes texts (`STAKES`, `stakeText`, `stakeReply`, `stakesWeek`); `TOPICS` (22 ways to start a text) via `topicText`, `makeLead`/`leadBoard` (real postings from friends), NPC asks (`ASKS`, `askReply`), delayed answers in `msgWeek` (`M.msgq`), email compose (`EMAIL_KINDS`, `emailAct`, `mailReply`, `composeMailHTML`) |
| `src/depth.js` | `GIGS` (one-week jobs, `gigPosts`), more `VENUES` and `COMPS`, the Bazaar computer app (`BAZAAR`, collectibles `bzLots`/`bzValue`, `bazaarAct`, `bazaarWeek`), achievements (`ACH`, `achWeek`, `achHTML`) |
| `src/os.js` | SlateOS (renamed from ApplOS in Round 19), the computer: `osPanel` (sidebar groups `OS_GROUPS`, header, body), apps `osHome`, `osJobs`, `osCal`, `osContacts`, `osBank` (`osNetWorth`), scoped dark theme under `.os` |
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
| `src/stories.js`, `src/story1.js`–`story46.js` | Real classic films told accurately: `ST(id, logline, tagline, stills, trailer lines)`; `storyOf`, `storyFrame` feed stills (cinema.js) and trailers (trailer2.js). 2688 films (every film in the catalogue); note `stripwho.js`-style checks run in a 2025 world, so 2025 films need their cast letters checked by hand; cast letters A/B/C must match the real cast order |
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
| `src/financing.js` | Film financing: `INCENTIVE` by hub, `presaleShare`/`presaleDC`, `finPlan` (incentive, pre-sales, gap, bond, insurance, equity) used by `selfFund`; `f.fin` on your films; `FIN_INC` incidents (people, money, acts of god) via `finWeek`/`finPick` (inbox kind `fin`); `finCollapse` abandons a film (banks repaid first); co-investing `coinvOpen`/`coinvAct` (action `coinv`)/`coinvWeek` statements; `finStackHTML` on film pages, `finPanelHTML` on the company panel |
| `src/saves.js` | Snapshot saves: `snapBaseline` (field hashes of the freshly built world, after `finishWarm`), `snapData`/`snapApply` (changed entities field by field, ties entry by entry, RNG states `R.s`/`S.me.rng.s`), IndexedDB slots (`writeSlot`, `saveList`, gzip via CompressionStream), autosave cadence (`autoPref`, `autoCheck` from `doAct`), journal of actions since the last save (`journalAdd`, replayed on resume only), `bootTarget`/`bootFinish` at start-up, forgiving replay (`replayOne`) for old-style logs; Saves page (`savesHTML`, nav tab `saves`). `S.me` and your own person record are stored exact at the top of the snapshot (`d.me`, `d.mep`; the world is rounded to 4 decimals), so the journal replays onto the numbers you left. Save files: `exportSlot` (Export button, gzip `.applebox` = `{applebox, meta, snap}`), `importSaveFile` (file input `#save-import`) adds a manual slot. Load/Overwrite/Delete ask twice in the page (`sBtn`/`sSure`, `UI.sAsk`), never `confirm()` |
| `src/correspond.js` | Conversation: `parseMsg` (tone, topic: plan/did/mine/feel/thing, questions), `turn` (I→you), `answerOwn` (replaces the basic one, which is now `answerOwnBasic` in convo.js), `fresh` (per-person no-repeat lines in `M.used`), memory `C.mem` + `rememberWeek` follow-ups, scoops (`scoopText`, `scoopWeek`: leads, troubled productions, strong cuts, introductions), `mailEcho` (email replies answer what you wrote) |
| `src/weather.js` | City climates (`CLIMATE`, `RAIN_BY`), `wxDay`, shoot effects (`weatherWeek`), opening-weekend crowds (`wxCrowd`, `wxBoxMul` hooked in `release()`, only once the player exists), Weather app |
| `src/clapgram.js` | Clapgram (was Flick): feed from real events, stories, explore/follow (`cgFollow`), your posts (`cgPostAct`, action `cgpost`); 25 post kinds (`CG_KIND`: emoji, label, captions, scene emojis, style), `cgFill` placeholders ({city} {mate} {day} {n} {genre} {place} {y}), per-kind comments, suggested posts and ads |
| `src/tv3.js` | TV pitching ways in (`tvRoutes`), staged development (`tvDevWeek`: script → notes → pilot), `emmetsHTML` (17 categories in `TV_CATS`), `primetimeHTML` |
| `src/roger2.js` | Roger That browsable: `rtFilters`/`rtFilmTable` (genre, decade, verdict, min critics, sort; header click sorts), critic directory `rtCritics` (`RT_TEMPER`, `RT_WEIGHT`, `criticRecord`), `rtOutlets` |
| `src/work2.js` | Work page week grid `workWeekHTML`, `fitChip` on board rows, `swapForOffer` (offer choice `swap`) |
| `src/mine.js` | Your job/school pages: stack kinds `myjob:<id>`, `myschool:0` via `viewMine` (heads of department, cast, company staff; faculty, your year, alumni drawn from the town) |
| `src/decide.js` | `decisionBoxHTML`: pending decisions in a box inserted just above the computer (`.os-wrap`), below the portrait and basic info; not sticky (`UI.decI`, `UI.decMin`) |
| `src/diary2.js` | Diary edits are actions (`calset`); pins (`calpin`, `M.calPins`, applied by `autoCal` via `applyPins`) and saved weeks (`calpreset`, `M.calPresets`); `diaryKeepHTML` is a slim one-line toolbar (keep checkbox, pin count, saved-weeks select, inline name field: no `prompt()`, which the artifact iframe can block) |
| `src/make2.js` | Scriptwriter suite: tabs desk/story/chars/scenes/pages/punch/notes; action `swedit` (logline, title, char, scene, pages: 180 words = 1 page, 3/day), `punchup`; `fountain()` screenplay formatter |
| `src/make3.js` | Studio (`st2`, `studioScore`, melody/groove/chord/mix/lyric reads, `st2Play` WebAudio), podcasts (`pod2`), CutRoom (`cut2`, `cutScore2`, thumbnail designer, preview), Notebook (`ideaAct`, sparks), Create hub `makeHubHTML`; `makesave` stores into `M.make.studio` |
| `src/body.js` | Fitness `M.fit` {mus, mass, goal}: venues build muscle, `fitWeek` drift, role asks (`fitask` inbox, `fitPick`), drawn build via `look._fit` |
| `src/tone.js` | Decisions never lecture: `stanceOf(label)` sorts choices into bold/careful/generous/plain; `stanceQuip` picks a win or miss line (hashRand, `{role}` = your job title) shown under the skill check (`result.quip`); `boldGambles` turns bold options that used to fail automatically into real rolls (cha/com 13) |
| `src/msgfix.js` | Phone and mail read state: `phoneSeen` (`M.phoneSeen`), `threadUnread`, `phoneUnread` counts incoming only, `phoneFocus` (stake thread, else newest unread), `markAllRead` (`data-markread`), `msgScroll` (threads open at the newest message; mail jumps to the open email) |
| `src/market3.js` | Full trading: `shortAct` (action `short`, open/cover, 50% margin), `orderAct` (action `order`: limit buy/sell, stop-loss, cancel; 20 max, 12-week expiry), `market3Week` (fills, borrow fee, margin calls); `tradePanelHTML(key)` (`c<id>` = studio, `s<key>` = sector); `tickerPageHTML(k)` (stack kind `ticker:<k>`: chart spans, KPIs, dividend note, clickable leaders and staff via `sectorRef`) |
| `src/finance2.js` | One market (`mktRows`, `allMarketHTML`), sourced tips with track records (`tipsThisWeek`, `tipJudge`), `economyHTML`, private banking (securities line `sbl`, angels `angelsOf`/`angelAct`/`takeAngels` used by `selfFund`). Tips: 7 source kinds (`TIP_KIND`), angle-based reasons (`TIP_WHY`, `TIP_ANGLES`, `SECTOR_WHY`). Angels: `ANGEL_KIND` bios, `ANGEL_MOTIVE` (moves `angelDC`), `ANGEL_ASK` terms; success sends an `angeloffer` inbox (accept / haggle cha 14 / pass, `angelPick`), two new angels a year, `angelWeek` outreach every 4 weeks; `M.angelTry` keyed by name|kind |
| `src/creative.js` | Scriptwriter (beat board `outlineAct`, `scriptSessAct`, coverage), Studio (mix, arrangement, podcast guest/order), CutRoom (clip sets, trims, packaging, predictions) |
| `src/arcs.js` | Story arcs: multi-week storylines (`ARCS`, 41) built from your own people, films, city and money. Declarative stages `{ t, x, o: [{ k, l, ck, cost, ok, no }] }`, results `{ t, fx, n, w, end, mile, flag }`; text tokens `{who} {film} {co} {amt}` and pronouns `{they} {them} {their} {is} {s}` (`arcFill`). `arcMorning` (from `lifeMorningEvent`) shows due stages and starts new arcs on Wednesdays (one at a time below level 3, two after); `arcPick` (inbox kind `arc`); state `M.arcs`, `M.arcSeen` (5-year cooldown), `M.arcLog` shown as "Your stories" on the Life tab. Only real skill names in `xp` (bad names write NaN) |
| `src/variety.js` | Wider content pools, appended to lists defined elsewhere: `MORE_LIFE` scenes per activity, `SPAM`, `FANS` (`{work}` = your newest release), `FAVOURS`, `INVITES`/`INVITE_TXT`, `YES_TXT`/`HELP_TXT`/`NO_TXT`, `ASK_WHAT`, `GOSSIP_LINES`, `INVITE_MAILS`, `MIXER_VENUES`/`MIXER_SAME` (networking once you know everyone), `TIRED_SLIPS` per job family |
| `src/dreams.js` | ~55 dream careers (`DREAMS`, `DREAM_BY`, grouped Film & TV / business / music / online / audio / stage / games). Each sits on a working role (`role`, decides the craft) and may define its own idea of the work (`core: [deptRx, titleRx, excludeRx]`, used by `coreWork` instead of `CORE_WORK`) and a first project (`first`). `S.me.dream`; `dreamOf()` falls back to the role for old saves. The field is not chosen: `fieldDrift()` (monthly) moves `M.field` to where the last two years of work and releases were (`fieldScores`), with a note and `M.fieldLog`. `dreamLine` on the desk; `setDream` (action `dream`) pivots (role and training follow, −3 standing) |
| `src/gigs.js` | Work for hire: 40 `GIG_TYPES` (commercials, music videos, TV episodes, second unit, branded, docs, theatre, live events, concert films, trailers, titles, web series, specials, game cinematics, opera, residencies, comedy showcases, festival sets…), each with the credit per role, level band, weeks, fee (×`gigFee[level]`: early pay is small, a name pays a lot), skills, field, prestige, reach, snag family. Offers (`gigOffer`, inbox kind `gig`, stage `offer`: take / push for 35% more (Charisma vs leverage) / trade 15% for control / half fee + share / pass), monthly briefs you pitch for (`gigBriefsRoll`, action `gigpitch`), a mid-job snag (`GIG_SNAGS`, stage `snag`, rolls move quality), delivery (`gigFinish`: quality is level-relative, reach results, standing/fame, clients who rehire, form awards, shares paid later `M.gigQ`), the reel (`reelScore`: best five of three years) feeding `reelFactors` in hiring and offer odds, and `gigLadder` (three strong pieces → a producer calls about a feature). `DREAM_GIGS` weights routes by dream. Credits count toward `careerLevel` (`hired`), and show on your person page (`gigCreditsHTML`) and the Work tab (`gigsHTML`) |
| `src/dealroom.js` | The Deal Room (OS app `deals`). Negotiation engine over `S.me.talks` (not `deals`: that's the boardroom's): `dealSlack` vs `dealCost` → `dealOdds` (meter), `dealSend` (one prnd roll; rejections cost patience, they counter halfway; walk at 0), `dealTakeCounter`, `dealWalk`. Producer deals: a company's yes (`pitchSpec`) opens talks (`dealOpenProduce`, inbox kind `pdeal`) on fee, backend points, control (none/consulted/final) and +15% budget; `dealClose` greenlights with `f.pdeal`. Investing: `dealOpenInvest` with amount, recoupment premium, profit split, EP credit, a say, first look; stakes carry the terms (`coinvOwed` reads `x.prem`/`x.split`). `comparables()` (equity multiples of similar released films) and `filmOutlook` power projections. Process: producer calls `PCALLS` (26, per stage, inbox kind `pcall`, sway by your position) move `qBonus`/`hook`/cost/schedule; stake events (`stakeEvents`, kind `stake`: set visit, buyout offer, streamer vote, awards campaign, second life); points statements (`pointsStatements`); waterfall view |
| `src/paths.js` | Paths app (`paths`): a ladder per field (`PATHS`), breakthrough offers per field (`PATH_OFFERS`, inbox kind `path`: label deals major/indie/distro, sync, tour, publishing; creator network/agency, merch, book, streamer show; podcast network sale/licence, live tour, TV option; theatre transfer, publication) that change the money afterwards (`M.pdeals` with `pathBoost`/`pathCut` per platform used by media.js, income `M.streams`), labs/fellowships/residencies (`LABS`, one window a year, `labApply` action `labapply`, `labWeek`), and campus life while enrolled (`CAMPUS`, inbox kind `campus`) |
| `src/art.js` | Drawn pictures (pure, seeded by hashRand): `cgArt` (every Clapgram kind; replaces `cgPhoto`), `bzArt` (Bazaar product shots by keyword/category: books, lenses, cameras, laptops, mics, tickets, posters…), `wxScene` (sky + skyline for the Weather app). Helpers are prefixed `a…` |
| `src/works2.js` | Pages for creations: `viewWork` (what it was about, quality by part, audience week by week, money, critics, comments) and other artists' releases (`viewSong` wrapper) |
| `src/bank2.js` | Money history (`M.ledger`: weekly cash and net worth; charts on the Bank page), auto-saving a share of good weeks (`M.autoSave`, action `bank2`), trade prices on Bazaar gear/books/courses from level 3 (`bzPrice`) and gear effects that scale with level (`bzBang`) |
| `src/contests2.js` | 31 more contests (online, audio, theatre, comedy, music, writing, producing); `work` contests judge your best released piece (`compWorkBest`); 20 more short-film festivals and a deadlines & entries planner (`shortSubmit`, action `shortsubmit`); `seasonHTML` (your awards season, on the Awards page) |
| `src/weather.js` (additions) | Weather app: live scene, sunrise/sunset/golden hour (`WX_LAT`), wind/humidity/UV, best shoot days, hourly curve, world cities (`WX_WORLD`, `data-wxhub`) |
| `src/toon.js` | Toon portraits for everyone (`toonSVG`, wraps `portraitSVG`; Classic via look `style: 1`): new LOOK keys style/eyeShape/mouth/cheeks/facePaint/sidekick/aura, extra hats/glasses/hair/colours appended (old indexes keep their meaning), moods from your week (`_mood` via `lookOf`), investor lapel pin (`_pin`). CSS animation classes `t-*` only run in `.hero`, `.home-scene`, `.toonlive` |
| `src/room2.js` | Room life: `roomPropsSVG` (activity props shown by the room's animation loop instead of emoji bubbles), `roomVisitorSVG` (partner or close friend some weeks, hashed), funky `VEHICLES` (skates to jetpack), `vehicleSVG` drawings, `streetVehicleSVG` parked outside the window |
| `src/ventures.js` | Bank tabs (`UI.bkTab`: Accounts/Ventures/Private/History; `UI.bkSplit` keeps the old bankHTML parts apart). Ventures: `VENT_KINDS` (11 kinds), yearly climate (`VENT_CLIMATE`, `ventClimate`), deal flow (`ventRefresh`), homework roll (`ventDD`, fin), invest/sell, monthly fail/exit/round/breakout, founder asks (`VENT_ASKS`, inbox kind `vent`), perks wired into `companyEdge`, `wxBoxMul`, `festSelOdds`, `bzDiscount`; investor tiers (`investorTier`, memoised) |
| `src/luck.js` | Lucky Corner (OS app `luck`, Play group): Lotto 6/49 drawn twice a week in `luckWeek`, scratchcards (~55–65% back), roulette (single zero), blackjack (S17, 3:2, basic-strategy hint if fin ≥ 11 or com ≥ 13), slots (~89%), craps pass line, the races (17% overround). Action `luck`; `luckStake` scales small money by `wageF` without the $5 rounding of `usd` |
| `src/school2.js` | Pop quizzes (`makeQuiz`: film notes from FICTION, technique from CURR, decades; taste rules out answers), GPA (`schoolMark`, `gpaOf`, learn() wrapper), grade effects (hireFactors, shorts/fest odds, distinction, probation/expulsion), year shorts (inbox `yearshort`), 17 more real-ish shorts festivals with `SF_INFO` (juries, sections, side door: market/campus/fund/residency/feature), sales (`shortsale`), campus invites (`campus2`) |
| `src/party3.js` | Party moods (`PARTY_MOODS`, approach classification), gossip doors (`PARTY_RUMOURS`, options `r_*`), own guests for the games room (`shark`) and coat room (`celeb`), wrappers on makeParty/partyScene/partyPick |
| `src/acting2.js` | Named parts (`makePart`) on casting posts with a skill they need (hire factor), 14 actor gigs (`ACT_GIGS`, ODD_BY only), auditions and callbacks (holdInterview/resolveInterview wrappers, `it.aud`), big scenes on set (inbox `bigscene`, `j.perf`), critics' notices after release |
| `src/moments.js` | Day and block moments (`DAY_MOMENTS`, `BLOCK_MOMENTS`, hashed, never dice) added to `conditionsOf`; small energy effects applied once per block via lifeDayEvent |
| `src/sports.js` | Leagues per market (`LEAGUES`, `SPORT_KINDS`), hashed fixtures/results (`weekGames`), tables, play-offs, champions; sportsbook (action `sport`), follow a team, `VENUES.game`, sports jobs (`SPORT_JOBS` via depthBoard), song sync licensing (`syncWeek`), halftime show (inbox `halftime`); OS app `sports` |
| `src/crew.js` | The group chat (thread key `crew`, `m.grp`): `chatCrew`, news reactions (`CREW_SAY`, `M.crewSeen`), asks (inbox `crew`: lead/poll/night/bet), your weekly post (action `crew`, `crewSay`) |
| `src/prodjourney.js` | Own-company films get stage decisions (`PJ_CALLS`, inbox `pj`), effects on qBonus/hook/cost/schedule/bond/streamer sale, written to `f.events` (the film's story) |
| `src/co2.js` | Offices (`OFFICES`), key people (`KEY_POSTS`, real NPCs, skill from standing, salaries from company cash, poaching inbox `copoach`), genre brand (`coBrand`), all via companyEdge; panel appended to strategyPanel |
| `src/msg2.js` | Replaces `phonePanel` (two-pane messenger: filters all/unread/waiting/group via `UI.phf`, `threadNeeds` = replyable and under 2 weeks old, one-tap invitation kinds `data-txkind`, new-message picker `UI.newmsg`) and `mailApp` (three panes, smart folders incl. Needs you and Archived (`m.arch`, UI-only like `m.rd`), `avatarDot` sender faces, chips, Archive / Next unread). Wraps `sms` to drop the same text from the same person twice in one week |
| `src/awards4.js` | Contest rounds (`e.ls`/`e.ss` longlist/shortlist weeks set in an enterComp wrapper, field size `entrantsOf`, inbox `compround`: polish/judges/leave can move `e.place` one step); Contests tabs (`UI.ctab`: open/mine/soon/cal/all; open renders the old cards by temporarily narrowing COMPS); Awards tabs (`UI.awt`: you/season/results/prizes); nomination morning (awardsWeek wrapper, `M.nomY`), red carpet (`carpet`) and acceptance speech (`speech`) via an awardsNight wrapper |
| `src/toon2.js` | Replaces `toonBody` (builds S table, `LOOK.height`, real bottoms, ten whole shoes that point outward, garment details, watch/tattoos/bags) and `roomVisitor` (only the partner, or the roommate `M.roomie` from `roomieWeek`, with a name tag). `toonNeeds`/`toonSays` drive the home HUD, tap bubble (`UI.toonSay`) and, via home.js, which activity the toon picks |
| `src/memory.js` | People remember. A `resolvePick` wrapper diffs your ties before/after each choice: anyone moved ≥2 gets a note in `M.mem[id]` {v, n[]} and their closest circle hears a fainter version (`remember`). The choice's words nudge `M.style` {gen,bold,loyal,amb,honest} (`classifyChoice`, `AX_RE`, reasons in `M.styleLog`); an `applyAct` wrapper adds signals from actions (favour, pitch, share, quit, keeping up, applying) and `finishJob` adds loyalty. Holding a style 16 weeks unlocks one of eight `STYLE_PATHS` (`M.paths`, `pathActive`), each with hire factors and its own events (`pathEvent`). `memWeek`: decay, path progress, operator heat (`M.opHeat`), favours/paybacks citing the memory (`memCallback`), friendly faces / bad blood on a new job (`memJobsWeek`), crossroads forks (`crossroads`, 30-week cooldown per kind, `M.xW`). `memFactors` add to `hireFactors`. Panel `memoryHTML` sits after the first section of `standingHTML`; `memPersonHTML` on `viewPerson`. Inbox kinds `membad`, `memset`, `mempath`, `memx` resolved in `memPick` |
| `src/personas.js` | `PERSONAS`: about 150 real people keyed by catalogue `real` name: genres `g`/`no`, traits, mind nudges, temperament `v`, what they value `like` (style axes), text voice `tx`, work/off lines, `pals`. A `catPerson` wrapper applies them and seeds ties (pals +45, similar temperaments +, opposites −). A `greenlight` wrapper (world calls only: `greenlight(h)`) lets a free persona director take 35% of new films, in their genres 75% of the time; a `pickPerson` wrapper biases casting/crew toward persona genres while greenlight runs (`GL_PERSONA_GENRE`). `textStyle` uses `tx`; `personaFactors` reads your style through what the hiring head values; `personaHTML` on their page |
| `src/pets.js` | `PET_KINDS` (tier 0 basics, tier 1–3 unlock by `petTier()` from cash/home/weeks, `hubs` = only adoptable in those cities, `from` = year). `M.pets` [{id, kind, name, born, mood, health, hub, credits}], cap by home (`petCap`). `petAct` (doAct `pet`: adopt/name/vet/spoil/rehome/sitter), `petWeek` (costs, mood, stress relief, old age, dog park meetings, vet bills, pet cast on your shoot), inbox `petev` → `petPick`. Room: `petsRoomSVG` appended by a `homeSceneSVG` wrapper. App `pets` (You) |
| `src/living.js` | Day-to-day looks. `M.ail` {k, until} rolled weekly in `livingWeek` (cold, flu, sprain, cut, burn, hangover; flu/sprain ask via inbox `ail`). A `lookOf` wrapper adds `L._cond` {bags, messy, stubble, nose, pale, tan, plaster, burn, wrap} for the player (energy, stress, burnout, ailment, home morning/night) and NPCs (shooting, weather, hash), and swaps in scarf/beanie/sunglasses/lanyard by weather and work, pyjamas at night at home (`LIVING_CTX` set by a `homeSceneSVG` wrapper). toon.js draws them via `toonCondFace` / `toonCondHair` / `toonCondBody`. Weather lookups memoised (`LWX`) |
| `src/credits2.js` | A `finishJob` wrapper credits any film job of a week or more (uncredited templates become `pj.minor`), keeps credit after leaving past halfway, records every title in `M.ftitles[film]`, and gives `pj.why` when no credit. `crRolesFor(f)` unions all sources (titles, dir/wri/prod, own company, `xc`, studio exec, pets); `creditLedger()`; `creditsWeek` adds released films to `me.credits` once with a note and warns when your company is overdrawn. App `credits` (Work) |
| `src/actor3.js` | Actor deals. `M.quote` (best actor day rate, set in a `takeJob` wrapper); a `makePost` wrapper lifts real parts toward the quote and Buzz Index (capped at base × (2 + buzz/15)). An `inbox` wrapper adds `neg_*` choices to actor offers (money, pts, bill, epc at buzz ≥ 30, all, agent); `actor3Pick` rolls `cha` vs `negDC` (leverage from buzz, agent, credits, how much they want you), may walk, else re-offers; success re-enters `resolvePick(it,'yes')`. `actor3Week`: points paid on profit at release, billing fame, junket (`junket`), franchise (`franchise` → `M.fr`, sequels via `greenlight(..., {lead: me.id})`). Typecasting in hire factors. `actor3Act` (doAct `act3`, `star`) casts you as lead in your own company's film (no fee, 10 points). App `acting` (Work) |
| `src/places.js` | Places app (Today): `placesMapSVG` (`HUB_XY` lon/lat), `placeReasons(h)` (films shooting, board jobs, festivals via `FEST_INFO.hub`, schools, contacts, tastes, `HUB_EDGE` skills learned 25% faster via a `growSub` wrapper, local pets, language). Weekend visit to any city (`doAct trip` with `any`, `PLACE_TRIP` in `tripsAvailable`), move by choice (doAct `place2`, fee by language; pets move too). `placesWeek` texts from contacts elsewhere (`M.placeTip` pings on the map). Clicks: `data-city`, `data-placeask/placemove/placecancel/placetrip` |
| `src/variety2.js` | Your stock group-chat replies (`REPLY_VARIANTS`) get several wordings; identical gossip lines from others are dropped within 10 weeks; `crewAsk` runs at most every other week. (Not to be confused with the older `src/variety.js`, which holds venue and line pools.) |
| `src/shorts2.js` | The shorts scene, in `S.sc` {classes{y:[pid]}, shorts[{id, by, crew, title, q, kind, hub, y, laur}], fests{'k:y': {lineup, winner, you, youWon}}, broke{pid:y}, out{pid:y}}. `scMakeClass` (each January: under-32s with ≤1 credit in major hubs; up to 4 director/writer-led shorts per hub with class crew), `scFestMonth` (each festival's month: NPC shorts enter some festivals, mostly in their region, the player's selected short joins the line-up; winner gets standing/fame; a winner who beat you texts), `scBreakouts` (September: real momentum → first feature via `greenlight`, crew lifted, news; known breakouts may hire you via `makeLead`), `scEbb` (three years on, laurel-less class members go home: `p.retired`). Player: `startWork`/`releaseWork` wrappers take a plan {kind, budget, crew} (quality from budget and collaborators' craft; crew credited and remembered; entries limited to fitting festivals), premieres (`premiere`), feature version (`shortfeat` and `shortdev` → `scFeature` adds a holding). Shorts app tabs: The class, Make one |
| `src/tv4.js` | Television industry. `tvPeople` wrapper adds `room` [{id, rank}] and `crew` {dp, ed, mus, cst} (frozen pools, hashed); shows starting during the career are staffed from living people via `tvLiveWeek` into `S.tvPpl` (breakouts preferred; pools built once per week). `tvCreditsOf` covers room and crew. Calendar `TV_CAL` with `tvSeasonWeek`: pilot season (Feb–Apr; a `tvPosts` wrapper adds pilot jobs, half for shows that never air → `M.pilots`), upfronts (May: `tvUpfronts` offers your return, promoted along `TV_LADDER`/`TV_ACT_LADDER` with a raise, from `M.tvH` filled by a `finishJob` wrapper), fall premieres (pilots that went to series), back-nine (Oct, extends your job), residuals and syndication each quarter (`tvResiduals`), and big shows lift their stars (`tvStars`). Writers get an episode each season (`tvep` → `M.tvEps`). TV app tab The season (`tvSeasonHTML`); show pages list room and crew |
| `src/variation.js` | `gx(template, seed)`: `{a|b|c}` alternatives, nested, seeded (use `@a`/`@b` for name slots inside templates, since braces are consumed). `npcVoice(pid)` gives each person openers, sign-offs and home-language words, applied by an `sms` wrapper to their texts; `myVoice` + `MY_ALT` vary your own. Gossip grows from `G_WHAT` × `G_FRAME` (~460 lines), more `HOME_CALLS`, `MIXER_VENUES`, `SPAM`. Scene openers (`BEAT`: weather, hour, mood, a mate) via an `inbox` wrapper; reactions after scene choices (`REACT`) via a `resolvePick` wrapper. `ENCOUNTERS` (50 situations × person × place, 30-week cooldown each): `encounterWeek` / `encPick`, inbox kind `enc` |
| `src/scenes2.js` | Scene variants. An `inbox` wrapper gives about half of all scenes a twist (`TWISTS` for job scenes, i.e. `extra.job` set; `LIFE_TWISTS` otherwise; `TW_TAG` suffixes the title) that shifts every checked choice's DC (copied onto the item's choices, so the odds shown are the odds rolled), and 40% get an extra generic move (`GX_OPTS` at work: pull in a colleague, go to the boss, buy time, joke, pay yourself; `LIFE_OPTS`: walk away, do the kind thing, text a friend). A `sceneResolve` wrapper rolls at the item's DC, applies the twist's payoff (`twistAfter`) and resolves `gx_*` moves (`gxResolve`). tools/longplay.js now records items after all wrappers |
| `src/terminal.js` | The Terminal app (Today group): `termWeek` snapshots `M.hist` weekly (net worth, cash, standing, fame, buzz, network, stress, energy; 260 weeks). Panels: KPIs with sparklines (`tSpark`), market (AB-500 `indexVal`, movers), box office, genre heat, opportunities ranked by expected value (`postEV`), your book, signals. Themes amber/green/cyan/mono plus dense (`UI.tkTheme`, `UI.tkDense`, localStorage `ab-tk`). `tickerStrip` runs along the top of every computer app (osPanel wrapper, inside `.os-main`). Command palette: Ctrl/Cmd+K or `/` (`paletteItems` searches apps, people, films, companies) |
| `src/futures.js` | Film futures (doAct `fut`): tier ≤2 films within 10 weeks of release list at a price in $M of forecast worldwide gross; $100 per $1M per contract, ±3.5% spread, 30 contracts per film, shorts need 50% margin; `futWeek` settles at release + 4 weeks, refunds collapsed films, fines 30% of profitable trades on your own films. Price = `futFair` (comps model `futModel` far out → tracking `futTrack` near release) × hashed noise narrowing with time. `bankability(p)` 0–99 from the last five lead/director films' gross/cost plus fame. `waterfallSVG` ("Where the money went") and `whyPanel` ("Why it did that": tracking at release vs result, appeal inputs; `f.why` recorded by a `release` wrapper) on film pages |
| `src/agent2.js` | Agents earn their cut: `agentBook` (agentWeek wrapper) sends a direct offer at your level, with no application. Odds come from `agentBookOdds`: tier, style (`AG_BOOK`), lower while you're working, at most one every 5 weeks. An `agentApproach` wrapper lets agencies approach people with paid work (level 2+, standing 12+) and no screen credits |
| `src/guilds.js` | Guild contracts per market (`S.gld[m][g]`, g = wri/act/crew, ~3-year terms, staggered). Talks open 16 weeks before expiry; `strikeOdds` (base by guild × market militancy + thin-last-deal / recent-strike / streaming terms + hashed weekly wobble) is what the Terminal shows and what `guildWeek` rolls (hashed `gH`, never rnd/prnd). Strike: act/crew stop pre-production and shooting in that market, wri stops development (`guildStall`: stageEnd++, key people busy++, owning company pays 0.4% of budget a week); your market's performer/crew strike also injects the city `walkout` (existing halt: board, pay). Settlement raises the guild's pay `idx` (makePost wrapper), more after a strike. `guildStrikeStarts` sends a `guild` inbox item: picket / work abroad (cha 12) / non-union job (cash, standing −4, guild contacts −6) / interim agreement for your company's films (4% of budget, `f.interim` keeps shooting). The random city walkout is disabled. Terminal GUILDS panel |
| `src/taxstack.js` | Where you shoot and new money. `incentiveOf` wrapper applies yearly moves (`S.incX`, `taxWeek` each January: raise/cut/end/new, news) and redirects to the shoot location inside `finPlan` (`FIN_LOC`). Capped funds (`INC_CAP`) run out at a hashed week each year (`capWeek`); spent = no rebate. Shooting away: travel 3%/6%, cheaper crews (≤6%), thin crews (quality −1 to −2.5). New instruments: mezzanine loan (10%, bankable lead 45+ or standing 50+, repaid ×1.2 at release) and streamer pre-buy (2012+, budget + 3–22%, sets `f.streamSold`). Release wrapper audits the rebate (80–100% allowed; the rest goes back to the bank). Form wrapper adds the "Shoot in" select (`mk-loc-`), the new checkboxes and the recoupment order. Terminal INCENTIVE MAP panel |
| `src/release2.js` | Release dates. In the player era a `release` wrapper scales home appeal (`REL_CTX` → `appealIn` wrapper) by `relSeason(week)` × `relComp(film, week)`: crowding is the 3-week appeal weight (`futW`) of rivals against the market's usual week (`relBase`, from `S.relLog`). It's tuned to average ×1.00, with 10th–90th percentile 0.73–1.24. Stored as `f.relx`, shown in "Why it did that". `futTrack` includes the date. `relWeek`: tier ≤2 films in post within a week of each other; the smaller blinks (hashed, 70%) or nobody does. If one is yours: the other blinks (60% when smaller) or you get a `reldate` choice (hold / +4 / +8 weeks). `relMove` (doAct `reldate`): later costs 0.5% of budget a week, earlier 2% a week plus rushed-post quality. Terminal RELEASE CALENDAR with per-week multipliers and move buttons for your films |
| `src/stress2.js` | Traits vs choices (CK3). `TRAIT_STANCE` maps traits to bold/careful/generous leanings. An `inbox` wrapper labels choices ("· stress +4 (Shy)" / "eases stress") and stores `c.ts`. A `resolvePick` wrapper charges it (`M.slog`) and counts stances (`M.stc`): 18 of one kind erodes a contrary trait, or grows `STANCE_GROW`. Levels Steady/Strained/Stressed/Breaking (40/60/80). Crossing 60 or 80 sends a `cope` choice: `COPING` traits (Drinks, Runner, In therapy, Short fuse, Shopaholic, Recluse, Workaholic; added to TRAITS but not TRAIT_KEYS) with immediate relief and lasting effects. 12 calm weeks offer breaking a bad habit (com 13). Terminal MIND panel |
| `src/legends.js` | Legends app (Industry group). Almanac for any year since 1888 (top films, prizes, genre share, debuts, deaths, studios founded/closed, Industry headlines, year KPIs); Records (all-time grosses, share-of-year hits, flops, most-awarded films/people, most prolific, longest careers; cached per week); Lineage (came up under / came up under them / regulars / films by year); Search (`#arq`). A `release` wrapper reports a director's first film in 5+ years as a return |
| `src/filmdesk.js` | Film Desk app (Make group), three tabs.<br>**Test screenings** (doAct `screen`): your company's or directed films in post. `previewQ` runs `computeQuality` with `gauss` stubbed to 0 (no luck, `f.bd` restored). Cards give top-two-box, definite recommend, and opening/middle/ending. Up to 4 screenings, one fix per screening (`fixN`): recut (tas 12, +2 weeks, +2/+3 quality), reshoot (orig 13, +5 weeks, +4 or −1), new trailer (+6 hook) or lock. A bad screening can leak (hook −5).<br>**Film markets** (doAct `mkt`): EFM/Cannes/TIFF/AFM weeks (`FILM_MKTS`). Attend (cash, can counter) or send an agent (12%). Offers per territory: `salesEst` = budget × comps × .45 × .4 × territory share × `salesAppeal`. MG is 10% on signing, 90% at delivery (release wrapper); the buyer keeps the territory's rentals and pays half above 125% of the MG. Not for streamer or old intl pre-sold films.<br>**Awards** (doAct `camp2`): `raceScore` per category (the ceremony's formulas + campaign + precursors `f.prec` + `campF` focus); `raceOdds` softmax; publicist (per-nomination fee); weekly ads with diminishing returns; critics' circles at week 49 (`precursorWeek`). A `nationalAwards` wrapper (player era) records nominations (top 5 per category, `f.noms`) and reimplements the three votes with category scores. A nomination adds a 1.5% bump, Best Film 6% (`f.after`, half to the owner) |
| `src/distrib.js` | Distribution, on two new Film Desk tabs (Release plan, Streaming; `fdHTML`/`fdClick` wrappers). `f.dplan` {pa, mix, win} (doAct `dist`). Your company's films get the default plan at release.<br>**P&A:** `PA_SIZE` ×0.6–2; home gross × spend^`paE` (0.22 + hook/400); `paFit` ±6% for a genre-suited mix (`PA_MIX`); a wider release also costs 6% of home gross per extra unit.<br>**Windows:** `WINDOWS` classic / 45 / 17 / day-and-date (2020+): a theatrical factor, applied through `DIST_CTX` → `appealIn` like release2, and a home-entertainment rate settled at `f.rel + wk` (`f.hv` set so afterlife doesn't double-pay).<br>**Planner:** `dForecast` prices every option from tracking or comps.<br>**Streaming:** services are `TV_NETS` kind `streaming`; `subs` (millions) grows from the founding year. After a window your films get a `lic` auction (exclusive bids `licBids`, non-exclusive pair, hold 8 weeks; auto-takes the best after 4 weeks). Every player-era film in the release log joins a streamer at +13 weeks (pre-bought ones at +1). `viewsAt` gives weekly views; the 90-day total sets the top-20% success bonus (`strmBonus`: company +15% of fee, guild members a bonus residual). Engagement reports at weeks 26/51; Streaming tab top 10, services, your titles |
| `src/packaging.js` | Agency packaging. `agencyOf(p)` (hashed, tier² weighted, notable people only) gives NPCs agencies. `pkgOffers(genre)`: director + lead from the same agency's clients in your hub; the make-film form shows them (`data-pkg`, sets `F.pkg/dir/lead`). `selfFund` with a matching package: `PKG_CTX` makes investors 3 easier (`investDC` wrapper), pre-sales +0.08 (`presaleShare`) and the star's fee +10% (`leadFee`); the company pays a 4% fee at closing; the agency takes 12% of profit at release (`f.pkg`); the star's fee is +15%. From 2019 (`pkgWeek`), writers with a packaging agent get the guild's fire-your-agent choice (`pkgwar`) |
| `src/teller.js` | Storyteller (`M.teller` steady/tabloid/prestige, doAct `teller`, chips in the Terminal STORYTELLER panel). `threat()` = log10 net worth ×18 + fame ×0.4 (0–100). Weekly odds rate × (0.012 + threat/3500) after a rest; side by `bad` share; `INCIDENTS` weighted per teller, each kind at most every 40 weeks; severity scales with net worth (lawsuit, audit, windfall, patron). Uses prnd |
| `src/slate.js` | Slate deals: offered each year at week 8 (`slOffer`) to anyone with $1.5M+ or a company. Studio tier by money (tier 1 from $50M), the busiest pipeline. The share comes from 40% of your money. `cut` = the studio's access premium, so its recent films would return ×1.1. The slate covers every film in development or production at signing plus new greenlights for 52 weeks. Cherry-pick (`slatefilm` choices) loses 60% of big tier-1 films to holdbacks. Settlement at release + 6 weeks: share × (rentals×0.9 − P&A + gross×0.5) × (1 − cut); a collapse refunds the unspent share by stage. Kinds are `slatedeal`/`slatefilm`, because `slate` belongs to an older module. Negative pickup (`np` in the make-film form, standing 40+ or a hit): an 85% loan at closing; at release the distributor pays budget ×1.1 and takes the home rentals. The `finCollapse` wrapper repays pickup and mezzanine loans. Terminal SLATE panel |
| `src/fog.js` | Scouting fog (Football Manager). `scoutLv(id)`: 0 stranger, 1 contact, 2 worked together / shared credit / scouted, 3 scouted fully; ±`FOG_U` [6,4,2,0]. `fogRange` hashes an off-centre offset. Person pages: a `viewPerson` wrapper sets `FOG_P` so the `skillCell`/`bar` wrappers draw ranges and midpoints; below level 2 it hides `FOG_HIDE` traits as "?" (also in the trivia line); scout button (doAct `scout`, three a week, cheaper with an agent). Make-film pickers use `fogNum`. The simulation always uses true values |
| `src/talent.js` | Talent market. `talWeek`: for your market plus US/UK/IN/FR, per role (`TAL_ROLES`), ratio = pipeline films (stages 0–2) × need ÷ free people; index = √(ratio/EMA) within 0.75–1.5, with a 26-week history. `heat(p)` from bankability (0.8–1.4). `leadFee` × actor index × heat; `makePost` × the role's index (`TAL_CRAFT_ROLE`; `CRAFT_ROLE` already exists). Terminal TALENT MARKET: index, 13-week change, sparkline, hottest names, bargains (fogged acting per dollar) |
| `src/schemes.js` | Schemes and secrets (CK3). `secretOf(p)`: 30% of notable people (fame + standing ≥ 60), hashed from `SECRET_KINDS`. Schemes (doAct `scheme`, max 2): dig, poach (next fee −20% for a year), befriend (standing ≥ 45), sabotage (their film in stages 0–3: hook −8), blackmail (needs the dirt: cash; discovery = scandal + your own secret). Progress per week = 12 + 2×`checkInfo` mod − 1.5×resistance (standing/12, Discreet +3, Gossip −2, liking −2), ×(0.6–1.4); weekly discovery risk per scheme. `M.schLog` keeps outcomes. Person page panel + Terminal SCHEMES |
| `src/forecast.js` | Forecast desk (Film Desk tab). `fcComps`: same market and genre, tier ±1, budget within ±50%, last 5 years (falls back to 8), ranked by budget distance, tier and age, top 8. `fcRun`: comps multiples → P10/median/P90 × budget; adjustments for tracking (near release, weight 0.6), the release date (`relMul`^0.62), your P&A/window (`dMul`^0.62) and hook; break-even = (cost + P&A) ÷ blended rental rate. `fcScore`: median miss and share within 50% on last year's releases in your market (cached weekly). Targets: your unreleased films, your graded scripts, the next big releases |
| `src/worldland.js` | Natural Earth 1:110m land (public domain, via npm world-atlas 2.0.2), generated by a topojson→rings script: `WORLD_LAND` ("lon,lat" points, rings split by `;`), `worldLand()`. |
| `src/places2.js` | Places map redrawn: `pmRings` unwraps date-line rings and re-centres them; land, graticule, Europe inset (bottom-left, over the empty south Pacific), dots sized by `hubProd` and coloured home/known/other, a flight arc to the selected city, legend; comparison tiles with flight time (`pmKm`, `pmFlight`). |
| `src/home2.js` | Home screen. `heroPulse` (cash with sparkline and runway, energy/stress rings, standing trend, Up next chips from `hpNext`), `heroSceneBar` (day, weather, what the toon is doing). Room decor from state (`avDecorSVG`: photos of the inner circle, calendar, clock, cork board, bills when cash < 3× rent, laundry when stress ≥ 55, mail, script pages, laptop) and weather in the window. The toon engine (`AV`, `avPick`, `avGo`): needs + time of day + trade pick the activity, energy sets walk speed, faces the way it walks (`scale` property), lands, breathes, reacts once to what changed (`avReact` diffs cash/standing/stress/texts/decisions), tap targets (`data-avgo`), eyes follow the pointer (`translate` on `.pf-iris`/`.t-eyes`). The old wanderer in home.js stands down via `window.AV2`. Also the computer front page's KPIs (net worth, runway, fame, buzz, network with sparklines) and `toonSays` lines. UI only: no state. |
| `src/filmdesk2.js` | Film Desk for everyone: seats (`fdSeat` Observer/Talent/Producer/Mogul + next steps), desk log (`fdLog`), desk note per tab (`fdNote`), three-part empty states (`fdEmpty`) followed by world data (`fdWorldCuts` leaked test scores from a craft proxy, `fdDealSheet` what travelled and who's buying, `fdRelCal` calendar and last month's openers), awards waterfall (`fdRaceWhy`), glossary (`GLOSS`, `glossify` underlines first uses outside svg/buttons/links), and Call it (doAct `call`, `M.calls`, `fdCallsWeek` grades on release, column offer at 12 calls ≥ 65%, `fdLine` = `fcRun` mid × `fdBias(m)` so about half of films land over). |
| `src/appguide.js` | "How this works" primers (`APP_GUIDE`) on 23 apps, open while the app is empty for you (predicate), folded otherwise; `data-primer` toggles per session. |
| `src/bazaar2.js` | Bazaar aisles: style, health, services, gifts, experiences, art, tech; period gear; books; luxuries. `sub` = weekly charge (lapses when broke); `fx.fame`; one-offs are marked used on purchase. Gifts: `giftTaste` (two loved kinds, one disliked, role-biased hash), doAct `gift` from Yours, one per person per 4 weeks. |
| `src/pets2.js` | Pets deepened: temperament `petTemp` (revealed over 8 weeks unless papered), bond (`bondP`, walk once a week), training (`PET_TRAIN`, private trainer halves time), shows (`petWinP` shown = rolled, points by field size, CH at 15 with 2 majors, season points Oct–Sep, `bigShow` Westminster/Crufts/national with BoB→Group→BIS), therapy/guide puppy/SAR/police/retired K9, agency bookings (`petOnSetP`, Pal stand-in 6%), animal awards, breed booms (`S.breedBoom`, `petFee` ×1.4), insurance, breed health, pet accounts (2010+), quarantine on moves. doAct `pet2`, `pet2Week`, `pet2Pick`. |
| `src/eras.js` | Era cards: `ERA_NEWS` by market and LATE scenes in pool `era` (voice test, Production Code, war, HUAC, fronts, the 1948 decree, television, home video, digital). `eraMods` (blacklist, silent, freelance) become lines in `hireFactors`. |
| `src/family.js` | Marriage (fam_propose, fam_wedding), children (fam_kids, births via `M.babyDue`, adoption), costs, school play, focus at 11, coming of age (film/music kids become NPCs via `makePerson`), married spouses don't drift. Heirs: `nextGenAct` wrapper stores estate/company/look; epilogue "Play on as …" → doAct `heir` (`heirAct`: inheritance after 40% estate tax over $1M, the company transfers, fame floor, family-name hire bonus fading over 3 years, a nepo-baby scene). |
| `src/pj2.js` | New production-journey calls: promises (scene, billing, overtime) in `f.promises`, morale (`f.morale` → qBonus ×0.3 at release), call-ins, feuds, the cut-the-promised-scene call, the censor (board by market and era). Calls with `need` are hidden from the draw while unmet. |
| `src/inner.js` | Conditions: Inspired (adv on creative crafts, ×1.15 learning), Slump (dis), Obsession (once; actor/place/cheap film within 26 weeks → +8 quality, else a 12-week slump), Fears from flops/reviews (stage, failure, critics) cured by LATE scenes in pool `inner`. |
| `src/bdays.js` | Birthdays of the inner circle (`bday` hashed week), text/call choices, forgetting costs ties, a gift that week counts double, Up next chip. |
| `src/depth3.js` | Convictions (`BELIEFS`, slots 2 + level/2, 8 weeks to internalise, conditions), the junket at release (one question, cha/com roll), post-mortems (`M.lessons`, on the Forecast tab), the Scrapbook app. |
| `src/depth4.js` | Playing age on acting parts (`PART_AGES`, `playAge`, hire factor; harsher before 1990), Bazaar items that buy youth, Dependent / In recovery traits, the intervention and the bad-week scenes (pool `dep`). |
| `src/depth5.js` | Board confidence for company jobs at rung 4+ (`confParts`, quarterly reviews, spend confidence, parachute negotiated at hire, out below 20). Panel on Work. |
| `src/depth6.js` | Fans by genre (+cinephiles, families) from your releases, decaying 0.4%/week, a hook bonus on your next film by genre (`fanHook`), Standing panel. The crisis room when a secret comes out (deny, apologise, lawyer, fixer, bury; a second wave if it went badly). |
| `src/depth7.js` | Skill voices on decisions (a line when a check uses a skill ≥ 16 or ≤ 6) and the advisor ring on production calls (agent, mentor, partner each back an option; their record is kept in `M.advRec`). |
| `src/cinema2.js` | Owning a cinema (Money group app): venue kinds by era (nickelodeon … microcinema, video store 1978–2010), listings every 8 weeks, weekly programming from new releases and classics, events (Q&A, double bill, members, midnight), the manager's picks when you don't, rental terms in `cinHire`/`cinTerms` (70/60/50% sliding scale; repertory 35% or a minimum; video 40%), concessions after cost, reputation with mean reversion, `cinWeek` books in `C.hist`. Money is in the cinema's own city (`cinMoney`). Heirs inherit it. |
| `src/confid.js` | Confidant ranks 1–10 (`CFD_AT`, points from positive `addTie` ×0.35), perks at 2/4/6/8/10 (`CFD_PERK`: vouch on hires, a favour a season, craft growth, double word, follow you), asks at ranks 3/6/9 (`cfd` inbox; saying no stalls 26 weeks). Fame quirks (`QUIRKS`, from 26-week habit counts in `M.acts` once fame ≥ 5; fade when the habit drops below 2/3 of the line), shown as 🎭 conditions. |
| `src/depth8.js` | Life verdicts at 30–70 (`verdictWeek`, `DECADE`), the Desk app (`DESK_CARDS`), skill rust (`rustWeek`, floor 80% of best), ageing fans (`fanAgeMul`), household bills (`billWeek`, `billMul`). |
| `src/world2.js` | The world's decision-makers: breakouts and busts, company character (`coDNA`, `companyTaste`), failure as sale/rescue/closure (`coFail`), the audience calendar and competition (`boxCalendar`, `f.why`), one economy (`econLevel`, `econGL`/`econBudget`/`econDemand`, strikes, tax credits), NPC illness and recasts (`npcLivesMonth`), voted awards (`VOTE_BLOCS`, `awardVote`), declines with reasons, career moves, sequels with fatigue, dividends and founding (`coYear`), the "why it did that" panel (`boxWhyHTML`). |
| `src/latepace.js` | Late-game offers need a cause: patronage at level 5 with a released film (once each), windfalls need a body of work (`LATE_CAUSE`), 156-week cooldowns, one late offer per 6 weeks, crowdfunding owed to a project. |
| `src/pressure.js` | Stress from the job (+0.7 a week, +0.6 a level, +2 for a second job), shoots (+2), post (+1) and enemies (up to +3), shown as "Under pressure"; relief from a single scene or story beat halved. |
| `src/social2.js` | Contacts fade after two years unseen (`KEEP_TAGS` exempt; soft cap 240), text variety (`TX_ALT`, `TX_TAIL`), at most two offers a week. |
| `src/scenes3.js` | No scene repeats within 26 weeks; opening lines that cite their cause (`sceneFact`); callbacks to earlier choices (`M.choiceLog`). |
| `src/sides.js` | Round 19 side industries: syncs priced by use (`SYNC_FEE`), score commissions, royalty statements, session calls, door deals, the podcast episode-seven wall, demonetisation weeks (`demonWindow`), creator burnout, stage runs with closing notices, transfers and film options, TV script fees and created-by royalties, say-on-pay and activists (`sidePick`). |
| `src/about.js` | The About app: credits, font licences, sources, the fiction notice and the AI note (`aboutHTML`). |
| `src/safety.js` | Real people still alive: no negative traits or events, no simulated death, no lookalike portrait (`realLiving`, `NEG_TRAITS`, `NEG_EVENTS`). |
| `src/mcampaign.js` | Round 22 awards season for music, podcasts, theatre and online video: October house campaigns paid from `S.mh` (`mcHouseSpend`, `S.mcp`), the player's fortnightly campaign steps October–November (`MC_STEPS`, `M.mcamp`), nominations in early December (`mcNominate`, `S.mnoms`, five per headline category), and a January ceremony that picks among nominees with weights `score^4` (`mediaAwardsWeek` wrapper). |
| `src/wdcal.js`, `src/wddata.js` | Real film output by country and decade from Wikidata (counts only, fetched by `tools/wikidata_films.js`, generated `wddata.js`); `wdFactor` bends `hubProd` halfway towards each country's historical share (×0.6–1.6); the World app's almanac. |
| `src/sidecrit.js` | Round 21: critics for music, podcasts, theatre and online video (`SIDE_OUTLETS`, `sideReviews`, hashed so no dice stream moves; `r.cs` on notable act releases nudges fans; the player's releases get `w.cs`, a review mail and a follower nudge), yearly showcase festivals (`SIDE_FESTS`: Northbound in March, Creator Summit in June, Fringe Fortnight in August, the Listening Room in September; lineups of 12 by reviews and momentum, a breakout chased by houses via `mhMomentum`; the player applies with their best work, plays a slot and can win a label or sponsor offer), and the house desk (`sideDeskWeek`: working at a label, network, studio or theatre brings sign/pass and keep/drop calls on the real books, judged 26 weeks later). |
| `src/streaming.js` | Round 20 streaming business: services with subscribers, price, ad tier, spend, debt and a share price (`SVC_META`, `SVC_PATH`, `SVC_PRICE`); `svcQuarter` (adds from the growth path × appeal, price rises, ad tiers from 2022, the password crackdown, moods land grab / steady / profit pivot, sports rights, mergers and folds); licence bids scale with mood (`svcBidMul`, `svcLicMul` in `afterlife`); the cinema window and index (`cinemaWindow`, `cinemaIndex`); nine `sv_` jobs, the fortnightly desk (`SV_DESK`, `svDeskPick`), cost-plus buyouts, overall deals, bought streams that get caught (`svDealsWeek`); the Streamboard app. Probe: `tools/probe-streaming.js`. |
| `src/acts.js` | Musicians, creators, podcasters and stage acts as real people (~2,100, `actMake` via `makePerson`, hashed): fans, releases (`actRelease`, `actUnits`), weekly output (`ACT_RATE`), churn and a field ceiling on growth (`ACT_CHURN`, `ACT_CAP`), new acts and retirements yearly; charts read real releases; release pages (`mrel:`), person pages with discography (`actSection`); merit awards; `worldTally` for the loading line. |
| `src/improv.js` | The improv and sketch life: theatres per city (`impTheatres`), classes, jams, house-team auditions, indie teams, festivals, teaching, corporate and cruise gigs, the late-night packet, scouts, fans, owning a theatre (`impOwnMonth`: pay policy, the open letter, closing); dreams `improv`, `sketch`, `drag`, `promoter`, `themepark`, `warmup`, `caster`; the Improv app. |
| `src/houses.js` | Labels, podcast networks, creator studios and theatres keep books (`S.mh`): revenue from the roster's units (`MH_RATE`), royalties and recoupment (`MH_ROY`, `p.deal`), quarterly signings by momentum (richest first, `MH_CAP` roster caps), re-sign / poach / drop at deal end, cuts, sales, closures, private-equity rescues for majors, relaunches of closed names; overhead adapts yearly; the player's own record deal follows its label (`mhPlayer`); company pages show the books and the roster. |
| `src/tvlive.js` | Television from the first year of play: quality from the show's people (`tvlQ`), yearly renewals from audience against the channel bar, reviews, age and the streamer's mood (`TVL_RENEW`, `S.tvl`), merit Emmets for live years that move winners' standing and fame (`tvlAwards`). |
| `src/trailer3.js` | Round 23 trailers: camera moves on every shot (push, pull, pan, tilt), parallax layers, actors who breathe, whip cuts and light leaks timed to whole beats of the score (`tv3Retime`), letterbox, spoken narration and dialogue through `speechSynthesis` with a voice toggle (`TV3.voice`), billing block (`tv3Billing`); the score fades when a trailer ends. |
| `src/careerpay.js` | Round 23: the Careers page's pay column. A career is matched to the game's own posts and jobs by its words (`cpIndex`, `cpMatch`), and shows a day rate by level (`CP_LEVEL`) and what you have earned at it (`careerPayCell`, `careerPayDetail`); sortable. |
| `src/crossover.js` | Round 23: once a year on the world's dice, songs from real acts land on big films' soundtracks (`f.song`), studios buy acclaimed plays, networks adapt big podcasts and studios sign creators; recorded on the act (`p.cross`, "Across the business"). |
| `src/dna.js`, `src/dnapools.js` | Round 24 story DNA: hero (job, flaw, wound, want, need), opponent, ally, world, loss, signature image, inciting incident, midpoint, ending (`DNA_END_KEYS`), theme argument and structure (`DNA_TRICK_KEYS`), drawn by hash from hand-written pools (`dnaMake`). "Write what you know": `lifeSeeds` turns the player's exes, rivals, family, old jobs, city, pets and losses into traits with a note. Scripts store it (`sc.dna`, made in `newScript`); films get it by id (`dnaOfFilm`, cached outside the save; sequels found by title keep hero, world and image); plays and musicals store it at release. |
| `src/wlib.js`, `src/wlib-*.js` | Round 24 writing library, written once and committed (format and rules in `docs/WRITING-LIBRARY.md`): about 940 screen fragments, 658 dialogue exchanges, 984 lyric lines, 1,071 stage/podcast/video/musical fragments, 980 reader's notes, critics' lines, trailer voice-over and speech fragments. Each is tagged by genre, tone and craft level 1–3. |
| `src/storyengine.js` | Round 24: picks fragments by DNA and craft (`wlPick`, `wlDist`) and writes loglines, beat sheets, synopses, screenplay pages with the structure visible on the page (`dnaScene`, `dnaPages`), reader's notes (`dnaNotes`), critics' lines, trailer voice-over, speeches, song lyrics rhymed in pairs with a chord chart that plays in the browser (`songLyric`, `songPlay`), plays, podcasts and videos. |
| `src/storyui.js` | Round 24 wiring: "Where it comes from" on the new-script form, the DNA card on the Story tab (structure and ending are the writer's choice, action `swdna`), the Read tab, a small score adjustment for fit (`finishDraft`), "The story" on film pages, critics and trailers from the DNA, the awards speech, structures that come into fashion after hits (`dnaTrendYear`, `f.dt`), and story panels on works pages. |
| `src/trailer4.js` | Round 25 trailers: an edit in acts (`t4Plan`: cold open, setup, turn, build, climb, silence, title, button, date), moving footage (camera keyframes per shot, actors walking in / turning / closing in, parallax, focus pull, genre grades and weather overlays, kinetic word-by-word text), and a score scheduled on the audio clock against the edit (`t4Score`: per-genre key, progression and arrangement following the edit's energy, riser, silence, slam; compressor + limiter + reverb). The picture follows the audio clock. |
| `src/display.js` | Round 25: full screen on the first click or key (`fsEnter`), Esc or the corner button for windowed, remembered per device (`ab-display`). |
| `src/lifedash.js` | Round 25: the need-meters over the room are removed; a data strip above the room (`lifeDash`) shows net worth, runway, energy, stress, standing, fame, network and level with 12-week sparklines from `M.hist`. |
| `src/streams.js` | Built last: the world's dice per system and week (`wstream`), the player's own dice for actions, so two careers on one seed share the world. |
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

## Art and palette notes
- `homeSceneSVG` (home.js) draws sky by time of day, a two-layer skyline (`homeSkyline(hub,w,h,night)`), curtains, skirting, light shafts, a vignette; empty floor spots get tier furniture (`ROOM_FILL`, `fillPieceSVG`) and empty walls get clocks/mirrors/prints (`wallFillSVG`). Purely visual: no effects.
- Portraits: studio backdrops (bokeh, beam, sweep, halo); full-length figures draw the head at 1.12× (`headIn` group) and hands with `figHand`.
- Full figures get an ink outline (`${uid}ink` filter) and fabric folds; the home scene avatar wanders between activities (`.me-walk`, `data-acts`, interval in home.js).
- Tables never scroll sideways: `fitTables()` (after render) labels cells and stacks tables too wide for their box. Generic `data-ui`/`data-uiq` controls set `UI[key]` and re-render.
- The computer's colours are tokens (`--os-*`) set per palette on `:root[data-pal=…]`; don't hard-code blues inside `.os` rules.

## Tests (run all before publishing)
System checks: `node tools/systemtest.js` (30 checks: markets, bank, company, film financing, co-investing, making, contests, home, Bazaar, weekly systems, NaN guard, replay); must print `0 failed`.

Long playthroughs (find repetition, quiet stretches, balance drift): `node tools/longplay.js <crew|actor|writer|musician|creator|producer|student|heir|dj|standup|publicist|showrunner|podcaster|gamedev|critic|bouncer> [years] [out.json]` (dream archetypes set `dream`; `bouncer` changes dream three times), then `node tools/longplay-report.js out.json... [--top N]` (progression per year, messages per channel, share repeated within a year, most repeated lines). `SAVE_OUT=x.applebox` also writes the career as a save file the Saves page can import (useful for looking at late-game screens in the browser).
```
python3 tools/build.py
# also syntax-check the built page: extract the <script> and `new Function()` it (a template slip breaks the browser but not every Node test)
node tools/playtest.js 60          # bot career; must print "replayed … IDENTICAL"
node tools/rendertest.js 40        # same, opening every page each week; catches pages that roll dice
node tools/fuzz.js 5 60            # random careers; every line must say "ok"
NODE_PATH=$(npm root -g) node tools/uitest.js <outdir>   # Playwright; needs "SAVE OK", overflow 0
node tools/blocklist.js            # real names in anything the page can show; must print total 0 (the build warns too)
node tools/safetytest.js 2027 15   # real people still alive: no negative traits, events, deaths or lookalikes; nBad 0
```

Standing probes from the audit (Round 19), with the targets they are held to:

| probe | measures | target |
|---|---|---|
| `node tools/probe-world2.js <seed> 15 out.json` | a world with no player, 15 years | tier-1 studios closed outright < 10% of 85; active companies within 15% of the start; top-30 by fame has ≥ 8 newcomers; awards don't always go to the best film (share 0.5–0.65); busiest month 3–4.5× the quietest |
| `node tools/probe-pressure.js <seed> 104` | a working bot's weekly energy low and stress | energy weekly-low median 35–50; stress over 40 in 10–35% of weeks; no burnout in the first year |
| `node tools/probe-player.js`, `probe-paths.js`, `probe-cash.js`, `probe-jump.js` | the audit's career, path, money and level-jump probes | see the audit handoff in `handoff/` |

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
- Income tax (`taxOn`, finance.js): effective-rate curve on the year's running total in 2027 dollars (8% at $15k → 41% at $1M), none before 1913, 35% of it before 1941. Applies to wages, script/producer fees, media earnings, exec bonuses; not to investment returns.
- Exec pay: salaries only on the ladder (CEO $4M at a major); packages add bonus (150% target for CEO) and share grants (6× salary over four years for CEO).
- Sector stocks grow ~3.5% a year real (less the yield), anchored at 2026; quarterly dividends by sector yield (`sYield`); BOX50 yields 1.8%.
- Energy: `SLEEP_BASE` 20, rest −13, stay in −6, work blocks 11/12/15 (+seniority, +3 per extra job, cap 21). `restGuard` (run by `autoCal`, so autopilot only, and every block stays editable) turns the least necessary blocks into rest when the plan would drop below 32 energy: work and school first, then rest, then hobbies. Study now displaces classes and nights out before rest (`OBLIG_RANK`).
- Saves: never depend on replaying old logs across versions. World-gen must stay deterministic (rnd draw counts) so the baseline matches; mulberry keeps its state on `f.s`.
- The computer is the only main screen: `viewDesk` maps any `UI.dtab` to its OS app (`DT2APP`); `playStep` always lands on Home (or Today with a decision). The space bar advances from any page unless you're typing in a text field.
- Job hunt pause: `M.focus.noHunt` (action `focus` with `noHunt`); autopilot replaces hunt blocks (study if enrolled, else by day focus).
- School ratings: `schoolRating` (out of 10, by percentile: 13 of 152 at 9+, median ~5.3); alumni hiring bonus and "great school" checks use it (`eliteSchool` = 8.5+).
- Messaging: gossip only about known people you have feelings about (|opinion| ≥ 8), at most one every 4 weeks; newsletters and spam replace their previous issue; the mail inbox excludes newsletters and tracks read (`m.rd`).
- Co-investment equity recoups 120% first, then half the rest; studio films are pro rata after a 15% fee. Statements at release +10 weeks, then yearly for three years.

## Latest rounds (X and after)
- Investors: `angelsOf` = 12 regulars + 6 that rotate each quarter (`Math.floor(S.week/13)`); `ANGEL_EXPOSURE` ties each to a sector; `angelFortune` (1-year return) sets worth, ticket and appetite; under .72 they step back, over 1.3 they're flush.
- Recover day focus plans every free block as rest (`autoCal`, pins still win).
- Table sorting: `cellVal` (jobboard.js) reads leading ▲/▼ as signs, so 1W/1Y sort by value, not closeness to zero. Yield column is "Dividend / yr".
- Vacancies: `hubStaff` (corporate.js) fills from a wide pool, then a final pass fills any empty seat; `hop` (companies.js) falls back to staffOf. 0 of ~4,000 seats empty.
- Room avatar moves rarely (home.js interval, `roomT % 10 || Math.random() < .35`).
- Never use `confirm()`/`prompt()`/`alert()`: the artifact frame can block them (they then return no). Use a two-click button instead (see `sBtn` in saves.js, or Abandon career).
- The character creator stores the name on every keystroke (input listener in index.html), since clicks re-render the form and Safari doesn't blur on button clicks.
- TV people pools (`tvPools`) only use the first `S.tvN` people (saved in the world), so a loaded game picks the same showrunners and casts.
- Your line of work (`coreWork`, `CORE_WORK` in autopilot.js): per role, a department regex on the job catalogue row (`jobRow`), a title regex, and an exclusion regex. `jobRelevance`: 1 core, .8 shares your skills, .6 your industry, .3 anything; `craftJob` = core only, so a producer's "craft" is producing, not production law.
- Casting calls (`castingBoard`, career-depth.js): actors see 2–4 speaking parts a week on films in town (`p.casting`, allowed one tier above the usual board range). Tiers: Day Player 1, Guest star (TV) 2, Supporting 2, Recurring 2, Series regular 3, Lead 4; TV acting parts carry `actor: 1` (crowded field, looks and presence).
- Star power: acting posts of tier 3+ add a hiring factor from fame ((fame − 20) × .035, ±1.2); direct offers of tier-3+ acting parts need fame ≥ 20 + 5 × tier. Casting calls reach two tiers up only for parts of tier ≤ 2.
- Late investments are tuned to lose a little on average with rare big hits (plays and pickups ~0.85–0.95×, rights and relic offers 0.55–1.6× / 0.6–1.5×, buy-outs 0.85–1.25×). Fate windfalls are capped at 5% of cash up to $25k, and the inheritance happens once (`M.flags.inherited`).
- Standing has a soft ceiling for the player (monthly world loop in index.html): above 90 it eases back 15% of the excess a month; above 80 it fades 5% a month while you have no job.
- The phone rings (`callsMorning`, arcs.js): at level 3+ with nothing in your craft on, a direct offer (inbox kind `offer`, title "A call: …") every 8+ weeks, own industry first, near your tier; no interview. Autopilot skips posts more than a tier below `tierLevel()` once you're established.
- Brand endorsements: one offer a quarter at most; a brand you fronted waits 156 weeks (`endorseWeek`).
- The room shows two framed posters (`roomPosterFilms`: your released credits, then your favourite films via `favFilm`) on free left-wall spots, and a craft prop by the avatar (`craftPropSVG` by `MAIN[role]`). Your title grows: `roleTitle` (hopeful → working → the job → celebrated).
- Autopilot is craft-first (`rankedFits`, `craftJob` in autopilot.js): your own craft, then your industry, and odd jobs only with under 12 weeks of runway; while you only hold jobs outside your craft it keeps applying for craft work. `hasFooting()` (late-game.js): you count as "not looking" only with a year's runway, level 2 and a foothold (2 credits, a year of craft work, 4 releases, or level 4).
- `lateRich()` is $150k, or two years' runway at level 4: the late game used to start with a year of savings and snowballed into millions without work.
- `careerLevel` is capped by a body of work (credits + released works ÷ 2, +3 for a senior company rung): under 2 → max 3, under 5 → max 4.
- Late opportunities cool down for 104 weeks (`late`) / 78 (`indie`); industry invitations per kind every 26 weeks; at most one exhausted mistake a week.
- Boardroom crash fix: brand endorsements live in `M.brandDeals` (starmeter.js, `brandDealCount`); the Boardroom only reads `M.deals` entries whose `kind` is in `DEAL_STAGES`; `cl(id)` shows "a company no longer listed" for a missing company.

## Round 4 decisions (dreams, gigs, deals, paths)
- Dreams replace the role/field picker; the role is derived from the dream. Old logs without `dream` still honour `c.field`.
- Corporate ladder: promotions take 40+ weeks per rung (52 + 24·rung, less for strong results) and the senior floors are gated (`corpGate`: VP standing 30; SVP 42 + level 4; President 58 + level 5 + results; CEO 72 + level 6).
- Media audiences: follower conversion raised (song .02, mv .02, video .03, blip .02, podcast .08) and discovery grows with √followers/30, so steady good work compounds (a weekly singer reaches a label offer in ~2 years; shorts creators reach 5–50k).
- Gig quality is level-relative: 50 + (skill − 4 − 2·lv)·3.2 + snag/control bonuses + noise.
- Deal odds: logistic(1.6·(slack − cost) − .4), clamped 2–98%. Investing slack grows with how much the film still needs (`filmNeed`), your standing over the producer's, and first-look history; studios negotiate less.

## Round 6 decisions

- Memories come from tie changes, not from tagging every scene: any choice in any module that moves how someone feels about you is remembered with its title and your words, so new content gets memories for free.
- Style is read from the words of the choice you made (and a few actions), never from whether the roll succeeded. No axis is "good": each pole has its own path (the Operator and the Firebrand are as real as the Good Egg).
- Personas describe public reputations, kept affectionate; no scandals. Real names never appear in the UI, only the catalogue's in-game names.
- World randomness stays on `rnd()`; style and memory effects on the player use `prnd()`. Style signals hook `applyAct`, not `doAct`, so replays match.

## Design ethos (from round 9 on)

The player should feel like an executive with a trading desk: a lot of information within reach, and every number worth acting on.
- **Dense, legible numbers.** Tabular figures, sparklines, deltas, and ranges with honest bands. Every Terminal panel is computed from the same state the game runs on, never decorative.
- **Every feature has a strategic tie-in and a random factor.** Test it with `tools/ablation.js`: if a bot that uses the feature does no differently from one that doesn't, the feature is empty, so strengthen it or cut it. If it always wins, it's a money printer, so add a cost, a spread or a risk.
- **Show the inputs behind every outcome** (the main criticism of Hollywood Animal; see docs/RESEARCH.md). Film pages have the quality breakdown, "Where the money went" and "Why it did that"; futures show both the market price and tracking.
- **Information is an edge, not an answer.** Tracking is noisy (±15%) and blind to quality, legs and weather. The market is beatable by reading it, not by clicking it: in testing, random trading lost about $280k over two years and trading the tracking gap averaged about +$180k, with large swings.
- **Determinism.** World `rnd()`, player `prnd()`, rendering and forecasts `hashRand`. New forecasts must never draw from `rnd()` (futures and `whyPanel` read only).

## Round 29: side and back views, new shoes, and loading in half the time

- **Views** (`src/avatar4.js`): `figSideSVG(L, age, phase)` draws the avatar in profile (eight walking frames; the
  planted foot meets the floor); the back view is the front body with `FIG_POSE.back` (heels instead of toes) and
  `figBackOverlay` (back of the head, long hair down the back). In the room, walking uses the side frames; the desk,
  window, shelf, records and piano use the back view (`t.back` in `av3Targets`); held props are hidden from behind.
- **Shoes** (`shoeProfile` / `figShoe` in `src/figure.js`): drawn in profile, turned out and foreshortened when
  standing; the same shoe at full length in the side view.
- **Loading** (measured in Chromium, the default new world): 34.5 s → 16 s to a ready world, and the character
  creator stays smooth while it builds (frames drawn during the build up from 284 to about 1,000).
  - The build runs in ~12 ms slices (`archiveStepG` yields after each city; `snapBaselineG` after 1,500 entities;
    `buildYield` uses a MessageChannel, not setTimeout's 4 ms minimum).
  - While history is written, ties are only kept between people in the same corner of a production and who will be
    alive at the start (`release` in index.html): the O(n²) crew pairs were the biggest single cost.
  - `boxCalendar` swept its whole calendar for every historical film (history runs at one week); it now sweeps once
    per week, with the same result. `gcraft` has a string-free cache; the yearly pool filter works in place.
  - `snapBaseline` no longer stringifies and hashes plain values and ties (saves compare those by value).
  - The default new world is **Standard** (the last 40 years plus every real classic); Full is in the new-world
    settings. Full builds in about 23 s. Saves keep their own depth. `BUILD_ID` is now b71 (the world changed).
  - Shipping a prebuilt world was measured and ruled out: the full world serializes to 325 MB (127 MB gzipped).

## Round 28: originals instead of skipped sequels; the avatar walks, sits and lies down

- **Originals** (`src/world2.js`): when a hit doesn't get a sequel, its studio sometimes greenlights an original in
  the same genre (`q.orig` in `seqQ`, often with the same director; `g.origOf`). Originals can earn sequels but never
  spawn further originals (that chain ran away). The rate (16%) puts film volume back where it was before sequels
  were cut: about 300 American films in three years, 13% of them sequels.
- **Shoes** (`figShoe` in `src/figure.js`): real foot size, front three-quarter view, toe box on a sole, ten styles.
- **Poses** (`FIG_POSE` in `src/figure.js`): hooks for legs (H/K/A joints, ground line `ty`, toe `turn`) and arms
  (`A`, `hands`, `front`). `src/avatar3.js` uses them for six walking frames, sitting and holding.
- **Moving through the room** (`src/avatar3.js`): in the room only (`AV3_CTX`), the player's figure is a stack of
  frames (cached per look). Each activity has a target (`av3Targets`): a stool at the desk or piano, lying on the bed
  or mattress, the couch, the window, by the plant. `avGo` from home2.js is replaced: the toon walks there in 2D
  with depth scaling, steps in time with distance, faces the way it goes, gets up before walking off.

## Round 27: SlateOS scrolling, a market that reads the world, real-shaped agencies, and a dozen apps polished

- **SlateOS** (`src/osfix.js`): fixed-height window; the sidebar and the app scroll on their own, keep their place across
  renders (the sidebar no longer snaps to the top), clearer group headings and current-app marker. "How this works"
  scrolls into view. Disabled buttons show `not-allowed`, not the loading cursor (the pet check-up looked stuck).
- **Stock market** (`src/mktlink.js`): `eventsAt` now also reads the news of the week before: the studio's own
  headlines (sequels, rights, first-look deals, set trouble, awards, lawsuits, cost cuts), scandals of people on its
  unreleased slate, hits and flops of rivals in genres it is betting on, strikes and tax credits in its city. Monthly
  feedback: +60% in a year → sells new shares (cash in, news); −45% → cost cuts (`c.cut`, a fifth off every greenlit
  budget for a year). The stock page has "What moved it". Events lag a week so bars never change after the fact.
- **Sequels** (`src/world2.js`): far fewer (gate by `hashRand`, half for real archive hits), subtitles instead of
  numbers most of the time (`SEQ_SUB`), parsed titles (no more "2 2"), `dnaParent` uses `f.seq`.
- **Bazaar** (`src/bzart2.js`): 45 new item kinds, five book covers, and every item its own background, pattern,
  tint, angle and shelf label from its name.
- **Representation** (`src/agencies2.js`): giant full-service agencies, mid-size, talent/literary/below-the-line
  boutiques and management companies (15%); offices, departments, client counts and real clients via `agencyOf`;
  signing gives a rank (junior agent … partner) that nudges booking odds, and the departments covering you.
- **Roger That**: critic grades shift by temperament (`RV_TEMPER_ADJ`), bunch near the top, and sometimes dissent, so
  scores no longer pile up at 98–100. "Gap" became a signed "Critics +N / Crowd +N".
- **Shorts circuit**: ordered by prestige with tier headings. Every real festival and prize name in `contests2.js`
  and `school2.js` was renamed (one prize named a real person); the blocklist now has those names.
- **Film Desk** (`src/fdcuts.js`): the Cutting Rooms shows every budget band with filters, stage in post, tests,
  tracking, sequel/original tags and a key, instead of the ten biggest films.
- **Scrapbook** (`src/scrap2.js`): milestones, press clippings, achievements, jobs, gigs and famous people met, each
  with a drawn photograph or a clipping/stamp, filters and year covers.
- **Studio** (`src/studio3.js`): song starters, new-melody button, a coach line; lyrics get theme/mood, suggested
  lines from the library, a skeleton builder, rhymes and syllable counts. The mix stays the player's job.
- **Paths** (`src/paths2.js`): its own layout (it was borrowing `.paths`, a 220px card grid from another feature).
- **Library**: `wlib-dialogue6.js` and `wlib-dialogue7.js` (2,466 exchanges), `wlib-screen-end4.js` (2,001
  endings), `wgen2.js` (1,600 generator entries), `wsays.js` ("what people say about you"). At 100 works, repeated
  dialogue fell from 12% to 6% and endings from 13% to 5%; at 300 works, 31% to 20% and 32% to 14%.

## Round 26: the library again, so lines repeat far less

- Asked for: expand the writing library further so lines repeat far less.
- Added `src/wlib-screen-open3.js` (1,510 openings), `src/wlib-screen-act3.js` (1,203 actions, 900 endings),
  `src/wlib-dialogue4.js` and `src/wlib-dialogue5.js` (1,803 exchanges), `src/wlib-song3.js` (2,040 lyric lines),
  `src/wlib-other3.js` (2,040 stage, podcast, video and musical fragments): 23,835 fragments in all. Most new lines
  are for all genres, where repeats came from.
- `src/wgen.js` adds about 1,270 sounds, lights, gestures and templates to the generator pools in
  `src/storyengine.js` (`GEN_*`), which now also writes some mid-scene action lines (`GEN_ACTION`).
- Measured by writing pages for many works with the story engine and counting fragments already seen: at 100 works, repeated
  openings fell from 25% to 6%, dialogue from 21% to 12%, actions from 21% to 8%, endings from 32% to 13%.

## Round 25: a library three times larger, no AI, full screen, trailers rebuilt, feet and shoulders

- Asked for: far more writing so lines don't repeat over many hours; take out the AI "Read the pages"; fix the hint box
  drawn as two red semicircles in SlateOS; start full screen with a windowed option; trailers that move and cut to
  the music, with sound that doesn't clip or loop; better feet and body; replace the cutesy bars over the avatar.
- Library: about 14,300 fragments (was about 5,600): `src/wlib-*2.js`, `src/wlib-dialogue3.js`,
  `src/wlib-screen-open2.js`, `src/wlib-screen-act2.js`, and `src/dnapools2.js` triples every story-trait pool.
- AI: removed (`readPages`, the `sample` call, `--no-ai`); "Read it" opens the game's own pages (`CLICK_HOOKS.readscript`).
- Hint box: the piano roll's `.pr` rule (16px high, `all: unset`) also matched the app primer box; it is now `.proll .pr`.
- Bodies (`src/figure.js`): shoes in three-quarter view (toe box toward the viewer, sole, heel); sloped shoulders and a
  rounded shoulder cap so sleeves don't end in flat tabs; the torso tapers from chest to waist.
- See the source map rows for `src/trailer4.js`, `src/display.js` and `src/lifedash.js`.

## Round 24: every work its own story, written without a model

- Asked for: lower gig pay so releases come first; then a way for scripts and other creative works to feel unique
  and creative without calling a model each time.
- Gigs: the fee multiplier tops out at 1.8 (was 3) and offers come less often (`gigFee`, `gigOfferChance`).
- The approach (built in full): a story DNA for every work (`src/dna.js`), drawn partly from the player's own life;
  a large hand-written fragment library (`src/wlib-*.js`) tagged by genre, tone and craft level; an engine that
  assembles beat sheets, screenplay pages, notes, reviews, trailers, speeches, lyrics and chords from them
  (`src/storyengine.js`); and wiring that carries the DNA into films, reviews, trailers, awards, sequels and fashions
  (`src/storyui.js`). See the source map rows for these files.
- Rules held: no dice stream moves (everything is hashed), views never write to the save, nothing calls the network.
- `tools/fuzz.js` builds four worlds in one process; on machines with a small default heap run it as
  `node --max-old-space-size=6144 tools/fuzz.js` (the Round 23 build fails the same way without it).

## Round 23: loopholes closed, offers from the world, trailers, fine-tune sliders

- Asked for: close the festival shortcut and the late-game offers first, together with the phase 0 removals; offers
  and big events from the world; crossover between the fields; separate dice; avatars you can fully customise in the
  manner of management and role-playing games; a working pay column on Careers; the fourth still repeating; music
  running on after trailers; trailers with style. The real-people decision is recorded in `docs/DECISIONS.md`.
- Money: a songwriter's catalogue now gets one sync placement at a time instead of one roll per song, and fame lifts a
  sync fee by at most 80% (`syncWeek` in `src/sides.js`); jobs for hire pay at most three times the base fee at the
  top level, not six and a half (`gigFee`); the late-game offers pay less (first-look deal, brand work, consulting,
  masterclasses, the yield on a ranch or a cinema). On the songwriter bot (seed 2027, five years) music now earns
  more than offers. The festival probe (`tools/probe-jump.js`) still shows no jump from one unfinished film.
- Offers from the world: film calls (`callsMorning` in `src/arcs.js`) come more often after good credits and
  well-reviewed releases, and the caller is a real person with a reason (worked with you, put your name forward, saw
  your film, a friend vouched).
- Crossover, trailers, Careers pay: see the source map rows for `src/crossover.js`, `src/trailer3.js` and
  `src/careerpay.js`. Stills (`src/cinema.js`) no longer repeat a setting in one film and show the film's real cast,
  dressed for the scene (`castFigure`).
- Avatars: sixteen fine-tune sliders (height, weight, muscle, shoulders, and face length, cheekbones, jaw, chin, eye
  size and spacing, brows, nose width and length, lips, mouth width, ears) in the look editor (`LOOK_SLIDERS`,
  `lookD`); people in the world get their own random settings.

## Round 22: bodies redrawn, awards season for every field, real output by decade

- Asked for: the "not done yet" items (side-field awards campaigns; Wikidata film data), and bodies, arms, legs and
  neck that look like real people of this world, with the faces dialled in further.
- Bodies (`src/figure.js`): about seven and a half heads tall; contrapposto (one hip up, the other leg relaxed, the
  shoulders tilting against the hips); arms that start inside the shoulder and hang close with a slight bend;
  one-piece sleeves with elbow folds; trousers with ease, knee and hem folds; front-view shoes with a rounded toe;
  relaxed side-view hands with a thumb in front; the head placed lower so the neck is a third of a head.
  Faces: skin-tinted blush, softer eye whites, a cheekbone shadow, a swept hairline on short hair; head-and-shoulder
  portraits raise the shoulders so the neck reads shorter.
- Awards season and Wikidata: see the source map rows for `src/mcampaign.js` and `src/wdcal.js`.

## Round 21: avatars rebuilt, titles, critics and showcases for the other fields

- Asked for: a longer list of title options; avatars that are clean, sleek and close to real (no thumb-like hands,
  a proper neck, finer facial features); then the next work, including the side fields' critics, festivals and desks.
- Avatars (`src/portrait.js`, `src/figure.js`): the head is drawn to life proportions (`FACE_SHAPE`, `faceGeom`:
  eyes halfway down the head and an eye-width apart; almond eyes under a lid; tapered brows; a shaded nose without an
  outline; shaped lips); a neck that widens into the shoulders (`neckHalf`); full figures about eight heads tall
  (`FIG` landmarks, the head placed by `FIG_HEAD`), limbs as tapered outlines (`limbPath`, `crPath`), hands with a palm,
  four tapering fingers and a thumb (`figHand`), no ink outline. Saved looks keep every option. Condition marks
  (`src/living.js`) are drawn in the head's frame (`headXform`). Dev gallery scripts are in the session scratchpad.
- Titles: `docs/TITLES.md` (about 90 options, grouped, with a shortlist).
- Side fields (`src/sidecrit.js`): see the source map.

## Round 20: saves, streaming, acts as people, improv, houses with books, live TV

- Asked for: saves that are smaller and more of them (50 slots, with a clear notice when full); the deepest pass yet
  on streaming (business, day-to-day work, teaching, exploits) shown through play; why the wiki pages were denied;
  side industries closer to film in content and systems; a loading line counting every kind of work; more jobs and
  dreams, with improv as a real life for performers, backers and fans; cleaner avatars (hands, neck, limbs, body);
  a naming once-over for music and the other fields; title options beyond film; creators and musicians as full,
  clickable people.
- Network: Wikipedia and Wikidata were blocked by the environment's earlier network setting; they return 200 now.
  Research is in `docs/RESEARCH.md` (Round 20), names only in source URLs.
- Saves (`src/saves.js`, `BUILD_ID b70`): rounding by field (`SNAP_PREC`), skills stored as differences from the
  baseline, unchanged world fields skipped; ~9.4 MB → ~6 MB compressed at year one. `MAX_MANUAL = 50`; a full
  slot list refuses with a 12-second notice and the Saves page warns when 5 or fewer remain. `tools/savetest.js`.
- Acts as people (`src/acts.js`): fan growth now churns and saturates (it had grown without bound for creators); a star
  listed in two cities is one person (`p.akey`, released from its home city `p.ahub` only), and two different acts
  with one name are told apart by city, "Electric Lanterns (Berlin)".
- Houses (`src/houses.js`) and live TV (`src/tvlive.js`): see the source map. Probe targets: over 6 years about
  7–8 of 37 houses close (tier 2–3 only; majors are rescued), live TV quality averages ~58–63 with renewals near
  70% on broadcast and 50–60% on streaming.
- Naming: 197 names in the media fields (`data/rename/industries.tsv`) and a second catalogue pass of 674 living
  people whose names sat too close to the real ones (`data/rename/catalogue-pass2.tsv`; `tools/rename-quality.js`
  now checks shared surname prefixes and family-name-first names). Korean names sharing only a common family name
  (Kim, Park, Lee) were left as they are.
- Avatars (`src/figure.js`, `src/portrait.js`): one-piece hands with a thumb line, two-segment arms that hang close,
  tapered torso and legs, a wider neck; head bob and blink animations removed.

## Round 19: the audit, the legal pass, and the side industries from sources

- Asked for: finish the comparable-games list; then act on the two audit handoffs (`handoff/` zips: 15 work orders,
  phases 0–4, legal items L1–L12); deepen TV, music, podcasts and the boardroom from real sources so the side
  industries are memorable rather than money engines; the bots should make the world live and breathe together.
- Owner decisions: real people keep pun-on-meaning names (`data/rename/living-safety.tsv` for the living), and
  nothing negative happens to anyone alive in reality; the title may change (options in the report); free release
  with the AI feature switchable; the AI disclosure wording is decided later; `LICENSE` and making the repo private
  are the owner's.
- Legal: no outside requests (fonts embedded); no third-party data (IMDb numbers gone); employers reduced to types;
  ApplOS → SlateOS; real festivals and prizes renamed (L7); about 860 taglines and 1,640 lines of dialogue that copied
  the originals rewritten by seven parallel review passes (L9; edit maps in the session scratchpad); original
  catalogue notes moved out of the page to `data/catalogue-notes.json` and a blocklist scan added (L10, total 0);
  "Read the pages" behind `--no-ai` and a player toggle with an AI-written label (L11); `SOURCES.md` and an About
  app (L12).
- World (work orders 1–9): separate dice for the world and the player (97–99% of world films shared across bots
  with different policies on one seed); breakouts; company character; rescues and sales instead of closures; an
  audience calendar with competition; one economy; NPC illness and recasts; voted awards; declines; sequels.
  Studios lost money on most films because nothing after 2012 paid like home video: a digital sales and rental
  window and a larger first licence were added to `afterlife`.
- Career (work orders 10–14): levels and promotions need a body of work; festival premieres capped; the late game
  needs causes; stress builds from jobs and shoots and a single scene no longer wipes it out; contacts fade; texts
  vary; scenes say why they happen.
- Side industries (`src/sides.js`, research in `docs/RESEARCH.md` Round 19): see the source map row. Sync fees fell
  from about $80k a song to $500–$50k by use, and all side income is taxed.
- Probe numbers against targets are in the Round 19 report; re-run the standing probes (Tests) after any balance change.

## Round 18: a cinema, confidants, fame quirks, and the caveats checked

- Asked for: the cinema, confidant ranks and fame quirks from the comparable-games list, plus a closer look at the two caveats of Round 17 (research figures from search summaries only; heir play never run in a browser).
- Cinema economics (cintest, one year, a bot that programmes by draw and runs an event every week): modern single screen +4% a year on its price, microcinema +22%, 1990 video store +8%, 1965 single +12%, 1955 single +27%. Left to the manager: −18% (2027 single), −4% (microcinema), −9% (1990). Revivals used to draw like new releases for a $150 print (a 70% return); they now draw 0.4× and pay 35% or a minimum. The UI forecast now uses the same `cinHire` as the books (it used a flat 55%).
- Confidants: ranks moved too fast (rank 10 in a year); points are now 0.35× the tie gain. An unanswered decision blocks the week, so the "missed deadline" branch could never fire: removed. Saying no stalls the rank without lowering it.
- Quirks: tested with a scripted heavy poster/texter at fame 7. "Phone fanatic" forms after about 12 weeks and fades about 20 weeks after the habit stops (it used to need a year). Lines raised: posts + likes 12 → 40, texts 30 → 40 per 26 weeks.
- Figures checked by web search (see docs/RESEARCH.md): fixed dog insurance in Sweden (1890 was livestock; dogs 1924), champion titles (AKC: 15 points, two majors under different judges, three judges in all; UK: three CCs from three judges), Westminster entry (top five invited from 2000; before that a draw among champions), cinema rental terms and concession spend. Confirmed: CGC 1989 (10 items), Seeing Eye 1929, TDI 1976, PATSY 1951–86, Palm Dog 2001, UK quarantine end (28 Feb 2000), Crufts 1891, Alam Ara 1931, the blacklist 1947–60. Unverified: when the Golden Collar ended (only 2012 confirmed; the game runs it to 2018).
- Heir play in a real browser (Playwright, `heirshot.js` in the scratchpad): retire with a 21- and a 12-year-old, the epilogue offers "Play on as…" and now says what the heir inherits; clicking it starts the child's career with half the estate, the family company (as owner), the cinema, the family-name hiring line, and six weeks play normally with no page errors.
- Long family run (1962, four children, four years, then three as the heir): three children went into the business as NPCs and one to university; the heir played on. Fixed: a child could be given the parent's first name; the heir didn't know their siblings in the business.

## Round 17: home, map, Film Desk for everyone, pets, Bazaar, and the comparable-games list

- Asked for: a livelier home screen and avatar, deeper pets (shows, working dogs, animal actors), a Film Desk that isn't empty early and explains itself, a working world map, a fuller Bazaar, then features from comparable games implemented from the top of the list down.
- Research (three agents): UX of teaching dense systems (empty states, seats, previews, glossaries, Call it), pets (costs, training ladders, show points, Westminster/Crufts, K9, guide dogs, animal actors and their awards, breed booms), and a ranked list of 26 features from comparable games (see docs/RESEARCH.md).
- Built from that list: era shifts (#1), family and heirs (#2), set morale and promises (#3), board confidence (#4), censorship (#5), inspiration/obsession/slump (#6), audience by genre (#7), the junket (#8), fears (#9), gifts and birthdays (#10), playing age (#11), convictions (#12), post-mortems (#13), skill voices (#14), the advisor ring (#15), dependency and rehab (#17), the crisis room (#22), the scrapbook. Not yet: running a cinema (#20), confidant ranks (#21), audience age drift, Reigns-style desk, fame quirks.
- The forecast desk ran about 1.9× low (comps lag a rising market). Fixes: a "Market now" adjustment (this year's median multiple ÷ the comps') and a calibrated line for Call it (`fdBias`). Always-over calls now win about half the time across seeds (59% and 37%).
- Pets: weekly photo shoots used to grow followers to millions; growth is now capped by looks and fame (60–85k after three years of weekly shoots). Overexposure can't push mood below 15.
- A moved pet used to pine forever (its home city never updated). Pets now follow you, after quarantine where it applies.
- Determinism: never rebuild `index.html` while playtest.js is running. Its replay re-reads the file, and a mid-run rebuild shows up as a false "replay refused".

## Round 16: forecast desk and the ablation re-test

- tools/prodlab.js is a producer lab: a company that keeps two films in the pipeline, with one company-level system switched on per variant (same seed, salt and money). `star` is a control: the package's people without the package.
- Producer lab, 6 seeds × 4 years, average company gain vs base $50M:
  - test screenings $71M;
  - release planner $64M;
  - pre-sales $57M;
  - negative pickup $57M;
  - shooting location $53M (small);
  - slate deals $34M → $44M after cold studios had to sweeten their deals (slate P&L −$10.6M → −$3.3M);
  - packaging $109M, but the `star` control (same people, no package) made $118M. The lever is star power, not the package; the package is a net cost unless you need its access (investors, pre-sales). Terms settled at a 4% fee + 12% of profit, star +15%.
- Career sweep, 6 seeds × 3 years, worth vs base $206k: agent $335k, school $337k (stress ×5), futures $304k, moving $300k, invest $279k, shorts $275k, prestige storyteller $263k, tabloid $175k. Scouting costs money and energy, and a bot doesn't use the information (expected). Schemes look negative on average, but per seed it's chaos (better on half the seeds); befriending has no downside of its own.
- Star fees raised (`leadFee` fame² factor 0.9 → 1.2: a fame-60 lead +30%). Re-test, 6 seeds × 4 years: base $50M → $46M, star $118M → $100M (2.35× → 2.16× base), package $105M → $95M. Stars stay the biggest lever; the next tuning step, if needed, is 1.5.
- Lesson: careers are chaotic; any change to dice consumption reshuffles the luck of a whole career, so judge features by mechanism plus several seeds, never one run.

## Round 15 decisions

- Fog hides information, never changes outcomes: pickers still sort by the true value (a known leak, kept so the best options stay near the top), and the trivia line's reputation words are filtered so it can't give away hidden traits.
- Schemes are slow at the start of a career (about 30 weeks to dig with low charisma): power comes from your skills, so they're a mid-game tool.
- The talent index uses its own long-run average, so it reads as boom or slump in that market rather than an absolute price level.

## Round 14 decisions

- Found and fixed a pre-existing leak: the world tick silently abandoned 0.4% of development-stage films a week, including the player's own financed films (no notice, no refund, loans kept). Films with a finance plan (`f.fin`) are now exempt; they can still collapse through production incidents, which settle properly.
- Slate economics: the first version lost 70% (collapses returned nothing, ancillaries too small); the second returned 3.4× from a low-cost market. Studios now price access from their own record, so a slate averages about ×1.1 with real film-to-film variance.
- Storyteller threat saturates near 100 for a rich, famous player; that's intended (exposure is the point).

## Round 13 decisions

- P&A first followed gross ∝ spend^0.43, and saturation always won. Now the exponent depends on hook and a wider release pays for screens. Saturation wins only for films forecast to open big, and the forecast can be wrong.
- Streaming licences are priced off the theatrical gross (~18%, more for quality and bigger services), so a theatrical hit earns twice. Day-and-date pays a 30% premium up front for a third of the cinema run.

## Round 12 decisions

- Pre-sales were first priced off the budget (MGs summed to ~0.7× budget and beat the territory's real take), which made selling always right. Offers now follow what the territory should return, so a sale is a hedge: the guarantees on a hit roughly matched what it earned abroad.
- Screenings show the cut, not the luck: the critics' night (`luck` in computeQuality) stays hidden, so a great screening is good news, not a promise.
- The awards odds board uses the same scores as the vote, so what you see is what voters weigh.

## Round 11 decisions

- Release-date effects ride on appeal, so the gross moves by about (multiplier)^1 and exports are untouched. Season values were lowered after testing: the first table averaged ×1.06 across a year of releases, which would have inflated the whole box office.
- Only tier-1 blinks make the news (it was 30 headlines a year).
- Stress costs are small (1–4 a choice, scaled by stress traits) because a bot answering every choice the stressful way still stayed under 60; breaking points come from life plus choices together.

## Round 10 decisions

- Capital stack, tax map and strikes built on the existing pieces (finPlan, INCENTIVE, the city walkout), not beside them.
- Strike frequency tuned down twice: the first pass struck at about half of all expiries; now roughly 10–20% per expiry, and higher where the last deal was thin. Real guild strikes are rare and long, so they should feel like events.
- systemtest pins the character salt (it was flaky) and gained two checks: shooting abroad and a strike stalling a film (32 checks).

## Round 9 decisions

- Terminal, ticker strip and command palette (src/terminal.js). The ticker sits inside `.os-main`: placed before it, it broke the computer's grid layout.
- Film futures, bankability, waterfall and why-panel (src/futures.js). Tuning history: with no spread and comps-only prices, a bot reading tracking made +$1.2M in two years, so the price now moves to tracking as release nears, tracking wobbles, a spread applies and positions are capped.
- `fitTables` stacks any table wider than its box. Full-width Terminal panels use `.tk-wide` so their tables stay tabular.
- Ablation (tools/ablation.js). Each run pins the character `salt`. Without it, every run had a different random salt (by design, for real players), and the first sweep measured salt noise instead of features. Clean sweep, 6 seeds × 3 years, mean vs base ($75k worth, standing 33, average stress 10):
  - texting and replies: $243k, standing 43, stress 2;
  - shorts: $194k, standing 46, +1 level;
  - pets: stress 6, standing 42;
  - relocating to Hollywood: $217k;
  - school: $452k, but average stress 30;
  - investing: $139k;
  - negotiating: $128k;
  - futures: +$84k trading P&L;
  - generic gx moves: $198k, standing 49;
  - bold stance: standing 43;
  - **agent: $68k, an empty feature.** Only actors were ever approached, and an agent's listings sat above your level.
- Fix: src/agent2.js. Agents book you directly at your level (`agentBook`, odds by tier and style); crew and writers at level 2+ get approached. Re-test: 5 of 6 careers sign, worth +46%, stress lower, slightly fewer screen credits (agents book paying work, not prestige).

## Round 8 decisions

- Realistic portraits are the default (`LOOK.style` 0 = Realistic, 1 = Cartoon, opt-in); cartoon-only look keys (`CARTOON_ONLY` in career-ui.js) are hidden unless Cartoon is chosen. Condition overlays draw on both styles (living.js wraps `portraitSVG`).
- The room's needs HUD shows labels and numbers, not emoji; `toonSays` gives plain status lines.
- `pickLine` now hashes (index, week, list length): the old formula returned the same line every week whenever the index was the week and the list had 5 or 10 items.
- Release headlines (hit, flop, critics) have five wordings each, chosen by `hashRand(f.id)` so the world's RNG stream is unchanged.
- Map labels are placed greedily without overlaps (`placeLabels`); Europe has a zoomed inset.

## Round 7 decisions

- Credit is generous on purpose: real people list everything they worked on. Only leaving before a week, or before halfway, or a film that never finishes, loses it, and the Credits app says which.
- Company money: overruns hit `f.cost` only (paid at release), a streamer sale replaces the box office for the company, your own company is never closed by the NPC debt rule.
- Negotiation is a single roll per ask with the odds shown; there is no hidden haggling. Walk-away chances are fixed per ask (`NEG_ASKS.walk`).
- Looks change only through state the player can see (energy, stress, ailments, weather, job, time of day); no random cosmetic noise for the player.

## Round 5 decisions
- Dice: every displayed DC is the rolled DC (contests via `compDC`, slate calls, audition DCs from the same target as interviews). Mastery +2 at 19+, expertise +1 at 16+, −1 at 4 or below.
- Intent, not morality: shady options get a real roll (`intent.js`); success means you got away with what you meant.
- Festivals: selection is a logistic of quality vs bar with tier caps (A-list ≤55%), wins ≤30%, windows 4–18 weeks before the month.
- Saves: entDiff compares plain fields directly, skills and ties field by field, objects against baseline JSON (no hashing); browser save ~2.5–6 s on an 80-week game, overlay only after 350 ms.
- Ventures: monthly fail ≈1.6% + more for bad companies; exits rare early; breakouts ×3 for strong ones. A random investor about breaks even; homework pays.
- Luck games stay at real house edges; the Lucky Corner nags (max 6) only while net worth < $400k.

## Moving to another account
- The code and its history are in the GitHub repo `BlimpyKix-maker/1`, branch `claude/cool-sagan-4jiu5s`. A new account needs access to that repo (add it as a collaborator, or fork/transfer it), or can start from the git bundle in the handoff package (`git clone apple-box.bundle apple-box`).
- The game itself is one file, `index.html`; it runs from disk in any browser. The claude.ai artifact link belongs to the original account; a new account republishes `index.html` to get its own link (declare the `sample` capability for "Read the pages").
- The handoff package also holds the conversation log and every request made so far, verbatim. Tell a new session to read this file first, then `your-requests.md`.
- Session rules carried over: build with `python3 tools/build.py`, run all tests before publishing, keep world-gen deterministic, no real filmmaker or award names in trailers and taglines, don't scrape IMDb.

## Ideas queue (after the big notes pass)
- `REAL_LOOKS` covers ~230 famous names; extend it for more (codes documented at the top of the file). The dead are drawn at ≤50.
- People and studios use deliberate parody names ("Harrison Fjord"); only exact real names were removed (YRF, agencies).
- Done: festival bids are split into home-market and international rights, settled per territory.

1. Done: hire DP, editor, composer, production designer; 'Your regulars' panel on the People tab.
2. Done: festival selections bring distributor bids (advance + share, settled after release); the 'parent' background links you into a real family and gives a hiring edge. Careers screen runs job text through `deReal()` to hide real employers/unions.
3. Done: `workCost()` (shooting days, seniority, two jobs) and the grind (`M.grind`: consecutive working weeks without a light week → stress, 'Worn down' condition at 12; trips reset; autopilot protects evenings at 8). Probe: scratch `diff.js`-style bot comparing employed vs idle weeks.
4. Done for world events: most events carry a choice scene (`EV_SCENES` in life-world.js, `scene:` key on WORLD_EVENTS; `needs: 'friend'` picks a friend by week number, no dice). Job families now have 5–11 scenes each (third reel in life-scenes-third.js).
5. Done: fictionalise.js never swaps place/common words (ALLOW) or after 'Mount', and drops lines where a swap is glued to another name. 129 fake titles that equalled or contained a real title were retitled (catalogue + data/fill).
