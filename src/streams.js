// ---------------- Separate dice for the world and the player ----------------
// Every week of the world runs on streams keyed by the seed, the week and the system (core tick() reseeds per system,
// see wstream). Anything the player does runs on the player's own stream: making a party guest, meeting a contact,
// founding a company. So two careers on the same seed share the world's luck, and what differs between them was
// caused by what the player did, not by the dice shifting under them. This wrapper is the outermost one on tick
// and applyAct (it is built last).
{ const _t = tick; tick = function () { const prev = R; R = wstream('tick', S.week + 1); try { return _t.apply(this, arguments); } finally { R = prev; } }; }
{ const _aa = applyAct; applyAct = function (a) {
  const prev = R; R = S.me && S.me.rng ? S.me.rng : wstream('create', (a && a.c && a.c.salt) || 0, (a && a.t) || '');
  try { return _aa.apply(this, arguments); } finally { R = prev; } }; }
