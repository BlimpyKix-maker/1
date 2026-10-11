// ---------------- Voices: your own, and the people you ask ----------------
//  · Your skills talk. When a decision turns on something you're very good at, or hopeless at, a line in your head
//    says so before you choose (it's the same odds the button shows, in the voice of the skill).
//  · The advisor ring. On the big calls about your own films, the people around you weigh in: your agent thinks about
//    money and heat, your mentor about the work, your partner about you. They don't always agree, they each have an
//    angle, and the desk keeps their record: how often the option each one backed went well when you took it.
const VOICE = { hi: ['You\'ve done this a hundred times.', 'Easy. Don\'t overthink it.', 'This is the part you\'re good at.'], lo: ['This isn\'t your thing. You know that.', 'Careful. You\'re out of your depth here.', 'Somebody else should probably do this.'] };
const SK_NAME = k => (typeof SUB_LABEL !== 'undefined' && SUB_LABEL[k]) || (typeof MINDS !== 'undefined' && MINDS[k] && (MINDS[k].label || MINDS[k])) || k;
function voiceLine(it) {
  const C = (it.choices || []).filter(c => c.check && !c.dis); if (!C.length) return '';
  const me = ME(), L = C.map(c => [c, skillOf(me, c.check[0])]), hi = L.filter(x => x[1] >= 16).sort((a, b) => b[1] - a[1])[0], lo = L.filter(x => x[1] <= 6).sort((a, b) => a[1] - b[1])[0];
  const pick = hi || lo; if (!pick) return ''; const [c, v] = pick, s = String(SK_NAME(c.check[0])), L2 = hi ? VOICE.hi : VOICE.lo;
  return `💭 ${s[0].toUpperCase() + s.slice(1)} (${Math.round(v)}), about "${c.label.split(' · ')[0]}": ${L2[(it.id || 0) % L2.length]}`;
}
const ADVISORS = [['agent', 'Your agent', o => (o.hook || 0) * 1.2 + (o.sell ? 3 : 0) - (o.cost || 0) * 20], ['mentor', 'Your mentor', o => (o.q || 0) * 1.5 - (o.hook || 0) * .2], ['partner', 'Your partner', o => -(o.stress || 0) - (o.weeks || 0) * .5 + (o.q || 0) * .3]];
function advWho(k) { const M = S.me; if (k === 'agent') return M.agent ? M.agent.name : null; if (k === 'partner') { const p = partnerOf(); return p !== null ? P(p).name : null; } if (k === 'mentor') { const id = Object.keys(M.rel || {}).map(Number).find(id => M.rel[id].s === 'mentor' && P(id) && !P(id).dead); return id !== undefined ? P(id).name : null; } return null; }
function advRec(it) {
  const C = typeof PJ_CALLS !== 'undefined' ? PJ_CALLS.find(x => x.k === it.call) : null; if (!C) return [];
  return ADVISORS.map(([k, l, score]) => { const who = advWho(k); if (!who) return null; const best = C.opts.map(o => [o, score(Object.assign({}, o.ok, { cost: o.cost || 0 }))]).sort((a, b) => b[1] - a[1])[0]; return best ? { k, l, who, opt: best[0].k, label: best[0].label } : null; }).filter(Boolean);
}
{ const _ib = inbox; inbox = function (kind, title, text, extra = {}) {
  const it = _ib(kind, title, text, extra); if (!it || !S.me || !it.choices) return it;
  const v = voiceLine(it); if (v) it.text = `${it.text} ${v}`;
  if (kind === 'pj') { const R = advRec(it); if (R.length) { it.adv = R.map(r => ({ k: r.k, opt: r.opt })); const T = S.me.advRec || {};
    it.text += ' ' + R.map(r => { const t = T[r.k]; return `🗣️ ${r.l} (${r.who}): "${r.label.split(' (')[0]}."${t && t.n >= 3 ? ` Right ${Math.round(t.ok / t.n * 100)}% of the time you listened.` : ''}`; }).join(' '); } }
  return it; }; }
// keep score: when you take an advisor's pick, did it go well?
{ const _pp = pjPick; pjPick = function (it, k) { const r = _pp(it, k); if (it.kind === 'pj' && it.adv && it.result) { const T = S.me.advRec = S.me.advRec || {}; const good = it.result.ok !== false && !/\b(worse|break|wrong|fails?|leaks?|collapse|walks|can see)\b/i.test(it.result.t || ''); for (const a of it.adv) if (a.opt === k) { const x = T[a.k] = T[a.k] || { n: 0, ok: 0 }; x.n++; if (good) x.ok++; } } return r; }; }
