// ---------------- The Make suite ----------------
// Every Make app is a workshop you can start in, not a door to the Create page. The Scriptwriter has the desk, the
// story (logline workshop and beat board), characters, scene cards, your own pages in screenplay format, a daily
// punch-up and the coverage; what you build there lifts the draft. Saved work is game state, so it survives reloads
// and replays: every change that matters is an action.

// ---- Scriptwriter ----
const SW_TABS = [['desk', '🗂️ Desk'], ['story', '🧭 Story'], ['chars', '🧍 Characters'], ['scenes', '🎬 Scenes'], ['pages', '📄 Pages'], ['punch', '🥊 Punch-up'], ['notes', '📝 Coverage']];
const CH_ROLES = ['Protagonist', 'Antagonist', 'Love interest', 'Mentor', 'Ally', 'Rival', 'Trickster', 'Wildcard'];
const SC_PURPOSE = { setup: 'Set-up', reveal: 'Reveal', conflict: 'Conflict', turn: 'Turn', payoff: 'Payoff', breather: 'Breather' };
const CLIP = (v, n) => String(v || '').replace(/\r/g, '').slice(0, n);
// what makes a logline work: someone specific, wanting something, against something, with a twist of irony
function loglineChecks(t) {
  const s = String(t || ''), w = s.split(/\s+/).filter(Boolean).length;
  return [
    ['A specific hero', /\b(a|an|the)\s+([a-z-]+\s+){0,3}(who|whose|with|named)\b|\b[a-z]+-[a-z]+\b|\b(ageing|aging|retired|young|disgraced|failed|lonely|grieving|reluctant|former|rookie|widowed)\b/i.test(s)],
    ['Something they want', /\b(wants?|must|needs?|tries|trying|sets out|has to|determined|desperate|hopes?|plans?|races?|fights?)\b/i.test(s)],
    ['Something in the way', /\b(but|until|before|when|while|against|despite|only to|unless|except)\b/i.test(s)],
    ['A hook or irony', /\b(only|last|first|secretly|own|wrong|impossible|accidentally|discovers?|learns?|realises?|realizes?)\b/i.test(s)],
    ['Tight (15–45 words)', w >= 15 && w <= 45]
  ];
}
function charDepth(c) { return ['want', 'need', 'flaw', 'secret'].filter(k => String(c[k] || '').trim().length >= 6).length; }
// screenplay markup: sluglines, character cues, parentheticals, dialogue, action, transitions
function fountain(text) {
  const out = []; let afterCue = false;
  for (const raw of String(text || '').split('\n')) {
    const l = raw.trim();
    if (!l) { afterCue = false; out.push('<div class="fp-gap"></div>'); continue; }
    if (/^(INT\.|EXT\.|INT\/EXT|I\/E)/i.test(l)) { afterCue = false; out.push(`<div class="fp-slug">${esc(l.toUpperCase())}</div>`); continue; }
    if (/^[A-Z][A-Z .'\-]{1,30}(\s\((V\.O\.|O\.S\.|CONT'D)\))?$/.test(l) && !/TO:$/.test(l)) { afterCue = true; out.push(`<div class="fp-cue">${esc(l)}</div>`); continue; }
    if (/TO:$/.test(l) || /^FADE (IN|OUT)/.test(l)) { afterCue = false; out.push(`<div class="fp-tr">${esc(l)}</div>`); continue; }
    if (afterCue && /^\(.*\)$/.test(l)) { out.push(`<div class="fp-par">${esc(l)}</div>`); continue; }
    if (afterCue) { out.push(`<div class="fp-dia">${esc(l)}</div>`); continue; }
    out.push(`<div class="fp-act">${esc(l)}</div>`);
  }
  return out.join('');
}
function pageStats(text) {
  const L = String(text || '').split('\n').map(x => x.trim()).filter(Boolean); let cues = 0, dia = 0, act = 0, slug = 0, after = false; const lines = [];
  for (const l of L) { if (/^(INT\.|EXT\.|INT\/EXT|I\/E)/i.test(l)) { slug++; after = false; } else if (/^[A-Z][A-Z .'\-]{1,30}(\s\(.*\))?$/.test(l)) { cues++; after = true; } else if (after && !/^\(.*\)$/.test(l)) { dia++; lines.push(l); } else { act++; after = false; } }
  const words = String(text || '').split(/\s+/).filter(Boolean).length;
  return { words, pages: Math.round(words / 180 * 10) / 10, slug, cues, dia, act, best: lines.filter(x => x.length > 12 && x.length < 110).sort((a, b) => (b.match(/[?!—…]/g) || []).length - (a.match(/[?!—…]/g) || []).length || b.length - a.length)[0] || '' };
}
// ---- actions ----
function scriptOf(id) { return (S.me.scripts || []).find(x => x.id === +id); }
function swEditAct(a) {
  const M = S.me, sc = scriptOf(a.id); if (!sc) return false;
  const day = S.week * 7 + (M.wk ? M.wk.day : 0);
  if (a.f === 'logline') {
    const t = CLIP(a.v, 400).replace(/\s+/g, ' ').trim(); if (!t) return false; sc.logline = t; sc.premise = t;
    const ok = loglineChecks(t).filter(x => x[1]).length;
    if (ok >= 4 && sc.logOk !== sc.draft) { sc.logOk = sc.draft; sc.prep = Math.min(7, (sc.prep || 0) + .6); diary(`You sharpen the logline for ${sc.title} until it sells itself.`); }
    return true;
  }
  if (a.f === 'title') { const t = CLIP(a.v, 60).replace(/\s+/g, ' ').trim(); if (!t || sc.made !== undefined) return false; sc.title = t; return true; }
  if (a.f === 'char') {
    sc.chars = sc.chars || [];
    if (a.op === 'del') { sc.chars.splice(+a.i, 1); return true; }
    const c = { name: CLIP(a.c && a.c.name, 40).trim() || 'Unnamed', role: CH_ROLES.includes(a.c && a.c.role) ? a.c.role : 'Ally', want: CLIP(a.c && a.c.want, 160), need: CLIP(a.c && a.c.need, 160), flaw: CLIP(a.c && a.c.flaw, 160), secret: CLIP(a.c && a.c.secret, 160) };
    if (a.op === 'add') { if (sc.chars.length >= 10) return false; sc.chars.push(c); } else if (a.op === 'set' && sc.chars[+a.i]) sc.chars[+a.i] = Object.assign(sc.chars[+a.i], c); else return false;
    sc.charBonus = sc.charBonus || {};
    sc.chars.forEach((x, i) => { if (charDepth(x) >= 4 && !sc.charBonus[x.name]) { sc.charBonus[x.name] = 1; if (Object.keys(sc.charBonus).length <= 4) { sc.prep = Math.min(7, (sc.prep || 0) + .35); growSub(ME(), 'char', .01); } } });
    return true;
  }
  if (a.f === 'scene') {
    sc.scenes = sc.scenes || [];
    if (a.op === 'del') { sc.scenes.splice(+a.i, 1); return true; }
    if (a.op === 'up' || a.op === 'down') { const i = +a.i, j = a.op === 'up' ? i - 1 : i + 1; if (!sc.scenes[i] || !sc.scenes[j]) return false; [sc.scenes[i], sc.scenes[j]] = [sc.scenes[j], sc.scenes[i]]; return true; }
    const s = { ie: ['INT.', 'EXT.', 'INT./EXT.'].includes(a.s && a.s.ie) ? a.s.ie : 'INT.', where: CLIP(a.s && a.s.where, 50).toUpperCase() || 'SOMEWHERE', when: ['DAY', 'NIGHT', 'DAWN', 'DUSK', 'CONTINUOUS'].includes(a.s && a.s.when) ? a.s.when : 'DAY', beat: Math.max(0, Math.min(7, +(a.s && a.s.beat) || 0)), purpose: SC_PURPOSE[a.s && a.s.purpose] ? a.s.purpose : 'conflict', what: CLIP(a.s && a.s.what, 300) };
    if (a.op === 'add') { if (sc.scenes.length >= 60) return false; sc.scenes.push(s); } else if (a.op === 'set' && sc.scenes[+a.i]) sc.scenes[+a.i] = s; else return false;
    const covered = new Set(sc.scenes.map(x => x.beat)).size;
    if (covered >= 8 && sc.sceneOk !== sc.draft) { sc.sceneOk = sc.draft; sc.prep = Math.min(7, (sc.prep || 0) + 1); growSub(ME(), 'struc', .015); diary(`Every beat of ${sc.title} has a scene now. You can see the whole film.`); }
    return true;
  }
  if (a.f === 'pages') {
    const text = CLIP(a.v, 40000), st = pageStats(text); sc.text = text;
    if (sc.stage !== 'writing') return true;
    // your own pages count: a page for every 180 words you add, up to three pages a day
    const was = sc.ownW || 0, add = Math.max(0, st.words - was), me = ME();
    M.ownD = M.ownD === day ? day : (M.ownN = 0, day);
    const n = Math.min(3 - (M.ownN || 0), Math.floor(add / 180));
    if (n > 0) {
      M.ownN = (M.ownN || 0) + n; sc.ownW = was + n * 180;
      const skill = avg(['struc', 'dial', 'char', 'orig'].map(k => me.sk[k])), craft = (st.slug ? .5 : 0) + (st.cues >= 3 ? .5 : 0) + (st.dia >= 4 && st.act >= 2 ? .5 : 0);
      sc.pages = Math.min(sc.target, sc.pages + n); sc.sessions++; sc.q += (skill + (sc.prep || 0) * .5 + craft) * n;
      for (const k of ['dial', 'struc']) growSub(me, k, .006 * n);
      diary(`You write ${n} page${n > 1 ? 's' : ''} of ${sc.title} yourself, line by line.`);
      if (sc.pages >= sc.target) { const L = []; finishDraft(sc, L); L.forEach(t => diary(t)); }
    }
    return true;
  }
  return false;
}
// the daily punch-up: three ways to land the last line of a flat exchange
const PU_SET = [
  { a: 'I can\'t do this anymore.', b: 'Then don\'t.', opts: [['I mean it. I really can\'t do this anymore, and it hurts.', 'nose'], ['(she keeps folding the shirt) It still smells like him.', 'sub'], ['Great. More laundry for me.', 'joke']] },
  { a: 'Are you scared?', b: 'Should I be?', opts: [['Yes. You should be very scared of what\'s coming.', 'nose'], ['They locked the doors from the outside.', 'sub'], ['Only of my cooking.', 'joke']] },
  { a: 'You came back.', b: 'I forgot my keys.', opts: [['That\'s a lie. You came back because you love me.', 'nose'], ['You don\'t have keys. You never did.', 'sub'], ['Classic you. Which keys?', 'joke']] },
  { a: 'We\'re going to lose.', b: 'Probably.', opts: [['But we have to try, because it\'s the right thing.', 'nose'], ['(he laces his boots) Probably isn\'t certainly.', 'sub'], ['Can we at least lose before lunch?', 'joke']] },
  { a: 'Tell me the truth.', b: 'Which one?', opts: [['The truth about what happened that night with my father.', 'nose'], ['The one you buried in the garden.', 'sub'], ['Start with the cheapest.', 'joke']] },
  { a: 'Is it safe?', b: 'It\'s fine.', opts: [['No, it isn\'t safe at all, and I\'m lying to you.', 'nose'], ['(the floor creaks under her) Mostly fine.', 'sub'], ['Define safe. Then define fine.', 'joke']] },
  { a: 'Why did you lie?', b: 'You wouldn\'t have stayed.', opts: [['I lied because I was afraid you would leave me.', 'nose'], ['I packed your bag the day we met.', 'sub'], ['To be fair, you also lied about the cat.', 'joke']] },
  { a: 'You look tired.', b: 'I\'m fine.', opts: [['I\'m exhausted because I haven\'t slept since the accident.', 'nose'], ['I counted the ceiling tiles again. Two hundred and twelve.', 'sub'], ['This is my face. I was born tired.', 'joke']] }
];
function punchOf(sc) { const r = hashRand(sc.id * 997 + S.week * 7 + (S.me.wk ? S.me.wk.day : 0)), P0 = PU_SET[Math.floor(r() * PU_SET.length)], order = [0, 1, 2].sort(() => r() - .5); return { P: P0, order }; }
function punchBest(sc) { const funny = ['Comedy', 'Animation', 'Musical'].includes(sc.genre) || sc.tone === 'light' || sc.tone === 'absurd'; return funny ? 'joke' : 'sub'; }
function punchAct(a) {
  const M = S.me, sc = scriptOf(a.id), day = S.week * 7 + (M.wk ? M.wk.day : 0); if (!sc || sc.stage !== 'writing' || M.punchD === day) return false;
  const { P: P0 } = punchOf(sc), o = P0.opts[+a.pick]; if (!o) return false;
  M.punchD = day; const best = punchBest(sc), me = ME(), good = o[1] === best, ok = o[1] !== 'nose';
  sc.q += good ? 4 + skillOf(me, 'dial') * .4 : ok ? 1 : -3; growSub(me, 'dial', good ? .02 : .008);
  (sc.lines = sc.lines || []).push(o[0]); if (sc.lines.length > 12) sc.lines.shift();
  M.lastPunch = { w: day, good, kind: o[1], best };
  return true;
}
// ---- the app ----
function swDesk(M) { return typeof writingDesk === 'function' ? writingDesk() : ''; }
function swStory(sc) {
  const chk = loglineChecks(UI.swlog !== undefined && UI.swlogId === sc.id ? UI.swlog : sc.logline), cards = beatCards(sc), pick = UI.beats && UI.beats.id === sc.id && UI.beats.d === sc.draft ? UI.beats.p : (UI.beats = { id: sc.id, d: sc.draft, p: BEAT_SLOTS.map(() => '') }).p;
  return `<h5>Logline workshop</h5><p class="small muted">One sentence that sells the film: a specific hero, what they want, what stands in the way, and the twist that makes it yours. Four of five and the draft gets a lift.</p>
   <textarea id="sw-log" rows="3" maxlength="400" data-swlog="${sc.id}">${esc(UI.swlogId === sc.id && UI.swlog !== undefined ? UI.swlog : sc.logline || '')}</textarea>
   <div class="sw-checks">${chk.map(([l, ok]) => `<span class="${ok ? 'good' : 'muted'}">${ok ? '✔' : '○'} ${l}</span>`).join('')}</div>
   <p><button class="btn-s" data-swsave="logline:${sc.id}">Save logline</button>${sc.logOk === sc.draft ? ' <span class="chip good">logline bonus earned</span>' : ''}</p>
   <h5>Beat board ${sc.outlined === sc.draft ? '<span class="chip good">outline locked</span>' : ''}</h5>
   ${sc.outlined === sc.draft ? `<ol class="small">${(sc.outline || []).map((ci, i) => `<li><b>${BEAT_SLOTS[i][0]}</b>: ${esc((cards.find(c => c.i === ci) || {}).t || '')}</li>`).join('')}</ol>` : `<p class="small muted">Put a scene card on each beat. Two cards don't belong anywhere. A good outline makes every page after it better (and rolls your Structure).</p>
    <div class="sw-beats">${BEAT_SLOTS.map(([l], i) => `<label><span>${l}</span>${sel('sw-beat-' + i, [['', 'Choose a scene…'], ...cards.map(c => [String(c.i), c.t])], String(pick[i]))}</label>`).join('')}</div>
    <button class="btn-s" data-swoutline="${sc.id}" ${pick.some(x => x === '') ? 'disabled' : ''}>Lock the outline</button>`}`;
}
function swChars(sc) {
  const L = sc.chars || [], E = UI.swch || {};
  const form = (c, i) => `<div class="sw-cform"><div class="sw-cf2"><label>Name<input id="ch-name" maxlength="40" value="${esc(c.name || '')}"></label><label>Role${sel('ch-role', CH_ROLES.map(r => [r, r]), c.role || 'Protagonist')}</label></div>
    <label>Wants <span class="muted small">(the goal they chase out loud)</span><input id="ch-want" maxlength="160" value="${esc(c.want || '')}"></label><label>Needs <span class="muted small">(what would actually fix them)</span><input id="ch-need" maxlength="160" value="${esc(c.need || '')}"></label>
    <label>Flaw<input id="ch-flaw" maxlength="160" value="${esc(c.flaw || '')}"></label><label>Secret<input id="ch-secret" maxlength="160" value="${esc(c.secret || '')}"></label>
    <p><button class="btn-s" data-swchar="${i === undefined ? 'add' : 'set:' + i}:${sc.id}">${i === undefined ? 'Add character' : 'Save'}</button>${i !== undefined ? ` <button class="linkish" data-swchopen="">Cancel</button>` : ''}</p></div>`;
  return `<p class="small muted">Drawn characters write themselves. Give each a want, a need that's different, a flaw and a secret: every fully drawn character (up to four) lifts the draft and your Character craft.</p>
   <div class="sw-chars">${L.map((c, i) => E.i === i ? form(c, i) : `<article class="sw-char"><header><b>${esc(c.name)}</b><span class="chip">${esc(c.role)}</span><span class="sw-depth" title="How fully drawn">${'●'.repeat(charDepth(c))}${'○'.repeat(4 - charDepth(c))}</span></header>
     ${c.want ? `<p class="small"><b>Wants</b> ${esc(c.want)}</p>` : ''}${c.need ? `<p class="small"><b>Needs</b> ${esc(c.need)}</p>` : ''}${c.flaw ? `<p class="small"><b>Flaw</b> ${esc(c.flaw)}</p>` : ''}${c.secret ? `<p class="small"><b>Secret</b> ${esc(c.secret)}</p>` : ''}
     ${c.want && c.need && c.want.trim().toLowerCase() === c.need.trim().toLowerCase() ? '<p class="small bad">Their want and need are the same: there\'s no arc.</p>' : ''}
     <p><button class="linkish" data-swchopen="${i}">Edit</button> · <button class="linkish" data-swchar="del:${i}:${sc.id}">Delete</button></p></article>`).join('')}</div>
   ${L.length < 10 && E.i === undefined ? `<h5>New character</h5>${form({ role: L.length ? 'Ally' : 'Protagonist' })}` : ''}`;
}
function swScenes(sc) {
  const L = sc.scenes || [], cov = new Set(L.map(x => x.beat)), br = L.filter(x => x.purpose === 'breather').length;
  return `<p class="small muted">Scene cards, in order. Tie each to a beat; once every beat has a scene, the draft gets a structure bonus.</p>
   <div class="sw-cov">${BEAT_SLOTS.map(([l], i) => `<span class="${cov.has(i) ? 'good' : 'muted'}">${cov.has(i) ? '■' : '□'} ${l}</span>`).join('')}</div>
   ${L.length > 6 && br / L.length > .3 ? '<p class="small bad">Too many breathers: the film stops moving.</p>' : ''}
   <ol class="sw-scenes">${L.map((s, i) => `<li><div><b>${esc(s.ie)} ${esc(s.where)} – ${esc(s.when)}</b> <span class="chip">${esc(BEAT_SLOTS[s.beat][0])}</span> <span class="chip">${esc(SC_PURPOSE[s.purpose])}</span><p class="small">${esc(s.what)}</p></div><span class="sw-sact"><button class="linkish" data-swscene="up:${i}:${sc.id}" ${i === 0 ? 'disabled' : ''}>↑</button><button class="linkish" data-swscene="down:${i}:${sc.id}" ${i === L.length - 1 ? 'disabled' : ''}>↓</button><button class="linkish" data-swscene="del:${i}:${sc.id}">✕</button></span></li>`).join('')}</ol>
   ${L.length < 60 ? `<h5>New scene</h5><div class="sw-sform">${sel('sn-ie', [['INT.', 'INT.'], ['EXT.', 'EXT.'], ['INT./EXT.', 'INT./EXT.']], 'INT.')}<input id="sn-where" maxlength="50" placeholder="LOCATION"> ${sel('sn-when', ['DAY', 'NIGHT', 'DAWN', 'DUSK', 'CONTINUOUS'].map(x => [x, x]), 'DAY')} ${sel('sn-beat', BEAT_SLOTS.map(([l], i) => [String(i), l]), String(Math.min(7, cov.size)))} ${sel('sn-purpose', Object.entries(SC_PURPOSE), 'conflict')}
    <textarea id="sn-what" rows="2" maxlength="300" placeholder="What happens, and what changes by the end of it"></textarea><button class="btn-s" data-swscene="add:0:${sc.id}">Add scene</button></div>` : ''}`;
}
function swPages(sc) {
  const t = UI.swpgId === sc.id && UI.swpg !== undefined ? UI.swpg : sc.text || '', st = pageStats(t), M = S.me, today = S.week * 7 + (M.wk ? M.wk.day : 0), left = 3 - (M.ownD === today ? M.ownN || 0 : 0), pend = Math.max(0, st.words - (sc.ownW || 0));
  return `<p class="small muted">Write it yourself. Sluglines start INT. or EXT.; a name in CAPITALS on its own line is a character, the lines under it their dialogue; (parentheses) are directions. Every 180 new words count as a page of the draft, up to three pages a day, weighted by your craft.</p>
   <div class="sw-ed"><textarea id="sw-pages" data-swpg="${sc.id}" rows="18" spellcheck="true" placeholder="INT. DINER – NIGHT&#10;&#10;Rain on the windows. MARA (40s) counts coins.&#10;&#10;MARA&#10;(not looking up)&#10;You're late.">${esc(t)}</textarea><div class="sw-fp">${fountain(t) || '<p class="muted">Your pages appear here, formatted.</p>'}</div></div>
   <p class="small">${st.words.toLocaleString()} words · about ${st.pages} pages · ${st.slug} scenes · ${st.cues} speeches${pend ? ` · ${pend} words not yet counted` : ''} · ${left > 0 ? `${left} page${left > 1 ? 's' : ''} left to count today` : 'today\'s pages counted'}</p>
   <p><button class="btn-s" data-swsave="pages:${sc.id}">Save pages</button>${st.best ? ` <span class="muted small">Your best line so far: <q>${esc(st.best)}</q></span>` : ''}</p>`;
}
function swPunch(sc) {
  const M = S.me, day = S.week * 7 + (M.wk ? M.wk.day : 0), { P: P0, order } = punchOf(sc), done = M.punchD === day, lp = M.lastPunch && M.lastPunch.w === day ? M.lastPunch : null;
  return `<p class="small muted">A flat exchange from your draft. Pick the last line that does the most work. One punch-up a day.</p>
   <div class="pu"><p><b>A:</b> ${esc(P0.a)}</p><p><b>B:</b> ${esc(P0.b)}</p><p><b>A:</b> …</p></div>
   <div class="pu-opts">${order.map(i => `<button class="choice" data-swpunch="${i}:${sc.id}" ${done ? 'disabled' : ''}><b>${esc(P0.opts[i][0])}</b></button>`).join('')}</div>
   ${lp ? `<p class="${lp.good ? 'good' : lp.kind === 'nose' ? 'bad' : ''}">${lp.good ? 'That\'s the one: it says it without saying it.' : lp.kind === 'nose' ? 'On the nose: the character says exactly what they feel, and the scene goes flat.' : 'Not bad, but not the best line for this ' + (lp.best === 'joke' ? 'comedy: it wanted the laugh.' : 'story: it wanted the subtext.')}</p>` : ''}
   ${(sc.lines || []).length ? `<h5>Lines you've kept</h5><ul class="plain small">${sc.lines.slice().reverse().map(l => `<li><q>${esc(l)}</q></li>`).join('')}</ul>` : ''}`;
}
function swCoverage(sc, done) {
  const st = pageStats(sc.text), chars = (sc.chars || []).filter(c => charDepth(c) >= 3).length, cov = new Set((sc.scenes || []).map(x => x.beat)).size;
  const more = [['Logline', sc.logOk === sc.draft ? 'Sells itself.' : 'Doesn\'t yet say who wants what, and what\'s in the way.'], ['Characters', chars >= 3 ? `${chars} fully drawn: a cast actors will want.` : chars ? 'One or two real people; the rest are functions.' : 'Nobody here is drawn yet.'], ['Scene plan', cov >= 8 ? 'Every beat has a scene.' : `${cov} of 8 beats have scenes.`], ['Your pages', st.words ? `${st.words.toLocaleString()} words of your own.${st.best ? ` Best line: “${st.best}”` : ''}` : 'Nothing written by hand yet.']];
  return `<h5>Reader's notes on the draft in progress</h5><ul class="plain small">${coverageOf(sc).concat(more).map(([k, v]) => `<li><b>${k}:</b> ${esc(v)}</li>`).join('')}</ul>
   ${done.length ? `<h5>Coverage on finished scripts</h5>${done.map(x => `<details class="sw-cov2"><summary><b>${esc(x.title)}</b> <span class="grade g${x.grade}">${x.grade}</span> <span class="muted small">${x.score}/100 · draft ${x.draft}</span></summary><ul class="plain small">${coverageOf(x).map(([k, v]) => `<li><b>${k}:</b> ${esc(v)}</li>`).join('')}</ul></details>`).join('')}` : ''}`;
}
function scriptwriterApp() {
  const M = S.me, L = M.scripts || [], sc = activeScript(), done = L.filter(x => x.grade).slice(-6).reverse(), today = M.sessD === S.week * 7 + (M.wk ? M.wk.day : 0);
  let t = UI.swt || (sc ? 'story' : 'desk'); if (!sc && t !== 'desk' && t !== 'notes') t = 'desk';
  const head = sc ? (() => { const pct = Math.round(sc.pages / Math.max(1, sc.target) * 100), perPage = sc.pages ? sc.q / sc.pages : 0, proj = clamp(Math.round(38 + (perPage - 6) * 5 + (sc.draft - 1) * 7), 5, 98);
    return `<div class="sw-page"><div class="sw-hd"><div><p class="sw-title">${esc(sc.title.toUpperCase())}</p><p class="muted small">${esc(sc.genre)} · ${esc(THEMES[sc.theme] || '')} · ${esc(TONES[sc.tone] || '')} · draft ${sc.draft}</p></div>${L.filter(x => x.stage === 'writing').length > 1 ? `<span>${sel('sw-active', L.filter(x => x.stage === 'writing').map(x => [String(x.id), x.title]), String(sc.id))}</span>` : ''}</div>
      <div class="sw-prog"><i style="width:${pct}%"></i></div><p class="small">${sc.pages} of ${sc.target} pages · ${sc.sessions} sessions · heading for <b>${gradeOf(proj)}</b> on what's written so far${sc.prep ? ` · preparation bonus +${(+sc.prep).toFixed(1)}` : ''}</p>
      <div class="bf-row">${Object.entries(WRITE_FOCUS).map(([k, F]) => `<button class="btn-s ghost" data-swsess="${k}" ${today ? 'disabled' : ''} title="${esc(F[1])}">${F[0]}</button>`).join('')}<span class="muted small">${today ? 'Session done today.' : 'One quick session a day, on top of your diary\'s writing blocks.'}</span></div></div>`; })() : '';
  const body = t === 'desk' ? swDesk(M) : t === 'story' ? swStory(sc) : t === 'chars' ? swChars(sc) : t === 'scenes' ? swScenes(sc) : t === 'pages' ? swPages(sc) : t === 'punch' ? swPunch(sc) : sc ? swCoverage(sc, done) : (done.length ? swCoverage({ id: 0, text: '', chars: [], scenes: [] }, done) : '<p class="muted">Finish a draft to get coverage.</p>');
  return `<div class="swapp">${head}<div class="np-tabs sw-tabs">${SW_TABS.filter(([k]) => sc || k === 'desk' || k === 'notes').map(([k, l]) => `<button class="${t === k ? 'on' : ''}" data-swt="${k}">${l}</button>`).join('')}</div>${body}</div>`;
}
function make2Click(t) {
  if (!S.me || !careerActive()) return false;
  const d = t.dataset;
  if (d.swt) { UI.swt = d.swt; render(true); return true; }
  if (d.swsave) { const [f, id] = d.swsave.split(':'); const el = document.getElementById(f === 'logline' ? 'sw-log' : 'sw-pages'); doAct({ t: 'swedit', id: +id, f, v: el ? el.value : '' }); if (f === 'logline') UI.swlog = undefined; else UI.swpg = undefined; render(true); return true; }
  if (d.swchopen !== undefined) { UI.swch = d.swchopen === '' ? {} : { i: +d.swchopen }; render(true); return true; }
  if (d.swchar) { const [op, i, id] = d.swchar.split(':'), v = k => (document.getElementById('ch-' + k) || {}).value || ''; const [o2, i2] = op === 'set' ? ['set', i] : [op, op === 'add' ? 0 : +i];
    if (op === 'set' || op === 'add') doAct({ t: 'swedit', id: +id, f: 'char', op: o2, i: op === 'set' ? +i2 : 0, c: { name: v('name'), role: v('role'), want: v('want'), need: v('need'), flaw: v('flaw'), secret: v('secret') } });
    else doAct({ t: 'swedit', id: +id, f: 'char', op: 'del', i: +i });
    UI.swch = {}; render(true); return true; }
  if (d.swscene) { const [op, i, id] = d.swscene.split(':'), v = k => (document.getElementById('sn-' + k) || {}).value || '';
    doAct(op === 'add' ? { t: 'swedit', id: +id, f: 'scene', op: 'add', s: { ie: v('ie'), where: v('where'), when: v('when'), beat: +v('beat'), purpose: v('purpose'), what: v('what') } } : { t: 'swedit', id: +id, f: 'scene', op, i: +i }); render(true); return true; }
  if (d.swpunch) { const [i, id] = d.swpunch.split(':'); doAct({ t: 'punchup', id: +id, pick: +i }); render(true); return true; }
  return false;
}
function make2Input(e) {
  if (!S.me || !careerActive()) return false;
  const id = e.target.id;
  if (id === 'sw-log') { UI.swlog = e.target.value; UI.swlogId = +e.target.dataset.swlog; const box = document.querySelector('.sw-checks'); if (box) box.innerHTML = loglineChecks(UI.swlog).map(([l, ok]) => `<span class="${ok ? 'good' : 'muted'}">${ok ? '✔' : '○'} ${l}</span>`).join(''); return true; }
  if (id === 'sw-pages') { UI.swpg = e.target.value; UI.swpgId = +e.target.dataset.swpg; const fp = document.querySelector('.sw-fp'); if (fp) fp.innerHTML = fountain(UI.swpg); return true; }
  return false;
}
function make2Change(e) {
  if (!S.me || !careerActive()) return false;
  if (e.target.id === 'sw-active') { doAct({ t: 'activescript', id: +e.target.value }); render(true); return true; }
  return false;
}
