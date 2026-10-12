// Streaming market probe: runs a world with no player and prints each service once a year: subscribers, price,
// revenue and operating margin, debt, the share index, mood and greenlight bar; plus the cinema window and index.
// usage: [APPLEBOX_HTML=page] node tools/probe-streaming.js <startYear> <years> [seed]
const [y0 = 2027, years = 8, seed = 2027] = process.argv.slice(2).map(Number);
const h = require(require('path').join(__dirname, 'harness.js')); const r = c => h.run(c);
r(`newWorld(${y0}, ${seed}, 'quick'); while (archiving()) archiveStep(); while (warming()) tick(); finishWarm();`);
const show = () => console.log(r(`(() => { const L = svcLive().map(svcOf).filter(Boolean).sort((a, b) => b.subs - a.subs);
  return S.year + '  cinema window ' + cinemaWindow() + 'd idx ' + cinemaIndex().toFixed(2) + ' licMul ' + svcLicMul().toFixed(2) + '\\n' + L.map(s => '   ' + TV_NETS[s.k].name.padEnd(10) + ' ' + s.subs.toFixed(0).padStart(4) + 'M $' + s.price.toFixed(2) + (s.adOn ? ' ads' + Math.round(s.ad * 100) + '%' : '') + ' rev ' + Math.round((s.rev || 0) * 4) + ' op ' + Math.round((s.op || 0) * 4) + ' debt ' + Math.round(s.debt) + ' stock ' + s.stock.toFixed(0) + ' ' + s.mood + ' bar ' + s.bar.toFixed(2)).join('\\n'); })()`));
show();
for (let y = 0; y < years; y++) { r(`for (let i = 0; i < 52; i++) tick();`); show(); }
console.log(r(`(S.svcNews || []).slice(-12).map(x => yearOf(x.w) + ': ' + x.t).join('\\n')`));
