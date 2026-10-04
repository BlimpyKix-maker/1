// ---------------- The creative apps, as tools ----------------
// Scriptwriter: your script on the screen, a beat board to outline it (lock a good outline and every page you write
// after is better), focused writing sessions, and a reader's coverage of what you've finished.
// Studio: for music, tempo, mood, an arrangement and a mixing desk on top of the step sequencer; for podcasts, a
// guest, a running order and the edit. CutRoom: the clips for the kind of video you're making, trims, a grade, a music
// bed, captions, and the title and thumbnail, with what the edit will probably do to retention and clicks.
// Everything still lands as one session of work on the project, scored out of ten.

// ---- Scriptwriter ----
const BEAT_SLOTS = [['Opening image', 'setup'], ['Inciting incident', 'call'], ['Into act two', 'choice'], ['Fun and games', 'promise'], ['Midpoint', 'reversal'], ['All is lost', 'loss'], ['Climax', 'clash'], ['Final image', 'change']];
const CARD_TEXT = {
  setup: ['We meet {hero} in the life that\'s about to end', 'A morning ritual that tells us everything'], call: ['A stranger brings news that can\'t be ignored', 'The thing {hero} wanted most turns up, wrong'],
  choice: ['{hero} says yes, and burns a bridge doing it', 'There\'s no going back: the door locks behind them'], promise: ['The {genre} we came for: set piece after set piece', 'The fun of the premise, at full volume'],
  reversal: ['Everything {hero} believed turns out to be backwards', 'A win that costs more than a loss'], loss: ['The mentor is gone; the plan is in pieces', '{hero} alone in the rain, done'],
  clash: ['Face to face with the thing they\'ve been running from', 'One last try, with everything learned'], change: ['The opening image again, but {hero} is different', 'A quiet ending that answers the first scene'],
  filler: ['A long scene of people agreeing with each other', 'A flashback that explains what we already knew']
};
function beatCards(sc) {
  const r = hashRand((sc.id || 1) * 131 + (sc.draft || 1)), hero = sc.hero || 'the hero', g = (sc.genre || 'drama').toLowerCase(), out = [];
  for (const [, k] of BEAT_SLOTS) out.push({ k, t: CARD_TEXT[k][Math.floor(r() * 2)].replace('{hero}', hero).replace('{genre}', g) });
  out.push({ k: 'filler', t: CARD_TEXT.filler[0] }, { k: 'filler', t: CARD_TEXT.filler[1] });
  return out.map((c, i) => Object.assign(c, { i })).sort(() => r() - .5);
}
function beatScore(sc, pick) { let s = 0; const C = beatCards(sc); BEAT_SLOTS.forEach(([, want], i) => { const c = C.find(x => x.i === pick[i]); if (c && c.k === want) s++; else if (c && c.k === 'filler') s -= .5; }); return Math.max(0, s); }
function outlineAct(a) {
  const M = S.me, me = ME(), sc = (M.scripts || []).find(x => x.id === a.id && x.stage === 'writing'); if (!sc || sc.outlined === sc.draft) return false;
  const pick = (a.pick || []).map(Number), cards = beatCards(sc); if (pick.length !== BEAT_SLOTS.length || new Set(pick).size !== pick.length || pick.some(i => !cards.some(c => c.i === i))) return false;
  const s = beatScore(sc, pick), ok = roll('struc', 13 - Math.floor(s / 2));
  sc.outlined = sc.draft; sc.prep = (sc.prep || 0) + (s >= 6 ? 2 : s >= 4 ? 1 : 0) + (ok ? 1 : 0); sc.outline = pick;
  growSub(me, 'struc', .02 + s * .004);
  diary(`Outlined ${sc.title}: ${s} of ${BEAT_SLOTS.length} beats where they belong${ok ? ', and it holds together' : ', though something in the middle sags'}.`);
  return true;
}
const WRITE_FOCUS = { pages: ['📄 Push on: pages', 'More pages, less care.', null], dial: ['💬 Dialogue pass', 'Fewer pages; every line earns its place.', 'dial'], char: ['🧍 Character pass', 'Make them want something, and make it cost.', 'char'], stakes: ['🔥 Raise the stakes', 'What happens if they fail? Make it worse.', 'struc'] };
function scriptSessAct(a) {
  const M = S.me, me = ME(), sc = activeScript(), F = WRITE_FOCUS[a.f], day = S.week * 7 + (M.wk ? M.wk.day : 0);
  if (!sc || !F || M.sessD === day) return false; M.sessD = day;
  const L = []; writeOnScript(L, a.f === 'pages' ? .9 : .5);
  if (F[2]) { sc.q += (skillOf(me, F[2]) - 8) * 1.5; growSub(me, F[2], .015); }
  M.energy = clamp(M.energy - 7, 0, 100);
  diary(`Scriptwriter: ${L.join(' ')}`);
  return true;
}
function coverageOf(sc) {
  const me = ME(), sk = k => skillOf(me, k), notes = [];
  notes.push(['Structure', sk('struc') >= 12 || sc.outlined ? 'Confident: the turns land where they should.' : 'The middle wanders. An outline would help.']);
  notes.push(['Dialogue', sk('dial') >= 12 ? 'Sharp and specific; people sound like people.' : 'On the nose: characters say what they feel.']);
  notes.push(['Character', sk('char') >= 12 ? 'A lead we\'d follow anywhere.' : 'The lead reacts more than they choose.']);
  notes.push(['Originality', sk('orig') >= 12 ? 'Feels like nobody else could have written it.' : 'Familiar beats; the premise needs a twist.']);
  return notes;
}
function scriptwriterApp() {
  const M = S.me, sc = activeScript(), done = (M.scripts || []).filter(x => x.grade).slice(-6).reverse(), today = M.sessD === S.week * 7 + (M.wk ? M.wk.day : 0);
  let body = '';
  if (sc) {
    const pct = Math.round(sc.pages / Math.max(1, sc.target) * 100), perPage = sc.pages ? sc.q / sc.pages : 0, proj = clamp(Math.round(38 + (perPage - 6) * 5 + (sc.draft - 1) * 7), 5, 98);
    const cards = beatCards(sc), pick = UI.beats && UI.beats.id === sc.id && UI.beats.d === sc.draft ? UI.beats.p : (UI.beats = { id: sc.id, d: sc.draft, p: BEAT_SLOTS.map(() => '') }).p;
    body = `<div class="sw-page"><p class="sw-title">${esc(sc.title.toUpperCase())}</p><p class="muted small">${esc(sc.genre)} · ${esc(THEMES[sc.theme] || '')} · draft ${sc.draft}</p>
      <div class="sw-prog"><i style="width:${pct}%"></i></div><p class="small">${sc.pages} of ${sc.target} pages · ${sc.sessions} sessions · heading for <b>${gradeOf(proj)}</b> on what's written so far${sc.prep ? ` · outline bonus +${sc.prep}` : ''}</p></div>
     <h5>Write</h5><div class="bf-row">${Object.entries(WRITE_FOCUS).map(([k, F]) => `<button class="btn-s ghost" data-swsess="${k}" ${today ? 'disabled' : ''} title="${esc(F[1])}">${F[0]}</button>`).join('')}</div><p class="small muted">${today ? 'You\'ve done a session on the computer today.' : 'One session a day here, on top of the writing blocks in your diary.'}</p>
     <h5>Beat board ${sc.outlined === sc.draft ? '<span class="chip good">outline locked</span>' : ''}</h5>
     ${sc.outlined === sc.draft ? `<ol class="small">${(sc.outline || []).map((ci, i) => `<li><b>${BEAT_SLOTS[i][0]}</b>: ${esc((cards.find(c => c.i === ci) || {}).t || '')}</li>`).join('')}</ol>` : `<p class="small muted">Put a scene card on each beat. Two cards don't belong anywhere. A good outline makes every page after it better (and rolls your Structure).</p>
      <div class="sw-beats">${BEAT_SLOTS.map(([l], i) => `<label><span>${l}</span>${sel('sw-beat-' + i, [['', 'Choose a scene…'], ...cards.map(c => [String(c.i), c.t])], String(pick[i]))}</label>`).join('')}</div>
      <button class="btn-s" data-swoutline="${sc.id}" ${pick.some(x => x === '') ? 'disabled' : ''}>Lock the outline</button>`}
     ${UI.sample ? `<p><button class="btn-s ghost" data-readpages="${sc.id}">📖 Read the pages</button></p>` : ''}`;
  } else body = `<p>No script in progress. Start one on your writing desk.</p><p><button class="btn-s" data-app="create">Open Create</button></p>`;
  return `<div class="swapp">${body}${done.length ? `<h5>Coverage on finished scripts</h5>${done.map(x => `<details class="sw-cov"><summary><b>${esc(x.title)}</b> <span class="grade g${x.grade}">${x.grade}</span> <span class="muted small">${x.score}/100 · draft ${x.draft}</span></summary><ul class="plain small">${coverageOf(x).map(([k, v]) => `<li><b>${k}:</b> ${esc(v)}</li>`).join('')}</ul></details>`).join('')}` : ''}</div>`;
}

// ---- Studio: music ----
const MOODS = { major: 'Bright (major)', minor: 'Dark (minor)', modal: 'Dreamy (modal)' }, ARR = ['Intro', 'Verse', 'Chorus', 'Verse', 'Chorus', 'Bridge', 'Chorus', 'Outro'];
function mixState() { return UI.mix = UI.mix || { bpm: 110, mood: 'major', lv: [70, 55, 60, 45, 65], arr: ARR.slice() }; }
function musicScore(k) {
  const G = seqGrid(), X = mixState(); let s = seqScore(G) * .6;
  const lv = X.lv, spread = Math.max(...lv) - Math.min(...lv); if (spread <= 35) s += 1; if (lv[4] >= lv[1] && lv[0] >= 50) s += .5;   // melody over the snare, a kick you can feel
  const ch = X.arr.filter(x => x === 'Chorus').length; if (ch >= 2 && ch <= 4) s += 1; if (X.arr.includes('Bridge')) s += .5; if (X.arr[0] === 'Intro' || X.arr[0] === 'Verse') s += .5;
  if (k.type === 'score' && X.mood !== 'major' && X.bpm <= 100) s += 1; if (k.type === 'song' && X.bpm >= 90 && X.bpm <= 130) s += 1;
  return clamp(Math.round(s), 0, 10);
}
// ---- Studio: podcast ----
function podState() { return UI.pod = UI.pod || { guest: '', intro: 1, order: ['Cold open', 'Intro music', 'Interview', 'Listener mail', 'Sign-off'] }; }
function podScore() {
  const P0 = podState(), segs = podSegs(), cut = UI.cuts || []; let s = clamp(Math.round(cut.reduce((t, i) => t + (segs[i] === 'talk' ? -2 : 1), 0) / Math.max(1, segs.filter(x => x !== 'talk').length) * 10), 0, 10) * .6;
  if (P0.order[0] === 'Cold open') s += 1; if (P0.order[P0.order.length - 1] === 'Sign-off') s += .5; if (P0.intro) s += .5;
  if (P0.guest !== '' && P(+P0.guest)) s += Math.min(2, (P(+P0.guest).fame || 0) / 30 + .5);
  return clamp(Math.round(s), 0, 10);
}
function studioApp() {
  const M = S.me, k = M.make;
  if (!k || !['song', 'score', 'musical', 'podcast'].includes(k.type)) return `<p>Open a song, score, musical or podcast project on Create, then work on it here.</p><p><button class="btn-s" data-app="create">Open Create</button></p>`;
  const done = M.sessD === S.week * 7 + (M.wk ? M.wk.day : 0);
  if (k.type === 'podcast') {
    const segs = podSegs(), cut = UI.cuts || [], P0 = podState(), guests = aliveKnown().slice(0, 30).map(id => [String(id), P(id).name + (P(id).fame > 30 ? ' ★' : '')]);
    return `<p><b>${esc(k.title)}</b> · episode ${(k.prog || 0) + 1}</p>
     <div class="filt"><label><span>Guest</span>${sel('pod-guest', [['', 'No guest: just you'], ...guests], P0.guest)}</label><label><span>Intro music</span>${sel('pod-intro', [['1', 'Yes'], ['0', 'No']], String(P0.intro))}</label></div>
     <h5>Running order <span class="muted small">click two to swap</span></h5><div class="timeline">${P0.order.map((x, i) => `<button class="clip2${UI.podPick === i ? ' on' : ''}" data-podord="${i}">${esc(x)}</button>`).join('')}</div>
     <h5>The edit <span class="muted small">cut the ums and dead air, keep the talk</span></h5><div class="wave">${segs.map((s, i) => `<button class="seg ${s}${cut.includes(i) ? ' cut' : ''}" data-podcut="${i}" title="${s === 'um' ? 'um…' : s === 'gap' ? 'silence' : 'talking'}"><i style="height:${s === 'talk' ? 26 + (i * 7) % 14 : s === 'um' ? 10 : 3}px"></i></button>`).join('')}</div>
     <p>${done ? '<span class="muted">You\'ve done a session today.</span>' : `<button class="btn-s" data-session="podcut2">Export the episode</button>`} <span class="muted small">Predicted: ${podScore()}/10. A cold open hooks; a famous guest brings their audience.</span></p>`;
  }
  const G = seqGrid(), X = mixState();
  return `<p><b>${esc(k.title)}</b> · ${esc(WORK_TYPES[k.type].label)}</p>
   <div class="filt"><label><span>Tempo</span><input id="mx-bpm" type="number" min="60" max="180" value="${X.bpm}"> BPM</label><label><span>Mood</span>${sel('mx-mood', Object.entries(MOODS), X.mood)}</label></div>
   <div class="seq">${SEQ_ROWS.map((row, r) => `<div class="srow"><span>${row}</span>${G[r].map((v, c) => `<button class="step${v ? ' on' : ''}${c % 4 === 0 ? ' downbeat' : ''}" data-seq="${r}:${c}"></button>`).join('')}<input class="mx-lv" id="mx-lv-${r}" type="range" min="0" max="100" value="${X.lv[r]}" title="${row} level"></div>`).join('')}</div>
   <h5>Arrangement <span class="muted small">click two sections to swap</span></h5><div class="timeline">${X.arr.map((x, i) => `<button class="clip2${UI.arrPick === i ? ' on' : ''}" data-arr="${i}">${esc(x)}</button>`).join('')}</div>
   <p><button class="btn-s ghost" data-seqplay="1">▶ Play</button> ${done ? '<span class="muted">You\'ve done a session today.</span>' : `<button class="btn-s" data-session="studio2">Bounce the mix</button>`} <span class="muted small">Predicted: ${musicScore(k)}/10. Kick on the one, snare on the backbeat; keep the levels within reach of each other; two or three choruses and a bridge.${k.type === 'score' ? ' Scores like it darker and slower.' : ''}</span></p>`;
}
// ---- CutRoom ----
const CUT_SETS = { video: ['Hook', 'Intro', 'Main point', 'Example', 'Joke', 'Payoff', 'Call to action', 'Outro'], blip: ['Hook', 'Setup', 'Twist', 'Punchline'], mv: ['Intro', 'Verse', 'Chorus', 'Verse', 'Bridge', 'Chorus', 'Outro'] };
const CUT_IDEAL = { video: { first: 'Hook', last: 'Outro', after: [['Payoff', 'Main point'], ['Example', 'Main point']] }, blip: { first: 'Hook', last: 'Punchline', after: [['Twist', 'Setup']] }, mv: { first: 'Intro', last: 'Outro', after: [['Bridge', 'Verse']] } };
function cutState(k) { if (!UI.cut || UI.cut.w !== S.week || UI.cut.t !== k.type) { const r = hashRand(S.week * 71 + k.type.length), L = CUT_SETS[k.type].slice().sort(() => r() - .5); UI.cut = { w: S.week, t: k.type, order: L, len: L.map(() => 1), grade: 'natural', music: 'upbeat', caps: 1, thumb: null, title: '' }; } return UI.cut; }
function cutPredict(k) {
  const C = cutState(k), I = CUT_IDEAL[k.type], O = C.order; let s = 0;
  if (O[0] === I.first) s += 2.5; if (O[O.length - 1] === I.last) s += 1.5; for (const [a, b] of I.after) if (O.indexOf(a) > O.indexOf(b)) s += 1;
  const tight = C.len.filter((x, i) => (O[i] === 'Hook' || O[i] === 'Intro') ? x === 0 : x <= 1).length / O.length; s += tight * 2;
  if (C.caps) s += .5; if (k.type === 'mv' ? C.grade === 'stylised' : C.grade !== 'stylised') s += .5; if (k.type === 'blip' ? C.music === 'trending' : C.music !== 'none') s += .5;
  const t = C.title.trim(), tq = t.length >= 25 && t.length <= 65 ? 1 : t.length ? .4 : 0, hook = /\d|\?|!|how|why|never|secret|tried/i.test(t) ? .5 : 0;
  const ctr = (C.thumb === null ? 2 : [6.5, 3.5, 2.5, 5][C.thumb]) + tq * 1.5 + hook;
  s += (C.thumb === 0 || C.thumb === 3 ? 1 : C.thumb === null ? -1 : 0) + tq + hook;
  return { score: clamp(Math.round(s), 0, 10), ret: Math.round(clamp(30 + s * 5 + tight * 10, 15, 85)), ctr: +ctr.toFixed(1) };
}
function cutroomApp() {
  const M = S.me, k = M.make;
  if (!k || !['video', 'blip', 'mv'].includes(k.type)) return `<p>Open a video, Blip clip or music video project on Create, then cut it here.</p><p><button class="btn-s" data-app="create">Open Create</button></p>`;
  const C = cutState(k), P0 = cutPredict(k), done = M.sessD === S.week * 7 + (M.wk ? M.wk.day : 0);
  const curve = Array.from({ length: 10 }, (_, i) => Math.round(100 * Math.pow(P0.ret / 100, i / 9)));
  return `<p><b>${esc(k.title)}</b> · ${esc(WORK_TYPES[k.type].label)}</p>
   <h5>Timeline <span class="muted small">click two clips to swap; set each clip's length</span></h5>
   <div class="cut-tl">${C.order.map((c, i) => `<div class="cut-clip${UI.pickC === i ? ' on' : ''}"><button class="clip2" data-clip2="${i}">${esc(c)}</button>${sel('cut-len-' + i, [['0', 'Tight'], ['1', 'Normal'], ['2', 'Long']], String(C.len[i]))}</div>`).join('')}</div>
   <div class="filt"><label><span>Colour grade</span>${sel('cut-grade', [['natural', 'Natural'], ['warm', 'Warm'], ['stylised', 'Stylised']], C.grade)}</label><label><span>Music bed</span>${sel('cut-music', [['upbeat', 'Upbeat'], ['moody', 'Moody'], ['trending', 'Trending sound'], ['none', 'None']], C.music)}</label><label><span>Captions</span>${sel('cut-caps', [['1', 'On'], ['0', 'Off']], String(C.caps))}</label></div>
   <h5>Packaging</h5><div class="filt"><label class="filt-q"><span>Title</span><input id="cut-title" maxlength="80" placeholder="What makes someone click?" value="${esc(C.title)}"></label></div>
   <p class="small">Thumbnail: ${['😲 Big face, big arrow', '🌄 A pretty landscape', '🔤 Just the title', '🎯 One bold image, three words'].map((t, i) => `<button class="btn-s${C.thumb === i ? '' : ' ghost'}" data-thumb2="${i}">${t}</button>`).join(' ')}</p>
   <div class="cut-pred"><div><span class="muted small">Predicted retention</span><div class="cut-curve">${curve.map(v => `<i style="height:${v}%"></i>`).join('')}</div><b>${P0.ret}%</b> <span class="muted small">watch to the end</span></div><div><span class="muted small">Click-through</span><b class="os-big">${P0.ctr}%</b></div><div><span class="muted small">Edit score</span><b class="os-big">${P0.score}/10</b></div></div>
   <p>${done ? '<span class="muted">You\'ve done a session today.</span>' : `<button class="btn-s" data-session="edit2">Render the cut</button>`}</p>`;
}
function creativeClick(t) {
  const d = t.dataset;
  if (d.swsess) { doAct({ t: 'scriptsess', f: d.swsess }); render(true); return true; }
  if (d.swoutline) { const n0 = S.me.rollN || 0; doAct({ t: 'outline', id: +d.swoutline, pick: (UI.beats || {}).p }); render(true); if ((S.me.rollN || 0) > n0 && typeof showRollOverlay === 'function') showRollOverlay(S.me.lastRoll); return true; }
  if (d.arr !== undefined) { const X = mixState(), i = +d.arr; if (UI.arrPick === undefined || UI.arrPick === null) UI.arrPick = i; else { [X.arr[UI.arrPick], X.arr[i]] = [X.arr[i], X.arr[UI.arrPick]]; UI.arrPick = null; } render(true); return true; }
  if (d.podord !== undefined) { const P0 = podState(), i = +d.podord; if (UI.podPick === undefined || UI.podPick === null) UI.podPick = i; else { [P0.order[UI.podPick], P0.order[i]] = [P0.order[i], P0.order[UI.podPick]]; UI.podPick = null; } render(true); return true; }
  if (d.clip2 !== undefined) { const C = UI.cut, i = +d.clip2; if (!C) return true; if (UI.pickC === undefined || UI.pickC === null) UI.pickC = i; else { [C.order[UI.pickC], C.order[i]] = [C.order[i], C.order[UI.pickC]]; [C.len[UI.pickC], C.len[i]] = [C.len[i], C.len[UI.pickC]]; UI.pickC = null; } render(true); return true; }
  if (d.thumb2 !== undefined) { if (UI.cut) UI.cut.thumb = +d.thumb2; render(true); return true; }
  if (d.session === 'studio2' || d.session === 'podcut2' || d.session === 'edit2') {
    const k = S.me.make, score = d.session === 'studio2' ? musicScore(k) : d.session === 'podcut2' ? podScore() : cutPredict(k).score;
    if (d.session === 'podcut2') UI.cuts = []; if (d.session === 'edit2') UI.cut = null;
    doAct({ t: 'session', score }); render(true); return true;
  }
  return false;
}
function creativeChange(e) {
  const id = e.target.id, v = e.target.value;
  let m;
  if ((m = id.match(/^sw-beat-(\d)$/))) { if (UI.beats) UI.beats.p[+m[1]] = v === '' ? '' : +v; render(true); return true; }
  if (id === 'mx-bpm') { mixState().bpm = clamp(+v || 110, 60, 180); render(true); return true; }
  if (id === 'mx-mood') { mixState().mood = v; render(true); return true; }
  if ((m = id.match(/^mx-lv-(\d)$/))) { mixState().lv[+m[1]] = +v; render(true); return true; }
  if (id === 'pod-guest') { podState().guest = v; render(true); return true; }
  if (id === 'pod-intro') { podState().intro = +v; render(true); return true; }
  if ((m = id.match(/^cut-len-(\d)$/))) { if (UI.cut) UI.cut.len[+m[1]] = +v; render(true); return true; }
  if (id === 'cut-grade' || id === 'cut-music' || id === 'cut-caps') { if (UI.cut) UI.cut[id.slice(4)] = id === 'cut-caps' ? +v : v; render(true); return true; }
  if (id === 'cut-title') { if (UI.cut) UI.cut.title = v; render(true); return true; }
  return false;
}
