// ---------------- The work itself ----------------
// Every job is a string of small deliverables. Each work block moves the current one along; when it's done you roll
// for how well it went. Juniors get small tasks that barely move the needle; heads of department get big ones that
// decide whether the film works. What you deliver goes straight into the film's quality, and into what your boss
// thinks of you. Task choice is a hash of the job, so it costs no dice; only the finishing roll does.
// [what, stat, band]: band 0 junior (tier 0–1), 1 mid (2–3), 2 senior (4+)
const JOB_TASKS = {
  set: [['Lock up the street for the market scene', 'col', 0], ['Run the new pages to every department', 'eth', 0], ['Wrangle forty extras into place before lunch', 'cha', 0], ['Keep the coffee and the walkies charged through a fourteen-hour day', 'eth', 0], ['Clear a car park of a hundred crew cars by dawn', 'com', 1], ['Run the background on the crowd day', 'cha', 1], ['Hold the set together through a night of rain', 'com', 2]],
  ad: [['Draft tomorrow\'s call sheet', 'setm', 0], ['Call the background actions on a busy street', 'cha', 0], ['Rebuild the day after an actor arrives two hours late', 'setm', 1], ['Run the second unit\'s schedule', 'setm', 1], ['Schedule the whole shoot from the script breakdown', 'setm', 2], ['Keep a 200-person set on time through the battle scene', 'com', 2]],
  cam: [['Prep and label the camera package', 'eth', 0], ['Load and log the cards without a single lost clip', 'eth', 0], ['Pull focus on a walking two-shot', 'move', 1], ['Light the diner for the night interior', 'light', 1], ['Set the look of the film with the director', 'colour', 2], ['Light the big set piece in a single afternoon', 'light', 2], ['Design the camera moves for the climax', 'comp', 2]],
  snd: [['Wrangle radio mics on six actors', 'eth', 0], ['Record room tone in every location', 'sound', 0], ['Get clean dialogue on a windy clifftop', 'sound', 1], ['Cut the dialogue for reel two', 'sound', 1], ['Design the sound of the monster', 'sound', 2], ['Mix the final film for cinemas', 'sound', 2]],
  art: [['Source props for the kitchen scene', 'sets', 0], ['Age the newspapers for the period street', 'period', 0], ['Dress the hero\'s bedroom', 'sets', 1], ['Build the bar set on stage two', 'sets', 1], ['Design the world of the film', 'world', 2], ['Turn a warehouse into a palace in three weeks', 'sets', 2]],
  cos: [['Steam and rail the day\'s costumes', 'eth', 0], ['Track continuity on every costume', 'wardrobe', 0], ['Fit thirty extras before the crowd scene', 'wardrobe', 1], ['Make the stunt doubles\' matching outfits', 'wardrobe', 1], ['Design the lead\'s costumes across the story', 'wardrobe', 2], ['Design a whole period wardrobe', 'period', 2]],
  act: [['Learn tomorrow\'s sides', 'eth', 0], ['Nail a one-line reaction in three takes', 'pres', 0], ['Play the big scene in the diner', 'range', 1], ['Carry a long walk-and-talk', 'pres', 1], ['Carry the film\'s emotional climax', 'range', 2], ['Find the character\'s voice in rehearsals', 'range', 2]],
  dir: [['Shot-list the day', 'vstory', 0], ['Rehearse the actors for the dinner scene', 'dact', 1], ['Stage the chase on a closed street', 'stag', 1], ['Find the tone in the first week of shooting', 'tone', 2], ['Direct the climax', 'dact', 2], ['Lock the director\'s cut', 'pace', 2]],
  wri: [['Proofread and format the latest draft', 'eth', 0], ['Write up notes from the table read', 'struc', 0], ['Rewrite the dialogue for the second act', 'dial', 1], ['Fix the ending the test audience hated', 'struc', 1], ['Write the shooting script', 'struc', 2], ['Rebuild the second act from the ground up', 'struc', 2]],
  pro: [['Book the crew hotel for the location week', 'eth', 0], ['Chase the location releases', 'eth', 0], ['Track the daily cost report', 'bud', 1], ['Negotiate the location fees', 'pack', 1], ['Keep the shoot on budget through reshoots', 'bud', 2], ['Close the financing gap', 'fin', 2], ['Sell the film to the distributor', 'mkt', 2]],
  cst: [['Schedule a day of self-tapes', 'eth', 0], ['Pull twenty headshots for the bartender role', 'talent', 0], ['Run the callbacks for the supporting cast', 'talent', 1], ['Find a child actor who can carry a scene', 'talent', 1], ['Cast the lead', 'talent', 2], ['Assemble the ensemble so they feel like a family', 'talent', 2]],
  edt: [['Sync and log the dailies', 'cont', 0], ['Organise the bins for the editor', 'cont', 0], ['Assemble scene twelve', 'rhythm', 1], ['Cut the trailer\'s first pass', 'rhythm', 1], ['Find the film in the assembly', 'shape', 2], ['Lock picture', 'shape', 2]],
  mus: [['Prepare the parts for the session players', 'eth', 0], ['Clear the source music in the bar scene', 'eth', 0], ['Write the cue for the chase', 'score', 1], ['Arrange the main theme for strings', 'orch', 1], ['Write the main theme', 'theme', 2], ['Score the final reel', 'score', 2]],
  vfx: [['Roto the hair in shot 104', 'digi', 0], ['Track the camera in the street plates', 'digi', 0], ['Composite the window views', 'digi', 1], ['Build the creature\'s skin textures', 'digi', 1], ['Supervise the hundred effects shots', 'digi', 2], ['Design the big transformation', 'digi', 2]],
  stn: [['Rig the pads for the fall', 'stunt', 0], ['Double the lead for a run across the roofs', 'stunt', 0], ['Perform the car hit', 'stunt', 1], ['Choreograph the bar fight', 'stunt', 1], ['Design the whole action sequence', 'stunt', 2], ['Run the set safely on the burn day', 'stunt', 2]],
  office: [['Roll the morning calls without dropping one', 'eth', 0], ['Write coverage on the weekend reads', 'tas', 0], ['Organise the boss\'s week of meetings', 'eth', 0], ['Draft the deal memo', 'pack', 1], ['Find the project the company should make next', 'tas', 2]],
  cinema: [['Clean screen four between shows', 'eth', 0], ['Run the box office on a sold-out night', 'com', 0], ['Programme the late-night cult season', 'tas', 1], ['Host the director Q&A', 'cha', 1]],
  intern: [['Photocopy and bind the scripts', 'eth', 0], ['Answer the phones for a morning', 'cha', 0], ['Fetch lunch for twelve, with allergies', 'eth', 0], ['Sit in on a meeting and take notes', 'com', 0]]
};
const TASK_BAND = t => t <= 1 ? 0 : t <= 3 ? 1 : 2;
const TASK_NEED = [3, 4, 6, 8, 10, 12];   // work blocks (half-days) per task by tier: juniors finish two or three a week, heads one a fortnight
const TASK_WEIGHT = [.05, .1, .3, .6, 1.1, 1.8];   // film quality per point by tier
function jobTier(j) { const t = tmplOf(j) || {}; return clamp(Math.round(t.tier ?? j.tier ?? 1), 0, 5); }
function nextTask(j) {
  const fam = familyOf(j), tier = jobTier(j), L = (JOB_TASKS[fam] || JOB_TASKS.set).filter(x => x[2] === TASK_BAND(tier));
  const pool = L.length ? L : (JOB_TASKS[fam] || JOB_TASKS.set);
  const last = (j.tasks || []).slice(-1)[0], P0 = pool.length > 1 && last ? pool.filter(x => x[0] !== last.t) : pool;
  const x = P0[Math.floor(hashRand(j.id * 13 + (j.tasks || []).length * 7 + 1)() * P0.length)];
  return { t: x[0], s: x[1], need: TASK_NEED[tier], prog: 0 };
}
// One work block on a job: move the task along; finish it with a roll.
function jobTaskBlock(j, out) {
  if (!j.task) j.task = nextTask(j);
  const k = j.task; k.prog++;
  if (k.prog < k.need) { if (k.prog === 1) out.push(`New task: ${k.t}.`); else if (k.prog === Math.ceil(k.need / 2)) out.push(`${k.t}: halfway there.`); return; }
  const tier = jobTier(j), f = j.film !== null && j.film !== undefined ? S.films[j.film] : null;
  const dc = Math.round(6 + tier * 1.4 + (f && f.stage === 2 ? 1 : 0));
  const ok = roll(k.s, dc), r = S.me.lastRoll, pts = ok ? (r.crit > 0 ? 2 : 1) : (r.crit < 0 ? -2 : tier <= 1 ? -.5 : -1);   // junior misses sting less
  (j.tasks = j.tasks || []).push({ t: k.t, pts, w: S.week });
  j.task = null;
  const word = pts >= 2 ? 'nailed it' : pts > 0 ? 'done, and done well' : pts > -1 ? 'a bit rough, but it\'ll pass' : pts > -2 ? 'it shows the cracks' : 'a disaster';
  out.push(`${pts > 0 ? '✔' : '✘'} ${k.t}: ${word}.`);
  jobScore(j, pts, k.t);
}
// What a delivered task (or a scene on the job) does: the film, the boss, your name.
function jobScore(j, pts, what) {
  const M = S.me, me = ME(), tier = jobTier(j), f = j.film !== null && j.film !== undefined ? S.films[j.film] : null;
  j.score = (j.score || 0) + pts;
  if (f && f.rel === null) {
    const w = TASK_WEIGHT[tier], cap = w * 8, was = j.contrib || 0, now = clamp(was + pts * w, -cap, cap);
    f.qBonus = (f.qBonus || 0) + (now - was); j.contrib = now; f.you = (f.you || 0) + (now - was);
  }
  if (j.head !== null && j.head !== undefined && P(j.head)) addTie(me, P(j.head), pts > 0 ? 1.2 * pts : 1.8 * pts);
  if (tier >= 2) me.standing = clamp(me.standing + pts * .12 * (tier - 1), 0, 100);
  if (pts <= -2 && j.head !== null && j.head !== undefined) inbox('note', `${P(j.head).name} is not happy`, `${what} went badly wrong, and everyone knows whose job it was. ${tier >= 3 ? 'At this level, it shows up on screen.' : 'A small thing, but people remember.'}`);
}
function jobWorkHTML() {
  const M = S.me;
  if (!M.jobs.length) return '';
  return `<section class="panel jobwork"><h3>The work</h3>${M.jobs.map(j => {
    const tier = jobTier(j), T = j.tasks || [], f = j.film !== null && j.film !== undefined ? S.films[j.film] : null, k = j.task || null;
    const good = T.filter(x => x.pts > 0).length, bad = T.filter(x => x.pts < 0).length;
    return `<div class="jw"><p><b>${esc(j.t)}</b>${f ? ' · ' + fl(f.id) : ''} <span class="muted small">· week ${j.done + 1} of ${j.weeks} · ${['intern', 'junior', 'crew', 'mid-level', 'senior', 'head of department'][tier]} tasks</span></p>
     ${k ? `<p class="small">Now: <b>${esc(k.t)}</b> <span class="tbar"><i style="width:${Math.round(k.prog / k.need * 100)}%"></i></span> ${Math.round(k.prog / k.need * 100)}% · ${esc(statLabel(k.s))}</p>` : `<p class="small muted">Next task starts on your next work day.</p>`}
     ${T.length ? `<ul class="plain small tasks">${T.slice(-5).reverse().map(x => `<li class="${x.pts > 0 ? 'good' : 'bad'}">${x.pts > 1 ? '★' : x.pts > 0 ? '✔' : x.pts <= -2 ? '✘✘' : '✘'} ${esc(x.t)}</li>`).join('')}</ul>` : ''}
     <p class="small">${T.length} delivered: ${good} good, ${bad} rough.${f ? ` Your work so far adds <b class="${(j.contrib || 0) < 0 ? 'bad' : 'good'}">${(j.contrib || 0) >= 0 ? '+' : ''}${(j.contrib || 0).toFixed(1)}</b> to the film's quality${tier <= 1 ? ' (small jobs, small mark: it grows as you rise)' : ''}.` : ''}</p></div>`;
  }).join('')}</section>`;
}
