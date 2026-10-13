// ================= Trailers, take three: depth, pace and a voice =================
// Round 23. The trailers were stills with captions under them and black cards between: a silent film, minus the
// charm. Same scripts (trailerPlan2), new delivery:
//  - depth: every frame is drawn in layers (background, each actor, foreground) and the camera move pushes them at
//    different speeds, so a pan has parallax; the actors breathe and sway; light leaks and lens streaks on the cuts;
//  - pace: every shot lasts a whole number of beats of the score, so cuts land on the music; montages whip-pan;
//    the narrator's cards sit over moving footage instead of black; letterbox bars slide in at the start;
//  - a voice: the narrator speaks the voice-over through the browser's own speech (low and slow), characters speak
//    their lines, and the score ducks under them. A button turns voices off; nothing is fetched from anywhere;
//  - an ending: the title slams in over a billing block, the score rings out and stops (it used to play on).
// No dice: everything comes from the film and its hash, as before.
const TV3_CSS = `
#trailer.v3 .tv-screen{background:#000}
#trailer.v3 .tv-seg{transition:opacity .28s ease}
#trailer.v3 .tv-shot{position:absolute;inset:0;animation:none!important;filter:none}
#trailer.v3 .tv-shot svg{width:100%;height:100%;display:block;transform-origin:50% 50%;will-change:transform}
#trailer.v3 .tv-seg.on .tv-shot svg{animation:var(--cam) var(--d) linear forwards}
#trailer.v3 .tv-shot.dim svg{filter:brightness(.5) saturate(.8)}
@keyframes c3push{from{transform:scale(1.03)}to{transform:scale(1.17)}}
@keyframes c3pull{from{transform:scale(1.18)}to{transform:scale(1.04)}}
@keyframes c3panl{from{transform:scale(1.14) translateX(3.5%)}to{transform:scale(1.14) translateX(-3.5%)}}
@keyframes c3panr{from{transform:scale(1.14) translateX(-3.5%)}to{transform:scale(1.14) translateX(3.5%)}}
@keyframes c3tilt{from{transform:scale(1.14) translateY(3%)}to{transform:scale(1.14) translateY(-3%)}}
#trailer.v3 .L-bg,#trailer.v3 .L-act,#trailer.v3 .L-fg,#trailer.v3 .L-a{transform-box:fill-box;transform-origin:50% 100%}
#trailer.v3 .tv-seg.on .L-bg{animation:c3par var(--d) linear forwards;--amp:calc(var(--px) * 4px)}
#trailer.v3 .tv-seg.on .L-act{animation:c3par var(--d) linear forwards;--amp:calc(var(--px) * -9px)}
#trailer.v3 .tv-seg.on .L-fg{animation:c3par var(--d) linear forwards;--amp:calc(var(--px) * -18px)}
@keyframes c3par{from{transform:translateX(calc(var(--amp) * -1))}to{transform:translateX(var(--amp))}}
#trailer.v3 .tv-seg.on .L-a{animation:c3breath 2.6s ease-in-out infinite alternate}
#trailer.v3 .tv-seg.on .L-a1{animation-delay:-1.1s}#trailer.v3 .tv-seg.on .L-a2{animation-delay:-1.9s}
@keyframes c3breath{from{transform:scaleY(1) rotate(-.25deg)}to{transform:scaleY(1.014) rotate(.35deg)}}
#trailer.v3 .tv-seg.whip{animation:c3whip .3s ease-out}
@keyframes c3whip{from{transform:translateX(30%);filter:blur(9px)}to{transform:none;filter:none}}
#trailer.v3 .tv3-leak{position:absolute;inset:0;pointer-events:none;mix-blend-mode:screen;opacity:0;background:radial-gradient(60% 80% at var(--lx,80%) 30%,rgba(255,170,90,.55),transparent 70%)}
#trailer.v3 .tv3-leak.go{animation:c3leak 1.1s ease-out}
@keyframes c3leak{0%{opacity:0}25%{opacity:.85}100%{opacity:0}}
#trailer.v3 .tv3-streak{position:absolute;left:-10%;right:-10%;top:48%;height:2px;background:linear-gradient(90deg,transparent,rgba(160,210,255,.9),transparent);opacity:0;pointer-events:none}
#trailer.v3 .tv3-streak.go{animation:c3streak .5s ease-out}
@keyframes c3streak{0%{opacity:0;transform:scaleX(.2)}30%{opacity:1}100%{opacity:0;transform:scaleX(1.3)}}
#trailer.v3 .tv3-bars::before,#trailer.v3 .tv3-bars::after{content:"";position:absolute;left:0;right:0;height:0;background:#000;z-index:5;transition:height .9s cubic-bezier(.2,.8,.2,1)}
#trailer.v3 .tv3-bars::before{top:0}#trailer.v3 .tv3-bars::after{bottom:0}
#trailer.v3 .tv3-bars.in::before,#trailer.v3 .tv3-bars.in::after{height:9%}
#trailer.v3 .tv3-vo{position:absolute;left:5%;right:5%;top:50%;transform:translateY(-50%);text-align:center;color:#F7EFE0;font:800 clamp(20px,4.4vw,44px)/1.1 var(--f-display,sans-serif);text-transform:uppercase;text-shadow:0 2px 14px rgba(0,0,0,.9);opacity:0;z-index:4}
#trailer.v3 .tv-seg.on .tv3-vo{animation:c3track var(--d) cubic-bezier(.2,.7,.2,1) forwards}
@keyframes c3track{0%{opacity:0;letter-spacing:.55em;filter:blur(5px)}18%{opacity:1;letter-spacing:.16em;filter:none}85%{opacity:1;letter-spacing:.2em}100%{opacity:0;letter-spacing:.22em}}
#trailer.v3 .tv3-line{position:absolute;left:8%;right:8%;bottom:15%;text-align:center;color:#fff;z-index:4;opacity:0;text-shadow:0 2px 10px #000,0 0 3px #000}
#trailer.v3 .tv3-line q{display:block;font:italic 600 clamp(17px,2.9vw,30px)/1.3 Georgia,'Times New Roman',serif;quotes:"\\201C" "\\201D"}
#trailer.v3 .tv3-line small{display:block;margin-top:.45em;font:600 clamp(10px,1.3vw,13px) var(--f-display,sans-serif);letter-spacing:.3em;text-transform:uppercase;opacity:.75}
#trailer.v3 .tv-seg.on .tv3-line{animation:c3up .5s ease-out .15s forwards}
@keyframes c3up{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
#trailer.v3 .tv3-title{position:absolute;inset:0;display:grid;place-items:center;align-content:center;gap:14px;z-index:4;text-align:center;padding:0 6%}
#trailer.v3 .tv3-title b{font:900 clamp(30px,7.4vw,84px)/1 var(--f-display,sans-serif);letter-spacing:.06em;color:var(--tc,#fff);text-shadow:0 0 30px rgba(255,255,255,.18),0 4px 18px #000;opacity:0}
#trailer.v3 .tv-seg.on .tv3-title b{animation:c3slam .7s cubic-bezier(.2,1.5,.4,1) forwards}
@keyframes c3slam{from{opacity:0;transform:scale(1.5);filter:blur(6px)}to{opacity:1;transform:none;filter:none}}
#trailer.v3 .tv3-bill{font:600 clamp(7px,1.05vw,11px)/1.25 var(--f-display,sans-serif);letter-spacing:.06em;color:rgba(255,255,255,.72);text-transform:uppercase;transform:scaleY(1.55);max-width:80%;opacity:0}
#trailer.v3 .tv-seg.on .tv3-bill{animation:c3up .6s ease-out .8s forwards}
#trailer.v3 .tv3-card{position:absolute;inset:0;display:grid;place-items:center;z-index:4;text-align:center;padding:0 8%;color:#F4EBD6;font:700 clamp(16px,3vw,30px)/1.25 var(--f-display,sans-serif);letter-spacing:.12em;text-transform:uppercase;text-shadow:0 2px 12px #000;opacity:0}
#trailer.v3 .tv-seg.on .tv3-card{animation:c3fade var(--d) ease forwards}
@keyframes c3fade{0%{opacity:0}15%{opacity:1}85%{opacity:1}100%{opacity:0}}
#trailer.v3 .tv3-card .tv-logo{margin:0 auto 10px;width:54px}
@media (prefers-reduced-motion:reduce){#trailer.v3 *{animation-duration:.01ms!important;animation-iteration-count:1!important}}`;
function tv3Style() { if (document.getElementById('tv3css')) return; const st = document.createElement('style'); st.id = 'tv3css'; st.textContent = TV3_CSS; document.head.appendChild(st); }
const TV3_CAM = { push: 'c3push', pull: 'c3pull', panl: 'c3panl', panr: 'c3panr', tilt: 'c3tilt' };
// Every segment a whole number of beats: shots of four, quick cuts of one, the title of eight.
function tv3Retime(plan, beat, f) {
  const out = [], b = n => Math.round(n * beat), cast = f.cast || [];
  let lastShot = 0, line = 0;
  for (const s0 of plan) {
    const s = Object.assign({}, s0);
    if (s.shot !== null && s.shot !== undefined) lastShot = s.shot;
    if (s.slam) { s.kind = 'title'; s.ms = b(8); }
    else if (s.logo) { s.kind = 'card'; s.ms = b(4); }
    else if (s.laurel) { s.kind = 'card'; s.ms = b(4); }
    else if (s.pos === 'card' && s.vo) { s.kind = 'vo'; s.shot = s.shot ?? lastShot + 20; s.ms = b(Math.max(3, Math.ceil((s.text || '').length / 9))); }
    else if (s.pos === 'card') { s.kind = 'vo'; s.shot = s.shot ?? lastShot + 30; s.ms = b(Math.max(4, Math.ceil((s.text || '').length / 8))); }
    else if (s.sub) { s.kind = 'line'; s.who = cast[line++ % Math.max(1, Math.min(2, cast.length))]; s.ms = b(Math.max(4, Math.ceil(s.sub.length / 7))); }
    else if (s.text) { s.kind = 'vo'; s.ms = b(Math.max(4, Math.ceil(s.text.length / 8))); }
    else { s.kind = 'shot'; s.ms = s.ms < 1000 ? b(beat < 420 ? 2 : 1) : b(beat < 500 ? 6 : 4); }
    if (s.ms < 1000 && s.kind !== 'shot') s.ms = b(2);
    out.push(s);
  }
  return out;
}
const TV3 = { voice: (() => { try { return localStorage.getItem('ab-trailer-voice') !== 'off'; } catch (e) { return true; } })() };
function tv3Voices() { try { return window.speechSynthesis ? speechSynthesis.getVoices().filter(v => /^en/i.test(v.lang)) : []; } catch (e) { return []; } }
function tv3Speak(text, kind, g, A) {
  if (!TV3.voice || !text || typeof window === 'undefined' || !window.speechSynthesis || !window.SpeechSynthesisUtterance) return;
  try {
    const u = new SpeechSynthesisUtterance(String(text).replace(/[♪“”"]/g, '').replace(/\s+/g, ' ').trim()), V = tv3Voices();
    const want = kind === 'vo' || g === 'M' ? /male|daniel|alex|fred|david|george|arthur|guy|james/i : /female|samantha|victoria|karen|moira|serena|susan|zira|libby/i;
    u.voice = V.find(v => want.test(v.name) && !(kind === 'vo' && /female/i.test(v.name))) || V[0] || null;
    if (kind === 'vo') { u.pitch = .45; u.rate = .82; } else { u.pitch = g === 'F' ? 1.12 : g === 'M' ? .82 : 1; u.rate = 1.02; }
    u.volume = 1; u.onstart = () => A && A.duck && A.duck(true); u.onend = () => A && A.duck && A.duck(false);
    speechSynthesis.speak(u);
  } catch (e) { }
}
function tv3Hush() { try { if (window.speechSynthesis) speechSynthesis.cancel(); } catch (e) { } }
function tv3Billing(f) {
  const nm = id => id !== undefined && id !== null && P(id) ? P(id).name : null, co = f.co !== null && S.companies[f.co] ? S.companies[f.co].name : 'an independent', c = f.crew || {};
  const cast = (f.cast || []).slice(0, 4).map(nm).filter(Boolean), wri = (f.wri || []).map(nm).filter(Boolean);
  return [`${co} presents`, `a ${nm(f.dir)} film`, cast.length ? cast.join('  ') : '', nm(c.mus) ? `music by ${nm(c.mus)}` : '', nm(f.dp) ? `director of photography ${nm(f.dp)}` : '', nm(f.ed) ? `edited by ${nm(f.ed)}` : '', wri.length ? `written by ${wri.join(' & ')}` : '', `directed by ${nm(f.dir)}`].filter(Boolean).join('   ·   ');
}
playTrailer = function (id) {
  const f = S.films[id]; if (!f || typeof document === 'undefined') return;
  tv3Style(); tv3Hush();
  const old = document.getElementById('trailer'); if (old) old.remove();
  const fam = TR_FAMILY[f.genre] || 'drama', Sc = TR_SCORES[fam] || TR_SCORES.drama, beat = 60000 / Sc.bpm;
  const c = GENRE_LOOK[f.genre] || GENRE_LOOK.Drama, plan = tv3Retime(trailerPlan2(f), beat, f), total = plan.reduce((s, x) => s + x.ms, 0);
  const el = document.createElement('div'); el.id = 'trailer'; el.className = 'v3'; el.style.setProperty('--tc', c[2]); el.style.setProperty('--tb', c[0]);
  const r = hashRand(f.id * 101 + 7);
  const layer = (s, k) => {
    const mv = s.kind === 'title' ? 'push' : s.move || 'push', px = mv === 'panl' ? 1 : mv === 'panr' ? -1 : (k % 2 ? .5 : -.5), dim = s.kind === 'vo' || s.kind === 'title' || s.kind === 'card';
    const shot = s.shot !== null && s.shot !== undefined ? `<div class="tv-shot${dim ? ' dim' : ''}${s.freeze ? ' freeze' : ''}">${stillSVG(f, s.shot, 960, true)}</div>` : '';
    let over = '';
    if (s.kind === 'title') over = `<div class="tv3-title"><b>${esc(f.title)}</b><span class="tv3-bill">${esc(tv3Billing(f))}</span></div>`;
    else if (s.kind === 'card') over = `<div class="tv3-card"><div>${s.logo ? logoSVGFor(f).replace('<svg', '<svg class="tv-logo"') : ''}${s.laurel && typeof laurelSVG === 'function' ? laurelSVG(s.laurel) : ''}${s.text && s.text.trim() ? esc(s.text) : ''}</div></div>`;
    else if (s.kind === 'vo') over = `<div class="tv3-vo">${esc(s.text || '')}</div>`;
    else if (s.kind === 'line') over = `<div class="tv3-line"><q>${esc(s.sub)}</q>${s.who !== undefined && P(s.who) ? `<small>${esc(P(s.who).name)}</small>` : ''}</div>`;
    return `<div class="tv-seg" data-k="${k}" style="--d:${s.ms + 300}ms;--cam:${TV3_CAM[mv] || 'c3push'};--px:${px}">${shot}${over}</div>`;
  };
  el.innerHTML = `<div class="tv"><div class="tv-screen tv3-bars">${plan.map(layer).join('')}<div class="tv3-leak"></div><div class="tv3-streak"></div><div class="tv-flash"></div><div class="tv-grain"></div></div>
   <div class="tv-bar"><button class="tv-btn tv-play" aria-label="Pause">❚❚</button><button class="tv-btn tv-again" aria-label="Replay">↺</button><span class="tv-prog"><i></i></span><span class="tv-time">0:00 / ${fmtClock(total)}</span><button class="tv-btn tv-voice" aria-label="Voices" title="Narrator and voices">${TV3.voice ? '🎙' : '🎙̸'}</button><button class="tv-btn tv-mute" aria-label="Mute">🔊</button><button class="tv-btn tv-close" aria-label="Close">✕</button></div></div>`;
  document.body.appendChild(el);
  const screen = el.querySelector('.tv-screen'), segs = [...el.querySelectorAll('.tv-seg')], flash = el.querySelector('.tv-flash'), leak = el.querySelector('.tv3-leak'), streak = el.querySelector('.tv3-streak');
  const bar = el.querySelector('.tv-prog i'), clock = el.querySelector('.tv-time'), playB = el.querySelector('.tv-play'), muteB = el.querySelector('.tv-mute'), voiceB = el.querySelector('.tv-voice');
  let A = trailerScore(f); const starts = []; let acc = 0; for (const s of plan) { starts.push(acc); acc += s.ms; }
  let t = 0, cur = -1, last = null, paused = false, muted = false, raf = 0, done = false;
  const fx = (node, cls) => { node.classList.remove(cls); void node.offsetWidth; node.classList.add(cls); };
  const enter = k => {
    const s = plan[k], prev = segs[cur];
    if (prev) { prev.classList.remove('on', 'whip'); prev.classList.add('off'); setTimeout(() => prev.classList.remove('off'), 400); }
    const seg = segs[k]; seg.classList.remove('off'); void seg.offsetWidth; seg.classList.add('on');
    seg.querySelectorAll('svg').forEach(svg => { try { svg.setCurrentTime(0); svg.unpauseAnimations(); } catch (e) { } });
    const quick = s.kind === 'shot' && s.ms < beat * 2.5;
    if (quick) fx(seg, 'whip');
    if (s.cut === 'flash' || s.kind === 'title') fx(flash, 'go');
    if (s.kind === 'vo' || (s.kind === 'shot' && !quick && r() < .35)) { leak.style.setProperty('--lx', `${Math.round(15 + r() * 70)}%`); fx(leak, 'go'); }
    if (s.kind === 'title' || (quick && k % 3 === 0)) fx(streak, 'go');
    el.classList.toggle('hardcut', s.cut === 'hard' || quick);
    if (A.hush) A.hush(!!s.hush || (!!s.freeze && plan[k - 1] && plan[k - 1].freeze));
    if (s.freeze && !(plan[k - 1] && plan[k - 1].freeze) && A.scratch) A.scratch();
    else if (s.kind === 'title') A.hit(true); else if (s.cut === 'hard' || s.vo || quick) A.hit(false);
    A.swell(Math.min(1, k / plan.length * 1.2));
    if (s.kind === 'vo' && s.text && s.text.trim()) tv3Speak(s.text, 'vo', null, A);
    else if (s.kind === 'line') tv3Speak(s.sub, 'line', s.who !== undefined && P(s.who) ? P(s.who).g : null, A);
    else if (s.kind === 'title') tv3Speak(f.title, 'vo', null, A);
    cur = k;
  };
  const finish = () => { done = true; segs[cur] && segs[cur].classList.add('hold'); playB.textContent = '▶'; bar.style.width = '100%'; clock.textContent = `${fmtClock(total)} / ${fmtClock(total)}`; if (A.fade) A.fade(1800); else A.stop(); };
  const tick = now => {
    if (last === null) last = now;
    if (!paused) t += now - last;
    last = now;
    if (t >= total) { if (!done) finish(); return; }
    const k = starts.findIndex((s0, j) => t >= s0 && t < s0 + plan[j].ms);
    if (k !== cur && k >= 0) enter(k);
    bar.style.width = (t / total * 100).toFixed(2) + '%'; clock.textContent = `${fmtClock(t)} / ${fmtClock(total)}`;
    raf = requestAnimationFrame(tick);
  };
  const setPause = p => { paused = p; el.classList.toggle('paused', p); playB.textContent = p ? '▶' : '❚❚'; A.pause(p); if (p) tv3Hush(); el.querySelectorAll('svg').forEach(svg => { try { p ? svg.pauseAnimations() : svg.unpauseAnimations(); } catch (e) { } }); };
  const begin = () => { A.start({ Horror: 55, Action: 73, Comedy: 98, Romance: 87, Western: 65, 'Sci-fi': 61 }[f.genre] || 69); if (muted) A.mute(true); screen.classList.remove('in'); void screen.offsetWidth; screen.classList.add('in'); };
  const restart = () => { cancelAnimationFrame(raf); tv3Hush(); A.stop(); A = trailerScore(f); segs.forEach(s => s.classList.remove('on', 'off', 'hold', 'whip')); t = 0; cur = -1; last = null; done = false; paused = false; el.classList.remove('paused'); playB.textContent = '❚❚'; begin(); raf = requestAnimationFrame(tick); };
  const close = () => { cancelAnimationFrame(raf); tv3Hush(); A.stop(); el.remove(); document.removeEventListener('keydown', key); };
  const key = e => { if (e.key === 'Escape') close(); else if (e.key === ' ') { e.preventDefault(); e.stopPropagation(); done ? restart() : setPause(!paused); } };
  document.addEventListener('keydown', key);
  playB.onclick = () => done ? restart() : setPause(!paused);
  el.querySelector('.tv-again').onclick = restart;
  muteB.onclick = () => { muted = !muted; A.mute(muted); if (muted) tv3Hush(); muteB.textContent = muted ? '🔇' : '🔊'; };
  voiceB.onclick = () => { TV3.voice = !TV3.voice; try { localStorage.setItem('ab-trailer-voice', TV3.voice ? 'on' : 'off'); } catch (e) { } if (!TV3.voice) tv3Hush(); voiceB.textContent = TV3.voice ? '🎙' : '🎙̸'; };
  el.querySelector('.tv-close').onclick = close;
  el.querySelector('.tv-prog').onclick = e => { const b = e.currentTarget.getBoundingClientRect(); tv3Hush(); t = clamp((e.clientX - b.left) / b.width, 0, .999) * total; segs.forEach(s => s.classList.remove('on', 'off', 'hold', 'whip')); cur = -1; if (done) { A = trailerScore(f); begin(); done = false; raf = requestAnimationFrame(tick); } };
  el.onclick = e => { if (e.target === el) close(); };
  begin();
  raf = requestAnimationFrame(tick);
};
