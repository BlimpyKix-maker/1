// ---------------- The Lucky Corner: small money, real odds ----------------
// Lotto twice a week, scratchcards from the corner shop, a card room and a casino floor, and the races on a
// Saturday. Every game pays what its real counterpart pays and loses what it really loses: the lottery is 6 from
// 49 (one in fourteen million for the jackpot, one in fifty-seven to get three), scratchcards give back a bit over
// half, roulette is a single-zero wheel, blackjack pays three to two and the dealer stands on seventeen, craps is
// the pass line, and the bookmaker builds in his margin. Early on, a lucky week can pay the rent. Later it's
// small change, and the app says so. Your stats come in where they would in life: a head for figures shows you
// the right blackjack play, and composure decides whether you walk away when you should.
// Every draw is the player's dice (prnd) and every play is an action, so replays match.

const LOTTO_PRIZE = { 3: 30, 4: 140, 5: 1750, 55: 1e5 };   // in today's money; the jackpot rolls
function luckOf(M = S.me) { return M.luck || (M.luck = { spent: 0, won: 0, tickets: [], draws: [], jackpot: usd(2.5e6), hist: [], bj: null, nag: 0 }); }
function luckStake(x) { return Math.max(1, Math.round(x * wageF(S.me.hub))); }   // small money isn't rounded to fives
function luckLog(L, g, bet, win, t) { L.spent += bet; L.won += win; L.hist.push({ w: S.week, g, bet, win, t }); if (L.hist.length > 60) L.hist.shift(); S.me.cash += win - bet; if (win > bet * 20 && win >= luckStake(500)) milestone(`Won ${fmtCash(win)} on ${g}`, 'money'); const M = S.me; M.stress = clamp(M.stress + (win > bet ? -2 : win === 0 ? .6 : 0), 0, 100); }
function luckSmall() { return typeof osNetWorth === 'function' && osNetWorth().total > usd(400000); }

// ---- Lotto: pick six from forty-nine; draws on Wednesday and Saturday ----
function lottoNums() { const s = new Set(); while (s.size < 6) s.add(1 + Math.floor(prnd() * 49)); return [...s].sort((a, b) => a - b); }
function lottoBuy(a) {
  const M = S.me, L = luckOf(), n = clamp(+a.n || 1, 1, 10), price = luckStake(2) * n; if (M.cash < price) return false;
  for (let i = 0; i < n; i++) { const nums = a.nums && i === 0 && a.nums.length === 6 ? a.nums.map(Number).filter(x => x >= 1 && x <= 49) : lottoNums(); if (new Set(nums).size !== 6) return false; L.tickets.push({ nums: nums.sort((x, y) => x - y), w: S.week }); }
  M.cash -= price; L.spent += price; L.hist.push({ w: S.week, g: 'Lotto', bet: price, win: 0, t: `${n} line${n > 1 ? 's' : ''} for the next draw` });
  return true;
}
function lottoDraw() {
  const L = luckOf(), drawn = lottoNums(); let bonus; do { bonus = 1 + Math.floor(prnd() * 49); } while (drawn.includes(bonus));
  let total = 0, best = 0, jack = false; const lines = [];
  for (const t of L.tickets) { const m = t.nums.filter(x => drawn.includes(x)).length, b = t.nums.includes(bonus);
    const tier = m === 6 ? 6 : m === 5 && b ? 55 : m; let win = 0;
    if (tier === 6) { win = L.jackpot; jack = true; } else if (LOTTO_PRIZE[tier]) win = Math.round(usd(LOTTO_PRIZE[tier]) * (tier === 3 ? 1 : .8 + prnd() * .4));
    total += win; best = Math.max(best, tier === 55 ? 5.5 : tier); lines.push({ nums: t.nums, m, b, win }); }
  // somebody somewhere wins it about one draw in six; otherwise it rolls over
  const world = !jack && prnd() < .16;
  const rec = { w: S.week, drawn, bonus, lines, total, jack: jack ? L.jackpot : 0, worldWin: world ? L.jackpot : 0 };
  L.draws.push(rec); if (L.draws.length > 20) L.draws.shift();
  if (L.tickets.length) {
    S.me.cash += total; L.won += total; L.hist.push({ w: S.week, g: 'Lotto', bet: 0, win: total, t: `Draw ${drawn.join(' ')} + ${bonus}: ${total ? fmtCash(total) : 'nothing'}` });
    if (jack) { milestone(`Won the lottery jackpot: ${fmtCash(L.jackpot)}`, 'money'); inbox('news', 'You won the lottery', `Six numbers. ${fmtCash(L.jackpot)}. You check the ticket eleven times. Then you call your mother.`); ME().fame = clamp((ME().fame || 0) + 4, 0, 100); }
    else if (best >= 4) inbox('note', `Lotto: ${best === 5.5 ? 'five and the bonus ball' : best + ' numbers'}`, `The draw: ${drawn.join(', ')} and ${bonus}. You win ${fmtCash(total)}.`);
  }
  L.tickets = [];
  L.jackpot = jack || world ? usd(2.5e6 + prnd() * 1.5e6) : Math.round(L.jackpot + usd(1.2e6 + prnd() * 1.4e6));
}

// ---- scratchcards: a bit more than half comes back, about one card in three and a half wins something ----
const SCRATCH = { 1: { name: 'Lucky Reels', col: '#E0457B' }, 2: { name: 'Golden Ticket', col: '#D4AF37' }, 5: { name: 'Box Office Smash', col: '#2F7DD1' }, 10: { name: 'Red Carpet Millions', col: '#C8102E' } };
const SCRATCH_TABLE = [[1, 1 / 6], [2, 1 / 12], [4, 1 / 40], [10, 1 / 150], [50, 1 / 2500], [500, 1 / 120000], [10000, 1 / 3000000]];
function scratchPlay(a) {
  const M = S.me, L = luckOf(), face = +a.p; if (!SCRATCH[face]) return false;
  const price = luckStake(face); if (M.cash < price) return false;
  const boost = { 1: 1, 2: 1.06, 5: 1.12, 10: 1.2 }[face];   // dearer cards give back a little more
  let x = prnd(), mult = 0; for (const [m, p] of SCRATCH_TABLE.slice().reverse()) { if (x < p) { mult = m; break; } x -= p; }
  const win = Math.round(price * mult * (mult ? boost : 0));
  // the card: three of a kind somewhere if it won, near misses if it didn't
  const SY = ['🍒', '⭐', '🎬', '💎', '🍿', '🎟️', '🏆', '7️⃣'], hit = SY[Math.floor(prnd() * SY.length)];
  const pool = SY.filter(x => !mult || x !== hit).flatMap(x => [x, x]).sort(() => prnd() - .5);   // nothing else appears three times
  const grid = mult ? [hit, hit, hit, ...pool.slice(0, 6)].sort(() => prnd() - .5) : pool.slice(0, 9);
  L.last = { g: 'scratch', face, grid, win, mult };
  luckLog(L, SCRATCH[face].name, price, win, win ? `Won ${fmtCash(win)}` : 'Nothing');
  return true;
}

// ---- roulette: one zero, thirty-six numbers ----
const RED = new Set([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]);
const ROUL_BETS = { red: ['Red', 1], black: ['Black', 1], odd: ['Odd', 1], even: ['Even', 1], low: ['1–18', 1], high: ['19–36', 1], d1: ['1st 12', 2], d2: ['2nd 12', 2], d3: ['3rd 12', 2], num: ['A single number', 35] };
function roulWins(b, n, pick) { if (n === 0) return b === 'num' && pick === 0; return b === 'red' ? RED.has(n) : b === 'black' ? !RED.has(n) : b === 'odd' ? n % 2 === 1 : b === 'even' ? n % 2 === 0 : b === 'low' ? n <= 18 : b === 'high' ? n >= 19 : b === 'd1' ? n <= 12 : b === 'd2' ? n > 12 && n <= 24 : b === 'd3' ? n > 24 : b === 'num' ? n === pick : false; }
function roulPlay(a) {
  const M = S.me, L = luckOf(), B = ROUL_BETS[a.b], bet = clamp(Math.round(+a.amt || 0), 1, luckStake(500)); if (!B || M.cash < bet) return false;
  const pick = clamp(Math.round(+a.pick || 0), 0, 36), n = Math.floor(prnd() * 37), ok = roulWins(a.b, n, pick), win = ok ? bet * (B[1] + 1) : 0;
  L.last = { g: 'roul', n, b: a.b, pick, win, bet };
  luckLog(L, 'Roulette', bet, win, `${n} ${n === 0 ? 'green' : RED.has(n) ? 'red' : 'black'}: ${ok ? 'won ' + fmtCash(win - bet) : 'lost'}`);
  return true;
}

// ---- blackjack: dealer stands on all seventeens, blackjack pays 3:2, double on any two ----
const CARD_R = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
function bjCard() { return { r: Math.floor(prnd() * 13), s: Math.floor(prnd() * 4) }; }
function bjVal(h) { let t = 0, a = 0; for (const c of h) { const v = c.r === 0 ? 11 : Math.min(10, c.r + 1); t += v; if (c.r === 0) a++; } while (t > 21 && a) { t -= 10; a--; } return { t, soft: a > 0 }; }
function bjBasic(h, up) {   // the textbook play
  const { t, soft } = bjVal(h), d = up.r === 0 ? 11 : Math.min(10, up.r + 1), two = h.length === 2;
  if (soft) { if (t >= 19) return 'stand'; if (t === 18) return d >= 9 ? 'hit' : two && d >= 3 && d <= 6 ? 'double' : 'stand'; return two && d >= (t >= 17 ? 3 : t >= 15 ? 4 : 5) && d <= 6 ? 'double' : 'hit'; }
  if (t >= 17) return 'stand'; if (t >= 13) return d <= 6 ? 'stand' : 'hit'; if (t === 12) return d >= 4 && d <= 6 ? 'stand' : 'hit';
  if (t === 11) return two ? 'double' : 'hit'; if (t === 10) return two && d <= 9 ? 'double' : 'hit'; if (t === 9) return two && d >= 3 && d <= 6 ? 'double' : 'hit'; return 'hit';
}
function bjAct(a) {
  const M = S.me, L = luckOf();
  if (a.k === 'deal') { if (L.bj && !L.bj.done) return false; const bet = clamp(Math.round(+a.amt || 0), 1, luckStake(500)); if (M.cash < bet) return false;
    M.cash -= bet; L.bj = { bet, p: [bjCard(), bjCard()], d: [bjCard(), bjCard()], done: false };
    if (bjVal(L.bj.p).t === 21) return bjSettle(L, bjVal(L.bj.d).t === 21 ? 'push' : 'bj');
    if (bjVal(L.bj.d).t === 21) return bjSettle(L, 'lose');
    return true; }
  const H = L.bj; if (!H || H.done) return false;
  if (a.k === 'hit') { H.p.push(bjCard()); if (bjVal(H.p).t > 21) return bjSettle(L, 'bust'); if (bjVal(H.p).t === 21) return bjDealer(L); return true; }
  if (a.k === 'double') { if (H.p.length !== 2 || M.cash < H.bet) return false; M.cash -= H.bet; H.bet *= 2; H.dbl = 1; H.p.push(bjCard()); if (bjVal(H.p).t > 21) return bjSettle(L, 'bust'); return bjDealer(L); }
  if (a.k === 'stand') return bjDealer(L);
  return false;
}
function bjDealer(L) { const H = L.bj; while (bjVal(H.d).t < 17) H.d.push(bjCard()); const p = bjVal(H.p).t, d = bjVal(H.d).t; return bjSettle(L, d > 21 || p > d ? 'win' : p === d ? 'push' : 'lose'); }
function bjSettle(L, res) {
  const H = L.bj; H.done = true; H.res = res; const back = res === 'bj' ? Math.round(H.bet * 2.5) : res === 'win' ? H.bet * 2 : res === 'push' ? H.bet : 0;
  S.me.cash += H.bet; luckLog(L, 'Blackjack', H.bet, back, { bj: 'Blackjack!', win: 'You win', push: 'Push', lose: 'Dealer wins', bust: 'Bust' }[res]);
  return true;
}

// ---- slots: three reels; about nine in ten come back over a long night ----
const SLOT_SYM = [['🍒', 30, 2], ['🍋', 26, 4], ['🔔', 18, 14], ['⭐', 12, 28], ['🎬', 8, 60], ['💎', 4, 120], ['7️⃣', 2, 600]];   // symbol, weight on a reel, three-of-a-kind pays
function slotSpin() { const T = SLOT_SYM.reduce((t, s) => t + s[1], 0); let x = prnd() * T; for (const s of SLOT_SYM) { if (x < s[1]) return s[0]; x -= s[1]; } return SLOT_SYM[0][0]; }
function slotPay(r) { if (r[0] === r[1] && r[1] === r[2]) return SLOT_SYM.find(s => s[0] === r[0])[2]; const ch = r.filter(x => x === '🍒').length; return ch === 2 ? 2 : ch === 1 ? .5 : 0; }
function slotPlay(a) {
  const M = S.me, L = luckOf(), bet = clamp(Math.round(+a.amt || 0), 1, luckStake(100)); if (M.cash < bet) return false;
  const r = [slotSpin(), slotSpin(), slotSpin()], win = Math.round(bet * slotPay(r));
  L.last = { g: 'slot', r, win, bet }; luckLog(L, 'Slots', bet, win, r.join(' ')); return true;
}

// ---- craps: the pass line ----
function crapsPlay(a) {
  const M = S.me, L = luckOf(), bet = clamp(Math.round(+a.amt || 0), 1, luckStake(500)); if (M.cash < bet) return false;
  const d = () => 1 + Math.floor(prnd() * 6), rolls = []; let r = d() + d(), win; rolls.push(r);
  if (r === 7 || r === 11) win = true; else if ([2, 3, 12].includes(r)) win = false;
  else { const pt = r; for (let i = 0; i < 200; i++) { r = d() + d(); rolls.push(r); if (r === pt) { win = true; break; } if (r === 7) { win = false; break; } } }
  L.last = { g: 'craps', rolls, win: win ? bet * 2 : 0, bet }; luckLog(L, 'Craps', bet, win ? bet * 2 : 0, rolls.join(' → ')); return true;
}

// ---- the races: eight runners, a bookmaker's margin ----
const HORSE_A = ['Midnight', 'Silver', 'Lucky', 'Final', 'Golden', 'Rough', 'Director\'s', 'Velvet', 'Second', 'Wild', 'Box Office', 'Late', 'Northern', 'Cheeky'];
const HORSE_B = ['Cut', 'Reel', 'Take', 'Premiere', 'Matinee', 'Encore', 'Montage', 'Spotlight', 'Dolly', 'Gaffer', 'Sequel', 'Rumour', 'Gamble', 'Applause'];
function raceCard(w = S.week) {   // the same card all week; a stable hash, so looking at it never rolls
  const r = hashRand(w * 7331 + 17), runners = [];
  for (let i = 0; i < 8; i++) runners.push({ name: `${HORSE_A[Math.floor(r() * HORSE_A.length)]} ${HORSE_B[Math.floor(r() * HORSE_B.length)]}`, s: Math.pow(r() + .15, 2.2) });
  const T = runners.reduce((t, x) => t + x.s, 0);
  for (const x of runners) { x.p = x.s / T; const dec = 1 / (x.p * 1.17); x.odds = Math.max(1.2, Math.round(dec * 2) / 2); }
  return runners.sort((a, b) => a.odds - b.odds);
}
function fracOdds(dec) { const f = dec - 1; if (f >= 1 && Math.abs(f - Math.round(f)) < .01) return `${Math.round(f)}/1`; if (f < 1) return `${Math.round(f * 4)}/4`; return `${Math.round(f * 2)}/2`; }
function racePlay(a) {
  const M = S.me, L = luckOf(), C = raceCard(), h = C[+a.h], bet = clamp(Math.round(+a.amt || 0), 1, luckStake(500)); if (!h || M.cash < bet) return false;
  if ((L.raced || -1) === S.week) return false; L.raced = S.week;
  let x = prnd(), win = null; for (const r of C) { if (x < r.p) { win = r; break; } x -= r.p; } win = win || C[C.length - 1];
  const ok = win === h, pay = ok ? Math.round(bet * h.odds) : 0;
  const order = [win, ...C.filter(r => r !== win).sort(() => prnd() - .5)].slice(0, 3).map(r => r.name);
  L.last = { g: 'race', order, ok, pay, bet, mine: h.name };
  luckLog(L, 'The races', bet, pay, `${win.name} wins${ok ? ' — yours!' : ''}`); return true;
}

function luckAct(a) {
  switch (a.g) {
    case 'lotto': return lottoBuy(a); case 'scratch': return scratchPlay(a); case 'roul': return roulPlay(a);
    case 'bj': return bjAct(a); case 'slot': return slotPlay(a); case 'craps': return crapsPlay(a); case 'race': return racePlay(a);
  }
  return false;
}
// draws come on Wednesday and Saturday; and early on, somebody always mentions the jackpot
function luckWeek() {
  const M = S.me; if (!M || !M.party || !M.party.done) return; const L = luckOf();
  lottoDraw(); lottoDraw();
  if (!luckSmall() && L.nag < 6 && S.week % 5 === 2 && prnd() < .6) {
    L.nag++; const who = (typeof aliveKnown === 'function' ? aliveKnown() : []).find(id => ['friend', 'close'].includes(relOf(id)));
    inbox('note', `The jackpot is ${fmtCash(L.jackpot)}`, `${who !== undefined ? `${pl(who)} texts: "` : '"'}${pickLine(['Office syndicate this week, you in? Two dollars a line.', 'Rolled over again. Somebody has to win it.', 'Scratchcards at the corner shop: I got twenty dollars back yesterday.', 'Races on Saturday. I know a horse. I always know a horse.', 'Card room downtown on Friday, low stakes, good people.'], S.week)}" The Lucky Corner is in your computer, under Play.`, { app: 'luck' });
  }
}

// ---- the page ----
function cardFace(c) { const suit = ['♠', '♥', '♦', '♣'][c.s]; return `<span class="pcard${c.s === 1 || c.s === 2 ? ' red' : ''}">${CARD_R[c.r]}${suit}</span>`; }
function luckApp() {
  const M = S.me, L = luckOf(), tab = UI.luckT || 'lotto', amt = UI.luckAmt || luckStake(5), net = L.won - L.spent;
  const tabs = [['lotto', '🎱 Lotto'], ['scratch', '🎟️ Scratchcards'], ['roul', '🎡 Roulette'], ['bj', '🃏 Blackjack'], ['slot', '🎰 Slots'], ['craps', '🎲 Craps'], ['race', '🐎 The races'], ['odds', '📊 The odds']];
  const stake = (max) => `<div class="luck-stake"><span class="muted small">Stake</span>${[1, 5, 20, 100].map(x => luckStake(x)).filter(x => x <= max).map(x => `<button class="pill${amt === x ? ' on' : ''}" data-luckamt="${x}">${fmtCash(x)}</button>`).join('')}</div>`;
  const last = L.last;
  let body = '';
  if (tab === 'lotto') {
    const D = L.draws[L.draws.length - 1];
    body = `<div class="luck-hero lotto"><p class="eyebrow">Next jackpot</p><p class="luck-big">${fmtCash(L.jackpot)}</p><p class="small">Draws on Wednesday and Saturday. Six numbers from 49 and a bonus ball. ${fmtCash(luckStake(2))} a line.</p></div>
     <div class="bank-f"><button class="os-btn" data-luck="lotto:1">Lucky dip: 1 line</button><button class="os-btn" data-luck="lotto:5">5 lines</button><button class="os-btn" data-luck="lotto:10">10 lines</button></div>
     ${L.tickets.length ? `<p class="small"><b>Your lines for the next draw:</b></p><div class="balls">${L.tickets.slice(0, 10).map(t => `<div>${t.nums.map(n => `<span class="ball b${Math.ceil(n / 10)}">${n}</span>`).join('')}</div>`).join('')}</div>` : '<p class="small muted">No lines for the next draw.</p>'}
     ${D ? `<p class="small"><b>Last draw</b> (${fmtDate(D.w, true)}):</p><div class="balls"><div>${D.drawn.map(n => `<span class="ball b${Math.ceil(n / 10)}">${n}</span>`).join('')} <span class="ball bonus">${D.bonus}</span></div></div>${D.lines.length ? `<p class="small">You matched ${Math.max(...D.lines.map(l => l.m))} at best${D.total ? `: <b class="good">${fmtCash(D.total)}</b>` : '.'}</p>` : ''}${D.worldWin ? `<p class="small muted">Somebody in another town won ${fmtCash(D.worldWin)}.</p>` : ''}` : ''}
     <p class="small muted">Odds per line: jackpot 1 in 13,983,816 · five and the bonus 1 in 2,330,636 · five 1 in 55,491 · four 1 in 1,032 · three 1 in 57. About half the money comes back as prizes.</p>`;
  } else if (tab === 'scratch') {
    body = `<div class="scratch-row">${Object.entries(SCRATCH).map(([p, C]) => `<button class="scard" style="--sc:${C.col}" data-luck="scratch:${p}"${M.cash < luckStake(+p) ? ' disabled' : ''}><b>${esc(C.name)}</b><span>${fmtCash(luckStake(+p))}</span><small>top prize ${fmtCash(luckStake(+p) * 10000)}</small></button>`).join('')}</div>
     ${last && last.g === 'scratch' ? `<div class="scratched" style="--sc:${SCRATCH[last.face].col}"><div class="sgrid">${last.grid.map((s, i) => `<span style="animation-delay:${i * .08}s">${s}</span>`).join('')}</div><p class="${last.win ? 'good' : 'muted'}"><b>${last.win ? `Three of a kind: ${fmtCash(last.win)}!` : 'No match. Not even close. (Close.)'}</b></p></div>` : '<p class="muted small">Pick a card and scratch it.</p>'}
     <p class="small muted">About one card in three and a half wins something, and most wins are your money back. Over time a little more than half of what you spend comes back.</p>`;
  } else if (tab === 'roul') {
    body = `<div class="roul">${last && last.g === 'roul' ? `<div class="roul-ball ${last.n === 0 ? 'green' : RED.has(last.n) ? 'red' : 'black'}">${last.n}</div><p class="${last.win ? 'good' : 'bad'}"><b>${last.win ? `You win ${fmtCash(last.win - last.bet)}` : 'The house takes it'}</b></p>` : '<div class="roul-ball idle">?</div>'}</div>
     ${stake(luckStake(500))}<div class="bank-f">${Object.entries(ROUL_BETS).filter(([k]) => k !== 'num').map(([k, [l, p]]) => `<button class="os-btn" data-luck="roul:${k}">${l} <span class="muted">${p}:1</span></button>`).join('')}</div>
     <div class="bank-f"><input id="roul-n" type="number" min="0" max="36" value="${UI.roulN ?? 17}" style="width:70px"><button class="os-btn" data-luck="roul:num">On that number <span class="muted">35:1</span></button></div>
     <p class="small muted">A single-zero wheel: the zero is why the house wins, about 2.7% of everything bet over time.</p>`;
  } else if (tab === 'bj') {
    const H = L.bj, me = bjVal(H ? H.p : []), basic = H && !H.done ? bjBasic(H.p, H.d[0]) : null, fin = statVal('fin'), sees = fin >= 11 || statVal('com') >= 13;
    body = `<div class="felt">${H ? `<div><span class="muted small">Dealer${H.done ? ` · ${bjVal(H.d).t}` : ''}</span><div>${H.done ? H.d.map(cardFace).join('') : cardFace(H.d[0]) + '<span class="pcard back"></span>'}</div></div><div><span class="muted small">You · ${me.t}${me.soft && me.t <= 21 ? ' (soft)' : ''}</span><div>${H.p.map(cardFace).join('')}</div></div>${H.done ? `<p class="bjres ${['win', 'bj'].includes(H.res) ? 'good' : H.res === 'push' ? '' : 'bad'}"><b>${{ bj: 'Blackjack! Paid 3 to 2.', win: 'You win.', push: 'Push: your stake back.', lose: 'Dealer wins.', bust: 'Bust.' }[H.res]}</b></p>` : ''}` : '<p class="muted">Place a bet to deal.</p>'}</div>
     ${H && !H.done ? `<div class="bank-f"><button class="os-btn" data-luck="bj:hit">Hit</button><button class="os-btn" data-luck="bj:stand">Stand</button>${H.p.length === 2 && M.cash >= H.bet ? '<button class="os-btn" data-luck="bj:double">Double</button>' : ''}</div><p class="small ${sees ? '' : 'muted'}">${sees ? `Your head for numbers says: <b>${basic}</b>.` : 'You\'re not sure what the right play is. (Sharper finance or composure would tell you.)'}</p>` : `${stake(luckStake(500))}<div class="bank-f"><button class="os-btn" data-luck="bj:deal">Deal</button></div>`}
     <p class="small muted">The dealer stands on all seventeens. Played by the book, the house keeps about one percent; played by feel, more like two to four.</p>`;
  } else if (tab === 'slot') {
    body = `<div class="slots">${(last && last.g === 'slot' ? last.r : ['❔', '❔', '❔']).map((s, i) => `<span style="animation-delay:${i * .15}s">${s}</span>`).join('')}</div>${last && last.g === 'slot' ? `<p class="${last.win > last.bet ? 'good' : last.win ? '' : 'muted'}"><b>${last.win ? `Pays ${fmtCash(last.win)}` : 'Nothing'}</b></p>` : ''}
     ${stake(luckStake(100))}<div class="bank-f"><button class="os-btn" data-luck="slot">Pull</button></div>
     <p class="small muted">Three 7s pay 600 to 1; a cherry gives half your stake back. Over a long night, about nine in ten come back. The machine has a long memory and no conscience.</p>`;
  } else if (tab === 'craps') {
    body = `${last && last.g === 'craps' ? `<p class="craps">${last.rolls.map((r, i) => `<span class="die">${r}</span>${i < last.rolls.length - 1 ? '→' : ''}`).join('')}</p><p class="${last.win ? 'good' : 'bad'}"><b>${last.win ? `Pass! You win ${fmtCash(last.bet)}` : 'Seven out.'}</b></p>` : ''}
     ${stake(luckStake(500))}<div class="bank-f"><button class="os-btn" data-luck="craps">Bet the pass line and roll</button></div>
     <p class="small muted">7 or 11 on the first roll wins; 2, 3 or 12 loses; anything else becomes the point, and you roll until the point (win) or a 7 (lose). The house keeps 1.4%.</p>`;
  } else if (tab === 'race') {
    const C = raceCard(), done = L.raced === S.week;
    body = `<p class="small">Saturday's card at the track. ${done ? '<b>You\'ve had your bet this week.</b>' : 'One bet a week.'}</p>${stake(luckStake(500))}
     <table class="os-table"><thead><tr><th>Runner</th><th>Odds</th><th></th></tr></thead><tbody>${C.map((h, i) => `<tr><td>${esc(h.name)}</td><td>${fracOdds(h.odds)}</td><td><button class="linkish" data-luck="race:${i}"${done ? ' disabled' : ''}>Back it</button></td></tr>`).join('')}</tbody></table>
     ${last && last.g === 'race' ? `<p class="${last.ok ? 'good' : 'muted'}"><b>${last.ok ? `${esc(last.mine)} wins! You collect ${fmtCash(last.pay)}.` : `${esc(last.order[0])} wins; ${esc(last.mine)} is nowhere.`}</b> <span class="muted small">1st ${esc(last.order[0])}, 2nd ${esc(last.order[1])}, 3rd ${esc(last.order[2])}</span></p>` : ''}
     <p class="small muted">The bookmaker's prices add up to about 117%: that's his margin, and why the favourite at evens still loses money over time.</p>`;
  } else {
    body = `<table class="os-table"><thead><tr><th>Game</th><th>Comes back, over time</th><th>Biggest win</th></tr></thead><tbody>${[['Lotto', '~50%', 'the jackpot (1 in 14 million)'], ['Scratchcards', '~55–65%', '10,000× the card'], ['Slots', '~90%', '600×'], ['The races', '~85%', 'the long shot\'s price'], ['Roulette', '97.3%', '35:1'], ['Craps (pass line)', '98.6%', 'even money'], ['Blackjack, played right', '~99.5%', '3:2 on a blackjack']].map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td><td class="muted">${r[2]}</td></tr>`).join('')}</tbody></table>
     <p class="small muted">Nothing here beats the house over time. Some of it is fun. Some of it is a long night with a short ending.</p>`;
  }
  return `<div class="luck-head"><div><b class="${net >= 0 ? 'good' : 'bad'}">${net >= 0 ? 'Up' : 'Down'} ${fmtCash(Math.abs(net))}</b> <span class="muted small">all time · spent ${fmtCash(L.spent)} · won ${fmtCash(L.won)}</span></div>${luckSmall() ? '<span class="chip">Small change now</span>' : '<span class="chip good">Every dollar counts</span>'}</div>
   <div class="fchips">${tabs.map(([k, l]) => `<button class="fchip${tab === k ? ' on' : ''}" data-luckt="${k}">${l}</button>`).join('')}</div>
   <div class="luck-body">${body}</div>
   ${L.hist.length ? `<h5>Lately</h5><ul class="os-list">${L.hist.slice(-6).reverse().map(h => `<li><time class="muted">${fmtDate(h.w, true)}</time><span>${esc(h.g)}</span><span class="small">${esc(h.t)}</span><span class="${h.win > h.bet ? 'good' : h.bet ? 'bad' : ''}">${h.win - h.bet >= 0 ? '+' : '−'}${fmtCash(Math.abs(h.win - h.bet))}</span></li>`).join('')}</ul>` : ''}`;
}
function luckClick(t) {
  const d = t.dataset;
  if (d.luckt) { UI.luckT = d.luckt; render(true); return true; }
  if (d.luckamt) { UI.luckAmt = +d.luckamt; render(true); return true; }
  if (d.luck === undefined) return false;
  const [g, v] = d.luck.split(':'), amt = UI.luckAmt || luckStake(5);
  if (g === 'lotto') doAct({ t: 'luck', g, n: +v });
  else if (g === 'scratch') doAct({ t: 'luck', g, p: +v });
  else if (g === 'roul') { const n = +((document.getElementById('roul-n') || {}).value || 0); UI.roulN = n; doAct({ t: 'luck', g, b: v, amt, pick: n }); }
  else if (g === 'bj') doAct({ t: 'luck', g, k: v, amt });
  else if (g === 'race') doAct({ t: 'luck', g, h: +v, amt });
  else doAct({ t: 'luck', g, amt });
  render(true); return true;
}
OS_VIEWS.luck = luckApp;
OS_EXTRA.luck = ['🍀', 'Lucky Corner', 'Lotto, scratchcards, the casino and the races: real odds, small money'];
{ const G = OS_GROUPS.find(g => g[0] === 'Play'); if (G && !G[1].includes('luck')) G[1].unshift('luck'); }
