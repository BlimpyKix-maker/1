// ---------------- The trade press: articles ----------------
// Every headline opens into a short article, written from what the simulation knows (budgets, grosses, who made
// it, who said what) plus invented colour: quotes, anonymous sources, a rival's shrug. Same article every time.
const PAPERS = ['The Daily Slate', 'Reel Report', 'Box Office Bulletin', 'The Lot', 'Frame & Fortune', 'Cut! Weekly', 'The Clapper'];
const QUOTE_FILM = ['"We made the film we wanted to make. Everything else is weather."', '"Nobody knows anything, and I mean that as a compliment."', '"I\'m just glad people showed up."', '"Every film is a miracle. This one was a small one."', '"We had no money and a lot of nerve."', '"The audience decides. They always do."', '"I\'d do it all again. Maybe with more sleep."'];
const QUOTE_RIVAL = ['"Good for them," one rival executive said, not entirely convincingly.', 'A rival producer called it "a fluke with good lighting."', 'One studio insider said they "saw it coming a mile off."', 'A competitor declined to comment, then commented at length off the record.'];
const SOURCE = ['according to people familiar with the matter', 'sources close to the production say', 'two people who worked on it told this paper', 'insiders say', 'one crew member said'];
function byline(i) { const r = hashRand(i * 31 + 7), N = NAMES.en; return `${N[r() < .5 ? 'M' : 'F'][Math.floor(r() * 10)]} ${N.L[Math.floor(r() * N.L.length)]}`; }
function articleHTML(i) {
  const n = S.news[i];
  if (!n) return '<p class="muted">This story has been pulled.</p>';
  const r = hashRand(i * 97 + n.w), pk = a => a[Math.floor(r() * a.length)], paper = pk(PAPERS);
  const f = n.ref && n.ref.film !== undefined ? S.films[n.ref.film] : null, p = n.ref && n.ref.person !== undefined ? P(n.ref.person) : null, c = n.ref && n.ref.company !== undefined ? S.companies[n.ref.company] : null;
  const paras = [];
  if (f) {
    const d = P(f.dir), lead = f.cast[0] !== undefined ? P(f.cast[0]) : null, co = f.co !== null ? S.companies[f.co] : null;
    paras.push(`${f.title}, ${co ? `${co.name}'s` : 'the independent'} ${f.genre.toLowerCase()} directed by ${d.name}${lead ? ` and starring ${lead.name}` : ''}, ${n.type === 'Hit' ? 'has become the talk of the business' : n.type === 'Flop' ? 'has stumbled badly at the box office' : n.type === 'Award' ? 'has taken one of the season\'s big prizes' : n.type === 'Set' ? 'is having an eventful production' : n.type === 'Cult' || n.type === 'Legacy' ? 'is enjoying an unexpected second life' : 'is the story of the week'}. ${filmLogline(f)}`);
    if (f.rel !== null) paras.push(`The film ${f.total > f.cost * 2 ? 'has earned' : 'has taken'} ${fmtM(f.total)} worldwide against a reported cost of ${fmtM(f.cost)}, ${pk(SOURCE)}. Critics have been ${f.reviews >= 75 ? 'warm, some of them ecstatic' : f.reviews >= 55 ? 'mixed but respectful' : 'unkind'}${f.reviews ? ` (an average of ${f.reviews}/100)` : ''}.`);
    else paras.push(`The production, budgeted at ${fmtM(f.budget)}, is currently in ${f.status.toLowerCase()}. ${pk(SOURCE).replace(/^./, x => x.toUpperCase())} that ${pk(['the schedule is tight', 'morale is high', 'the script is still changing', 'the director is getting exactly what they want', 'the money men are nervous'])}.`);
    paras.push(`${d.name} told ${paper}: ${pk(QUOTE_FILM)}`);
    if (n.type === 'Hit' || n.type === 'Award') paras.push(pk(QUOTE_RIVAL));
    if (f.events && f.events.length) { const E = f.events.slice(-2); paras.push(`${E.some(e => (e.q || 0) < 0) ? 'It hasn\'t all been smooth.' : 'Word from the set is good.'} ${E.map(e => e.t).join(' ')}`); }
  } else if (p && S.me && p.id === S.me.id && typeof playerArticle === 'function') {
    paras.push(...playerArticle(n, r));
  } else if (p) {
    paras.push(`${n.text} ${personBio(p)}`);
    paras.push(`${pk(['Friends describe', 'Colleagues describe', 'Those who know them describe'])} ${p.name.split(' ')[0]} as ${pk(['generous to a fault', 'impossible to rattle', 'the hardest-working person on any set', 'quietly ruthless', 'funnier than their films suggest'])}. ${pk(SOURCE).replace(/^./, x => x.toUpperCase())} that ${pk(['their next move is already lined up', 'they have been thinking about this for a while', 'nobody saw it coming', 'the phone has not stopped ringing'])}.`);
  } else if (c) {
    paras.push(`${n.text} ${c.name}, founded in ${c.founded}, has ${c.films.length} film${c.films.length === 1 ? '' : 's'} to its name and ${c.hits} hit${c.hits === 1 ? '' : 's'}.`);
    paras.push(`${pk(SOURCE).replace(/^./, x => x.toUpperCase())} that ${pk(['the board has been nervous for months', 'a buyer has been circling', 'the slate is stronger than people think', 'the money ran out faster than anyone expected'])}.`);
  } else {
    paras.push(`${n.text} ${pk(['Executives across town are taking note.', 'Agents say their phones have been busy.', 'It is the kind of shift that changes what gets made next year.', 'Not everyone is convinced it will last.'])}`);
    paras.push(`${pk(SOURCE).replace(/^./, x => x.toUpperCase())} that ${pk(['studios are already adjusting their slates', 'smaller companies will feel it first', 'audiences got there before the executives did'])}.`);
  }
  const links = [f ? fl(f.id) : '', p ? pl(p.id) : '', c ? cl(c.id) : '', f && f.co !== null ? cl(f.co) : ''].filter(Boolean);
  return `<article class="article"><p class="eyebrow">${esc(paper)} · ${esc(n.type)} · ${fmtDate(n.w, true)}</p><h2>${esc(n.text)}</h2><p class="muted">By ${esc(byline(i))}</p>
   ${f ? `<div class="art-media">${posterSVG(f, 120)}</div>` : p ? `<div class="art-media">${portraitOf(p, 110)}</div>` : ''}
   ${paras.map(t => `<p>${esc(t)}</p>`).join('')}
   ${links.length ? `<p class="golinks">Related: ${links.join(' · ')}</p>` : ''}</article>`;
}
