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

## Round 20: streaming in depth, and improv

Two research passes (October 2026). Firm, theatre and union names are replaced by generic terms in the prose and kept only in source URLs; real people are left out. **[U]** marks a figure the researcher could not verify. What was built is in HANDOFF.md (Round 20).

### Streaming: the business, the work, the teaching, the exploits (research for the film-industry life-sim)

Compiled 2026-10-12. Every figure carries its source URL. **[U]** = unverified (single weak source, press estimate the parties never confirmed, or the author's own arithmetic/memory). "Secondary" = a news write-up of someone else's data. Wikipedia's API rate-limited this session, so most figures come from trade/press pages found via search; where a primary filing was visible in search, it is cited.

Note for the designers: the game already models streamers as `TV_NETS` entries with `kind: 'streaming'`, pay-window bidding, weekly views (hours ÷ runtime), a twice-yearly engagement report and a "top fifth in first 90 days" bonus (`src/distrib.js`, `src/dealroom.js`). The rules in section 8 are written to extend that, not replace it.

---

#### 0. Timeline at a glance

| Year | Event | Source |
|---|---|---|
| 1997 | Market leader founded as DVD-by-mail [U: founding year from general knowledge] | — |
| 1998 | First disc shipped, 10 Mar 1998 | https://whats-on-netflix.com/news/netflix-dvd-to-close-in-september-2023-after-25-years |
| 2007 | Streaming added to the DVD subscription | https://www.techhive.com/article/1790249/netflix-closing-dvd-business.html |
| 2011 | "a spun-off DVD unit" split and price rise of up to 60%; ~800k US subscribers lost in a quarter; stock fell 35% in one day, >75% from peak | https://www.washingtontimes.com/news/2011/oct/25/netflix-shares-tank-amid-backlash-and-defections/ ; https://cases.som.yale.edu/netflix-and-qwikster |
| 2013 | First flagship original: ~$100M for two 13-episode seasons, no pilot, chosen partly from viewing data | https://www.hollywoodreporter.com/lifestyle/arts/how-netflix-conquered-hollywood-broke-it-pandoras-box-book-excerpt-1235637957/ ; https://investorplace.com/?p=300981 |
| 2019 | Studio-owned services arrive (a studio-owned service at $6.99, Nov 2019); bidding war for library sitcoms | https://www.sherwood.news/tech/disney-has-gone-from-one-of-the-cheapest-to-one-of-the-most-expensive |
| 2020 | a studio–a cinema chain deal cuts exclusive window from ~90 to 17 days (for premium VOD only) | https://pastemagazine.com/movies/amc-theatres/amc-theatres-universal-ban-theatrical-window |
| 2020 (Dec) | a legacy studio puts its whole 17-film 2021 slate on a studio-owned service day-and-date for one month | https://www.rollingstone.com/movies/movie-news/warner-bros-hbo-max-dune-matrix-4-godzilla-kong-1098343/ |
| 2021 | the market leader says it no longer needs outside financing | https://www.cnbc.com/2021/01/19/netflix-says-cash-flow-positive-after-2021-no-more-external-financing.html |
| 2022 (Apr) | First subscriber loss in a decade (−200k); shares −35% in a day, ~$54B wiped | https://www.bnnbloomberg.ca/netflix-shares-plunge-35-after-massive-subscriber-loss-1.1754275 |
| 2022 (Nov) | Ad tier launches at $6.99 | https://www.tomsguide.com/news/netflix-pricing |
| 2023 | Password-sharing crackdown (May); the writers' guild and the actors' union strikes; a studio group $2.4B content impairment; first engagement report (Dec); DVD service ends 29 Sep | see sections below |
| 2024 | a retailer-owned service makes ads the default; the market leader ends year at 301.6M paid members | https://www.nbcwashington.com/news/national-international/amazon-to-run-ads-on-prime-video-and-charge-2-99-more-a-month-to-avoid-them/3428749/ ; https://www.storyboard18.com/television/netflix-to-boost-content-spending-to-18-billion-in-2025-54392.htm |
| 2025 | the market leader stops quarterly subscriber reporting; streaming passes broadcast+cable combined in US TV time (May); the market leader agrees ~$82B deal for a legacy studio (Dec) | https://www.businesstoday.in/amp/technology/news/story/netflix-to-stop-reporting-subscriber-tally-as-streaming-wars-cool-426042-2024-04-19 ; https://www.thewrap.com/streaming-cable-broadcast-tv-ratings-nielsen-the-gauge-may-2025/ |
| 2026 | the market leader walks away (Feb) after a rival studio raises to $31/share (~$108B); deal reported closed 6 Oct 2026 [single secondary source]; the writers' guild ratifies a four-year contract (Apr) | https://filmstories.co.uk/news/netflix-drops-warner-bros-bid-paramount-on-course-to-acquire-the-studio/ ; https://www.sortiraparis.com/en/what-to-do-in-paris/cinema-series/articles/353398-warner-and-paramount-officially-reunite-skydance-becomes-a-hollywood-giant ; https://www.wga.org/news-events/news/press/wga-ratifies-2026-minimum-basic-agreement-with-amptp |

---

#### 1. Business models and their economics

### 1.1 Subscriber growth curve of the market leader

| Year-end | Paid memberships | Source |
|---|---|---|
| 2011 | ~21.5M (streaming) [U, secondary blog] | https://entertainmentstrategyguy.com/2019/10/03/why-most-netflix-charts-start-in-2012-a-history-of-netflix-subscribers/ |
| 2014 | ~47.9M [U, same blog] | same |
| 2019 | 167.1M | https://www.sec.gov/Archives/edgar/data/1065280/000106528020000035/ex991q419.htm |
| 2020 | 203.7M (passed 200M) | https://www.cnbc.com/2021/01/19/netflix-says-cash-flow-positive-after-2021-no-more-external-financing.html |
| 2021 | 221.8M [secondary compilation] | https://businesstats.com/?p=431 |
| 2022 | 230.75M (lost subscribers in H1, recovered with ads + crackdown) | https://au.variety.com/?p=8312 |
| 2023 | 260.28M (+13.1M in Q4 alone; UCAN 80.1M, EMEA 88.8M, LATAM 46.0M, APAC 45.3M) | https://www.thewrap.com/netflix-earnings-q4-2023/ |
| 2024 | 301.6M; "over 700M people" watching | https://www.storyboard18.com/television/netflix-to-boost-content-spending-to-18-billion-in-2025-54392.htm |
| 2025+ | No longer reported quarterly (announced Apr 2024; only milestones) | https://www.businesstoday.in/amp/technology/news/story/netflix-to-stop-reporting-subscriber-tally-as-streaming-wars-cool-426042-2024-04-19 |

Competitors (mixed dates): a rival studio+ 79M, another service 44M paid, WBD ~132M across services, a studio-owned service ~124.6M; a retailer group does not disclose ( https://www.thewrap.com/media-platforms/streaming/netflix-disney-warner-bros-paramount-peacock-subscribers-revenue-profits-march-2026-update/ ; https://digitaltrends.com/home-theater/most-popular-streaming-services-by-subscribers ). another service ~45M ( https://techcrunch.com/2025/03/20/apple-is-reportedly-losing-1b-per-year-on-its-streaming-service ).

### 1.2 Revenue, margin, cash and debt: losses-then-profit

Revenue (secondary compilation, consistent with filings): 2015 $6.8B, 2017 $11.7B, 2019 $20.2B, 2020 $25.0B, 2021 $29.7B, 2022 $31.6B, 2023 $33.7B, 2024 $39.0B ( https://businesstats.com/?p=431 ). 2025: $45.2B (+16%), operating income $13.3B, operating margin 29.5% (26.7% in 2024); 2026 guidance $50.7–51.7B, ~31.5% margin ( https://thedesk.net/2026/01/netflix-q4-2025-earnings-report/ ; https://www.csimagazine.com/csi/netflix-fullyear-results.php ).

Cash: the leader was profitable on paper for years while burning cash, because content is capitalised and amortised. Free cash flow was −$1.6B in the first nine months of 2019, then +$2.2B year-to-date by Q3 2020 ( https://www.sec.gov/Archives/edgar/data/1065280/000106528020000448/ex991q320.htm ). The 2019 10-K warned of "negative free cash flows for many years" ( https://www.sec.gov/Archives/edgar/data/1065280/000106528020000040/form10kq419.htm ). Full-year 2019 FCF ≈ −$3.3B [U]. In Jan 2021 it said it no longer needed external financing and would hold $10–15B gross debt ( https://www.cnbc.com/2021/01/19/netflix-says-cash-flow-positive-after-2021-no-more-external-financing.html ); bonds outstanding then ~$16.4B ( https://www.spglobal.com/marketintelligence/en/news-insights/latest-news-headlines/netflix-euro-bonds-rally-as-company-steps-back-from-debt-raising-62192680 ). By Dec 2025 it was rated A (S&P) / A3 (Moody's) and lined up $59B of bridge debt for the Warner deal ( https://fortune.com/2025/12/11/netflix-looks-to-become-debtflix-again-to-fund-warner-bros-acquisition/ ).

Accounting rule worth modelling: >90% of a title's capitalised cost is amortised within four years of release, on an accelerated schedule (films faster than series) ( https://www.sec.gov/Archives/edgar/data/1065280/000106528026000034/nflx-20251231.htm ).

Content cash spend: $16.2B (2024), ~$18B planned (2025) ( https://www.storyboard18.com/television/netflix-to-boost-content-spending-to-18-billion-in-2025-54392.htm ). Industry: global content spend ~$245B in 2025, streamers $95B (39%), passing commercial broadcasters for the first time; $255B forecast for 2026 with streamers at $101B ( https://senalnews.com/en/data/streamers-to-spend-95-billion-on-content-in-2025-surpassing-broadcasters ; https://www.contentasia.tv/news/global-content-investment-hit-us255bn-2026-streamers-cement-market-leadership-ampere-analysis ).

### 1.3 Late entrants' loss curves

| Service | Losses | Source |
|---|---|---|
| a studio group DTC | ~$11.4B cumulative through 2023; first profit $47M in the quarter to 30 Mar 2024 (entertainment DTC) | https://informitv.com/2024/02/07/disney-pulls-closer-to-profit/ ; https://www.cityam.com/?p=2169078 |
| another service | −$914M (2020), −$1.7B (2021), −$2.5B (2022), ~−$2.8B (2023, called the peak), Q4 2025 −$552M | https://tvtechnology.com/news/peacock-lost-dollar914m-in-2020 ; https://filmstories.co.uk/?p=30228 ; https://www.thewrap.com/peacock-losses-peak-3-billion-comcast ; https://www.hollywoodreporter.com/business/business-news/peacock-loss-subscribers-44-million-1236488224/ |
| another service | >$1B/year; ~$5B/yr content, cut to $4.5B in 2024; business plan foresaw $15–20B losses over first 10 years | https://au.variety.com/2025/digital/news/apple-tv-plus-streaming-losses-1-billion-per-year-21094/ |

Design point: a studio-owned service typically loses money for **4–5 years** before breaking even; the market leader took ~**13 years** of streaming (2007–2020) to become free-cash-flow positive.

### 1.4 Prices over time (US)

| Service / tier | Path | Source |
|---|---|---|
| Market leader, Standard | $7.99 (2013) → $9.99 (2015) → $15.49 (2022) → $17.99 (Jan 2025) → $19.99 (Mar 2026) | https://www.tomsguide.com/news/netflix-pricing ; https://keepingupwithinflation.com/tracker/netflix/ ; https://www.wlox.com/2026/03/26/netflix-raising-prices-all-streaming-plans-2nd-time-just-over-year/ |
| Market leader, with ads | $6.99 (Nov 2022) → $7.99 → $8.99 (Mar 2026) | same |
| Extra member outside household | $7.99/month (2023) | https://cordcuttersnews.com/netflix-announces-what-it-will-cost-you-to-share-your-netflix-password/ |
| a studio-owned service ad-free | $6.99 (2019) → $7.99 (Mar 2021) → +38% (Dec 2022) → $18.99 (Oct 2025); reportedly $21.49 (2026) [U] | https://www.sherwood.news/tech/disney-has-gone-from-one-of-the-cheapest-to-one-of-the-most-expensive ; https://www.tomsguide.com/entertainment/disney-plus/disney-plus-is-getting-another-price-hike-heres-how-much-youll-pay |
| a retailer-owned service | Ads made default early 2024; +$2.99/month to remove | https://www.nbcwashington.com/news/national-international/amazon-to-run-ads-on-prime-video-and-charge-2-99-more-a-month-to-avoid-them/3428749/ |
| Sports DTC (ESPN) | $29.99 unlimited / $11.99 select; bundle with two entertainment services $35.99 (ads) / $44.99 (no ads) | https://espnpressroom.com/us/press-releases/2025/05/new-direct-to-consumer-offering-to-be-singularly-branded-espn/ ; https://fast.laughingplace.com/disney-entertainment/espn-direct-to-consumer-details-and-pricing |

Studio-owned launch price was ~45% of the leader's at the time, then rose ~170% in six years: launch cheap to grab share, then "streamflation".

### 1.5 ARPU by region (market leader, average monthly revenue per paid membership)

UCAN ~$17.20 (2024) vs $16.28 (2023) ( https://www.statista.com/statistics/1090143/netflix-annual-global-arpu-by-region ); EMEA $10.96 (2024) ( https://www.sec.gov/Archives/edgar/data/1065280/000119312525084431/d914423dars.pdf ); LATAM ~$8 [U: own arithmetic from $4.84B revenue and 46→53M members, 10-K data https://www.sec.gov/Archives/edgar/data/1065280/000106528025000044/nflx-20241231.htm ]; APAC ~$7 [U]. Worldwide ~$11.70 [U, secondary]. Rough ratio for the game: **North America 1.0 : Europe 0.65 : Latin America 0.45 : Asia-Pacific 0.4**.

### 1.6 Advertising (AVOD / ad tiers / FAST)

- Share of new US premium SVOD sign-ups choosing an ad tier: 32% (mid-2023) → 51% (Nov 2023) → 56% (Q3 2024); 43% of all subscriptions on ad tiers by Q3 2024 ( https://www.mediapost.com/publications/article/386848/25-of-svod-subs-and-one-third-of-new-sign-ups-are.html ; https://www.thewrap.com/ad-supported-streaming-record-high-2024 ).
- Leader's ad tier: 70M monthly active users (Nov 2024) ( https://www.nbcnews.com/business/business-news/netflix-ad-supported-tier-70-million-monthly-users-two-years-launch-rcna179754 ); 94M MAU later, plus a "monthly active viewers" metric of 190M that multiplies households by people ( https://www.emarketer.com/content/netflix-releases-ad-viewership-metric-streaming-landscape-changes-again ). Ad revenue >$1.5B in 2025 (2.5× 2024), expected to double in 2026 ( https://www.adnews.com.au/news/netflix-ad-revenue-hits-1-5-billion ).
- CPMs: launched as high as $65; by summer 2024 $20–30 as a retailer-owned service flooded supply ( https://www.mediapost.com/publications/article/401045/netflix-ad-option-has-positive-momentum-two-year.html ; https://www.adexchanger.com/daily-news-roundup/wednesday-07082024 ).
- FAST: US free ad-supported services ~$4.9B revenue (2024) → ~$9B by 2029 (PwC) ( https://cordcuttersnews.com/free-streaming-services-revenue-surge-to-4-9-billion-in-2024-as-the-roku-channel-tubi-pluto-tv-more-grow/ ); Tubi 97M MAU end-2024 and near $1B revenue ( https://www.streamtvinsider.com/video/tubi-touts-97-million-monthly-active-users ); Pluto 80M MAU (May 2023); Samsung TV Plus 88M. Combined FAST ~4.6% of US TV time (Dec 2024) ( https://www.hollywoodreporter.com/business/business-news/tubi-monthly-active-users-1236102252/ ).
- Transactional (TVOD/PVOD/EST): the 2020 17-day window applied to ~$20 premium rentals ( https://pastemagazine.com/movies/amc-theatres/amc-theatres-universal-ban-theatrical-window ); a studio group charged $30 for a day-and-date streaming rental in 2021 ( https://abcnews4.com/news/entertainment/scarlett-johansson-disney-settle-lawsuit-over-black-widow ).

### 1.7 Churn, and how it is fought

Antenna (US, Sept 2024): weighted average gross churn 5.3%/month, net 3.1%; market leader 1.8% gross / 1.0% net; worst (another service) 7.4% gross. End-2023 average 5.5% ( https://www.antenna.live/insights/antennas-2024-top-subscription-insights-serial-churn ; https://www.antenna.live/post/antennas-2024-top-subscription-insights-net-churn ). "Serial churners" (3+ cancellations in 2 years): 29.5M people, 23% of subscribers, but 41% of gross adds and 42% of cancels; after 3 months only 38% of heavy serial churners still subscribed vs 61% of others ( same Antenna page ).

Weapons against churn: ad tiers (cheaper entry), bundles, annual plans, weekly episode drops instead of full-season dumps, live events and sports, password-sharing enforcement, recommendations (the leader's own estimate: personalisation and recommendations save >$1B a year by cutting churn "several percentage points" — https://www.tubefilter.com/?p=81965 , Gomez-Uribe & Hunt 2015, ACM TMIS).

Password crackdown: >100M households were borrowing passwords; after the US rollout in May 2023 the leader had its four biggest US sign-up days in Antenna's history (~100,000/day on 26–27 May); net adds 6M (Q2), 8.8M (Q3), 13.1M (Q4 2023) ( https://www.mprnews.org/story/2023/05/24/npr-netflix-password-sharing ; https://www.mactrast.com/2023/12/netflix-completely-satisfied-with-progress-of-password-sharing-crackdown-program/amp/ ; https://www.thewrap.com/netflix-earnings-q4-2023/ ).

### 1.8 Market valuation swings

- Oct 2011: −35% in one day; >75% from peak during a spun-off DVD unit ( https://www.washingtontimes.com/news/2011/oct/25/netflix-shares-tank-amid-backlash-and-defections/ ; https://cases.som.yale.edu/netflix-and-qwikster ).
- 20 Apr 2022: −35% in one day, ~$54B market value erased after −200k subs and guidance of −2M; analysts expected +2.5M ( https://www.bnnbloomberg.ca/netflix-shares-plunge-35-after-massive-subscriber-loss-1.1754275 ).
- Jan 2024: +8–9% after +13.1M subs vs ~8.7–8.9M expected ( https://www.bloomberg.com/news/articles/2024-01-23/netflix-posts-best-customer-gain-since-surge-during-pandemic ).
- Nov 2025: 10-for-1 split near all-time highs; market cap ~$471B around the split ( https://www.tikr.com/blog/netflix-surges-on-10-for-1-stock-split-announcement ); ~$437B by Dec 2025 ( https://capital.com/en-gb/analysis/netflix-stock-split ).
- The shift from growth-at-all-costs to profit: subscriber counts dropped as the headline metric (2025), replaced by revenue, operating margin and engagement.

---

#### 2. Content decisions

### 2.1 Licensed library vs originals

Library was the leader's early product; studios priced it up and then took it back. 2019 bidding: *Seinfeld* to the leader for $500M+ (global, 5 years); *Friends* to a studio service for ~$425M; *The Office* to a studio service for ~$500M (domestic) ( https://www.hollywoodreporter.com/live-feed/netflix-lands-seinfeld-rights-losing-friends-office-1239934 ; https://www.cnbc.com/2019/12/31/friends-is-leaving-netflix-wont-be-available-to-stream-until-may.html ). Then, needing cash, studios licensed back: HBO series to the leader from July 2023, first time in a decade HBO licensed to a US rival ( https://www.thewrap.com/insecure-streaming-netflix-hbo-deal ).

The "streamer bump": *Suits* (an old cable show) hit 3.88B minutes in one week (Jul 2023) and 57.7B minutes in 2023, a a ratings firm record, after landing on the leader ( https://www.hollywoodreporter.com/tv/tv-news/suits-year-end-streaming-record-2023-1235808594/ ).

### 2.2 How greenlights work at a streamer

- Leaked internal metrics (Bloomberg, Oct 2021): **Adjusted View Share (AVS)** weights viewers by value (new or infrequent members count more); **impact value** = projected lifetime AVS; **efficiency** = AVS relative to cost. *Squid Game*: cost $21.4M (~$2.4M/episode vs ~$8M for *Stranger Things*, ~$10M for *The Crown*), impact value $891.1M (41.7×), AVS 353 when 9–10 counts as "high" ( https://www.axios.com/netflix-spending-streaming-film-tv-9c2e619c-08b9-4be6-92ae-dd7d9fea38d5.html ; https://nairametrics.com/2021/10/17/netflix-estimates-squid-game-will-rake-in-891-million-dollars ; https://view.asiae.co.kr/en/article/2021101716255386727 ).
- Renewal metrics described to a UK Lords committee: **starters** (watched one episode), **completers** (finished the season), **watchers** (regular viewers), with early-month viewing weighted most ( https://www.thelist.com/288590/netflix-reveals-why-they-cancel-so-many-shows/?mode=gn ). A content chief: "are we getting enough viewership to justify the cost of the series?" (same).
- Completion benchmarks (reported, not disclosed): a 50% completion rate is "solid but not spectacular"; a ~$1B-scale fantasy series got 37% in the US (45% abroad); a Korean hit ~87%, a teen hit ~73%, a cancelled teen show 44% ( https://avclub.com/prime-video-rings-of-power-bad-viewership-numbers-1850299648 ; https://nofilmschool.com/rings-of-power-viewership ).
- Gut vs data: the content chief has been quoted both ways, "70% data, 30% judgment" (2015) and "70% gut, 30% data" (2018) ( https://www.xataka.com/cine-y-tv/2015-decisiones-para-producir-serie-netflix-eran-70-datos-30-intuicion-ahora-se-ha-invertido-proporcion ; https://www.slashfilm.com/netflix-behind-the-scenes-data ).
- Third-party cost-per-hour benchmark: *Squid Game* S1 ≈ $9,700 per million hours viewed [U, outside estimate] ( https://www.vodprofessional.com/?p=16817 ).

### 2.3 Cost-plus vs backend

The streamer pays the full budget plus a premium and owns the hit outright; producers give up syndication, international and long-tail upside. Premium reported variously as 10–20% ( https://www.hollywoodreporter.com/news/tvs-new-math-what-100m-netflix-deals-actually-shortchange-creators-1203846 ), ~30% standard ( https://www.cnbc.com/2018/08/15/netflix-cost-plus-model-tv-shows-revenue-upside.html ), and 15–40% depending on leverage ( https://digiday.com/future-of-tv/video-briefing-netflix-continues-reshape-economics-tv-producers/ ). The leader's position: "We like our model and talent likes our model" ( https://www.broadcastnow.co.uk/netflix/netflix-co-chief-not-looking-to-change-talent-compensation-model/5198300.article ). Because the premium is renegotiated each season and cast fees escalate, each renewal costs more; analysts link this to the season-2/3 cliff ( https://www.thelist.com/288590/netflix-reveals-why-they-cancel-so-many-shows/?mode=gn ).

### 2.4 Cancellation patterns

Ampere (2019, 61 cancelled shows): streaming originals averaged ~2 seasons vs 4 on cable and 6.5 on broadcast; the leader made 68% of VOD cancellations, and 12 of its 13 recent cancellations had ≤3 seasons ( https://businessinsider.nl/netflix-cancels-many-tv-shows-after-2-or-3-seasons-report-2019-4 ). A 2019 Bloomberg check found its overall cancellation rate in line with networks ( https://www.thelist.com/288590/netflix-reveals-why-they-cancel-so-many-shows/?mode=gn ). For 2021 originals: 11 cancelled after one season, 7 after two [U, fan tally] ( https://www.whats-on-netflix.com/news/does-netflix-really-cancel-everything/ ).

### 2.5 Windows, output deals, day-and-date

- Theatrical exclusivity: ~90 days pre-2020 → 17 days for PVOD (a studio–a cinema chain, 2020) → 45 days (WB–a cinema chain for 2022 films) ( https://theplaylist.net/amc-theatres-warner-bros-theatrical-window-deal-20210810/ ); wide-release average ~32 days in 2024 ( https://tombrueggemann.substack.com/p/theatrical-windows-remain-unchanged ). Oct 2026: a studio reportedly moved to a slate-wide 45-day minimum, with the industry drifting toward 45 days for PVOD and ~90 for streaming [single secondary source] ( https://dnyuz.com/2026/10/02/donna-langley-on-universal-ditching-short-theatrical-windows-were-trying-to-undo-the-training-weve-done-to-the-audience/ ).
- Day-and-date: WB's 2021 slate (17 films) on a studio-owned service same day for one month ( https://www.rollingstone.com/movies/movie-news/warner-bros-hbo-max-dune-matrix-4-godzilla-kong-1098343/ ). A star sued over lost box-office bonuses from a day-and-date release; settled on undisclosed terms ( https://abcnews4.com/news/entertainment/scarlett-johansson-disney-settle-lawsuit-over-black-widow ); reported value ~$40M [U].
- Pay-1: first subscription window after theatrical and home entertainment. The leader had a US pay-1 deal with Sony from 2021, made global in Jan 2026, rolling out by territory through early 2029; value reported at $7B+ [U] ( https://lamag.com/arts-and-entertainment/netflix-secures-global-pay-1-rights-in-major-multi-year-deal-with-sony-pictures/ ; https://senalnews.com/en/content/netflix-and-sony-pictures-closed-global-first-window-deal ). Typical holdback 6–9 months after release [U] ( https://vitrina.ai/blog/netflix-sony-global-pay-1-deal/ ).
- Streamer-made films in cinemas: the leader paid $469M for two sequels to a mystery franchise; one got a one-week run in just under 700 cinemas and grossed ~$15M, then streamed a month later ( https://www.thewrap.com/glass-onion-box-office-netflix-knives-out ; https://popculturology.substack.com/p/pulling-a-hit-movie-from-theaters ).

### 2.6 International / local-language originals and dubbing

- Non-English titles were 30% of all viewing on the leader in H1 2023 ( https://tubefilter.com/2023/12/13/netflix-what-we-watched-viewership-data-january-june-2023-night-agent/ ).
- Korea: ~$700M invested 2016–2021, then $2.5B committed over 4 years (2023); "over 60% of members" watched Korean titles; 4 of the 10 most-watched non-English series are Korean ( https://www.cnbc.com/2023/05/12/netflixs-2point5-billion-investment-in-korean-content-targets-global-audience.html ).
- A Spanish heist drama with fading broadcast ratings (premiere 25.1% share, later <12.1%) was picked up, re-cut and expanded, then became the leader's most-watched non-English series; 34M accounts for part 3 by the leader's own count ( https://en.ara.cat/media/money-heist-the-antena-3-series-that-only-netflix-knew-how-to-transform-into-global-phenomenon_1_5825203.html ; https://remezcla.com/film/money-heist-part-3-netflix-casa-papel/ ).
- Dubbing vs subtitles: Germany, France, Italy, Spain, Russia prefer dubs; Scandinavia, Netherlands, Korea, China prefer subtitles ( https://pro.morningconsult.com/trend-setters/subtitles-dubbing-streaming ). In dub-preferring markets only ~60% of the leader's catalogue had local-language audio (2021) ( https://www.advanced-television.com/?p=166524 ). US viewers say they prefer subtitles but finish dubbed series more often [U] ( https://tech.slator.com/?p=70039 ).

### 2.7 Write-downs, removals and shelving

- a studio group: $2.4B impairment (FQ3 2023) for pulling titles from its services, of which $2.0B produced content and $0.4B for ending third-party licences ( https://www.sec.gov/Archives/edgar/data/1744489/000174448923000171/dis-20230701.htm ).
- WBD: content impairment and development write-offs raised to $2.8–3.5B (Dec 2022); cancelled *Westworld* and moved it to FAST services ( https://digitaltveurope.com/2022/12/15/content-write-offs-add-another-billion-dollars-to-wbd-restructuring-costs ; https://www.mediapost.com/publications/article/380696/warner-bros-discovery-content-write-offs-may-go.html ).
- Shelved finished films: *Batgirl* (~$90M) in 2022; *Coyote vs. Acme* (~$70M cost per NPR) written off for ~$30M in Nov 2023, then sold to an indie distributor for ~$50M [reported, not closed in source] ( https://whyy.org/npr-story/coyote-acme-warner-bros-movie-studios-mothball-films ; https://variety.com/2025/film/news/coyote-vs-acme-rescued-warner-bros-axed-finished-film-1236342588 ).
- Also removing a show cuts residual obligations to talent [U, widely asserted].

### 2.8 Volume vs fewer, bigger titles

H1 2023: 18,214 titles each with ≥50,000 hours, ~100B hours total; top title 812M hours; >60% of titles released in the half appeared in the weekly Top 10 ( https://tubefilter.com/2023/12/13/netflix-what-we-watched-viewership-data-january-june-2023-night-agent/ ). Studio services moved the other way after 2022: fewer titles, write-downs (2.7), price rises.

### 2.9 Algorithms, artwork, Top-10

- Artwork personalisation: one image chosen per member per title via contextual bandits; expressive faces win; a romance fan sees the couple, a comedy fan the comic actor ( https://www.looper.com/274997/the-secret-behind-netflixs-personalized-thumbnails/ ; https://emerj.com/artificial-intelligence-at-netflix/ ; primary: the market leader Tech Blog "Artwork Personalization at the market leader", 2017 [U: URL not opened]).
- Personalised rows had 3–4× the take rate of a plain "most popular" list ( https://foxbusiness.com/markets/how-netflixs-ai-saves-it-1-billion-every-year ).
- Top-10: public website from Nov 2021 ranked by hours ( https://www.axios.com/2021/11/16/netflix-debuts-new-streaming-metrics ); from 20 Jun 2023 ranked by **views = hours ÷ runtime**, all-time list window extended from 28 to 91 days ( https://about.netflix.com/en/news/top-10-things-about-netflix-top-10 ).
- Gaming the metrics: hours favour long series, views favour short runtimes; a 6.8-hour season scored 252.1M "views" ( https://tvline.com/ratings/netflix-viewership-changes-wednesday-squid-game-most-popular-1235003018 ); ad-tier "viewers" counted at one minute of viewing multiplied by people in the household ( https://www.emarketer.com/content/netflix-releases-ad-viewership-metric-streaming-landscape-changes-again ); a rival touted "25 million streams in 24 hours" for a show only 37% finished ( https://www.fortune.com/2023/04/05/rings-of-power-viewership-amazon-bullish-despite-season-1-completion-report ).

### 2.10 Live and sports

- Wrestling: 10 years, >$5B, ~4× the prior cable deal ( https://www.nbcnews.com/business/business-news/netflix-stream-wwes-raw-starting-year-biggest-jump-live-entertainment-rcna135218 ).
- Boxing event (Nov 2024): 65M concurrent streams peak (38M US), 108M viewers, with widespread buffering ( https://www.si.com/fannation/boxing/netflix-claims-record-breaking-viewership-for-jake-paul-vs-mike-tyson-fight-01jd1k2crnqa ).
- Football: a retailer group's exclusive Thursday package ~ $1B/year ( https://www.mediapost.com/publications/article/361561/nfl-strikes-100b-media-rights-deal-amazon-gets.html ). Basketball: 11 years ~$76B from 2025-26 split between ESPN (~$2.6B/yr), NBC (~$2.5B/yr), a retailer group (~$1.8B/yr); incumbent cable network lost its rights ( https://www.wionews.com/sports/nba/news-nba-signs-11-year-media-deals-worth-whopping-amount-reports-743928/amp ).
- Losing sports costs subscribers: losing Indian cricket rights cost a studio-owned service Hotstar ~20M+ subscribers ( https://www.techradar.com/news/ipl-out-of-its-hand-disney-plus-hotstar-feels-the-pinch-on-subscriber-front ; https://www.outlookindia.com/art-entertainment/loss-of-ipl-rights-weighs-heavy-on-disney-hotstar-loses-4-6-million-subscribers-news-285670 ).

---

#### 3. The ecosystem

**Studios become streamers, then retreat.** Studios pulled licences to stock their own services (2019 sitcom bidding, 2.1), lost billions (1.3), then licensed back to the leader (2023) and wrote down content (2.7). Consolidation followed: the leader agreed to buy a legacy studio (~$82B, Dec 2025), a rival bid ~$108B, and the leader walked away in Feb 2026 calling the deal "no longer financially attractive" ( https://filmstories.co.uk/news/netflix-drops-warner-bros-bid-paramount-on-course-to-acquire-the-studio/ ; https://www.boston.com/news/entertainment/2026/02/26/netflix-walks-away-from-warner-bros-deal-clearing-the-path-for-paramount/ ). Expected close 6 Oct 2026 at $31/share cash after EU clearance in July 2026 ( https://s201.q4cdn.com/336605034/files/doc_news/Paramount-Skydance-and-Warner-Bros--Discovery-Announce-Anticipated-Closing-Date-of-Paramount-Merger-2026.pdf ; https://www.sec.gov/Archives/edgar/data/0002041610/000204161026000054/psky-20260630.htm ); completion reported 7 Oct [single secondary source].

**Talent: overall deals.** Showrunner megadeals: up to $300M (2018) for one prolific producer; $100–150M (2017, later extended) for another; ~$100M over 3 years for a sitcom creator who left halfway ( https://ca.news.yahoo.com/netflix-spent-big-bucks-hit-130000610.html ; https://www.hollywoodreporter.com/live-feed/kenya-barris-inks-eight-figure-netflix-tv-deal-1130574 ). Celebrity overall deals: a royal couple's ~$100M streaming deal (5 shows) ran on while their ~$20M audio deal ended after one 12-episode podcast for missing "productivity benchmarks" ( https://www.foxbusiness.com/entertainment/prince-harry-meghan-markle-rival-streamer-says-values-partnership-couple-after-spotify-deal-ends ). The leader's content chief's allocatable pay rose from $25M to $30M (2019) ( https://www.sec.gov/Archives/edgar/data/1065280/000119312520114206/d721989ddef14a.htm ).

**2023 strikes: what was won.**
- the writers' guild viewership bonus: high-budget streaming titles watched by ≥20% of the service's domestic subscribers in the first 90 days (views = domestic hours ÷ runtime) get a bonus of 50% of the fixed residual: ~$9,031 per half-hour episode, $16,415 per hour, $40,500 for a >$30M film ( https://www.nbclosangeles.com/news/business/money-report/hollywood-writers-strike-to-end-on-wednesday-as-wga-amptp-finalize-labor-contract/3232240/ ).
- Foreign streaming residuals tied to foreign subscriber counts: +76% over 3 years for the biggest services, e.g. one-hour episode $18,684 → $32,830 ( https://wdwnt.com/2023/10/breaking-wga-members-ratify-three-year-deal-with-studios/ ; https://www.hollywoodreporter.com/business/business-news/streaming-bonuses-wga-dga-hollywood-unions-1236122481/ ).
- Data transparency: total hours streamed (domestic and international) of self-produced high-budget shows given to the guild under confidentiality, shareable only in aggregate ( https://www.dlapiper.com/en/insights/publications/2023/10/inside-the-wga-and-amptp-collective-bargaining-agreement ; https://www.denofgeek.com/tv/the-one-troubling-detail-in-the-writers-guilds-new-deal ).
- Room minimums (vs mini-rooms): ≤6 episodes → 3 writers + 3 writer-producers; 7–12 → 5 + 3; 13+ → 6 + 3; development rooms ≥10 consecutive weeks, post-greenlight rooms ≥20 weeks ( https://www.today.com/today/amp/rcna117534 ; https://www.hollywoodreporter.com/business/business-news/writers-guild-tentative-agreement-details-released-1235601184/ ).
- the actors' union: success bonus = 100% of the fixed residual at the same 20%/90-day trigger, paid into a fund split 75% to the show's performers, 25% to a shared distribution fund ( https://www.dlapiper.com/en/insights/publications/2023/12/inside-the-sag-aftra-collective-bargaining-agreement ); fund reported ~$120M over the contract ( https://www.fortune.com/2023/11/13/actors-union-contract-studios-streaming-residuals-netflix-viewership-data-120-million-fund ).
- 2026 the writers' guild contract: four years (May 2026–May 2030), ratified 90.38%, ~$280M new health funding; streaming/AI terms reported but not confirmed [U] ( https://www.wga.org/news-events/news/press/wga-ratifies-2026-minimum-basic-agreement-with-amptp ; https://www.hollywoodreporter.com/business/business-news/writers-guild-tentative-four-year-deal-studios-1236555949/ ).

**Exhibitors.** North American box office $11.4B (2019) vs ~$8.74B (2024) and $8.87B (2025), still ~22% below 2019 ( https://www.screendaily.com/news/north-american-box-office-hits-887bn-for-2025-up-15-on-disappointing-2024/5212390.article ; https://www.axios.com/2026/01/02/domestic-box-office-2025-movie-theaters ). The world's #2 chain filed for bankruptcy in 2022 with ~$5B debt ( https://www.cbsnews.com/news/cineworld-bankruptcy-chapter-11-regal-cinemas-theater ).

**Festivals.** Streamers drove the record Sundance 2020 sale (~$17.5M+ worldwide, a streamer + indie distributor) and ~$80M total spend that festival ( https://screendaily.com/news/streamers-dictate-the-play-as-sundance-2020-buyers-spend-80m/5146800.article ); one tech streamer paid ~$25M for a 2021 Sundance winner [U]. By 2026 only about a dozen of 90+ Sundance titles arrived with distribution already set ( https://feedbagel.com/post/sundance-2026-movies-sold-so-far-world-cinema-prize-winner-how-to-divorce-during ).

**Creators and YouTube.** May 2025: streaming 44.8% of US TV time vs broadcast 20.1% + cable 24.1%; YouTube alone 12.5%, the largest single platform; streaming +71% since May 2021 ( https://www.thewrap.com/streaming-cable-broadcast-tv-ratings-nielsen-the-gauge-may-2025/ ). YouTube ad revenue ~$36.2B (2024); ads + subscriptions >$50B over four quarters ( https://www.hollywoodreporter.com/business/business-news/youtube-ad-revenue-alphabet-earnings-1236048205/ ). Top YouTuber's competition show for a retailer group: ~$100M budget, the creator says he lost "tens of millions", a retailer group reportedly made ≥$100M ( https://fortune.com/2025/03/30/mrbeast-lost-millions-beast-games-inspiration-winner ).

**Re-bundling.** Sports + entertainment bundles at $35.99–44.99 recreate the cable bundle (1.4); FAST recreates linear channels (1.6); studios license old shows to FAST after pulling them from SVOD (2.7).

---

#### 4. Day-to-day jobs inside and around a streamer

| Role | What the week looks like | Ladder | Pay [mostly U] |
|---|---|---|---|
| Creative / development executive (scripted, unscripted, docs, animation, film) | Read pitches and scripts, write notes, take "generals" with writers, defend projects in greenlight meetings, sit on cuts, manage producers. a retailer group doc posting: "reading pitches, giving notes on cuts and outlines, tracking projects across stages" ( https://filmlocal.com/?p=1450926 ); a studio group animation: feedback between milestone meetings, writer database ( https://www.entertainmentcareers.net/walt-disney-animation-studios/animation-creative-executive/job/523747/ ) | Assistant → coordinator → creative exec → manager → director → VP → head of region/genre | Assistant $55–75k; CE $100–160k; director $250–450k; VP $500k–1.5M+ [U]. One leader posting: Director, creative $380k–825k ( https://www.influencermarketingsociety.com/jobs/369904797-director-of-creative-experiences-at-netflix ) |
| Acquisitions (film, licensed series, festivals) | Festival screenings, market meetings, valuation models, bid sheets, territory/window carve-outs | Coordinator → manager → director → head of acquisitions | $90k–400k [U] |
| Content strategy & analysis / data science | Pre-greenlight forecasts (comps, AVS/efficiency), post-launch dashboards (starters, completers), artwork and trailer tests; job ads cite causal inference and predictive models for promo assets ( https://builtin.com/job/data-scientist-l5-promotional-media-measurement-science/7292594 ) | Analyst → DS L4/L5 → manager → director | $150k–500k+ at the leader [U] |
| Programming / homepage "merchandising" | Decide what launches when, rows and billboards, Top-10 timing, weekly vs full-season release, regional calendars | Coordinator → manager → director of programming | $80k–300k [U] |
| Localisation / dubbing | Commission dubs/subtitles for 30+ languages, cast dub actors, QC, deadlines for global day-one release | Coordinator → manager → head of localisation; outside vendors | $70k–250k [U]; dub actors per session |
| Marketing, creative and artwork | Key art in dozens of versions for personalisation, trailers, social, talent press, awards campaigns | Coordinator → manager → director → CMO | $80k–400k [U] |
| Product / engineering | Recommendation models, playback and CDN for live events, ad tech, A/B tests | Engineer L3–L7 | $150k–700k+ [U] |
| Business & legal affairs / licensing | Negotiate cost-plus premiums, overall deals, backend buyouts, pay-1 and library licences, guild compliance | Attorney → director → SVP | $150k–800k [U] |
| International originals | Local commissioning teams per country, co-productions, government relations (quotas, levies) | Local CE → director → regional VP | Local scale [U] |
| Ad sales (new since 2022) | Upfronts, CPM negotiation, measurement partners | AE → director | $100k–400k + commission [U] |

A sample week for a mid-level series creative executive [U, composite]: Monday greenlight/slate meeting with the analytics partner's forecast; Tuesday two pitches and a writers' room visit; Wednesday notes on a cut and a budget overage call with business affairs; Thursday launch-week dashboard (day-3 starters, day-28 completers) and an artwork review; Friday renewal memo for a season-2 show whose completion rate is 52% and cost is up 18%.

---

#### 5. How it is taught

- **MBA electives:** Columbia Business School B8637 "The Business of Television and Streaming" (ran Fall 2024 and 2025) ( https://doc.sis.columbia.edu/subj/MRKT/B8637-20253-001 ).
- **Degrees and certificates:** IIMC MA in Media Business Studies (from 2024-25) ( https://iimc.gov.in/files/academic-courses-document/MA-MBS-SYLLABUS-2024-25.pdf ); University of Miami Media Management Graduate Certificate ( https://com.miami.edu/gcmm/ ); University of Glasgow MSc Media Management (12 months, ~12,000-word dissertation) ( https://universitydb.io/courses/media-management-25c25755 ).
- **Trade training:** Royal Television Society "Mini MBA" in TV and streaming, ~80 hours online: industry context, programme making, business functions, future outlook ( https://www.sportsvideo.org/2024/09/24/rts-launches-mini-mba-to-supercharge-understanding-of-tv-and-streaming/ ).
- **Case studies (topics):** IMD's the market leader series A–E: business model innovation; the 2011 fiasco; the race to video streaming; streaming wars (scale economies as content costs rise); capturing value ( https://www.imd.org/research-knowledge/case-studies/netflix-d-streaming-wars-cartoon-case ). Yale SOM "the market leader and a spun-off DVD unit" (pricing, customer backlash, reversal within two weeks) ( https://cases.som.yale.edu/netflix-and-qwikster ). Common case themes [U, typical syllabus]: subscription pricing and churn; disruption of the cable bundle; data-driven greenlighting; launching a studio-owned service (cannibalising licence revenue); ad-tier launch; password sharing; sports rights valuation; M&A.
- **Certifications:** no recognised industry-wide "streaming" certification found; nearest are ad-tech/measurement certifications and guild/producer training [U].

---

#### 6. Exploited for better and for worse

**For better**
- Low-cost international hits: a $21.4M Korean series produced ~$891M of internal value ( 2.2 ); a fading Spanish broadcast drama became a global franchise ( 2.6 ).
- Documentaries: a true-crime docuseries reached 34.3M US viewers in 10 days, growing by word of mouth from 280k average-minute viewers on day 1 to 4M by day 9 ( https://tvline.com/2020/04/08/tiger-king-ratings-34-million-viewers-netflix/ ; https://www.denofgeek.com/tv/tiger-king-34-million-viewers-netflix/ ).
- Back catalogues revived: the *Suits* bump (2.1); a 1985 song rose 8,700% globally on a music streamer in four days after a series placement, later passing 1B streams ( https://www.digitalmusicnews.com/2022/07/28/running-up-that-hill-stats-spotify-plays/ ; https://www.netflix.com/tudum/articles/this-is-the-stranger-things-song-everyone-is-talking-about ).
- Podcasts to series: true-crime/fiction podcasts became streaming and premium-cable series (*Dirty John*, *Homecoming*, *Dr. Death*), with podcast companies pitching shows as "serialised character-driven dramas" ( https://escapeartists.com/2018/10/dr-death-tv-series-based-on-podcast-in-works-at-universal-cable-productions/ ; https://www.thewrap.com/wondery-eyes-tv-deal-for-hit-podcast-over-my-dead-body/ ).
- Creators to streamers: YouTube-scale stars now get $100M budgets (3).

**For worse**
- Megadeals with thin output (3), celebrity deals judged on "productivity benchmarks".
- Shows killed before value builds: ~2-season average; cost-plus premiums and cast raises make season 3 the danger zone (2.3–2.4).
- Shelving finished films and pulling shows for write-offs (2.7).
- Smaller rooms: mini-rooms forced the 2023 room minimums (3).
- Price rises after dominance: +$12 on the leader's Standard plan since 2013, a studio-owned service +170% in six years (1.4).
- Data secrecy vs talent: completion rates leak only via press; the guild gets hours under NDA, aggregate only (3).
- Metric gaming: hours vs views, 1-minute "viewers", "streams in 24 hours" (2.9). Bot fraud on music streaming: one man used AI-generated songs and 1,000–10,000 bot accounts to collect >$10M in royalties; indicted Sept 2024, sentenced to 18 months ( https://bleepingcomputer.com/news/security/musician-gets-18-months-in-prison-for-10-million-streaming-fraud-using-ai-bots ).
- Day-and-date undercutting star backend (the 2021 lawsuit, 2.5).

---

#### 7. Generic "moments" a player could experience

1. **The cost-plus offer**: the market leader offers budget +25% up front and buys out your backend; a studio offers a lower fee plus 5% of profits.
2. **Season-2 cliff**: your show's completion rate is 48%; renewal will cost 20% more; the call comes on a Friday.
3. **The leak**: a press story publishes your show's internal efficiency score.
4. **Top-10 week**: your film enters the chart at #3 in 61 countries; your agent calls with three meetings.
5. **The streamer bump**: an old series you wrote 12 years ago lands on the leader and becomes the most-streamed show of the summer; residuals arrive, but small.
6. **Shelved**: your finished film is written off for tax; you have 30 days to find another buyer.
7. **Festival bidding war**: three streamers and an indie distributor bid at midnight; global rights vs a theatrical guarantee.
8. **Overall deal**: $20M over three years to make shows exclusively for one service; the first year produces nothing that gets greenlit.
9. **Password crackdown quarter**: your streamer's stock jumps 9% and greenlights reopen.
10. **Subscriber miss**: the stock drops 35% overnight; every project without a start date is frozen.
11. **Localisation**: your local-language series gets dubbed into 30 languages and travels.
12. **Artwork test**: marketing shows you seven key-art versions; the one without your lead actor wins.
13. **The bonus threshold**: your show hits 20% of domestic subscribers in 90 days and earns a guild success bonus.
14. **Pulled for FAST**: your cancelled series vanishes from the subscription service and reappears on a free channel with ads.
15. **Merger day**: your studio's parent is acquired; your overall deal is "under review".
16. **Day-and-date**: your film goes to streaming the same day as cinemas; your box-office bonus evaporates.
17. **Creator crossover**: a YouTuber with 50M subscribers wants you to direct their streaming competition show.
18. **Sports pre-emption**: your premiere is moved because the service won a live sports package.

Bridges to other fields: music sync (a placement lifts an old song's streams by thousands of percent, with a sync fee and back-catalogue royalties); podcasts to series (option a hit podcast, adapt it); creators to streamers (audience-guaranteed deals); boards and investors (approve content budgets, price rises, sports bids, M&A); exhibition (window negotiations); labour (strike votes, bonus claims).

---

#### 8. Proposed game rules (generic, numeric)

No real companies, people, shows or brands. "The market leader" = first mover; "studio-owned service" = launched by a studio.

**World and company lifecycle**

1. **Founding eras.** DVD-by-mail entrant appears in 1997 with 0.1M subscribers. It adds streaming in 2007 (at no extra price) and its first original series in 2013. Studio-owned services launch from 2019; at most one new service per year, up to 5 majors by 2022. Free ad-supported (FAST) services appear from 2014 and grow from 2019.
2. **Subscriber growth curve.** Each service tracks subs `N`. Quarterly gross adds = `N_addressable × reach × appeal`, where appeal = 0.4 × catalogue score + 0.4 × hit score (last 2 quarters) + 0.2 × price competitiveness. Market leader target path: 20M (2011) → 50M (2014) → 170M (2019) → 230M (2022) → 300M (2024). Studio-owned services start at 10–30M in year 1 if parent has a famous library (up to ~100M within about 16 months for a big one [U]).
3. **Churn.** Monthly gross churn base: leader 2%, mid-size 5%, weakest 7.5%. −1 point with an annual plan or bundle; +1.5 points in a quarter with no title in the Top 10; +2 points in the month after a price rise (decays over 3 months). 25% of players' "audience" are serial churners who leave within 3 months 60% of the time.
4. **Prices.** Ad-free price starts at $8 (2007) and rises $1–2 roughly every 18–24 months, faster once market share >30%. Studio-owned services launch at 45–60% of the leader's price, then rise ~15%/year until parity. Each rise: +revenue `ΔP × N`, then churn penalty (rule 3).
5. **ARPU by region.** Monthly revenue per subscriber: North America 1.0× the US price; Europe 0.65×; Latin America 0.45×; Asia-Pacific 0.4×. International subs are cheaper to win but earn less.
6. **Ad tiers.** Available from 2022. Ad-tier price = 45% of ad-free; ad revenue per ad-tier sub starts at $2/month and grows 30%/year to $6. 50–55% of new sign-ups choose the ad tier once it exists. CPM starts at $60 and falls $10/year until it hits $25 if two or more services sell ads.
7. **Password crackdown.** A one-time board decision available once subs > 200M: −1% subs in month 1, then +4% over 3 quarters; ages "goodwill" −5.
8. **Losses then profit.** Content cost is amortised 60/25/10/5% over 4 years. A service is cash-negative while content spend > 0.9 × revenue. Leader: cash-negative from 2013 to ~2020, then positive. Studio-owned services: losses of $1–4B a year for 4–5 years, break-even if subs reach 60% of the leader's ARPU-weighted scale.
9. **Debt.** A cash-negative service borrows; debt cap = 4× annual revenue. Above 3×, interest 8%; the board forces a "profit pivot" (rule 21) when debt hits the cap.

**Greenlight logic**

10. **Forecast.** Each pitch gets a forecast `AVS_pred` (value-weighted viewing) = genre demand × talent heat × IP strength × local-market bonus (+30% if the language region is under-served on that service) × noise (±40%). Efficiency = `AVS_pred / budget`. Greenlight if efficiency ≥ the service's bar; the bar rises 25% in a year with a stock drop >20% and falls 15% in a land-grab year (growth > 15%).
11. **"Gut" factor.** 30% of each greenlight decision is executive taste (a random draw seeded by the exec's track record); 70% is the forecast. A player with a hit in the last 2 years gets +15% on the gut part.
12. **Launch metrics.** After release: starters (people who watched ep 1), completers (finished season; 30–90%, median 50%), and views (= hours ÷ runtime, same as the existing game). A title enters the Top 10 if views in week 1 rank top-10 among that service's titles that week.
13. **Renewal.** Renew if `completion ≥ 50%` AND `efficiency ≥ bar`, where season n+1 cost = season n × (1.15 + 0.05 if cast renegotiation that season). Season 3 always has the renegotiation. Probability of a 3rd season ≈ 35%, 4th ≈ 20%.
14. **Release style.** All-at-once: peak week views ×1.4, but tail drops 60% after week 3. Weekly: peak ×0.8, tail lasts 3× longer, −0.5 point churn during the run.

**Deals with the player**

15. **Cost-plus offer (streamer).** Budget + premium of 10–40% (leverage: 10% for new creators, 30% standard, 40% for top talent) paid up front; player keeps no backend; the streamer owns the hit forever. Player gets a guild success bonus only if the title passes 20% of domestic subs in 90 days (from 2023): 50% of fixed residual for writers, 100% for performers.
16. **Traditional backend (studio/indie).** Lower fee (budget + 0–10%) plus 5–15% of net profits from licensing, international sales and syndication, paid from year 2 on. A hit pays 3–10× a cost-plus premium over 10 years; a flop pays nothing.
17. **Overall deals.** Annual guarantee $1–30M for 2–5 years, exclusive to one service. Requires ≥1 greenlit project per year or after 2 dry years the deal is "under review" (50% chance of buyout at 50% of the remaining value). Megadeals (≥$20M/yr) have a 40% chance of producing fewer than one title a year.
18. **Shelving / write-off.** After a merger or a profit pivot, each unreleased finished film has a 5% chance per quarter of being shelved for a tax write-off worth 30–40% of its cost to the owner; the player has 1 quarter to find a buyer at 50–70% of cost.
19. **Library licences and the bump.** A studio licenses an old series to the leader for $1–5M per season-year (big sitcoms up to $100M/yr). When an old series lands on the leader, its views jump ×5–×20 for 3 months; creators get fixed residuals, not a share.

**Pressure on studios and cinemas**

20. **Windows.** Exclusive theatrical window: 90 days to 2019; 45 days from 2020 (17 for premium rental if a studio-cinema deal is struck); streaming pay-1 starts 4–9 months after release. Day-and-date releases cut box office by 30–45% and cut stars' box-office bonuses to zero (lawsuit risk 20%). From 2026, a trend back toward 45 days is possible.
21. **Profit pivot.** When a studio-owned service's parent sees 2 years of losses >$2B, it pivots: −30% volume, +15% price, 10–20% of library pulled and written off, licensing back to the leader allowed.
22. **Cinema health.** Each 10 days cut from the average window reduces the cinema-going index by 3%; at <80% of the 2019 level a chain has a 10%/year chance of bankruptcy.
23. **Sports.** Services may bid for sports packages ($0.5–3B/year). Winning one: +5% gross adds per season, −1 point churn in season; losing a held package: −8% subs over 2 quarters.

**Markets**

24. **Share price driven by subscriber adds.** Each quarter: `return = 2.5 × (actual adds − expected adds)/expected adds`, capped at ±35% in a day. Expected adds = trailing 4-quarter average. If the company stops reporting subscribers (allowed once revenue > $30B), switch to `return = 1.5 × revenue surprise + 1.0 × margin surprise`.
25. **Market cap and greenlights.** If the share price drops >20% in a quarter, the greenlight bar (rule 10) rises 25% and new overall deals stop for 2 quarters; if it rises >20%, greenlight volume +15%.
26. **Consolidation.** When two studio-owned services are both below 40% of the leader's subs for 3 years, a merger event fires (bid premium 30–60%); the leader may bid but walks away 50% of the time if a rival bids ≥25% more.

**Labour and ecosystem**

27. **Room size.** Before 2023, streamers use mini-rooms of 2–4 writers for 8–10 weeks. After a strike event (≈2023), minimum rooms are 3/5/6 writers + 3 writer-producers by episode count, development rooms ≥10 weeks, post-greenlight ≥20 weeks.
28. **Data secrecy.** Until a strike win, the player never sees their own title's completion rate. After it, the guild receives aggregate hours each quarter; the player sees whether they crossed the 20% bonus line, not the exact number.
29. **Creator crossovers.** A creator with ≥10M followers can be offered a streaming show with a $50–100M budget; 50% chance the creator loses money personally, 70% chance the service profits.
30. **Free channels.** Titles pulled from subscription services can be licensed to FAST channels at $0.05–0.2M per season-year, keeping them visible (small residuals, +fan goodwill).

### Improv, and the careers the game is missing

Research for the film-industry life-sim in /home/user/1. Written 2026-10-12. No project files were edited.

**About the sources.** WebFetch could not resolve any host in this session (DNS errors on every domain), so every figure below comes from WebSearch results, with the URL of the page the figure came from. **[U]** marks a figure that is unverified: it comes from a single anecdote, an aggregator or marketing page, an undated page, or my own arithmetic. Treat [U] numbers as tuning ranges, not facts. Real names appear only in the research sections. The game rules (A6) use generic names only.

---

#### 0. What the code has today

### Improv: almost nothing, as the owner says

`grep -i improv src/*.js` finds 45 lines in 32 files. Nearly all of them are flavour text: trivia, director personas who "improvise on set", and curriculum cards about improvising on camera. The playable pieces are:

| Where | What it is |
|---|---|
| `depth.js:45` / `life-city.js` VENUES `improv` | An evening out: "Improv class", $25, grows `impro` by .06 and `comic` by .03 |
| `life-city.js:66` VENUES `openmic` | Comedy open mic. Free, Charisma check 12, grows `comic` and `impro` |
| `shop2.js:51` `c_improv` | "Improv level one, two and three": a one-off purchase for $750 that gives `impro` +.6 and `comic` +.3. This is cheap: the real price is about $395–$500 **per level** (see A1) |
| `competitions.js:50` `improvwars`, `media-industry.js:281` `improvfest`, `contests2.js:29` `sketchfest` | Three yearly contests that roll on `impro` |
| `acting2.js` NEED_LABEL `impro` | Improvisation is a skill some acting parts need |
| `gigs.js` `club` (comedy showcase, $150–900), `taping`, `multicam`, `webser`, `soap` | Gigs that use `impro` as one of the skills behind quality |
| `careers.js` | Two real-person bios mention improv: an Amsterdam comedy theatre, and a famous double act |

There is no improv dream in DREAMS. The game has no training theatre, level ladder, house team, audition, indie team, jam, Harold, festival circuit, coaching, teaching income, corporate work, backer role or improv fan base. **The owner is right: improv has no real presence.**

### How dreams work, and why most of them are "token"

`dreams.js` has 57 DREAMS. Each dream is only a pairing of:
- an existing `role`, which decides the craft you train;
- a `field` (film, music, creator, podcast or stage);
- a `core` regex over the job catalogue (546 jobs in `JOBS` in index.html), which picks the work that counts;
- optionally a `first` project type;
- a list of favoured gig types in `gigs.js` `DREAM_GIGS`.

Field ladders live in `paths.js` `PATHS` and exist only per field (film, music, creator, podcast, stage). Outside dreams.js, dream keys are read in only a few places: the creator, autopilot, `gigs.js:158` (favoured gigs), `depth8.js` and `paths.js`.

So a dream such as Magician, Puppeteer, Casting director or Stunt performer has no ladder, events, economics or people of its own. It is a label that steers the job board and gig offers. In Part B, "token" means exactly this.

---

#### PART A: IMPROV

### A1. How an improv career works

**The training ladder (pay to learn).**
- Big training theatres sell numbered levels. A level is usually about 8 weekly 3-hour classes.
  - One a big New York and LA theatre-affiliated theatre lists a big New York and LA theatre classes at $450 ([ColdTowne](https://coldtownetheater.com/ucb/)).
  - Backstage gives "eight three-hour classes" at about $350–$375 per level, undated [U] ([Backstage](https://www.backstage.com/magazine/article/upright-citizens-brigade-54882/)).
  - A 2024 report says a big New York and LA theatre Improv 101 "can be more than $500" ([pulse.ug, reporting on a big New York and LA theatre layoffs](https://www.pulse.ug/story/upright-citizens-brigade-facing-financial-struggles-announces-layoffs-2024082308343913983)).
- a big Chicago theatre prices:
  - Chicago Improv 1 is $395 ([secondcity.com Chicago class finder](https://www.secondcity.com/find-a-class/chicago)). New York Improv 1 was $440 in 2025 and Toronto's was $395 ([same search, secondcity.com/find-a-class/new-york](https://www.secondcity.com/find-a-class/new-york)). Smaller schools charge less: a Chicago Level 1 at another theatre was $175–$225 ([active.com listing](https://www.active.com/chicago-il/theater/classes/level-1-with-tbd-2025-107167600)).
  - a big Chicago theatre's adult ladder is Improv Levels 1–5, then an auditioned **Conservatory** of 6 levels. Each Conservatory level is seven weekly 3-hour classes, about 12 months in total ([oldwp.secondcity.com](https://oldwp.secondcity.com/courses/con-program/)). A Conservatory level costs $415 ([secondcity.com](https://www.secondcity.com/classes/chicago/conservatory-2)). The Conservatory audition is free ([secondcity.com](https://www.secondcity.com/classes/chicago-conservatory-auditions)).
- The a big Los Angeles theatre use five levels: Basic, Intermediate, Advanced, Writing Lab and Advanced Writing Lab. Admission is by audition, and repeating levels is common. The full programme takes "roughly five years". From the Writing Lab on, the Main Company votes on who advances ([Wikipedia: The a big Los Angeles theatre](https://en.wikipedia.org/wiki/The_Groundlings)).
- **Rough total cost:** 5 levels × about $400–$500 = **$2,000–$2,500** before any conservatory or advanced study. This is my arithmetic from the prices above [U].
- **Drop-ins and jams** are the free or cheap rung: open sessions with no instructor, often weekly, capped around 16 people ([What If Theatre drop-in listing](https://whatif.corsizio.com/event/689161d4023816d0e2211048); [Hart House](https://harthouse.ca/classes/improv-drop-in)).

**House teams and auditions.**
- Big theatres cast **house teams** (Harold teams) from students and graduates. Teams rehearse weekly with an assigned coach, and members with poor attendance are removed. Auditions run in groups of 6, seen every 20 minutes. Eligibility is Improv 301 or higher, with one theatre raising the bar to 401 ([ColdTowne Harold Night](https://coldtownetheater.com/ucb-harold-night/)).
- Teams get "cycled out" and members replaced at each audition round ([WIT FAQ](https://witdc.org/news/faq-harold-teams-audition-process/)). One round cast 17 new players ([WIT](https://witdc.org/news/wit-casts-17-new-harold-team-players/)).
- **Scale of competition:** a big New York and LA theatre's artistic director reported more than **400 audition submissions** for one house-team round ([The Comic's Comic, 2011](https://thecomicscomic.com/2011/12/21/upright-citizens-brigade-the-pit-announce-new-house-teams-for-sketch-and-improv-in-2012/)).
- A New York theatre's ensemble night requires core Levels 1–3 plus Advanced Level 2 to audition. Its musical improv teams require Musical Level 3 ([Magnet Theater FAQ](https://magnettheater.com/?p=4676)).
- a big Los Angeles theatre: graduates of Advanced Writing Lab can be voted into the Sunday Company, for 6-month terms with a maximum of 3 terms. From there they can be voted into the Main Company, which has about 30 members, and **Main Company members perform without pay** ([search summary of Wikipedia/LA Mag](https://en.wikipedia.org/wiki/The_Groundlings)).

**Indie teams.** People who are not on a house team form their own teams. They usually rent a room and keep the door, or take a door split.
- Common deals: a flat rental (the team keeps the whole door), a split (the venue keeps **20–30%**), or a free room (the venue keeps the bar) ([TickPick organiser guide](https://www.tickpick.com/blog/organizer/how-to-run-a-profitable-comedy-show)).
- Some theatres class indie and student troupes as "practice" with no box-office share ([ColdTowne submissions](https://coldtownetheater.com/submissions-auditions/)).

**Forms.**
- **Long-form**, the Harold: first performed by The Committee in 1967, then codified at ImprovOlympic in the 1980s. It runs opening → three beats of three scenes, with group games between beats. Scenes converge at the end, and a Harold lasts **25–40 minutes** ([Wikipedia: Harold](https://en.wikipedia.org/wiki/Harold_(improvisation))). Other long forms include the Armando (monologue-driven), the montage and the "Lloyd" (named in ColdTowne listings).
- **Short-form:** games scored by a host. Theatresports came from Keith Johnstone's Loose Moose, Calgary, 1977/78: two teams, judges, and a horn for boring scenes ([Alberta Views / impro.global](https://impro.global/about-us/keith-johnstone)). ComedySportz began in Milwaukee in 1984 and is a licensed franchise. A match has 2 teams of 3, a referee, 7–12 games and family-friendly rules, in 20–25 cities ([Wikipedia: ComedySportz](https://en.wikipedia.org/wiki/ComedySportz); [CityBeat](https://www.citybeat.com/arts/comedysportz-is-the-latest-of-the-citys-growing-improving-collection-of-improv-troupes-12182949)). TV short-form: *Whose Line Is It Anyway?* ran on UK radio from 1987 and TV from 1988–1999, and in the US from 1998 with 21 seasons and 431 episodes ([Wikipedia US](https://en.wikipedia.org/wiki/Whose_Line_Is_It_Anyway%3F_(American_TV_series)); [Wikipedia UK](https://en.wikipedia.org/wiki/Whose_Line_Is_It_Anyway%3F_(British_TV_series))).
- **Musical improv:** improvised musicals with an accompanist. One long-running UK company had 19 actors rotating through 25 Fringe performances ([Playbill](https://mobile.playbill.com/article/playbill-pick-showstopper-the-improvised-musical-at-edinburgh-festival-fringe)). Small theatres "can't pay much, but there is some pay" for accompanists ([Berkshire on Stage](https://berkshireonstage.blog/2025/12/15/mopco-improv-theatre-seeks-additional-accompanists-for-improv-shows/)).

**Festivals.**
- The flagship improv marathon (Del Close Marathon) had **750+ shows on 11 stages** in its final NYC year, 2018, and moved to LA in 2019 ([Time Out LA](https://www.timeout.com/los-angeles/news/ucbs-annual-improv-marathon-is-moving-from-new-york-to-l-a-060618)). About 500 teams were chosen from 1,500 submissions, year undated [U] ([Funny Women](https://magazine.funnywomen.com/2018/06/01/the-del-close-marathon/)).
- Small festivals charge a troupe application fee: $35 ($25 early) ([Improv Festivus](https://cszrichmond.corsizio.com/event/68bb99bb6b01149ad39f8be4)), $25 ([Bay Area Musical Improv Fest](https://crowdwork.com/festivals/bay-area-musical-improv-festival)), or $20 plus an optional $30 support fee ([Ottawa, via search](https://improvembassy.corsizio.com/event/6796965b9c18182d25b38fb6) [U]). Some charge nothing ([Hideout Theatre](https://www.hideouttheatre.com/?p=4592)).
- **Edinburgh Fringe**, for a team going big:
  - Total cost: about £6,000 for a three-week run, and a one-person show rose from £10k to £15k in five years ([Scotsman](https://www.scotsman.com/whats-on/arts-and-entertainment/how-costs-for-edinburgh-festival-fringe-performers-and-venues-have-gone-absolutely-mad-as-accommodation-bills-soar-300-per-cent-4715919)).
  - Registration is about £295–£300 ([Spotlight](https://www.spotlight.com/news-and-advice/the-essentials/budgeting-for-edinburgh-festival-fringe/)).
  - "Lots of people end up £10,000 down" ([Playbill](https://web.playbill.com/article/how-to-take-a-show-to-the-edinburgh-festival-fringe-venues-and-budgets)).
  - One venue's balance sheet showed £70,000 in ticket sales of which £7,000 went to the performer ([Scotsman](https://www.scotsman.com/whats-on/arts-and-entertainment/dont-ask-about-dosh-the-true-cost-of-staging-a-fringe-show-1611540)).

**Touring companies and resident stages.**
- a big Chicago theatre hires by competitive audition: "a handful out of hundreds". Hires then go through an understudy programme, then touring groups, then the smaller e.t.c. stage, then the mainstage. Mainstage revues play **8 shows in 6 days** and are built from material tested on audiences ([search summary: Backstage / Eye Opener / CBS](https://www.backstage.com/magazine/article/tips-launch-comedy-improv-career-second-city-69848/)).
- Pay (Actors' Equity contract):
  - Touring home-show fee about $165–$168 per performer, and a mainstage weekly minimum of **$968.25 (2019)** ([Law Insider clause](https://www.lawinsider.com/clause/mainstage-minimum/_1) [U, an old contract excerpt]).
  - An understudy notice gave $128.10 per show in 2024 ([BroadwayWorld](https://direct.broadwayworld.com/equity-audition/Second-City-Chicago-Second-City-Inc--2024-42396)).
  - **2025 contract:** strike authorised, then a 5-year deal with raises compounding to **40.5% by 2030** ([Actors' Equity](https://actorsequity.org/news/PR/SecondCityStrikeAverted2025); [WBEZ](https://www.wbez.org/theater-stages/2025/05/05/second-city-workers-union-strike-pay-actors-equity)).

**Cruise ships and theme parks.**
- A a big Chicago theatre troupe performed on Norwegian Cruise Line ships from 2005 until the partnership ended. Contracts were about 4 months aboard ([AV Club](https://avclub.com/you-can-no-longer-cruise-your-way-to-comedy-stardom-1798263725)). One line employs 25–35 comedians a week across 20 ships ([Frommer's](https://www.frommers.com/tips/cruise/a-cruise-ships-walks-into-a-bar-says-to-the-bartender/)). Guest entertainer pay is "$1,500–2,500/week" [U] ([Citizen Daily Post](https://www.citizendailypost.com/faq/how-much-do-guest-entertainers-make-on-cruise-ships/)). MSC runs improv on board ([Seatrade](https://www.seatrade-cruise.com/ship-operations/seaside-has-msc-s-first-comedy-improv-new-shows-zip-lines)).
- Theme-park street improv: a troupe of improvisers worked a studio group's Hollywood Studios' boulevards from 1989 to 2020. They were laid off in the pandemic and had not returned as of 2023 ([WDWNT](https://wdwnt.com/2020/10/breaking-legendary-citizens-of-hollywood-at-disneys-hollywood-studios-let-go-as-entertainment-layoffs-continue-at-walt-disney-world/)). Those performers were under an Actors' Equity agreement ([WDWInfo](https://www.wdwinfo.com/news-stories/walt-disney-world-sends-out-casting-call-for-new-citizens-of-hollywood/)). Park performer floors are **$21.30–$23/hour** ([CNN via ABC17](https://abc17news.com/money/cnn-business-consumer/2024/04/17/mickey-minnie-donald-and-goofy-file-for-union-vote-at-disneyland/)), and an Equity seasonal notice posted $23/hour ([Playbill](https://m.playbill.com/job/mickeys-not-so-scary-halloween-party-equity-video-submissions-deadline-05-08-24/43ff5b08-e496-496a-bb01-440a02369939)).

**Corporate / applied improv.**
- This is the real money. a big Chicago theatre's corporate arm was **about a third of the business, about $20M a year (2016)** ([Fortune](https://dc.fortune.com/2016/06/03/second-city-diversity/)). It has 600+ clients, including 25% of the Fortune 500 [U, undated] ([Chicago Innovation](https://chicagoinnovation.com/winners/second-city-works/)).
- Published rates:
  - **$200/hour** with a 2-hour minimum, a **$1,000 half day** or **$2,000 full day** per trainer, and **$350** for a 30-minute performance ([Florida Studio Theatre](https://www.floridastudiotheatre.org/corporate-training)).
  - $100–$150 per participant ([Soulpepper](https://soulpepper.ca/corporate-training/)).
  - From $3,000 for 2–4 hours ([Change Through Play](https://www.changethroughplay.com/our-services)).

**Teaching improv as income.** Typical pay is $45–$60/hour: $45–$60 for a nonprofit residency ([Philadelphia Cultural Fund portal](https://portal.philaculture.org/node/75042)), $50–$100 for contract after-school work ([GoHire](https://jobs.gohire.io/concorde-education-3npbmhal/part-time-after-school-improv-and-theater-instructor-279361)), $50 at a DC theatre in 2021 ([WIT](https://witdc.org/news/washington-improv-theater-seeks-teaching-artist-for-youth/)), and as low as $20 per class hour ([Lexy's](https://careers.ecampus.oregonstate.edu/jobs/lexys-comedy-club-improv-instructor/)). House-team **coaches** at a big New York and LA theatre went unpaid for years. A 2018 plan to pay them was postponed, and payment began only recently ([Paste](https://www.pastemagazine.com/comedy/ucb/ucb-to-start-paying-house-team-coaches)).

**Performer pay.**
- **Usually nothing.** a big New York and LA theatre's no-pay policy was criticised in 2012–13. Its defence was cheap tickets and "if you pay, you have to assign worth to shows". As of 2024, a big New York and LA theatre improv and sketch performers typically still don't get paid ([search summary: Createquity / Paste / Substack](https://createquity.com/2013/06/what-am-i-worth-to-you/)). "We pay our performers, just not in money" ([MetaFilter](https://metafilter.com/161976/We-pay-our-performers-just-not-in-money)).
- An improviser says one could "count on two hands" the theatres that pay ([Dallas Observer](https://www.dallasobserver.com/arts/stomping-ground-comedy-theater-will-pay-its-performers-11546733)).
- **Where pay exists:** a Minneapolis theatre pays **$150 or $75** depending on time slot when a show sells more than **70 seats** ([Paste](https://pastemagazine.com/article/how-one-twin-cities-improv-theater-pays-performers)). A Philadelphia theatre gives show-runners a percentage of tickets plus 100% of post-show donations ([Paste, "6 theaters that pay"](https://pastemagazine.com/comedy/labor/6-improv-and-sketch-theaters-that-pay-performers)). Austin resident shows get a door percentage scaled by frequency and slot ([ColdTowne](https://coldtownetheater.com/submissions-auditions/)).

**The pipeline out.**
- **Sketch / late night / SNL:** SNL has scouted a big Chicago theatre since 1975, and the a big Los Angeles theatre supplied several cast members ([Yahoo/a big Los Angeles theatre list](https://uk.news.yahoo.com/32-snl-stars-other-comic-143250509.html); [museum.tv](https://www.museum.tv/snlchicago)). There is no measured share.
- SNL pay: first-year featured players earn about $7,000 per episode, about $147k for 21 episodes, from a 2018 Variety report [U] ([celebritynetworth](https://www.celebritynetworth.com/articles/entertainment-articles/how-much-money-do-saturday-night-live-cast-members-make/)). One cast member said "about $3,000", which is an anecdote [U] ([Sportskeeda](https://www.sportskeeda.com/us/shows/news-how-cast-members-afford-live-nyc-netizens-react-pete-davidson-jokingly-says-snl-cast-members-get-paid-3k-per-episode)).
- **Writers' rooms:** late-night staffs keep improvising on stage. One late-night writer called improv "unrefined writing" ([Village Voice](https://www.villagevoice.com/?p=399900)). One writer went through **35 rejected packets** before being hired ([Inside Late Night](https://latenighter.com/podcasts/inside-late-night-with-mark-malkoff-ep-58-jenny-hagel/)). A network late-night workshop picked from **1,000 applicants** ([The Comic's Comic](https://thecomicscomic.com/?p=33517)). The the writers' guild staff-writer 20-week rate was **$4,940/week** for 2024–25 [U, slide excerpt] ([the writers' guild 2023 MBA summary](https://wgacontract2023.org/the-campaign/summary-of-the-2023-wga-mba)).
- **Commercials:** many commercial auditions have no dialogue, so agents prefer actors who studied improv. the actors' union does not allow improvised dialogue at auditions, so in practice this means ad-libbing around copy ([Backstage](https://www.backstage.com/magazine/article/improvisation-training-commercial-audition-necessity-12178/)). One theatre sells a "commercial auditions" improv intensive ([Dad's Garage](https://dads-garage.coursestorm.com/course/improv-for-commercial-auditions-intensive)).
- **TV and streaming improv:** three hour-long long-form specials on the market leader on 21 April 2020 ([Flow Journal](https://www.flowjournal.org/2020/07/middleditch-and-schwartz/)). An online improv game show premiered June 2022, and its clips drove a young online fan base ([Wikipedia: Make Some Noise](https://en.wikipedia.org/wiki/Make_Some_Noise_(TV_series)); [AOL](https://www.aol.com/news/dropout-part-internet-part-studio-100000140.html)). The platform claims 1.5B organic social views [U, marketer portfolio] ([format.com](https://markcatangui.format.com/dropout)). The cast became a live touring troupe in 2024 (same sources).
- **Podcasts:** an improvised fantasy podcast, about 90% improvised, ran 10 years. It does live tours with tickets from $34 and is funded by Patreon ([Blumenthal](https://www.blumenthalarts.org/events/detail/hello-from-the-magic-tavern-1); [AllAccess](https://www.allaccess.com/podcast/broadcaster-meets-podcaster/archive/25291/hello-from-the-magic-tavern-interview-with-arnie)).
- **Voice work:** no source links improv training to voice-over directly [U]. VO rates are in Part B.

### A2. Theatre economics

- **Classes pay the bills; shows are the shop window.**
  - Ticket price rises at a big New York and LA theatre are a "nominal" revenue source compared with class fees ([pulse.ug](https://www.pulse.ug/story/upright-citizens-brigade-facing-financial-struggles-announces-layoffs-2024082308343913983)).
  - An insider estimate: about 12,000 students a year, about $5M ([ArtsJournal: "How a big New York and LA theatre Turned Improv Into Big Business"](https://artsjournal.org/?p=100888) [U, secondhand]).
  - A nonprofit DC improv theatre had revenue of **$1.02M against expenses of $1.18M (2024)** ([ProPublica 990](https://projects.propublica.org/nonprofits/organizations/521543346)). It taught 1,700+ adult students in FY2019 ([Daffy](https://daffy.org/charities/521543346-washington-improvisational-theater-co-washington-dc)) and 1,028 in FY23 ([WIT FY23 report](https://witdc.org/wp-content/uploads/2023/12/WIT-FY23-Annual-Report-Final.pdf)).
- **Tickets and rooms:** improv in a professional black box costs $10–$13 ([a big Chicago theatre NY](https://www.secondcity.com/shows/new-york/improv-4-show-nyc-nyc)). One ticket can buy a whole night of house teams ([NYC Tourism listing](https://www.nyctourism.com/events/megawatt-improv-comedy/)). Black boxes seat about 60–180 ([search summary](https://wqad.com/article/news/local/as-seen-on-tv/improv-black-box-theatre-returns/526-d9e6d54c-0c1a-4f41-80bf-2deb119cc924) [U]). Bars are part of the model ([Magnet FAQ](https://magnettheater.com/?p=4676)).
- **Rent, property and closures:**
  - In June 2020 a Chicago long-form theatre closed for good. Its owner cited lost class income and a **$100,000 property-tax bill**. The building was sold in 2021 and the theatre reopened in November 2022 under new owners ([Block Club Chicago](https://blockclubchicago.org/2020/06/19/io-theater-closing-for-good-because-of-financial-strain-from-coronavirus-pandemic/); [Wikipedia: a long-form theatre](https://en.wikipedia.org/wiki/IO_Theater)).
  - a big New York and LA theatre closed its last NYC theatre and training centre in April 2020 ([NY1](https://ny1.com/nyc/all-boroughs/news/2020/04/21/upright-citizens-brigade-closes-new-york-theater-and-training-center-due-to-coronavirus)). In December 2020 it sold its Sunset Blvd complex after missing mortgage payments ([ArtsJournal](https://www.artsjournal.org/2020/12/24/upright-citizens-brigade-closes-yet-another-theater/)). The founders sold the company around March 2022 to a group including a talent manager and venture capitalists ([Substack](https://piffany.substack.com/p/can-ucb-in-your-future) [U, paywalled]). It later reopened in NYC on East 14th St ([NBC NY](https://nbcnewyork.com/entertainment/the-scene/the-upright-citizens-brigade-is-coming-back-to-new-york-after-3-years/4486749)).
  - a big New York and LA theatre's development deal with a streamer had "masked two years of deficits" ([MetaFilter](https://Metafilter.com/178391/UCBs-development-deal-with-Seeso-had-masked-two-years-of-deficits)). a big Chicago theatre was bought by a private-equity firm in 2021 ([Equity/aflcio summary](https://aflcio.org/node/9442)).
- **Nonprofit vs for-profit:**
  - The DC theatre above is a 501(c)(3) that gets grants, including its "largest-ever NEA grant" ([WIT FY23](https://witdc.org/news/annual-report-fy23/)).
  - The big brands are for-profit businesses whose corporate training and classes fund the stage.
  - ComedySportz is a licence: a city needs "a sound business plan and strict adherence to branding" ([CityBeat](https://www.citybeat.com/arts/comedysportz-is-the-latest-of-the-citys-growing-improving-collection-of-improv-troupes-12182949)).
- **Labour:** a big Chicago theatre performers and stage managers struck a deal in 2025 after a unanimous strike authorisation ([Equity](https://actorsequity.org/news/PR/SecondCityStrikeAuthorized2025/)). a big Chicago theatre's non-performing staff unionised with UE ([In These Times](https://inthesetimes.com/article/second-city-union-democratic-socialists-america-comedy-labor)). a big New York and LA theatre performers have pushed publicly for pay and transparency ([LA Mag](https://www.lamag.com/culturefiles/ucb-performers-union/)).
- **Diversity programmes:** a big Chicago theatre's fellowship for performers of colour is **tuition-free**. It was 15 weeks with up to 12 fellows. The 2026 version is 20 weeks with up to 10 fellows. Over ten years, **more than 50%** of fellows were hired by a big Chicago theatre divisions ([a big Chicago theatre](https://www.secondcity.com/network/the-second-city-announces-recipients-of-its-tenth-annual-bob-curry-fellowship); [audition page](https://www.secondcity.com/auditions/bob-curry-fellowship-audition)). It also lists other fellowships and an SNL scholarship ([oldwp.secondcity.com](https://oldwp.secondcity.com/?p=39790)). The 2020 closure of the Chicago theatre came during a racial-justice petition, though the owner said the reasons were financial ([Wikipedia: a long-form theatre](https://en.wikipedia.org/wiki/IO_Theater)).

### A3. Backers and supporters (roles a player could take)

| Role | What they really do | Real anchors |
|---|---|---|
| **Theatre owner / artistic director** | Owns the lease and the class funnel. Sets class prices, casts house teams, assigns coaches, decides who gets paid, and lives or dies on rent and property tax | Property-tax closure, mortgage-driven sale, ownership changes (A2) |
| **Training-centre director** | Runs the curriculum and teachers. Classes are the main revenue | Class prices in A1 |
| **Producer of indie shows** | Rents a room, books teams, splits the door 70/30 or keeps the bar | [TickPick](https://www.tickpick.com/blog/organizer/how-to-run-a-profitable-comedy-show) |
| **Festival organiser** | Charges $20–$35 application fees, selects ~1 team in 3 (marathon: 500 of 1,500 [U]), runs many stages | A1 festivals |
| **Corporate-training seller** | Sells $1k–$3k workshops and needs improvisers to deliver them | A1 corporate |
| **Scout / agent / manager** | Watches showcases and house-team nights. Industry nights are full of agents, managers, casting directors and bookers | [JFL New Faces, NPR](https://www.npr.org/2019/07/30/746330491/new-faces-shine-at-the-worlds-biggest-comedy-festival); [State of Comedy](https://stateofcomedy.substack.com/p/guest-column-how-to-get-industry) (invite the assistants, not just the senior agent) |
| **Patron / donor** | Funds a nonprofit theatre, a scholarship or a fellowship. Grants (NEA) | WIT 990 and annual report |
| **Licensor / franchisor** | Licenses a short-form brand city by city | ComedySportz |
| **Streamer / online platform** | Turns the scene into clip content and touring live shows | A1 pipeline |

### A4. Fans

- **Students as the audience.** The audience of an improv theatre is largely its own students and their friends. The closest sources are college troupes courting student crowds with low prices ([Tufts Daily](https://www.tuftsdaily.com/article/2003/01/local-improv-troupe-seeks-college-audiences); [Daily Bruin](https://ssh.dailybruin.com/2002/09/30/whose-class-is-it-anyway/)). The "mostly improvisers in the room" problem is widely discussed, but I found no figure [U].
- **Regulars and superfans:** cheap all-night tickets ([NYC Tourism](https://www.nyctourism.com/events/megawatt-improv-comedy/)) and late-night marathon shows build a core who see every Harold night.
- **Festival-goers:** "thousands over 56 hours and 600 shows" [U, undated] ([Rolling Stone / search summary](https://www.rollingstone.com/culture/culture-news/comedy-all-stars-honor-del-close-87498/)).
- **Family audiences:** clean short-form matches with an audience-judged winner ([ComedySportz](https://www.comedysportz.com/the-match-experience)).
- **Online clip audiences:** short-form clips of improv game shows on TikTok and Reels made the format a hit with a "young and chronically-online" crowd ([Exist Yesterday](https://buttondown.com/jonathanbogart/archive/going-out-june-2025)). Patreon fans fund improvised podcasts (A1).

### A5. Distinctive moments (generic, for events)

1. **The click.** In Level 2, a scene where you stop trying to be funny and just listen, and the room roars. +impro, and a teacher remembers your name.
2. **The cast list goes up.** The house-team audition results are posted on a corkboard or in an email at 11:58 p.m. You scroll for your name among 400 hopefuls.
3. **The set dies.** A 30-minute Harold with no game, and the third beat goes nowhere. Twelve people in the audience, nine of them classmates.
4. **A scout in row C.** Someone from an agency is in. Everyone overplays, except the one person who doesn't.
5. **The price rise.** The theatre raises Level 1 by $50 and the mailing list revolts. Do you defend the owner or sign the open letter?
6. **The legendary jam.** A 1 a.m. Tuesday jam where a stranger, a famous alum and you build something the whole scene talks about for years.
7. **The team gets cut.** Your house team is "cycled out" after a season. The coach says it isn't personal.
8. **Pay-to-play maths.** Your indie team rents the room for the night, and nine tickets sell.
9. **The coach you love leaves** for an LA writing job. You realise there is a ladder out.
10. **The sketch packet.** A late-night show opens submissions. Your sketch team writes all weekend.
11. **The corporate gig.** You teach "Yes, and" to a bank's sales team for $1,000 and feel strange about it, then pay rent with it.
12. **Strike vote.** The resident cast votes on a strike authorisation. Do you cross, march or mediate?
13. **The theatre goes dark.** The landlord, the tax bill, a pandemic. Classes go online. The owner announces the theatre will not reopen.
14. **The festival acceptance.** Your team is accepted to a marathon festival, 1 of 3 taken. Your slot is at 3:40 a.m.
15. **A clip escapes.** A 40-second bit from a show posted online gets two million views. Strangers quote your line at you.
16. **Musical night.** The accompanist plays a key change you didn't expect and you sing the 11 o'clock number of a musical that has never existed.
17. **The cruise contract.** Four months at sea, eight shows a week, the same 30 games. You save every dollar and lose your edge.
18. **The audition partner.** At the touring-company audition you're paired with a weak scene partner. You carry the scene, and that's what gets you hired ([Backstage anecdote](https://www.backstage.com/magazine/article/tips-launch-comedy-improv-career-second-city-69848/)).
19. **The fellowship letter.** A free 20-week fellowship acceptance arrives the same day as your landlord's rent increase.
20. **Theatre politics.** The artistic director casts their own students on the best night. Do you say something?

### A6. Game rules (numeric, generic names)

All money is in today's dollars and passes through the existing `usd()` scaling. Skills refer to existing keys: `impro`, `comic`, `pres`, `dial`, `orig`, `struc`, `cha`, `voice`, `song`, `eth`. "Week" means an S.week tick.

**Performer: the ladder**
1. **New dream** `improv` ("Improviser"): `role: 'actor'`, `field: 'stage'`, `grp: 'Stage'`. Its core regex is `/\b(improv\w*|sketch|harold|ensemble|house team|comedy theat\w*)\b/i`. Add a `sketch` dream ("Sketch comedian", `role: 'writer'`, field stage, favoured gigs `club`, `webser`, `multicam`, `taping`).
2. **Training theatre levels 1–5:** each level takes 8 weeks at one evening a week and costs **$400–$500** (big brand) or **$175–$250** (small theatre). Each level gives `impro` +.25 and `comic` +.1, and **meets 2 classmates**. Finishing Level 3 unlocks the house-team audition; Level 5 unlocks the conservatory audition (free, 1 in 4 accepted). The conservatory is 6 levels × 7 weeks × $415. Replace the $750 shop bundle with "Level 1" at $450.
3. **Repeat chance:** at a big Los Angeles theatre-style schools, 30% of students are asked to repeat a level (repeating is common per the source; the 30% is a tuning guess [U]).
4. **Jams:** free and weekly. Each jam is a d20 + `impro` roll: 10% chance of a "legendary jam" (+2 standing in the improv scene, +1 meet with an alum), 15% chance of a "dead jam" (+3 stress).
5. **House-team audition** twice a year: about **400 applicants for 12–20 spots**, a base 4% chance. Add +1% per `impro` point above 10, +3% per previous audition (the "known face" bonus), and +5% if your coach is a contact. Selection lasts 1 season (26 weeks). At the end of each season, 25% of teams are cycled out.
6. **House-team life:** rehearse 1 evening and play 1 show a week. Pay is **$0**. Each show is a quality roll: a mean of `impro`×4 + team chemistry, with sd 15. Shows above 75 add +1 scene standing. Missing 2 rehearsals means removal.
7. **Indie team:** form one with 3–8 contacts. Room rental is **$100–$300** a night, or a 70/30 door split at a partner theatre. Tickets are **$10**, in a 60-seat room. Without a following, attendance is about 8 + (scene fans × 0.1). Team chemistry drifts by ±2 a show.
8. **Paid performance:** at theatres that pay, a show earns **$75** in a late slot or **$150** in a prime slot when it sells more than 70 seats. Make this 1 theatre in 5 per city.
9. **Resident company path:** pass the auditioned understudy programme (1 in 30 of those who try), then go touring, then the second stage, then the mainstage. Touring pays **$165 per show**; the mainstage pays **$970/week** (2019 minimum), raised by **+7% a year** after a strike year. The mainstage plays 8 shows a week. Each revue takes 12 weeks to write in front of audiences and then runs 26 weeks.
10. **Musical improv** is a separate track (Musical Levels 1–3). It needs `song` ≥ 8 and auditions separately. A musical team is 2× more likely to get festival slots and pays the accompanist (a `composer` NPC) $50 a show.

**Performer: income on the side**
11. **Teaching:** after 3 years and Level 5 (or the conservatory), you can teach. **$50/hour** at 3 hours a class gives $150 a week per class, up to 3 classes. Each class adds +1 to students-as-audience (rule 22). Coaching a house team pays $0–$100/week depending on the theatre (pay began only recently).
12. **Corporate gigs:** offers arrive at a rate of 0.3 a month once `impro` ≥ 12. They pay **$1,000 a half day** or **$2,000 a full day**, cost 4 stress, and add `pres` +.02. They don't count as art: the scene loses 1 standing if you do more than 6 a year.
13. **Cruise contract:** a 16-week offer at **$1,500–$2,500/week** [U]. Living costs are zero while on board. You perform 8 shows a week of short-form, and `impro` decays by .02 a week (the same 30 games). Your city contacts' ties decay at 2× the normal rate.
14. **Theme-park street improv:** **$21–$23/hour**, 5 days a week, union. Gives `phys` and `comic` +.01 a week. It makes 12% of `cha` rolls with strangers easier, and teaches nothing about long-form.

**Performer: bridges out**
15. **Sketch team → late-night packet:** each packet takes 4 weeks of `dial` + `orig` work. The base hire chance is **3%** (about 35 rejections before a hire), plus 1% per `orig` point above 12. A hire lands you a staff-writer job at about **$4,900/week** on 20-week cycles (showrunner field, film).
16. **Network sketch show:** a scout watches 1 show a month at each big-brand house-team night. The chance a given scout notices you is (show quality − 70) × 1%. Being noticed leads to a screen test, then a cast offer of about **$7,000 per episode for 21 episodes** [U].
17. **Commercials:** each improv level adds +4% to the booking roll for the `spot` gig (no-dialogue auditions), capped at +20%.
18. **Acting:** `impro` counts double for parts with NEED `impro` or `comic`. Each house-team season adds +1 to the casting "seen around town" stat.
19. **Podcasts:** with 2 or more scene friends you can start an "improvised podcast" work type (field podcast). It earns `fol` like the existing podcast type, with ×1.3 engagement if team chemistry is above 70. At 5,000 followers you unlock a live tour at $34 a ticket.
20. **Online clips:** any show of quality 85 or more has a 5% chance of producing a clip. A clip gives creator followers of 2,000–200,000 on a log-uniform roll, and gets you invited to an online improv game show (a `webser` gig with a high fame value).
21. **Voice:** improv levels add +2% each to `dub` and `audio` gig quality. The source support for this is weak [U].

**Fans**
22. **Students as audience:** each theatre's audience = 0.6 × current students + 0.3 × regulars + walk-ins. Raising class prices 10% cuts enrolment 6% and the audience accordingly.
23. **Regulars and superfans:** each show of quality 80 or more converts 2% of walk-ins to regulars. Regulars convert to superfans at 1% a month. A superfan follows your team to festivals and buys merch ($15 a head a year).
24. **Festival-goers:** a festival slot puts you in front of 50–400 people. 0.5% of them become online followers, and 1 in 20 festival slots puts a scout in the room.
25. **Online clip fans** decay at 8% a month unless you post again within 6 weeks.

**Backers**
26. **Owning a training theatre:**
    - Start-up costs **$60k–$150k** [U]. Rent is **$6k–$20k a month** depending on city [U, my estimate; no source found].
    - Revenue: classes at 12–16 students × $450 per 8 weeks, plus shows at $10 × fill × 70 seats, with a bar at +40% of the door.
    - Classes should make up 60–80% of revenue; this follows the "tickets are nominal" report.
    - Every January there's a property-tax event of 5–10% of yearly revenue.
27. **Pay policy choice:** pay performers $0, $75/$150 or a door share. Paying cuts margin and gives staff and cast +10 loyalty. Not paying raises the chance of an open letter by 5%/year and of a union drive by 2%/year.
28. **Union drive / strike:** once a union exists, the contract renews every 5 years. If wages lag the city's other theatres, there's a 30% strike-vote chance; settling costs +35–40% on wages over 5 years.
29. **Pandemic or landlord shock:** 1% a year (or the scripted 2020 era). Shows stop, and classes go online at 40% of revenue. With less than 6 months of cash, the theatre closes or sells to an investor at 0.3–0.6× its value.
30. **Corporate arm:** an owner can open a corporate-training arm. It needs 6 trained teachers and then grows 15% a year up to a third of revenue.
31. **Diversity fellowship:** costs about $40k a year [U] (20 weeks, 10 fellows, free tuition). Half of the fellows join your casts, and it adds +2 to the theatre's standing with funders and the press.
32. **Festival organiser:** charges a $25–$35 application fee. Takes 1 team in 3 of applicants, runs 1–11 stages, and pays performers $0 or an honorarium. A good festival year (quality 75 or more) grows next year's applications by 15%.
33. **Indie producer:** rents rooms at $100–$300 and books 3 teams a night at $10 a ticket. Margin depends on the bar deal (TickPick's three models).
34. **Patron:** a donation of $1k–$100k gets your name on a scholarship or a room. That adds standing with the scene, and a 10% chance a year that a beneficiary later names you in a speech (fame).
35. **Scout/agent watching showcases:** an agent player can attend 1 showcase a week. Each attendance reveals the hidden potential of 1–3 performers (a `fog.js` hook). Signing an improviser costs 0 and pays 10% of their later work.

### A7. Suggested integration (brief)

- New file `src/improv.js`. It would hold the theatres generated per hub (a big brand, a long-form shop, a short-form franchise, a nonprofit, and 1–3 indie rooms), class enrolment, auditions, teams, shows and festivals. It adds a `PATHS.improv` ladder (Student → Graduate → House team → Resident/paid → Known in the scene → TV/room), or adds rungs to `stage`.
- Reuse `GIG_TYPES.club`, `taping`, `multicam`, `spot` and `webser` for the bridges. Add gig types `corpimprov` and `cruise`.
- The contests `improvwars`, `improvfest` and `sketchfest` become calendar events on the improv path.
- Add a `teaching` income stream through `M.streams`.

---

#### PART B: OTHER CAREERS WORTH ADDING

**Status key:** **Missing** = no dream and no system. **Token** = a dream (or job titles) exists, but it is only role + regex + favoured gigs, with no ladder, economics or events of its own. **Partial** = some real system exists (a gig type, NPCs or a page). **Moderate** = a playable system exists.

| # | Career | Status in code | Priority |
|---|---|---|---|
| 1 | Sketch comedian / sketch writer | Missing (only a `sketchfest` contest and "sketch" in the shortform regex) | High: pairs with improv |
| 2 | Stand-up comedian | Token (dream `standup`; gigs `club` $150–900 and `special`; open-mic venue) | High |
| 3 | Late-night / comedy TV writer | Partial (`showrunner` dream; `multicam` punch-up gig; no packets or room) | High |
| 4 | Talent agent / manager | Token as a player (dream `agent`; agencies exist as NPC systems in packaging.js) | High |
| 5 | Casting director | Token (dream `casting`; 11 catalogue jobs) | High |
| 6 | Drag performer | Missing | High |
| 7 | Live-event / comedy producer and promoter | Missing (only a `live` gig for crew) | High |
| 8 | Theme-park / live character entertainer | Missing (one actor odd-job "Theme park character"; `ride` film gig) | Medium |
| 9 | Cruise-ship entertainer | Missing | Medium |
| 10 | Esports caster / gaming host | Missing (zero hits) | Medium |
| 11 | Voice actor | Partial (dream `voice`; gigs `dub`, `audio`, `game`; actor odd-jobs audiobook, trailer VO) | Medium |
| 12 | Dubbing / localisation (actor, director, adapter) | Partial (gig `dub`; 5 catalogue jobs; no dream) | Medium |
| 13 | Stunt performer | Token to partial (dream `stunts`; 7 catalogue jobs; `unit2` gig) | Medium |
| 14 | Festival programmer | Token as a player (festivals.js generates programmers as NPCs) | Medium |
| 15 | Magician | Token (dream; `club`/`special`/`live` gigs; contest) | Medium |
| 16 | Puppeteer | Token (dream; 4 catalogue jobs; `kids` gig) | Medium |
| 17 | Location scout / manager | Token (dream `locations`; 7 catalogue jobs) | Low–medium |
| 18 | Radio presenter | Token (dream; 5 catalogue jobs; `taping`/`jingle`) | Low–medium |
| 19 | Trailer editor | Partial (gig `trailer`; catalogue job; no dream) | Medium |
| 20 | Game writer / narrative designer | Token (folded into `gamedev`) | Medium |
| 21 | VFX artist / animator | Moderate (dreams `vfx` and `animator`; 21+17+6 catalogue jobs; gigs) | Low |
| 22 | Studio-audience warm-up comic | Missing (flavour text in tv2.js:69) | Low, but a perfect side-hustle |
| 23 | Film critic | Moderate (critics.js has "the critic's career": freelance, staff, blog) | Low |

### 1. Sketch comedian / sketch writer (Missing)
**How it works:** teams of 4–8 write and perform short scenes. They come up through a theatre's sketch house teams (a big New York and LA theatre had 400+ applicants for one round of sketch and improv teams, [Comic's Comic](https://thecomicscomic.com/2011/12/21/upright-citizens-brigade-the-pit-announce-new-house-teams-for-sketch-and-improv-in-2012/)), sketch festivals, online sketch channels, packets to late-night shows, and the network sketch show.
**Ladder:** class → sketch team → festival → online channel → packet / staff writer → network sketch cast → own show.
**Pay:** usually $0 at theatres. A network sketch cast member earns about $7k per episode in the first year [U] ([celebritynetworth](https://www.celebritynetworth.com/articles/entertainment-articles/how-much-money-do-saturday-night-live-cast-members-make/)). Staff writers earn about $4.9k/week [U] ([the writers' guild](https://wgacontract2023.org/the-campaign/summary-of-the-2023-wga-mba)).
**Why fun:** you write with a group whose chemistry matters, the packet is a lottery, and a viral sketch is a jackpot. It fits the existing `video`/`blip` creator works.

### 2. Stand-up comedian (Token)
**How it works:** open mics (free; you pay with a bar tab or a "bringer" of friends) → hosting → feature → headliner → tape/special → festival showcase → TV set/special.
**Pay:**
- Open mic $0; local host $25–$100; regional feature $75–$300; local headliner $150–$600 or a door %; touring headliners in the low four figures ([TickPick](https://www.tickpick.com/blog/organizer/how-to-book-comedians-for-your-show)).
- Feature spots of 20–30 minutes pay $50–$200+ ([OpenComedy](https://opencomedy.com/news/comedy-career-progression-from-open-mic/) [U]). Many LA rooms pay $0–$20 ([Chron](https://work.chron.com/salaries-comedy-headliners-27983.html)).
- At the festival showcase, the industry watches six-minute sets ([NPR](https://www.npr.org/2019/07/30/746330491/new-faces-shine-at-the-worlds-biggest-comedy-festival)).
- The club model: the ticket pays the comics, and the two-drink minimum pays the bills ([MEL](https://melmagazine.com/en-us/story/the-lubricated-economics-of-two-drink-minimums)).

**Today:** a dream plus `club` and `special` gigs. There's no set-length ladder, no "minutes of material" resource and no road.
**Why fun:** material is a resource you build, test and burn on a special. Bombing versus killing. The road trip. One festival set can change a life.

### 3. Late-night / comedy TV writer (Partial)
**How it works:** submit a packet (sketches plus monologue jokes). Late-night writers' workshops pick from about 1,000 applicants ([Comic's Comic](https://thecomicscomic.com/?p=33517)). A hire leads to a 13–20-week cycle in a room. One writer had 35 rejections before her hire ([Inside Late Night](https://latenighter.com/podcasts/inside-late-night-with-mark-malkoff-ep-58-jenny-hagel/)).
**Pay:** the the writers' guild staff-writer minimum is about $4,940/week (2024–25) [U] ([the writers' guild](https://wgacontract2023.org/the-campaign/summary-of-the-2023-wga-mba)).
**Why fun:** a daily joke quota, the head writer's red pen, topical news as the game's input, and a host who might be cancelled.

### 4. Talent agent / manager (Token as a player)
**How it works:**
- The mailroom/assistant path is about a year as an assistant, then 3 months in the mailroom at one big agency. Another starts people as 6–8-week floaters ([search: entertainmentcareers / LA Business Journal](https://labusinessjournal.com/media/talent-agencies-got-mail-entertainment/)).
- Assistant pay is $17.50–$20/hour ([Hollywood Reporter](https://www.hollywoodreporter.com/news/caa-raises-pay-rate-assistants-hourly-employees-1269942)).
- Agents take 10% of client deals ([search summary](https://ratings.koha-community.org/en/creative-artists-agency-salary.html) [U]). Managers usually take 15% (no source found [U]). Junior agent base pay of $70k–$150k [U, low-quality site].

**Why fun:** your success is your clients' success. You balance a roster, poach and get poached, and package deals. packaging.js and fog.js (scouting) already exist to plug into.

### 5. Casting director (Token)
**How it works:** casting assistant → associate → casting director. You run sessions, build lists, negotiate offers and scout showcases.
**Pay:** the first union minimums for casting directors (2024–27) are **$7,000/week for pilots, rising to $7,535**, and $4,500/week for later episodes. Associates get **$1,820/week**. Assistants were added to the union at about $21/hour ([TheWrap](https://thewrap.com/teamsters-ratify-casting-professionals-studio-contract)). Non-union associates get $400–$800/day (game catalogue).
**Why fun:** you are the gatekeeper the actor path fights through. Choices are taste bets: unknown versus star, chemistry reads, and the director overriding you.

### 6. Drag performer (Missing)
**How it works:** amateur nights → bar shows → hosting brunches and bingo → producing your own show → touring/TV competition. Bookings are mostly by DM with no contract.
**Pay:** a $40-per-show floor was proposed in the SF Bay Area. Actual offers range from $0–$60 at bars up to $500 for one number at an event. Typical group shows pay $30–$60 flat. Tips run $25–$200 a show. TV-competition alumni command thousands ([Coworker petition](https://home.coworker.org/resources/5-things-you-need-to-know-about-the-sf-campaign-for-drag-equity/); [The Stranger](https://www.thestranger.com/?p=250591); [Out](https://www.out.com/print/2020/2/29/it-time-drag-queens-unionize)). Costume and make-up costs are significant ([Refinery29](https://www.refinery29.com/nyc-drag-queen-beauty-costs)).
**Why fun:** persona-building (name, look, signature number), drag families/houses as a social system, high costume upkeep against tips, and the TV-competition casting jackpot. It reuses the `costume` and `makeup` crafts.

### 7. Live-event / comedy producer and promoter (Missing)
**How it works:** rent rooms, book acts, sell tickets, take the risk. Room deals are a flat rental, a 20–30% door split, or a free room with the venue keeping the bar ([TickPick](https://www.tickpick.com/blog/organizer/how-to-run-a-profitable-comedy-show)).
**Pay:** concert promoters earn a median of about $48k–$78k, and top promoters up to $1M. Booking agents take 10–20% ([Shmoop](https://www.shmoop.com/careers/concert-event-promoter/salary.html) [U]; [Chron](https://www.w.work.chron.com/much-concert-promoter-make-22994.html) [U]).
**Why fun:** this is a tycoon loop: the risk of an empty room, overbooking, a headliner who no-shows, and building a brand night that becomes a scene. It is also the natural home for the improv "backer" role.

### 8. Theme-park / live character entertainer (Missing)
**How it works:** audition → character or "face" performer → parade/show → street improv → lead/trainer → entertainment manager or ride-show director.
**Pay:** union floors are $21.30–$23/hour ([ABC17/CNN](https://abc17news.com/money/cnn-business-consumer/2024/04/17/mickey-minnie-donald-and-goofy-file-for-union-vote-at-disneyland/)). Character performers moved to unionise in 2024 (same source).
**Why fun:** heat, costumes, never breaking character, guests who test you, the union vote, and the jump from park to screen. It shares mechanics with improv (street improv).

### 9. Cruise-ship entertainer (Missing)
**How it works:** contracts of 4–8 months at sea ([Backstage](https://www.backstage.com/magazine/article/cruise-clues-56614/); [AV Club](https://avclub.com/you-can-no-longer-cruise-your-way-to-comedy-stardom-1798263725)). Fly-on comics do short stints. One line uses 25–35 comics a week ([Frommer's](https://www.frommers.com/tips/cruise/a-cruise-ships-walks-into-a-bar-says-to-the-bartender/)).
**Pay:** about $1,500–$2,500/week [U].
**Why fun:** a "money versus momentum" choice. You save cash and lose your city network. Ports are a travel montage. One mechanic serves singers, magicians, comics and improvisers.

### 10. Esports caster / gaming host (Missing)
**How it works:** amateur streams → small tournaments → freelance caster → league desk → publisher staff.
**Pay:** small organisers pay £150–£200 per day per caster. Top freelancers get about €1,000/day. Salaries run £20k up to €55–60k+ ([Louth College caster profile](https://www.loucoll.ac.uk/sites/default/files/esports/006948_CasterHost_AWK.pdf) [U]). An 11-day event once paid about $12,000 ([MCV](https://mcvuk.com/?p=60127) [U]).
**Why fun:** live pressure, game-knowledge stats, hype calls going viral, and publisher politics. It links the `streamer` dream with the `live` gig.

### 11. Voice actor (Partial)
**How it works:** demo reel → non-union jobs → union → animation, games, audiobooks, commercials, dubbing.
**Pay:**
- Union video-game session: **$1,134.95 for 4 hours and up to 3 voices (2025)**, with vocally stressful sessions capped at 2 hours ([VoxBooster](https://voxbooster.com/blog/video-game-voice-acting-statistics-2026) [U]; [the actors' union](https://sagaftra.org/industry-resources/rates-agreements/independent-interactive-localization)).
- Audiobooks: $100–$325 per finished hour, or a 50/50 royalty share for 7 years. Beginners get $10–$100 PFH ([SFWA](https://sfwa.org/2022/05/04/indie-files-listen-up-self-producing-audiobooks/); [Backstage](https://www.backstage.com/magazine/article/how-much-do-audiobook-narrators-make-76704/)).

**Today:** a dream and gigs, but no demo reel, booth or royalty-share choice.
**Why fun:** the royalty-share gamble, vocal-health stress, AI-voice disputes, and stacking many small gigs.

### 12. Dubbing / localisation (Partial)
**How it works:** dubbing actor, director, script adapter (lip-sync writing) and mixer. Work is per session.
**Pay:** non-union anime dubbing pays $75–$125/hour with a 2-hour minimum. A film role may pay $150–$600 in total ([Anime News Network](https://cdn02.animenewsnetwork.com/feature/2022-03-28/the-battle-for-union-anime-dubs/.183842)).
**Why fun:** a lip-sync puzzle mini-game, fan backlash at changed lines, and a bridge for players in non-English hubs (the game has multilingual hubs).

### 13. Stunt performer (Token to partial)
**How it works:** martial arts, gymnastics and driving skills → stunt double → fight coordinator → stunt coordinator → second-unit director.
**Pay:** union minimums are **$1,246/day and $4,646/week (2025–26)**, plus negotiated stunt adjustments ([wage table PDF](https://www.agentassociation.com/clientuploads/2026_Theatrical_Wage_Table.pdf)).
**Why fun:** body as a resource, injury risk, a skill-badge collection, and the jump to directing action.

### 14. Festival programmer (Token as a player)
**How it works:** volunteer screener → paid temp screener → programmer → senior programmer → artistic director. Contract work is common.
**Pay:** temp screeners earn $20.32–$24.50/hour and must watch **1,250–1,450 shorts** in one season ([EntertainmentCareers](https://www.entertainmentcareers.net/sundance-film-festival/short-film-programmer/job/527366/)). Programmers average about $63k ($44k–$102k) ([CareersInFilm](https://www.careersinfilm.com/?p=12035) [U]).
**Why fun:** you are the gatekeeper for other players' films. The game already generates festivals, juries and programmers. You'd balance taste, sponsors and premieres versus discoveries.

### 15. Magician (Token)
**How it works:** kids' parties → restaurants and strolling → corporate → theatre show / residency → TV special.
**Pay:** kids' parties pay $250–$400 an hour. Corporate shows pay $400–$900 an hour, $1,500–$3,500 for strolling, and $2,000–$5,000+ for stage shows ([GigSalad](https://www.gigsalad.com/blog/how-much-does-it-cost-to-hire-a-magician); [Thumbtack](https://www.Thumbtack.Com/p/magician-prices) [U]).
**Why fun:** you invent effects (a craft tree), the secret-keeping and exposure drama, and a Vegas residency as the endgame.

### 16. Puppeteer (Token)
**How it works:** puppet builder → performer on kids' TV, creature effects or theatre → lead puppeteer → puppet designer or company owner.
**Pay:** I found no puppeteer-specific rate. Union TV work falls under the actors' union performer scales [U]. The game catalogue already lists 4 puppetry jobs.
**Why fun:** building and performing are both crafts. There's the kids'-TV franchise and the practical-effects revival.

### 17. Location scout / manager (Token)
**How it works:** locations PA → scout → assistant/key assistant LM → location manager. The work is permits, neighbours and police.
**Pay:** non-union PAs earn $175–$400/day (catalogue). Key assistant LMs earn **$2,525/week (2024), rising to $2,700**. Commercial scouts/managers earn **$957.58/day (2026)**, rising to $1,020.83 by 2028 ([Teamsters 399 MOA](https://ht399.org/app/uploads/2024/08/Local-399-Location-Managers-MOA-7-29-24-00319860xBE9D797.pdf); [AICP/399 2026 MOA](https://www.ht399.org/app/uploads/2026/06/2026-05-31-MOA-2026-2029-AICP-and-Teamsters-Local-399-Location-package.pdf)).
**Why fun:** an exploration mini-game in the city layer. It fits `places.js` and the tax-incentive map.

### 18. Radio presenter (Token)
**How it works:** board operator → overnight shift → show producer → drive-time host → syndication / podcast crossover.
**Pay:** the median is **$21.69–$21.96/hour (May 2024)**, and employment is forecast to fall 2% by 2034 ([BLS OOH](https://www.bls.gov/OOH/media-and-communication/announcers.htm)).
**Why fun:** ratings books, a shrinking industry, the shock-jock temptation, and a pivot to podcasting (which exists).

### 19. Trailer editor (Partial)
**How it works:** assistant at a trailer house → editor → senior / creative director. Work is pitch-based against other trailer houses.
**Pay:** a studio staff role pays $57.02/hour ([EntertainmentCareers](https://cs.entertainmentcareers.net/the-walt-disney-studios/trailer-editor/job/463840/)). The median is about $130k ([PayScale](https://www.payscale.com/research/US/Job=Trailer_Editor/Salary) [U]). The range is $60k–$150k [U].
**Why fun:** you shape other players' films' box office. The game already has tracking and release systems for the trailer to feed into.

### 20. Game writer / narrative designer (Token)
**How it works:** QA / junior writer → narrative designer → lead writer. Often merged with game design.
**Pay:** in a 2024 survey of 1,000+ developers, 40% earn under $40k, and the US average is $101,392 ([80 Level via Game Industry Library](https://gameindustrylibrary.com/writers/80-level-research)). Writer-specific data is thin ([GamesMarkt](https://www.gamesmarket.global/gamesmarkt-survey-2024-how-much-money-can-i-make-in-games-607df649c2c4b7dd30c79ebbebb3eaa1/)).
**Why fun:** branching-dialogue craft, crunch, layoffs and the IP-adaptation bridge back to film.

### 21. VFX artist / animator (Moderate; lower priority)
**Pay:** Animation Guild journey animators earned $2,255.20/week through July 2024, with +7%, +4% and +3.5% raises in 2024–27 ([Animation Guild](https://animationguild.org/wp-content/uploads/2022/10/2021-24-Local-839-WAGES-v02.pdf); [Hollywood Reporter](https://www.hollywoodreporter.com/business/business-news/animation-guild-ratifies-three-year-contract-1235174906/)). In an IATSE VFX survey, 70% reported unpaid overtime and 12% had health insurance ([IATSE](https://iatse.net/iatse-launches-2024-vfx-return-to-work-survey-amid-significant-momentum/)).
**What's missing:** the vendor bid-war and unionisation-drive events.

### 22. Studio-audience warm-up comic (Missing)
**How it works:** a stand-up who keeps a sitcom or talk-show audience laughing through 3+ hour tapings.
**Pay:** up to $4,000 a night ([Awardsline](https://awardsline.com/2013/06/21/chuck-lorres-go-to-warmup-comic-mark-sweet/)), and $4,000–$6,000 a day for the best ([ArtsJournal](https://www.artsjournal.org/?p=173863) [U]). It was once $50 a night (same source).
**Why fun:** a perfect side-hustle node between stand-up, improv and the `multicam` gig. tv2.js already has a scene with a flagging warm-up comic.

### 23. Film critic (Moderate; included for completeness)
critics.js already has the freelance/staff/blog career.
**Pay:** freelance reviews pay $10–$50 at small outlets and $75–$200 on paid-review platforms for approved critics ([search summary](https://www.metaintro.com/blog/movie-critics-salary) [U]). The BLS writers' median is $76,910 (May 2025, same source [U]).
**Gap:** the shrinking-staff-jobs and newsletter events.

---

#### Sources (Part A, consolidated)
Every number in Part A has its own inline link above. The main pages are:
- coldtownetheater.com/ucb/ · secondcity.com/find-a-class/chicago · oldwp.secondcity.com/courses/con-program/ · en.wikipedia.org/wiki/The_Groundlings · en.wikipedia.org/wiki/Harold_(improvisation) · en.wikipedia.org/wiki/ComedySportz
- thecomicscomic.com/2011/12/21/... (400+ applicants) · witdc.org FAQ, FY23 report · projects.propublica.org/nonprofits/organizations/521543346
- actorsequity.org/news/PR/SecondCityStrikeAverted2025 · wbez.org/theater-stages/2025/05/05/... · lawinsider.com/clause/mainstage-minimum/_1
- blockclubchicago.org/2020/06/19/... · ny1.com/.../2020/04/21/... · artsjournal.org/2020/12/24/...
- pastemagazine.com (coaches; theatres that pay; Twin Cities) · tickpick.com organiser guide · dallasobserver.com Stomping Ground
- floridastudiotheatre.org/corporate-training · soulpepper.ca/corporate-training · dc.fortune.com/2016/06/03/second-city-diversity/
- secondcity.com Bob Curry fellowship pages · timeout.com DCM move · scotsman.com Fringe costs · playbill.com Fringe budgets
- avclub.com cruise · frommers.com cruise comics · wdwnt.com / wdwinfo.com park improv · abc17news.com park pay
- backstage.com improv for commercials · villagevoice.com · latenighter.com · flowjournal.org · en.wikipedia.org/wiki/Make_Some_Noise_(TV_series)
