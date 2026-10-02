// ---------------- Faces for the famous ----------------
// People reimagined from film history get a face that nods to the original: the hair, the glasses, the moustache,
// the hat. Keyed by the hidden real name. Code letters: s skin, h hair, c hair colour, f facial hair, g glasses,
// l receding hairline, t headwear, b build, e eyes, o outfit, m mark (see LOOK in portrait.js for the options).
const REAL_LOOKS = {
  'Charlie Chaplin': 's1h5c0f2t4o9', 'Buster Keaton': 's1h2c0t4o9', 'Harold Lloyd': 's1h3c0g1o9', 'Alfred Hitchcock': 's1h3c0l1b5o9',
  'Orson Welles': 's1h4c0b5o9', 'John Ford': 's1h2c2g7t4', 'Stanley Kubrick': 's1h5c0f5', 'Steven Spielberg': 's1h2c1f4g2t1l1',
  'Martin Scorsese': 's1h3c0g3l1b6', 'Francis Ford Coppola': 's2h2c0f5g3b5', 'George Lucas': 's1h3c1f4', 'Quentin Tarantino': 's1h3c0e0',
  'Woody Allen': 's1h2c4g3b0', 'Spike Lee': 's7h1c0f3g3t1', 'Akira Kurosawa': 's2h3c0g7t4', 'Federico Fellini': 's1h3c0t4o9',
  'Ingmar Bergman': 's0h3c1t1', 'Jean-Luc Godard': 's1h3c1g7l1', 'François Truffaut': 's1h3c0', 'Satyajit Ray': 's5h3c0b7',
  'Christopher Nolan': 's0h3c5o8', 'Tim Burton': 's1h5c0g7', 'Peter Jackson': 's1h5c2f5g1b5', 'Guillermo del Toro': 's2h3c0f5g2b5',
  'Wes Anderson': 's0h8c3o8', 'David Lynch': 's1h4c7o7', 'Werner Herzog': 's1h2c1', 'Pedro Almodóvar': 's2h5c7b4',
  'Bong Joon-ho': 's2h5c0g3', 'Wong Kar-wai': 's2h2c0g7', 'Ang Lee': 's2h3c0', 'James Cameron': 's1h3c3', 'Ridley Scott': 's1h2c7f4l1',
  'Sergio Leone': 's2h3c0f5g2b5', 'Clint Eastwood': 's1h3c3b7', 'Kathryn Bigelow': 's1h8c1b7', 'Greta Gerwig': 's0h8c6', 'Sofia Coppola': 's0h8c2',
  'Jane Campion': 's0h7c7', 'Agnès Varda': 's1h7c4', 'Jordan Peele': 's6h1c0f4g2', 'Ava DuVernay': 's7h9c0', 'Barry Jenkins': 's7h1c0f5',
  'Denis Villeneuve': 's1h2c1f1', 'Alfonso Cuarón': 's2h8c7f5', 'Alejandro González Iñárritu': 's2h8c7f5', 'Hayao Miyazaki': 's1h3c7f4g3',
  'Sidney Lumet': 's1h2c7g3', 'Billy Wilder': 's1h3c0t4', 'Frank Capra': 's3h5c0', 'Roman Polanski': 's1h4c1b6', 'John Carpenter': 's1h8c7f5',
  'David Fincher': 's1h1c1f1t1', 'Paul Thomas Anderson': 's1h8c2f1', 'Steven Soderbergh': 's1h1c1g3', 'Spike Jonze': 's1h5c1',
  'Darren Aronofsky': 's1h5c0', 'Joel and Ethan Coen': 's1h8c0g2', 'Richard Linklater': 's1h3c1', 'Mel Brooks': 's1h2c0g3', 'Charlie Kaufman': 's1h5c0',
  'Yasujirō Ozu': 's2h1c0t4', 'Fritz Lang': 's1h3c0', 'Sergei Eisenstein': 's1h5c1l1', 'Luis Buñuel': 's1h1c0', 'Andrei Tarkovsky': 's1h3c0f2',
  'Abbas Kiarostami': 's3h3c7g7', 'Zhang Yimou': 's2h1c0', 'Park Chan-wook': 's2h3c0g2', 'Hirokazu Kore-eda': 's2h3c7', 'Chloé Zhao': 's2h8c0',
  'Marilyn Monroe': 's0h5c6m4', 'Audrey Hepburn': 's1h7c0b0', 'Elizabeth Taylor': 's1h5c0e9', 'Grace Kelly': 's0h7c6', 'Humphrey Bogart': 's1h3c1t8o9',
  'James Dean': 's1h4c3o4', 'Marlon Brando': 's1h1c1o0', 'Cary Grant': 's2h3c0o9', 'Gene Kelly': 's1h4c0', 'Fred Astaire': 's0h3c1l1b7',
  'Paul Newman': 's0h3c3e5', 'John Wayne': 's1h3c2t4b4', 'Jack Nicholson': 's1h3c0l1g7', 'Robert De Niro': 's2h3c0m4', 'Al Pacino': 's2h5c0',
  'Dustin Hoffman': 's2h3c1b6', 'Meryl Streep': 's0h8c6', 'Harrison Ford': 's1h3c3', 'Sylvester Stallone': 's2h3c0b8', 'Arnold Schwarzenegger': 's2h2c2b8',
  'Tom Hanks': 's1h3c2', 'Tom Cruise': 's1h3c1', 'Denzel Washington': 's7h1c0f2', 'Morgan Freeman': 's7h1c7f2m3', 'Samuel L. Jackson': 's7h0c0f3t6',
  'Will Smith': 's6h1c0', 'Eddie Murphy': 's7h1c0f2', 'Whoopi Goldberg': 's7h9c0', 'Julia Roberts': 's1h5c4', 'Nicole Kidman': 's0h5c4',
  'Cate Blanchett': 's0h7c6', 'Leonardo DiCaprio': 's1h3c5', 'Brad Pitt': 's1h2c6f1', 'Johnny Depp': 's1h8c1f3g9', 'Keanu Reeves': 's2h8c0f5',
  'Scarlett Johansson': 's0h7c6', 'Natalie Portman': 's1h7c1', 'Angelina Jolie': 's1h8c1', 'Jennifer Lawrence': 's0h8c5', 'Emma Stone': 's0h8c4',
  'Margot Robbie': 's0h8c6', 'Timothée Chalamet': 's0h5c1', 'Zendaya': 's3h5c1', 'Viola Davis': 's7h1c0', 'Lupita Nyong’o': 's9h1c0', 'Idris Elba': 's8h1c0f5',
  'Daniel Day-Lewis': 's0h3c1', 'Anthony Hopkins': 's1h2c3', 'Ian McKellen': 's1h3c7', 'Judi Dench': 's0h1c7', 'Helen Mirren': 's0h7c6',
  'Michael Caine': 's0h3c6g3', 'Gary Oldman': 's1h3c2g4', 'Christopher Lee': 's1h3c0b7', 'Peter Cushing': 's0h3c7b7', 'Bruce Lee': 's3h3c0b8',
  'Jackie Chan': 's3h2c0', 'Chow Yun-fat': 's2h3c0g7', 'Toshiro Mifune': 's3h3c0f1', 'Shah Rukh Khan': 's4h5c0', 'Amitabh Bachchan': 's5h3c0f5g3b7',
  'Aamir Khan': 's3h2c0', 'Rajinikanth': 's5h4c0g7', 'Sophia Loren': 's3h8c0', 'Marcello Mastroianni': 's2h3c0g7o9', 'Brigitte Bardot': 's1h8c6',
  'Alain Delon': 's1h3c1e5', 'Jean-Paul Belmondo': 's2h3c1', 'Catherine Deneuve': 's0h8c6', 'Isabelle Huppert': 's0h8c4m3', 'Gérard Depardieu': 's1h8c4b5',
  'Greta Garbo': 's0h7c3', 'Marlene Dietrich': 's0h7c6t4', 'Charlton Heston': 's1h3c3b7', 'Kirk Douglas': 's1h3c5', 'Gregory Peck': 's1h3c0b7',
  'James Stewart': 's0h3c1b7', 'Bette Davis': 's0h7c5', 'Katharine Hepburn': 's0h7c4m3', 'Joan Crawford': 's1h7c4', 'Ingrid Bergman': 's0h7c3',
  'Rita Hayworth': 's1h5c4', 'Judy Garland': 's1h7c1', 'Sidney Poitier': 's8h1c0', 'Elvis Presley': 's1h4c0f6', 'Frank Sinatra': 's0h3c1t8e5',
  'Stan Laurel': 's0h3c4t4', 'Oliver Hardy': 's1h3c0f2b5t4', 'Groucho Marx': 's1h3c0f2g1', 'Bill Murray': 's1h3c2', 'Robin Williams': 's1h3c1b3',
  'Jim Carrey': 's1h3c1', 'Danny DeVito': 's1h2c0l1b6', 'Joe Pesci': 's2h2c1b6', 'Christopher Walken': 's0h4c1', 'Willem Dafoe': 's1h3c3',
  'Tilda Swinton': 's0h4c6b7', 'Frances McDormand': 's0h7c3', 'Uma Thurman': 's0h7c0', 'Sigourney Weaver': 's0h5c1b7', 'Jodie Foster': 's0h7c5',
  'Michelle Yeoh': 's2h8c0', 'Gong Li': 's2h8c0', 'Tony Leung Chiu-wai': 's2h3c0', 'Song Kang-ho': 's2h2c0', 'Ryan Gosling': 's0h3c5',
  'Joaquin Phoenix': 's1h3c1f5', 'Heath Ledger': 's0h3c5', 'Matthew McConaughey': 's1h3c3', 'Hugh Jackman': 's1h3c1f6', 'Robert Downey Jr.': 's1h3c1f3g9',
  'Chris Hemsworth': 's0h8c6b8', 'Charlize Theron': 's0h7c6', 'Halle Berry': 's5h1c0', 'Penélope Cruz': 's2h8c0', 'Javier Bardem': 's2h3c0',
  'Antonio Banderas': 's2h8c0', 'Salma Hayek': 's3h8c0', 'Gael García Bernal': 's2h3c0f1', 'Mads Mikkelsen': 's0h3c2f1', 'Max von Sydow': 's0h3c6b7',
  'Liv Ullmann': 's0h8c4', 'Bibi Andersson': 's0h7c6', 'Klaus Kinski': 's1h5c6', 'Bill Nighy': 's0h3c3g2b7', 'Steve Buscemi': 's1h8c1b7',
  'John Travolta': 's1h4c0', 'Bruce Willis': 's1h0c2l1', 'Jason Statham': 's1h0c2f1l1', 'Vin Diesel': 's3h0c0b8', 'Dwayne Johnson': 's4h0c0b8',
  'Mel Gibson': 's1h8c2', 'Kevin Costner': 's1h3c3', 'Sean Connery': 's1h2c0l1', 'Roger Moore': 's0h3c3', 'Daniel Craig': 's0h1c5e5',
  'Pierce Brosnan': 's1h3c0', 'Hugh Grant': 's0h4c1', 'Colin Firth': 's0h3c1', 'Kate Winslet': 's0h8c5', 'Emma Thompson': 's0h7c3',
  'Tom Hardy': 's1h1c1f4', 'Cillian Murphy': 's0h2c1e4', 'Benedict Cumberbatch': 's0h5c1', 'Michael Fassbender': 's0h2c4', 'Florence Pugh': 's0h7c6',
  'Saoirse Ronan': 's0h8c6', 'Anya Taylor-Joy': 's0h8c6', 'Adam Driver': 's1h8c0b7', 'Oscar Isaac': 's2h5c0f4', 'Pedro Pascal': 's2h5c0f2',
  'Mahershala Ali': 's7h1c0f4', 'Chadwick Boseman': 's7h1c0f3', 'Daniel Kaluuya': 's9h1c0', 'Michael B. Jordan': 's7h1c0f3', 'Austin Butler': 's0h4c6'
};
function realLook(p, L) {
  const code = p.real && REAL_LOOKS[p.real];
  if (!code) return L;
  const K = { s: 'skin', h: 'hair', c: 'hairColor', f: 'facial', g: 'glasses', l: 'hairline', t: 'head', b: 'build', e: 'eyes', o: 'outfit', m: 'mark' };
  Object.assign(L, { facial: 0, glasses: 0, head: 0, mark: 0, hairline: 0 });
  for (const [, k, v] of code.matchAll(/([a-z])(\d)/g)) if (K[k]) L[K[k]] = +v;
  return L;
}
