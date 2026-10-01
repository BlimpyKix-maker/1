// Headless harness: runs the game's script in Node with a stub DOM, so the simulation can be tested
// without a browser. Usage: node tools/harness.js [startYear] [depth] [weeks]
const fs = require('fs'), path = require('path'), vm = require('vm');
const html = fs.readFileSync(process.env.APPLEBOX_HTML || path.join(__dirname, '..', 'index.html'), 'utf8');
const src = html.slice(html.indexOf('<script>') + 8, html.lastIndexOf('</script>')).replace(/\n\{ const sv = loadSave\(\);[^\n]*\n\s*$/, '\n');
const el = () => ({ innerHTML: '', textContent: '', hidden: false, style: {}, classList: { toggle() {} }, addEventListener() {}, focus() {}, setSelectionRange() {} });
const ctx = { console, Math, Date, JSON, setTimeout: f => f(), clearTimeout() {}, window: { scrollTo() {} },
  document: { querySelector: el, querySelectorAll: () => [], addEventListener() {}, scrollingElement: { scrollTop: 0 } } };
vm.createContext(ctx);
vm.runInContext(src + '\n;globalThis.__S = () => S;', ctx);
module.exports = { ctx, run: code => vm.runInContext(code, ctx) };
if (require.main === module) {
  const [y = 2027, depth = 'quick', weeks = 0] = process.argv.slice(2);
  const t0 = Date.now();
  vm.runInContext(`newWorld(${+y}, ${+y}, '${depth}'); while (archiving()) archiveStep(); while (warming()) tick(); finishWarm(); for (let i = 0; i < ${+weeks}; i++) tick();`, ctx);
  const S = ctx.__S();
  console.log(`built in ${Date.now() - t0}ms: ${S.people.length} people, ${S.films.length} films, ${S.companies.length} companies, week ${S.week}`);
}
