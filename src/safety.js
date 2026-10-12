// ---------------- Real people, handled with care ----------------
// Many of the world's people are reimagined from real film history under invented names. For anyone who is still
// alive in reality (no death year in the catalogue) the simulation keeps to flattering or neutral things:
//  · no negative temperament (party animal, volatile, difficult and the like);
//  · no fired-from-the-film, scandal, lawsuit or comeback stories, and no "headlines for the wrong reasons";
//  · no simulated death (they may still step back from the business, quietly);
//  · no lookalike portrait (REAL_LOOKS keeps only people who have died).
// The dead are historical figures and keep their catalogue traits. Everything here is checked by tools/safetytest.js.
const NEG_TRAITS = ['Party animal', 'Volatile', 'Reckless', 'Difficult', 'Ruthless', 'Lazy', 'Showboat', 'Stubborn', 'Gossip', 'Anxious', 'Cynical', 'Dependent', 'Drinks'];
const NEG_EVENTS = ['fired', 'scandal', 'lawsuit', 'comeback', 'sober'];
function realLiving(p) { if (!p || !p.catId || p.player) return false; const cp = S.cat && S.cat.src && S.cat.src.people[p.catId]; return !!cp && !cp.d; }
function realSafe(p) { if (realLiving(p)) p.traits = p.traits.filter(t => !NEG_TRAITS.includes(t)); return p; }
{ const _cp = catPerson; catPerson = function (pid, Y) { return realSafe(_cp(pid, Y)); }; }
for (const e of NPC_EVENTS) if (NEG_EVENTS.includes(e.k)) { const ok = e.ok; e.ok = p => !realLiving(p) && ok(p); }
