// ---------- Career: saving ----------
// A save is the world's seed and settings plus the log of everything the player did.
const SAVE_KEY = 'applebox-career-v1';
function doAct(a) {
  if (!applyAct(a)) return false;
  (S.log = S.log || []).push(a);
  saveCareer();
  return true;
}
function saveCareer() { try { localStorage.setItem(SAVE_KEY, JSON.stringify({ v: 1, seed: S.seed, year: S.startYear, depth: S.depth, log: S.log || [] })); } catch (e) { /* storage unavailable: the career lasts as long as the tab */ } }
function loadSave() { try { const s = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); return s && s.v === 1 && Array.isArray(s.log) && s.log.length ? s : null; } catch (e) { return null; } }
function clearSave() { try { localStorage.removeItem(SAVE_KEY); } catch (e) { /* nothing to clear */ } }

// ---------- Career: views ----------
const MAJOR_HUBS = HUB_IDS.filter(h => !HUBS[h].minor);
const PRON = { F: ['She', 'is'], M: ['He', 'is'], X: ['They', 'are'] };
function pron(p) { return PRON[p.g] || PRON.X; }
function suggestName(hub, g) {
  const N = NAMES[HUBS[hub].lang] || NAMES.en, r = a => a[Math.floor(Math.random() * a.length)];
  const f = r(g === 'X' ? N.M.concat(N.F) : N[g]), l = r(N.L);
  return EAST[HUBS[hub].lang] ? `${l} ${f}` : `${f} ${l}`;
}
function ccDefaults() {
  return { name: suggestName('hollywood', 'X'), g: 'X', age: 23, hub: S.startYear >= 2000 ? 'hollywood' : 'hollywood', role: 'director', wealth: 'gettingby', edu: 'film', arrival: 'plusone', build: 'everyday', quirk: 'none', points: {}, traits: [], love: ['Drama', 'Horror'], hate: 'Musical' };
}
function ccSpent(c) { return Object.values(c.points).reduce((s, v) => s + v, 0); }
const optCard = (group, key, o, on) => `<button class="opt${on ? ' on' : ''}" data-cc="${group}" data-v="${esc(key)}" aria-pressed="${on}"><b>${esc(o.label)}</b><span>${esc(o.d)}</span></button>`;

function viewCreator() {
  const c = UI.cc = UI.cc || ccDefaults();
  const left = SKILL_POINTS - ccSpent(c);
  const grid = (group, src) => `<div class="opts">${Object.entries(src).map(([k, o]) => optCard(group, k, o, c[group] === k)).join('')}</div>`;
  const sel2 = (id, val, list) => `<select id="${id}">${list.map(g => `<option${g === val ? ' selected' : ''}>${esc(g)}</option>`).join('')}</select>`;
  return `<div class="head"><p class="eyebrow">Phase 2 · Your career</p><h2>Who are you?</h2><p class="lede">You arrive on the last night of ${S.startYear - 1}, at a New Year's Eve party full of people who already work in film. Every choice here changes something: what you can do, who you know, what you owe. No build is best.</p></div>
  <section class="panel cc"><h3>The basics</h3>
   <div class="ccrow"><label>Name <input id="cc-name" type="text" maxlength="40" value="${esc(c.name)}"></label><button class="linkish" data-cc="rename">Suggest another</button></div>
   <div class="ccrow"><label>Pronouns ${`<select id="cc-g">${[['X', 'they/them'], ['F', 'she/her'], ['M', 'he/him']].map(([v, t]) => `<option value="${v}"${c.g === v ? ' selected' : ''}>${t}</option>`).join('')}</select>`}</label>
   <label>Age <input id="cc-age" type="number" min="18" max="45" value="${c.age}"></label>
   <label>Home hub ${sel('cc-hub', MAJOR_HUBS.map(h => [h, HUBS[h].name]), c.hub)}</label>
   <label>Dream job ${sel('cc-role', DREAM_ROLES.map(r => [r, ROLE_LABEL[r]]), c.role)}</label></div>
   <p class="note">Living costs and pay follow the hub's economy in ${S.startYear}. Younger characters have more room to grow; older ones start more skilled.</p></section>
  <section class="panel cc"><h3>Origin</h3><h4>Family money</h4>${grid('wealth', ORIGIN.wealth)}<h4>Education</h4>${grid('edu', ORIGIN.edu)}<h4>How you got to the party</h4>${grid('arrival', ORIGIN.arrival)}</section>
  <section class="panel cc"><h3>Body</h3>${grid('build', ORIGIN.build)}</section>
  <section class="panel cc"><h3>Skills <span class="count">${left} of ${SKILL_POINTS} points left</span></h3>
   <p class="muted">Everyone starts near the bottom (around 3 to 5 out of 20; 10 is a working professional). Each point raises every part of a craft by about three quarters of a point. Education adds more on top. Your hidden ceiling in each skill is set when you begin.</p>
   <table class="atts">${Object.keys(CRAFTS).map(cr => { const v = c.points[cr] || 0; return `<tr><td>${CRAFTS[cr].label}${cr === MAIN[c.role] ? ' <span class="muted">(dream job +1)</span>' : ''}</td><td class="n"><button class="pm-b" data-cc="pt" data-v="${cr}:-1" ${v <= 0 ? 'disabled' : ''} aria-label="Less ${CRAFTS[cr].label}">−</button> <b>${v}</b> <button class="pm-b" data-cc="pt" data-v="${cr}:1" ${v >= SKILL_MAX || left <= 0 ? 'disabled' : ''} aria-label="More ${CRAFTS[cr].label}">+</button></td><td class="bc">${bar(v, SKILL_MAX, 'accent')}</td></tr>`; }).join('')}</table></section>
  <section class="panel cc"><h3>Personality <span class="count">${c.traits.length} of 3</span></h3><p class="muted">Pick up to three. Most cut both ways.</p>
   <div class="traits">${PLAYER_TRAITS.filter(t => t !== 'Late bloomer' || c.age >= 26).map(t => `<button class="chip trait tbtn${c.traits.includes(t) ? ' on' : ''}" data-cc="trait" data-v="${esc(t)}" aria-pressed="${c.traits.includes(t)}" title="${esc(TRAITS[t].d)}">${esc(t)} <span class="muted">· ${esc(TRAITS[t].d)}</span></button>`).join('')}</div></section>
  <section class="panel cc"><h3>Taste</h3><div class="ccrow"><label>You love ${sel2('cc-love0', c.love[0], GENRES)}</label><label>and ${sel2('cc-love1', c.love[1], GENRES)}</label><label>You can't stand ${sel2('cc-hate', c.hate, GENRES)}</label></div>
   <p class="note">Taste shapes which jobs feel worth it and how you talk about films.</p></section>
  <section class="panel cc"><h3>Something from your past</h3>${grid('quirk', ORIGIN.quirk)}</section>
  <div class="ccgo"><button class="btn primary big-btn" data-cc="go">Go to the party</button><p class="muted">Or just watch the industry run: use the other tabs and the buttons up top.</p></div>`;
}

function viewParty() {
  const M = S.me, pt = M.party;
  const sc = PARTY[pt.step](pt);
  return `<div class="head"><p class="eyebrow">New Year's Eve · ${S.startYear - 1}</p><h2>${esc(sc.title)}</h2></div>
  ${(pt.log || []).map(l => `<div class="plog"><span class="muted">${esc(l.title)}.</span> ${esc(l.choice)}${l.ok === null ? '' : l.ok ? ' <span class="chip good">It works</span>' : ' <span class="chip bad">It doesn’t</span>'}<p>${esc(l.t)}</p></div>`).join('')}
  <section class="panel scene"><p class="big-p">${esc(sc.text)}</p><div class="choices">${sc.opts.map(o => { const p = o.check ? checkP(o.check[0], o.check[1]) : null; return `<button class="choice" data-party="${o.k}"><b>${esc(o.label)}</b>${p !== null ? `<span class="odds">${oddsBand(p)} · ${esc(o.hint)}</span>` : ''}</button>`; }).join('')}</div></section>
  <p class="note">Your odds come from your character's stats. ${pt.drinks >= 3 ? 'You have had a few; it shows.' : ''}</p>`;
}

function meter(label, v, cls, txt) { return `<div class="rep"><span>${label}</span>${bar(v, 100, cls)}<b>${txt ?? Math.round(v)}</b></div>`; }
function viewDesk() {
  const M = S.me, me = ME(), life = ORIGIN.life[M.life];
  const pend = pending();
  const plan = effectivePlan(), jd = jobDays();
  const rent = usd(life.rent) + (M.debt > 0 ? Math.min(M.debt, M.debtPay) : 0) - M.allowance;
  const recent = M.inbox.filter(x => !(x.choices && !x.done)).slice(-14).reverse();
  const known = Object.keys(M.known).map(Number).filter(id => !P(id).dead || M.known[id].tags.includes('Your parent'));
  const slots = appSlots(), picked = [...UI.apps].filter(id => M.board.some(p => p.id === id));
  const actOpts = Object.entries(ACTIVITIES).filter(([k]) => k !== 'work').map(([k, a]) => [k, a.label]);
  const lastDiary = M.diary.filter(d => d.w >= S.week - 1);
  const card = it => `<li class="msg ${it.kind}${it.choices && !it.done ? ' open' : ''}"><div class="mh"><time>${fmtDate(it.w, true)}</time><b>${esc(it.title)}</b></div><p>${esc(it.text)}${it.film !== undefined ? ' ' + fl(it.film) : ''}</p>
    ${it.choices && !it.done ? `<div class="choices">${it.choices.map(c => { const p = c.check ? checkP(c.check[0], c.check[1]) : null; return `<button class="choice" data-pick="${it.id}:${c.k}" ${c.dis ? 'disabled' : ''}><b>${esc(c.label)}</b>${c.dis ? `<span class="odds">${esc(c.dis)}</span>` : p !== null ? `<span class="odds">${oddsBand(p)} · ${esc(c.hint || statLabel(c.check[0]))}</span>` : ''}</button>`; }).join('')}</div>` : ''}
    ${it.result ? `<p class="res">${it.result.ok === true ? chip('It works', 'good') + ' ' : it.result.ok === false ? chip('It doesn’t', 'bad') + ' ' : ''}${esc(it.result.t)}</p>` : ''}</li>`;
  const boardRow = p => {
    const f = p.film !== null ? S.films[p.film] : null, odds = hireOdds(p), on = UI.apps.has(p.id), t = tmplOf(p);
    const why = hireFactors(p).filter(x => Math.abs(x[1]) >= .1).map(x => `${x[0]} ${x[1] > 0 ? '+' : '−'}`).join(', ');
    return `<tr><td><a href="#" class="lk" data-jobinfo="${esc(p.jid)}">${esc(p.t)}</a>${p.ref ? ' ' + chip('Referral', 'good') : ''}${t.cr ? ' ' + chip('Credit', 'hist') : ''}</td><td>${f ? fl(f.id) + ` <span class="muted">${esc(f.status.toLowerCase())}</span>` : `<span class="muted">${esc(t.d)}</span>`}</td><td>${p.head !== null ? pl(p.head) : '<span class="muted">—</span>'}</td><td class="n">${p.days}d × ${p.weeks}w</td><td class="n">${p.rate ? fmtCash(p.rate) : 'unpaid'}</td><td><span class="odds-chip ${odds < .3 ? 'lo' : odds < .65 ? 'mid' : 'hi'}" title="${esc(why)}">${oddsBand(odds)}</span></td>
      <td><label class="applyl"><input type="checkbox" data-apply="${p.id}" ${on ? 'checked' : ''} ${!on && picked.length >= slots ? 'disabled' : ''}> Apply</label></td></tr>`;
  };
  const conRows = known.sort((a, b) => opinion(b) - opinion(a)).map(id => {
    const q = P(id), k = M.known[id], o = opinion(id);
    const film = S.active.map(i => S.films[i]).find(f => keyIds(f).includes(id));
    return `<tr><td>${pl(id)}</td><td>${esc(ROLE_LABEL[q.role])}<span class="muted"> · ${esc(hubName(q.hub))}</span></td><td class="n ${o > 10 ? 'good' : o < -10 ? 'bad' : ''}">${o > 0 ? '+' : ''}${Math.round(o)}</td><td class="n">${Math.round(k.trust)}</td><td class="n">${k.due ? `<span class="good">${k.due} owed to you</span>` : ''}${k.due && k.owe ? ', ' : ''}${k.owe ? `<span class="bad">you owe ${k.owe}</span>` : ''}</td><td class="st">${esc(k.tags.slice(-2).join(' · '))}</td><td class="st">${film ? fl(film.id) : esc(personStatus(q))}</td>
      <td>${(k.due > 0 || k.trust >= 60) && !q.dead ? `<button class="linkish" data-favour="${id}">${k.due > 0 ? 'Call in a favour' : 'Ask for a favour'}</button>` : ''}</td></tr>`;
  }).join('');
  return `<div class="head"><p class="eyebrow">${esc(ROLE_LABEL[me.role])} hopeful · ${esc(hubName(M.hub))} · age ${ageOf(me)}</p><h2>${esc(me.name)}</h2>
   <p class="lede">${M.stats.weeks ? `${M.stats.weeks} weeks of paid work, ${me.credits.length} screen credit${me.credits.length === 1 ? '' : 's'}.` : 'No industry work yet.'} <a href="#" class="lk" data-go="person:${me.id}">Your full sheet</a></p></div>
  <div class="kpis"><div><span>Cash</span><b class="${M.cash < 0 ? 'bad' : ''}">${fmtCash(M.cash)}</b><small class="muted">${fmtCash(rent)} a week to live${M.shark ? ` · owe ${fmtCash(M.shark)} to a lender` : ''}</small></div>
   <div><span>Energy</span>${meter('', M.energy, 'data')}</div><div><span>Stress</span>${meter('', M.stress, 'warm')}</div><div><span>Standing</span>${meter('', me.standing, 'accent')}</div></div>
  ${M.over ? `<section class="panel"><h3>You left the business</h3><p>Your career ended in ${S.year}. The world keeps running; you can watch it from the other tabs.</p><button class="btn primary" data-startover="1">Start a new career</button></section>` : ''}
  <div class="cols two desk">
   <section class="panel"><h3>Inbox ${pend.length ? `<span class="chip bad">${pend.length} to decide</span>` : ''}</h3>
    <ul class="inbox">${pend.map(card).join('')}${recent.map(card).join('') || (pend.length ? '' : '<li class="empty">Nothing yet.</li>')}</ul></section>
   <div>
    <section class="panel"><h3>This week</h3>${M.burnout ? '<p class="bad">Burnt out: this week is rest, whatever you plan.</p>' : ''}
     <table class="atts plan">${SLOT_NAMES.map((d, i) => `<tr><td>${d}</td><td>${plan[i] === 'work' ? `<span class="chip">Work</span> <span class="muted">${esc(M.jobs.map(j => j.t).join(', '))}</span>` : sel('pl-' + i, actOpts, M.plan[i])}</td></tr>`).join('')}</table>
     ${plan.includes('train') ? `<div class="ccrow"><label>Class in ${sel('pl-train', Object.keys(CRAFTS).map(c => [c, CRAFTS[c].label]), M.train)}</label></div>` : ''}
     ${plan.includes('catchup') ? `<div class="ccrow"><label>Catch up with ${sel('pl-catch', [['', 'Choose someone…']].concat(known.filter(id => !P(id).dead).map(id => [id, P(id).name])), M.catchWith ?? '')}</label></div>` : ''}
     <p class="note">${Object.entries(ACTIVITIES).filter(([k]) => plan.includes(k) && k !== 'work').map(([, a]) => `<b>${a.label}:</b> ${a.d}${a.cost ? ` (${fmtCash(usd(a.cost))})` : ''}`).join(' ')}</p>
     <p class="note">Energy left after this plan: about ${Math.round(clamp(M.energy - plan.reduce((s, a) => s + ACTIVITIES[a].e, 0), -50, 100))}. Below 15 you start to fray.</p>
     <div class="ccrow"><label>Living ${sel('pl-life', Object.entries(ORIGIN.life).map(([k, l]) => [k, `${l.label} (${fmtCash(usd(l.rent))}/wk)`]), M.life)}</label></div></section>
    <section class="panel"><h3>Work</h3>${M.jobs.length ? `<ul class="plain">${M.jobs.map(j => `<li><b>${esc(j.t)}</b>${j.film !== null ? ' on ' + fl(j.film) : ''} · ${j.days} days a week · week ${j.done + 1} of about ${j.weeks}${j.head !== null ? ' · under ' + pl(j.head) : ''} <button class="linkish" data-quit="${j.id}">Quit</button></li>`).join('')}</ul>` : '<p class="muted">No job right now. Plan days to look for work, then tick jobs on the board below.</p>'}
     ${M.spec.pages || M.spec.drafts ? `<p class="muted">Spec script: ${M.spec.drafts ? M.spec.drafts + ' finished draft' + (M.spec.drafts > 1 ? 's' : '') + ', ' : ''}${M.spec.pages} pages into the next.</p>` : ''}</section>
    ${lastDiary.length ? `<section class="panel"><h3>Last week</h3><ul class="plain">${lastDiary.map(d => `<li>${esc(d.t)}</li>`).join('')}</ul></section>` : ''}
   </div></div>
  <h3>The board <span class="count">${picked.length} of ${slots} applications planned</span></h3>
  <p class="muted">What you've heard about this week in ${esc(hubName(M.hub))}. ${slots ? `Your ${slots / 3} job-hunting day${slots > 3 ? 's' : ''} let you send ${slots} applications.` : 'Plan at least one day to look for work to apply.'} Hover the odds to see why.</p>
  <div class="tw"><table class="grid"><thead><tr><th>Job</th><th>Production</th><th>Reports to</th><th class="n">Time</th><th class="n">Pay / day</th><th>Odds</th><th></th></tr></thead><tbody>${M.board.map(boardRow).join('') || '<tr><td colspan="7" class="empty">Nothing on the board this week.</td></tr>'}</tbody></table></div>
  ${UI.jobinfo ? jobInfoPanel(UI.jobinfo) : ''}
  <h3>Contacts <span class="count">${known.length}</span></h3>
  <div class="tw"><table class="grid"><thead><tr><th>Name</th><th>Job</th><th class="n">Opinion</th><th class="n">Trust</th><th class="n">Favours</th><th>History</th><th>Now</th><th></th></tr></thead><tbody>${conRows || '<tr><td colspan="8" class="empty">You don’t know anyone yet.</td></tr>'}</tbody></table></div>
  <p class="note">Opinion is how much they like you; trust is whether they believe you. A favour they owe makes them put in a word: your next application to them gets a referral.</p>
  <p class="note"><button class="linkish" data-abandon="1">${UI.abandon ? 'Click again to delete this career for good' : 'Abandon this career'}</button></p>`;
}
function jobInfoPanel(jid) {
  const j = JOBS.jobs.find(x => x.id === jid);
  if (!j) return '';
  return `<section class="panel jobd"><h3>${esc(j.t)} <button class="linkish" data-jobinfo="">Close</button></h3>${j.resp ? `<ul class="plain">${j.resp.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}${j.sk ? `<p class="muted">What it takes: ${j.sk.map(esc).join(' · ')}</p>` : ''}${j.after ? `<p class="muted">Leads to: ${esc(j.after)}</p>` : ''}</section>`;
}
function viewYou() {
  if (UI.replaying) return `<div class="loading"><p class="eyebrow">Loading your career</p><h2>Replaying your life so far</h2><p class="lede">${esc(UI.replaying)}</p></div>`;
  if (!S.me) return viewCreator();
  if (!S.me.party.done) return viewParty();
  return viewDesk();
}

// ---------- Career: controls ----------
function careerActive() { return S && S.me && S.me.party && S.me.party.done && !S.me.over; }
function endWeekAct() { return { t: 'end', plan: S.me.plan.slice(), apps: [...UI.apps], train: S.me.train, catchWith: S.me.catchWith }; }
function playWeeks(n) {
  if (UI.busy || !careerActive()) return;
  if (pending().length) { UI.tab = 'you'; UI.stack = []; render(); return; }
  let left = n;
  setBusy(true, 'Living the week…');
  const step = () => {
    doAct(endWeekAct());
    UI.apps = new Set();
    left--;
    if (left > 0 && careerActive() && !pending().length) { $('#status').textContent = `Living… ${fmtDate(S.week, true)}`; setTimeout(step, 0); }
    else { setBusy(false); UI.tab = 'you'; UI.stack = []; render(); }
  };
  setTimeout(step, 0);
}
function careerClick(t) {
  const c = UI.cc;
  if (t.dataset.cc) {
    const g = t.dataset.cc, v = t.dataset.v;
    if (g === 'rename') c.name = suggestName(c.hub, c.g);
    else if (g === 'pt') { const [cr, d] = v.split(':'); const nv = clamp((c.points[cr] || 0) + +d, 0, SKILL_MAX); if (+d < 0 || ccSpent(c) < SKILL_POINTS) c.points[cr] = nv; }
    else if (g === 'trait') { if (c.traits.includes(v)) c.traits = c.traits.filter(x => x !== v); else if (c.traits.length < 3 && !(v === 'Lazy' && c.traits.includes('Workhorse')) && !(v === 'Workhorse' && c.traits.includes('Lazy')) && !(v === 'Beloved' && c.traits.includes('Difficult')) && !(v === 'Difficult' && c.traits.includes('Beloved'))) c.traits.push(v); }
    else if (g === 'go') {
      c.name = ($('#cc-name').value || '').trim() || suggestName(c.hub, c.g);
      doAct({ t: 'create', c: JSON.parse(JSON.stringify(c)) });
      UI.apps = new Set(); UI.stack = []; render(); return true;
    } else c[g] = v;
    render(true); return true;
  }
  if (t.dataset.party) { doAct({ t: 'party', k: t.dataset.party }); render(true); return true; }
  if (t.dataset.pick) { const [id, k] = t.dataset.pick.split(':'); doAct({ t: 'pick', id: +id, k }); render(true); return true; }
  if (t.dataset.quit) { doAct({ t: 'quit', id: +t.dataset.quit }); render(true); return true; }
  if (t.dataset.favour) { doAct({ t: 'favour', id: +t.dataset.favour }); render(true); return true; }
  if (t.dataset.endweek) { playWeeks(+t.dataset.endweek); return true; }
  if (t.dataset.jobinfo !== undefined) { UI.jobinfo = t.dataset.jobinfo || null; render(true); return true; }
  if (t.dataset.abandon) { if (!UI.abandon) { UI.abandon = true; render(true); return true; } UI.abandon = false; clearSave(); build(S.startYear, S.seed, S.depth); return true; }
  if (t.dataset.startover) { clearSave(); build(S.startYear, S.seed, S.depth); return true; }
  return false;
}
function careerChange(e) {
  const id = e.target.id, v = e.target.value, c = UI.cc;
  if (id.startsWith('cc-')) {
    const k = id.slice(3);
    if (k === 'age') c.age = clamp(+v || 23, 18, 45);
    else if (k === 'love0') c.love[0] = v; else if (k === 'love1') c.love[1] = v;
    else if (k === 'name') c.name = v;
    else c[k] = v;
    if (k === 'hub' || k === 'g') c.name = $('#cc-name') && $('#cc-name').value.trim() ? $('#cc-name').value : suggestName(c.hub, c.g);
    if (k === 'age' && c.age < 26) c.traits = c.traits.filter(t => t !== 'Late bloomer');
    render(true); return true;
  }
  if (/^pl-\d$/.test(id)) { S.me.plan[+id.slice(3)] = v; render(true); return true; }
  if (id === 'pl-train') { S.me.train = v; return true; }
  if (id === 'pl-catch') { S.me.catchWith = v === '' ? null : +v; return true; }
  if (id === 'pl-life') { doAct({ t: 'life', v }); render(true); return true; }
  if (e.target.dataset.apply) { const pid = +e.target.dataset.apply; if (e.target.checked) UI.apps.add(pid); else UI.apps.delete(pid); render(true); return true; }
  return false;
}
// Rebuild a saved career: the world is already built from the same seed; feed it the log.
function replayCareer(log, done) {
  let i = 0;
  UI.replaying = 'Starting…';
  const step = () => {
    const t0 = Date.now();
    while (i < log.length && Date.now() - t0 < 60) { applyAct(log[i]); i++; }
    S.log = log.slice(0, i);
    UI.replaying = `${i} of ${log.length} actions · ${fmtDate(S.week, true)}`;
    $('#main').innerHTML = viewYou();
    if (i < log.length) setTimeout(step, 0);
    else { UI.replaying = null; done(); }
  };
  setTimeout(step, 0);
}
