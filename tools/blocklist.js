// Blocklist scan of the built page (audit L10): real awards, festivals, companies and platforms must not appear in
// anything the game can show. Reads index.html, walks every script with a small lexer, and checks the text of each
// string and template literal. Comments are skipped, and so are the `real:` reference fields of the catalogue (the
// original title or name, kept so the data can be checked against sources; never displayed).
// usage: node tools/blocklist.js [page] [--list]      exit code 1 if anything is found
const fs = require('fs'), path = require('path');
const args = process.argv.slice(2), page = args.find(a => !a.startsWith('--')) || path.join(__dirname, '..', 'index.html'), LIST = args.includes('--list');
const TERMS = ['Oscar', 'Academy Award', 'Cannes', "Palme d'Or", 'Berlinale', 'Golden Bear', 'Golden Lion', 'Silver Lion', 'Silver Bear', 'Volpi', "Caméra d'Or",
  'Sundance', 'Tribeca', 'Telluride', 'TIFF', 'Toronto International', 'Venice Film Festival', 'Locarno', 'Karlovy Vary', 'San Sebastián', 'Busan International', 'Annecy International', 'SXSW', 'Sitges', 'American Film Market', 'Marché du Film',
  'BAFTA', 'Golden Globe', 'Emmy', 'Grammy', 'Tony Award', 'César', 'Goya Award', 'Golden Raspberry', 'Razzie',
  'YouTube', 'TikTok', 'Instagram', 'Facebook', 'Twitter', 'Spotify', 'Apple Music', 'iTunes', 'Patreon', 'Kickstarter', 'Twitch', 'Snapchat',
  'Netflix', 'Disney', 'Pixar', 'Marvel', 'Lucasfilm', 'DreamWorks', 'Warner Bros', 'Paramount Pictures', 'Universal Pictures', 'Columbia Pictures', 'Sony Pictures', 'MGM', 'Miramax', 'A24', 'Lionsgate', 'Hulu', 'HBO', 'Amazon Studios', 'Prime Video',
  'IMDb', 'Rotten Tomatoes', 'Metacritic', 'Letterboxd', 'Billboard Hot', 'Billboard chart', 'Nielsen', 'Broadway League', 'Edinburgh Fringe'];
// Allowed: invented pun names that happen to contain a blocklisted word, and reference fields that hold a real name
// next to its in-game version (the executive tables in src/corrections.js). Matched against the whole literal.
const ALLOW = new Set(['Oscar Michelin', 'Oscar Llewyn', 'Lee Marvel', 'To the Marvel', 'George Roy Sundance', 'Leopoldo Torres Nielsen', 'Liam Nielsen-Grey', 'César and Rosalind',
  'Walt Disney', 'Roy O. Disney', 'Festival Sundance']);   // the last is an alias the code matches raw data on, never shown
const RE = new RegExp('(?<![A-Za-z0-9#])(' + TERMS.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')(?![A-Za-z0-9])', 'g');

const html = fs.readFileSync(page, 'utf8');
const scripts = []; html.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gi, (m, js, off) => { scripts.push([js, off + m.indexOf(js)]); return m; });
// visible HTML outside scripts and styles counts too
const outside = html.replace(/<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>|<!--[\s\S]*?-->/gi, ' ').replace(/<[^>]+>/g, ' ');

function literals(src) {   // yields [text, index, precedingCode]
  const out = []; let i = 0, n = src.length, last = '';   // last significant char, to tell a regex from a division
  const stack = [];   // template nesting: depth of braces inside ${ }
  while (i < n) {
    const c = src[i], d = src[i + 1];
    if (c === '/' && d === '/') { const e = src.indexOf('\n', i); i = e < 0 ? n : e; continue; }
    if (c === '/' && d === '*') { const e = src.indexOf('*/', i + 2); i = e < 0 ? n : e + 2; continue; }
    if (c === '"' || c === "'") { let j = i + 1, s = ''; while (j < n && src[j] !== c) { if (src[j] === '\\') { s += src[j + 1]; j += 2; } else s += src[j++]; } out.push([s, i]); i = j + 1; last = 'a'; continue; }
    if (c === '`' || (c === '}' && stack.length && stack[stack.length - 1] === 0)) {
      if (c === '}') stack.pop();
      let j = i + 1, s = ''; while (j < n && src[j] !== '`' && !(src[j] === '$' && src[j + 1] === '{')) { if (src[j] === '\\') { s += src[j + 1]; j += 2; } else s += src[j++]; }
      out.push([s, i]); if (src[j] === '$') { stack.push(0); i = j + 2; last = '('; } else { i = j + 1; last = 'a'; } continue;
    }
    if (c === '{' && stack.length) stack[stack.length - 1]++;
    if (c === '}' && stack.length) stack[stack.length - 1]--;
    if (c === '/' && (last === '' || '(,=:[!&|?{};+-*%<>~^'.includes(last))) {   // a regex literal
      let j = i + 1, cls = false; while (j < n && (cls || src[j] !== '/')) { if (src[j] === '\\') j++; else if (src[j] === '[') cls = true; else if (src[j] === ']') cls = false; else if (src[j] === '\n') break; j++; }
      i = j + 1; while (/[a-z]/.test(src[i] || '')) i++; last = 'a'; continue;
    }
    if (!/\s/.test(c)) last = /[A-Za-z0-9_$)\]]/.test(c) ? (/[A-Za-z0-9_$]/.test(c) && /^(return|typeof|case|in|of|delete|void|throw|new)$/.test(src.slice(Math.max(0, i - 7), i + 1).match(/[A-Za-z]+$/)?.[0] || '') ? '(' : 'a') : c;
    i++;
  }
  return out;
}
const hits = {}, where = [];
for (const [js] of scripts) for (const [s, i] of literals(js)) {
  if (/\breal\s*:\s*$/.test(js.slice(Math.max(0, i - 12), i)) || ALLOW.has(s)) continue;   // catalogue reference field, never shown
  let m; RE.lastIndex = 0; while ((m = RE.exec(s))) { hits[m[1]] = (hits[m[1]] || 0) + 1; if (where.length < 400) where.push(`${m[1]}: …${s.slice(Math.max(0, m.index - 50), m.index + 50).replace(/\s+/g, ' ')}…`); }
}
{ let m; RE.lastIndex = 0; while ((m = RE.exec(outside))) { hits[m[1]] = (hits[m[1]] || 0) + 1; where.push(`${m[1]} (page HTML): …${outside.slice(Math.max(0, m.index - 50), m.index + 50).replace(/\s+/g, ' ')}…`); } }
const total = Object.values(hits).reduce((a, b) => a + b, 0);
console.log(JSON.stringify({ page: path.basename(page), total, hits: Object.fromEntries(Object.entries(hits).sort((a, b) => b[1] - a[1])) }));
if (LIST) for (const w of where) console.log(w);
if (total) process.exitCode = 1;
