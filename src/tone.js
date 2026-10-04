// ---------------- No lectures ----------------
// Choices aren't moral tests. A bold, confrontational or go-it-alone choice can be exactly right; what decides it is
// the roll and the circumstances. Bold choices that used to cost you automatically are gambles now (a roll that can
// pay off), and every rolled outcome gets a short line judged only on whether it worked, in the voice of the job.
const STANCE_RE = {
  bold: /push back|fight|argue|refuse|demand|insist|call it out|speak up|confront|challenge|negotiat|reply|vent|side with|go over|unfiltered|anyway|own way|your way|what you really think|tell them|bold|stand firm|hold firm|hard bargain|walk out|threaten|bluff|break|opposite/i,
  careful: /say nothing|keep it|quiet|let it|wait|ignore|stay out|leave it|play it safe|follow|delete it|do as/i,
  generous: /help|cover|offer|lend|share|take them out|organise|organize|step in|volunteer|teach|buy/i
};
function stanceOf(label) { for (const k of ['bold', 'careful', 'generous']) if (STANCE_RE[k].test(label || '')) return k; return 'plain'; }
const QUIPS = {
  bold: [['Bold call. It paid off.', 'You backed yourself, and it landed.', 'Nerve like that gets a {role} noticed.', 'The loudest idea in the room was the right one.', 'That\'s how reputations get made.', 'You said it out loud. It worked.'],
         ['Big swing. Not this time.', 'Didn\'t land today. The instinct was still yours.', 'Some fights you lose. You\'ll pick the next one.', 'Bold doesn\'t always win. It does get remembered.', 'Wrong day for it, not wrong to try.']],
  careful: [['Steady hands. It held.', 'Quiet, and it worked.', 'Picking your moment paid off.', 'A cool head for a {role}.'],
            ['Playing it safe didn\'t save it.', 'The quiet option had its own risks.', 'Careful wasn\'t enough this time.']],
  generous: [['People remember who showed up.', 'Generous, and it came back around.', 'That\'s the kind of {role} crews ask for.'],
             ['You tried to help. It didn\'t take.', 'Good intentions, rough result.', 'Not every favour lands.']],
  plain: [['That went your way.', 'Nicely done.', 'Clean.', 'Exactly what a {role} is for.'], ['Didn\'t go your way.', 'Rough break.', 'Not your day.', 'The dice had other plans.']]
};
function stanceQuip(o, ok, it) {
  if (!o || !o.check) return null;
  const st = stanceOf(o.label), L = QUIPS[st][ok ? 0 : 1], r = hashRand((it.id || 1) * 7 + (ok ? 3 : 5))(), job = S.me && S.me.jobs.find(j => j.id === it.job);
  return L[Math.floor(r * L.length)].replace('{role}', job ? job.t.toLowerCase() : 'newcomer');
}
// bold choices that were automatic punishments become gambles
(function boldGambles() {
  if (typeof SCENES === 'undefined') return;
  for (const s of SCENES) for (const op of s.opts) {
    if (op.check || stanceOf(op.label) !== 'bold') continue;
    const f = op.ok || {}, tie = Object.values(f.tie || {}).reduce((a, b) => a + b, 0); if (tie >= 0 && (f.stand || 0) >= 0) continue;
    const good = { stand: .3 }; if (f.tie) { good.tie = {}; for (const k in f.tie) good.tie[k] = Math.max(1, Math.round(Math.abs(f.tie[k]) * .6)); }
    op.bad = f; op.tb = op.t; op.ok = good; op.check = [/negotiat|argue|tell|reply|vent|push|side/i.test(op.label) ? 'cha' : 'com', 13];
    op.t = ['It lands better than anyone expected.', 'You read the room right: it works.', 'They push back, you hold, and it goes your way.'][(s.id.length + op.k.length) % 3];
  }
})();
