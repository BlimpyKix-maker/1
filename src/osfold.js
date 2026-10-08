// ---------------- The computer as home base ----------------
// Almost everything opens inside ApplOS now: the box office, companies, awards, careers, charts and the world; your
// work, creative projects, contests, standing, life and people; and every film, person or company you click opens as
// a page inside the computer, with its own back button, instead of throwing you onto another screen.
function stackPage(cur) { return (typeof viewMine === 'function' && viewMine(cur)) || (cur.kind === 'award' && typeof viewAwardBody === 'function' ? viewAwardBody(cur.id) : cur.kind === 'post' && typeof viewPost === 'function' ? viewPost(cur.id) : cur.kind === 'person' ? viewPerson(cur.id) : cur.kind === 'film' ? viewFilm(cur.id) : cur.kind === 'article' ? articleHTML(cur.id) : (typeof viewExtra === 'function' && viewExtra(cur)) || viewCompany(cur.id)); }
// A desk tab rendered on its own, cut from the career screen.
function deskPart(k) {
  const was = UI.dtab; UI.dtab = k; UI.inPart = true;
  let html = '';
  try { html = viewYou(); } finally { UI.dtab = was; UI.inPart = false; }
  const i = html.indexOf('<div class="dstack">');
  return i >= 0 ? html.slice(i) : html;
}
const FOLD = {
  today: ['📥', 'Today', 'Decisions waiting on you, this week\'s news and your next steps', () => deskPart('today')],
  feed: ['📰', 'Feed', 'Everything that happened to you, newest first', () => deskPart('feed')],
  week: ['🗓️', 'Plan the week', 'Your diary, block by block, and the city', () => deskPart('diary')],
  phoneapp: ['📱', 'Phone', 'Texts, calls and the people who text back', () => deskPart('phone')],
  work: ['🧰', 'Work', 'Your jobs, the tasks on them and the full job board', () => deskPart('work')],
  create: ['🎨', 'Create', 'Your portfolio, scripts, productions and company', () => deskPart('create')],
  contests: ['🥇', 'Contests', 'Competitions to enter and awards campaigns', () => deskPart('compete')],
  standing: ['⭐', 'Standing', 'Reputation, ambitions and achievements', () => deskPart('standing')],
  life: ['🏡', 'Life', 'Your place, your story and the paths you\'ve taken', () => deskPart('life')],
  people: ['🤝', 'People', 'Mentor, cohort, circle, regulars and every contact', () => deskPart('people')],
  boxoffice: ['🎟️', 'Box Office', 'Grosses by week, by year and all time', () => viewBoxOffice()],
  companies: ['🏢', 'Companies', 'Every studio, label, network and theatre', () => viewCompanies()],
  awards: ['🏆', 'Awards', 'Every prize, its history and every winner', () => viewAwards()],
  careers: ['🪜', 'Careers', 'Every job in the business and how to climb', () => viewCareers()],
  charts: ['📊', 'Charts', 'Music, video, podcast and stage charts', () => viewCharts()],
  world: ['🌍', 'World', 'Markets, tastes, trends and the industry weather', () => viewWorld()]
};
for (const k in FOLD) { const [i, n, d, fn] = FOLD[k]; OS_EXTRA[k] = [i, n, d]; OS_VIEWS[k] = fn; }
// Regroup the sidebar around the computer being the whole desk.
OS_GROUPS.splice(0, OS_GROUPS.length,
  ['Today', ['home', 'today', 'feed', 'cal', 'week']],
  ['Work', ['work', 'mail', 'phoneapp', 'contacts', 'people']],
  ['Make', ['create', 'write', 'studio', 'cutroom', 'notes', 'contests']],
  ['Money', ['bank', 'ticker', 'bazaar']],
  ['Industry', ['trades', 'roger', 'gea', 'boxoffice', 'companies', 'awards', 'charts', 'careers', 'world', 'flick', 'weather']],
  ['You', ['standing', 'life', 'library']],
  ['Play', ['sweep', 'match', 'cue', 'scramble', 'store']]);
// Pages opened from inside the computer stay inside it.
function osStackHTML() {
  const L = UI.osStack || []; if (!L.length) return null;
  const cur = L[L.length - 1];
  let body; try { body = stackPage(cur); } catch (e) { body = `<p class="muted">This page crashed: ${esc(String(e.message || e))}</p>`; }
  return `<div class="os-page"><button class="os-btn" data-osback="1">‹ Back</button> ${L.length > 1 ? `<button class="os-link" data-osclose="1">Close all</button>` : ''}<div class="os-pagebody">${body}</div></div>`;
}
function osFoldClick(t, e) {
  const d = t.dataset;
  if (d.osback) { (UI.osStack || []).pop(); render(true); return true; }
  if (d.osclose) { UI.osStack = []; render(true); return true; }
  if (d.app && UI.osStack && UI.osStack.length) UI.osStack = [];
  return false;
}
// Called before the global click handler: a data-go link inside the computer opens in the computer.
function osCaptureGo(t) {
  if (!t.dataset.go || !t.closest || !t.closest('.os')) return false;
  const g = t.dataset.go, ci = g.indexOf(':'), kind = g.slice(0, ci), id = g.slice(ci + 1);
  (UI.osStack = UI.osStack || []).push({ kind, id: /^-?\d+$/.test(id) ? +id : id });
  if (UI.osStack.length > 30) UI.osStack.shift();
  render(true); const m = document.querySelector('.os-main'); if (m) m.scrollTop = 0; return true;
}
