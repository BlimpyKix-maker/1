// ---------------- Faces for the famous ----------------
// People reimagined from film history (only those no longer living) get a face that nods to the original: the hair, the glasses, the moustache,
// the hat. Keyed by the hidden real name. Code letters: s skin, h hair, c hair colour, f facial hair, g glasses,
// l receding hairline, t headwear, b build, e eyes, o outfit, m mark (see LOOK in portrait.js for the options).
const REAL_LOOKS = {
  'Charlie Chaplin': 's1h5c0f2t4o9', 'Buster Keaton': 's1h2c0t4o9', 'Harold Lloyd': 's1h3c0g1o9', 'Alfred Hitchcock': 's1h3c0l1b5o9',
  'Orson Welles': 's1h4c0b5o9', 'John Ford': 's1h2c2g7t4', 'Stanley Kubrick': 's1h5c0f5', 'Akira Kurosawa': 's2h3c0g7t4',
  'Federico Fellini': 's1h3c0t4o9', 'Ingmar Bergman': 's0h3c1t1', 'Jean-Luc Godard': 's1h3c1g7l1', 'François Truffaut': 's1h3c0',
  'Satyajit Ray': 's5h3c0b7', 'David Lynch': 's1h4c7o7', 'Sergio Leone': 's2h3c0f5g2b5', 'Agnès Varda': 's1h7c4',
  'Sidney Lumet': 's1h2c7g3', 'Billy Wilder': 's1h3c0t4', 'Frank Capra': 's3h5c0', 'Yasujirō Ozu': 's2h1c0t4',
  'Fritz Lang': 's1h3c0', 'Sergei Eisenstein': 's1h5c1l1', 'Luis Buñuel': 's1h1c0', 'Andrei Tarkovsky': 's1h3c0f2',
  'Abbas Kiarostami': 's3h3c7g7', 'Marilyn Monroe': 's0h5c6m4', 'Audrey Hepburn': 's1h7c0b0', 'Elizabeth Taylor': 's1h5c0e9',
  'Grace Kelly': 's0h7c6', 'Humphrey Bogart': 's1h3c1t8o9', 'James Dean': 's1h4c3o4', 'Marlon Brando': 's1h1c1o0',
  'Cary Grant': 's2h3c0o9', 'Gene Kelly': 's1h4c0', 'Fred Astaire': 's0h3c1l1b7', 'Paul Newman': 's0h3c3e5',
  'John Wayne': 's1h3c2t4b4', 'Christopher Lee': 's1h3c0b7', 'Peter Cushing': 's0h3c7b7', 'Bruce Lee': 's3h3c0b8',
  'Toshiro Mifune': 's3h3c0f1', 'Marcello Mastroianni': 's2h3c0g7o9', 'Alain Delon': 's1h3c1e5', 'Jean-Paul Belmondo': 's2h3c1',
  'Greta Garbo': 's0h7c3', 'Marlene Dietrich': 's0h7c6t4', 'Charlton Heston': 's1h3c3b7', 'Kirk Douglas': 's1h3c5',
  'Gregory Peck': 's1h3c0b7', 'James Stewart': 's0h3c1b7', 'Bette Davis': 's0h7c5', 'Katharine Hepburn': 's0h7c4m3',
  'Joan Crawford': 's1h7c4', 'Ingrid Bergman': 's0h7c3', 'Rita Hayworth': 's1h5c4', 'Judy Garland': 's1h7c1',
  'Sidney Poitier': 's8h1c0', 'Elvis Presley': 's1h4c0f6', 'Frank Sinatra': 's0h3c1t8e5', 'Stan Laurel': 's0h3c4t4',
  'Oliver Hardy': 's1h3c0f2b5t4', 'Groucho Marx': 's1h3c0f2g1', 'Robin Williams': 's1h3c1b3', 'Heath Ledger': 's0h3c5',
  'Max von Sydow': 's0h3c6b7', 'Bibi Andersson': 's0h7c6', 'Klaus Kinski': 's1h5c6', 'Sean Connery': 's1h2c0l1',
  'Roger Moore': 's0h3c3', 'Chadwick Boseman': 's7h1c0f3'
};
function realLook(p, L) {
  const code = p.real && REAL_LOOKS[p.real];
  if (!code) return L;
  const K = { s: 'skin', h: 'hair', c: 'hairColor', f: 'facial', g: 'glasses', l: 'hairline', t: 'head', b: 'build', e: 'eyes', o: 'outfit', m: 'mark' };
  Object.assign(L, { facial: 0, glasses: 0, head: 0, mark: 0, hairline: 0 });
  for (const [, k, v] of code.matchAll(/([a-z])(\d)/g)) if (K[k]) L[K[k]] = +v;
  return L;
}
