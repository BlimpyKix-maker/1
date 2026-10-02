// ---------------- The awards race ----------------
// From October to December, a film released this year that you worked on (or your company made) can be campaigned:
// screeners for the voters, trade ads, the Q&A circuit, a party, or a quiet word against the frontrunner. Each move
// adds to the film's campaign, which the national awards weigh in January alongside the film itself. Rolls and
// money are the player's; the voting keeps its own dice, so the world's course is unchanged.
const CAMPAIGN = {
  screeners: { label: 'Send screeners to voters', icon: '📀', cost: 600, pts: 2, d: 'Copies of the film in every voter\'s letterbox. The basics.' },
  fyc: { label: 'Run trade ads', icon: '📰', cost: 3500, pts: 3, d: '"For your consideration" across the trades. Expensive; it works.' },
  qa: { label: 'Work the Q&A circuit', icon: '🎤', cost: 0, energy: -15, stat: 'cha', dc: 13, pts: 3.5, d: 'A screening and a Q&A every night for a week. Charm the voters in person.' },
  party: { label: 'Host a voters\' party', icon: '🥂', cost: 1500, stat: 'cha', dc: 11, pts: 1.5, meet: 2, d: 'Canapés, a room full of voters, and you working it.' },
  whisper: { label: 'Whisper about the frontrunner', icon: '🤫', cost: 0, stat: 'cha', dc: 13, pts: 0, d: 'A word here and there about the film everyone thinks will win. Effective, dirty, and people talk.' }
};
function campaignSeason() { const m = dateOf(S.week).getUTCMonth(); return m >= 9; }
function campaignFilms() {
  const M = S.me, me = ME();
  return S.films.filter(f => f.rel !== null && f.ry === S.year && f.rel <= S.week && (me.credits.includes(f.id) || (f.xc && f.xc[me.id]) || (M.company !== undefined && f.co === M.company)));
}
function raceOf(f) {
  // this year's field in the film's market, by what voters see: quality plus campaign
  return S.films.filter(x => x.rel !== null && x.ry === S.year && x.m === f.m && !x.real && x.q !== null).sort((a, b) => (b.q + (b.camp || 0)) - (a.q + (a.camp || 0)));
}
function campaignAct(a) {
  const M = S.me, me = ME(), f = S.films[a.film], C = CAMPAIGN[a.k];
  if (!f || !C || !campaignSeason() || !campaignFilms().includes(f) || (f.campLog || []).includes(a.k) || M.cash < usd(C.cost)) return false;
  M.cash -= usd(C.cost); (f.campLog = f.campLog || []).push(a.k);
  if (C.energy) M.energy = clamp(M.energy + C.energy, 0, 100);
  let ok = true;
  if (C.stat) ok = roll(C.stat, C.dc);
  const add = v => { f.camp = clamp((f.camp || 0) + v, -6, 10); };
  if (a.k === 'whisper') {
    const front = raceOf(f).find(x => x !== f);
    if (!front) return true;
    if (ok) { front.camp = clamp((front.camp || 0) - 3, -6, 10); inbox('note', 'The whispers work', `Somehow everyone has heard that ${front.title} "has problems". Its campaign stumbles.`, { film: front.id }); }
    else { addTie(me, P(front.dir), -20); (M.flags = M.flags || {}).mudslinger = S.week; inbox('note', 'Caught', `It gets back to ${P(front.dir).name} that you were talking down ${front.title}. They won't forget it, and neither will their friends.`, { person: front.dir }); add(-2); }
    return true;
  }
  add(ok ? C.pts : C.pts * .3);
  if (C.meet) for (let i = 0; i < C.meet; i++) { const q = bestIn(M.hub, ['producer', 'director', 'actor'], q => q.standing - Math.abs(q.standing - me.standing - 20) + hashRand(f.id * 7 + i + S.week)() * 20); if (q) meet(q.id, 'Met on the awards circuit', 5); }
  diary(`${C.label} for ${f.title}${C.stat ? (ok ? ': it lands.' : ': it falls flat.') : '.'}`);
  return true;
}
function campaignHTML() {
  if (!S.me || !campaignSeason()) return '';
  const L = campaignFilms();
  if (!L.length) return `<section class="panel"><h3>Awards season</h3><p class="muted">Campaigns run from October to December for films released this year. You have nothing eligible this year.</p></section>`;
  return `<section class="panel campaign"><h3>Awards season</h3><p class="muted small">The national awards are voted in January. Quality matters most, but voters have to see a film to vote for it.</p>${L.map(f => {
    const race = raceOf(f).slice(0, 5), pos = raceOf(f).indexOf(f) + 1;
    return `<div class="camp"><p><b>${fl(f.id)}</b> · ${esc(f.genre)} · critics ${f.reviews}/100 · campaign <b>${(f.camp || 0) >= 0 ? '+' : ''}${(f.camp || 0).toFixed(1)}</b> · <span class="${pos === 1 ? 'good' : pos <= 3 ? '' : 'muted'}">${pos === 1 ? 'Frontrunner' : `${pos}${['th', 'st', 'nd', 'rd'][pos % 10 > 3 || Math.floor(pos / 10) === 1 ? 0 : pos % 10]} in the race`}</span></p>
     <div class="crow">${Object.entries(CAMPAIGN).map(([k, C]) => { const done = (f.campLog || []).includes(k); return `<button class="btn-s${done ? ' ghost' : ''}" data-campaign="${f.id}:${k}" title="${esc(C.d)}" ${done || S.me.cash < usd(C.cost) ? 'disabled' : ''}>${C.icon} ${esc(C.label)}${C.cost ? ' · ' + fmtCash(usd(C.cost)) : ''}${done ? ' ✓' : ''}</button>`; }).join('')}</div>
     <p class="small muted">The field in ${esc(MARKETS[f.m].name)}: ${race.map(x => `${x === f ? '<b>' : ''}${esc(x.title)}${x === f ? '</b>' : ''}`).join(' · ')}</p></div>`;
  }).join('')}</section>`;
}
