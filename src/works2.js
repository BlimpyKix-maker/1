// ---------------- What it was, and how it did: pages for everything anyone made ----------------
// Your songs, videos, episodes and plays (and every other artist's releases) get a real page: what it was about and
// where it came from, how good it was in its parts, how the audience found it week by week, what it earned and cost,
// what the critics and the comments said. Everything is derived from the work's own numbers and a stable hash, so
// the page reads the same every time and costs the game nothing.
const ABOUT_OPEN = {
  song: ['A song about {theme}, written {when}.', 'Three minutes on {theme}, started on a bus and finished at four in the morning.', 'A {mood} song about {theme}; the chorus came first, the verses took a month.', 'Written for someone who will know it\'s about them. It\'s about {theme}.'],
  score: ['An instrumental piece about {theme}, for strings and a piano with one sticky key.', 'A cue built around a four-note figure, {mood} and patient, about {theme}.', 'Library music on paper; on headphones, a small piece about {theme}.'],
  mv: ['Pictures for the song: {theme}, shot over {n} days with friends and borrowed lights.', 'A one-take video about {theme}, rehearsed for a week, shot in an afternoon.', 'A {mood} little film about {theme} that happens to have a song in it.'],
  video: ['A video essay about {theme}, written, shot and cut in your kitchen.', 'Twenty minutes on {theme}: half argument, half confession.', 'A {mood} sketch about {theme} that went through eleven edits.', 'A vlog that turned out to be about {theme}.'],
  blip: ['Sixty seconds about {theme}. The fourth take.', 'A {mood} bit about {theme}, filmed on the stairs.', 'A short clip about {theme}; the punchline is in the last frame.'],
  podcast: ['An episode about {theme}, with a guest who talked for three hours.', 'A {mood} episode about {theme}; the best bit was nearly cut.', 'An hour on {theme}, recorded in a wardrobe for the acoustics.'],
  play: ['A play about {theme}: {n} characters, one room, one very long night.', 'A {mood} two-hander about {theme}, written in a winter.', 'A play about {theme} that began as a short story nobody published.'],
  musical: ['A musical about {theme}, with {n} songs and one showstopper.', 'Book, music and lyrics about {theme}; the second act was rewritten three times.']
};
const MOOD = ['quiet', 'furious', 'tender', 'funny', 'restless', 'bittersweet', 'strange', 'hopeful', 'angry', 'dreamy'];
const WHEN_LINES = ['the week you moved flats', 'after a night that went wrong', 'in the spring', 'on a long train', 'between two jobs', 'when you were broke', 'after a break-up', 'in one sitting'];
const CRIT = [[85, ['A small masterpiece.', 'The best thing of its kind this year.', 'Startling, and completely itself.']], [70, ['Assured and generous.', 'Better than it needed to be.', 'You can hear a voice arriving.']], [55, ['Pleasant and forgettable.', 'Promising, uneven.', 'Some lovely moments in search of a whole.']], [40, ['Earnest, and not enough.', 'It never quite takes off.', 'The idea is better than the execution.']], [0, ['Not good.', 'A misfire.', 'Best forgotten.']]];
const FAN_GOOD = ['this got me through the week', 'on repeat since friday', 'how is this not bigger', 'the bit at 1:42 !!!', 'sent this to my mum', 'finally someone said it', 'cried on the bus, thanks'];
const FAN_MEH = ['decent', 'not your best but ok', 'the last one was better', 'mid tbh', 'liked the start', 'who mixed this'];
function critLine(q, r) { const L = CRIT.find(([t]) => q >= t)[1]; return L[Math.floor(r() * L.length)]; }
function workAbout(type, r, themes) {
  const L = ABOUT_OPEN[type] || ABOUT_OPEN.video, t = L[Math.floor(r() * L.length)];
  const th = themes.length ? THEMES[themes[Math.floor(r() * themes.length)]].toLowerCase() : Object.values(THEMES)[Math.floor(r() * 12)].toLowerCase();
  return t.replace('{theme}', th).replace('{mood}', MOOD[Math.floor(r() * MOOD.length)]).replace('{when}', WHEN_LINES[Math.floor(r() * WHEN_LINES.length)]).replace('{n}', 2 + Math.floor(r() * 9));
}
// the parts of a work's quality, from the skills it uses (so it reads true to the maker)
function workParts(w, r) {
  const T = WORK_TYPES[w.type] || {}, names = { song: ['Songwriting', 'Performance', 'Production'], score: ['Composition', 'Orchestration', 'Recording'], mv: ['Idea', 'Images', 'Cut'], video: ['Idea', 'On camera', 'Edit'], blip: ['Hook', 'Delivery', 'Timing'], podcast: ['Topic', 'Talk', 'Sound'], play: ['Writing', 'Staging', 'Cast'], musical: ['Book', 'Score', 'Staging'] }[w.type] || ['Idea', 'Craft', 'Finish'];
  return names.map(n => [n, Math.round(clamp(w.q + (r() - .5) * 22, 5, 99))]);
}
viewWork = function (id) {
  const M = S.me, w = (M.works || []).find(x => x.id === +id); if (!w) return '<p class="muted">Not found.</p>';
  const T = WORK_TYPES[w.type] || {}, wk = w.wk || [], mx = Math.max(1, ...wk), r = hashRand(w.id * 7919 + (w.rel || 0) * 31 + w.title.length);
  const themes = typeof voiceOf === 'function' ? topThemes(voiceOf()) : [];
  const about = workAbout(w.type, r, themes), parts = workParts(w, r), crit = critLine(w.q, r);
  const units = Math.round(w.units || 0), first = Math.round(w.v0 || wk[0] || 0), peak = Math.max(first, ...wk), weeks = wk.length;
  const per = units ? (w.earned || 0) / units : 0, fol = Math.round(units * (T.conv || 0) * (.5 + w.q / 100) * (w.df ?? 1));
  const net = Math.round((w.earned || 0) - (w.cost || 0) - (w.promo === 2 ? usd(400) : w.promo === 1 ? usd(60) : 0));
  const verdict = w.z > 2.1 ? 'It went viral.' : units >= 1e6 ? 'A hit.' : units >= 1e5 ? 'It found a real audience.' : units >= 5000 ? 'It found its people.' : units >= 500 ? 'A small crowd loved it.' : 'Almost nobody heard it.';
  const fans = [0, 1, 2].map(() => (w.q >= 60 ? FAN_GOOD : FAN_MEH)[Math.floor(r() * (w.q >= 60 ? FAN_GOOD : FAN_MEH).length)]);
  const bars = wk.slice(-26).map((v, i, a) => `<rect x="${i * (300 / Math.max(1, a.length))}" y="${60 - v / mx * 56}" width="${Math.max(2, 300 / Math.max(1, a.length) - 2)}" height="${v / mx * 56}" fill="var(--accent)"/>`).join('');
  const unit = (PLATFORMS[w.plat] || {}).unit || 'plays';
  return `<div class="head"><p class="eyebrow">${esc(T.label || w.type)} · released ${fmtDate(w.rel, true)}${w.plat ? ' on ' + esc(platName(w.plat)) : ''}</p><h2>${esc(w.title)}</h2><p class="lede">By ${pl(ME().id)}. ${esc(verdict)} ${w.q >= 80 ? 'People are calling it your best work.' : ''}</p></div>
   <div class="cols two"><section class="panel"><h3>What it was</h3><p>${esc(about)}</p>${w.promo ? `<p class="small muted">Released with ${w.promo === 2 ? 'a proper marketing push' : 'a little promotion'}.</p>` : ''}<h4>How good it was</h4>${parts.map(([n, v]) => `<div class="rep"><span>${esc(n)}</span>${bar(v, 100, v >= 70 ? 'good' : v < 45 ? 'warm' : 'data')}<b>${v}</b></div>`).join('')}<p class="small">Overall <b>${Math.round(w.q)}/100</b>. The critics: <i>"${esc(crit)}"</i></p></section>
   <section class="panel"><h3>How it did</h3><div class="kpis mini"><div><span>${esc(unit)}</span><b>${units.toLocaleString()}</b><small class="muted">${first.toLocaleString()} the first week</small></div><div><span>Peak week</span><b>${peak.toLocaleString()}</b><small class="muted">${weeks} week${weeks === 1 ? '' : 's'} tracked</small></div><div><span>New followers</span><b>${fol.toLocaleString()}</b></div></div>
   <h4>The money</h4><table class="grid small"><tbody><tr><td>Earned</td><td class="n">${fmtCash(Math.round(w.earned || 0))}</td></tr>${w.cost ? `<tr><td>Cost to make and stage</td><td class="n bad">−${fmtCash(w.cost)}</td></tr>` : ''}${w.promo ? `<tr><td>Promotion</td><td class="n bad">−${fmtCash(w.promo === 2 ? usd(400) : usd(60))}</td></tr>` : ''}<tr><td><b>Net</b></td><td class="n ${net >= 0 ? 'good' : 'bad'}"><b>${fmtCash(net)}</b></td></tr>${per ? `<tr><td>Per ${esc(unit.replace(/s$/, ''))}</td><td class="n">${fmtCash(per)}</td></tr>` : ''}</tbody></table>
   ${w.fill !== undefined ? `<p class="small">Houses ${Math.round(w.fill * 100)}% full across the run.</p>` : ''}</section></div>
   ${wk.length ? `<section class="panel"><h3>Week by week</h3><svg viewBox="0 0 300 62" width="100%" height="90" preserveAspectRatio="none">${bars}</svg></section>` : ''}
   <section class="panel"><h3>The comments</h3><ul class="plain small">${fans.map(t => `<li>💬 ${esc(t)}</li>`).join('')}</ul><h3>In the press</h3>${newsList(newsAbout(w.title))}</section>`;
};
// other artists' releases: what each one was, and whether it worked
{ const _viewSong = viewSong;
  viewSong = function (id) {
    const html = _viewSong(id), parts = String(id).split('~'), x = figAt(parts[0] + '~' + parts[1]), slot = +parts[2]; if (!x) return html;
    const r = hashRand(x.name.length * 131 + slot * 17 + 3), q = Math.round(clamp(40 + Math.log10(Math.max(10, x.fans)) * 8 + (r() - .5) * 30, 10, 98)), type = { music: 'song', creator: 'video', podcast: 'podcast', stage: 'play' }[x.field] || 'song';
    const about = workAbout(type, r, []).replace('your kitchen', 'their kitchen').replace('you moved', 'they moved').replace('you were', 'they were');
    const rel = figReleases(x), i = rel.indexOf(slot), was = i >= 0 && i < rel.length - 1 ? 'follow-up' : 'debut';
    const fate = q >= 82 ? 'A career-defining release.' : q >= 68 ? 'A hit with the fans and a few new ones.' : q >= 52 ? 'It did what releases do: a few good weeks, then the next thing.' : 'It underperformed, and the label noticed.';
    const rev = Math.round(x.fans * (.5 + r() * 3) * (x.field === 'music' ? 40 : 6) * ({ music: .003, creator: .0035, podcast: .025, stage: 18 }[x.field] || .003));
    return html + `<section class="panel"><h3>What it was</h3><p>${esc(about)}</p><p class="small">The ${was === 'debut' ? 'first thing they put out' : 'follow-up to their last release'}. ${esc(fate)}</p><div class="kpis mini"><div><span>Critics</span><b>${q}/100</b><small class="muted">"${esc(critLine(q, r))}"</small></div><div><span>Earned (est.)</span><b>${fmtCash(rev)}</b></div></div></section>`;
  };
}
