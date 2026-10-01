// ---------------- Your voice: scripts, themes and taste ----------------
// What you write is a real thing now: a script with a title, a genre, a theme and a tone, written page by page,
// graded when the draft is done, rewritten, shown to people, entered in contests. The themes you keep returning to
// become your voice; the people you meet have tastes of their own, and shared tastes make friendships easier.
const THEMES = { family: 'Family', power: 'Power', love: 'Love', memory: 'Memory', identity: 'Identity', justice: 'Justice', survival: 'Survival', faith: 'Faith', ambition: 'Ambition', freedom: 'Freedom', loneliness: 'Loneliness', revenge: 'Revenge' };
const THEME_KEYS = Object.keys(THEMES);
const TONES = { light: 'Light', bittersweet: 'Bittersweet', dark: 'Dark', absurd: 'Absurd', tense: 'Tense' };
const SCRIPT_NOUNS = { Drama: ['Inheritance', 'The Long Winter', 'Small Hours', 'The Quiet House', 'Low Tide'], Comedy: ['Best Man', 'Plus One', 'The Wrong Wedding', 'Neighbours', 'Big Night'], Crime: ['The Score', 'Night Shift', 'Dirty Money', 'The Fence', 'Last Job'], Thriller: ['Blind Spot', 'The Witness', 'Dead Drop', 'Signal', 'Cold Trail'], Horror: ['The Hollow', 'Do Not Open', 'Below', 'The Visitor', 'Teeth'], Action: ['Overdrive', 'Extraction', 'Firebreak', 'Lockdown', 'Point Blank'], 'Martial arts': ['The Last Form', 'Iron Palm', 'Rooftop', 'The Student', 'Seven Doors'], Western: ['Dry Creek', 'The Long Ride', 'Sundown', 'Badlands', 'Iron Horse'], Romance: ['Second Chances', 'The Letter', 'Summer Rain', 'Across the Hall', 'Late'], Musical: ['Showstopper', 'Encore', 'The Chorus', 'Downbeat', 'Overture'], 'Sci-fi': ['Signal Lost', 'The Colony', 'Drift', 'Afterlight', 'Echo'], Fantasy: ['The Thorn Crown', 'Ashwood', 'The Ferryman', 'Moonmarket', 'The Seventh Gate'], War: ['The Line', 'Winter Front', 'No Man\'s Land', 'The Crossing', 'Dispatch'], Period: ['The Governess', 'A Season in Bath', 'The Court Painter', 'Empire', 'The Silk Road'], Documentary: ['The Real Story', 'Inside', 'Witness', 'The Archive', 'Home Movies'], Animation: ['Little Lantern', 'Paper Moon', 'The Lost Button', 'Whisker', 'Cloudland'], Superhero: ['Vigilant', 'Night Guard', 'Ultra', 'The Spark', 'Mask'] };
const WHO = ['a widowed fisherman', 'a burned-out cop', 'an estranged sister', 'a teenage runaway', 'an ageing magician', 'a disgraced surgeon', 'a small-town mayor', 'a nurse on the night shift', 'a con artist', 'a retired boxer', 'a young widow', 'a failed novelist', 'a priest with doubts', 'a lonely astronaut', 'a wedding singer'];
const WANTS = { family: 'brings the family back together', power: 'takes control of the town that ignored them', love: 'risks everything for a second chance at love', memory: 'tries to recover a summer they can\'t remember', identity: 'discovers who their father really was', justice: 'sets out to prove an innocent man\'s case', survival: 'has three days to get out alive', faith: 'is asked to believe in a miracle', ambition: 'will do anything for one shot at the big time', freedom: 'plans an escape from the life they were born into', loneliness: 'befriends the last person anyone would expect', revenge: 'returns home to settle an old score' };
const BEATS = { 0: ['the opening image', 'meeting your hero', 'the ordinary world', 'the inciting incident'], 1: ['the first turning point', 'a new world', 'fun and games', 'the midpoint twist', 'the bad guys close in'], 2: ['all is lost', 'the dark night', 'the finale', 'the final image'] };
// The player's voice, from their taste at the start and everything they write.
function voiceOf() {
  const M = S.me;
  if (!M.voice) { M.voice = {}; for (const g of M.love || []) for (const t of GENRE_THEMES[g] || []) M.voice[t] = (M.voice[t] || 0) + 2; }
  return M.voice;
}
const GENRE_THEMES = { Drama: ['family', 'memory'], Comedy: ['love', 'identity'], Crime: ['power', 'justice'], Thriller: ['survival', 'justice'], Horror: ['survival', 'faith'], Action: ['revenge', 'survival'], 'Martial arts': ['revenge', 'identity'], Western: ['justice', 'freedom'], Romance: ['love', 'loneliness'], Musical: ['ambition', 'love'], 'Sci-fi': ['identity', 'loneliness'], Fantasy: ['freedom', 'power'], War: ['survival', 'family'], Period: ['power', 'love'], Documentary: ['justice', 'memory'], Animation: ['family', 'freedom'], Superhero: ['power', 'justice'] };
function topThemes(v, n = 3) { return Object.entries(v).sort((a, b) => b[1] - a[1]).slice(0, n).filter(x => x[1] > 0).map(x => x[0]); }
// Everyone else's taste: two genres they love and a theme they care about, stable for a person.
function tasteOf(p) {
  const r = hashRand(p.id * 13 + 5), G = GENRES.filter(g => g !== 'Documentary' || r() < .3);
  const mine = (p.credits || []).slice(-6).map(i => S.films[i] && S.films[i].genre).filter(Boolean);
  const g1 = mine.length ? mine[Math.floor(r() * mine.length)] : G[Math.floor(r() * G.length)], g2 = G[Math.floor(r() * G.length)];
  return { genres: g1 === g2 ? [g1] : [g1, g2], theme: THEME_KEYS[Math.floor(r() * THEME_KEYS.length)] };
}
// How much your tastes overlap with someone's: 0 to 2.
function tasteMatch(p) {
  const t = tasteOf(p), M = S.me, v = topThemes(voiceOf());
  return t.genres.filter(g => M.love.includes(g)).length * .6 + (v.includes(t.theme) ? .8 : 0) - t.genres.filter(g => (M.hate || []).includes(g)).length * .6;
}
// ---- scripts ----
function newScript(a) {
  const M = S.me;
  if ((M.scripts || []).filter(x => x.stage === 'writing').length >= 2) return false;
  const g = GENRES.includes(a.genre) ? a.genre : ppick(M.love.length ? M.love : GENRES), th = THEMES[a.theme] ? a.theme : ppick(GENRE_THEMES[g] || THEME_KEYS), tone = TONES[a.tone] ? a.tone : 'bittersweet';
  const title = (a.title || '').trim().slice(0, 60) || ppick(SCRIPT_NOUNS[g] || SCRIPT_NOUNS.Drama);
  const log = `${ppick(WHO).replace(/^./, c => c.toUpperCase())} ${WANTS[th]}.`;
  const sc = { id: M.seq++, title, genre: g, theme: th, tone, logline: log, pages: 0, target: g === 'Comedy' || g === 'Horror' ? 95 : g === 'Period' || g === 'War' ? 125 : 110, draft: 1, q: 0, sessions: 0, stage: 'writing', started: S.week, grade: null, shared: [] };
  (M.scripts = M.scripts || []).push(sc);
  M.activeScript = sc.id;
  diary(`You start a new script: ${title} (${g.toLowerCase()}). ${log}`);
  return true;
}
function activeScript() { const M = S.me; return (M.scripts || []).find(x => x.id === M.activeScript && x.stage === 'writing') || (M.scripts || []).find(x => x.stage === 'writing'); }
function writeOnScript(L, scale = 1) {
  const M = S.me, me = ME(), sc = activeScript();
  if (!sc) { L.push('You sit down to write but there\'s no project. Start a script on your writing desk.'); return; }
  const pages = Math.max(1, Math.round((3 + me.mind.eth / 4 + prnd() * 3 + homeFx().pages) * scale * condMul()));
  const act = sc.pages < sc.target * .25 ? 0 : sc.pages < sc.target * .75 ? 1 : 2;
  sc.pages = Math.min(sc.target, sc.pages + pages); sc.sessions++;
  // each session adds craft: your writing skills, how you feel, and whether the subject is close to your heart
  const skill = avg(['struc', 'dial', 'char', 'orig'].map(k => me.sk[k]));
  const heart = (M.love.includes(sc.genre) ? 1 : 0) + (topThemes(voiceOf()).includes(sc.theme) ? 1 : 0) - ((M.hate || []).includes(sc.genre) ? 1.5 : 0);
  sc.q += (skill + heart * 1.5 + (condMul() - 1) * 6 + (prnd() - .5) * 4) * pages;
  for (const k of ['struc', 'dial', 'char', 'orig']) weekGain(k, .012 * scale);
  L.push(`${pages} pages of ${sc.title}: ${ppick(BEATS[act])}.`);
  if (sc.pages >= sc.target) finishDraft(sc, L);
  else if (prnd() < .12) writingEvent(sc);
}
function finishDraft(sc, L) {
  const M = S.me, me = ME(), avgQ = sc.q / Math.max(1, sc.target);
  const score = clamp(Math.round(38 + (avgQ - 6) * 5 + (sc.draft - 1) * 7), 5, 98);   // a beginner's first draft is a D or C; skill, heart and rewrites lift it
  sc.score = score; sc.grade = score >= 85 ? 'A' : score >= 70 ? 'B' : score >= 55 ? 'C' : score >= 40 ? 'D' : 'F';
  sc.stage = 'done'; M.spec.drafts++; (sc.history = sc.history || []).push(sc.grade + ' ' + score);
  const v = voiceOf(); v[sc.theme] = (v[sc.theme] || 0) + 3; v[(GENRE_THEMES[sc.genre] || [])[0]] = (v[(GENRE_THEMES[sc.genre] || [])[0]] || 0) + 1;
  me.standing = clamp(me.standing + (score >= 70 ? .6 : .2), 0, 100);
  L.push(`You type FADE OUT on draft ${sc.draft} of ${sc.title}. Reading it back, you'd give it a ${sc.grade}.`);
  inbox('note', `Draft finished: ${sc.title}`, `${sc.logline} Draft ${sc.draft}, ${sc.target} pages. Your own verdict: ${sc.grade} (${score}/100). Rewrite it, show it to people you trust, or send it to a contest.`);
}
// Writing has its moments too.
const WRITE_SCENES = [
  { id: 'lw_block', title: 'The blank page', text: 'You stare at the scene where {title} turns. Nothing comes.', opts: [
    { k: 'push', label: 'Push through it, badly', check: ['eth', 12], ok: { script: 6 }, bad: { stress: 4 }, t: 'Five terrible pages. Somewhere in them, one good line.', tb: 'Nothing. You close the laptop.' },
    { k: 'walk', label: 'Go for a long walk', ok: { stress: -4, script: 3 }, t: 'Halfway across the park, the answer arrives.' }] },
  { id: 'lw_char', title: 'A character takes over', text: 'A minor character in {title} starts talking, and won\'t stop.', opts: [
    { k: 'follow', label: 'Follow them', check: ['char', 13], ok: { script: 10, xp: { char: .2 } }, bad: { script: -3 }, t: 'They become the heart of the story.', tb: 'Twenty pages of a tangent. They\'ll have to go.' },
    { k: 'rein', label: 'Rein them in', ok: { script: 2 }, t: 'Disciplined. The structure holds.' }] },
  { id: 'lw_steal', title: 'Too close', text: 'You realise your best scene in {title} is a scene from a film you love, in a different coat.', opts: [
    { k: 'cut', label: 'Cut it and find your own', check: ['orig', 13], ok: { script: 8, xp: { orig: .2 } }, bad: { stress: 3 }, t: 'Your version is stranger and better.', tb: 'The replacement is flat. You miss the old one.' },
    { k: 'keep', label: 'Keep it: everyone steals', ok: {}, t: 'Homage, you tell yourself.' }] }
];
for (const s of WRITE_SCENES) SCENES.push(Object.assign({ event: 1, jobs: [] }, s));
function writingEvent(sc) {
  const s = ppick(WRITE_SCENES);
  inbox('scene', s.title, s.text.replace('{title}', sc.title), { scene: s.id, ctx: { head: null, film: null, mates: [], script: sc.id }, choices: s.opts.map(o => ({ k: o.k, label: o.label, check: o.check })) });
}
function rewriteScript(a) {
  const M = S.me, sc = (M.scripts || []).find(x => x.id === a.id);
  if (!sc || sc.stage !== 'done' || (M.scripts || []).filter(x => x.stage === 'writing').length >= 2) return false;
  sc.draft++; sc.stage = 'writing'; sc.pages = Math.round(sc.target * .55); sc.q = sc.q * .55; M.activeScript = sc.id;
  diary(`You start draft ${sc.draft} of ${sc.title}.`);
  return true;
}
// Show a finished script to a contact: their taste and your grade decide how it lands.
function shareScript(a) {
  const M = S.me, me = ME(), sc = (M.scripts || []).find(x => x.id === a.id), q = P(a.to);
  if (!sc || !sc.grade || !M.known[a.to] || sc.shared.includes(a.to)) return false;
  sc.shared.push(a.to);
  const t = tasteOf(q), fit = (t.genres.includes(sc.genre) ? 12 : 0) + (t.theme === sc.theme ? 10 : 0);
  const score = sc.score + fit + (prnd() - .5) * 20;
  if (score >= 75) { addTie(me, q, 8); trust(q.id, 6); M.refs[q.id] = (M.refs[q.id] || 0) + 1; inbox('note', `${q.name} read ${sc.title}`, `"I couldn't put it down." ${t.genres.includes(sc.genre) ? 'It\'s exactly their kind of film.' : ''} They'll mention you to people who need writers.`, { person: q.id }); me.standing = clamp(me.standing + .4, 0, 100); }
  else if (score >= 50) { addTie(me, q, 3); inbox('note', `${q.name} read ${sc.title}`, `Kind notes: they liked the ${ppick(['dialogue', 'opening', 'lead character', 'ending'])} and lost interest in the middle.${fit ? '' : ' Not really their kind of thing.'}`, { person: q.id }); }
  else { addTie(me, q, -2); inbox('note', `${q.name} read ${sc.title}`, `A polite email, two weeks late. "Keep writing."`, { person: q.id }); }
  return true;
}
// Contests: a couple of real deadlines a year; results arrive weeks later.
const CONTESTS = [
  { k: 'fellow', name: 'The Screenwriting Fellowship', month: 4, fee: 60, bar: 82, prize: 35000, d: 'A year\'s salary to write, and a room full of producers.' },
  { k: 'lab', name: 'The Screenwriters Lab', month: 9, fee: 40, bar: 76, prize: 0, d: 'A week in the mountains with mentors. No money; enormous doors.' },
  { k: 'festcomp', name: 'The Festival Screenplay Competition', month: 2, fee: 50, bar: 70, prize: 5000, d: 'Prize money and a staged reading at the festival.' }
];
function enterContest(a) {
  const M = S.me, sc = (M.scripts || []).find(x => x.id === a.id), C = CONTESTS.find(c => c.k === a.c);
  if (!sc || !sc.grade || !C || (sc.entered || []).includes(C.k)) return false;
  M.cash -= usd(C.fee); (sc.entered = sc.entered || []).push(C.k);
  (M.contests = M.contests || []).push({ c: C.k, script: sc.id, due: S.week + 8 + Math.floor(prnd() * 6) });
  diary(`You send ${sc.title} to ${C.name}.`);
  return true;
}
function contestWeek() {
  const M = S.me, me = ME();
  for (const e of (M.contests || []).filter(x => x.due <= S.week && !x.done)) {
    e.done = true;
    const C = CONTESTS.find(c => c.k === e.c), sc = M.scripts.find(x => x.id === e.script), roll = sc.score + (prnd() - .5) * 18;
    if (roll >= C.bar) { M.cash += usd(C.prize); me.standing = clamp(me.standing + 4, 0, 100); me.fame = clamp((me.fame || 0) + 4, 0, 100); sc.won = (sc.won || []).concat(C.name);
      inbox('news', `${C.name}: you're in`, `${sc.title} is selected. ${C.d}${C.prize ? ' A cheque for ' + fmtCash(usd(C.prize)) + ' follows.' : ''} Agents start returning your calls.`);
      (M.milestones = M.milestones || []).push({ w: S.week, t: `${sc.title} won a place at ${C.name}` }); }
    else if (roll >= C.bar - 12) inbox('note', `${C.name}: quarter-finals`, `${sc.title} made the quarter-finals. Not this year, but someone noticed.`);
    else inbox('note', `${C.name}: not selected`, `${sc.title} wasn't selected. Thousands enter.`);
  }
}
