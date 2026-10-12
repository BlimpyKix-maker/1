# Research notes

Collected in round 9 to find systems that add strategic depth. What has shipped from it so far:

- **#19 Prediction market:** Film Futures in the Terminal (src/futures.js).
- **#15 Bankability index:** bankability() feeds the futures forecast; it has its own Terminal panel.
- **#5 Recoupment waterfall:** 'Where the money went' on every released film.
- **#8 Tracking:** the futures 'Trk' column, plus 'Why it did that' on film pages, which compares tracking with the result.
- **Design lesson (#25):** every outcome shows its inputs.
- **#1 Capital stack:** mezzanine loans, streamer pre-buys, a recoupment order and incentive audits (src/taxstack.js), on top of the existing incentive, pre-sale and gap-loan plan.
- **#3 Tax incentive map:** choose where to shoot. Rates move each January, capped funds run dry, and there's a Terminal map.
- **#7 Release-date chicken:** seasons, crowded weekends, studios blinking and a release calendar (src/release2.js).
- **#16 Traits and stress:** choices that clash with your traits cost stress, coping habits, and traits that change (src/stress2.js).
- **#24 Legends:** almanac, records, lineage and search (src/legends.js).
- **#10 Test screenings and recuts, #12 FYC awards campaigns, #2 pre-sales at the markets:** the Film Desk (src/filmdesk.js).
- **#9 P&A planner, #11 windows strategy, #21 streaming views and licensing:** the Film Desk's Release plan and Streaming tabs (src/distrib.js).
- **#14 Agencies and packaging, #23 storyteller, #6 slate deals and negative pickups:** src/packaging.js, src/teller.js, src/slate.js.
- **#18 Scouting fog, #17 schemes and secrets, #22 supply-and-demand talent pricing:** src/fog.js, src/schemes.js, src/talent.js.
- **#20 Comps and forecast desk:** the Film Desk's Forecast tab (src/forecast.js).
- **#13 Guild cycle and strikes:** contracts per market, talks with visible odds, strikes that stall productions, pay indexes and interim agreements (src/guilds.js).

Everything else below is a candidate for future rounds.

## Report

**About the sources:** Many of the finance numbers below come from industry blogs, mainly vendor content from vitrina.ai, so treat them as tuning ranges, not hard facts. I couldn't find primary sources for several of them. Searches came back empty on The Movies' stress and relationship systems, on Legendary's co-financing deals, and on 2026 guild minimums, so the guild figures are the 2023 contract terms. Football Manager, EVE, Stardew, The Sims and BitLife ideas are drawn from known design patterns, not from sources I fetched.

### (A) Money & deals

**1. Capital Stack Builder (M).** Real practice: indie budgets are a "jigsaw" of pre-sales, incentives, gap loans and equity. Banks lend against the contracts, not against the film ([lexplug](https://www.lexplug.com/outlines/entertainment-law/pre-sales-gap-financing-tax-incentives), [vitrina](https://vitrina.ai/blog/film-presales-gap-financing-2026/)).
- Each production in the Deal Room gets a stack bar: pre-sale minimum guarantees (MGs), a tax rebate, gap loan, mezzanine debt, equity and deferments.
- Each layer has a cost and a recoupment position: senior debt at about 8–12%, gap at about 15–20%, equity premium about 20% plus a 50/50 back-end split.
- The decision: cheap debt is safe but it eats the upside, while equity dilutes the player's points.
- Why it's fun: every film becomes a puzzle with a real risk profile.

**2. Pre-Sales at the Markets (M).** Real practice: sales agents produce estimates per territory. Buyers pay an MG, typically 10% on signing and 90% on delivery, and banks advance 70–90% of it. The market is shrinking: strong indie titles used to sell 20–35 territories and now sell 8–18 ([filmtake](https://www.filmtake.com/distribution/afm-2025-the-truth-about-minimum-guarantees-shrinking-territories-and-surviving-the-reset)).
- Calendar events: Berlin EFM (February), Cannes Marché (May) and AFM (November).
- The player pitches a package (script score, attached star, genre) to about 15 territory buyers. Each buyer has a taste vector and its own budget.
- Each buyer shows an "ask" and a "take" price. Sell early for financing, or hold the territories back for upside after a festival.

**3. Tax Incentive Map (S).** Real rates: UK 34% (39% for VFX, 53% for indie), Georgia 30% transferable, Hungary 30% with a registration cap, Australia 30% location offset ([vitrina incentives](https://vitrina.ai/blog/film-production-tax-incentives-by-country/)).
- Choosing a shoot city in the existing Places system applies a rebate, a crew-quality modifier and a travel or relocation stress penalty.
- Some programmes have caps and first-come queues, so filing late can mean losing the rebate.

**4. Completion Bond & Guarantor Takeover (S/M).** A bond costs about 1–3% of budget, and gap lenders require one ([vitrina](https://vitrina.ai/blog/film-completion-bonds-explained/)).
- Overruns past the contingency (about 10%) trigger a d20 check against the director's discipline.
- On a failure, the guarantor takes control of the production. The player loses final cut and their reputation drops.
- This gives tension to schedule choices such as overtime, reshoots and an indulgent auteur.

**5. Recoupment Waterfall & Hollywood Accounting (M).** The order is exhibitor share, then distribution fee (20–40%), P&A, senior debt, gap, equity and finally net profit. A $75M gross can return only $34M to the producer ([vitrina waterfall](https://vitrina.ai/blog/recoupment-waterfall-explained/)).
- Show every film's waterfall in a chart.
- Points are defined either on gross ("first-dollar gross") or on net. Net points from a studio are "monkey points" that rarely pay.
- Link this to the existing acting negotiation: insiders know net points are a trap. An audit action (costs money, uses a relationship) can recover hidden overhead.

**6. Slate Deals & Negative Pickups (M).**
- Slate deal: Relativity once funded 50% of 10–15 Universal films a year in a $1.5B pact ([Variety](https://variety.com/2008/film/markets-festivals/relativity-universal-reup-pact-1117992783)). The player buys a % of a studio's year, with cherry-pick rights but the studio may hold some films back.
- Negative pickup: a distributor commits to pay the cost on delivery, and the player borrows against that contract ([Wikipedia](https://en.wikipedia.org/wiki/Negative_pickup_deal)).
- Spreading risk across a portfolio is a different strategy from betting on a single film.

### (B) Release & marketing

**7. Release-Date Chicken (M).** Studios claim dates a year ahead and then someone blinks. Real examples: DreamWorks moved Shark Tale ("Sharkslayer") to dodge The Incredibles, and Kung Fu Panda 3 moved twice ([Animation Magazine](https://dev.animationmagazine.net/?p=9447), [Christian Post](https://christianpost.com/news/kung-fu-panda-3-to-avoid-batman-v-superman-release-date.html)).
- A 52-week calendar shows rivals' films, with demographic overlap scores and seasonality (December gives longer runs).
- Moving a date costs P&A already spent. AI studios also blink based on how much they fear you.

**8. Tracking & Opening-Weekend Forecast (M).** Real metrics: the multiplier (total ÷ opening) is about 2.3–3.5. Bigger openings run shorter, and a high share of preview grosses predicts front-loading ([The Numbers](https://www.the-numbers.com/news/229020830)).
- Weekly tracking shows awareness, definite interest and first choice by quadrant (gender × age), with a confidence band that narrows as release approaches.
- After release: an exit-poll grade sets the weekly drop. An A+ grade gives about a −35% drop and a B− about −60%.
- The player adjusts spend based on tracking.

**9. P&A Campaign Planner (M).** On tentpoles, P&A often matches or exceeds the production budget ([everything-pr](https://everything-pr.com/glossary/p-and-a-prints-and-advertising)).
- Split the budget across trailer drops, TV spots, digital, a Super Bowl spot, a press tour that uses star time, and a premiere.
- Each channel builds awareness in different quadrants, with diminishing returns.
- The tradeoff: overspending kills profit, and underspending wastes a good film.

**10. Test Screenings & Recut (S).** Recruited audiences give a "top-two-box" score and a definite-recommend score, and a third act that loses the audience leads to reshoots ([SIS](https://www.sisinternational.com/expertise/movie-test-screening-market-research/)).
- Choose: release as is, recut (costs time, small gain), or reshoot (costs money, a d20 check, may anger the director).
- A director with final cut can refuse.

**11. Windows Strategy (S).** Real data: the gap to PVOD is about 30–39 days, the gap to subscription streaming about 100 days, and some studios now commit to 45 days ([Dark Horizons](https://www.darkhorizons.com/report-pvod-window-stable-svod-shrinking/), [Variety AU](https://au.variety.com/2026/film/global/netflix-promising-45-day-theatrical-window-svod-32770/)).
- The player picks the theatrical, PVOD, subscription-streaming and TV windows.
- Shorter windows earn earlier streaming money but anger exhibitors, so the next film gets fewer screens.

**12. FYC Awards Campaign (M).** Ads, media and talent appearances make up about two-thirds of campaign cost, and publicists earn per-nomination bonuses ([Stephen Follows](https://stephenfollows.com/much-hollywood-campaigns-oscar-cost/)).
- Over the season, the player allocates money and talent appearance days to voter screenings, trade ads and Q&As.
- Each voter bloc (actors, directors and so on) has its own taste.
- Too much spend triggers a "buying the Oscar" backlash.
- Prestige payoff: a win raises star and director quotes about 20–40%.

### (C) People & labor

**13. Guild Contracts, Minimums & Strikes (M/L). Highest-value item in this group.** Real terms: the 2023 deals raised minimums 7%/4%/3.5% for SAG and 5%/4%/3.5% for WGA. Streaming titles in the top 20% of first-90-day viewing earn bonus residuals ([Screen Daily](https://www.screendaily.com/news/sag-aftra-leadership-reveals-minimum-pay-gains-ai-protection-streamer-residuals-formula-in-tentative-deal/5187802.article)).
- Contracts expire every three years. Negotiations run as a world event with a strike-probability meter.
- During a strike, productions stop, the writers' room shuts and actors can't do publicity.
- As a crew member or actor, the player chooses to picket (solidarity rep, no income) or not.
- As a company, the player chooses to hold out or settle early.
- Residuals pay the player over time.

**14. Agencies & Packaging (M).** Agencies collected packaging fees for bundling clients. In 2019, more than 7,000 WGA members fired their agents over it ([TheWrap](https://www.thewrap.com/members/2019/04/17/wga-plans-to-sue-hollywoods-top-four-agencies/)).
- About 4 agencies in the world, each with a client roster.
- A package (writer + director + star) raises greenlight odds but costs a fee and creates a conflict of interest.
- The player can switch agencies. Agents carry hidden loyalty scores.

**15. Bankability Index (S).** The Ulmer Scale ranks how much a star's name alone secures financing and an opening, domestic and international ([Wikipedia](https://en.wikipedia.org/wiki/Bankable_star)).
- Each person gets a domestic and a foreign bankability score, recomputed from their last 5 films.
- It feeds pre-sale MGs (#2) and acting fees directly.
- Stars become assets with fluctuating prices.

**16. Traits, Stress & Coping (M).** In Crusader Kings 3, acting against a character's traits (a compassionate ruler ordering an execution) creates stress. Stress has 3 levels with health penalties, and players use coping mechanisms rather than avoiding stress entirely ([Paradox dev diary 31](https://admin-forum.paradoxplaza.com/forum/developer-diary/ck3-dev-diary-31-a-stressful-situation.1399764/page-3), [ACOUP](https://acoup.blog/2020/09/11/miscellanea-my-thoughts-on-crusader-kings-iii/)).
- The player character and NPCs get 3–5 traits (Perfectionist, Mercenary, Loyal, Diva).
- Selling out, firing a friend or crossing a picket line builds stress.
- Coping options: pets, vacations, vices. Vices have risks such as scandal or health problems.
- This makes the "optimal" choice cost something personal.

**17. Schemes & Secrets (M).** In CK3, schemes advance monthly by comparing agent skill to the target's resistance, and secrets serve as hooks ([PC Gamer](https://www.pcgamer.com/au/crusader-kings-3-sticks-to-what-it-does-best)).
- Schemes: poach a showrunner, leak a rival's bad test screening, win a board seat, get a director to owe you a favor.
- Secrets discovered through relationships become blackmail or favors. Exposure risk scales with how many people know.

**18. Scouting Fog (M).** Football Manager hides player attributes as ranges until scouting knowledge rises. Reputation and connections speed it up ([FM Scout](https://www.fmscout.com/a-FM11-Guide---Scouting--Player-Search.html)).
- Unknown actors, writers and crew show a skill range, e.g. "Acting 9–15".
- Watching their shorts, festival screenings or a chemistry read, or hiring a casting director, narrows the range.
- Discovering a gem early is a big payoff, and it suits the existing shorts circuit.

### (D) Data, markets & UI

**19. Box Office Prediction Market (M). Strong fit with the existing ticker.** On HSX, a film's price equals the forecast gross over its first 4 weekends in $M. Prices adjust after the opening weekend and the film delists after 4 weeks. Players predicted 32 of 39 major Oscar nominees ([Wikipedia](https://en.wikipedia.org/wiki/Hollywood_Stock_Exchange)).
- Listings for upcoming films and for star "bonds".
- The player can go long or short, though insider trading on your own film carries regulatory and reputation risk.
- The aggregate NPC price is a free crowd forecast, but it can be biased.

**20. Comps & Forecast Desk (M).**
- The analyst view studios use: pick 3–5 comparable titles by genre, budget and star, then see a forecast range plus tracking and social sentiment.
- Forecast accuracy improves with an analyst hire or a data subscription.
- Supports #8 and #19.

**21. Streaming Views & Licensing (M).** Netflix measures "views" as hours ÷ runtime and publishes an engagement report twice a year ([Netflix](https://about.netflix.com/en/news/what-we-watched-a-netflix-engagement-report)).
- TV and streaming titles show views and completion rate.
- Plus the top-20% bonus threshold from #13.
- License choice: a cost-plus buyout (fixed premium of about 10–30%, no upside) or a back-end deal.
- Licensing older titles from the player's library gives recurring income, which makes the IP library valuable.

**22. Supply/Demand Talent & Commodity Pricing (M).** In Offworld Trading Company, prices respond to all players' buying and selling. Each company has 10,000 shares, and buyouts cost 20% extra per share held by a third party ([designer notes](https://www.designer-notes.com/otc-designer-notes-17-stock-market/)).
- Day rates for crew, soundstages and VFX vendors respond to demand. Booking stages early is cheap, and boom seasons are expensive.
- For the existing takeovers: add the OTC-style premium for third-party holders, plus defensive self-buybacks.

### (E) Emergent story systems

**23. Storyteller Director (M).** RimWorld storytellers scale threats to colony wealth, linear from about 14k to 400k wealth ([RimWorld Wiki](https://rimworldwiki.com/wiki/Wealth)).
- A selectable storyteller (Steady Agent, Tabloid Chaos, Prestige Drama) schedules scandals, market crashes, strikes and windfalls.
- Event severity scales with the player's net worth and fame. Fame brings exposure.

**24. Legends / Industry History (M).** Dwarf Fortress Legends mode lets players browse generated historical figures and events, then go after a nemesis ([Wikipedia](https://en.wikipedia.org/wiki/Dwarf_Fortress)).
- A searchable "Trades Archive": every film, award, feud, strike and takeover in the world, with person pages and lineage (mentor and protégé, nepo babies).
- Generated headlines reference real history: "Vance's first film since the 2031 strike…".
- Feuds persist across generations.

**25. Moral Dilemmas & Era Trends (S/M).** Hollywood Animal's praised hooks are ethical dilemmas and shifting social trends that change studio paths ([KeenGamer](https://www.keengamer.com/articles/previews/hollywood-animal-preview-build-your-empire-amid-the-glitz-and-grit-of-the-roaring-twenties)).
- Its main criticism is that detailed inputs led to opaque outputs ([enceledean](https://enceledean.bearblog.dev/complexity-and-outputs-hollywood-animal/)). Lesson: always show why a film scored the way it did.
- Implementation: genre-demand cycles (superhero fatigue, horror boom) as visible but noisy trend lines, plus dilemma cards (cover up a star's misconduct, union-busting) that branch reputation and trait stress.

### Build first (in order)

1. **#5 Recoupment Waterfall:** it makes every deal number mean something and gives the existing points/fee negotiation a real tradeoff.
2. **#1 Capital Stack + #3 Tax Map:** a cheap, deep financing puzzle that reuses Places and the Deal Room.
3. **#8 Tracking/Multipliers + #7 Release-Date Chicken:** turns release into active strategy, with legible numbers.
4. **#19 Prediction Market:** builds on the existing stock ticker and gives day-traders a second engine, informed by the player's own insider knowledge.
5. **#15 Bankability Index:** one number that links acting, pre-sales and fees, so careers feel like an asset class.
6. **#16 Traits & Stress:** gives choices a personal cost and fits the existing relationships, memories and pets.
7. **#13 Guild Cycle & Strikes:** a world event that hits every career path at once and creates big shared stories.
8. **#24 Legends Archive:** turns the already-rich simulation into a readable story the player can follow, with very little new simulation.

The general design lesson from Hollywood Animal's criticism: for every outcome, show the inputs that drove it (a "why it opened at $42M" breakdown).


## Round 17 research (summaries; the proxy blocked direct page reads, so figures come from search summaries)

**Teaching dense systems.** NN/g says empty states should report status, teach, and offer a direct path. Civ VI's Eureka bars and Two Point's objective lists informed the unlock checklists. CK3/Victoria 3's nested tooltips informed the underlined terms. Into the Breach, Slay the Spire and Frostpunk preview outcomes before you act. FM shows scouting ranges and has advisors in the inbox. RimWorld's learning helper only teaches when a concept comes up. Tufte's sparklines and Bloomberg's colour conventions shaped the tables. Applied: seats, the desk log, desk notes, world-first empty states, the glossary, Call it, and app primers.

**Pets.**
- Costs: dogs run $1.4k–5.3k a year, horses $6k–25k. Insurance averages $749 a year for a dog and $386 for a cat (2024). Sweden has had pet insurance since 1890 and the US since 1982.
- Training: CGC is a 10-item test; Trick Dog titles; agility runs to MACH (20 double-Qs plus 750 speed points).
- Shows:
  - US champion: 15 points with 2 majors under 3 judges; Westminster since 1877 invites the top 5 per breed.
  - UK champion: 3 CCs. Crufts since 1891.
  - Cat shows since 1871; CFA Grand Champion needs 200 points.
  - Handlers charge $100–125 a show and $500–1,000 at Westminster.
- Working dogs: about 2 in 1,000 candidates become police dogs. The Seeing Eye opened in 1929. Therapy-team evaluation requires the dog to be a year old and to have lived with you for six months.
- Animal actors: about $400–500 a day, with no residuals. Pal went from stand-in to Lassie. PATSY awards 1951–86, Palm Dog from 2001, Golden Collar from 2012. Films drive breed booms (collies +40% after Lassie).
- Quarantine: the UK required six months until 2000.

**Comparable games, ranked (Interest × Need × Depth × Believability).**
1. Era shifts — Hollywood Animal, The Movies, Game Dev Tycoon
2. Family and dynasty — BitLife, CK3
3. Set dynamics and promises — FM, Hollywood Animal
4. Board confidence — FM
5. Censorship — Hays Code
6. Inspiration, obsession, slumps — RimWorld, Dwarf Fortress
7. Audience segments — Democracy 4, Game Dev Story
8. Press conferences — FM, Suzerain
9. Wants and fears — The Sims 4
10. Gifts, birthdays and drift — Stardew Valley

Then: playing age (The Movies), convictions (Disco Elysium's Thought Cabinet), post-mortems and sequel fatigue (Game Dev Tycoon), inner voices (Disco Elysium), the advisor ring (King of Dragon Pass), family bills (Papers, Please), dependency (The Movies), collaborator chemistry, life verdicts, running a cinema (Big Ambitions), confidants (Persona 5), the scandal room, mood-shaped learning, a Reigns-style desk, fame quirks, and decaying neglect (Cultist Simulator).

## Round 18: checking Round 17's figures (web search, summaries checked against two or more sources where possible)

- **Champion titles.** AKC: 15 points with two majors (3+ points) under different judges, and points from at least three judges (AKC "counting points"; Bulldog Club of America). UK: three Challenge Certificates from three different judges, the rule since 1904 (Kennel Club timeline). *Fixed in the game.*
- **Westminster.** The top five of each breed (ranked by dogs defeated, October–September) are invited, plus national specialty winners; entrants must be champions. Before about 2000 the places were drawn from mailed entries (Westminster FAQ; Canine Chronicle; Philadelphia Inquirer 2015; Brownielocks for the date). First show 8 May 1877. *Fixed.*
- **Pet insurance.** Claes Virgin's 1890 Swedish policies covered horses and livestock; the first dog policy was 1924. UK 1947; US 1982 (VPI; the "Lassie" story comes from insurers' blogs). *Fixed (Sweden 1924).*
- **Confirmed:** Canine Good Citizen 1989, 10 items. The Seeing Eye incorporated 29 Jan 1929 in Nashville. Therapy Dogs International 1976 (Elaine Smith). PATSY from 1951 (ended 1986 per Wikipedia; the film category may have ended in 1974). Palm Dog from 2001. Golden Collar first held 13 Feb 2012 (its last year is unconfirmed). UK six-month quarantine ended 28 Feb 2000 (SI 1999/3443). Crufts 1891 at the Royal Agricultural Hall. Alam Ara 14 Mar 1931. The Jazz Singer 1927. Blacklist 1947, broken in 1960 (Exodus, Spartacus).
- **Animal actors.** About $500 a day (Washington Post 2023); handlers $40–70 an hour under Teamsters contracts; no residuals. Matches the game's $450.
- **Cinema rentals.** A DOJ example: 70% for the first two weeks, then 60%, 50%, 40%, with a 35% holdover floor; a 2026 vendor summary gives 70–75% / 55–60% / 40–50%. Guarantees are paid upfront. *Used: 70/60/50.* Repertory terms weren't found; the game uses 35% or a minimum.
- **Concessions.** Cinemark 2024: $5.65 a patron, average ticket $7.30–7.62 (worldwide). The game uses about $5.50, counted after the cost of goods.

## Round 19: the side industries, from sources

Four research passes (October 2026) to make television, music, podcasts, online video, theatre and the boardroom
behave like the real fields: the odds, the money and the calendar. Firm, platform and award names appear only in the
source URLs; the game uses generic terms throughout. **[U]** marks a figure the researcher could not verify. The
"Game rules" lists are proposals; what was actually built is listed in HANDOFF.md (Round 19).

### Television: pipeline, costs, pay, audiences, calendar

I ran 19 searches, fetches and downloads. The WGA and DGA numbers come straight from the official rate-card PDFs, which I downloaded and parsed. **[U]** marks a figure that is unverified or comes from a weak or undated source. Real names are left out.

**Main gaps:**
- There is no authoritative median audience for an average show.
- There are no reliable figures for half-hour comedy cost, series-regular pay above scale, the typical number of seasons, or a current UK pilot process.
- The SAG-AFTRA official rate sheet would not download, so actor rates come from a payroll firm's summary of it.

#### 1. Series pipeline
| Metric | Value | Source |
|---|---|---|
| Funnel per network per cycle | ~500 pitches → ~70 scripts → ~20 pilots → 5–12 series; ~90% of shows fail **[U]** (blog, undated) | https://christopherming.com/how-many-tv-pilots-ordered/ |
| Broadcast pilot orders (5 networks) | 76 (2018) → 64 (2019), including 3 straight-to-series | https://www.hollywoodreporter.com/live-feed/tv-pilot-season-by-numbers-2019-1184694 |
| Pilot volume trend | Once nearly 100 combined; now a smaller, year-round model | https://www.catalystories.org/post/broadcast-pilot-season-by-the-numbers |
| New shows given a full-season order by early October | 22% (2019 snapshot) | https://benton.org/headlines/some-hope-amid-gloom-broadcasters |
| Renewal rate, broadcast | 75% (2025), 68% (2024) | https://www.tvtechnology.com/insights/analysis/study-renewals-for-streaming-shows-continue-to-decline |
| Renewal rate, streaming | 49% (2025), 47% (2024) | same |
| New shows cancelled after season 1 | ~15% of 662 new series (2021–22) | https://thewrap.com/best-worst-networks-vs-streaming-new-shows-cancelled |
| One major streamer, new-series renewals | 75–80% (2016–17) → 23% (2022) | https://whats-on-netflix.com/news/top-10-reports/netflix-us-series-cancellation-rate-2016-2025 |
| Renewal predictor | Cancelled streaming shows averaged 44% season completion | https://www.mediapost.com/publications/article/418304/streaming-show-renewals-harder-to-come-by.html |
| Episodes per season | Network average 15.4 (2018) → 10.2 (2023); streaming 9.6 (2023); seasons over 20 episodes fell from 19% to 4.5% | https://thewrap.com/why-are-tv-shows-getting-shorter-explained |
| Median season length | 22 episodes (2003) → ~13 | https://www.theringer.com/2017/08/04/tv/inefficiency-week-mourning-the-lost-long-tv-season |
| Cable | 10–13 episodes **[U]** | https://virtualold.fapam.edu.br/article/how-many-episodes-the-ultimate-guide |
| UK high-end drama | Average under 5 hours per series, down from ~6 in 2018 | https://britishscreenforum.co.uk/wp-content/uploads/2021/04/British-Screen-Forum-High-end-Television-Drama-An-Update-1.pdf |
| Typical number of seasons | No source found **[U]** | — |

#### 2. Cost per episode
| Format | Range | Source |
|---|---|---|
| Broadcast hour drama | $3–8M | https://c-istudios.com/?p=53881 |
| Streaming premium drama | $8–30M+ **[U]** (production-company guide) | same |
| Half-hour comedy | $0.25–1.25M **[U]** (forum post) | https://indietalk.com/goto/post?id=467220 |
| Unscripted | $100–500K; celebrity formats $1–3M | https://c-istudios.com/is-reality-tv-cheaper-to-produce/ |
| Late-night talk | Over $100M per season; reportedly losing $40M a year, which is disputed | https://www.foxnews.com/media/colberts-late-show-reportedly-losing-cbs-40m-year-critics-speculate-politics-drove-cancellation.amp |
| UK high-end TV | Average £2.3M per hour (2019); tax-relief floor £1M per hour | https://www.advanced-television.com/2019/06/12/analysis-british-tv-drama-co-commissioning-record-high/ |
| UK low-tariff drama | £0.8–1.5M per hour | https://www.broadcastnow.co.uk/channel-5/sebastian-cardwell-lower-hetv-tax-credit-threshold-to-500k/5207125.article |
| UK high-end TV, 2025 | £4bn spend across 168 shows | https://www.tvbeurope.com/production-post/uk-high-end-television-production-spend-passes-4-billion |

#### 3. People and pay
**Writers' WGA minimums for May 2026 to May 2027** (all from https://www.wga.org/uploadedfiles/contracts/2026_schedule_of_minimums.pdf)

| Role | Weekly minimum |
|---|---|
| Staff writer, week-to-week | $6,024 |
| Staff writer, 20 out of 26 weeks | $5,164 |
| Staff writer, 40 out of 52 weeks | $4,720 |
| Story editor | $8,421–11,233 |
| Co-producer and above | $9,223–12,304 |
| Writer in a development room (pre-greenlight) | $7,530 for staff level, up to $15,379 for writer-producers |

**Writers' script fees (network prime time):**
- 30-minute story and teleplay: $32,270
- 60-minute story and teleplay: $47,460
- Pilot script: 150% of the episode rate

**Room size:**
- Minimum room (WGA 2026 schedule, same URL): 3 writers for 1–6 episodes, 5 for 7–12, 6 for 13 or more. At least 3 of them must be writer-producers, and the guarantee is 20 weeks.
- Median room including the showrunner: 6–11 writers on half-hours, 5–8 on hours. https://www.wgaeast.org/?p=28316
- Ladder: staff writer → story editor → executive story editor → co-producer → producer → supervising producer → co-executive producer → executive producer/showrunner. The WGA tiers above confirm the bands; the exact title order is **[U]** (general knowledge).

**Directors' DGA minimums for July 2025 to June 2026** (https://edge.sitecorecloud.io/directorsguf4d4-dga2c79-dgaprod1615-f6e3/media/Files/Contracts/Rate-Cards-2025-thru-2026/DGA250501Rates2025thru2026.pdf)
- Network prime-time half-hour: $33,784, with 3 prep days and 4 shoot days
- Network prime-time hour: $57,374, with 7 prep days and 8 shoot days
- High-budget streaming hour: $61,239–68,893
- Hour pilot: $127,496

**Actors' SAG-AFTRA minimums for 2025–26**
- Day performer: $1,246
- Weekly performer: $4,326
- Major role: $6,853 a week on a half-hour, $10,965 a week on an hour
- Source: https://www.wrapbook.com/blog/essential-guide-sag-rates
- Above-scale series-regular pay **[U]**: newcomers about $20–40K per episode, established actors $100K or more, top stars $1M or more. https://ratings.koha-community.org/en/power-cast-salary-per-episode.html

#### 4. Audiences and calendar
- **Measurement:** panel data combined with set-top box and smart-TV data covering 45M households and 75M devices. It was accredited and became the standard for fall 2025. https://www.nielsen.com/news-center/2025/nielsen-begins-updated-era-of-tv-ratings-with-big-data-panel-for-this-falls-tv-season
- **Hits (35-day multiplatform audience, 2024–25):** the top broadcast drama drew about 17.5M; the top streaming series 27.1M and the second 19M. https://www.hollywoodreporter.com/tv/tv-news/squid-game-no-1-series-2024-25-nielsen-1236209554/
- **Average show:** about 3–6M on the same multiplatform basis **[U]**.
- **Calendar:**
  - Upfronts (new schedules announced to advertisers) in the third week of May; ad inventory is sold for an October–September year, and shows left off the fall schedule are understood to be cancelled. https://en.wikipedia.org/wiki/Upfront_(advertising)
  - Fall launch in late September **[U]**.
  - Midseason launches in January–February. https://www.serienjunkies.de/news/serien/das-aendert-sich-nach-den-upfronts-im-us-fernsehen-welche-serien-im-herbst-laufen-und-welche-warten-94319858.html

#### 5. Awards calendar
- **Main TV awards:** eligibility runs June 1 to May 31, nominations come in mid-July, and the ceremonies are in mid-September. https://emmys.com/calendar
- **Press-voted awards in January, guild awards in February–March:** **[U]**.

#### 6. Entry routes
- **Production assistant:** about $15/hour in LA, non-union. https://www.payscale.com/research/US/Job=Production_Assistant/Hourly_Rate/d515e49d/Los-Angeles-CA
- **PA union scale (commercials):** $22/hour from December 2025. https://aicp.com/newsletter/article/122025-local-111-pa-scale-rate-adjustment
- **Writers' assistant / script coordinator:** averaged about $16–17/hour in a 2018 union study. https://www.thewrap.com/hollywood-script-coordinators-iatse-871
- **Ladder:** writers' PA → writers' assistant → script coordinator → staff writer. Climbing it usually needs a long-running show and a mentoring showrunner. https://shmoop.com/careers/tv-writer/odds-of-getting-in.html
- **Film↔TV:** film directors and stars move to series for creative control and pay, while mid-budget film shrinks. https://redsharknews.com/business/item/326-top-movie-directors-move-to-tv

---

#### Game rules
1. Each development cycle per network: about 500 pitches → 70 scripts (14%) → 20 pilots (29%) → about 8 series (40%). Overall, about 1.6% of pitches become a series.
2. A straight-to-series order is about 5% of orders (3 of 64) and needs a star or showrunner rating of 80 or more.
3. A new show starts with a 0.75 chance of season-2 renewal on broadcast and 0.49 on streaming. Adjust by audience; on streaming, a completion rate under 50% caps the chance at 0.15.
4. Episode orders: broadcast 10–13 (22 only for hit comedies, 4.5% of seasons); streaming 8–10; cable 10–13; UK 4–6.
5. Budget per episode: broadcast drama $3–5M; streaming drama $8–15M (prestige up to $30M); comedy $1–3M **[U]**; unscripted $0.1–0.5M; talk $0.5M per night.
6. Room size: 3/5/6 writers minimum for 1–6, 7–12 and 13+ episodes; typical rooms 5–11.
7. Writer weekly pay floor: staff writer $5,164–6,024; story editor $8,421; producer-level $9,223. The player can negotiate up to 2× scale per promotion.
8. Each script credit pays its own fee: $32K for a half-hour, $47K for an hour, and 1.5× that for a pilot.
9. Promotion takes 1 rung per renewed season. Being cancelled on a staff-writer contract has a 30% chance of returning the player to assistant level **[U]**.
10. Directing fees: $34K for a half-hour, $57K for a network hour, $61–69K for a streaming hour, $127K for a pilot. Each episode blocks 15 days (prep plus shoot).
11. Actor pay: guest $1,246 a day; recurring $4,326 a week; series regular $11K a week minimum; a star reaches 5–100× that.
12. Ratings tiers by viewers: hit 15M+, solid 6–15M, bubble 3–6M, likely cancelled under 3M **[U]**.
13. The calendar loop: pitch in summer → scripts in fall → pilots in January–April → upfronts in May → fall launch in September or midseason launch in January.
14. Awards window: work aired June to May counts; nominations in July; win chance tied to quality score.
15. Assistant wages of $16–22/hour drain savings. A mentor showrunner adds +20% to the chance of a freelance script.

#### Moments
1. A pitch lands in the room but dies after the executive changes.
2. The pilot is shot and then passed on during upfront week.
3. The season ends and everyone waits for the renewal call.
4. A staff writer gets a first freelance episode credit.
5. A network note on the cut rewrites act three overnight.
6. The show gets a back-nine order (nine more episodes on a 13-episode season).
7. A showrunner is fired mid-season and the room is reshuffled.
8. A nomination morning, followed by a ceremony loss.

#### Bridges
- **Film:** a feature director takes a limited series for creative control; a TV star gets a film lead.
- **Music:** composing a theme or score, needle-drop licensing, or a musician cast as a series regular.
- **Theatre:** stage actors cast in TV guest roles; a playwright staffed as a TV writer; a comedy show adapted for the stage.
- **Cross-format IP:** a hit series spins off a film, soundtrack album or stage version, and a successful podcast or play is optioned for TV.

### Music: streams, sync, deals, live, scoring, sessions

I ran 21 searches. Most numbers come from secondary trade or industry-blog sources, not the primary reports. The cited pages name real companies, but the game rules below are generic. **[U]** = unverified, single-source or blog-grade.

#### 1. Streaming
| Metric | Value | Source |
|---|---|---|
| Payout per stream | About $0.003–0.005 at the biggest platform, $0.006–0.01 at others, $0.0007–0.002 for video **[U]** | https://www.artist.tools/post/how-much-do-artists-make-per-stream-in-2024-find-out-now |
| Per 1,000 streams in 2024 | $3.0 / $4.8 / $6.2 / $8.8 across four platforms | https://techcrunch.com/2025/03/11/spotify-says-its-payouts-are-getting-better-but-artists-still-disagree |
| Revenue split | Platform 30%, recording 55%, publishing 15% | https://assets.publishing.service.gov.uk/media/62542efd8fa8f54a89b54bd0/Colin_Young___CC_Young_Co.pdf |
| Revenue split, US | About 70% goes to rights holders; about 10.5% of total goes to the composition | https://support.tunecore.com/hc/en-us/articles/4407017691028 |
| Tracks with 10 or fewer plays (2024) | 93.2M of 202M tracks (46%) | https://www.musicbusinessworldwide.com/there-are-now-more-than-200m-tracks-on-audio-streaming-services-nearly-100m-of-them-attracted-no-more-than-10-plays-each/ |
| Tracks with 1,000 or fewer plays (2023) | 158.6M of 184M (86.2%) | https://www.musicbusinessworldwide.com/158-million-tracks-1000-plays-on-streaming-services/ |
| Earnings bands, latest platform report (2025 data) | 80 artists over $10M; more than 1,500 over $1M; more than 13,800 over $100k; the 100,000th artist earned over $7,300. More than a third of artists over $10k are DIY | https://newsroom.spotify.com/2026-03-11/loud-and-clear-music-economics-highlights/ ; https://diymusician.cdbaby.com/music-news/spotify-loud-and-clear-report-2026/ |
| Streaming share of recorded revenue | 69% of $29.6B (2024); about 70% of $31.7B (2025) | https://musicbusinessworldwide.com/11-quick-and-important-takeaways-from-ifpis-global-music-report-2025 ; https://www.musicweek.com/labels/read/ifpi-global-recorded-music-revenue-up-6-in-2025-as-industry-embraces-the-future-on-ai/093789 |

These figures are royalties paid to rights holders. They are not what the artist personally takes home.

#### 2. Sync fees (all-in, i.e. master plus song; each side usually gets half)
| Use | Fee | Source |
|---|---|---|
| Student or festival film | $200–2,000; festival rights about $1k | https://orphiq.com/resources/music-licensing-independent-film ; https://dynamoi.com/learn/statistics/sync-licensing-fee-benchmarks **[U]** |
| Indie film | $1k–15k; up to $10k–80k (typical $45k) with distribution | https://dynamoi.com/learn/statistics/sync-licensing-fee-benchmarks **[U]** |
| Studio film, unknown writer | $10k–25k; up to $250k+ for known songs | https://licensing.routenote.com/blog/?p=4946 **[U]** |
| TV episode | $2k–15k background use; up to $50k featured | https://www.foximusic.com/blog/how-much-is-music-licensing-fee-costs-by-use/ **[U]** |
| National advert | $10k–250k+ | same source **[U]** |
| Trailer | I found no specific range. It is extra on top of the film fee. A $25k–100k range is my estimate | https://www.musicconnection.com/sync-deals/2/ **[U]** |
| How often unknowns get syncs | No data found. Libraries are the main route; they often do not negotiate fees and keep a publisher share forever | https://diymusician.cdbaby.com/music-rights/sync-licensing-explained-read-this-before-signing-with-a-music-library/ |

#### 3. Deals
- **Label royalty:** 15–20%, and recoupment comes from the artist's share only. Example: a $50k advance at 20% needs $250k of revenue to recoup. https://soundcharts.com/en/blog/what-is-recoupment
- **Share that never recoup:** "As much as 96%" of a major-label roster. https://www.berklee.edu/node/2284651 **[U]**
- **Cost to break an artist:** $0.5–2M, of which marketing is $200k–700k (2016). https://musicweek.com/labels/read/labels-spend-4-5b-annually-on-a-r-and-marketing-but-where-are-all-our-new-artists/066750
- **Publishing:**
  - Co-publishing deals pay the writer 75 and the publisher 25.
  - Admin deals charge 10–20%.
  - Advances run $10k–500k **[U]**, over 3–5 year terms.
  - Source: https://orphiq.com/resources/music-publishing-deals-explained

#### 4. Live
- **Door deal:** common in clubs, and the artist carries the risk. **Versus deal:** the higher of the guarantee or 85/15 of the net, and it is standard for mid-to-large tours. https://booking-agent.io/blog/guarantee-vs-door-deal-explained/
- **Split by room size:** 80/20 for 200–800 capacity, 85/15 for 800–1,500, 90/10 above that, all after costs. https://beancount.io/blog/2026/06/02/independent-live-music-venue-concert-promoter-bookkeeping-asc-606-door-deal-artist-guarantee-ascap-bmi-sesac-niva-section-179-stage-lighting-pa-rig-w2-vs-1099-stagehand-per-cap-bar-revenue-kpi-guide **[U]**
- **Venue cut of merch:** 10–25%, rising to 30–40% at some venues. https://tickts.co.uk/blog/guide-to-artist-merchandise-agreements-events ; arena policy at 25%: https://www.missouristate.edu/Policy/Chapter11/Op11_21_3_AncillaryActivitiesandServices.htm
- **Live vs recorded income:**
  - Live is 42% of the average musician's music income. https://www.digitalmusicnews.com/2018/06/27/music-industry-research-association-income-study/
  - For top earners, live is 75–90%+. https://www.cambridge.org/core/books/economics-of-music/music-labour-markets/6782C01F40E4694DB7577D610A517A03

#### 5. Scoring
- **Fees:**
  - Ultra-low-budget films: $2k–10k. https://taxi.com/music-business-faq/ftv/film-composing-fees
  - Indie features: 8k–20k (Canadian guild survey, 2018). https://screencomposers.ca/wp-content/uploads/2021/04/SCGC_Rates-Survey-2018-B1.pdf
  - Range across all budgets: $20k up to over $1M for a studio film. Fees are often a package (the composer pays for musicians), paid in thirds. https://taxi.com/music-business-faq/ftv/film-composing-fees
- **Rule of thumb by budget:** 1.5–5% of the film's budget for the creative fee **[U]**.
- **First feature:** usually through student or thesis shorts, a job as a composer's assistant, referrals, or games and sound design. https://splice.com/blog/how-screen-composers-sustain-careers/

#### 6. Sessions, producers, odds
- **Session scale (2024):** 3-hour session pays $474.07 for a sideman and $948.14 for a leader, plus 14.09% pension. https://mail.nashvillemusicians.org/sites/default/files/MasterScale2024A.pdf
- **Session scale for audiovisual work:** $350 per 3-hour call. https://afm47.org/forms/EMD/2023%20AFM%20SRLA%20MOA.pdf
- **Producers:** 2–5 points, usually paid from the artist's share, plus $1.5k–7.5k per track. https://orphiq.com/resources/producer-royalties-explained **[U]**
- **Who earns a living (UK census):**
  - Average music income is £20,700.
  - 43% earn under £14k; 18% earn over £34k.
  - Only 40% earn all their income from music.
  - Source: https://www.classicfm.com/music-news/almost-half-uk-musicians-earn-less-14000/
- **Who earns a living (US survey):** 61% say music income does not cover living costs. https://www.digitalmusicnews.com/2018/06/27/music-industry-research-association-income-study/
- **Time to break:** I found no data. Labels have moved from building artists over several albums to working on single songs. https://www.digitalmusicnews.com/?p=158460 **[U]**

#### 7. Charts and awards (general terms)
- **Album chart:** 1 album unit = 1,000 paid streams or 2,500 ad-supported streams (rule changed in 2026; it was 1,250 / 3,750). https://ratingsgamemusic.com/2025/12/16/billboard-changes-streaming-rules-giving-more-weight-to-streams-on-hot-100-billboard-200/
- **Awards:**
  - Eligibility window of about 12 months, then a peer vote in two rounds; voters are limited to their own fields plus the general categories.
  - "New artist" requires at least 5 singles or 1 album and a "breakthrough", judged by a screening committee.
  - Source: https://ra-grammy-media.ncp.consulting/uploads/2026/06/69_Rulebook_06112026-FINAL2.pdf
  - Another awards show limits new artists to a debut within 3 years and scores ranked votes 4/2/1. https://www.musicawardsjapan.com/en/category/new-artist-of-the-year/

#### Game rules
1. **Streams:** pay $0.004 (free tier) or $0.008 (paid tier). Split the money 30 platform / 55 master / 15 song.
2. **Release outcome:** 46% of tracks get 10 or fewer plays a year; 86% get 1,000 or fewer. Roll for each release.
3. **Earnings tiers:**
   - Top 100k: $7k+ a year.
   - Top 14k: $100k+.
   - Top 1.5k: $1M+.
   - Top 80: $10M+.
4. **DIY vs label:** DIY keeps about 85–100% of the master share. A label deal pays a 15–20% royalty, and recoupment comes only from that share.
5. **Label advance:** $50k–500k, plus $0.5–2M of label spend that is not charged to the artist. There is a 90% chance the deal never recoups. Each unrecouped album adds to the debt of the next one.
6. **Publishing:** co-publishing gives the writer 75%. Admin deals charge 15%. Advances are $10k–500k over a 3-year term.
7. **Sync fee table (all-in):**
   - Student film: $500
   - Indie film: $5k
   - TV: $8k
   - Studio film: $20k
   - Advert: $50k
   - Trailer: +$25k
8. **Sync odds:** a library deal gives +1 sync roll per year but the library keeps half the publishing.
9. **Shows:**
   - Club: door deal.
   - Theatre: versus deal at 85/15 of net after costs.
   - Arena: 90/10.
   - Venue takes 20% of merch.
10. **Live share of income:** 40% of income at mid level, 80% at star level.
11. **Session work:** $475 per 3-hour session, double for a leader, +14% pension.
12. **Producer work:** a $3k fee per track plus 3 points, paid only after the advance recoups.
13. **Scoring:**
    - Student shorts: $0–1k.
    - Indie feature: a $10k package fee.
    - Studio film: $100k–1M+.
    - Unlocks after 3 short-film credits or 1 assistant gig.
14. **Survival:** start at £20k average music income. A 60% chance music alone does not pay the bills, so allow side jobs such as teaching.
15. **Charts:** 1,000 paid or 2,500 ad-supported streams = 1 album unit. **Awards:** eligible for 12 months; the new-artist award needs 5 singles or 1 album.

#### 8 moments
1. First release gets 7 plays.
2. A door deal where the band loses money on the night.
3. Signing an advance, then learning what recoupment means.
4. An unexpected sync turns into a streaming spike.
5. A royalty statement still shows the account unrecouped.
6. Session work pays the rent.
7. The venue takes a cut of merch it did nothing to sell.
8. A first-round nomination, then losing.

#### 4 bridges to film/TV/theatre/podcasts
1. A sync placement in an indie film leads to the director commissioning a score.
2. A job as a composer's assistant leads to scoring TV episodes.
3. A stage show: songs written for a musical, plus the cast-recording rights.
4. A podcast theme earns a usage fee and opens a route into voice and audio work **[U]**.

#### Gaps
- No primary-source data on how often unknown writers get syncs, on how long it takes to break, or on trailer-specific fees.
- The tracks-under-1,000 figure is from 2023; I did not find a 2024 percentage.

### Podcasts, online video and theatre

I ran 18 searches. Every number below has its source URL. **[U]** means a figure is unverified: it comes from a secondhand or vendor source, I could not match it to its URL with certainty, or I worked it out myself. The game should not name any real people, companies, platforms, venues or awards. This report names some sources, and those names should stay out of the game.

#### PODCASTS
| Metric | Value | Source |
|---|---|---|
| Total shows vs active (episode in last 90 days) | ~4.7M total, ~479k active (~10%) | https://beamly.com/podcast-statistics/ |
| One large directory | 3.02M total; ~16% active; 482,930 active (Jun 2026) | https://podcastindustryinsights.com/apple-podcasts-statistics/ |
| Downloads in first 7 days, by percentile | median 27; top 25% 97; top 10% 409; top 5% 1,010; top 1% 4,579 | https://www.podderapp.com/post/podcast-downloads-benchmarks |
| Same dataset, another snapshot | 28 / 104 / 428 / 1,050 | https://www.acast.com/en/blog/whats-a-good-download-number-for-a-podcast |
| Downloads in first 30 days | top 50% above 87; top 1% above 50,000 (2023) | https://rainnews.com/?p=50413 |
| | top 1% above 23,330 (2026) | https://blog.tritondigital.com/podcast-benchmarking |
| | average ~141; top 10% ~3,400 **[U, secondhand, undated]** | https://www.acast.com/en/blog/whats-a-good-download-number-for-a-podcast |
| Ad CPM (price per 1,000 downloads) | host-read mid-roll ~$24–26; programmatic from $12 | https://www.podderapp.com/post/podcast-cpm-benchmarks |
| | pre-roll $15–25; post-roll ~$10 **[U, vendor blogs]** | https://adopter.media/podcast-advertising-rates |
| How long shows last | 80% never pass episode 10 | https://blubrry.com/?p=91357 |
| | another sample: 93% reach 10 episodes (sample bias) | https://podcastingtoday.co.uk/whichpodcast-reports-growth-and-new-podcast-research-findings/ |
| What makes them grow | ~1/3 of heavy listeners found their latest show on another podcast; 1 in 8 via social media; 1% via paid posts | https://rainnews.com/?p=39469 |
| | 40% search inside the listening app; 18.3% ask a friend | https://www.thepodcasthost.com/listening/podcast-discoverability/ |

#### ONLINE VIDEO
| Metric | Value | Source |
|---|---|---|
| Channel size tiers (channels with ≥1 subscriber) | 40.6% reach 1k; 7.9% reach 10k; 1.30% reach 100k; 0.13% reach 1M | https://vidiq.com/research/youtube-subscriber-benchmarks-2026/ |
| Chance of reaching 1k within a year, by uploads | 0 uploads 0.20%; 1–11 uploads 1.86%; 12–51 uploads 8.65%; 52+ uploads 30.77% | https://vidiq.com/research/youtube-uploads-1000-subscribers/ |
| Revenue per 1,000 views, long-form | $1.61–29.30 (creator survey, older) | https://ca.news.yahoo.com/much-money-youtube-pays-1-120000576.html |
| Revenue per 1,000 views, short clips | $0.03–0.07 typical; US ~$0.33 | https://influencermarketinghub.com/youtube-shorts-rpm/ ; https://air.io/en/what-prm-can-you-expect-from-shorts-in-2025 |
| Creator share of ad revenue | 55% long-form vs 45% of a shared pool for short clips; licensed music halves the short-clip share | https://air.io/en/youtube/monetizing-youtube-shorts-what-you-need-to-know |
| Brand deals | $15–50 per 1,000 views typical; gaming $4–12; finance $50–200; dedicated video 1.3–3x an integration; short clip 0.3–0.5x **[U, vendor blogs]** | https://www.creatorsjet.com/blog/how-much-do-brands-pay-for-youtube-sponsorships ; https://creatorsagency.co/blog/how-youtube-creator-deals-are-priced-2026 |
| Flat integration fees | 10k–100k subscribers $200–2,000; 100k–500k subscribers $1,500–10,000 **[U]** | same |
| How many earn a living | 50.71% earn under $15k/yr; 56.55% of full-timers earn under $44k | https://www.netinfluencer.com/over-half-of-full-time-creators-earn-below-us-living-wage-despite-250b-industry-neoreach-finds/ |
| | 27% say it is their full-time job; 63% earn under $5k | https://www.netinfluencer.com/content-creation-now-a-legitimate-career-path-for-majority-of-us-creators-bigo-live-survey-finds/ |
| Burnout | 52% have burned out; 37% are considering quitting | https://www.cosmeticsdesign-europe.com/Article/2025/07/17/52-of-content-creators-say-they-have-experienced-burnout |
| | 62% (North America) **[U]** | https://www.podcastvideos.com/creator-mental-health-study-burnout-financial-strain.md |
| Moves into film/TV | Creator horror films are reaching cinemas. One critic-creator (~2M subscribers) crowdfunded ~$1.4M and got distribution. A free streamer commissioned a slate of 4 creator features. I found no figure for how many creators make the move (qualitative only). | https://www.ypulse.com/article/2026/06/15/gen-z-is-turning-youtubers-into-box-office-giants/ ; https://www.hollywoodreporter.com/business/digital/tubi-hartbeat-creator-film-slate-kinigra-deon-85-south-1236412434/ |

#### THEATRE
| Metric | Value | Source |
|---|---|---|
| Commercial season (2024–25, 53 weeks) | $1.89B gross; 14.66M attendance; 77 productions; 1,712 playing weeks; 91.2% capacity; $128.90 average ticket | https://www.broadwayleague.com/press/press-releases/broadways-2024-2025-season-wraps-with-147-million-attendances-and-grosses-of-189-billion/ |
| Average weekly gross per show | ≈$1.1M (my calculation: gross ÷ playing weeks) **[U]** | same |
| 2025–26 season | $1.91B | https://www.broadwayworld.com/industry/article/Broadway-Set-Another-Box-Office-Record-in-2025-2026-Crossing-191-Billion-20260528 |
| Weekly running cost, musical | ~$1M now; $500–700k in 1998 | https://abc7news.com/post/is-broadway-broken-rising-costs-celebrity-casting-early-closures-fuel-debate/19556853/ ; https://us.cnn.com/SHOWBIZ/Music/9809/23/broadway/index.html |
| Up-front cost (capitalisation) | play: a few million; musical $7–15M | https://www.investmentnews.com/ria-news/broadway-show-investments-bring-bright-lights-small-returns/62705 |
| Share that recoup | ~27% of musicals (opened 2007–17); 20–25% by insider rule of thumb; no data for plays | https://www.bucknell.edu/news/bucknell-study-explores-return-investment-broadway-musicals |
| Recoupment split | 65% of weekly profit repays investors, 35% to the profit pool **[U, source match unsure]** | https://playbill.com/article/ask-playbillcom-recoupment-com-144477 |
| Run lengths (flops) | 20 previews + 48 performances (~8 weeks); 32 previews + 84 performances (~14 weeks); 19 of the season's shows had closed by April (many were limited runs) | https://www.broadwayworld.com/article/Breaking-Down-the-202425-Broadway-Season-20250418 |
| Union weekly minimum, top commercial tier | $2,717 (Sep 2025); $2,799 (Sep 2026); +3%/yr after | https://www.backstage.com/magazine/article/how-much-do-broadway-actors-make-80591/ ; https://actorsequity.org/news/PR/2025/10/30/actors-equity-association-membership-ratifies-new-production-contract-with-the-broadway-league |
| Union weekly minimum, regional non-profit | B+ $1,186; B $1,091; C $1,002; D $799; top tier reaches 80% of the commercial minimum by 2027 | https://cdn.actorsequity.org/pages/lort-documents/LORTRatification.pdf |
| Off-Broadway minimum | not found **[U]** | n/a |
| Playwright royalties | historically 4.5% of gross, rising to 6% after recoupment; now a share of the profit pool (minimum 15.56% before recoupment, 17.78% after) or a weekly guarantee | https://playbill.com/article/ask-playbillcom-writer-salaries-com-144080 |
| UK commission fees | standard regional agreement £2,591 (top band), £2,071 (others); national companies £14,615 | https://artsprofessional.co.uk/news/newsreel/pay-rise-theatre-writers ; https://artsprofessional.co.uk/news/newsreel/fee-rises-playwrights-royal-court-rsc-and-national |
| Development path | reading → workshop (days to weeks, repeated) → regional tryout ($1.5–2M) → transfer; ~$3M total before the commercial run **[blog figure]** | https://kendavenport.com/the-problem-with-the-todays-out-of-town-tryout-or-why-they-can-kill-a-show/ |
| Non-profit producing support | commercial producers pay non-profits $250k–$1M+ to stage a pre-transfer production **[U, older]** | https://www.wral.com/archive/17179860/ |
| Non-profit/regional finances | 2023: ticket income 25% below 2019 after inflation; donations −15%; costs +12% | https://americantheatre.org/2025/03/03/tcgs-theatre-facts-some-revenue-growth-but-a-drop-in-assets |
| | historic split ~46% earned / 54% donated (2009) | https://www.broadwayworld.com//article/TCG-Publishes-Theatre-Facts-2009-20100804 |
| UK commercial actor minimum | £880.10/wk for 1,100+ seats (2024–25); £762 mid-size; £686 small (2023–24) | https://www.aussietheatre.com.au/?p=245401 |
| | new 2026–29 deal: +13.5% over 3 years | https://solt.co.uk/equity-members-ratify-new-three-year-west-end-agreement/ |
| Largest fringe festival, 2025 | 3,893 shows; 2.6M tickets; 53,942 performances; 301 venues; ≈670 tickets per show, ≈48 per performance (my calculation) | https://www.edfringe.com/about-us/news-and-blog/an-exciting-and-energising-edinburgh-festival-fringe-2025-comes-to-a-close/ |
| Same festival, 2026 | 4,232 shows; 2.81M tickets | https://www.scotsman.com/arts-and-culture/edinburgh-fringe-needs-to-reflect-on-what-it-wants-to-be-in-80th-year-as-ticket-sales-rise-by-8-per-cent-8950736 |

#### Game rules (calibrated)
1. **Podcast reach roll.** A new show draws its first-week downloads from a log-normal curve. Median 27, 90th percentile 400, 99th percentile 4,500 (Buzzsprout table). Multiply by 3 for 30-day downloads **[U, my estimate]**.
2. **Podfade check.** Before episode 10, each episode carries a cumulative quit risk of 80% (Blubrry). A low-energy stat raises it.
3. **Ad income.** Downloads ÷ 1,000 × CPM. CPM is $12 programmatic, $18 for a pre-roll, $25 for a host-read mid-roll. Sponsors only appear once 30-day downloads exceed ~1,000 **[U threshold]**.
4. **Guest swap.** Appearing on a bigger show converts 1–3% of its audience **[U]**. Being recommended by another podcast is the strongest discovery source (~1/3 of new finds).
5. **Video ladder.** Chance per year of reaching 1k subscribers, by uploads: 0.2% (none), 2% (1–11), 9% (12–51), 31% (52+). Each later tier (10k, 100k, 1M) is about 5–8x rarer.
6. **Format pay.** Long-form pays $2–10 per 1,000 views (rare niches up to $29). Short clips pay $0.03–0.30. Short clips carry 3x virality but feed only 10% of their views into long-form **[U]**.
7. **Brand deal.** Fee = average views ÷ 1,000 × $20, adjusted by niche (gaming ×0.3, finance ×4). A dedicated video pays ×2, a short clip ×0.4.
8. **Living wage.** About half of creators earn under $15k; a full-time creator has a 56% chance of earning under $44k.
9. **Burnout meter.** A weekly upload schedule adds +2 per month. Above 60, the player has a 37% chance of a "consider quitting" event (52% of creators report burnout).
10. **Commercial musical.** Up-front cost $7–15M. Running cost $1M a week; average gross $1.1M a week. Recoupment chance is 27% and needs roughly 18+ months of profitable weeks **[U]**. Weekly profit splits 65/35 between investors and the profit pool.
11. **Play.** Up-front cost $3–5M. Running cost ~$400–600k a week **[U]**. Mostly limited runs of 12–16 weeks.
12. **Flop clock.** If capacity stays below 70% for 4 weeks, a closing notice follows. A flop runs 8–14 weeks.
13. **Actor pay.** Commercial top tier $2,800 a week; regional non-profit $800–1,200; UK commercial £690–880. Lead roles pay 2–5x scale **[U]**.
14. **Playwright pay.** Commission £2,100 at a regional house or £14,600 at a national company. On a commercial transfer, a weekly royalty of 4.5% of gross, rising to 6% after recoupment, or the larger of a profit share and a guarantee.
15. **Fringe.** About 48 tickets per performance on average. Most shows lose money (no survey figure found, qualitative only); 1 in 50 earns a transfer or TV/agent interest **[U]**.

#### 8 generic moments
- **The episode-7 wall:** downloads plateau and a co-host suggests "taking a break".
- **The guest-swap spike:** a bigger show mentions you and the next episode gets 10x the usual downloads.
- **The demonetisation week:** a policy shift halves revenue per 1,000 views overnight.
- **The clip goes viral:** 5M short-clip views earn a few hundred dollars, while long-form subscribers grow +2%.
- **The sponsor's script:** a brand asks for approval rights, so you choose between the money and the audience's trust.
- **The table read:** an invited reading leads to a workshop offer, which comes with a rewrite deadline.
- **The closing notice:** posted after a run of soft weeks, with two weeks' notice to the cast.
- **The fringe five-star review:** the house sells out for the final 5 days and a transfer producer is in the audience.

#### 4 bridges
1. **Video to film:** a creator with 1M+ subscribers crowdfunds a feature (~$1–2M), and a distributor picks it up when the pre-sold audience is proven.
2. **Podcast to TV/film:** a narrative or fiction podcast in the top 1% (above 23k downloads in 30 days) gets optioned as a series. Treat this as a rare, high-prestige event (my judgement; no figure found).
3. **Theatre to screen:** a play that recoups or wins a transfer brings film adaptation interest, and stage actors are cast in TV. Use a 10% chance after a hit run **[U]**.
4. **Music bridge:** a musical's cast album or a creator's channel opens a music path. Licensed music halves short-clip revenue, which pushes creators to commission original music.

#### Gaps
- No off-Broadway minimum.
- No recoup rate for plays.
- No survey of fringe losses.
- No authoritative 30-day podcast median.
- Brand-deal figures come only from vendor blogs.

### Boardroom: boards, activists, pay votes, arts trustees

I ran 16 searches. Below, [U] means the figure is unverified, came secondhand, or was ambiguous in the source. No real people or companies are named for game use. Firm names appear only as sources.

#### 1. Large listed company boards (S&P 500)
| Metric | Figure | Source |
|---|---|---|
| Board size | 10.8 average in 2024 (range 6–16); 10.7 in 2025 | https://www.spencerstuart.com/-/media/2024/09/ssbi2024/2024_us_spencer_stuart_board_index.pdf ; https://www.spencerstuart.com/-/media/2025/10/ssbi2025/2025-us-board-index.pdf |
| Independent directors | 85% | 2024 index above |
| Meetings per year | 7.1 in 2025 (7.7 in 2024, median 7) | 2025 index above |
| Independent chair | about 39% [U, table hard to read] | 2024 index above |
| Annual director elections | 89–91% (the rest have staggered 3-year terms) | https://www.spencerstuart.com/-/media/2025/10/techbi/2025-us-technology-spencer-stuart-board-index.pdf |
| Board turnover | 0.8 new directors per board per year; only 50% of boards added one | https://corpgov.law.harvard.edu/2025/11/03/2025-u-s-board-index/ |
| New directors' background | 30% CEOs, 29% finance experts, 59% retired executives, average age 59.1 | same |
| Mandatory retirement age | two-thirds of boards | same |
| Director pay | about $336k–$346k average total [U, year labels unclear] | https://www.spencerstuart.com/research-and-insight/-/media/2026/09/USBI2026/2026_US_Spencer_Stuart_Board_Index_Highlights.pdf |
| Committees | Audit, compensation and nominating/governance are standard (NYSE listing rules require them) [U, from my general knowledge, not searched] | — |

#### 2. What boards decide, and a typical agenda
- Matters only the full board can approve: strategy and long-term objectives, acquisitions and disposals, takeover offers, picking the CEO and chair, and succession planning. https://seswater.co.uk/-/media/files/seswater/about-us/publications/matters-reserved-for-the-board---september-2023.pdf
- Agenda order: approve minutes, then reports (financials, audit), then discussion, then motions to vote on, then items to note. https://www.yiehphui.com.tw/upload/myfiles/finance/board/Rules_of_Procedure_for_Board_of_Directors_Meetings(EN).pdf
- Agenda formats vary widely by company. https://www.nasdaq.com/articles/governance/board-meeting-agenda-template

#### 3. Activists, proxy fights, say-on-pay, dual-class shares
| Item | Figure | Source |
|---|---|---|
| Campaigns | 297 worldwide in 2025 (a record); 173 in North America (+28%) | https://lazard.com/research-insights/annual-review-of-shareholder-activism-2025/ |
| Board seats won | 98 US seats in 2025 (+28%) [U, snippet cut off] | https://ionanalytics.com/insights/mergermarket/activist-campaigns-at-highest-level-this-decade-amid-abundance-of-targets/ |
| Seats won through a vote | 31% of 122 global seats (2023) | https://corpgov.law.harvard.edu/2024/01/29/annual-review-of-shareholder-activism-2023/ |
| Typical demand | M&A (sell the company or break it up) = 42% of US campaigns | ionanalytics URL above |
| Fights that reach a vote | 8 of 57 in Jan–Oct 2025: management won 5, activists won partly in 3, activists won outright in 0 | https://corpgov.law.harvard.edu/2025/12/24/the-recent-evolution-of-shareholder-activism-in-the-united-states |
| Universal-ballot elections (since 2022 rules) | at least 1 activist nominee elected in 48%; half the activist slate or more in 24%; management sweeps 52% | https://corpgov.law.harvard.edu/wp-content/uploads/2025/09/how-three-years-of-the-universal-proxy-card-rules-have-changed-proxy-contests-september-9-2025.pdf |
| Settlements | about 85% of nomination fights settle (about 65% a decade ago) [U, one practitioner's estimate] | first corpgov 2025 URL above |
| Say-on-pay votes | average support about 91%; about 1–1.2% fail | https://corpgov.law.harvard.edu/2025/09/22/2025-proxy-season-review-compensation-related-matters/ |
| Dual-class shares | about 7% of Russell 3000 companies; media and entertainment has by far the highest share | https://corpgov.law.harvard.edu/2019/06/28/dual-class-shares-governance-risks-and-company-performance/ ; https://www.nber.org/digest/jul04/dual-class-companies |

#### 4. Media specifics
- Greenlight decisions: a committee of senior executives (development, finance, legal, marketing) usually reviews 3–4 times, and the studio head makes the final call. For budgets of several hundred million dollars, the parent company's CEO or COO decides. The parent board itself is not involved [U]. https://www.thewrap.com/hollywood-greenlighting-power/ ; https://wikipedia.com/wiki/Greenlit
- Content write-downs: one studio wrote off $1.5bn (estimate range $1.5–1.8bn) for shows pulled from its streaming service in 2023, then $400m more later. One merged group projected $3.2–3.5bn. https://gulfnews.com/business/markets/disney-takes-15-billion-writedown-on-programs-its-removing-from-streaming-1.96173623 ; https://www.mediapost.com/publications/article/380696/warner-bros-discovery-content-write-offs-may-go.html
- Merger failure: 70–90% of mergers fail (general M&A, not media-specific). In a KPMG study of 700 deals, only 17% created value and more than half destroyed it. https://qz.com/work/1156696/disney-fox-deal-mega-mergers-rarely-succeed ; https://www.nbcnews.com/id/wbna24897367 [U, figures quoted secondhand]
- Layoffs: 17,163 media job cuts in 2025 (+15%), and restructuring or consolidation was the top reason given. https://www.challengergray.com/blog/2025-year-end-challenger-report-highest-q4-layoffs-since-2008-lowest-ytd-hiring-since-2010/
- CEO tenure: median 4.8 years across the S&P 500 in 2022. No media-specific figure found [U]. https://www.equilar.com/ceo-tenure-rates

#### 5. Start-up and arts non-profit boards
- Series A: 3–5 seats. With one lead investor, usually 3; with two leads, 5 (2 founders, 2 investors, 1 independent). The independent seat is often left empty at first. Earlier investors get observers, who attend without voting. https://www.startupcompanylawyer.com/2007/11/27/what-should-the-composition-of-the-board-be-like-and-how-are-the-board-seats-allocated/
- Series B and later: about 7 seats with an investor majority. https://promise.legal/startup-legal-guide/growth/board-governance
- Theatre trustees: 43% of theatres had a "give or get" policy (give a set amount or raise it from others) in 2024, down from 78% in 2013. At theatres with budgets over $10m, the median trustee gift is about $20k. https://americantheatre.org/2025/04/28/tcgs-new-survey-of-nonprofit-governing-boards-is-first-in-10-years
- Non-profits generally: give-or-get minimums average $1k (small) to $5k (large). Only 60% of boards reach 100% member giving. Arts boards often also expect season tickets. https://www.bridgespan.org/insights/board-members-personal-contributions [U, older BoardSource data]
- Artistic director hiring: the search takes 6–12 months. Example committee: 5 board members, the managing director and 3 people from the local arts community. https://americantheatre.org/2018/10/23/find-the-right-leader
- Artistic director tenure: 30% had been in post 20+ years, and about the same share expected a change within 5 years. https://www.giarts.org/node/6456

1. Listed board: 11 seats, 9 independent (85%).
2. 7 board meetings per year, one per quarter plus 3 event meetings.
3. Each year, roll for refresh: 50% chance one seat turns over.
4. Each new director has a 30% chance of being a former CEO, who gets +1 influence.
5. Director pay: 340k per seat per year, shown as an expense line.
6. Say-on-pay vote: base 91% support. Each pay level above peers costs -10 points. Below 70% triggers a "concern" event. Base failure chance 1%.
7. Activist arrival: about 5% chance per year for a listed company, doubled if total shareholder return trails peers [U, my calibration].
8. Activist demand: 42% "sell or split," the rest a mix of cost cuts, capital return and CEO change.
9. Facing an activist: settle (85%, activist gets 1–2 seats) or go to a vote. A vote ends in a management sweep 52%, at least one activist seat 48%, half the slate or more 24%.
10. Dual-class flag on media companies: founder votes count ×10, which removes rules 7–9.
11. Greenlight: the committee decides up to a budget threshold (say 150m [U]). Above it, the parent CEO decides. The board sees only slate totals.
12. Content write-down: when a library title is pulled, book an impairment of 1–3% of slate value and gain a residual-cost saving.
13. Merger: 70% chance it destroys value. After closing, cut 5–15% of staff [U] and take a write-down.
14. CEO contract: 5-year expected tenure. A board confidence score below 40 triggers succession.
15. Start-up: each priced round adds 1 investor seat; earlier investors become observers. Independent seat empty until Series B.
16. Non-profit arts board: 20k give-or-get at large theatres. Artistic director search lasts 6–12 months, with a 9-person committee.

#### 8 boardroom "moments"
- The executive session: management leaves the room.
- A no-vote of more than 30% against pay arrives the morning after the AGM.
- A letter from a 5% holder demanding a sale.
- The settlement call: "two seats and a committee chair."
- A slate impairment appears in the quarterly numbers.
- The succession "bus test" briefing (who takes over if the CEO is gone tomorrow).
- Merger day one: the integration team and the layoff list.
- The trustee gala ask: a pledge or the seat.

#### 4 career bridges
- Film: a producer pitches the greenlight committee. A hit turns into a seat on that committee.
- TV: a showrunner's series gets pulled in a write-down. Fighting the write-down means appealing to an independent director.
- Music: a label executive takes an observer seat at a start-up. A distribution deal converts it to a voting seat.
- Theatre: an actor or director joins a non-profit board through give-or-get, then sits on the artistic director search committee or becomes a candidate.

Main gaps: no confirmed figures for committee count, media-specific CEO tenure, media merger failure rates, or a budget threshold for greenlight escalation.
