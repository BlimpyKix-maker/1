// ---------------- Traits and stress: acting against who you are ----------------
// After Crusader Kings 3: your traits lean towards some kinds of choice and away from others. A Shy person who keeps
// confronting people, a Ruthless one who keeps giving things away, a Reckless one forced to play it safe: each time
// costs stress, and the choice says so before you pick it ("stress +4 · Shy"). Choices that fit you ease it a little.
// Stress has levels. Crossing into Stressed (60) or Breaking (80) forces a coping choice, and each coping mechanism
// becomes a trait with upsides and costs: drink, run, therapy, a short fuse, shopping, hiding away, working through
// it. Habits can be broken later, once life is calmer.
// And people change: act against a trait often enough and it wears away; keep making one kind of choice and it
// becomes part of you.
const TRAIT_STANCE = {
  Shy: { bold: -4, careful: 1 }, Anxious: { bold: -3, careful: 1 }, Cautious: { bold: -3, careful: 1 }, Humble: { bold: -2, generous: 1 }, Diplomatic: { bold: -2, generous: 1 }, Calm: { bold: -1, careful: 1 },
  Reckless: { careful: -3, bold: 1 }, Volatile: { careful: -3, bold: 1 }, Stubborn: { careful: -3, bold: 1 }, Showboat: { careful: -2, bold: 2 }, Ambitious: { careful: -2, bold: 1 },
  Ruthless: { generous: -3, bold: 1 }, Frugal: { generous: -2 }, Difficult: { generous: -2 }, 'Lone wolf': { generous: -1 }, Cynical: { generous: -1 },
  Kind: { generous: 2, bold: -1 }, 'Team player': { generous: 2 }, Loyal: { generous: 1 }, Spendthrift: { generous: 1 }, Beloved: { generous: 1 }
};
const STANCE_GROW = { bold: 'Ambitious', careful: 'Cautious', generous: 'Kind' };
const COPING = {
  Drinks: { t: { stress: .9, dis: ['com'], d: 'A drink to take the edge off; more than one, most nights' }, now: 22, label: 'Have a drink. Have several.', go: 'The edge comes off. It comes back in the morning, worse, and you know where the bottle is.' },
  Runner: { t: { stress: .9, energy: 2, d: 'Runs it off, every morning' }, now: 12, label: 'Start running', go: 'Your lungs hate you for a week. Then the mornings are the best part of the day.' },
  'In therapy': { t: { stress: .82, d: 'Fifty minutes a week, and it helps' }, now: 15, cost: 1200, label: 'Find a therapist', go: 'You talk for fifty minutes and cry for ten of them. You book the next one before you leave.' },
  'Short fuse': { t: { tie: -2, stress: .9, dis: ['col'], d: 'Lets it out, at whoever is nearest' }, now: 25, label: 'Let it out', go: 'You say exactly what you think, loudly, to someone who didn\'t deserve all of it. It feels great for an hour.' },
  Shopaholic: { t: { living: 1.15, stress: .92, d: 'Buys things to feel better' }, now: 15, cost: 900, label: 'Buy something you don\'t need', go: 'It arrives in a beautiful box. For a while, so does the feeling.' },
  Recluse: { t: { net: -1, stress: .9, d: 'Disappears for days to recharge' }, now: 18, label: 'Disappear for a while', go: 'Phone off. Curtains closed. People notice you\'re gone, and some of them stop asking.' },
  Workaholic: { t: { grow: 1.1, stress: 1.05, energy: -2, d: 'Works through it, and never stops' }, now: 6, label: 'Work through it', go: 'You bury it in work. The work gets better. You don\'t.' }
};
for (const [k, c] of Object.entries(COPING)) if (!TRAITS[k]) TRAITS[k] = c.t;   // not in TRAIT_KEYS, so nobody is born with one
const STRESS_LV = [[0, 'Steady'], [40, 'Strained'], [60, 'Stressed'], [80, 'Breaking']];
function stressLv(s = S.me.stress) { let i = 0; for (let j = 0; j < STRESS_LV.length; j++) if (s >= STRESS_LV[j][0]) i = j; return i; }
// what a stance does to you, given your traits: + is stress, − is relief
function stanceCost(stance) {
  if (!stance || stance === 'plain' || !S.me) return null; const me = ME(); let d = 0; const why = [];
  for (const t of me.traits) { const v = (TRAIT_STANCE[t] || {})[stance]; if (v) { d -= v; why.push(t); } }
  if (!d) return null; if (d > 0) d = Math.round(d * traitMul(me, 'stress') * 10) / 10;
  return { d, why };
}
// label the choices
{ const _ib = inbox; inbox = function (kind, title, text, extra = {}) {
  const it = _ib(kind, title, text, extra) || (S.me && S.me.inbox[S.me.inbox.length - 1]);
  if (it && it.choices && S.me && kind !== 'guild' && kind !== 'cope') for (const c of it.choices) {
    if (c.dis || c.ts !== undefined || typeof c.label !== 'string') continue;
    const sc = stanceCost(stanceOf(c.label.split(' · ')[0])); if (!sc) continue;
    c.ts = sc.d; c.tw = sc.why; c.label += sc.d > 0 ? ` · stress +${sc.d} (${sc.why.join(', ')})` : ` · eases stress (${sc.why.join(', ')})`;
  }
  return it; }; }
// pay it when you pick
{ const _rp = resolvePick; resolvePick = function (it, k) {
  const c = (it.choices || []).find(x => x.k === k), st = c && typeof c.label === 'string' ? stanceOf(c.label.split(' · ')[0]) : 'plain';
  const r = _rp(it, k); if (!r || !S.me) return r;
  const M = S.me, me = ME();
  if (c && c.ts) { M.stress = clamp(M.stress + c.ts, 0, 100); (M.slog = M.slog || []).push({ w: S.week, d: c.ts, why: c.tw, t: it.title }); if (M.slog.length > 30) M.slog.shift(); }
  if (st !== 'plain') stanceGrow(st);
  return r; }; }
// people change
function stanceGrow(st) {
  const M = S.me, me = ME(); M.stc = M.stc || {}; M.stc[st] = (M.stc[st] || 0) + 1; if (M.stc[st] < 18) return; M.stc[st] = 0;
  const against = me.traits.find(t => ((TRAIT_STANCE[t] || {})[st] || 0) < 0);
  if (against) { me.traits = me.traits.filter(t => t !== against); milestone(`No longer ${against.toLowerCase()}`, 'life'); inbox('note', `You're not ${against.toLowerCase()} any more`, `Somewhere in the last year, choosing the ${st} way over and over, you stopped being ${against.toLowerCase()}. People who knew you before notice first.`); return; }
  const g = STANCE_GROW[st]; if (g && !me.traits.includes(g) && me.traits.length < 7 && !me.traits.some(t => ((TRAIT_STANCE[t] || {})[st] || 0) < 0)) { me.traits.push(g); milestone(`Became ${g.toLowerCase()}`, 'life'); inbox('note', `People call you ${g.toLowerCase()} now`, `It's how you keep choosing, and it's who you are now: ${TRAITS[g].d.toLowerCase()}.`); }
}
// breaking points and habits
function stressWeek() {
  if (!S.me) return; const M = S.me, me = ME(), lv = stressLv();
  if (lv >= 2 && lv > (M.slv || 0) && S.week - (M.brkW || -99) >= 10 && !pending().some(x => x.kind === 'cope')) {
    M.brkW = S.week; const have = me.traits.filter(t => COPING[t]), ks = Object.keys(COPING).filter(k => !have.includes(k));
    const pickN = ks.map(k => [k, gH(S.week, k, M.id)]).sort((a, b) => a[1] - b[1]).slice(0, 4).map(x => x[0]);
    const ch = pickN.map(k => ({ k: 'cope_' + k, label: `${COPING[k].label}${COPING[k].cost ? ` (${fmtCash(usd(COPING[k].cost))})` : ''} · stress −${COPING[k].now}` })).concat(have.map(k => ({ k: 'cope_' + k, label: `${COPING[k].label}: the old habit · stress −${Math.round(COPING[k].now * .7)}` })));
    ch.push({ k: 'cope_none', label: 'Push through it' });
    inbox('cope', lv >= 3 ? 'You are breaking' : 'It\'s getting to you', `${lv >= 3 ? 'You can\'t sleep, you can\'t eat, and you snapped at someone who didn\'t deserve it.' : 'The weeks are blurring together and your jaw aches from clenching it.'} Stress ${Math.round(M.stress)}. Something has to give: how do you cope?`, { choices: ch });
  }
  M.slv = lv;
  if (me.traits.includes('In therapy')) M.cash -= usd(120);
  if (me.traits.includes('Drinks') && gH(S.week, M.id, 'hang') < .05) { M.energy = clamp(M.energy - 15, 0, 100); inbox('note', 'A rough morning', 'Last night got away from you. Today you are useless, and everybody can tell.'); }
  // a calm stretch is the time to drop a habit
  if (M.stress < 20) M.calmN = (M.calmN || 0) + 1; else M.calmN = 0;
  if (M.calmN === 12) { const bad = me.traits.find(t => ['Drinks', 'Short fuse', 'Shopaholic', 'Recluse'].includes(t)); if (bad) inbox('cope', 'Life is calmer', `Things are good, for once. Good enough to look at the ${bad === 'Drinks' ? 'drinking' : bad === 'Short fuse' ? 'temper' : bad === 'Shopaholic' ? 'spending' : 'hiding'}.`, { quit: bad, choices: [{ k: 'cope_quit', label: 'Break the habit', check: ['com', 13] }, { k: 'cope_keep', label: 'It\'s fine. It\'s under control.' }] }); }
}
function copePick(it, k) {
  if (it.kind !== 'cope') return false; it.done = true; const M = S.me, me = ME();
  if (k === 'cope_quit') { const ok = roll('com', 13); if (ok) { me.traits = me.traits.filter(t => t !== it.quit); milestone(`Broke a habit: ${it.quit.toLowerCase()}`, 'life'); } it.result = { ok, roll: M.lastRoll, t: ok ? 'It takes a month of saying no. Then it\'s just a thing you used to do.' : 'You last nine days. Next time.' }; return true; }
  if (k === 'cope_keep' || k === 'cope_none') { if (k === 'cope_none') M.stress = clamp(M.stress + 3, 0, 100); it.result = { t: k === 'cope_none' ? 'You grit your teeth and keep going. It doesn\'t go away; it waits.' : 'It\'s under control.' }; return true; }
  const key = k.slice(5), C = COPING[key]; if (!C) return true; const old = me.traits.includes(key);
  M.stress = clamp(M.stress - (old ? Math.round(C.now * .7) : C.now), 0, 100); if (C.cost) M.cash -= usd(C.cost);
  if (!old) { me.traits.push(key); milestone(`Started coping: ${key.toLowerCase()}`, 'life'); }
  if (key === 'Short fuse') { const ids = aliveKnown().filter(id => opinion(id) > 0).slice(0, 3); for (const id of ids) addTie(me, P(id), -3); }
  if (key === 'Recluse') M.energy = clamp(M.energy + 15, 0, 100);
  it.result = { t: C.go }; return true;
}
// the Terminal's view of your head
function mindPanel() {
  const M = S.me, me = ME(), s = M.stress, lv = stressLv();
  const lean = t => Object.entries(TRAIT_STANCE[t] || {}).map(([k, v]) => `<span class="${v < 0 ? 'dn' : 'up'}">${k} ${v < 0 ? '+' + (-v) : '−' + v}</span>`).join(' ');
  const ticks = [40, 60, 80, 90].map(x => `<i class="ms-tick" style="left:${x}%" title="${x === 90 ? 'Burnout' : STRESS_LV.find(l => l[0] === x)[1]}"></i>`).join('');
  const log = (M.slog || []).slice(-5).reverse().map(x => `<li><span class="${x.d > 0 ? 'dn' : 'up'}">${x.d > 0 ? '+' : ''}${x.d}</span> ${esc(x.t)} <span class="tk-mut">(${esc((x.why || []).join(', '))})</span></li>`).join('');
  const prog = Object.entries(M.stc || {}).map(([k, v]) => `${k} ${v}/18`).join(' · ');
  return `<section class="tk-p"><h4>MIND <span class="tk-sub">traits, stress and habits</span></h4>
   <div class="ms-gauge"><i style="width:${Math.min(100, s)}%" class="ms-${lv}"></i>${ticks}</div><p class="tk-foot"><b>${STRESS_LV[lv][1]}</b> · stress ${Math.round(s)}${M.burnout ? ' · burnt out' : ''}. Crossing 60 or 80 forces a way of coping.</p>
   <table class="tk-t"><tbody>${me.traits.map(t => `<tr><td>${esc(t)}${COPING[t] ? ' <span class="tk-warn">habit</span>' : ''}</td><td class="small">${lean(t) || `<span class="tk-mut">${esc((TRAITS[t] || {}).d || '')}</span>`}</td></tr>`).join('')}</tbody></table>
   ${log ? `<ul class="plain small ms-log">${log}</ul>` : ''}<p class="tk-foot">Choices against your traits cost stress; fits ease it. ${prog ? `Becoming: ${prog} (18 of one kind changes you).` : 'Keep choosing one way and it changes you.'}</p></section>`;
}
{ const _th = terminalHTML; terminalHTML = function () { const h = _th(); const i = h.lastIndexOf('</div></div>'); return i < 0 ? h : h.slice(0, i) + mindPanel() + h.slice(i); }; }
