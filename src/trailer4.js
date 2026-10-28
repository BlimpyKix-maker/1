// ================= Trailers, take four: built like the real thing =================
// Round 25. Take three still felt like a slide show with a loop under it, and the loop clipped. This version:
//  - a trailer in acts: a cold open (one quiet shot and a line), the setup (voice-over and dialogue), the turn (a hit
//    and a beat of black), the build (cuts getting faster, names and praise over footage, a riser), a beat of silence,
//    the title slam, the button (one last line or scare after the title) and the date;
//  - footage that moves: every shot has its own camera (push, pull, pan, tilt, orbit, crash zoom, handheld), the actors
//    walk in, turn or close in, the background and foreground drift at different speeds, a focus pull opens the
//    shot, and a genre grade, weather, embers, dust or stars sit over it;
//  - music written for the cut: each genre has a key, a chord progression and an arrangement that follows the
//    trailer's energy (a motif in the open, a pulse in the setup, drums and an ostinato in the build, a riser, a
//    silence, the slam, the tail); every note is scheduled on the audio clock against the edit, so cuts land on beats;
//    everything passes through a compressor and a limiter, with a little reverb, so nothing clips or grates;
//  - the picture follows the audio clock, so music and picture never drift apart.
// Nothing is random at play time: the film's id seeds everything, so a film always has the same trailer.

const T4_SCORE = {
  drama: { bpm: 76, root: 45, prog: [[0, 'm'], [8, ''], [3, ''], [10, '']], motif: 'piano', drums: 'soft', pulse: 'strings', fx: 'dust', grade: 'drama' },
  comedy: { bpm: 112, root: 48, prog: [[0, ''], [9, 'm'], [5, ''], [7, '']], motif: 'bell', drums: 'pop', pulse: 'pizz', fx: null, grade: 'comedy', noBraam: 1 },
  crime: { bpm: 92, root: 43, prog: [[0, 'm'], [5, 'm'], [8, ''], [7, '']], motif: 'piano', drums: 'tight', pulse: 'synth', fx: 'smoke', grade: 'crime' },
  action: { bpm: 120, root: 38, prog: [[0, 'm'], [8, ''], [10, ''], [0, 'm']], motif: 'brass', drums: 'big', pulse: 'strings', fx: 'sparks', grade: 'action' },
  hero: { bpm: 110, root: 41, prog: [[0, ''], [8, ''], [10, ''], [5, '']], motif: 'brass', drums: 'big', pulse: 'strings', fx: 'sparks', grade: 'hero' },
  war: { bpm: 84, root: 40, prog: [[0, 'm'], [8, ''], [3, ''], [10, '']], motif: 'brass', drums: 'march', pulse: 'strings', fx: 'embers', grade: 'war' },
  horror: { bpm: 70, root: 41, prog: [[0, 'm'], [1, ''], [0, 'm'], [6, '']], motif: 'box', drums: 'none', pulse: 'drone', fx: 'fog', grade: 'horror', noBraam: 0, stinger: 1 },
  romance: { bpm: 80, root: 50, prog: [[0, ''], [7, ''], [9, 'm'], [5, '']], motif: 'piano', drums: 'none', pulse: 'strings', fx: 'bokeh', grade: 'romance', noBraam: 1 },
  musical: { bpm: 116, root: 48, prog: [[0, ''], [5, ''], [7, ''], [5, '']], motif: 'bell', drums: 'pop', pulse: 'pizz', fx: 'bokeh', grade: 'musical', noBraam: 1 },
  scifi: { bpm: 100, root: 40, prog: [[0, 'm'], [8, ''], [5, 'm'], [10, '']], motif: 'synth', drums: 'tight', pulse: 'arp', fx: 'stars', grade: 'scifi' },
  fantasy: { bpm: 84, root: 43, prog: [[0, 'm'], [5, ''], [8, ''], [10, '']], motif: 'bell', drums: 'march', pulse: 'strings', fx: 'motes', grade: 'fantasy' },
  western: { bpm: 88, root: 40, prog: [[0, 'm'], [10, ''], [8, ''], [7, '']], motif: 'whistle', drums: 'soft', pulse: 'pluck', fx: 'dust', grade: 'western' },
  doc: { bpm: 72, root: 48, prog: [[0, ''], [4, 'm'], [5, ''], [0, '']], motif: 'piano', drums: 'none', pulse: 'pluck', fx: null, grade: 'doc', noBraam: 1 },
  toon: { bpm: 128, root: 53, prog: [[0, ''], [5, ''], [0, ''], [7, '']], motif: 'bell', drums: 'pop', pulse: 'pizz', fx: null, grade: 'toon', noBraam: 1 }
};
const T4_MOVES = ['push', 'pull', 'panl', 'panr', 'tilt', 'orbit', 'drift'];
const T4_ACT = ['walk', 'walkr', 'approach', 'turn', 'idle', 'idle'];

// ---- the edit ----
function t4Words(s) { return String(s || '').split(/\s+/).filter(Boolean).length; }
function t4Plan(f) {
  const fam = TR_FAMILY[f.genre] || 'drama', K = T4_SCORE[fam] || T4_SCORE.drama, r = hashRand(f.id * 7121 + 3), beatS = 60 / K.bpm;
  const pick = a => a[Math.floor(r() * a.length)];
  const story = typeof storyOf === 'function' ? storyOf(f) : null, d = !story && typeof dnaOfFilm === 'function' ? dnaOfFilm(f) : null, c = typeof filmCraft === 'function' ? filmCraft(f) : .6;
  // what's said: the film's own lines and voice-over
  const lines = [], used = new Set();
  if (story) lines.push(...story.lines);
  else if (d) for (const tag of ['setup', 'conflict', 'reveal', 'turn', 'payoff', 'breather', 'conflict']) {
    // a trailer uses the punchiest line of the exchange, and lines that belong to the genre
    let ex = ''; for (let i = 0; i < 4 && !ex; i++) { const e = wlPick('exch', tag, { g: d.g, tone: d.tone, c: Math.max(c, .7), r, used }); if (e && (e.gs ? e.gs.has(d.g) : r() < .5 || i === 3) && (!e.ts || e.ts.has(d.tone) || i >= 2)) ex = e[4]; }
    const L = String(ex).split('\n').map(l => /^(H|R|A):\s*(\([^)]*\))?\s*(.+)$/.exec(l.trim())).filter(m => m && m[3].length > 8 && m[3].length < 90).map(m => m[3]);
    const best = L.sort((x, y) => ((/[?!]|—|\.\.\./.test(y) ? 2 : 0) + (y.length < 60 ? 1 : 0)) - ((/[?!]|—|\.\.\./.test(x) ? 2 : 0) + (x.length < 60 ? 1 : 0)))[0];
    if (best) lines.push(dnaFill(best, d)); }
  while (lines.length < 4) lines.push(trFill(pick(TR_LINES[fam] || TR_LINES.drama), f, r));
  let vo = story ? story.t.split(/(?<=[.,;:!?])\s+/).filter(Boolean).slice(0, 3) : d ? dnaVO(d, c, r) : (TR_VO[fam] || TR_VO.drama).map(t => trFill(t, f, r));
  vo = vo.map(x => String(x).replace(/\.$/, ''));
  const lead = f.cast && P(f.cast[0]) ? P(f.cast[0]) : null, co2 = f.cast && P(f.cast[1]) ? P(f.cast[1]) : null, co = f.co !== null && S.companies[f.co] ? S.companies[f.co] : null, dirP = P(f.dir);
  const prev = dirP ? dirP.credits.map(i => S.films[i]).filter(x => x && x.id !== f.id && x.rel !== null && x.rel < (f.rel ?? S.week)).sort((a, b) => b.total - a.total)[0] : null;
  const who = k => (f.cast || [])[k % Math.max(1, Math.min(2, (f.cast || []).length))];
  // shots: each index is a different frame of the film
  let si = 0; const shot = () => si++;
  const segs = [], add = (o) => { const s = Object.assign({ beats: 4, energy: .3, cut: 'cut' }, o); if (s.shot === undefined && s.kind !== 'black') s.shot = shot(); if (!s.move) s.move = pick(T4_MOVES); if (!s.am) s.am = pick(T4_ACT); segs.push(s); return s; };
  const speak = t => Math.max(2, Math.ceil((t4Words(t) / 2.6 + .9) / beatS));   // a line gets time to be said
  const read = t => Math.max(3, Math.ceil((t4Words(t) / 2.2 + 1.2) / beatS));   // a card gets time to be read
  // 1. cold open
  add({ act: 'open', kind: 'shot', beats: 4, energy: .08, move: 'push', cut: 'fade', focus: 1 });
  add({ act: 'open', kind: 'line', text: lines[0], who: who(0), beats: speak(lines[0]), energy: .12, move: pick(['push', 'drift']) });
  add({ act: 'open', kind: 'card', logo: 1, text: (co ? co.name : 'An independent picture').toUpperCase() + ' PRESENTS', beats: 4, energy: .18, cut: 'dip' });
  // 2. setup
  add({ act: 'setup', kind: 'vo', text: vo[0], beats: read(vo[0]), energy: .28, move: 'pull' });
  add({ act: 'setup', kind: 'line', text: lines[1], who: who(1), beats: speak(lines[1]), energy: .32 });
  if (vo[1]) add({ act: 'setup', kind: 'vo', text: vo[1], beats: read(vo[1]), energy: .36, move: pick(['panl', 'panr']) });
  add({ act: 'setup', kind: 'shot', beats: 2, energy: .4, cut: 'cut' });
  // 3. the turn: a hit, a beat of black, and everything changes
  add({ act: 'turn', kind: 'black', beats: 2, energy: 0, hit: 'braam' });
  add({ act: 'turn', kind: 'line', text: lines[2], who: who(0), beats: speak(lines[2]), energy: .5, move: 'push', cut: 'cut' });
  if (vo[2]) add({ act: 'turn', kind: 'vo', text: vo[2], beats: read(vo[2]), energy: .55 });
  // 4. the build
  add({ act: 'build', kind: 'card', text: prev ? `FROM THE DIRECTOR OF ${prev.title.toUpperCase()}` : dirP ? `A FILM BY ${dirP.name.toUpperCase()}` : 'THIS SEASON', beats: 4, energy: .6, under: 1 });
  for (let i = 0; i < 4; i++) add({ act: 'build', kind: 'shot', beats: 2, energy: .65 + i * .03, cut: i % 2 ? 'whip' : 'cut', move: pick(['crash', 'push', 'panl', 'panr', 'handheld']) });
  if (lines[3]) add({ act: 'build', kind: 'line', text: lines[3], who: who(1), beats: speak(lines[3]), energy: .72 });
  const stars = [lead, co2].filter(Boolean).map(p => p.name.toUpperCase());
  if (stars.length) add({ act: 'build', kind: 'card', text: stars.join('   ·   '), beats: 4, energy: .78, under: 1 });
  if (f.rel !== null && (f.reviews || 0) >= 70) add({ act: 'build', kind: 'card', text: `“${pick(QUOTE_PRAISE[(f.reviews || 0) >= 82 ? 0 : 1])}”`, beats: 4, energy: .8, under: 1, quote: 1 });
  for (let i = 0; i < 8; i++) add({ act: 'climb', kind: 'shot', beats: 1, energy: .85 + i * .015, cut: i % 3 === 2 ? 'flash' : i % 2 ? 'whip' : 'cut', move: pick(['crash', 'handheld', 'push', 'orbit']), hit: 'cut' });
  // 5. silence, then the title
  add({ act: 'drop', kind: 'black', beats: 1, energy: 0, silence: 1 });
  add({ act: 'title', kind: 'title', beats: 8, energy: 1, hit: 'slam', move: 'pull' });
  // 6. the button
  const button = fam === 'comedy' || fam === 'toon' ? trFill(pick(TR_LINES.comedyButton || TR_LINES.comedy), f, r) : lines[4] || lines[0];
  add({ act: 'button', kind: 'line', text: button, who: who(0), beats: speak(button), energy: .15, move: 'push', sting: fam === 'horror' ? 1 : 0 });
  const when = f.rel !== null ? 'NOW SHOWING' : 'IN CINEMAS ' + fmtDate(f.rel ?? (f.stageEnd || S.week + 20), true).replace(/^\d+ /, '').toUpperCase();
  add({ act: 'date', kind: 'card', text: when, beats: 4, energy: .1, cut: 'dip' });
  let b = 0; for (const s of segs) { s.b0 = b; b += s.beats; }
  return { fam, K, segs, beats: b, beatS, total: b * beatS * 1000 };
}

// ---- the score ----
function t4Score(plan, f) {
  const K = plan.K, beatS = plan.beatS, fam = plan.fam;
  let ctx = null, out = null, music = null, timers = [], t0 = 0, from = 0, mutedV = false;
  const hz = n => 440 * Math.pow(2, (n - 69) / 12);
  const energyAt = b => { const s = plan.segs.find(x => b >= x.b0 && b < x.b0 + x.beats); return s ? s : { energy: 0 }; };
  function build() {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -20; comp.knee.value = 10; comp.ratio.value = 4; comp.attack.value = .01; comp.release.value = .25;
    const lim = ctx.createDynamicsCompressor(); lim.threshold.value = -4; lim.knee.value = 0; lim.ratio.value = 20; lim.attack.value = .002; lim.release.value = .1;
    out = ctx.createGain(); out.gain.value = mutedV ? 0 : .7;
    music = ctx.createGain(); music.gain.value = 1;
    const verb = ctx.createConvolver(), len = ctx.sampleRate * 2.4, ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) { const d = ir.getChannelData(ch); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6); }
    verb.buffer = ir; const wet = ctx.createGain(); wet.gain.value = .22;
    music.connect(comp); music.connect(verb); verb.connect(wet); wet.connect(comp); comp.connect(lim); lim.connect(out); out.connect(ctx.destination);
    const nb = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate), nd = nb.getChannelData(0); for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
    return nb;
  }
  function schedule(fromBeat) {
    const noiseBuf = build(), T = b => t0 + (b - fromBeat) * beatS;
    from = fromBeat; t0 = ctx.currentTime + .08;
    const env = (g, t, a, peak, dur, rel) => { g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(peak, t + a); g.gain.setValueAtTime(peak, Math.max(t + a, t + dur - rel)); g.gain.linearRampToValueAtTime(0, t + dur); };
    const osc = (type, f0, t, dur, peak, a = .01, rel = .08, lp = 0, dest = music, det = 0) => { const o = ctx.createOscillator(), g = ctx.createGain(); o.type = type; o.frequency.value = f0; o.detune.value = det; let n = o; if (lp) { const fl = ctx.createBiquadFilter(); fl.type = 'lowpass'; fl.frequency.value = lp; o.connect(fl); n = fl; } n.connect(g); g.connect(dest); env(g, t, a, peak, dur, Math.min(rel, dur * .9)); o.start(t); o.stop(t + dur + .05); return o; };
    const noise = (t, dur, peak, type, fq, q = 1, sweep) => { const s = ctx.createBufferSource(), fl = ctx.createBiquadFilter(), g = ctx.createGain(); s.buffer = noiseBuf; s.loop = true; fl.type = type; fl.frequency.setValueAtTime(fq, t); fl.Q.value = q; if (sweep) fl.frequency.exponentialRampToValueAtTime(sweep, t + dur); s.connect(fl); fl.connect(g); g.connect(music); g.gain.setValueAtTime(peak, t); g.gain.exponentialRampToValueAtTime(.0005, t + dur); s.start(t); s.stop(t + dur + .02); };
    const kick = (t, v) => { const o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.setValueAtTime(130, t); o.frequency.exponentialRampToValueAtTime(42, t + .18); g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.001, t + .4); o.connect(g); g.connect(music); o.start(t); o.stop(t + .42); };
    const boom = (t, v) => { const o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.setValueAtTime(78, t); o.frequency.exponentialRampToValueAtTime(30, t + 1.4); g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.001, t + 2.2); o.connect(g); g.connect(music); o.start(t); o.stop(t + 2.3); noise(t, 1.6, v * .25, 'lowpass', 400); };
    const chordAt = b => { const k = Math.floor(b / 4) % K.prog.length, [st, q] = K.prog[k]; const r0 = K.root + st; return [r0, r0 + (q === 'm' ? 3 : 4), r0 + 7]; };
    const braam = (t, b, v) => { for (const n of [chordAt(b)[0] - 12, chordAt(b)[0], chordAt(b)[2] - 12]) for (const dt of [-9, 9]) { const o = ctx.createOscillator(), fl = ctx.createBiquadFilter(), g = ctx.createGain(); o.type = 'sawtooth'; o.frequency.value = hz(n); o.detune.value = dt; fl.type = 'lowpass'; fl.frequency.setValueAtTime(180, t); fl.frequency.exponentialRampToValueAtTime(1500, t + .35); fl.frequency.exponentialRampToValueAtTime(260, t + 2.6); o.connect(fl); fl.connect(g); g.connect(music); env(g, t, .06, v, 3, 1.4); o.start(t); o.stop(t + 3.1); } };
    const motifR = hashRand(f.id * 97 + 11), scale = K.prog[0][1] === 'm' ? [0, 2, 3, 5, 7, 8, 10] : [0, 2, 4, 5, 7, 9, 11];
    const motif = Array.from({ length: 8 }, () => motifR() < .25 ? null : scale[Math.floor(motifR() * 5)]);
    const lead = (t, n, dur, v) => {
      if (K.motif === 'piano') { osc('triangle', hz(n), t, dur, v, .005, dur * .8, 2400); osc('sine', hz(n + 12), t, dur * .6, v * .3, .005, dur * .5); }
      else if (K.motif === 'bell' || K.motif === 'box') { osc('sine', hz(n + 12), t, dur, v * .8, .002, dur * .9); osc('sine', hz(n + 12) * 2.76, t, dur * .4, v * .25, .002, dur * .35); }
      else if (K.motif === 'brass') osc('sawtooth', hz(n), t, dur, v * .7, .06, .2, 1200);
      else if (K.motif === 'whistle') { const o = osc('sine', hz(n + 12), t, dur, v, .05, .2); const l = ctx.createOscillator(), lg = ctx.createGain(); l.frequency.value = 5.5; lg.gain.value = 6; l.connect(lg); lg.connect(o.frequency); l.start(t); l.stop(t + dur); }
      else osc('square', hz(n + 12), t, dur, v * .4, .01, .1, 1800);
    };
    const last = plan.beats, titleSeg = plan.segs.find(s => s.kind === 'title'), titleB = titleSeg ? titleSeg.b0 : last;
    for (let b = Math.max(0, Math.floor(fromBeat)); b < last; b++) {
      const s = energyAt(b), e = s.energy, t = T(b); if (t < ctx.currentTime) continue;
      if (s.silence) continue;
      const ch = chordAt(b), bar = b % 4 === 0;
      // pad: always there, swelling with the energy
      if (bar && s.kind !== 'black') for (const n of ch) for (const dt of [-7, 7]) osc(fam === 'horror' ? 'sine' : 'sawtooth', hz(n), t, beatS * 4.1, .018 + e * .02, .5, .7, fam === 'horror' ? 0 : 700 + e * 1400, music, dt);
      if (fam === 'horror' && bar) osc('sine', hz(ch[0] + 1), t, beatS * 4, .02, 1, 1);   // the wrong note under everything
      // motif: the quiet acts
      if (e < .45 && s.kind !== 'black') { const m = motif[(b * 2) % 8], m2 = motif[(b * 2 + 1) % 8], oct = Math.floor(b / 8) % 2 ? 12 : 0; if (m !== null) lead(t, K.root + 12 + m + oct, beatS * 1.6, .07); if (m2 !== null && e > .2) lead(t + beatS / 2, K.root + 12 + m2 + oct, beatS * 1.2, .05); }
      // pulse: the setup onwards
      if (e >= .25 && s.kind !== 'black') for (let k = 0; k < (e > .6 ? 4 : 2); k++) {
        const tt = t + k * beatS / (e > .6 ? 4 : 2), n = ch[0] - 12 + (k % 2 && K.pulse === 'arp' ? 7 : 0) + (K.pulse === 'arp' && k === 3 ? 12 : 0);
        if (K.pulse === 'pizz' || K.pulse === 'pluck') osc('triangle', hz(n + 12), tt, .18, .07, .003, .15, 1600);
        else if (K.pulse === 'drone') osc('sine', hz(n), tt, beatS * .9, .03, .2, .3);
        else if (K.pulse === 'arp') osc('square', hz(n + 12 + scale[(b + k) % 4 * 2 % 7]), tt, .16, .035, .005, .12, 2200);
        else osc('sawtooth', hz(n), tt, beatS / (e > .6 ? 4.2 : 2.2), .05, .005, .06, 500 + e * 900);
      }
      // drums: the build
      if (K.drums !== 'none' && e >= .6 && s.kind !== 'black') {
        const big = K.drums === 'big', pop = K.drums === 'pop', march = K.drums === 'march';
        if (b % 2 === 0 || big) kick(t, big ? .42 : .3);
        if (b % 2 === 1) { noise(t, pop ? .1 : .16, pop ? .16 : .2, 'bandpass', pop ? 1300 : 1900, .8); if (pop) noise(t + .015, .08, .1, 'bandpass', 1200); }
        if (e > .7 && !march) for (let k = 0; k < 2; k++) noise(t + k * beatS / 2, .04, .05, 'highpass', 7500);
        if (march && b % 2 === 0) for (let k = 1; k < 4; k++) noise(t + k * beatS / 4, .06, .07, 'bandpass', 2400, 2);
      } else if (K.drums === 'soft' && e >= .5 && bar) boom(t, .16);
      // hits on the edit
      if (s.b0 === b && s.hit === 'cut') { kick(t, .32); noise(t, .25, .08, 'highpass', 3000); }
      if (s.b0 === b && s.hit === 'braam') { if (!K.noBraam) braam(t, b, .05); boom(t, .5); if (K.stinger) for (const n of [ch[0] + 24, ch[0] + 25, ch[0] + 30, ch[0] + 31]) osc('sawtooth', hz(n), t, .9, .025, .005, .7, 3000); }
      if (s.b0 === b && (s.cut === 'whip' || s.cut === 'dip')) noise(t - beatS * .25, beatS * .5, .06, 'bandpass', 500, 1.2, 4000);
      if (s.b0 === b && s.sting) { const tt = t + s.beats * beatS * .8; for (const n of [ch[0] + 24, ch[0] + 25, ch[0] + 31]) osc('sawtooth', hz(n), tt, .7, .03, .003, .6, 3500); boom(tt, .4); }
    }
    // the riser into the silence, the slam, the tail
    const rB = titleB - 9; if (rB >= fromBeat) { const t = T(rB), dur = 8 * beatS; noise(t, dur, .09, 'bandpass', 300, 1.5, 7000); const o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'sawtooth'; o.frequency.setValueAtTime(hz(K.root), t); o.frequency.exponentialRampToValueAtTime(hz(K.root + 24), t + dur); const fl = ctx.createBiquadFilter(); fl.type = 'lowpass'; fl.frequency.value = 1400; o.connect(fl); fl.connect(g); g.connect(music); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.05, t + dur); g.gain.linearRampToValueAtTime(0, t + dur + .03); o.start(t); o.stop(t + dur + .05); }
    if (titleB >= fromBeat) { const t = T(titleB); boom(t, .7); if (!K.noBraam) braam(t, 0, .06); else for (const n of chordAt(0)) osc('triangle', hz(n + 12), t, beatS * 8, .06, .01, beatS * 6); noise(t, 3.5, .1, 'highpass', 4500); for (const n of chordAt(0)) osc('sawtooth', hz(n), t, beatS * 8, .02, .02, beatS * 6, 900); }
  }
  return {
    start(fromMs = 0) { try { if (ctx) { try { ctx.close(); } catch (e) { } } schedule(fromMs / 1000 / beatS); return true; } catch (e) { ctx = null; return false; } },
    time() { return ctx ? (ctx.currentTime - t0 + from * beatS) * 1000 : null; },
    pause(p) { if (ctx) p ? ctx.suspend() : ctx.resume(); },
    mute(m) { mutedV = m; if (out) out.gain.setTargetAtTime(m ? 0 : .7, ctx.currentTime, .03); },
    duck(d) { if (music && ctx) music.gain.setTargetAtTime(d ? .35 : 1, ctx.currentTime, .15); },
    fade(ms = 2000) { if (!ctx) return; out.gain.setTargetAtTime(0, ctx.currentTime, ms / 4000); const c = ctx; setTimeout(() => { try { c.close(); } catch (e) { } }, ms + 300); ctx = null; },
    stop() { if (ctx) { try { ctx.close(); } catch (e) { } ctx = null; } },
    live() { return !!ctx; }
  };
}

// ---- the picture ----
const T4_CSS = `
#trailer.v4{position:fixed;inset:0;z-index:9500;background:#000;display:grid;place-items:center}
#trailer.v4 .t4{position:relative;width:min(100vw,calc(100vh*16/9));aspect-ratio:16/9;overflow:hidden;background:#000}
#trailer.v4 .t4-seg{position:absolute;inset:0;opacity:0;overflow:hidden}
#trailer.v4 .t4-seg.on{opacity:1}
#trailer.v4 .t4-seg.on.cut-fade,#trailer.v4 .t4-seg.on.cut-dip{animation:t4in .5s ease forwards}
@keyframes t4in{from{opacity:0}to{opacity:1}}
#trailer.v4 .t4-seg.on.cut-whip{animation:t4whip .28s cubic-bezier(.2,.8,.2,1)}
@keyframes t4whip{from{transform:translateX(24%);filter:blur(14px)}to{transform:none;filter:none}}
#trailer.v4 .t4-seg.on.cut-flash::after{content:"";position:absolute;inset:0;background:#fff;animation:t4flash .22s ease-out forwards;z-index:9}
@keyframes t4flash{from{opacity:.9}to{opacity:0}}
#trailer.v4 .t4-shot{position:absolute;inset:-2%}
#trailer.v4 .t4-shot>svg{width:100%;height:100%;display:block;transform-origin:50% 55%}
#trailer.v4 .t4-seg.on .t4-shot>svg{animation:var(--cam) var(--d) var(--ease,linear) both}
#trailer.v4 .t4-seg.on.focus .t4-shot{animation:t4focus 1.4s ease-out both}
@keyframes t4focus{from{filter:blur(6px) brightness(.8)}to{filter:none}}
@keyframes t4push{from{transform:scale(1.02)}to{transform:scale(1.2)}}
@keyframes t4pull{from{transform:scale(1.22) translateY(-1%)}to{transform:scale(1.03)}}
@keyframes t4panl{from{transform:scale(1.16) translateX(4%)}to{transform:scale(1.16) translateX(-4%)}}
@keyframes t4panr{from{transform:scale(1.16) translateX(-4%)}to{transform:scale(1.16) translateX(4%)}}
@keyframes t4tilt{from{transform:scale(1.16) translateY(4%)}to{transform:scale(1.16) translateY(-3%)}}
@keyframes t4orbit{from{transform:scale(1.2) rotate(-1.6deg) translateX(3%)}to{transform:scale(1.14) rotate(1.4deg) translateX(-3%)}}
@keyframes t4drift{from{transform:scale(1.08) translate(-1.5%,1%)}to{transform:scale(1.12) translate(1.5%,-1%)}}
@keyframes t4crash{0%{transform:scale(1.02)}35%{transform:scale(1.32)}100%{transform:scale(1.36)}}
@keyframes t4hand{0%{transform:scale(1.12) translate(0,0) rotate(0)}20%{transform:scale(1.13) translate(-.6%,.4%) rotate(-.4deg)}40%{transform:scale(1.12) translate(.5%,-.3%) rotate(.3deg)}60%{transform:scale(1.14) translate(-.3%,-.5%) rotate(-.2deg)}80%{transform:scale(1.13) translate(.6%,.3%) rotate(.4deg)}100%{transform:scale(1.15) translate(0,0) rotate(0)}}
#trailer.v4 .L-bg,#trailer.v4 .L-act,#trailer.v4 .L-fg,#trailer.v4 .L-a{transform-box:fill-box;transform-origin:50% 100%}
#trailer.v4 .t4-seg.on .L-bg{animation:t4par var(--d) linear both;--amp:calc(var(--px) * 5px)}
#trailer.v4 .t4-seg.on .L-fg{animation:t4par var(--d) linear both;--amp:calc(var(--px) * -26px)}
@keyframes t4par{from{transform:translateX(calc(var(--amp) * -1))}to{transform:translateX(var(--amp))}}
#trailer.v4 .t4-seg.on.am-walk .L-a{animation:t4walk var(--d) cubic-bezier(.25,.6,.3,1) both}
#trailer.v4 .t4-seg.on.am-walkr .L-a{animation:t4walkr var(--d) cubic-bezier(.25,.6,.3,1) both}
@keyframes t4walk{0%{transform:translateX(-70px) translateY(0)}12%{transform:translateX(-58px) translateY(-1.5px)}25%{transform:translateX(-45px) translateY(0)}37%{transform:translateX(-33px) translateY(-1.5px)}50%{transform:translateX(-21px) translateY(0)}62%{transform:translateX(-11px) translateY(-1px)}75%{transform:translateX(-4px)}100%{transform:none}}
@keyframes t4walkr{0%{transform:translateX(70px)}12%{transform:translateX(58px) translateY(-1.5px)}25%{transform:translateX(45px)}37%{transform:translateX(33px) translateY(-1.5px)}50%{transform:translateX(21px)}62%{transform:translateX(11px) translateY(-1px)}75%{transform:translateX(4px)}100%{transform:none}}
#trailer.v4 .t4-seg.on.am-approach .L-act{animation:t4appr var(--d) ease-out both}
@keyframes t4appr{from{transform:scale(.9) translateY(4px)}to{transform:scale(1.07)}}
#trailer.v4 .t4-seg.on.am-turn .L-a{animation:t4turn var(--d) ease-in-out both}
@keyframes t4turn{0%,45%{transform:scaleX(1)}55%,100%{transform:scaleX(-1)}}
#trailer.v4 .t4-seg.on.am-idle .L-a{animation:t4breath 2.4s ease-in-out infinite alternate}
@keyframes t4breath{from{transform:scaleY(1) rotate(-.3deg)}to{transform:scaleY(1.016) rotate(.4deg)}}
#trailer.v4 .t4-grade{position:absolute;inset:0;pointer-events:none;mix-blend-mode:overlay;opacity:.9}
#trailer.v4 .g-drama .t4-shot{filter:saturate(.9) contrast(1.05)} #trailer.v4 .g-drama .t4-grade{background:linear-gradient(180deg,rgba(40,60,90,.35),rgba(200,150,90,.25))}
#trailer.v4 .g-action .t4-shot,#trailer.v4 .g-hero .t4-shot{filter:contrast(1.25) saturate(1.05) brightness(.92)} #trailer.v4 .g-action .t4-grade,#trailer.v4 .g-hero .t4-grade{background:linear-gradient(180deg,rgba(0,90,120,.5),rgba(255,130,40,.45))}
#trailer.v4 .g-war .t4-shot{filter:saturate(.55) contrast(1.2) sepia(.15)} #trailer.v4 .g-war .t4-grade{background:rgba(90,80,50,.4)}
#trailer.v4 .g-horror .t4-shot{filter:saturate(.45) contrast(1.25) brightness(.78)} #trailer.v4 .g-horror .t4-grade{background:radial-gradient(70% 70% at 50% 45%,transparent,rgba(0,20,10,.85))}
#trailer.v4 .g-crime .t4-shot{filter:saturate(.75) contrast(1.15)} #trailer.v4 .g-crime .t4-grade{background:linear-gradient(180deg,rgba(0,80,90,.45),rgba(30,20,10,.35))}
#trailer.v4 .g-romance .t4-shot,#trailer.v4 .g-musical .t4-shot{filter:brightness(1.06) saturate(1.1) contrast(.95)} #trailer.v4 .g-romance .t4-grade,#trailer.v4 .g-musical .t4-grade{background:radial-gradient(80% 70% at 70% 30%,rgba(255,190,140,.55),transparent)}
#trailer.v4 .g-scifi .t4-shot{filter:saturate(1.15) hue-rotate(-10deg) contrast(1.1)} #trailer.v4 .g-scifi .t4-grade{background:linear-gradient(180deg,rgba(0,40,120,.5),rgba(0,160,170,.3))}
#trailer.v4 .g-fantasy .t4-shot{filter:saturate(1.15) contrast(1.05)} #trailer.v4 .g-fantasy .t4-grade{background:radial-gradient(70% 60% at 50% 20%,rgba(255,220,150,.5),rgba(40,20,80,.35))}
#trailer.v4 .g-western .t4-shot{filter:sepia(.35) saturate(1.1) contrast(1.08)} #trailer.v4 .g-western .t4-grade{background:linear-gradient(180deg,rgba(255,170,80,.4),rgba(120,60,20,.35))}
#trailer.v4 .g-comedy .t4-shot,#trailer.v4 .g-toon .t4-shot{filter:saturate(1.2) brightness(1.04)}
#trailer.v4 .g-doc .t4-shot{filter:saturate(.85) contrast(1.05)}
#trailer.v4 .t4-fx{position:absolute;inset:0;pointer-events:none;opacity:.8}
#trailer.v4 .fx-dust{background-image:radial-gradient(1.5px 1.5px at 20% 30%,rgba(255,240,200,.7),transparent),radial-gradient(1px 1px at 70% 60%,rgba(255,240,200,.6),transparent),radial-gradient(2px 2px at 40% 80%,rgba(255,240,200,.5),transparent),radial-gradient(1px 1px at 85% 20%,rgba(255,240,200,.7),transparent);background-size:300px 220px;animation:t4float 14s linear infinite}
#trailer.v4 .fx-motes{background-image:radial-gradient(2px 2px at 15% 40%,rgba(255,230,160,.9),transparent),radial-gradient(3px 3px at 60% 70%,rgba(255,210,120,.7),transparent),radial-gradient(1.5px 1.5px at 80% 25%,rgba(255,250,200,.9),transparent);background-size:260px 260px;animation:t4float 10s linear infinite}
#trailer.v4 .fx-embers{background-image:radial-gradient(2px 2px at 25% 80%,rgba(255,140,40,.95),transparent),radial-gradient(1.5px 1.5px at 65% 60%,rgba(255,90,20,.9),transparent),radial-gradient(2.5px 2.5px at 85% 90%,rgba(255,170,60,.8),transparent);background-size:240px 300px;animation:t4rise 5s linear infinite}
#trailer.v4 .fx-sparks{background-image:radial-gradient(1.5px 1.5px at 30% 50%,rgba(255,200,120,.95),transparent),radial-gradient(1px 1px at 75% 30%,rgba(255,255,200,.9),transparent);background-size:180px 200px;animation:t4rise 3s linear infinite}
#trailer.v4 .fx-stars{background-image:radial-gradient(1px 1px at 10% 20%,#fff,transparent),radial-gradient(1px 1px at 50% 60%,#cfe,transparent),radial-gradient(1.5px 1.5px at 80% 40%,#fff,transparent);background-size:220px 160px;animation:t4float 30s linear infinite;opacity:.5}
#trailer.v4 .fx-fog{background:linear-gradient(90deg,transparent,rgba(200,210,200,.18),transparent 60%),linear-gradient(90deg,transparent 30%,rgba(200,210,200,.12),transparent);background-size:200% 100%;animation:t4fog 18s linear infinite}
#trailer.v4 .fx-smoke{background:radial-gradient(60% 40% at 30% 70%,rgba(200,200,200,.12),transparent),radial-gradient(50% 30% at 70% 40%,rgba(200,200,200,.1),transparent);animation:t4fog 22s linear infinite;background-size:200% 100%}
#trailer.v4 .fx-bokeh{background-image:radial-gradient(10px 10px at 20% 30%,rgba(255,220,180,.35),transparent),radial-gradient(16px 16px at 75% 25%,rgba(255,200,220,.25),transparent),radial-gradient(8px 8px at 60% 75%,rgba(255,240,200,.3),transparent);background-size:400px 300px;animation:t4float 20s linear infinite}
@keyframes t4float{from{background-position:0 0}to{background-position:120px -220px}}
@keyframes t4rise{from{background-position:0 0}to{background-position:-40px -300px}}
@keyframes t4fog{from{background-position:0 0}to{background-position:-200% 0}}
#trailer.v4 .flicker .t4-shot{animation:t4flick 3.1s steps(1) infinite}
@keyframes t4flick{0%,100%{opacity:1}7%{opacity:.7}8%{opacity:1}53%{opacity:.82}54%{opacity:1}}
#trailer.v4 .t4-bars::before,#trailer.v4 .t4-bars::after{content:"";position:absolute;left:0;right:0;height:12%;background:#000;z-index:8}
#trailer.v4 .t4-bars::before{top:0}#trailer.v4 .t4-bars::after{bottom:0}
#trailer.v4 .t4-grain{position:absolute;inset:-50%;z-index:7;pointer-events:none;opacity:.07;background-image:repeating-radial-gradient(circle at 17% 32%,#fff 0 .5px,transparent 1px 3px);animation:t4grain .5s steps(4) infinite}
@keyframes t4grain{0%{transform:translate(0,0)}25%{transform:translate(-3%,2%)}50%{transform:translate(2%,-3%)}75%{transform:translate(-2%,-1%)}100%{transform:translate(1%,3%)}}
#trailer.v4 .t4-vig{position:absolute;inset:0;z-index:6;pointer-events:none;background:radial-gradient(80% 75% at 50% 50%,transparent 45%,rgba(0,0,0,.72));box-shadow:inset 0 0 120px rgba(0,0,0,.5)}
#trailer.v4 .t4-dim .t4-shot{filter:brightness(.42) saturate(.8)!important}
#trailer.v4 .t4-vo{position:absolute;inset:0;z-index:5;display:flex;flex-wrap:wrap;align-content:center;justify-content:center;gap:0 .32em;padding:0 9%;text-align:center;color:#F6EEDC;font:800 clamp(18px,3.7vw,46px)/1.15 var(--f-display,sans-serif);text-transform:uppercase;letter-spacing:.12em;text-shadow:0 2px 18px rgba(0,0,0,.9)}
#trailer.v4 .t4-vo i{font-style:normal;opacity:0;display:inline-block}
#trailer.v4 .t4-seg.on .t4-vo i{animation:t4word .55s cubic-bezier(.2,.8,.2,1) forwards;animation-delay:var(--wd)}
@keyframes t4word{from{opacity:0;transform:translateY(10px) scale(1.1);filter:blur(5px)}to{opacity:1;transform:none;filter:none}}
#trailer.v4 .t4-seg.on .t4-vo{animation:t4out var(--d) linear forwards}
@keyframes t4out{0%,86%{opacity:1}100%{opacity:0}}
#trailer.v4 .f-horror .t4-vo{font:300 clamp(16px,3vw,36px)/1.3 Georgia,serif;letter-spacing:.35em}
#trailer.v4 .f-romance .t4-vo,#trailer.v4 .f-drama .t4-vo,#trailer.v4 .f-doc .t4-vo{font:italic 400 clamp(18px,3.4vw,40px)/1.25 Georgia,serif;letter-spacing:.06em;text-transform:none}
#trailer.v4 .f-scifi .t4-vo{font:600 clamp(15px,2.6vw,32px)/1.3 var(--f-mono,monospace);letter-spacing:.4em}
#trailer.v4 .f-action .t4-vo,#trailer.v4 .f-hero .t4-vo,#trailer.v4 .f-war .t4-vo{background:linear-gradient(180deg,#fff,#c9ced6 55%,#7c828c);-webkit-background-clip:text;background-clip:text;color:transparent;text-shadow:none;filter:drop-shadow(0 3px 10px rgba(0,0,0,.8))}
#trailer.v4 .f-comedy .t4-vo,#trailer.v4 .f-toon .t4-vo{color:#FFE37A;letter-spacing:.04em}
#trailer.v4 .t4-line{position:absolute;left:10%;right:10%;bottom:15%;z-index:5;text-align:center;color:#fff;text-shadow:0 2px 10px #000,0 0 3px #000;opacity:0}
#trailer.v4 .t4-seg.on .t4-line{animation:t4up .45s ease-out .1s forwards}
#trailer.v4 .t4-line q{display:block;font:italic 500 clamp(15px,2.4vw,26px)/1.35 Georgia,serif;quotes:"\\201C" "\\201D"}
#trailer.v4 .t4-line small{display:block;margin-top:.5em;font:600 clamp(9px,1.1vw,12px) var(--f-display,sans-serif);letter-spacing:.32em;text-transform:uppercase;opacity:.7}
@keyframes t4up{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
#trailer.v4 .t4-card{position:absolute;inset:0;z-index:5;display:grid;place-items:center;text-align:center;padding:0 10%;color:#F4EBD6;font:700 clamp(14px,2.5vw,28px)/1.3 var(--f-display,sans-serif);letter-spacing:.2em;text-transform:uppercase;text-shadow:0 2px 14px #000;opacity:0}
#trailer.v4 .t4-seg.on .t4-card{animation:t4card var(--d) ease forwards}
#trailer.v4 .t4-card.quote{font:italic 600 clamp(18px,3vw,34px)/1.3 Georgia,serif;letter-spacing:.04em;text-transform:none}
@keyframes t4card{0%{opacity:0;letter-spacing:.45em}20%{opacity:1;letter-spacing:.2em}85%{opacity:1}100%{opacity:0;letter-spacing:.24em}}
#trailer.v4 .t4-card .tv-logo{display:block;margin:0 auto 12px;width:58px}
#trailer.v4 .t4-title{position:absolute;inset:0;z-index:5;display:grid;place-items:center;align-content:center;gap:16px;padding:0 6%;text-align:center}
#trailer.v4 .t4-title b{position:relative;font:900 clamp(28px,7vw,92px)/1 var(--f-display,sans-serif);letter-spacing:.07em;color:var(--tc,#fff);text-shadow:0 0 34px rgba(255,255,255,.18),0 4px 22px #000;opacity:0;overflow:hidden}
#trailer.v4 .t4-seg.on .t4-title b{animation:t4slam .6s cubic-bezier(.15,1.6,.4,1) forwards}
#trailer.v4 .t4-title b::after{content:"";position:absolute;inset:0;background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,.55) 50%,transparent 60%);transform:translateX(-120%)}
#trailer.v4 .t4-seg.on .t4-title b::after{animation:t4shine 1.4s ease-out 1.1s forwards}
@keyframes t4slam{from{opacity:0;transform:scale(1.6);filter:blur(10px)}to{opacity:1;transform:none;filter:none}}
@keyframes t4shine{to{transform:translateX(120%)}}
#trailer.v4 .t4-bill{font:600 clamp(7px,1vw,11px)/1.25 var(--f-display,sans-serif);letter-spacing:.06em;color:rgba(255,255,255,.7);text-transform:uppercase;transform:scaleY(1.55);max-width:78%;opacity:0}
#trailer.v4 .t4-seg.on .t4-bill{animation:t4up .7s ease-out 1.6s forwards}
#trailer.v4 .t4.shake{animation:t4shake .35s linear}
@keyframes t4shake{0%,100%{transform:none}20%{transform:translate(-6px,3px)}40%{transform:translate(5px,-4px)}60%{transform:translate(-3px,2px)}80%{transform:translate(2px,-1px)}}
#trailer.v4 .t4-bar{position:absolute;left:0;right:0;bottom:0;z-index:20;display:flex;gap:8px;align-items:center;padding:10px 14px;background:linear-gradient(transparent,rgba(0,0,0,.75));opacity:0;transition:opacity .3s}
#trailer.v4.ui .t4-bar,#trailer.v4.paused .t4-bar,#trailer.v4.ended .t4-bar{opacity:1}#trailer.v4:not(.ui){cursor:none}
#trailer.v4 .t4-bar button{all:unset;cursor:pointer;color:#fff;font-size:15px;padding:4px 8px;border-radius:6px}#trailer.v4 .t4-bar button:hover{background:rgba(255,255,255,.15)}
#trailer.v4 .t4-prog{flex:1;height:4px;background:rgba(255,255,255,.25);border-radius:2px;cursor:pointer;position:relative}#trailer.v4 .t4-prog i{position:absolute;left:0;top:0;bottom:0;background:#fff;border-radius:2px}
#trailer.v4 .t4-time{color:#ddd;font:12px var(--f-mono,monospace)}
@media (prefers-reduced-motion:reduce){#trailer.v4 *{animation-duration:.01ms!important;animation-iteration-count:1!important}}`;
const T4_CAM = { push: 't4push', pull: 't4pull', panl: 't4panl', panr: 't4panr', tilt: 't4tilt', orbit: 't4orbit', drift: 't4drift', crash: 't4crash', handheld: 't4hand' };
function t4Style() { if (document.getElementById('t4css')) return; const st = document.createElement('style'); st.id = 't4css'; st.textContent = T4_CSS; document.head.appendChild(st); }
playTrailer = function (id) {
  const f = S.films[id]; if (!f || typeof document === 'undefined') return;
  t4Style(); if (typeof tv3Hush === 'function') tv3Hush(); if (typeof songStop === 'function') songStop();
  const old = document.getElementById('trailer'); if (old) old.remove();
  const plan = t4Plan(f), K = plan.K, beatMs = plan.beatS * 1000, total = plan.total, c = GENRE_LOOK[f.genre] || GENRE_LOOK.Drama, fam = plan.fam;
  const el = document.createElement('div'); el.id = 'trailer'; el.className = `v4 g-${K.grade} f-${fam}`; el.style.setProperty('--tc', c[2]);
  const segHTML = (s, k) => {
    const d = s.beats * beatMs, px = s.move === 'panl' ? 1 : s.move === 'panr' ? -1 : (k % 2 ? .6 : -.6), dim = s.kind === 'vo' || s.kind === 'card' || s.kind === 'title';
    const ease = s.move === 'crash' ? 'cubic-bezier(.1,.9,.2,1)' : s.beats <= 2 ? 'cubic-bezier(.2,.6,.4,1)' : 'linear';
    const shot = s.kind === 'black' || (s.kind === 'card' && s.logo && k > 3) ? '' : `<div class="t4-shot">${stillSVG(f, s.shot ?? k, 960, true)}</div><div class="t4-grade"></div>${K.fx ? `<div class="t4-fx fx-${K.fx}"></div>` : ''}`;
    let over = '';
    if (s.kind === 'vo') over = `<div class="t4-vo">${String(s.text || '').split(/\s+/).map((w, i) => `<i style="--wd:${Math.round(i * Math.min(beatMs / 2, 260))}ms">${esc(w)}</i>`).join(' ')}</div>`;
    else if (s.kind === 'line') over = `<div class="t4-line"><q>${esc(s.text || '')}</q>${s.who !== undefined && P(s.who) ? `<small>${esc(P(s.who).name)}</small>` : ''}</div>`;
    else if (s.kind === 'card') over = `<div class="t4-card${s.quote ? ' quote' : ''}"><div>${s.logo ? logoSVGFor(f).replace('<svg', '<svg class="tv-logo"') : ''}${esc(s.text || '')}</div></div>`;
    else if (s.kind === 'title') over = `<div class="t4-title"><b>${esc(f.title)}</b><span class="t4-bill">${esc(typeof tv3Billing === 'function' ? tv3Billing(f) : '')}</span></div>`;
    return `<div class="t4-seg cut-${s.cut}${dim ? ' t4-dim' : ''}${s.focus ? ' focus' : ''} am-${s.am}${fam === 'horror' && k % 3 === 1 ? ' flicker' : ''}" style="--d:${Math.round(d + 400)}ms;--cam:${T4_CAM[s.move] || 't4push'};--ease:${ease};--px:${px}">${shot}${over}</div>`;
  };
  el.innerHTML = `<div class="t4 t4-bars">${plan.segs.map(segHTML).join('')}<div class="t4-vig"></div><div class="t4-grain"></div>
   <div class="t4-bar"><button class="t4-play" aria-label="Pause">❚❚</button><button class="t4-again" aria-label="Replay">↺</button><span class="t4-prog"><i></i></span><span class="t4-time">0:00 / ${fmtClock(total)}</span><button class="t4-voice" title="Narrator and voices">${TV3.voice ? '🎙' : '🎙̸'}</button><button class="t4-mute" aria-label="Mute">🔊</button><button class="t4-close" aria-label="Close">✕</button></div></div>`;
  document.body.appendChild(el);
  const box = el.querySelector('.t4'), segs = [...el.querySelectorAll('.t4-seg')], bar = el.querySelector('.t4-prog i'), clock = el.querySelector('.t4-time'), playB = el.querySelector('.t4-play'), muteB = el.querySelector('.t4-mute'), voiceB = el.querySelector('.t4-voice');
  const starts = plan.segs.map(s => s.b0 * beatMs);
  let A = t4Score(plan, f), cur = -1, paused = false, muted = false, raf = 0, done = false, perf0 = 0, perfOff = 0, audio = false;
  const now = () => { const a = audio ? A.time() : null; return a !== null && a !== undefined ? a : perfOff + (paused ? 0 : performance.now() - perf0); };
  const fx = (n, cls) => { n.classList.remove(cls); void n.offsetWidth; n.classList.add(cls); };
  const enter = k => {
    const s = plan.segs[k], prev = segs[cur]; if (prev) prev.classList.remove('on');
    const seg = segs[k]; void seg.offsetWidth; seg.classList.add('on');
    seg.querySelectorAll('svg').forEach(svg => { try { svg.setCurrentTime(0); svg.unpauseAnimations(); } catch (e) { } });
    if ((s.hit === 'cut' && (fam === 'action' || fam === 'war' || fam === 'hero')) || s.hit === 'slam' || s.hit === 'braam') fx(box, 'shake');
    if (typeof tv3Speak === 'function' && !muted) { if (s.kind === 'vo') { tv3Hush(); tv3Speak(s.text, 'vo', null, A); } else if (s.kind === 'line') { tv3Hush(); tv3Speak(s.text, 'line', s.who !== undefined && P(s.who) ? P(s.who).g : null, A); } else if (s.kind === 'title') { tv3Hush(); tv3Speak(f.title, 'vo', null, A); } }
    cur = k;
  };
  const finish = () => { done = true; el.classList.add('ended'); playB.textContent = '▶'; bar.style.width = '100%'; clock.textContent = `${fmtClock(total)} / ${fmtClock(total)}`; A.fade(2000); audio = false; };
  const tick = () => {
    const t = now();
    if (t >= total) { if (!done) finish(); return; }
    let k = cur; while (k + 1 < starts.length && t >= starts[k + 1]) k++; if (k < 0 && t >= 0) k = 0;
    if (k !== cur && k >= 0) enter(k);
    bar.style.width = (t / total * 100).toFixed(2) + '%'; clock.textContent = `${fmtClock(Math.max(0, t))} / ${fmtClock(total)}`;
    raf = requestAnimationFrame(tick);
  };
  const begin = (fromMs = 0) => { cancelAnimationFrame(raf); A.stop(); A = t4Score(plan, f); audio = A.start(fromMs); if (muted) A.mute(true); perfOff = fromMs; perf0 = performance.now(); segs.forEach(s => s.classList.remove('on')); cur = -1; done = false; paused = false; el.classList.remove('paused', 'ended'); playB.textContent = '❚❚'; raf = requestAnimationFrame(tick); };
  const setPause = p => { if (p === paused) return; if (p) perfOff = now(); else perf0 = performance.now(); paused = p; el.classList.toggle('paused', p); playB.textContent = p ? '▶' : '❚❚'; A.pause(p); if (p && typeof tv3Hush === 'function') tv3Hush(); el.querySelectorAll('svg').forEach(svg => { try { p ? svg.pauseAnimations() : svg.unpauseAnimations(); } catch (e) { } }); el.querySelectorAll('.t4-seg.on *').forEach(n => { n.style.animationPlayState = p ? 'paused' : ''; }); };
  const close = () => { cancelAnimationFrame(raf); if (typeof tv3Hush === 'function') tv3Hush(); A.stop(); el.remove(); document.removeEventListener('keydown', key, true); };
  const key = e => { if (e.key === 'Escape') { e.stopPropagation(); close(); } else if (e.key === ' ') { e.preventDefault(); e.stopPropagation(); done ? begin(0) : setPause(!paused); } };
  document.addEventListener('keydown', key, true);
  playB.onclick = e => { e.stopPropagation(); done ? begin(0) : setPause(!paused); };
  el.querySelector('.t4-again').onclick = e => { e.stopPropagation(); if (typeof tv3Hush === 'function') tv3Hush(); begin(0); };
  muteB.onclick = e => { e.stopPropagation(); muted = !muted; A.mute(muted); if (muted && typeof tv3Hush === 'function') tv3Hush(); muteB.textContent = muted ? '🔇' : '🔊'; };
  voiceB.onclick = e => { e.stopPropagation(); TV3.voice = !TV3.voice; try { localStorage.setItem('ab-trailer-voice', TV3.voice ? 'on' : 'off'); } catch (er) { } if (!TV3.voice) tv3Hush(); voiceB.textContent = TV3.voice ? '🎙' : '🎙̸'; };
  el.querySelector('.t4-close').onclick = e => { e.stopPropagation(); close(); };
  el.querySelector('.t4-prog').onclick = e => { e.stopPropagation(); const b = e.currentTarget.getBoundingClientRect(); if (typeof tv3Hush === 'function') tv3Hush(); begin(clamp((e.clientX - b.left) / b.width, 0, .995) * total); };
  let uiT = 0; el.addEventListener('mousemove', () => { el.classList.add('ui'); clearTimeout(uiT); uiT = setTimeout(() => el.classList.remove('ui'), 1800); });
  el.onclick = e => { if (e.target === el) close(); };
  begin(0);
};
