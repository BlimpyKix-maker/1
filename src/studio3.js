// ================= The Studio, made easier and more fun (Round 27) =================
// Compose and Lyrics were blank grids and a blank page, graded but never helped. Now:
//  - Song starters: one click fills drums, bass, chords and a melody with a hook in a style (pop anthem, ballad,
//    bossa, hip-hop, indie, film cue), different for every song title; the mix is still yours to do.
//  - "New melody idea" writes a fresh tune over the same chords; each row can be cleared on its own.
//  - A coach line under the score: the one change that would raise it most.
//  - Lyrics: pick a theme and a mood, then "suggest a line" for a verse, chorus, bridge or hook (from the game's
//    library of lyric lines), or build a whole skeleton with your title in the chorus. Rhymes for the last word of
//    your last line, and the syllables of every line, so the meter is easy to even out.
// Everything here edits the same draft the Studio already saves; nothing is scored differently.
const ST3_STYLES = {
  pop: ['Pop anthem', 'four', 'major', 116, ['I', 'V', 'vi', 'IV']], ballad: ['Ballad', 'ballad', 'major', 72, ['vi', 'IV', 'I', 'V']],
  bossa: ['Bossa', 'bossa', 'dorian', 96, ['ii', 'V', 'I', 'I']], hiphop: ['Hip-hop', 'boom', 'minor', 90, ['vi', 'IV', 'I', 'V']],
  indie: ['Indie', 'four', 'major', 124, ['I', 'IV', 'vi', 'V']], cue: ['Film cue', 'march', 'minor', 84, ['I', 'IV', 'V', 'I']]
};
function st3Seed(k, salt) { return hashRand(((k && k.title || 'x').split('').reduce((a, c) => a * 31 + c.charCodeAt(0), 7) + (salt || 0) * 7919) >>> 0); }
// a singable tune: a four-step motif, mostly stepwise, repeated in bar three (the hook), home on the tonic
function st3Melody(r) {
  const mel = Array(N16).fill(-1), motif = [], start = [0, 2, 4][Math.floor(r() * 3)]; let d = start;
  for (let i = 0; i < 4; i++) { motif.push(r() < .2 ? -1 : d); d = clamp(d + [-1, 1, 1, 2, -2, 0][Math.floor(r() * 6)], 0, 6); }
  if (motif[0] < 0) motif[0] = start;
  for (let i = 0; i < 4; i++) { mel[i] = motif[i]; mel[8 + i] = motif[i]; }
  let e = clamp(motif[3] < 0 ? start : motif[3], 0, 6); for (const i of [4, 6]) { e = clamp(e + (r() < .5 ? 1 : -1) * (1 + Math.floor(r() * 2)), 0, 7); mel[i] = e; }
  mel[13] = clamp(e - 1, 0, 6); mel[14] = r() < .5 ? 1 : 2; mel[15] = 0;
  return mel;
}
function st3Apply(style) {
  const k = S.me.make, X = st2(), Y = ST3_STYLES[style]; if (!Y) return; const r = st3Seed(k, Object.keys(ST3_STYLES).indexOf(style));
  const G = GROOVES[Y[1]][1]; X.drums = { k: Array(N16).fill(0), s: Array(N16).fill(0), h: Array(N16).fill(0) }; for (const p of ['k', 's', 'h']) for (const i of G[p]) X.drums[p][i] = 1;
  if (!X.drums.k[0]) X.drums.k[0] = 1; if (style !== 'ballad') { X.drums.s[4] = 1; X.drums.s[12] = 1; }
  X.scale = Y[2]; X.bpm = Y[3] + Math.round((r() - .5) * 10); X.key = Math.floor(r() * 12); X.chords = Y[4].slice();
  X.bass = Array(N16).fill(-1); for (let b = 0; b < 4; b++) { const root = CH_DEG[X.chords[b]] % 5; X.bass[b * 4] = root; if (style !== 'ballad') X.bass[b * 4 + 2] = r() < .5 ? root : (root + 2) % 5; }
  X.mel = st3Melody(r);   // the mix is left to you
}
function st3Coach(k) {
  const X = st2(), parts = [['melody', melodyRead(X)], ['groove', grooveRead(X)], ['harmony', chordRead(X)], ['mix', mixRead(X)]];
  if (k.type === 'song' || k.type === 'musical') parts.push(['lyrics', lyricRead(X.lyrics, k.title)]);
  parts.sort((a, b) => a[1].s - b[1].s); const [name, R] = parts[0];
  const fix = { melody: 'Try "New melody idea", or repeat bar one\'s notes in bar three and end on the bottom row.', groove: 'Put the kick on the first step, snares on steps 5 and 13, and hats every other step.', harmony: 'Try I–V–vi–IV: it is the progression a million songs trust.', mix: 'On Mix: keep the faders within 40 of each other, the lead on top, reverb 10–45, compression 20–65.', lyrics: 'On Lyrics: mark [Verse] and [Chorus], sing the title in the chorus, and keep lines about the same length.' }[name];
  const bad = R.notes.find(n => /no |few|lost|buried|drone|fight|keep going|mark|sing the title|clich|sparse|wall|leaps|air|wander|floats|dry|drowned|loose|squashed|stays/i.test(n));
  if (name === 'lyrics' && bad) { const L = /rhyme/i.test(bad) ? 'End lines on words from the rhymes list under Suggest.' : /length|fight/i.test(bad) ? 'Open "Syllables per line" and even them out to within two or three of each other.' : /title/i.test(bad) ? 'Press "+ title in the chorus".' : /mark/i.test(bad) ? 'Press "Build a whole skeleton", or add [Verse] and [Chorus] lines yourself.' : /keep going/i.test(bad) ? 'Add lines until you have at least twelve.' : fix; return `Biggest gain: the lyrics (${Math.round(R.s)}/10) — ${bad.replace(/\.$/, '')}. ${L}`; }
  return R.s >= 8 ? `Everything reads well. Bounce the session, or polish the ${name} for the last points.` : `Biggest gain: the ${name} (${Math.round(R.s)}/10)${bad ? ` — ${bad.replace(/\.$/, '')}` : ''}. ${fix}`;
}
// ---- lyrics ----
const ST3_THEMES = ['love', 'memory', 'freedom', 'loneliness', 'family', 'ambition', 'identity', 'survival', 'faith', 'justice', 'power', 'revenge'], ST3_MOODS = ['light', 'bittersweet', 'dark', 'tense', 'absurd'];
function st3Lines(part, theme, mood) {
  const L = ((typeof WLIB !== 'undefined' && WLIB.T.lyric) || []).filter(e => typeof e[2] === 'string' && e[2].startsWith(part + '.') && !/\{/.test(e[4]));
  const fit = L.filter(e => e[2] === part + '.' + theme && (e[1] === '*' || String(e[1]).split(',').includes(mood)));
  return fit.length >= 3 ? fit : L.filter(e => e[2] === part + '.' + theme).length ? L.filter(e => e[2] === part + '.' + theme) : L;
}
function st3Pick(part, n) { const T = UI.st3 || {}, L = st3Lines(part, T.theme || 'love', T.mood || 'bittersweet'); if (!L.length) return []; const r = hashRand(((UI.st3n = (UI.st3n || 0) + 1) * 2654435761 + S.week) >>> 0), out = []; for (let i = 0; i < n && i < 50; i++) { const e = L[Math.floor(r() * L.length)]; if (!out.includes(e[4])) out.push(e[4]); } return out; }
function st3Insert(section, lines) {
  const X = st2(), tag = `[${section}]`; let txt = X.lyrics || '';
  if (!txt.includes(tag)) txt = (txt.trim() ? txt.trim() + '\n\n' : '') + tag;
  const parts = txt.split('\n'), i = parts.lastIndexOf(tag); let j = i + 1; while (j < parts.length && parts[j].trim() && !/^\[.*\]$/.test(parts[j].trim())) j++;
  parts.splice(j, 0, ...lines); X.lyrics = parts.join('\n');
}
function st3Skeleton(k) {
  const title = (k && k.title) || 'This song', v1 = st3Pick('verse', 4), ch = st3Pick('chorus', 3), v2 = st3Pick('verse', 4), br = st3Pick('bridge', 2);
  st2().lyrics = ['[Verse 1]', ...v1, '', '[Chorus]', title, ...ch, '', '[Verse 2]', ...v2, '', '[Chorus]', title, ...ch, '', '[Bridge]', ...br, '', '[Chorus]', title, ...ch].join('\n');
}
// words that rhyme with the last word you wrote, from every line in the lyric library
let ST3_RHY = null;
function st3Rhymes(word) {
  if (!ST3_RHY) { ST3_RHY = new Map(); for (const e of (typeof WLIB !== 'undefined' && WLIB.T.lyric) || []) for (const line of String(e[4]).split('\n')) { const w = (line.toLowerCase().match(/[a-z']+(?=[^a-z']*$)/) || [''])[0]; if (w.length < 3) continue; const key = w.replace(/^.*?([aeiouy]+[^aeiouy]*)$/, '$1'); if (!ST3_RHY.has(key)) ST3_RHY.set(key, new Set()); ST3_RHY.get(key).add(w); } }
  const w = String(word || '').toLowerCase().replace(/[^a-z']/g, ''); if (w.length < 2) return [];
  const key = w.replace(/^.*?([aeiouy]+[^aeiouy]*)$/, '$1'), S0 = ST3_RHY.get(key); return S0 ? [...S0].filter(x => x !== w).slice(0, 14) : [];
}
function st3LyricTools(k) {
  const X = st2(), T = UI.st3 = UI.st3 || { theme: 'love', mood: 'bittersweet' }, lines = String(X.lyrics || '').split('\n'), lastLine = [...lines].reverse().find(l => l.trim() && !/^\[.*\]$/.test(l.trim())) || '', last = (lastLine.toLowerCase().match(/[a-z']+(?=[^a-z']*$)/) || [''])[0], rh = st3Rhymes(last);
  const syl0 = l => l.split(/\s+/).reduce((t, w) => t + syl(w), 0);
  return `<div class="st3-ly"><div class="st3-row"><span class="st3-k">Theme</span>${ST3_THEMES.map(t => `<button class="tk-chip${T.theme === t ? ' on' : ''}" data-st3="theme:${t}">${t}</button>`).join('')}</div>
   <div class="st3-row"><span class="st3-k">Mood</span>${ST3_MOODS.map(t => `<button class="tk-chip${T.mood === t ? ' on' : ''}" data-st3="mood:${t}">${t}</button>`).join('')}</div>
   <div class="st3-row"><span class="st3-k">Suggest</span><button class="btn-s ghost" data-st3="line:verse:Verse 1">+ verse line</button><button class="btn-s ghost" data-st3="line:chorus:Chorus">+ chorus line</button><button class="btn-s ghost" data-st3="line:bridge:Bridge">+ bridge line</button><button class="btn-s ghost" data-st3="hook">+ title in the chorus</button><button class="btn-s" data-st3="skel">✨ Build a whole skeleton</button>${X.lyrics ? '<button class="linkish" data-st3="clear">clear</button>' : ''}</div>
   ${last ? `<div class="st3-row"><span class="st3-k">Rhymes for “${esc(last)}”</span>${rh.length ? rh.map(w => `<span class="st3-rh">${esc(w)}</span>`).join('') : '<span class="muted small">none in the book; try a simpler last word</span>'}</div>` : ''}
   ${lines.some(l => l.trim()) ? `<details class="st3-syl"><summary>Syllables per line</summary><ol>${lines.filter(l => l.trim()).map(l => /^\[.*\]$/.test(l.trim()) ? `<li class="sec">${esc(l)}</li>` : `<li><b>${syl0(l)}</b> ${esc(l)}</li>`).join('')}</ol></details>` : ''}
   <p class="small muted">Suggestions come from the game's library of lyric lines for your theme and mood. Use them as they are or rewrite them; your own lines score just the same.</p></div>`;
}
// ---- wiring ----
{ const _sa = studioApp; studioApp = function () {
  const h = _sa.apply(this, arguments), k = S.me && S.me.make; if (!k || !AUDIO_TYPES.includes(k.type) || k.type === 'podcast' || typeof h !== 'string') return h;
  const t = UI.stt || 'compose', coach = `<p class="st3-coach"><b>Coach</b> ${esc(st3Coach(k))}</p>`;
  let out = h.replace('<div class="np-tabs">', coach + '<div class="np-tabs">');
  if (t === 'compose') out = out.replace('<h5>Drums</h5>', `<div class="st3-start"><b>Start from a song</b> <span class="muted small">fills drums, bass, chords and a tune in a style; different for every title</span><div>${Object.entries(ST3_STYLES).map(([kk, v]) => `<button class="btn-s ghost" data-st3="style:${kk}">${esc(v[0])}</button>`).join('')}<button class="btn-s ghost" data-st3="mel">🎲 New melody idea</button><button class="linkish" data-st3="clr:drums">clear drums</button> <button class="linkish" data-st3="clr:mel">clear melody</button> <button class="linkish" data-st3="clr:bass">clear bass</button></div></div><h5>Drums</h5>`);
  if (t === 'lyrics') out = out.replace('<div class="ly">', st3LyricTools(k) + '<div class="ly">');
  return out; }; }
if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') document.addEventListener('click', e => {
  const b = e.target && e.target.closest ? e.target.closest('[data-st3]') : null; if (!b) return; e.preventDefault(); e.stopPropagation();
  const k = S.me && S.me.make; if (!k) return; const [a, v, w] = b.dataset.st3.split(':'), X = st2(), T = UI.st3 = UI.st3 || { theme: 'love', mood: 'bittersweet' };
  const ta = document.getElementById('st-lyrics'); if (ta) X.lyrics = ta.value;
  if (a === 'style') st3Apply(v);
  else if (a === 'mel') X.mel = st3Melody(hashRand(((UI.st3m = (UI.st3m || 0) + 1) * 40503 + (k.title || '').length) >>> 0));
  else if (a === 'clr') { if (v === 'drums') X.drums = { k: Array(N16).fill(0), s: Array(N16).fill(0), h: Array(N16).fill(0) }; else X[v] = Array(N16).fill(-1); }
  else if (a === 'theme' || a === 'mood') T[a] = v;
  else if (a === 'line') st3Insert(w, st3Pick(v, 1));
  else if (a === 'hook') st3Insert('Chorus', [k.title || 'This song']);
  else if (a === 'skel') st3Skeleton(k);
  else if (a === 'clear') X.lyrics = '';
  render(true);
}, true);
(function () { if (typeof document === 'undefined' || typeof document.createElement !== 'function' || !document.head) return; const st = document.createElement('style'); st.textContent = `
.st3-coach{margin:8px 0;padding:8px 12px;border-radius:8px;background:color-mix(in srgb,var(--accent,#c84) 10%,transparent);font-size:13px}.st3-coach b{font-size:11px;letter-spacing:.1em;text-transform:uppercase;margin-right:6px;color:var(--accent,#c84)}
.st3-start{margin:10px 0;padding:10px 12px;border:1px dashed var(--line,#ccc);border-radius:10px}.st3-start>div{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-top:6px}
.st3-ly{margin:6px 0 10px;display:flex;flex-direction:column;gap:6px}.st3-row{display:flex;flex-wrap:wrap;gap:6px;align-items:center}.st3-k{font:600 11px var(--f-body,system-ui);letter-spacing:.08em;text-transform:uppercase;color:var(--muted,#777);min-width:64px}
.st3-ly .tk-chip.on{background:var(--accent,#c84);color:#fff;border-color:transparent}.st3-rh{font-size:12.5px;padding:2px 8px;border-radius:9px;background:color-mix(in srgb,var(--ink,#111) 7%,transparent)}
.st3-syl summary{cursor:pointer;font-size:12.5px;font-weight:600}.st3-syl ol{list-style:none;padding:0;margin:4px 0;font-size:12.5px;columns:2}.st3-syl li b{display:inline-block;width:22px;text-align:right;margin-right:6px;color:var(--accent,#c84)}.st3-syl li.sec{font-weight:700;color:var(--muted,#777)}`; document.head.appendChild(st); })();
