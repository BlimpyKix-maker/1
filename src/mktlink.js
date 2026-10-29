// ================= The market reads the world (Round 27) =================
// Share prices used to move on only two things: a film opening and quarterly earnings. Now the market reads the
// whole world. The week after something happens, the stock reacts to it: a sequel greenlit, rights bought, a
// first-look deal signed, an award won, trouble on a set, a star in a scandal while their film is in production,
// a strike or tax credit in the studio's city, a hit or flop at a rival in the same genre. And the market moves the
// world back: once a year a studio whose shares have soared sells new shares and has more cash to make films with,
// and a studio whose shares have collapsed cuts costs, so the next films it greenlights get smaller budgets.
// Every reaction is a pure function of the news, so replays agree. The market reacts the week after, so a bar
// never changes once its week is over.
const MKL = { S: null, n: -1, byW: new Map() };
function mklIndex() {
  if (MKL.S !== S || MKL.n !== S.news.length) {
    MKL.S = S; MKL.n = S.news.length; MKL.byW = new Map();
    for (const x of S.news) { if (!x) continue; let L = MKL.byW.get(x.w); if (!L) MKL.byW.set(x.w, L = []); L.push(x); }
  }
  return MKL.byW;
}
// how the market reads a headline about one of the company's own films or deals
const MKL_RULES = [
  [/sequel everyone expected/, 'Sequel greenlit', .018], [/Not everyone is sure the audience wants another/, 'Another sequel: doubts', -.012],
  [/buys the film rights/, 'Buys hot rights', .012], [/first-look deal/, 'First-look deal', .01],
  [/forces a new ending/, 'Studio meddling', -.018], [/stop speaking on the set|walks off|fired from|shut down|halts/, 'Trouble on set', -.016],
  [/improvised scene becomes the heart|buzz|test screening/, 'Good word from the set', .008],
  [/wins the|wins Best|takes the top prize|Grand Prix|Golden/, 'Award win', .028], [/nominat/, 'Nominations', .01],
  [/cult/i, 'Cult following', .006], [/record/i, 'Box-office record', .02], [/lawsuit|sues|sued/i, 'Lawsuit', -.02],
  [/closes|bankrupt|debt/i, 'Money trouble', -.04], [/lays off|cuts/i, 'Cost cuts', -.01]
];
const MKL_PEOPLE = [[/scandal|accused|linked to|arrested|blackmail/i, 'Star in a scandal', -.035], [/dies|died/i, 'Loss of a star', -.02], [/rarest achievement|trades have a word/i, 'Star power', .015]];
function mklFilmCo(id) { const f = S.films[id]; return f ? (f.co !== null && f.co !== undefined ? f.co : f.owner) : null; }
// was this person directing or top-billed on one of the company's films still to come out at week w?
function mklOnSlate(c, p, w) { for (const i of c.films.slice(-30)) { const f = S.films[i]; if (f && (f.rel === null || f.rel > w) && (f.dir === p || (f.cast || []).slice(0, 2).includes(p))) return true; } return false; }
function mklEvents(c, w) {
  const out = [], idx = mklIndex(), L = idx.get(w - 1); if (!L) return out;
  const seen = new Set(), add = (label, d) => { if (seen.has(label)) return; seen.add(label); out.push([label, d]); };
  for (const x of L) {
    const r = x.ref || {}, mine = r.company === c.id || (r.film !== undefined && mklFilmCo(r.film) === c.id);
    if (mine && x.type !== 'Release' && x.type !== 'Hit' && x.type !== 'Flop') { for (const [re, label, d] of MKL_RULES) if (re.test(x.text)) { add(label, d * [0, 1, 1.4, 1.9][c.tier]); break; } continue; }
    if (r.person !== undefined && x.type === 'People') { if (mklOnSlate(c, r.person, w)) for (const [re, label, d] of MKL_PEOPLE) if (re.test(x.text)) { add(label, d * [0, .8, 1.2, 1.8][c.tier]); break; } }
    // a rival's big opening in a genre this studio is betting on lifts the genre; a bomb sinks it
    if ((x.type === 'Hit' || x.type === 'Flop') && r.film !== undefined && mklFilmCo(r.film) !== c.id) { const f = S.films[r.film];
      if (f && (f.hub === c.hub || f.budget > 80 && c.tier === 1) && f.co !== null && f.co !== undefined && S.companies[f.co] && S.companies[f.co].tier <= c.tier && c.films.slice(-12).some(i => { const g = S.films[i]; return g && (g.rel === null || g.rel > w) && g.genre === f.genre; })) add(x.type === 'Hit' ? f.genre + ' is hot' : f.genre + ' cools', x.type === 'Hit' ? .006 : -.006); }
  }
  // the studio's city: strikes and tax credits
  for (const e of (S.econ && S.econ.ev) || []) { if (e.hub !== c.hub) continue;
    if (e.from === w) add(e.k === 'walkout' ? 'Strike in ' + hubName(c.hub) : 'Tax credits in ' + hubName(c.hub), e.k === 'walkout' ? -.045 : .015);
    else if (e.k === 'walkout' && e.to === w) add('Strike ends', .025); }
  // the market's own reactions to the studio's last move
  if (c.raise && c.raise.w === w - 1) add('Sells new shares', -.02);
  return out;
}
{ const _ev = eventsAt; eventsAt = function (c, w) { const out = _ev.apply(this, arguments); if (w <= S.week && w > S.week - 600) { try { for (const e of mklEvents(c, w)) out.push([e[0], clamp(e[1], -.08, .08)]); } catch (e) { /* the market stays quiet */ } } return out; }; }

// the market moves the world back: raises and cuts, once a year at most
function mklMonth() {
  if (S.year < S.startYear || typeof listedCos !== 'function') return;
  for (const c of listedCos()) {
    if ((c.hist || []).length < 13) continue;
    const now = mktPrice(c), then = mktPrice(c, S.week - 52), g = now / Math.max(.01, then) - 1, cap = now * sharesOf(c);
    if (g > .6 && !(c.raise && S.week - c.raise.w < 52)) { const amt = +(cap * .05).toFixed(2); c.cash += amt; c.raise = { w: S.week, amt };
      news('Business', `${c.name} sells new shares after a ${Math.round(g * 100)}% run and raises ${fmtM(amt)} to make more films.`, { company: c.id }); }
    else if (g < -.45 && !(c.cut && S.week - c.cut.w < 52)) { c.cut = { w: S.week, until: S.week + 52 };
      news('Business', `${c.name}${/s$/.test(c.name) ? "'" : "'s"} shares are down ${Math.round(-g * 100)}% in a year. The board orders cost cuts: smaller budgets for the next year's films.`, { company: c.id }); }
  }
}
{ const _mo = monthly; monthly = function () { const r = _mo.apply(this, arguments); try { mklMonth(); } catch (e) { /* no market yet */ } return r; }; }
// a studio under cost cuts trims every film it greenlights by a fifth, and keeps the difference
{ const _gl = greenlight; greenlight = function (hub, o) { const g = _gl.apply(this, arguments);
  if (g && g.co !== null && g.co !== undefined) { const c = S.companies[g.co]; if (c && c.cut && c.cut.until > S.week && g.budget > 0) { const d = g.budget * .2; g.budget -= d; c.cash += d; g.trimmed = 1; } }
  return g; }; }

// the stock page: what moved it, all of it
function mklMovedHTML(c) {
  const rows = [];
  for (let w = S.week; w > S.week - 26 && rows.length < 10; w--) { let b; try { b = mktBar(c, w); } catch (e) { break; } for (const e of b.ev || []) if (Math.abs(e[1]) >= .004) rows.push([w, e[0], e[1]]); }
  const notes = [];
  if (c.cut && c.cut.until > S.week) notes.push(`Under cost cuts until ${fmtDate(c.cut.until, true)}: new films get a fifth less money.`);
  if (c.raise && S.week - c.raise.w < 52) notes.push(`Raised ${fmtM(c.raise.amt)} by selling shares on ${fmtDate(c.raise.w, true)}.`);
  const st = (S.econ && S.econ.state) || 'normal', ev = typeof econEv === 'function' ? econEv(c.hub) : [];
  notes.push(`Economy: ${st}${ev.length ? ' · ' + ev.map(e => e.k === 'walkout' ? 'strike in ' + hubName(c.hub) : 'tax credits in ' + hubName(c.hub)).join(', ') : ''}.`);
  return `<section class="mkl"><h4>What moved it</h4><p class="small muted">The market reads the news: each headline about the studio, its films, its stars, its city and its genres moves the price the week after.</p>
   <table class="mkl-t">${rows.map(([w, l, d]) => `<tr><td class="muted">${fmtDate(w, true)}</td><td>${esc(l)}</td><td class="${d > 0 ? 'good' : 'bad'}">${d > 0 ? '+' : ''}${(d * 100).toFixed(1)}%</td></tr>`).join('') || '<tr><td class="muted">Nothing but the market\'s own drift in the last six months.</td></tr>'}</table>
   <ul class="plain small">${notes.map(n => `<li>${esc(n)}</li>`).join('')}</ul></section>`;
}
{ const _sp = stockPage; stockPage = function (c) { const h = _sp.apply(this, arguments); try { const x = mklMovedHTML(c); const i = h.indexOf('<div class="cols two">'); return i >= 0 ? h.slice(0, i) + x + h.slice(i) : h + x; } catch (e) { return h; } }; }
(function () { if (typeof document === 'undefined' || typeof document.createElement !== 'function' || !document.head) return; const st = document.createElement('style'); st.textContent = `
.mkl{margin:12px 0;padding:12px 14px;border:1px solid var(--line,#ddd);border-radius:10px}.mkl h4{margin:0 0 4px}
.mkl-t{width:100%;border-collapse:collapse;font-size:13px;margin:6px 0}.mkl-t td{padding:4px 6px;border-top:1px solid var(--line,#eee)}.mkl-t td:last-child{text-align:right;font-family:var(--f-data,ui-monospace,monospace)}`; document.head.appendChild(st); })();
