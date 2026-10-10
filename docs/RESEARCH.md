# Research notes

Collected in round 9 to find systems that add strategic depth. What has shipped from it so far:

- **#19 Prediction market:** Film Futures in the Terminal (src/futures.js).
- **#15 Bankability index:** bankability() feeds the futures forecast; it has its own Terminal panel.
- **#5 Recoupment waterfall:** 'Where the money went' on every released film.
- **#8 Tracking:** the futures 'Trk' column, plus 'Why it did that' on film pages, which compares tracking with the result.
- **Design lesson (#25):** every outcome shows its inputs.

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
