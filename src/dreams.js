// ---------------- Dreams: if you can dream it, you can try it ----------------
// You don't pick an industry when you start, only a dream: anything from cinematographer to stand-up, rapper to
// festival programmer. Each dream sits on one of the world's working roles (which decides the craft you train) and
// says what counts as the work you came for (a department or a job title). Where you end up working decides your
// field as you go: a would-be screenwriter who spends three years writing for television and making a podcast will
// find the business thinks of them as a podcaster, and the game follows that.
// d: { k, label, role, field, grp, core: [dept regex, title regex, exclude regex?], first?: a project to start with, blurb }
const DREAMS = [
  // ---- film and television ----
  { k: 'director', label: 'Film director', role: 'director', field: 'film', grp: 'Film & TV', blurb: 'Tell the story with everything: actors, camera, cut, sound.' },
  { k: 'actor', label: 'Actor', role: 'actor', field: 'film', grp: 'Film & TV', blurb: 'From day player to the name above the title.' },
  { k: 'writer', label: 'Screenwriter', role: 'writer', field: 'film', grp: 'Film & TV', blurb: 'Every film starts as pages someone wrote alone.' },
  { k: 'producer', label: 'Producer', role: 'producer', field: 'film', grp: 'Film & TV', blurb: 'Find the story, the money and the people, and make it happen.' },
  { k: 'dp', label: 'Cinematographer', role: 'dp', field: 'film', grp: 'Film & TV', blurb: 'Light, lenses and the look of a film.' },
  { k: 'editor', label: 'Film editor', role: 'editor', field: 'film', grp: 'Film & TV', blurb: 'The final rewrite happens in the cut.' },
  { k: 'designer', label: 'Production designer', role: 'designer', field: 'film', grp: 'Film & TV', blurb: 'Build the world the story lives in.' },
  { k: 'costume', label: 'Costume designer', role: 'costume', field: 'film', grp: 'Film & TV', blurb: 'Character, told in fabric.' },
  { k: 'composer', label: 'Film composer', role: 'composer', field: 'film', grp: 'Film & TV', blurb: 'The music that tells you how to feel.' },
  { k: 'casting', label: 'Casting director', role: 'casting', field: 'film', grp: 'Film & TV', blurb: 'Find the face nobody knew they needed.' },
  { k: 'sound', label: 'Sound designer', role: 'sound', field: 'film', grp: 'Film & TV', core: [/^Sound Department|^Broadcasting\/Sound/, /\b(sound|boom|mixer|foley|dialogue editor|re-recording)\b/i] },
  { k: 'vfx', label: 'Visual effects artist', role: 'vfx', field: 'film', grp: 'Film & TV', core: [/^(Visual Effects|Animation$|Special Effects)/, /\b(vfx|visual effects|compositor|compositing|effects)\b/i] },
  { k: 'makeup', label: 'Make-up and hair artist', role: 'makeup', field: 'film', grp: 'Film & TV', core: [/^Makeup/, /\b(make-?up|hair|prosthetic)\b/i] },
  { k: 'stunts', label: 'Stunt performer', role: 'stunts', field: 'film', grp: 'Film & TV', core: [/^Stunts/, /\b(stunt|fight|double)\b/i] },
  { k: 'ad', label: 'Assistant director', role: 'ad', field: 'film', grp: 'Film & TV', core: [/^Second Unit Director or Assistant Director|^Production Management/, /\b(assistant director|1st ad|2nd ad|first ad|production manager|unit production)\b/i] },
  { k: 'animator', label: 'Animator', role: 'designer', field: 'film', grp: 'Film & TV', core: [/^Animation/, /\b(animat\w*|storyboard|rigging|layout artist)\b/i] },
  { k: 'doc', label: 'Documentary filmmaker', role: 'director', field: 'film', grp: 'Film & TV', core: [/^(Directed|Broadcast News)/, /\b(documentar\w*|director|field producer|researcher)\b/i, /(art|casting|musical|photography|development) director/i] },
  { k: 'showrunner', label: 'TV showrunner', role: 'writer', field: 'film', grp: 'Film & TV', core: [/^(Writing|Film and TV Development|TV Network)/, /\b(showrunner|staff writer|story editor|writers' (room|assistant)|co-executive producer|writer)\b/i] },
  { k: 'host', label: 'Television presenter', role: 'actor', field: 'film', grp: 'Film & TV', core: [/^(Broadcast News|TV Station|Radio|Sports)/, /\b(host|presenter|anchor|correspondent|co-host)\b/i] },
  { k: 'voice', label: 'Voice actor', role: 'actor', field: 'film', grp: 'Film & TV', core: [/^Voice Actors/, /\b(voice|narrator|dubbing actor|audiobook|loop group)\b/i] },
  // ---- the business of it ----
  { k: 'exec', label: 'Studio executive', role: 'producer', field: 'film', grp: 'The business', core: [/^(Executive Positions|Film and TV Development|Studio)/, /\b(executive|development|vice president|president|head of)\b/i] },
  { k: 'agent', label: 'Talent agent', role: 'producer', field: 'film', grp: 'The business', core: [/^Agency\/Management/, /\b(agent|manager|agency)\b/i] },
  { k: 'critic', label: 'Film critic', role: 'writer', field: 'creator', grp: 'The business', core: [/^(Digital Publishing|Broadcast News)/, /\b(critic|review\w*|columnist|film writer)\b/i], first: 'video' },
  { k: 'programmer', label: 'Festival programmer', role: 'producer', field: 'film', grp: 'The business', core: [/^Film Festivals/, /\b(festival|programm\w*|screener|curator)\b/i] },
  { k: 'distributor', label: 'Film distributor', role: 'producer', field: 'film', grp: 'The business', core: [/^(Exhibition & Distribution|Sales)/, /\b(distribut\w*|sales|acquisitions|booker|exhibition)\b/i] },
  { k: 'publicist', label: 'Publicist', role: 'producer', field: 'film', grp: 'The business', core: [/^(Publicity|Publicity\/PR|Marketing|Advertising)/, /\b(publicist|publicity|press|marketing|pr\b)/i] },
  { k: 'lawyer', label: 'Entertainment lawyer', role: 'producer', field: 'film', grp: 'The business', core: [/^(Legal|Legal and Business Affairs)/, /\b(counsel|attorney|lawyer|business affairs|clearance)\b/i] },
  { k: 'locations', label: 'Location manager', role: 'producer', field: 'film', grp: 'The business', core: [/^Location Management/, /\b(location)\b/i] },
  { k: 'mogul', label: 'Studio owner', role: 'producer', field: 'film', grp: 'The business', blurb: 'Start small and own the place one day.' },
  // ---- music ----
  { k: 'singer', label: 'Singer-songwriter', role: 'composer', field: 'music', grp: 'Music', core: [/^Music/, /\b(song\w*|singer|vocal\w*|session musician|band)\b/i], first: 'song' },
  { k: 'rapper', label: 'Rapper', role: 'composer', field: 'music', grp: 'Music', core: [/^Music/, /\b(song\w*|vocal\w*|lyric\w*|mc|artist)\b/i], first: 'song' },
  { k: 'beatmaker', label: 'Record producer', role: 'sound', field: 'music', grp: 'Music', core: [/^Music/, /\b(record producer|engineer|beat\w*|mix\w*|master\w*|studio)\b/i], first: 'song' },
  { k: 'dj', label: 'DJ', role: 'sound', field: 'music', grp: 'Music', core: [/^Music/, /\b(dj|club|resident|mix\w*|radio)\b/i], first: 'song' },
  { k: 'musician', label: 'Session musician', role: 'composer', field: 'music', grp: 'Music', core: [/^Music/, /\b(musician|player|band|orchestra\w*|session)\b/i], first: 'score' },
  { k: 'mvdir', label: 'Music video director', role: 'director', field: 'music', grp: 'Music', core: [/^(Music|Commercial Production|Content Creator)/, /\b(music video|director|video)\b/i], first: 'mv' },
  { k: 'aandr', label: 'Record label executive', role: 'producer', field: 'music', grp: 'Music', core: [/^Music/, /\b(a&r|label|artist manager|booking|promoter|tour manager)\b/i] },
  // ---- online ----
  { k: 'youtuber', label: 'Video creator', role: 'editor', field: 'creator', grp: 'Online', core: [/^(Online video|YouTube|Content Creator)/, /\b(creator|video|editor|thumbnail|channel)\b/i], first: 'video' },
  { k: 'shortform', label: 'Short-form comedian', role: 'actor', field: 'creator', grp: 'Online', core: [/^(Online video|Content Creator|Social Media)/, /\b(creator|comed\w*|sketch|social)\b/i], first: 'blip' },
  { k: 'streamer', label: 'Livestreamer', role: 'actor', field: 'creator', grp: 'Online', core: [/^(Online video|Content Creator)/, /\b(stream\w*|creator|host|moderator)\b/i], first: 'video' },
  // ---- audio ----
  { k: 'podcaster', label: 'Podcaster', role: 'writer', field: 'podcast', grp: 'Audio', core: [/^(Podcast|Podcasts & radio|Radio)/, /\b(podcast|host|audio|radio)\b/i], first: 'podcast' },
  { k: 'radio', label: 'Radio presenter', role: 'actor', field: 'podcast', grp: 'Audio', core: [/^(Radio|Podcasts & radio)/, /\b(radio|presenter|host|dj|producer)\b/i], first: 'podcast' },
  { k: 'audiodrama', label: 'Audio drama maker', role: 'sound', field: 'podcast', grp: 'Audio', core: [/^(Podcast|Podcasts & radio)/, /\b(audio|sound|podcast|drama)\b/i], first: 'podcast' },
  // ---- stage ----
  { k: 'stagedir', label: 'Theatre director', role: 'director', field: 'stage', grp: 'Stage', core: [/^Theatre/, /\b(director|associate director|resident director)\b/i], first: 'play' },
  { k: 'playwright', label: 'Playwright', role: 'writer', field: 'stage', grp: 'Stage', core: [/^Theatre/, /\b(playwright|writer|dramaturg|literary)\b/i], first: 'play' },
  { k: 'stageactor', label: 'Stage actor', role: 'actor', field: 'stage', grp: 'Stage', core: [/^Theatre/, /\b(actor|ensemble|understudy|cast|performer)\b/i] },
  { k: 'musicaltheatre', label: 'Musical theatre performer', role: 'actor', field: 'stage', grp: 'Stage', core: [/^(Theatre|Choreography)/, /\b(ensemble|musical|performer|swing|understudy|dancer)\b/i], first: 'musical' },
  { k: 'choreographer', label: 'Choreographer', role: 'actor', field: 'stage', grp: 'Stage', core: [/^Choreography|^Theatre/, /\b(choreograph\w*|dance\w*|movement)\b/i] },
  { k: 'standup', label: 'Stand-up comedian', role: 'actor', field: 'stage', grp: 'Stage', core: [/^(Theatre|Theater\/Live Events)/, /\b(comed\w*|stand-?up|open mic|warm-up|host)\b/i], first: 'play' },
  { k: 'stagetech', label: 'Theatre lighting and stage designer', role: 'dp', field: 'stage', grp: 'Stage', core: [/^Theatre/, /\b(lighting|stage|set|technician|designer)\b/i] },
  { k: 'magician', label: 'Magician', role: 'actor', field: 'stage', grp: 'Stage', core: [/^(Theater\/Live Events|Theatre)/, /\b(magic\w*|illusion\w*|performer|act)\b/i] },
  { k: 'circus', label: 'Circus and live performer', role: 'stunts', field: 'stage', grp: 'Stage', core: [/^(Theater\/Live Events|Stunts)/, /\b(acrobat\w*|circus|aerial|performer|stunt)\b/i] },
  // ---- games and the rest ----
  { k: 'gamedev', label: 'Game designer', role: 'designer', field: 'film', grp: 'Games and more', core: [/^Video Game/, /\b(game|level|narrative designer|motion-capture)\b/i] },
  { k: 'stylist', label: 'Celebrity stylist', role: 'costume', field: 'film', grp: 'Games and more', core: [/^(Fashion|Costume)/, /\b(stylist|fashion|wardrobe|costume)\b/i] },
  { k: 'photographer', label: 'Set photographer', role: 'dp', field: 'film', grp: 'Games and more', core: [/^(Camera and Electrical|Publicity)/, /\b(photograph\w*|stills|camera)\b/i] },
  { k: 'puppeteer', label: 'Puppeteer', role: 'vfx', field: 'film', grp: 'Games and more', core: [/^Puppetry/, /\b(puppet\w*|creature)\b/i] }
];
const DREAM_BY = {}; for (const d of DREAMS) DREAM_BY[d.k] = d;
function dreamOf() { return S.me && (DREAM_BY[S.me.dream] || DREAM_BY[ME().role]) || null; }
function dreamLabel() { const d = dreamOf(); return d ? d.label : ROLE_LABEL[ME().role]; }
// where your work has actually been: jobs (weeks) and releases over the last two years, by field
const PLAT_FIELD = p => ({ spinly: 'music', library: 'music', vidwire: 'creator', blip: 'creator', blog: 'creator', podhaus: 'podcast', stage: 'stage', circuit: 'film' })[p] || 'film';
function fieldScores() {
  const M = S.me, sc = { film: 0, music: 0, creator: 0, podcast: 0, stage: 0 }, ind = p => { const i = typeof postIndustry === 'function' ? postIndustry(p) : 'film'; return i === 'tv' ? 'film' : sc[i] !== undefined ? i : 'film'; };
  for (const p of M.past || []) if (S.week - (p.to || 0) < 104) sc[ind(p)] += Math.min(52, (p.to || S.week) - (p.from || p.to || S.week));
  for (const j of M.jobs || []) sc[ind(j)] += Math.min(52, S.week - (j.started || S.week));
  for (const w of M.works || []) if (w.rel !== undefined && S.week - w.rel < 104) sc[(WORK_TYPES[w.type] || {}).field || PLAT_FIELD(w.plat)] += 10;
  return sc;
}
// once a month: if your work has moved, so has your field (the business decides what you are)
function fieldDrift() {
  const M = S.me; if (!M || !M.party || !M.party.done || S.week % 4 !== 1) return;
  const sc = fieldScores(), cur = M.field || 'film', best = Object.keys(sc).sort((a, b) => sc[b] - sc[a])[0];
  if (best === cur || sc[best] < 30 || sc[best] < sc[cur] * 1.6 + 10) return;
  M.field = best; (M.fieldLog = M.fieldLog || []).push({ w: S.week, f: best });
  const name = FIELDS[best];
  inbox('note', `You're ${best === 'film' ? 'a film person' : 'in ' + name.toLowerCase()} now`, `Look at the last two years: most of your work, and most of what people know you for, has been in ${name.toLowerCase()}. That's how the business sees you now, and it's where the calls will come from. ${dreamOf() && dreamOf().field !== best ? `Your dream (${dreamOf().label.toLowerCase()}) hasn't gone anywhere; it just has company.` : 'Which is where you wanted to be.'}`);
  milestone(`Became known in ${name.toLowerCase()}`, 'work');
}
// the creator's dream picker: every dream, grouped
function dreamSelect(cur, id = 'cc-dream') {
  const G = {}; for (const d of DREAMS) (G[d.grp] = G[d.grp] || []).push(d);
  return `<select id="${id}">${Object.entries(G).map(([g, L]) => `<optgroup label="${esc(g)}">${L.map(d => `<option value="${d.k}"${d.k === cur ? ' selected' : ''}>${esc(d.label)}</option>`).join('')}</optgroup>`).join('')}</select>`;
}
// on your desk: the dream, where the work has put you, and a way to change your mind
function dreamLine() {
  const M = S.me, d = dreamOf(); if (!d) return '';
  const f = M.field || 'film', sc = fieldScores(), tot = Object.values(sc).reduce((a, b) => a + b, 0);
  const mix = tot ? Object.entries(sc).filter(([, v]) => v / tot >= .1).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${FIELDS[k].toLowerCase()} ${Math.round(v / tot * 100)}%`).join(', ') : '';
  return `<p class="voice">Dream: <b>${esc(d.label)}</b> · known in <b>${esc(FIELDS[f].toLowerCase())}</b>${mix ? ` <span class="muted">(last two years: ${esc(mix)})</span>` : ''} <details class="inl"><summary class="linkish">change your dream</summary>${dreamSelect(d.k, 'dr-dream')} <span class="muted">Changing your dream changes the work you look for. Your skills stay; a new craft starts where it is.</span></details></p>`;
}
// a change of heart: the work you look for follows the new dream. Switching crafts is a real pivot (your main
// craft changes, your training follows), and the business takes a while to notice.
function setDream(k) {
  const d = DREAM_BY[k], M = S.me, me = ME(); if (!d || M.dream === k) return false;
  const was = dreamOf(); M.dream = k;
  if (d.role !== me.role) { me.role = d.role; M.train = MAIN[d.role]; me.standing = Math.max(0, me.standing - 3); }
  (M.dreamLog = M.dreamLog || []).push({ w: S.week, k });
  milestone(`Set out to become ${/^[aeiou]/i.test(d.label) ? 'an' : 'a'} ${d.label.toLowerCase()}${was ? ` (was: ${was.label.toLowerCase()})` : ''}`, 'work');
  return true;
}
