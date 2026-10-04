// ---------------- The long arc: getting older, stepping back, and what you leave behind ----------------
// A career has a shape. From fifty or so the body asks for more rest; from the late fifties the business starts
// treating you as history: tributes, honorary prizes, younger people asking for the keys. You can retire whenever
// you like (the Life tab), and the game writes your epilogue: a life in film, scored and summed up. Then you can
// play the next generation in the same world, where your old self is now one of the names.

// ---- age ----
function myAge() { return S.me ? ageOf(ME()) : 0; }
// a night's sleep gives back a little less after fifty
function ageSleepTax() { const a = myAge(); return a > 50 ? Math.min(10, (a - 50) * .25) : 0; }

// ---- the late-life moments ----
LATE.push(
  { id: 'ag_health', pool: 'age', cool: 52, need: () => myAge() >= 55, title: 'A health scare', text: () => 'A pain in your chest on the stairs. It turns out to be nothing serious, the doctor says, this time. "But you\'re not thirty-five."',
    opts: [
      { k: 'slow', label: () => 'Slow down: fewer late nights, a proper holiday', go: c => { lateFx({ stress: -15, energy: 10 }); return 'You start saying no to things. It\'s harder than any job you ever did, and it helps.'; } },
      { k: 'ignore', label: () => 'Carry on as before', check: ['com', 13], go: (c, ok) => { lateFx(ok ? { stress: 3 } : { stress: 12, energy: -20 }); return ok ? 'You carry on. You are lucky, and you know it.' : 'Three weeks later it happens again, worse. You spend a week in hospital, furious.'; } }] },
  { id: 'ag_obit', pool: 'age', once: 1, need: () => myAge() >= 65 && ME().standing >= 30, title: 'The obituary desk', text: () => 'A young journalist calls, mortified: the paper keeps obituaries of notable people on file, and yours "needs updating". Would you check a few facts?',
    opts: [
      { k: 'help', label: () => 'Help them get it right', go: c => { lateFx({ fame: 1, stress: -4 }); return 'You correct three dates and add a joke. They promise not to need it for a long time.'; } },
      { k: 'laugh', label: () => 'Ask to write the last line yourself', check: ['dial', 12], go: (c, ok) => { lateFx({ fame: ok ? 2 : 1 }); return ok ? 'Your line makes the editor laugh out loud. It\'s on file now, waiting.' : 'They say they\'ll "consider it". They won\'t.'; } }] },
  { id: 'ag_honour', pool: 'age', once: 1, need: () => myAge() >= 60 && ME().standing >= 55, title: 'An honorary award', text: () => `The academy is giving you an honorary award for your life's work. A short film of your career, a standing ovation, and a speech you've half-written in your head for forty years.`,
    opts: [
      { k: 'speech', label: () => 'Give the speech you always meant to', check: ['cha', 12], go: (c, ok) => { const cer = (typeof CEREMONY !== 'undefined' && CEREMONY[(HUBS[S.me.hub] || {}).m || 'US']) || ['the academy']; ME().awards.push(`${cer[0]}: Honorary Award ${S.year}`); lateFx({ stand: 3, fame: 6, mile: `An honorary award for a life's work (${cer[0]})`, mileKind: 'prize' }); return ok ? 'You thank the people nobody thanks: the drivers, the caterers, the assistants. The room stands again.' : 'You forget half of it and say the other half twice. Nobody minds; it\'s your night.'; } },
      { k: 'short', label: () => 'Keep it to one sentence', go: c => { const cer = (typeof CEREMONY !== 'undefined' && CEREMONY[(HUBS[S.me.hub] || {}).m || 'US']) || ['the academy']; ME().awards.push(`${cer[0]}: Honorary Award ${S.year}`); lateFx({ stand: 3, fame: 5, mile: `An honorary award for a life's work (${cer[0]})`, mileKind: 'prize' }); return 'One sentence, and the biggest laugh of the night.'; } }] },
  { id: 'ag_torch', pool: 'age', cool: 104, need: () => myAge() >= 58, mk: c => { c.who = lateWho('young'); }, needC: c => c.who !== null, title: 'Passing the torch', text: c => `${lname(c.who)} grew up on your work. Now they've been offered the job everyone assumed would be yours, and they ask if you mind.`,
    opts: [
      { k: 'bless', label: () => 'Give them your blessing, and your number', go: c => { c.tag = 'Your successor'; lateFx({ tie: 14, stand: .5, stress: -4 }, c); return 'They call you the night before the first day, terrified. You tell them what nobody told you.'; } },
      { k: 'compete', label: () => 'Tell them you\'re not finished yet', check: ['eth', 14], go: (c, ok) => { lateFx(ok ? { stand: 1, stress: 6 } : { tie: -6, stress: 8 }, c); return ok ? 'You prove it. Your next job is the best of your career, and they come to the premiere.' : 'You aren\'t finished, but the business thinks you are. It stings.'; } }] },
  { id: 'ag_crew', pool: 'age', once: 1, need: () => S.me && (S.week - S.me.startW) >= 52 * 15, title: 'The old crew', text: () => 'Someone has organised a reunion of the people you started with. Half of them are still in the business. Two of them aren\'t with us any more.',
    opts: [
      { k: 'go', label: () => 'Go, and stay late', go: c => { for (const id of Object.keys(S.me.known).map(Number).filter(id => !P(id).dead && S.me.known[id].met < S.me.startW + 104).slice(0, 8)) addTie(ME(), P(id), 5); lateFx({ stress: -10 }); return 'You tell the same stories, and they get better. Someone has kept the call sheet from your first day.'; } },
      { k: 'send', label: () => 'Send a long letter instead', go: c => 'They read it out. You hear that people cried. You did too, writing it.' }] },
  { id: 'ag_restored', pool: 'age', once: 1, need: () => ME().credits.length >= 3 && S.year - yearOf(S.films[ME().credits[0]].rel || S.week) >= 20, mk: c => { c.film = ME().credits[0]; }, title: 'Your first film, restored', text: c => `${S.films[c.film].title}, your first credit, has been restored and is playing at a festival. They want you to introduce it.`,
    opts: [
      { k: 'yes', label: () => 'Introduce it, honestly', check: ['com', 11], go: (c, ok) => { lateFx({ fame: 2, stand: .5, stress: -6 }); return ok ? 'You tell them what went wrong on the shoot and why it doesn\'t matter now. Then you watch your young self\'s work in the dark.' : 'You get emotional at the microphone and have to stop. They applaud anyway.'; } },
      { k: 'watch', label: () => 'Buy a ticket and sit at the back', go: c => { lateFx({ stress: -8 }); return 'Nobody recognises you. A student in front of you laughs at the joke you were proudest of.'; } }] }
);
for (const t of LATE) LATE_BY[t.id] = t;
function ageMorning() { const W = S.me && S.me.wk; if (W && W.day === 3 && myAge() >= 55 && prnd() < .07) lateOffer('age'); }

// ---- the legacy: what a life in film adds up to ----
function legacyOf(pid) {
  const p = P(pid), M = S.me && S.me.id === pid ? S.me : null;
  const credits = p.credits.map(i => S.films[i]).filter(Boolean), aw = (p.awards || []).length;
  const best = credits.slice().sort((a, b) => (b.reviews || 0) - (a.reviews || 0))[0], big = credits.slice().sort((a, b) => (b.total || 0) - (a.total || 0))[0];
  const shows = M ? (M.shows || []).length : 0, backed = M ? Object.keys(M.lateSeen || {}).filter(k => /^lg_(debut|fund|scholar|restore|doc)/.test(k)).length : 0;
  const parts = [['Credits', Math.min(30, credits.length * 1.5)], ['Prizes', Math.min(25, aw * 4)], ['Standing', p.standing * .2], ['Fame', (p.fame || 0) * .1], ['Television', Math.min(10, shows * 4)], ['Giving back', Math.min(10, backed * 2.5)]];
  const score = Math.round(parts.reduce((s, x) => s + x[1], 0));
  const title = score >= 80 ? 'A legend of the business' : score >= 60 ? 'One of the greats' : score >= 40 ? 'A name people knew' : score >= 22 ? 'A working life in film' : score >= 10 ? 'A few good years' : 'A footnote, and a story to tell';
  return { score, title, parts, credits, aw, best, big, shows };
}
function legacyPanel() {
  const M = S.me, me = ME(), age = myAge(), yrs = Math.max(0, Math.round((S.week - M.startW) / 52)), L = legacyOf(me.id);
  return `<section class="panel"><h3>The long arc</h3><p>You're ${age}, ${yrs ? `${yrs} year${yrs > 1 ? 's' : ''} into this` : 'just starting out'}.${age >= 50 ? ' Your body asks for a little more rest every year now.' : ''} If it all ended today, the trades would call it <b>${esc(L.title.toLowerCase())}</b> (legacy ${L.score}).</p>
   <p class="small muted">${L.parts.map(([k, v]) => `${k} ${Math.round(v)}`).join(' · ')}</p>
   ${UI.retireAsk ? `<p><b>Retire for good?</b> Your career ends here and the game writes your epilogue. You can then play someone new in this same world. <button class="btn-s" data-retire="2">Yes, retire</button> <button class="btn-s ghost" data-retire="0">Not yet</button></p>` : `<p><button class="btn-s ghost" data-retire="1">Retire…</button></p>`}</section>`;
}
// The epilogue: a life in film, written up like a career retrospective.
function epilogueHTML() {
  const M = S.me, me = ME(), L = legacyOf(me.id), yrs = Math.max(1, Math.round((S.week - M.startW) / 52)), first = me.name.split(' ')[0];
  const friends = Object.keys(M.known).map(Number).filter(id => P(id)).sort((a, b) => opinion(b) - opinion(a)).slice(0, 5);
  const ms = (M.milestones || []).filter(m => ['credit', 'prize', 'film', 'work', 'level'].includes(m.kind)).slice(-8);
  const lines = [`${me.name} arrived in ${hubName(M.hub)} in ${yearOf(M.startW)} and worked in the business for ${yrs} year${yrs > 1 ? 's' : ''}.`,
    L.credits.length ? `${first} earned ${L.credits.length} screen credit${L.credits.length > 1 ? 's' : ''}${L.best ? `, the best of them ${L.best.title}` : ''}${L.big && L.big !== L.best ? `, the biggest ${L.big.title}` : ''}.` : `${first} never got a screen credit, which is the business for most people, and no measure of a life.`,
    L.aw ? `${L.aw} prize${L.aw > 1 ? 's' : ''} sit on a shelf somewhere${L.aw >= 3 ? ', dusted more often than anyone admits' : ''}.` : '',
    L.shows ? `On television, ${first} created ${L.shows} series.` : '',
    friends.length ? `The people who mattered most: ${friends.map(id => P(id).name).join(', ')}.` : ''].filter(Boolean);
  return `<section class="panel epilogue"><p class="eyebrow">Epilogue · ${S.year}</p><h2>${esc(me.name)}: ${esc(L.title.toLowerCase())}</h2>
   ${lines.map(t => `<p>${esc(t)}</p>`).join('')}
   <p class="small muted">Legacy ${L.score}: ${L.parts.map(([k, v]) => `${k} ${Math.round(v)}`).join(' · ')}</p>
   ${ms.length ? `<h4>The moments</h4><ul class="plain small">${ms.map(m => `<li>${fmtDate(m.w, true)}: ${linkPrizes(esc(m.t))}</li>`).join('')}</ul>` : ''}
   ${friends.length ? `<p class="small">${friends.map(id => pl(id)).join(' · ')}</p>` : ''}
   <p><button class="btn primary" data-nextgen="1">Play the next generation in this world</button> <button class="btn ghost" data-startover="1">Start a new world</button></p>
   <p class="muted small">The next generation starts fresh in this same world, where ${esc(first)} is now one of the names: on the archive pages, in the history, and as someone the newcomer can meet.</p></section>`;
}
function retireAct() {
  const M = S.me, me = ME(); if (!M || M.over) return false;
  M.over = true; me.retired = true; me.retY = S.year; M.retiredBy = 'choice';
  milestone(`Retired after ${Math.max(1, Math.round((S.week - M.startW) / 52))} years in the business`, 'life');
  news('People', `${me.name} retires. "${pickLine(['It was the best job in the world, and I never once knew what I was doing.', 'Time to watch films instead of making them.', 'Someone else\'s turn. Be kind to the crew.'], S.week)}"`, { person: me.id });
  return true;
}
// The next generation: your old self becomes one of the world's people, and the creator opens again.
function nextGenAct() {
  const M = S.me; if (!M || !M.over) return false;
  const me = ME(), L = legacyOf(me.id);
  (S.legacy = S.legacy || []).push({ id: me.id, name: me.name, from: yearOf(M.startW), to: S.year, score: L.score, title: L.title });
  me.player = false; me.retired = true; me.wasPlayer = 1;
  S.me = null;
  return true;
}
// a newcomer can know their predecessor: the most recent one alive becomes a contact who's heard of you
function legacyGreet() {
  const L = S.legacy || [], last = L[L.length - 1]; if (!last || !S.me) return;
  const p = P(last.id); if (!p || p.dead) return;
  meet(p.id, 'A legend you were told to look up', 12); trust(p.id, 10);
  sms(p.id, pickLine(['heard you\'re new in town. come for coffee, I\'ll tell you everything I got wrong', 'someone told me you remind them of me. I\'m sorry. let\'s have lunch'], S.week), 'tip');
}
