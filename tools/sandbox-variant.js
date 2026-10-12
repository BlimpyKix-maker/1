// Builds a patched copy of index.html for a sandbox experiment. Nothing in the repo is touched: the copy goes to outDir (default: the system temp folder).
// Each patch is a [find, replace] pair that must match the built page exactly once, so a patch that no longer applies fails loudly.
// usage: node tools/sandbox-variant.js all2 /tmp/x && APPLEBOX_HTML=/tmp/x/index_all2.html node tools/probe-world-exp.js 2027 15 out.json
const fs = require('fs');
const path = require('path');
const src = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const P = {
  retire: [[" * (p.catId ? .4 : 1)", ""]],
  ageLead: [["gcraft(p, 'act', genre) * 2 + tie(D, p) * .3", "gcraft(p, 'act', genre) * 2 + tie(D, p) * .3 - Math.max(0, (S.year - p.born) - 45) * 1.5 * (i === 0 ? 1 : .5)"]],
  drift: [["p.standing += (30 - p.standing) * .005;", "if (S.week - p.lastWork > 104) p.standing += (15 - p.standing) * .01;"]],
  novelty: [["gcraft(p, 'act', genre) * 2 + tie(D, p) * .3", "gcraft(p, 'act', genre) * 2 + tie(D, p) * .3 + p.heat * .5 + ((S.year - p.born) < 33 && p.credits.length < 8 ? (p.c.act - 8) * 3.5 : 0)"],
            ["p.standing * .5 + gcraft(p, 'dir', genre) * 2.5 + p.mind.vis", "p.standing * .5 + gcraft(p, 'dir', genre) * 2.5 + p.mind.vis + p.heat * .4 + ((S.year - p.born) < 38 && p.credits.length < 4 ? (p.c.dir - 8) * 3.5 : 0)"]],
  fameGain: [["p.fame = clamp(p.fame + (6 * Math.log2(1 + homeRatio) - 2.5) * rw.fm, 0, 100);", "p.fame = clamp(p.fame + (6 * Math.log2(1 + homeRatio) - 2.5) * rw.fm * (1 + Math.max(0, 45 - p.fame) / 30), 0, 100);"]],
  fameWeight: [["p.fame * (tier === 1 ? .7 : .3)", "p.fame * (tier === 1 ? .45 : .2)"], ["if (tier === 1) return p.fame * .3 + p.standing * .2;", "if (tier === 1) return p.fame * .15 + p.standing * .15;"]],
  fameDecay: [["p.fame *= .993; p.intl *= .995; p.heat *= .9;", "p.fame *= (S.week - p.lastWork > 78 ? .978 : .989); p.intl *= .995; p.heat *= .9;"]],
  fameGain2: [["p.fame = clamp(p.fame + (6 * Math.log2(1 + homeRatio) - 2.5) * rw.fm, 0, 100);", "p.fame = clamp(p.fame + (x => x > 0 ? x * (p.fame < 45 ? 1 + (45 - p.fame) / 22 : Math.max(.25, (100 - p.fame) / 55)) : x)((6 * Math.log2(1 + homeRatio) - 2.5) * rw.fm), 0, 100);"]],
  debut: [["p.standing * .5 + gcraft(p, 'dir', genre) * 2.5 + p.mind.vis", "p.standing * .5 + gcraft(p, 'dir', genre) * 2.5 + p.mind.vis + p.heat * .4 + (tier === 3 && p.credits.length === 0 ? 28 : 0) + (tier === 2 && p.credits.length === 1 ? 10 : 0)"]],
  noveltyActor: [["gcraft(p, 'act', genre) * 2 + tie(D, p) * .3", "gcraft(p, 'act', genre) * 2 + tie(D, p) * .3 + p.heat * .5 + ((S.year - p.born) < 33 && p.credits.length < 8 ? (p.c.act - 8) * 3.5 : 0) - Math.max(0, (S.year - p.born) - 45) * 1.5 * (i === 0 ? 1 : .5)"]],
  rentals: [["f.rentals += f.gross[m] * (m === f.m ? .5 : .4);", "f.rentals += f.gross[m] * (m === f.m ? .58 : .46);"]],
  overhead: [["era(MARKETS[HUBS[c.hub].m].cost, y) / 1.6;", "era(MARKETS[HUBS[c.hub].m].cost, y) / 3.2;"]],
  cashWeight: [["[0, 4, 2, 1.2][c.tier] * (c.cash > 0 ? 1 : .15)", "[0, 4, 2, 1.2][c.tier] * (c.cash > 0 ? Math.min(1.5, .25 + c.cash / ([0, 40, 12, 3][c.tier] * budgetScale(y) * era(MARKETS[H.m].cost, y))) : .05)"]]
};
const V = {
  talent1: ['retire', 'ageLead', 'drift'],
  talent2: ['retire', 'drift', 'fameGain', 'novelty+age'],
  talent3: ['retire', 'drift', 'fameGain', 'novelty+age', 'fameWeight'],
  co1: ['overhead', 'cashWeight'],
  talent4: ['retire', 'drift', 'fameDecay', 'fameGain2', 'noveltyActor', 'debut', 'fameWeight'],
  co2: ['overhead', 'cashWeight', 'rentals'],
  all2: ['retire', 'drift', 'fameDecay', 'fameGain2', 'noveltyActor', 'debut', 'fameWeight', 'overhead', 'cashWeight', 'rentals'],
  all: ['retire', 'drift', 'fameGain', 'novelty+age', 'fameWeight', 'overhead', 'cashWeight']
};
// novelty and ageLead both edit the same actor line: a combined patch
P['novelty+age'] = [[P.novelty[0][0], P.novelty[0][1] + " - Math.max(0, (S.year - p.born) - 45) * 1.5 * (i === 0 ? 1 : .5)"], P.novelty[1]];
const name = process.argv[2], outDir = process.argv[3] || require('os').tmpdir();
if (!V[name]) { console.error('usage: node tools/sandbox-variant.js <' + Object.keys(V).join('|') + '> [outDir]'); process.exit(1); }
let out = src;
for (const k of V[name]) for (const [a, b] of P[k]) { const n = out.split(a).length - 1; if (n !== 1) { console.error('patch', k, 'matched', n, 'times:', a.slice(0, 60)); process.exit(1); } out = out.replace(a, () => b); }
const file = path.join(outDir, 'index_' + name + '.html');
fs.writeFileSync(file, out);
console.log('built', name, V[name].join(','), '->', file);
