// ---------------- Judged by the dice, not by a moral code ----------------
// A choice is judged by whether you pull it off, not by whether it was nice. A shady option that used to carry a
// fixed penalty (a "fudged the numbers" mark, standing lost, a risk of the sack) now carries a roll: land it and it goes
// the way you meant, with nobody the wiser; miss it and the world reacts however it reacts. Clean options that never
// rolled stay as they are. Applied once, to every scene, when the game loads.
const SHADY_FLAGS = ['fudger', 'scab', 'mudslinger'];
const GOT_AWAY = ['It goes the way you meant it to. Nobody connects it to you.', 'You pull it off. Nobody asks a single question.', 'Smooth. If anyone noticed, they keep it to themselves.', 'It works, quietly. You never hear about it again.'];
function intentNormalize(L) {
  for (const s of L || []) for (const o of s.opts || []) {
    const ok = o.ok || {}, shady = SHADY_FLAGS.includes(ok.flag) || ok.risk || ok.fire;
    if (!shady || o._intent) continue;
    o._intent = 1;
    if (!o.check) {
      // the effects as written become what happens when it goes wrong; success keeps only what you were after
      o.bad = Object.assign({}, ok, o.bad || {});
      const good = Object.assign({}, ok); delete good.flag; delete good.risk; delete good.fire; if (good.stand < 0) delete good.stand;
      o.ok = good; o.check = [ok.flag === 'scab' || ok.flag === 'mudslinger' ? 'cha' : 'com', 12];
      o.tb = o.t; o.t = GOT_AWAY[(s.id || '').length % GOT_AWAY.length];
    } else if (SHADY_FLAGS.includes(ok.flag)) { const good = Object.assign({}, ok); delete good.flag; o.ok = good; }
  }
}
if (typeof SCENES !== 'undefined') intentNormalize(SCENES);
