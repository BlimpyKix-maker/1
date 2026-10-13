// ================= What a job pays, in this world =================
// Round 23. The careers catalogue only had research notes on pay for 86 of 546 jobs ("Pay seen"), so the column was
// mostly empty and never matched what the game paid. Now each job shows a typical day rate in this world: the rate
// the job board pays for the same job (matched by title), or, where the board never posts it, the going rate for
// its level. It is scaled to your city and year like every other wage, and if you have done the job your own best
// rate is shown under it. The research notes live in the job's details, as what people report.
let CP_IDX = null;
const CP_STOP = new Set(['the', 'and', 'for', 'of', 'a', 'an', 'to', 'in', 'on', 'at']);
function cpWords(s) { return String(s || '').toLowerCase().replace(/[^a-z ]/g, ' ').split(/\s+/).filter(w => w.length > 1 && !CP_STOP.has(w)); }
function cpSim(A, B) { let n = 0; for (const w of A) if (B.has(w)) n++; return n / Math.max(1, A.size + B.size - n); }
function cpIndex() {
  if (CP_IDX) return CP_IDX;
  const T = [].concat(typeof POSTS !== 'undefined' ? POSTS : [], typeof ODD_JOBS !== 'undefined' ? ODD_JOBS : [], typeof FIELD_JOBS !== 'undefined' ? FIELD_JOBS : []).filter(t => t && t.t && t.rate > 0);
  return CP_IDX = T.map(t => [new Set(cpWords(t.t)), t]);
}
const CP_MEMO = {};
function cpMatch(j) {
  if (CP_MEMO[j.id] !== undefined) return CP_MEMO[j.id];
  const W = new Set(cpWords(j.t)); let best = null, bs = 0;
  for (const [S2, t] of cpIndex()) { const sc = cpSim(W, S2); if (sc > bs) { bs = sc; best = t; } }
  return CP_MEMO[j.id] = bs >= .5 ? best : null;
}
// the going day rate by level (2027 dollars), when the board never posts the job
const CP_LEVEL = [90, 170, 280, 450, 800, 1700];
function cpRate(j) {
  const t = cpMatch(j), top = /\b(chief|president|chair|head of|vice president|executive vice|ceo|cfo|coo)\b/i.test(j.t);
  const base = t ? t.rate : CP_LEVEL[clamp(j.lv || 0, 0, 5)] * (top ? 2.2 : 1);
  return { day: usdW(base), board: !!t };
}
function cpMine(j) {
  const M = S.me; if (!M) return 0; const W = new Set(cpWords(j.t)); let best = 0;
  for (const x of [].concat(M.jobs || [], M.past || [])) if (x && x.rate && cpSim(W, new Set(cpWords(x.t))) >= .5) best = Math.max(best, x.rate);
  return best;
}
function careerPayCell(j) {
  const R = cpRate(j), mine = cpMine(j);
  return `<b>${fmtCash(R.day)}</b><span class="muted small"> a day${R.board ? '' : ', typical'}</span>${mine ? `<br><span class="small">you: ${fmtCash(mine)} a day</span>` : ''}`;
}
function careerPayDetail(j) {
  const R = cpRate(j), yr = Math.round(R.day * (j.lv >= 4 ? 230 : 160));
  return `<h4>What it pays</h4><p>About <b>${fmtCash(R.day)}</b> a day in ${esc(S.me ? hubName(S.me.hub) : 'Hollywood')} in ${S.year}${R.board ? ', the rate the board pays for it' : ', the going rate at this level'}; a busy year comes to about ${fmtCash(yr)}.${cpMine(j) ? ` You have been paid ${fmtCash(cpMine(j))} a day for it.` : ''}</p>${j.pay ? `<p class="muted small">What people report: ${esc(deReal(j.pay))}</p>` : ''}`;
}
CLICK_HOOKS.cpsort = () => { UI.jobs.paySort = !UI.jobs.paySort; render(true); };
