// ---------------- The Make suite, part two: Studio, CutRoom, Notebook, the Create hub ----------------
// Studio: start a song, score, musical or podcast right here. Compose in a key: drums, a bass line and a melody on a
// piano roll, four bars of chords, then lyrics with a live read on rhyme, meter and hook, and a mixing desk. It plays
// through your speakers. CutRoom: storyboard every shot, order and trim the timeline, pick transitions, a grade and a
// sound mix, design the thumbnail, and watch a preview. Notebook: ideas you can turn into projects with one click.
// All of it is saved with the project (action 'makesave'), and a session's score is what the work earns.
const AUDIO_TYPES = ['song', 'score', 'musical', 'podcast'], VIDEO_TYPES = ['video', 'blip', 'mv'];
const MKEYS = ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'];
const SCALES = { major: ['Major (bright)', [0, 2, 4, 5, 7, 9, 11]], minor: ['Minor (dark)', [0, 2, 3, 5, 7, 8, 10]], dorian: ['Dorian (soulful)', [0, 2, 3, 5, 7, 9, 10]], penta: ['Pentatonic (safe)', [0, 2, 4, 7, 9, 12, 14]] };
const CHORDS = ['I', 'ii', 'iii', 'IV', 'V', 'vi'], CH_DEG = { I: 0, ii: 1, iii: 2, IV: 3, V: 4, vi: 5 };
const GROOVES = {
  four: ['Four on the floor', { k: [0, 4, 8, 12], s: [4, 12], h: [2, 6, 10, 14] }],
  boom: ['Boom bap', { k: [0, 7, 10], s: [4, 12], h: [0, 2, 4, 6, 8, 10, 12, 14] }],
  ballad: ['Ballad', { k: [0, 10], s: [8], h: [0, 4, 8, 12] }],
  bossa: ['Bossa', { k: [0, 3, 8, 11], s: [3, 6, 10, 13], h: [0, 2, 4, 6, 8, 10, 12, 14] }],
  march: ['Marching', { k: [0, 4, 8, 12], s: [2, 6, 10, 14, 15], h: [] }]
};
const N16 = 16, MEL_ROWS = 8;
function st2() {
  const M = S.me, k = M.make;
  if (UI.st2 && UI.st2.w === (k && k.w) && UI.st2.t === (k && k.title)) return UI.st2;
  const saved = k && k.studio, base = { key: 0, scale: 'major', bpm: 108, drums: { k: Array(N16).fill(0), s: Array(N16).fill(0), h: Array(N16).fill(0) }, bass: Array(N16).fill(-1), mel: Array(N16).fill(-1), chords: ['I', 'I', 'I', 'I'], lv: [60, 60, 60, 60, 60, 60], verb: 0, comp: 0, lyrics: '', arr: ARR.slice() };
  UI.st2 = Object.assign(base, saved ? JSON.parse(JSON.stringify(saved)) : {}, { w: k && k.w, t: k && k.title });
  return UI.st2;
}
// ---- reading the music ----
function melodyRead(X) {
  const notes = X.mel.map((v, i) => [i, v]).filter(x => x[1] >= 0), n = notes.length, out = []; let s = 0;
  if (!n) return { s: 0, notes: ['No melody yet: click the piano roll.'] };
  const dens = n / N16; if (dens >= .35 && dens <= .8) { s += 2; out.push('Room to breathe between notes.'); } else out.push(dens < .35 ? 'Sparse: the tune barely starts.' : 'Wall-to-wall notes: nowhere to breathe.');
  const iv = notes.slice(1).map((x, i) => Math.abs(x[1] - notes[i][1])), step = iv.length ? iv.filter(x => x <= 2).length / iv.length : 0;
  if (step >= .55) { s += 2; out.push('Mostly stepwise: easy to sing.'); } else out.push('Lots of leaps: hard to sing along.');
  const range = Math.max(...notes.map(x => x[1])) - Math.min(...notes.map(x => x[1])); if (range >= 3 && range <= 6) { s += 1.5; out.push('A good range: it goes somewhere.'); } else out.push(range < 3 ? 'Stays on a couple of notes.' : 'Wide range: only a trained voice will manage it.');
  const a = X.mel.slice(0, 4).join(','), b = X.mel.slice(8, 12).join(','); if (a === b && X.mel.slice(0, 4).some(v => v >= 0)) { s += 2.5; out.push('A motif that comes back: that\'s your hook.'); } else if (X.mel.slice(0, 4).map(v => v >= 0).join() === X.mel.slice(8, 12).map(v => v >= 0).join()) { s += 1; out.push('The rhythm repeats; the notes could too.'); }
  const last = notes[n - 1][1]; if (last === 0 || last === 7) { s += 2; out.push('Ends home on the tonic.'); } else out.push('Ends up in the air: unresolved.');
  return { s: Math.min(10, s), notes: out };
}
function grooveRead(X) {
  const D = X.drums, out = []; let s = 0;
  if (D.k[0]) { s += 2; out.push('Kick on the one.'); } else out.push('No kick on the one: the groove floats.');
  if (D.s[4] && D.s[12]) { s += 2; out.push('Snare on the backbeat.'); } else if (D.s.some(Boolean)) s += .5;
  const h = D.h.filter(Boolean).length; if (h >= 4) { s += 2; out.push('Hats keep time.'); }
  const bassDown = [0, 4, 8, 12].filter(i => X.bass[i] >= 0).length; if (bassDown >= 3) { s += 2; out.push('The bass locks with the downbeats.'); } else if (X.bass.some(v => v >= 0)) { s += .5; out.push('The bass wanders off the beat.'); } else out.push('No bass line yet.');
  const busy = D.k.filter(Boolean).length + D.s.filter(Boolean).length + h; if (busy > 30) out.push('Very busy: thin it out.'); else s += 2;
  return { s: Math.min(10, s), notes: out };
}
function chordRead(X) {
  const C = X.chords, out = []; let s = 2;
  const prog = C.join('-'), pops = ['I-V-vi-IV', 'vi-IV-I-V', 'I-vi-IV-V', 'IV-I-V-vi', 'I-IV-V-I', 'ii-V-I-I', 'I-IV-vi-V'];
  if (pops.includes(prog)) { s += 4; out.push('A progression a million songs trust.'); }
  if (C[3] === 'V' || C[3] === 'IV') { s += 1.5; out.push('The last bar pulls back to the start.'); }
  if (C[0] === 'I' || C[0] === 'vi') { s += 1.5; out.push('Opens on solid ground.'); }
  if (new Set(C).size === 1) { s -= 2; out.push('One chord all the way: a drone.'); } else if (new Set(C).size >= 3) s += 1;
  return { s: clamp(s, 0, 10), notes: out };
}
function mixRead(X) {
  const lv = X.lv, out = []; let s = 2;
  const spread = Math.max(...lv) - Math.min(...lv); if (spread <= 40) { s += 2; out.push('Balanced: everything sits together.'); } else out.push('Something is buried, something is shouting.');
  if (lv[5] >= Math.max(...lv.slice(0, 5)) - 5) { s += 2; out.push('The lead sits on top.'); } else out.push('The lead is lost in the band.');
  if (X.verb >= 10 && X.verb <= 45) { s += 2; out.push('Reverb gives it a room.'); } else out.push(X.verb < 10 ? 'Bone dry.' : 'Drowned in reverb.');
  if (X.comp >= 20 && X.comp <= 65) { s += 2; out.push('Glued together, still breathing.'); } else out.push(X.comp < 20 ? 'Loose and uneven.' : 'Squashed flat.');
  return { s: Math.min(10, s), notes: out };
}
const CLICHES = ['heart of gold', 'set me free', 'fire inside', 'baby baby', 'dance the night away', 'tears like rain', 'end of the road', 'touch the sky', 'one more time', 'love is blind', 'rise above', 'broken heart', 'never let go', 'shine like', 'until the end'];
function syl(w) { w = w.toLowerCase().replace(/[^a-z]/g, ''); if (!w) return 0; if (w.length <= 3) return 1; w = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, ''); const m = w.match(/[aeiouy]{1,2}/g); return m ? m.length : 1; }
function lyricRead(text, title) {
  const raw = String(text || ''), L = raw.split('\n').map(x => x.trim()), lines = L.filter(x => x && !/^\[.*\]$/.test(x)), out = []; let s = 0;
  if (!lines.length) return { s: 0, notes: ['No lyrics yet.'], lines: 0 };
  if (lines.length >= 12) { s += 1.5; out.push(`${lines.length} lines: a full song.`); } else out.push(`${lines.length} lines: keep going.`);
  const secs = L.filter(x => /^\[.*\]$/.test(x)).map(x => x.toLowerCase()); if (secs.some(x => x.includes('chorus')) && secs.some(x => x.includes('verse'))) { s += 1.5; out.push('Verses and a chorus.'); } else out.push('Mark sections with [Verse] and [Chorus].');
  const end = lines.map(x => (x.toLowerCase().match(/[a-z']+(?=[^a-z']*$)/) || [''])[0]); let rh = 0; for (let i = 1; i < end.length; i++) { const a = end[i], b = end[i - 1], c = end[i - 2] || ''; if (a && ((b && a !== b && a.slice(-2) === b.slice(-2)) || (c && a !== c && a.slice(-2) === c.slice(-2)))) rh++; }
  const rr = rh / Math.max(1, lines.length - 1); if (rr >= .35) { s += 2; out.push('It rhymes where it should.'); } else out.push('Few rhymes: it reads like prose.');
  const sy = lines.map(x => x.split(/\s+/).reduce((t, w) => t + syl(w), 0)), mean = sy.reduce((a, b) => a + b, 0) / sy.length, dev = Math.sqrt(sy.reduce((t, v) => t + (v - mean) ** 2, 0) / sy.length);
  if (dev <= 2.5) { s += 2; out.push(`Even meter (about ${Math.round(mean)} syllables a line).`); } else out.push('The line lengths fight the tune.');
  const tl = String(title || '').toLowerCase().replace(/[^a-z ]/g, '').trim(), chorus = (raw.toLowerCase().split(/\[chorus\]/)[1] || '').split(/\[/)[0];
  if (tl && chorus.includes(tl)) { s += 2; out.push('The title is in the chorus: the hook lands.'); } else if (tl && raw.toLowerCase().includes(tl)) { s += 1; out.push('The title is in there; put it in the chorus.'); } else out.push('Sing the title somewhere: that\'s the hook.');
  const cl = CLICHES.filter(c => raw.toLowerCase().includes(c)); if (cl.length) { s -= cl.length * .75; out.push(`Clichés: "${cl.slice(0, 3).join('", "')}".`); } else { s += 1; out.push('No clichés we can see.'); }
  return { s: clamp(s, 0, 10), notes: out, lines: lines.length };
}
function studioScore(k) {
  const X = st2(), m = melodyRead(X).s, g = grooveRead(X).s, c = chordRead(X).s, x = mixRead(X).s, ly = k.type === 'song' || k.type === 'musical' ? lyricRead(X.lyrics, k.title).s : null;
  let s = ly === null ? m * .35 + g * .25 + c * .2 + x * .2 : m * .3 + g * .2 + c * .15 + x * .15 + ly * .2;
  if (k.type === 'score' && X.scale !== 'major' && X.bpm <= 100) s += .8; if (k.type === 'song' && X.bpm >= 85 && X.bpm <= 135) s += .5;
  return clamp(Math.round(s), 0, 10);
}
// ---- sound ----
function st2Play() {
  if (typeof window === 'undefined' || !(window.AudioContext || window.webkitAudioContext)) return;
  const ctx = UI.actx = UI.actx || new (window.AudioContext || window.webkitAudioContext)(), X = st2(), sc = SCALES[X.scale][1], step = 60 / X.bpm / 4, t0 = ctx.currentTime + .08, root = 57 + X.key;
  const hz = m => 440 * Math.pow(2, (m - 69) / 12), deg = (d, oct) => root + 12 * oct + sc[((d % 7) + 7) % 7] + 12 * Math.floor(d / 7);
  const out = ctx.createGain(); out.gain.value = .55; out.connect(ctx.destination);
  const lvl = i => X.lv[i] / 100;
  const tone = (f, t, d, type, g, cut) => { const o = ctx.createOscillator(), v = ctx.createGain(), fl = ctx.createBiquadFilter(); o.type = type; o.frequency.value = f; fl.type = 'lowpass'; fl.frequency.value = cut || 4000; v.gain.setValueAtTime(0, t); v.gain.linearRampToValueAtTime(g, t + .01); v.gain.exponentialRampToValueAtTime(.0008, t + d); o.connect(fl); fl.connect(v); v.connect(out); o.start(t); o.stop(t + d + .05); };
  const noise = (t, d, g, hp) => { const b = ctx.createBuffer(1, ctx.sampleRate * d, ctx.sampleRate), a = b.getChannelData(0); for (let i = 0; i < a.length; i++) a[i] = Math.random() * 2 - 1; const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), v = ctx.createGain(); s.buffer = b; f.type = 'highpass'; f.frequency.value = hp; v.gain.setValueAtTime(g, t); v.gain.exponentialRampToValueAtTime(.0008, t + d); s.connect(f); f.connect(v); v.connect(out); s.start(t); };
  for (let loop = 0; loop < 2; loop++) for (let i = 0; i < N16; i++) {
    const t = t0 + (loop * N16 + i) * step;
    if (X.drums.k[i]) { const o = ctx.createOscillator(), v = ctx.createGain(); o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(42, t + .14); v.gain.setValueAtTime(.9 * lvl(0), t); v.gain.exponentialRampToValueAtTime(.001, t + .22); o.connect(v); v.connect(out); o.start(t); o.stop(t + .25); }
    if (X.drums.s[i]) noise(t, .16, .45 * lvl(1), 1200);
    if (X.drums.h[i]) noise(t, .05, .2 * lvl(2), 7000);
    if (X.bass[i] >= 0) tone(hz(deg(X.bass[i], -2)), t, step * 1.8, 'triangle', .5 * lvl(3), 900);
    if (i % 4 === 0) { const c = CH_DEG[X.chords[i / 4]] || 0; for (const d of [c, c + 2, c + 4]) tone(hz(deg(d, -1)), t, step * 3.8, 'sawtooth', .07 * lvl(4), 1400); }
    if (X.mel[i] >= 0) tone(hz(deg(X.mel[i], 0)), t, step * 1.6, 'square', .12 * lvl(5), 2600);
  }
  // a playhead across the grid
  const cells = () => document.querySelectorAll('.pr-col'); let n = 0; const tick = () => { cells().forEach((c, j) => c.classList.toggle('ph', j === n % N16)); n++; if (n < N16 * 2) UI.phT = setTimeout(tick, step * 1000); else cells().forEach(c => c.classList.remove('ph')); };
  clearTimeout(UI.phT); setTimeout(tick, 80);
}
// ---- the Studio app ----
function newProjectForm(types, label) {
  const M = S.me, T = types.filter(t => WORK_TYPES[t] && workTypeOpen(t)), cur = UI.np2 && T.includes(UI.np2) ? UI.np2 : T[0];
  if (M.make) return `<div class="os-empty"><span>${WORK_TYPES[M.make.type].icon}</span><b>You're working on ${esc(M.make.title)}</b><p>One project at a time. ${AUDIO_TYPES.includes(M.make.type) ? 'Open it in the Studio.' : VIDEO_TYPES.includes(M.make.type) ? 'Open it in the CutRoom.' : 'Finish it from Create.'}</p></div>`;
  return `<div class="np2"><h5>Start something ${label}</h5><div class="np2-types">${T.map(t => { const W = WORK_TYPES[t], blocked = W.needs === 'song' && !(M.works || []).some(w => w.type === 'song' && w.rel !== undefined); return `<button class="np2-t${t === cur ? ' on' : ''}" data-np2="${t}" ${blocked ? 'disabled title="Release a song first"' : ''}><span>${W.icon}</span><b>${esc(W.label)}</b><small>${esc(W.d)}</small>${W.cost ? `<small class="muted">Costs ${fmtCash(usd(W.cost))}</small>` : ''}</button>`; }).join('')}</div>
   <div class="np2-go"><input id="np2-title" maxlength="60" placeholder="Title (or leave blank and we'll suggest one)"><button class="btn-s" data-np2go="${cur}">Start ${esc(WORK_TYPES[cur].label.toLowerCase())}</button></div></div>`;
}
function readList(R) { return `<ul class="plain small st-read">${R.notes.map(n => `<li>${esc(n)}</li>`).join('')}</ul>`; }
function studioApp() {
  const M = S.me, k = M.make;
  const rel = (M.works || []).filter(w => AUDIO_TYPES.includes(w.type)).slice(-5).reverse();
  if (!k || !AUDIO_TYPES.includes(k.type)) return `<div class="st2">${newProjectForm(AUDIO_TYPES, 'to listen to')}${rel.length ? `<h5>Released</h5><ul class="os-list">${rel.map(w => `<li><a href="#" class="lk" data-go="work:${w.id}">${esc(w.title)}</a><span class="muted">${esc(WORK_TYPES[w.type].label)} · ${Math.round(w.units || 0).toLocaleString()} ${w.type === 'podcast' ? 'downloads' : 'plays'}</span></li>`).join('')}</ul>` : ''}</div>`;
  if (k.type === 'podcast') return podcastApp(k);
  const X = st2(), t = UI.stt || 'compose', done = M.sessD === S.week * 7 + (M.wk ? M.wk.day : 0), score = studioScore(k), sc = SCALES[X.scale][1];
  const noteName = d => { const semi = (X.key + sc[((d % 7) + 7) % 7] + 12 * Math.floor(d / 7)) % 12; return MKEYS[semi]; };
  const head = `<div class="st-hd"><div><b>${esc(k.title)}</b> <span class="muted small">${esc(WORK_TYPES[k.type].label)} · ${k.prog}/${k.need} sessions</span><div class="pbar"><i style="width:${Math.round(k.prog / k.need * 100)}%"></i></div></div>
    <div class="st-score"><span>Predicted</span><b>${score}/10</b></div><div class="st-btns"><button class="btn-s ghost" data-st2play="1">▶ Play</button><button class="btn-s ghost" data-st2save="1">💾 Save</button>${done ? '<span class="muted small">Session done today</span>' : `<button class="btn-s" data-st2bounce="1">Bounce the session</button>`}</div></div>`;
  const tabs = [['compose', '🎹 Compose'], ['lyrics', '✍️ Lyrics'], ['mix', '🎚️ Mix & arrange']].filter(([kk]) => kk !== 'lyrics' || k.type !== 'score');
  let body = '';
  if (t === 'compose') {
    const step = i => i % 4 === 0 ? ' dn' : '';
    body = `<div class="filt"><label><span>Key</span>${sel('st-key', MKEYS.map((n, i) => [String(i), n]), String(X.key))}</label><label><span>Scale</span>${sel('st-scale', Object.entries(SCALES).map(([kk, v]) => [kk, v[0]]), X.scale)}</label><label><span>Tempo</span><input id="st-bpm" type="number" min="60" max="180" value="${X.bpm}"> BPM</label><label><span>Start from a groove</span>${sel('st-groove', [['', 'Choose…'], ...Object.entries(GROOVES).map(([kk, v]) => [kk, v[0]])], '')}</label></div>
     <h5>Drums</h5><div class="drm">${[['k', 'Kick'], ['s', 'Snare'], ['h', 'Hats']].map(([r, l]) => `<div class="drow"><span>${l}</span>${X.drums[r].map((v, i) => `<button class="stp${v ? ' on' : ''}${step(i)}" data-st2d="${r}:${i}"></button>`).join('')}</div>`).join('')}</div>
     <h5>Melody <span class="muted small">one note per step; click again to clear</span></h5>
     <div class="proll">${Array.from({ length: N16 }, (_, i) => `<div class="pr-col${step(i)}">${Array.from({ length: MEL_ROWS }, (_, r) => { const d = MEL_ROWS - 1 - r; return `<button class="pr${X.mel[i] === d ? ' on' : ''}" data-st2m="${i}:${d}" title="${noteName(d)}"></button>`; }).join('')}</div>`).join('')}<div class="pr-keys">${Array.from({ length: MEL_ROWS }, (_, r) => `<span>${noteName(MEL_ROWS - 1 - r)}</span>`).join('')}</div></div>
     <h5>Bass</h5><div class="proll bass">${Array.from({ length: N16 }, (_, i) => `<div class="pr-col${step(i)}">${Array.from({ length: 5 }, (_, r) => { const d = 4 - r; return `<button class="pr${X.bass[i] === d ? ' on' : ''}" data-st2b="${i}:${d}" title="${noteName(d)}"></button>`; }).join('')}</div>`).join('')}</div>
     <h5>Chords <span class="muted small">four bars</span></h5><div class="chs">${X.chords.map((c, i) => `<label>Bar ${i + 1}${sel('st-ch-' + i, CHORDS.map(x => [x, `${x} (${noteName(CH_DEG[x])})`]), c)}</label>`).join('')}</div>
     <div class="cols three st-reads"><div><b>Melody ${Math.round(melodyRead(X).s)}/10</b>${readList(melodyRead(X))}</div><div><b>Groove ${Math.round(grooveRead(X).s)}/10</b>${readList(grooveRead(X))}</div><div><b>Harmony ${Math.round(chordRead(X).s)}/10</b>${readList(chordRead(X))}</div></div>`;
  } else if (t === 'lyrics') {
    const R = lyricRead(X.lyrics, k.title);
    body = `<p class="small muted">Write the words. Mark sections with [Verse], [Chorus], [Bridge]. The read updates as you type: rhyme, meter, the hook, and clichés to cut.</p>
     <div class="ly"><textarea id="st-lyrics" rows="16" maxlength="4000" placeholder="[Verse]&#10;…&#10;&#10;[Chorus]&#10;…">${esc(X.lyrics)}</textarea><div><b>Lyrics <span id="ly-score">${Math.round(R.s)}</span>/10</b><div id="ly-read">${readList(R)}</div></div></div>`;
  } else {
    const tracks = ['Kick', 'Snare', 'Hats', 'Bass', 'Chords', 'Lead'];
    body = `<div class="mixer">${tracks.map((n, i) => `<div class="ch"><span class="vu"><i style="height:${X.lv[i]}%"></i></span><input type="range" min="0" max="100" value="${X.lv[i]}" id="st-lv-${i}" orient="vertical"><b>${n}</b><small>${X.lv[i]}</small></div>`).join('')}
     <div class="ch fx"><b>Reverb</b><input type="range" min="0" max="80" value="${X.verb}" id="st-verb"><small>${X.verb}%</small><b>Compression</b><input type="range" min="0" max="100" value="${X.comp}" id="st-comp"><small>${X.comp}%</small></div></div>
     <div class="st-reads"><b>Mix ${Math.round(mixRead(X).s)}/10</b>${readList(mixRead(X))}</div>
     <h5>Arrangement <span class="muted small">click two sections to swap</span></h5><div class="timeline">${X.arr.map((x, i) => `<button class="clip2${UI.arrPick === i ? ' on' : ''}" data-st2arr="${i}">${esc(x)}</button>`).join('')}</div>`;
  }
  return `<div class="st2">${head}<div class="np-tabs">${tabs.map(([kk, l]) => `<button class="${t === kk ? 'on' : ''}" data-stt="${kk}">${l}</button>`).join('')}</div>${body}</div>`;
}
// ---- podcasts ----
const POD_QS = [['How did it start, really?', 1], ['Was it hard?', 0], ['What did nobody tell you?', 1], ['Do you like your job?', 0], ['Walk me through the worst day.', 1], ['Isn\'t it true you were fired?', 0], ['What would you do differently?', 1], ['Is that right?', 0], ['What surprised you most?', 1], ['You must be proud, yes?', 0]];
function pod2() { const k = S.me.make; if (!UI.pod2 || UI.pod2.w !== k.w || UI.pod2.t !== k.title) UI.pod2 = Object.assign({ topic: '', guest: '', qs: [], cold: '', order: ['Cold open', 'Intro music', 'Interview', 'Listener mail', 'Sign-off'] }, k.studio && k.studio.pod ? JSON.parse(JSON.stringify(k.studio.pod)) : {}, { w: k.w, t: k.title }); return UI.pod2; }
function podScore2() {
  const P0 = pod2(), segs = podSegs(), cut = UI.cuts || []; let s = clamp(Math.round(cut.reduce((t, i) => t + (segs[i] === 'talk' ? -2 : 1), 0) / Math.max(1, segs.filter(x => x !== 'talk').length) * 10), 0, 10) * .4;
  if (P0.order[0] === 'Cold open') s += 1; if (P0.order[P0.order.length - 1] === 'Sign-off') s += .5;
  if (P0.guest !== '' && P(+P0.guest)) s += Math.min(2, (P(+P0.guest).fame || 0) / 30 + .5);
  const good = P0.qs.filter(i => POD_QS[i] && POD_QS[i][1]).length; s += good * .6 - (P0.qs.length - good) * .4;
  if (P0.cold.trim().length >= 60) s += 1; if (P0.topic.trim().length >= 8) s += .5;
  return clamp(Math.round(s), 0, 10);
}
function podcastApp(k) {
  const M = S.me, P0 = pod2(), t = UI.stt === 'edit' ? 'edit' : 'plan', segs = podSegs(), cut = UI.cuts || [], done = M.sessD === S.week * 7 + (M.wk ? M.wk.day : 0), guests = aliveKnown().slice(0, 40).map(id => [String(id), P(id).name + (P(id).fame > 30 ? ' ★' : '')]);
  const head = `<div class="st-hd"><div><b>${esc(k.title)}</b> <span class="muted small">Podcast · ${k.prog}/${k.need} sessions</span><div class="pbar"><i style="width:${Math.round(k.prog / k.need * 100)}%"></i></div></div><div class="st-score"><span>Predicted</span><b>${podScore2()}/10</b></div><div class="st-btns"><button class="btn-s ghost" data-st2save="1">💾 Save</button>${done ? '<span class="muted small">Session done today</span>' : '<button class="btn-s" data-st2bounce="1">Export the episode</button>'}</div></div>`;
  const body = t === 'plan' ? `<div class="filt"><label class="filt-q"><span>This week's topic</span><input id="pd-topic" maxlength="80" value="${esc(P0.topic)}" placeholder="The worst set I ever worked on"></label><label><span>Guest</span>${sel('pd-guest', [['', 'No guest: just you'], ...guests], P0.guest)}</label></div>
     <h5>Questions <span class="muted small">pick up to four for the interview</span></h5><div class="pd-qs">${POD_QS.map(([q], i) => `<button class="pill${P0.qs.includes(i) ? ' on' : ''}" data-pdq="${i}" ${!P0.qs.includes(i) && P0.qs.length >= 4 ? 'disabled' : ''}>${esc(q)}</button>`).join('')}</div><p class="small muted">Open questions get stories; yes-or-no questions get yes or no.</p>
     <h5>Cold open <span class="muted small">the first thirty seconds, in your words</span></h5><textarea id="pd-cold" rows="3" maxlength="500" placeholder="So there I was, holding a boom pole in a hailstorm…">${esc(P0.cold)}</textarea>
     <h5>Running order <span class="muted small">click two to swap</span></h5><div class="timeline">${P0.order.map((x, i) => `<button class="clip2${UI.podPick === i ? ' on' : ''}" data-pd2ord="${i}">${esc(x)}</button>`).join('')}</div>`
    : `<h5>The edit <span class="muted small">cut the ums and dead air, keep the talk</span></h5><div class="wave">${segs.map((s, i) => `<button class="seg ${s}${cut.includes(i) ? ' cut' : ''}" data-podcut="${i}" title="${s === 'um' ? 'um…' : s === 'gap' ? 'silence' : 'talking'}"><i style="height:${s === 'talk' ? 26 + (i * 7) % 14 : s === 'um' ? 10 : 3}px"></i></button>`).join('')}</div>`;
  return `<div class="st2">${head}<div class="np-tabs"><button class="${t === 'plan' ? 'on' : ''}" data-stt="plan">🗒️ Plan</button><button class="${t === 'edit' ? 'on' : ''}" data-stt="edit">✂️ Edit</button></div>${body}</div>`;
}
// ---- CutRoom ----
const SHOTS = { wide: ['Wide', '🏞️'], medium: ['Medium', '🧍'], close: ['Close-up', '🙂'], insert: ['Insert', '🔍'], pov: ['Point of view', '👁️'], drone: ['Aerial', '🚁'] };
const TRANS = { cut: 'Cut', dissolve: 'Dissolve', whip: 'Whip pan', match: 'Match cut', jump: 'Jump cut' };
const CGRADES = { natural: ['Natural', 'none'], warm: ['Warm', 'sepia(.25) saturate(1.2)'], cool: ['Cool', 'hue-rotate(15deg) saturate(.9)'], teal: ['Teal & orange', 'saturate(1.4) contrast(1.1)'], mono: ['Black & white', 'grayscale(1) contrast(1.2)'], stylised: ['Stylised', 'saturate(1.8) hue-rotate(-20deg)'] };
const THUMB_BG = ['#E0457B', '#1FA3A0', '#F2C14E', '#2F5BD3', '#151515', '#F4F2EE'], THUMB_SUBJ = ['😲', '😂', '🤯', '🎬', '🔥', '💰', '🧟', '🐶'];
function cut2(k) {
  const C = cutState(k);
  if (!C.shots) { const sv = k.studio && k.studio.cut; if (sv && sv.order && sv.order.length === C.order.length) Object.assign(C, JSON.parse(JSON.stringify(sv))); }
  C.shots = C.shots || C.order.map(() => ({ shot: 'medium', cap: '' }));
  C.trans = C.trans || C.order.map(() => 'cut'); C.voice = C.voice ?? 70; C.mus = C.mus ?? 45; C.tb = C.tb || { bg: 0, subj: 0, text: '' };
  return C;
}
function cutScore2(k) {
  const C = cut2(k), base = cutPredict(k); let s = base.score;
  let run = 1, worst = 1; for (let i = 1; i < C.shots.length; i++) { run = C.shots[i].shot === C.shots[i - 1].shot ? run + 1 : 1; worst = Math.max(worst, run); }
  const variety = new Set(C.shots.map(x => x.shot)).size; s += variety >= 4 ? 1 : variety >= 3 ? .5 : -.5; if (worst >= 3) s -= 1;
  const capped = C.shots.filter(x => x.cap.trim().length >= 8).length / C.shots.length; s += capped * 1.5;
  const tr = C.trans.filter(x => x !== 'cut').length; s += tr === 0 ? 0 : tr <= 2 ? .5 : -1;
  if (C.voice >= C.mus + 10) s += .5;
  const words = C.tb.text.trim().split(/\s+/).filter(Boolean).length, tctr = (C.tb.subj <= 2 ? 1.2 : .6) + (words >= 1 && words <= 4 ? 1.2 : words ? .3 : 0) + ([0, 2, 3, 4].includes(C.tb.bg) ? .6 : 0);
  return { score: clamp(Math.round(s), 0, 10), ret: clamp(base.ret + (variety >= 4 ? 5 : 0) - (worst >= 3 ? 8 : 0), 10, 90), ctr: +(base.ctr * .6 + tctr * 1.4).toFixed(1) };
}
function cutroomApp() {
  const M = S.me, k = M.make;
  const rel = (M.works || []).filter(w => VIDEO_TYPES.includes(w.type)).slice(-5).reverse();
  if (!k || !VIDEO_TYPES.includes(k.type)) return `<div class="st2">${newProjectForm(VIDEO_TYPES, 'to watch')}${rel.length ? `<h5>Published</h5><ul class="os-list">${rel.map(w => `<li><a href="#" class="lk" data-go="work:${w.id}">${esc(w.title)}</a><span class="muted">${esc(WORK_TYPES[w.type].label)} · ${Math.round(w.units || 0).toLocaleString()} views</span></li>`).join('')}</ul>` : ''}</div>`;
  const C = cut2(k), P0 = cutScore2(k), t = UI.crt || 'board', done = M.sessD === S.week * 7 + (M.wk ? M.wk.day : 0), G = CGRADES[C.grade] || CGRADES.natural;
  const head = `<div class="st-hd"><div><b>${esc(k.title)}</b> <span class="muted small">${esc(WORK_TYPES[k.type].label)} · ${k.prog}/${k.need} sessions</span><div class="pbar"><i style="width:${Math.round(k.prog / k.need * 100)}%"></i></div></div>
    <div class="st-score"><span>Edit</span><b>${P0.score}/10</b></div><div class="st-score"><span>Retention</span><b>${P0.ret}%</b></div><div class="st-score"><span>Click-through</span><b>${P0.ctr}%</b></div><div class="st-btns"><button class="btn-s ghost" data-cr2save="1">💾 Save</button>${done ? '<span class="muted small">Session done today</span>' : '<button class="btn-s" data-cr2render="1">Render the cut</button>'}</div></div>`;
  const tabs = [['board', '🖼️ Storyboard'], ['tl', '🎞️ Timeline'], ['look', '🎨 Look & sound'], ['pack', '📦 Packaging'], ['prev', '▶ Preview']];
  let body = '';
  if (t === 'board') body = `<p class="small muted">What's in every shot. Mix your framings (three of the same in a row drags), and write what we see: specific beats general.</p><div class="sb">${C.order.map((c, i) => `<div class="sb-f"><div class="sb-pic" style="filter:${G[1]}"><span>${SHOTS[C.shots[i].shot][1]}</span><small>${esc(c)}</small></div>${sel('cr-shot-' + i, Object.entries(SHOTS).map(([kk, v]) => [kk, v[0]]), C.shots[i].shot)}<input id="cr-cap-${i}" maxlength="80" placeholder="What we see" value="${esc(C.shots[i].cap)}"></div>`).join('')}</div>`;
  else if (t === 'tl') body = `<p class="small muted">Click two clips to swap them; set each one's length and the transition into the next.</p><div class="cut-tl2">${C.order.map((c, i) => `<div class="cut-clip${UI.pickC === i ? ' on' : ''}"><button class="clip2" data-clip2="${i}">${SHOTS[C.shots[i].shot][1]} ${esc(c)}</button>${sel('cut-len-' + i, [['0', 'Tight'], ['1', 'Normal'], ['2', 'Long']], String(C.len[i]))}${i < C.order.length - 1 ? sel('cr-tr-' + i, Object.entries(TRANS), C.trans[i]) : ''}</div>`).join('')}</div>
    <div class="cut-pred"><div><span class="muted small">Predicted retention</span><div class="cut-curve">${Array.from({ length: 10 }, (_, i) => `<i style="height:${Math.round(100 * Math.pow(P0.ret / 100, i / 9))}%"></i>`).join('')}</div></div></div>`;
  else if (t === 'look') body = `<div class="filt"><label><span>Grade</span>${sel('cr-grade', Object.entries(CGRADES).map(([kk, v]) => [kk, v[0]]), C.grade in CGRADES ? C.grade : 'natural')}</label><label><span>Music bed</span>${sel('cut-music', [['upbeat', 'Upbeat'], ['moody', 'Moody'], ['trending', 'Trending sound'], ['none', 'None']], C.music)}</label><label><span>Captions</span>${sel('cut-caps', [['1', 'On'], ['0', 'Off']], String(C.caps))}</label></div>
    <div class="gr-swatch">${Object.entries(CGRADES).map(([kk, v]) => `<div class="${C.grade === kk ? 'on' : ''}"><div class="sb-pic" style="filter:${v[1]}"><span>🌆</span></div><small>${v[0]}</small></div>`).join('')}</div>
    <h5>Sound mix</h5><div class="filt"><label><span>Voice ${C.voice}</span><input type="range" id="cr-voice" min="0" max="100" value="${C.voice}"></label><label><span>Music ${C.mus}</span><input type="range" id="cr-mus" min="0" max="100" value="${C.mus}"></label></div><p class="small muted">${C.voice >= C.mus + 10 ? 'Every word is clear.' : 'The music fights the voice: viewers leave when they can\'t hear.'}</p>`;
  else if (t === 'pack') body = `<div class="filt"><label class="filt-q"><span>Title</span><input id="cut-title" maxlength="80" placeholder="What makes someone click?" value="${esc(C.title)}"></label></div>
    <div class="tb-wrap"><div class="tb" style="background:${THUMB_BG[C.tb.bg]};color:${C.tb.bg === 5 ? '#151515' : '#fff'}"><span class="tb-s">${THUMB_SUBJ[C.tb.subj]}</span><b>${esc(C.tb.text || 'YOUR TEXT')}</b></div>
     <div><p class="small">Background ${THUMB_BG.map((c, i) => `<button class="swb${C.tb.bg === i ? ' on' : ''}" style="background:${c}" data-tbbg="${i}"></button>`).join('')}</p><p class="small">Subject ${THUMB_SUBJ.map((e, i) => `<button class="pill${C.tb.subj === i ? ' on' : ''}" data-tbsubj="${i}">${e}</button>`).join('')}</p><label class="small">Thumbnail text <input id="cr-tbtext" maxlength="24" value="${esc(C.tb.text)}" placeholder="3 WORDS MAX"></label><p class="small muted">A face, a big feeling, three words or fewer, a colour that pops: that's a click.</p></div></div>`;
  else body = `<div class="pv${UI.crplay ? ' play' : ''}" style="--n:${C.order.length}">${C.order.map((c, i) => `<div class="pv-f" style="animation-delay:${C.order.slice(0, i).reduce((s, _, j) => s + [0.8, 1.3, 2][C.len[j]], 0)}s;animation-duration:${[0.8, 1.3, 2][C.len[i]]}s"><div class="sb-pic big" style="filter:${G[1]}"><span>${SHOTS[C.shots[i].shot][1]}</span></div><p>${esc(C.shots[i].cap || c)}</p>${C.caps ? `<small class="pv-cap">${esc(C.shots[i].cap || c)}</small>` : ''}</div>`).join('')}<div class="pv-idle"><span>▶</span><small>Press play to watch the cut</small></div></div><p><button class="btn-s" data-crplay="1">▶ Play preview</button></p>`;
  return `<div class="st2">${head}<div class="np-tabs">${tabs.map(([kk, l]) => `<button class="${t === kk ? 'on' : ''}" data-crt="${kk}">${l}</button>`).join('')}</div>${body}</div>`;
}
// ---- Notebook ----
const IDEA_KINDS = { film: ['🎬', 'Film idea'], song: ['🎵', 'Song idea'], video: ['▶️', 'Video idea'], character: ['🧍', 'Character'], line: ['💬', 'A line'], joke: ['😂', 'Joke'], place: ['📍', 'A place'] };
const SPARKS = ['What if the {job} was the only one who knew?', 'A {genre} set entirely in one {place}.', 'Two {who} who hate each other must {verb} together.', 'The last {thing} in the world, and someone wants it.', 'A {who} lies about one small thing. It grows.', 'Tell a {genre} story backwards, from the ending.', 'Someone returns to {place} after twenty years. Nothing changed but them.', 'A song that only makes sense on the night bus.'];
const SPARK_W = { job: ['night porter', 'lighthouse keeper', 'wedding singer', 'film projectionist', 'stunt double'], genre: ['heist', 'ghost story', 'romance', 'western', 'thriller'], place: ['lift', 'laundrette', 'airport chapel', 'motel pool', 'ferry'], who: ['rival chefs', 'sisters', 'ex-partners', 'retired spies', 'teenage rivals'], verb: ['bury a secret', 'win a talent show', 'cross a desert', 'raise a goat'], thing: ['cinema', 'payphone', 'honeybee', 'record shop'] };
function sparkOf(n) { const r = hashRand(S.week * 31 + n * 7 + (S.me.wk ? S.me.wk.day : 0)); return SPARKS[Math.floor(r() * SPARKS.length)].replace(/\{(\w+)\}/g, (_, k) => SPARK_W[k][Math.floor(r() * SPARK_W[k].length)]); }
function ideaAct(a) {
  const M = S.me, L = M.ideas = M.ideas || [];
  if (a.op === 'add') { const t = String(a.text || '').replace(/\s+/g, ' ').trim().slice(0, 400); if (!t || L.length >= 120) return false; L.push({ id: M.seq++, k: IDEA_KINDS[a.k] ? a.k : 'film', t, w: S.week }); return true; }
  const x = L.find(i => i.id === +a.id); if (!x) return false;
  if (a.op === 'del') { L.splice(L.indexOf(x), 1); return true; }
  if (a.op === 'star') { x.star = !x.star; return true; }
  if (a.op === 'used') { x.used = S.week; return true; }
  return false;
}
function notebookApp() {
  const M = S.me, L = (M.ideas || []).slice().reverse(), f = UI.nbk || '', q = (UI.nbq || '').toLowerCase(), life = (M.diary || []).slice(-60).filter(d => !/^Money:|^Scriptwriter:/.test(d.t) && d.t.length > 40).slice(-5).reverse();
  let free = ''; try { free = localStorage.getItem(notesKey()) || ''; } catch (e) { /* no storage */ }
  const shown = L.filter(i => (!f || i.k === f) && (!q || i.t.toLowerCase().includes(q))).sort((a, b) => (b.star ? 1 : 0) - (a.star ? 1 : 0));
  return `<div class="nb"><div class="nb-add"><select id="nb-k">${Object.entries(IDEA_KINDS).map(([k, v]) => `<option value="${k}" ${UI.nbadd === k ? 'selected' : ''}>${v[0]} ${v[1]}</option>`).join('')}</select><textarea id="nb-text" rows="2" maxlength="400" placeholder="Write it down before it's gone…"></textarea><button class="btn-s" data-nbadd="1">Keep it</button></div>
   <div class="nb-spark"><span>✨ Spark: <b>${esc(sparkOf(UI.nbspark || 0))}</b></span><button class="linkish" data-nbspark="1">Another</button><button class="linkish" data-nbkeep="1">Keep this one</button></div>
   <div class="os-tools"><input type="search" id="nbq" data-uiq="nbq" placeholder="Search your ideas…" value="${esc(UI.nbq || '')}"><span class="bf-row"><button class="pill${!f ? ' on' : ''}" data-nbk="">All ${L.length}</button>${Object.entries(IDEA_KINDS).filter(([k]) => L.some(i => i.k === k)).map(([k, v]) => `<button class="pill${f === k ? ' on' : ''}" data-nbk="${k}">${v[0]} ${L.filter(i => i.k === k).length}</button>`).join('')}</span></div>
   <div class="nb-cards">${shown.map(i => `<article class="nb-card${i.used ? ' used' : ''}"><header><span>${IDEA_KINDS[i.k][0]} ${IDEA_KINDS[i.k][1]}</span><small class="muted">${fmtDate(i.w, true)}</small><button class="linkish" data-nbstar="${i.id}" title="Star">${i.star ? '★' : '☆'}</button></header><p>${esc(i.t)}</p>
     <footer>${i.k === 'film' || i.k === 'character' || i.k === 'place' ? `<button class="btn-s ghost" data-nbdev="script:${i.id}">→ Start a script</button>` : ''}${i.k === 'song' ? `<button class="btn-s ghost" data-nbdev="song:${i.id}">→ Start a song</button>` : ''}${i.k === 'video' || i.k === 'joke' ? `<button class="btn-s ghost" data-nbdev="video:${i.id}">→ Start a video</button>` : ''}${i.used ? '<span class="muted small">developed</span>' : ''}<button class="linkish dk-x" data-nbdel="${i.id}">Delete</button></footer></article>`).join('') || '<div class="os-empty"><span>💡</span><b>No ideas yet</b><p>Ideas are free. Write down anything: a title, a face on the bus, a line overheard in a queue.</p></div>'}</div>
   ${life.length ? `<h5>From your week <span class="muted small">raw material</span></h5><ul class="plain small nb-life">${life.map(d => `<li>${esc(d.t)} <button class="linkish" data-nbfrom="${esc(d.t.slice(0, 380))}">Keep as an idea</button></li>`).join('')}</ul>` : ''}
   <details><summary>Scratchpad</summary><textarea id="pc-notes" rows="8" placeholder="Anything at all…">${esc(free)}</textarea><p class="muted small">Saved on this device only.</p></details></div>`;
}
// ---- the Create hub ----
function makeHubHTML() {
  const M = S.me, sc = typeof activeScript === 'function' ? activeScript() : null, k = M.make, ideas = (M.ideas || []).length;
  const card = (app, ic, name, line, cur) => `<button class="mh-c" data-app="${app}"><span>${ic}</span><b>${name}</b><small>${line}</small>${cur ? `<em>${cur}</em>` : ''}</button>`;
  return `<section class="panel mhub"><h3>Your studio</h3><div class="mh-g">
   ${card('write', '✍️', 'Scriptwriter', 'Loglines, characters, scenes, your own pages, punch-ups, coverage.', sc ? `Writing ${esc(sc.title)}: ${sc.pages}/${sc.target} pages` : 'Start a script')}
   ${card('studio', '🎚️', 'Studio', 'Compose in a key, write lyrics, mix, plan podcasts.', k && AUDIO_TYPES.includes(k.type) ? `${esc(k.title)}: ${k.prog}/${k.need}` : 'Start a song or podcast')}
   ${card('cutroom', '🎞️', 'CutRoom', 'Storyboard, timeline, grade, sound, thumbnail, preview.', k && VIDEO_TYPES.includes(k.type) ? `${esc(k.title)}: ${k.prog}/${k.need}` : 'Start a video')}
   ${card('notes', '📝', 'Notebook', 'Ideas, sparks and raw material from your week.', ideas ? `${ideas} idea${ideas > 1 ? 's' : ''}` : 'Empty')}
   ${card('contests', '🥇', 'Contests', 'Send your best work where judges will read it.', '')}</div></section>`;
}
// ---- clicks, typing, changes ----
function make3Click(t) {
  if (!S.me || !careerActive()) return false;
  const d = t.dataset, M = S.me, k = M.make;
  if (d.np2) { UI.np2 = d.np2; render(true); return true; }
  if (d.np2go) { const el = document.getElementById('np2-title'); doAct({ t: 'startwork', type: d.np2go, title: el ? el.value : '' }); UI.st2 = null; UI.cut = null; UI.pod2 = null; render(true); return true; }
  if (d.stt) { UI.stt = d.stt; render(true); return true; }
  if (d.crt) { UI.crt = d.crt; UI.crplay = 0; render(true); return true; }
  if (d.st2d) { const [r, i] = d.st2d.split(':'), X = st2(); X.drums[r][+i] = X.drums[r][+i] ? 0 : 1; render(true); return true; }
  if (d.st2m) { const [i, v] = d.st2m.split(':').map(Number), X = st2(); X.mel[i] = X.mel[i] === v ? -1 : v; render(true); return true; }
  if (d.st2b) { const [i, v] = d.st2b.split(':').map(Number), X = st2(); X.bass[i] = X.bass[i] === v ? -1 : v; render(true); return true; }
  if (d.st2arr !== undefined) { const X = st2(), i = +d.st2arr; if (UI.arrPick === undefined || UI.arrPick === null) UI.arrPick = i; else { [X.arr[UI.arrPick], X.arr[i]] = [X.arr[i], X.arr[UI.arrPick]]; UI.arrPick = null; } render(true); return true; }
  if (d.st2play) { st2Play(); return true; }
  if (d.st2save || d.st2bounce) { if (!k) return true;
    const data = k.type === 'podcast' ? { pod: (({ topic, guest, qs, cold, order }) => ({ topic, guest, qs, cold, order }))(pod2()) } : (({ key, scale, bpm, drums, bass, mel, chords, lv, verb, comp, lyrics, arr }) => ({ key, scale, bpm, drums, bass, mel, chords, lv, verb, comp, lyrics, arr }))(st2());
    doAct({ t: 'makesave', data });
    if (d.st2bounce) { const score = k.type === 'podcast' ? podScore2() : studioScore(k); if (k.type === 'podcast') UI.cuts = []; doAct({ t: 'session', score }); }
    render(true); return true; }
  if (d.pdq !== undefined) { const P0 = pod2(), i = +d.pdq, j = P0.qs.indexOf(i); if (j >= 0) P0.qs.splice(j, 1); else if (P0.qs.length < 4) P0.qs.push(i); render(true); return true; }
  if (d.pd2ord !== undefined) { const P0 = pod2(), i = +d.pd2ord; if (UI.podPick === undefined || UI.podPick === null) UI.podPick = i; else { [P0.order[UI.podPick], P0.order[i]] = [P0.order[i], P0.order[UI.podPick]]; UI.podPick = null; } render(true); return true; }
  if (d.tbbg !== undefined && k) { cut2(k).tb.bg = +d.tbbg; render(true); return true; }
  if (d.tbsubj !== undefined && k) { cut2(k).tb.subj = +d.tbsubj; render(true); return true; }
  if (d.crplay) { UI.crplay = 0; render(true); requestAnimationFrame(() => { UI.crplay = 1; const pv = document.querySelector('.pv'); if (pv) pv.classList.add('play'); }); return true; }
  if (d.cr2save || d.cr2render) { if (!k) return true; const C = cut2(k); doAct({ t: 'makesave', data: { cut: { order: C.order, len: C.len, grade: C.grade, music: C.music, caps: C.caps, title: C.title, thumb: C.thumb, shots: C.shots, trans: C.trans, voice: C.voice, mus: C.mus, tb: C.tb } } });
    if (d.cr2render) { C.thumb = C.tb.subj <= 2 ? 0 : 3; const score = cutScore2(k).score; UI.cut = null; doAct({ t: 'session', score }); }
    render(true); return true; }
  // notebook
  if (d.nbadd) { const el = document.getElementById('nb-text'), kk = (document.getElementById('nb-k') || {}).value; UI.nbadd = kk; doAct({ t: 'idea', op: 'add', k: kk, text: el ? el.value : '' }); render(true); return true; }
  if (d.nbspark) { UI.nbspark = (UI.nbspark || 0) + 1; render(true); return true; }
  if (d.nbkeep) { doAct({ t: 'idea', op: 'add', k: 'film', text: sparkOf(UI.nbspark || 0) }); render(true); return true; }
  if (d.nbfrom) { doAct({ t: 'idea', op: 'add', k: 'film', text: d.nbfrom }); render(true); return true; }
  if (d.nbk !== undefined) { UI.nbk = d.nbk; render(true); return true; }
  if (d.nbstar) { doAct({ t: 'idea', op: 'star', id: +d.nbstar }); render(true); return true; }
  if (d.nbdel) { doAct({ t: 'idea', op: 'del', id: +d.nbdel }); render(true); return true; }
  if (d.nbdev) { const [kind, id] = d.nbdev.split(':'), x = (M.ideas || []).find(i => i.id === +id); if (!x) return true;
    if (kind === 'script') { UI.newScript = Object.assign(UI.newScript || {}, { premise: x.k === 'film' ? x.t : '', hero: x.k === 'character' ? x.t.slice(0, 120) : '', setting: x.k === 'place' ? x.t.slice(0, 120) : '', title: '' }); UI.app = 'write'; UI.swt = 'desk'; UI.osStack = []; }
    else { const type = kind === 'song' ? 'song' : 'video'; if (!M.make) doAct({ t: 'startwork', type, title: x.t.split(/[.!?]/)[0].slice(0, 60) }); UI.app = kind === 'song' ? 'studio' : 'cutroom'; UI.osStack = []; }
    doAct({ t: 'idea', op: 'used', id: x.id }); render(true); return true; }
  return false;
}
function make3Input(e) {
  if (!S.me || !careerActive()) return false;
  const id = e.target.id, v = e.target.value, k = S.me && S.me.make;
  if (id === 'st-lyrics') { st2().lyrics = v; const R = lyricRead(v, k && k.title), a = document.getElementById('ly-read'), b = document.getElementById('ly-score'); if (a) a.innerHTML = readList(R); if (b) b.textContent = Math.round(R.s); return true; }
  if (id === 'pd-topic') { pod2().topic = v; return true; }
  if (id === 'pd-cold') { pod2().cold = v; return true; }
  let m; if (k && (m = id.match(/^cr-cap-(\d+)$/))) { cut2(k).shots[+m[1]].cap = v.slice(0, 80); return true; }
  if (k && id === 'cr-tbtext') { cut2(k).tb.text = v.slice(0, 24).toUpperCase(); const b = document.querySelector('.tb b'); if (b) b.textContent = cut2(k).tb.text || 'YOUR TEXT'; return true; }
  return false;
}
function make3Change(e) {
  if (!S.me || !careerActive()) return false;
  const id = e.target.id, v = e.target.value, k = S.me && S.me.make; let m;
  if (id === 'st-key') { st2().key = +v; render(true); return true; }
  if (id === 'st-scale') { st2().scale = SCALES[v] ? v : 'major'; render(true); return true; }
  if (id === 'st-bpm') { st2().bpm = clamp(+v || 108, 60, 180); render(true); return true; }
  if (id === 'st-groove') { const G = GROOVES[v]; if (G) { const X = st2(); for (const r of ['k', 's', 'h']) X.drums[r] = Array.from({ length: N16 }, (_, i) => G[1][r].includes(i) ? 1 : 0); } render(true); return true; }
  if ((m = id.match(/^st-ch-(\d)$/))) { st2().chords[+m[1]] = CHORDS.includes(v) ? v : 'I'; render(true); return true; }
  if ((m = id.match(/^st-lv-(\d)$/))) { st2().lv[+m[1]] = +v; render(true); return true; }
  if (id === 'st-verb') { st2().verb = +v; render(true); return true; }
  if (id === 'st-comp') { st2().comp = +v; render(true); return true; }
  if (id === 'pd-guest') { pod2().guest = v; render(true); return true; }
  if (k && (m = id.match(/^cr-shot-(\d+)$/))) { cut2(k).shots[+m[1]].shot = SHOTS[v] ? v : 'wide'; render(true); return true; }
  if (k && (m = id.match(/^cr-tr-(\d+)$/))) { cut2(k).trans[+m[1]] = TRANS[v] ? v : 'cut'; render(true); return true; }
  if (k && id === 'cr-grade') { cut2(k).grade = CGRADES[v] ? v : 'natural'; render(true); return true; }
  if (k && id === 'cr-voice') { cut2(k).voice = +v; render(true); return true; }
  if (k && id === 'cr-mus') { cut2(k).mus = +v; render(true); return true; }
  if (id === 'cr-tbtext' || /^cr-cap-/.test(id) || id === 'pd-topic' || id === 'pd-cold' || id === 'st-lyrics') { render(true); return true; }
  return false;
}
// what a project keeps between sessions
function makeSaveAct(a) {
  const M = S.me, k = M.make; if (!k || !a.data || typeof a.data !== 'object') return false;
  let s; try { s = JSON.stringify(a.data); } catch (e) { return false; } if (s.length > 12000) return false;
  k.studio = Object.assign(k.studio || {}, JSON.parse(s));
  return true;
}
