// ---------------- The rest of entertainment on the Bourse ----------------
// The studios aren't the only listed companies. Record labels, publishers, podcast and creator networks, theatre
// owners, television networks and streamers, cinema chains, game makers, theme parks, live-events promoters and
// ticketing all trade here too, each following the part of the business that feeds it. They join the sector list
// (finance.js) so buying, selling, the portfolio and dividends all work the same way.
const ENT_EXTRA = [
  // [key, name, sector, founded, driver, beta, start price, about]
  ['xgame1', 'Ninetendo Interactive', 'Video games', 1977, 'games', 1.3, 24, 'Plumbers, princesses and handheld consoles. Lives on its own characters, and on hits.'],
  ['xgame2', 'Electronic Farts', 'Video games', 1982, 'games', 1.5, 14, 'Sports games every autumn, a new one every year, the same one every year.'],
  ['xgame3', 'Pixel Pirate Studios', 'Video games', 1996, 'games', 1.9, 6, 'An independent studio with one enormous hit and a lot of opinions about its sequel.'],
  ['xpark1', 'Magic Kingdomland Resorts', 'Theme parks', 1955, 'parks', 1.2, 30, 'Castles, queues and the rides that films become. Gets a lift from every animated hit.'],
  ['xpark2', 'Universe Parks & Studios', 'Theme parks', 1964, 'parks', 1.3, 18, 'Studio tours that grew into rollercoasters built on blockbusters.'],
  ['xlive1', 'LiveNation Nights', 'Live events', 1996, 'live', 1.4, 16, 'Promotes the tours, owns the venues, sells the beer.'],
  ['xtix', 'TicketMaestro', 'Ticketing', 1976, 'live', 1.1, 20, 'Every ticket to everything, plus a fee nobody can explain.'],
  ['xradio', 'Clearwave Radio', 'Radio', 1972, 'broadcast', 1.0, 9, 'Hundreds of local stations playing the same forty songs.'],
  ['xmerch', 'Collectorium', 'Collectibles', 1998, 'kids', 1.3, 8, 'Big-headed vinyl figures of every character in every franchise.'],
  ['xbook', 'Pengwyn House Books', 'Publishing', 1935, 'books', .8, 18, 'Publishes the novels Hollywood buys. Steady, literate and quietly profitable.']
];
const MCO_DRIVER = { label: 'music', publisher: 'music', podcast: 'pod', creator: 'creator', theatre: 'stage' };
const MCO_SECTOR = { label: 'Music', publisher: 'Music publishing', podcast: 'Audio', creator: 'Online video', theatre: 'Theatre' };
const NET_DRIVER = { broadcast: 'broadcast', cable: 'cable', premium: 'cable', streaming: 'stream', kids: 'cable' };
const NET_SECTOR = { broadcast: 'TV networks', cable: 'Cable TV', premium: 'Premium TV', streaming: 'Streaming', kids: 'Kids\' TV' };
(function listEntertainment() {
  const used = new Set(SECTORS.map(s => s[1]));
  const tick = (name, n = 4) => { const w = name.replace(/[^A-Za-z ]/g, '').split(/\s+/).filter(x => x && !/^(the|and|of|&|records?|music|group)$/i.test(x)); let t = (w.length >= 2 ? w.map(x => x[0]).join('') : (w[0] || name).slice(0, n)).toUpperCase().slice(0, n); let i = 0; while (used.has(t)) t = (t.slice(0, 3) + 'ABCDEFGHJKLMNPQRSTUVWXYZ'[i++ % 24]); used.add(t); return t; };
  const seed = s => [...s].reduce((a, ch) => (a * 31 + ch.charCodeAt(0)) >>> 0, 7) % 100000;
  const add = (k, tk, name, sec, from, drv, beta, p0, d, extra) => { SECTORS.push([k, tk, name, sec, from, drv, beta, p0, d]); SECTOR[k] = Object.assign({ k, tk, name, sec, from, drv, beta, p0, d, seed: seed(k), vol: .06 + (beta - 1) * .03 }, extra || {}); };
  for (const [k, name, sec, from, drv, beta, p0, d] of ENT_EXTRA) add(k, tick(name), name, sec, from, drv, beta, p0, d);
  if (typeof MEDIA_COS !== 'undefined') MEDIA_COS.forEach((c, i) => { if (c.tier > 2) return; add('mco' + i, tick(c.n), c.n, MCO_SECTOR[c.type] || 'Media', c.f, MCO_DRIVER[c.type] || 'music', c.tier === 1 ? 1 : 1.4, (c.type === 'podcast' ? .12 : 1) * (c.tier === 1 ? 22 + (i % 5) * 4 : 8 + (i % 4) * 2), c.d, { mco: i }); });
  if (typeof TV_NETS !== 'undefined') for (const n of Object.values(TV_NETS)) { if (n.kind === 'public') continue; add('net_' + n.k, tick(n.name), n.name, NET_SECTOR[n.kind] || 'Television', n.founded, NET_DRIVER[n.kind] || 'broadcast', n.kind === 'streaming' ? 1.7 : 1.1, n.kind === 'streaming' ? 26 : 15, n.d, { net: n.k }); }
})();
// The sectors page, grouped: every part of the business on one screen, each name a link to its page where there is one.
function sectorsHTML() {
  const L = SECTORS.map(s => SECTOR[s[0]]).filter(sectorOpen), M = S.me, groups = {};
  for (const s of L) (groups[s.sec] = groups[s.sec] || []).push(s);
  const nameOf = s => s.mco !== undefined && typeof mcoLink === 'function' ? mcoLink(s.mco) : s.net && typeof netLink === 'function' ? netLink(s.net) : esc(s.name);
  const row = s => `<tr><td><b>${esc(s.tk)}</b></td><td class="small">${nameOf(s)}<br><span class="muted">${esc(s.d.length > 70 ? s.d.slice(0, 68) + '…' : s.d)}${sYield(s) ? ` · yields ${(sYield(s) * 100).toFixed(1)}%` : ''}</span></td><td>${sSpark(s)}</td><td class="n" data-v="${sectorPrice(s)}">$${sectorPrice(s).toFixed(2)}</td><td class="n" data-v="${sChg(s, 1)}">${pctS(sChg(s, 1))}</td><td class="n" data-v="${sChg(s, 52)}">${pctS(sChg(s, 52))}</td><td class="n">${(M.sport || {})[s.k] || 0}</td><td><button class="btn-s" data-sec="buy:${s.k}">Buy</button> ${(M.sport || {})[s.k] ? `<button class="btn-s ghost" data-sec="sell:${s.k}">Sell</button>` : ''}</td></tr>`;
  const F = UI.secf || 'all', secs = Object.keys(groups).sort((a, b) => groups[b].length - groups[a].length);
  const shown = F === 'all' ? secs : secs.filter(x => x === F);
  const ix = sec => { const G = groups[sec], a = G.reduce((t, s) => t + sectorPrice(s, S.week - 52), 0), b = G.reduce((t, s) => t + sectorPrice(s), 0); return pctS((b / Math.max(1e-6, a) - 1) * 100); };
  return `<p class="small muted">${L.length} listed companies beyond the studios: music, television and streaming, theatre, audio, online video, games, theme parks, live events and the businesses that live off the films. Each follows its own part of the business, plus the economy.</p>
   <div class="bf-row"><button class="pill${F === 'all' ? ' on' : ''}" data-secf="all">Everything</button>${secs.map(x => `<button class="pill${F === x ? ' on' : ''}" data-secf="${esc(x)}">${esc(x)} <span class="muted small">${groups[x].length}</span></button>`).join('')}</div>
   ${shown.map(sec => `<h4>${esc(sec)} <span class="muted small">1Y ${ix(sec)}</span></h4><div class="tw"><table class="grid small"><thead><tr><th>Ticker</th><th>Company</th><th>6M</th><th class="n">Price</th><th class="n">1W</th><th class="n">1Y</th><th class="n">Own</th><th></th></tr></thead><tbody>${groups[sec].map(row).join('')}</tbody></table></div>`).join('')}
   <h4>Funds</h4><div class="tw"><table class="grid small"><tbody><tr><td><b>BOX50</b></td><td class="small">BOX-50 index fund<br><span class="muted">Every listed studio at once · yields 1.8%</span></td><td></td><td class="n">$${fundPrice().toFixed(2)}</td><td class="n">${pctS((fundPrice() / fundPrice(S.week - 1) - 1) * 100)}</td><td class="n">${pctS((fundPrice() / fundPrice(S.week - 52) - 1) * 100)}</td><td class="n">${(M.sport || {}).box50 || 0}</td><td><button class="btn-s" data-sec="buy:box50">Buy</button> ${(M.sport || {}).box50 ? '<button class="btn-s ghost" data-sec="sell:box50">Sell</button>' : ''}</td></tr></tbody></table></div>`;
}

// the portfolio's other half: everything you hold beyond the studios
function sectorsHeldHTML() {
  const M = S.me, pos = Object.entries(M.sport || {}).filter(([, n]) => n > 0);
  if (!pos.length) return '';
  const px = k => k === 'box50' ? fundPrice() : sectorPrice(SECTOR[k]);
  const val = pos.reduce((t, [k, n]) => t + px(k) * n, 0), cost = pos.reduce((t, [k]) => t + ((M.scost || {})[k] || 0), 0);
  return `<h4>Music, TV and more <span class="muted small">worth ${fmtCash(Math.round(val))}, ${val >= cost ? '<span class="good">up</span>' : '<span class="bad">down</span>'} ${fmtCash(Math.round(Math.abs(val - cost)))}</span></h4><div class="tw"><table class="grid small"><thead><tr><th>Ticker</th><th>Company</th><th class="n">Shares</th><th class="n">Price</th><th class="n">Value</th><th class="n">Gain</th></tr></thead><tbody>${pos.map(([k, n]) => { const s = SECTOR[k], v = px(k) * n, c = (M.scost || {})[k] || 0; return `<tr><td><b>${esc(s ? s.tk : 'BOX50')}</b></td><td class="small">${esc(s ? s.name : 'BOX-50 index fund')}</td><td class="n">${n}</td><td class="n">$${px(k).toFixed(2)}</td><td class="n">${fmtCash(Math.round(v))}</td><td class="n ${v >= c ? 'good' : 'bad'}">${fmtCash(Math.round(v - c))}</td></tr>`; }).join('')}</tbody></table></div>`;
}
