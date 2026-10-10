// ---------------- Your place, alive: what you're doing, who dropped by, and what's parked outside ----------------
// The toon at home picks things up: a mug with steam coming off it, a notepad and a pencil that won't keep still,
// headphones with notes drifting up, a watering can that drips, a phone that keeps getting likes. Some weeks a
// friend or your partner is round (chatting, dancing, raiding the fridge). Whatever you get around in is parked
// in the street outside the window. All of it is drawn from the week and a stable hash, so nothing here rolls dice.

// ---- the props, drawn where the toon's hands and head are (the group moves with the toon) ----
function roomPropsSVG() {
  const R = 216, Ly = 129, L = 191, hx = 203.5, hy = 62;
  const P = {
    write: `<rect x="${L - 4}" y="${Ly - 10}" width="16" height="20" rx="1.5" fill="#FDFBF3" stroke="#B9B5AE" stroke-width=".8"/><path d="M${L - 1} ${Ly - 5} h10 M${L - 1} ${Ly - 1} h8 M${L - 1} ${Ly + 3} h9" stroke="#8C8A85" stroke-width=".8"/><g class="a-scrib"><path d="M${R - 2} ${Ly - 8} l-10 10" stroke="#E3A72F" stroke-width="2.6" stroke-linecap="round"/><path d="M${R - 12} ${Ly + 2} l-1.5 1.5" stroke="#333" stroke-width="2"/></g>`,
    music: `<path d="M${hx - 16} ${hy + 14} Q${hx} ${hy - 12} ${hx + 16} ${hy + 14}" stroke="#2B2B2B" stroke-width="2.4" fill="none"/><rect x="${hx - 19}" y="${hy + 10}" width="6" height="10" rx="2.5" fill="#E0457B"/><rect x="${hx + 13}" y="${hy + 10}" width="6" height="10" rx="2.5" fill="#E0457B"/>${[0, 1, 2].map(i => `<text class="a-float" style="animation-delay:${i * .9}s" x="${hx + 18 + i * 6}" y="${hy + 4}" font-size="9" fill="${['#7B4FC9', '#E0457B', '#1FA3A0'][i]}">${['♪', '♫', '♪'][i]}</text>`).join('')}`,
    dance: `${[0, 1, 2, 3].map(i => `<text class="a-float" style="animation-delay:${i * .6}s" x="${hx - 22 + i * 14}" y="${hy - 2}" font-size="8" fill="${['#FFD23F', '#E0457B', '#6FC3FF', '#9BE564'][i]}">${['♪', '✦', '♫', '✦'][i]}</text>`).join('')}`,
    coffee: `<g transform="translate(${R - 6} ${Ly - 8})"><rect width="11" height="12" rx="2" fill="#F4F0E6" stroke="#8C8A85" stroke-width=".7"/><path d="M11 3 q4 0 4 3 q0 3 -4 3" stroke="#8C8A85" stroke-width="1.4" fill="none"/><rect x="1" y="1" width="9" height="2" fill="#6B4E3A"/>${[0, 1].map(i => `<path class="a-steam" style="animation-delay:${i * .8}s" d="M${3 + i * 4} -2 q-2 -4 0 -7 q2 -3 0 -6" stroke="#FFFFFF" stroke-width="1.4" fill="none" opacity=".8"/>`).join('')}</g>`,
    script: `<g class="a-flip"><g transform="translate(${hx - 13} ${Ly - 14})"><rect width="13" height="18" fill="#FDFBF3" stroke="#B9B5AE" stroke-width=".7"/><rect x="13" width="13" height="18" fill="#F6F1E3" stroke="#B9B5AE" stroke-width=".7"/><path d="M3 4 h7 M3 7 h5 M3 10 h7 M16 4 h7 M16 7 h4 M16 10 h7 M16 13 h6" stroke="#8C8A85" stroke-width=".7"/></g></g>`,
    camera: `<g transform="translate(${R - 10} ${Ly - 22})"><rect width="16" height="10" rx="2" fill="#2B2B2B"/><rect x="16" y="2" width="5" height="6" fill="#3B3B3B"/><circle cx="3" cy="-2" r="3" fill="none" stroke="#2B2B2B" stroke-width="1.4"/><circle cx="10" cy="-2" r="3" fill="none" stroke="#2B2B2B" stroke-width="1.4"/><circle class="a-rec" cx="3" cy="3" r="1.6" fill="#E63946"/></g>`,
    water: `<g transform="translate(${R - 4} ${Ly - 10}) rotate(-25)"><rect width="13" height="10" rx="2" fill="#3F8FBF"/><path d="M13 3 L22 -3" stroke="#3F8FBF" stroke-width="2.4"/><path d="M2 0 Q6 -6 11 0" stroke="#2C6F99" stroke-width="1.4" fill="none"/></g>${[0, 1, 2].map(i => `<circle class="a-drip" style="animation-delay:${i * .35}s" cx="${R + 16 + i * 2}" cy="${Ly - 10}" r="1.3" fill="#6FC3FF"/>`).join('')}`,
    dream: `<g class="a-bob2"><circle cx="${hx + 18}" cy="${hy - 2}" r="2" fill="#FFFFFF" opacity=".9"/><circle cx="${hx + 24}" cy="${hy - 9}" r="3" fill="#FFFFFF" opacity=".9"/><ellipse cx="${hx + 40}" cy="${hy - 22}" rx="17" ry="12" fill="#FFFFFF" stroke="#0002"/><rect x="${hx + 30}" y="${hy - 29}" width="20" height="13" rx="1" fill="#2B2B2B"/><rect x="${hx + 30}" y="${hy - 29}" width="20" height="4" fill="#FFFFFF"/><path d="M${hx + 32} ${hy - 29} l3 4 M${hx + 37} ${hy - 29} l3 4 M${hx + 42} ${hy - 29} l3 4 M${hx + 47} ${hy - 29} l3 4" stroke="#2B2B2B" stroke-width="1.2"/><path d="M${hx + 36} ${hy - 22} l1.2 2.6 l2.8 .2 l-2.1 1.8 l.7 2.7 l-2.6 -1.5 l-2.6 1.5 l.7 -2.7 l-2.1 -1.8 l2.8 -.2 z" fill="#FFD23F"/></g>`,
    read: `<g transform="translate(${hx - 14} ${Ly - 14})"><path d="M0 0 L13 2 L13 18 L0 16 Z" fill="#C8553D"/><path d="M26 0 L13 2 L13 18 L26 16 Z" fill="#B84A33"/><path d="M2 2 L12 3.6 L12 16 L2 14.6 Z M24 2 L14 3.6 L14 16 L24 14.6 Z" fill="#FDFBF3"/></g>`,
    stretch: `${[0, 1].map(i => `<path class="a-pulse" style="animation-delay:${i * .5}s" d="M${hx - 26 + i * 52} ${Ly - 30} q${i ? 6 : -6} 10 0 20" stroke="#FFFFFF" stroke-width="2" fill="none" opacity=".8"/>`).join('')}<path class="a-drip" d="M${hx + 12} ${hy + 4} q2 4 0 6 q-2 -2 0 -6" fill="#6FC3FF"/>`,
    phone: `<rect x="${R - 4}" y="${Ly - 14}" width="8" height="14" rx="1.6" fill="#1E1E1E"/><rect x="${R - 3}" y="${Ly - 12.5}" width="6" height="10" fill="#9BE7FF" class="a-glow"/>${[0, 1, 2].map(i => `<path class="a-pop" style="animation-delay:${i * .7}s" transform="translate(${R + 4 + i * 5} ${Ly - 22 - i * 3}) scale(.5)" d="M0 3 C0 -1 6 -1 6 3 C6 -1 12 -1 12 3 C12 8 6 11 6 13 C6 11 0 8 0 3 Z" fill="${['#E0457B', '#FF6FB5', '#E63946'][i]}"/>`).join('')}`,
    lines: `<g class="a-bob2"><rect x="${hx + 14}" y="${hy - 26}" width="34" height="16" rx="8" fill="#FFFFFF" stroke="#0002"/><path d="M${hx + 18} ${hy - 11} l-4 6 l8 -4 z" fill="#FFFFFF"/>${[0, 1, 2].map(i => `<circle class="a-dot" style="animation-delay:${i * .25}s" cx="${hx + 23 + i * 8}" cy="${hy - 18}" r="2" fill="#555"/>`).join('')}</g><rect x="${L - 4}" y="${Ly - 10}" width="12" height="16" fill="#FDFBF3" stroke="#B9B5AE" stroke-width=".7"/>`,
    nap: `${[0, 1, 2].map(i => `<text class="a-float" style="animation-delay:${i * .8}s" x="${hx + 14 + i * 6}" y="${hy + 2 - i * 4}" font-size="${8 + i * 2}" font-weight="700" fill="#6FC3FF">z</text>`).join('')}`,
    game: `<rect x="${hx - 10}" y="${Ly - 8}" width="20" height="9" rx="4" fill="#3B3B3B"/><circle cx="${hx - 5}" cy="${Ly - 3.5}" r="1.6" fill="#6FC3FF"/><circle cx="${hx + 5}" cy="${Ly - 3.5}" r="1.6" fill="#E63946"/><text class="a-pop" x="${hx + 14}" y="${hy - 2}" font-size="8" font-weight="700" fill="#FFD23F">+100</text>`,
    pet: `${[0, 1, 2].map(i => `<path class="a-pop" style="animation-delay:${i * .6}s" transform="translate(${hx + 26 + i * 6} ${Ly + 10 - i * 6}) scale(.5)" d="M0 3 C0 -1 6 -1 6 3 C6 -1 12 -1 12 3 C12 8 6 11 6 13 C6 11 0 8 0 3 Z" fill="#FF6FB5"/>`).join('')}`
  };
  return Object.entries(P).map(([k, v]) => `<g class="act-prop" data-k="${k}">${v}</g>`).join('');
}

// ---- who's round this week: your partner most often, otherwise a close friend now and then ----
function roomVisitor() {
  const M = S.me, me = ME(); if (!M || !me || M.life === 'couch') return null;
  const r = hashRand((S.week * 2654435761 ^ (me.id * 97 + 13)) >>> 0), pid = typeof partnerOf === 'function' ? partnerOf() : null;
  if (pid !== null && pid !== undefined && S.people[pid] && !S.people[pid].dead && r() < (M.cohab === pid ? .85 : .5)) return { p: S.people[pid], why: M.cohab === pid ? 'home' : 'partner', r };
  if (r() > .4) return null;
  const close = Object.entries(me.ties || {}).filter(([id, v]) => v >= 40 && S.people[id] && !S.people[id].dead && +id !== me.id).sort((a, b) => b[1] - a[1]).slice(0, 6);
  if (!close.length) return null;
  return { p: S.people[close[Math.floor(r() * close.length)][0]], why: 'friend', r };
}
const VISIT_DOING = [['chat', 'catching up'], ['drink', 'having a drink'], ['dance', 'dancing'], ['snack', 'raiding the fridge'], ['read', 'reading your script'], ['phone', 'showing you something on their phone']];
function roomVisitorSVG(acts, life, night) {
  const V = roomVisitor(); if (!V) return '';
  const p = V.p, r = V.r, [k, what] = VISIT_DOING[Math.floor(r() * VISIT_DOING.length)];
  const x = r() < .5 ? 64 + Math.floor(r() * 30) : 290 + Math.floor(r() * 24), hx = x + 30.5, hy = 62, Ry = 129;
  const prop = {
    chat: `<g class="a-bob2"><rect x="${hx - 24}" y="${hy - 28}" width="30" height="15" rx="7.5" fill="#FFFFFF" stroke="#0002"/><path d="M${hx - 4} ${hy - 14} l4 6 l-8 -4 z" fill="#FFFFFF"/>${[0, 1, 2].map(i => `<circle class="a-dot" style="animation-delay:${i * .25}s" cx="${hx - 17 + i * 8}" cy="${hy - 20.5}" r="2" fill="#555"/>`).join('')}</g>`,
    drink: `<path d="M${hx + 8} ${Ry - 14} l8 0 l-4 6 z" fill="#FFE27A" stroke="#999" stroke-width=".6"/><path d="M${hx + 12} ${Ry - 8} v7 M${hx + 9} ${Ry - 1} h6" stroke="#999" stroke-width=".8"/>`,
    dance: `${[0, 1, 2].map(i => `<text class="a-float" style="animation-delay:${i * .6}s" x="${hx - 14 + i * 12}" y="${hy - 4}" font-size="8" fill="${['#FF6FB5', '#FFD23F', '#6FC3FF'][i]}">${['♪', '♫', '✦'][i]}</text>`).join('')}`,
    snack: `<path d="M${hx + 6} ${Ry - 12} l12 0 l-2 10 l-8 0 z" fill="#E63946"/>${[0, 1, 2].map(i => `<circle cx="${hx + 9 + i * 3}" cy="${Ry - 13}" r="2" fill="#FFE27A"/>`).join('')}`,
    read: `<rect x="${hx - 6}" y="${Ry - 14}" width="13" height="17" fill="#FDFBF3" stroke="#B9B5AE" stroke-width=".7"/><path d="M${hx - 4} ${Ry - 10} h9 M${hx - 4} ${Ry - 7} h7 M${hx - 4} ${Ry - 4} h9" stroke="#8C8A85" stroke-width=".7"/>`,
    phone: `<rect x="${hx + 8}" y="${Ry - 16}" width="8" height="14" rx="1.6" fill="#1E1E1E"/><rect x="${hx + 9}" y="${Ry - 14.5}" width="6" height="10" fill="#FFD23F" class="a-glow"/>`
  }[k];
  const age = S.year - p.born, fig = portraitSVG(lookOf(p), age, 122, true, true).replace(/^<svg class="portrait([^"]*)"/, '<svg class="portrait$1" x="0" y="0"');
  const label = `${p.name}${V.why === 'home' ? ', who lives here too' : V.why === 'partner' ? ', staying over' : ' came round'}: ${what}`;
  return `<g class="visitor${k === 'dance' ? ' v-dance' : ''}"><title>${esc(label)}</title><ellipse cx="${hx}" cy="175" rx="22" ry="3.2" fill="#000" opacity=".2"/><g class="v-pace"><g transform="translate(${x} 54)">${fig}</g>${prop}</g></g>`;
}
function roomVisitorLine() { const V = roomVisitor(); if (!V) return ''; const [k, what] = VISIT_DOING[Math.floor(V.r() * VISIT_DOING.length)]; return `${pl(V.p.id)} ${V.why === 'home' ? 'is home' : V.why === 'partner' ? 'is staying over' : 'came round'}: ${what}.`; }

// ---- more ways to get around, some of them silly ----
Object.assign(VEHICLES, {
  skates: { label: 'Roller skates', icon: '🛼', price: 90, upkeep: 0, e: 5, stress: -1, d: 'Knee pads optional, attitude essential. You glide into meetings.', commute: ['You glide past the bus queue with a little spin.', 'A crack in the pavement and you do a whole dance to stay up.', 'Someone on set asks for lessons.'] },
  board: { label: 'A skateboard', icon: '🛹', price: 140, upkeep: 0, e: 5, d: 'Push, push, roll. Everyone under thirty respects it.', commute: ['You ollie a kerb and nobody sees. Typical.', 'Downhill all the way. Uphill all the way back.', 'You carry it into the office like a briefcase.'] },
  unicycle: { label: 'A unicycle', icon: '🎪', price: 220, upkeep: 0, e: 6, stress: 1, standing: 1, d: 'You will be remembered. Not always for the right reasons.', commute: ['Commuters film you. You wave, wobble, recover.', 'A child points and says "clown". Harsh but fair.', 'You arrive in a perfectly straight line. Applause.'] },
  vespa: { label: 'A Vespa with a sidecar', icon: '🛵', price: 5200, upkeep: 20, e: 2, standing: 1, d: 'Pastel, Italian and impractical. The sidecar fits a friend or a dog.', commute: ['Your friend rides in the sidecar holding a coffee each.', 'The sidecar is full of film cans. Very romantic.', 'A tourist asks for a photo with it.'], fx: { reach: 1 } },
  tuktuk: { label: 'A tuk-tuk', icon: '🛺', price: 4800, upkeep: 18, e: 2, d: 'Three wheels, no doors, a horn like a goose. People ask for rides.', commute: ['You give two extras a lift to set.', 'The horn makes a producer jump. Good.', 'Rain blows straight through. You laugh anyway.'], fx: { reach: 1 } },
  camper: { label: 'A vintage camper van', icon: '🚐', price: 16000, upkeep: 60, e: 1, stress: -2, d: 'A bed, a stove and a curtain. Location scouting becomes a holiday.', commute: ['You nap in the back between set-ups.', 'Coffee on the little stove for the whole crew.', 'It breaks down by a beach. You stay the night.'], fx: { reach: 1, crew: 1 } },
  foodtruck: { label: 'A food truck', icon: '🚚', price: 28000, upkeep: 85, e: 1, d: 'You park outside sets and feed people. Crews never forget who fed them.', commute: ['You hand out tacos; a gaffer gives you his number.', 'A health inspector. You pass, just.', 'The queue is longer than the one for the film.'], fx: { reach: 1, crew: 2 } },
  bus: { label: 'A double-decker bus', icon: '🚌', price: 36000, upkeep: 120, e: 1, standing: 2, d: 'Red, old and converted: a writers\' room upstairs, a kitchen downstairs.', commute: ['Your writers\' room meets on the top deck.', 'A low bridge. Everybody ducks.', 'You park it outside a premiere and somebody photographs it for the trades.'], fx: { reach: 1, crew: 1, status: 1 }, read: { struc: .004, dial: .004 } },
  limo: { label: 'A stretch limo', icon: '🚘', price: 85000, upkeep: 400, e: -1, standing: 4, d: 'Tinted windows, a minibar and the turning circle of a cruise ship.', commute: ['You take calls from the back like it\'s 1987.', 'Three-point turn becomes a nine-point turn.', 'Someone thinks you\'re a pop star. You let them.'], fx: { reach: 1, status: 2 } },
  hover: { label: 'A hovercraft', icon: '🛸', price: 120000, upkeep: 500, e: 0, standing: 4, from: 1968, d: 'Land, sea or a muddy field. Noisy beyond belief.', commute: ['You cross the bay while the bridge is jammed.', 'Spray everywhere. Worth it.', 'A documentary crew asks to follow you.'], fx: { reach: 1, status: 2 } },
  balloon: { label: 'A hot-air balloon', icon: '🎈', price: 60000, upkeep: 300, e: 2, stress: -3, standing: 3, d: 'Not fast, not reliable and it only goes where the wind does. Glorious.', commute: ['You land in the wrong county. Taxi home.', 'Sunrise over the hills. You forget the call sheet.', 'An aerial shot for your film, for free.'], fx: { status: 2 } },
  jetpack: { label: 'A jetpack', icon: '🚀', price: 400000, upkeep: 2500, e: 0, stress: 2, standing: 8, from: 2030, d: 'Twelve minutes of fuel and a helmet that says "test pilot". Insurers weep.', commute: ['You land on the studio roof. Security sighs.', 'Low on fuel; you walk the last mile in the suit.', 'The trades run a picture. You look magnificent.'], fx: { reach: 1, status: 3 } }
});

// ---- the vehicles, drawn ----
function vehicleSVG(k, w = 60) {
  const wh = (x, y, r = 5) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#222"/><circle cx="${x}" cy="${y}" r="${r * .45}" fill="#BBB"/>`;
  const B = {
    transit: `<rect x="4" y="6" width="52" height="22" rx="4" fill="#2F7DD1"/>${[0, 1, 2, 3].map(i => `<rect x="${8 + i * 11}" y="10" width="8" height="7" fill="#CFE7FF"/>`).join('')}<rect x="48" y="10" width="6" height="14" fill="#CFE7FF"/>${wh(14, 29)}${wh(46, 29)}`,
    bike: `${wh(14, 26, 8)}${wh(46, 26, 8)}<path d="M14 26 L26 12 L42 12 L46 26 M26 12 L32 26 L14 26 M40 6 h6" stroke="#E63946" stroke-width="2.6" fill="none"/>`,
    ebike: `${wh(14, 26, 8)}${wh(46, 26, 8)}<path d="M14 26 L26 12 L42 12 L46 26 M26 12 L32 26 L14 26 M40 6 h6" stroke="#1FA3A0" stroke-width="2.6" fill="none"/><rect x="25" y="15" width="10" height="5" rx="1" fill="#333"/><path d="M29 15 l-2 3 h3 l-2 3" stroke="#FFD23F" stroke-width="1" fill="none"/>`,
    scooter: `<path d="M10 24 Q12 12 26 14 L36 14 L40 6 L44 6" stroke="#333" stroke-width="2.4" fill="none"/><path d="M14 22 Q20 12 34 16 L40 24 Z" fill="#FF8FA3"/>${wh(14, 27)}${wh(44, 27)}`,
    vespa: `<path d="M8 24 Q10 12 24 14 L32 14 L36 6 L40 6" stroke="#333" stroke-width="2.2" fill="none"/><path d="M12 22 Q18 12 30 16 L34 24 Z" fill="#9BE7C4"/><path d="M38 14 Q56 12 56 24 L38 24 Z" fill="#9BE7C4"/>${wh(12, 27)}${wh(32, 27)}${wh(50, 28, 4)}`,
    moto: `${wh(12, 25, 7)}${wh(48, 25, 7)}<path d="M12 25 L26 14 L40 14 L48 25 M38 14 L42 6 h6" stroke="#222" stroke-width="2.4" fill="none"/><path d="M22 12 Q30 6 40 12 L36 18 L24 18 Z" fill="#E63946"/>`,
    car: `<path d="M4 24 L6 15 Q8 12 14 12 L20 5 L40 5 L48 12 Q56 13 56 18 L56 24 Z" fill="#E3A72F"/><path d="M22 7 L38 7 L44 12 L18 12 Z" fill="#CFE7FF"/>${wh(16, 25)}${wh(44, 25)}`,
    van: `<path d="M4 25 L4 7 Q4 4 8 4 L42 4 L52 14 L56 16 L56 25 Z" fill="#F4F2EE" stroke="#999" stroke-width=".6"/><path d="M42 6 L50 14 L42 14 Z" fill="#CFE7FF"/><rect x="8" y="12" width="28" height="4" fill="#E0457B"/>${wh(14, 26)}${wh(46, 26)}`,
    camper: `<path d="M4 25 L4 9 Q4 3 12 3 L48 3 Q56 3 56 11 L56 25 Z" fill="#F28C28"/><path d="M4 14 L56 14 L56 25 L4 25 Z" fill="#F4F2EE"/><path d="M30 8 m-5 0 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0" fill="#F4F2EE"/>${[0, 1, 2].map(i => `<rect x="${8 + i * 9}" y="6" width="7" height="6" rx="1" fill="#CFE7FF"/>`).join('')}<rect x="44" y="6" width="9" height="6" rx="1" fill="#CFE7FF"/>${wh(14, 26)}${wh(46, 26)}`,
    pickup: `<path d="M4 24 L4 14 L30 14 L32 6 L46 6 L52 14 L56 15 L56 24 Z" fill="#2E5A3A"/><path d="M34 8 L45 8 L49 14 L34 14 Z" fill="#CFE7FF"/>${wh(14, 25)}${wh(46, 25)}`,
    foodtruck: `<rect x="2" y="3" width="44" height="22" rx="2" fill="#FFD23F"/><path d="M46 8 L54 8 L58 16 L58 25 L46 25 Z" fill="#FFD23F"/><path d="M48 10 L53 10 L56 16 L48 16 Z" fill="#CFE7FF"/><rect x="8" y="8" width="30" height="10" fill="#2B2B2B"/><path d="M6 8 L40 8 L38 4 L8 4 Z" fill="#E63946"/><text x="23" y="16" font-size="6" fill="#FFD23F" text-anchor="middle" font-family="sans-serif" font-weight="700">TACOS</text>${wh(12, 26)}${wh(48, 26)}`,
    bus: `<rect x="4" y="1" width="52" height="25" rx="3" fill="#C8102E"/>${[0, 1, 2, 3].map(i => `<rect x="${7 + i * 12}" y="4" width="9" height="6" fill="#CFE7FF"/><rect x="${7 + i * 12}" y="14" width="9" height="6" fill="#CFE7FF"/>`).join('')}${wh(14, 27)}${wh(46, 27)}`,
    tuktuk: `<path d="M8 25 L8 10 Q8 4 20 4 L40 4 Q46 4 46 10 L52 25 Z" fill="#1FA3A0"/><path d="M8 6 L44 6 L44 9 L8 9 Z" fill="#FFD23F"/><rect x="18" y="11" width="16" height="9" fill="#F4F2EE" opacity=".6"/>${wh(14, 26)}${wh(44, 26)}`,
    sleek: `<path d="M2 24 L4 17 Q10 14 18 13 L26 7 L40 7 L50 13 Q58 14 58 19 L58 24 Z" fill="#1E2A38"/><path d="M27 9 L39 9 L46 13 L22 13 Z" fill="#9BB8D3"/>${wh(15, 25)}${wh(46, 25)}`,
    ev: `<path d="M4 24 L5 16 Q8 12 16 12 L24 6 L40 6 L48 12 Q56 13 56 18 L56 24 Z" fill="#F4F2EE" stroke="#999" stroke-width=".6"/><path d="M25 8 L39 8 L45 12 L20 12 Z" fill="#9BB8D3"/><path d="M30 16 l-3 4 h4 l-3 4" stroke="#1FA3A0" stroke-width="1.4" fill="none"/>${wh(15, 25)}${wh(45, 25)}`,
    classic: `<path d="M2 24 L4 16 Q14 14 20 14 L26 10 L34 10 L36 14 Q56 14 58 18 L58 24 Z" fill="#E0457B"/><path d="M26 10 L28 5 L30 10" stroke="#CFE7FF" stroke-width="1.6" fill="none"/>${wh(14, 25)}${wh(46, 25)}`,
    limo: `<path d="M1 23 L2 16 Q6 13 12 13 L16 8 L46 8 L50 13 Q59 14 59 18 L59 23 Z" fill="#111"/>${[0, 1, 2].map(i => `<rect x="${18 + i * 9}" y="9.5" width="7" height="3.5" fill="#556"/>`).join('')}${wh(10, 24, 4)}${wh(50, 24, 4)}`,
    driver: `<path d="M3 24 L4 16 Q8 13 14 13 L20 7 L40 7 L46 13 Q57 14 57 18 L57 24 Z" fill="#2B2B2B"/><path d="M21 9 L39 9 L43 13 L17 13 Z" fill="#9BB8D3"/><rect x="24" y="2" width="12" height="5" fill="#FFD23F"/>${wh(15, 25)}${wh(45, 25)}`,
    heli: `<path d="M10 4 h40" stroke="#333" stroke-width="2" class="t-prop"/><path d="M30 4 v4" stroke="#333" stroke-width="2"/><ellipse cx="26" cy="16" rx="16" ry="9" fill="#2F5BD3"/><path d="M40 16 L58 12 L58 16 Z" fill="#2F5BD3"/><ellipse cx="20" cy="14" rx="7" ry="5" fill="#CFE7FF"/><path d="M14 26 h26 M18 24 v2 M34 24 v2" stroke="#333" stroke-width="1.6"/>`,
    skates: `${[0, 1].map(i => `<g transform="translate(${8 + i * 26} 6)"><path d="M2 0 L10 0 L10 10 L20 12 Q22 18 18 18 L2 18 Z" fill="${i ? '#FF6FB5' : '#6FC3FF'}"/><circle cx="5" cy="20" r="3" fill="#FFD23F"/><circle cx="16" cy="20" r="3" fill="#FFD23F"/></g>`).join('')}`,
    board: `<path d="M6 18 Q4 22 10 22 L50 22 Q56 22 54 18 Z" fill="#E63946"/><path d="M14 20 h32" stroke="#FFD23F" stroke-width="2"/>${wh(14, 26, 3)}${wh(46, 26, 3)}`,
    unicycle: `${wh(30, 24, 8)}<path d="M30 24 L30 6" stroke="#333" stroke-width="2.2"/><ellipse cx="30" cy="5" rx="7" ry="2.6" fill="#E63946"/>`,
    hover: `<ellipse cx="30" cy="22" rx="27" ry="6" fill="#222"/><path d="M8 20 Q8 8 24 8 L40 8 Q52 8 52 20 Z" fill="#F28C28"/><rect x="22" y="10" width="14" height="6" rx="2" fill="#CFE7FF"/><circle cx="46" cy="5" r="5" fill="none" stroke="#333" stroke-width="1.6" class="t-prop"/>`,
    balloon: `<path d="M30 2 Q50 2 48 16 Q46 24 34 28 L26 28 Q14 24 12 16 Q10 2 30 2 Z" fill="#E63946"/><path d="M30 2 Q38 10 34 28 M30 2 Q22 10 26 28" stroke="#FFD23F" stroke-width="2.4" fill="none"/><rect x="26" y="30" width="8" height="5" fill="#8B5A2B"/><path d="M26 28 L27 30 M34 28 L33 30" stroke="#555" stroke-width=".6"/>`,
    jetpack: `<rect x="20" y="4" width="8" height="16" rx="3" fill="#B9B5AE"/><rect x="32" y="4" width="8" height="16" rx="3" fill="#B9B5AE"/><rect x="26" y="6" width="8" height="10" fill="#555"/>${[24, 36].map(x => `<path class="a-flame" d="M${x - 3} 20 Q${x} 32 ${x + 3} 20 Z" fill="#FF7A2F"/>`).join('')}`
  };
  return `<svg class="veh" viewBox="0 0 60 36" width="${w}" height="${Math.round(w * .6)}" aria-hidden="true">${B[k] || B.car}</svg>`;
}
// what's parked in the street, for the room scene (inside the window)
function streetVehicleSVG(wx, wy, ww, wh) {
  const k = S.me.vehicle || 'transit'; if (k === 'transit' || k === 'heli' || k === 'balloon' || k === 'jetpack') return k === 'balloon' ? `<g transform="translate(${wx + ww * .12} ${wy + 4}) scale(.45)">${vehicleSVG(k).replace(/^<svg[^>]*>|<\/svg>$/g, '')}</g>` : '';
  return `<g transform="translate(${wx + ww - 38} ${wy + wh - 20}) scale(.55)">${vehicleSVG(k).replace(/^<svg[^>]*>|<\/svg>$/g, '')}</g>`;
}
