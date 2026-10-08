// ---------------- Variety: more of everything that came round too often ----------------
// Long playthroughs showed the same few lines every few weeks: the same seven spam emails, five fan letters, a dozen
// invitations, forty-odd everyday scenes. This file widens those pools and gives a few of them parts that combine, so
// a long life reads like a long life. It only adds to lists the other files already use; the logic stays where it was.

// ---- everyday scenes, per activity ----
const MORE_LIFE = {
  hustle: [
    { id: 'lv_wedding', title: 'The wedding gig', text: 'You\'re waiting tables at a wedding. The best man\'s speech is dying on its feet, and he\'s looking at the staff for help.', opts: [
      { k: 'save', label: 'Feed him a line from behind the cake', check: ['cha', 13], ok: { stand: .1, cash: 60, stress: -2 }, bad: { stress: 3 }, t: 'The room roars. The groom tips you personally. Someone asks if you do this professionally.', tb: 'He repeats your line, wrong. The silence is worse.' },
      { k: 'pour', label: 'Keep pouring', ok: { cash: 30 }, t: 'You keep the glasses full. Nobody remembers the speech, which is a mercy.' }] },
    { id: 'lv_delivery', title: 'The address', text: 'Your last delivery of the night is to a house with a famous director\'s name on the doorbell.', opts: [
      { k: 'card', label: 'Slip your card in with the order', check: ['cha', 14], ok: { refs: 1, stress: -1 }, bad: { stress: 2 }, t: 'An email arrives three days later: "Bold. Send me your reel."', tb: 'The card comes back in the next order, folded into a tiny crane. You\'re not sure what it means.' },
      { k: 'just', label: 'Just deliver the food', ok: { cash: 15 }, t: 'Big tip. Good night. You\'ll tell this story for years.' }] },
    { id: 'lv_temp', title: 'Temp work', text: 'The agency sends you to cover reception at a law firm. One of the partners is on the phone talking about an option deal.', opts: [
      { k: 'ear', label: 'Listen in, discreetly', check: ['com', 12], ok: { xp: { fin: .05 }, cash: 40 }, bad: { stress: 4 }, t: 'You learn more about rights reversion in an afternoon than in a year of reading.', tb: 'He catches you listening. You\'re back at the agency by lunch.' },
      { k: 'work', label: 'Answer the phones', ok: { cash: 55 }, t: 'A clean day\'s work. The coffee machine is better than yours.' }] },
    { id: 'lv_market', title: 'The market stall', text: 'You\'re helping a friend\'s cousin on a vintage stall. A buyer wants a whole rack of old costumes, cheap, "for a period film".', opts: [
      { k: 'deal', label: 'Haggle hard', check: ['cha', 12], ok: { cash: 90 }, bad: { cash: 20 }, t: 'You get a good price and the name of the costume designer.', tb: 'They walk away and buy from the next stall. You learn something about haggling.' },
      { k: 'ask', label: 'Ask about the film', ok: { refs: 1 }, t: 'They need extras who own period shoes. You own period shoes.' }] }
  ],
  train: [
    { id: 'lv_masterclass', title: 'The guest teacher', text: 'Today\'s guest teacher has worked on films you love. During the break they\'re alone with a coffee.', opts: [
      { k: 'talk', label: 'Go and ask your real question', check: ['cha', 12], ok: { xp: { vis: .08 }, stand: .1 }, bad: { stress: 2 }, t: 'Ten minutes of the best advice you\'ve had. You write it down on your arm.', tb: 'They answer politely and check their phone. You picked the wrong moment.' },
      { k: 'leave', label: 'Let them have their coffee', ok: { stress: -1 }, t: 'You let them be. In the second half they quote something you said in class.' }] },
    { id: 'lv_critique', title: 'The critique', text: 'Your exercise goes up on the screen in front of the whole class. The teacher has a red pen and a look.', opts: [
      { k: 'defend', label: 'Explain what you were going for', check: ['com', 13], ok: { xp: { tone: .06 }, stand: .1 }, bad: { stress: 4 }, t: 'You make the case well. The teacher changes one note and leaves the rest.', tb: 'You talk for too long. The red pen comes out anyway.' },
      { k: 'take', label: 'Take the notes', ok: { xp: { struc: .05 } }, t: 'The notes are fair. The second version is much better.' }] },
    { id: 'lv_pair', title: 'Partner work', text: 'The exercise is in pairs and your partner, {contact}, wants to do the opposite of what you want to do.', opts: [
      { k: 'theirs', label: 'Try it their way', ok: { tie: { contact: 3 }, xp: { col: .05 } }, t: 'Their way is better. You hate that. You tell them so.' },
      { k: 'yours', label: 'Argue for yours', check: ['cha', 12], ok: { xp: { vis: .05 } }, bad: { tie: { contact: -2 } }, t: 'They come round. The result is the best thing in the room.', tb: 'You win the argument and lose the afternoon.' }] }
  ],
  out: [
    { id: 'lv_quizmaster', title: 'The film round', text: 'The pub quiz film round is entirely about films you\'ve worked near. The other team has a ringer.', opts: [
      { k: 'show', label: 'Answer everything, loudly', check: ['tas', 12], ok: { stress: -4, stand: .05 }, bad: { stress: 2 }, t: 'Clean sweep. The ringer buys you a drink out of respect.', tb: 'You get the director of your own film wrong. Your team will never let it go.' },
      { k: 'team', label: 'Let your team shine', ok: { stress: -3 }, t: 'You whisper answers to the quietest person on the team. They have the night of their life.' }] },
    { id: 'lv_cinema', title: 'Midnight screening', text: 'A midnight screening of a cult favourite. The crowd knows every line. Someone has brought a trombone.', opts: [
      { k: 'join', label: 'Join in', ok: { stress: -6, energy: -4 }, t: 'You shout the lines with three hundred strangers. It\'s the most fun you\'ve had all year.' },
      { k: 'watch', label: 'Watch the audience instead', ok: { xp: { tas: .06 } }, t: 'You watch what makes them laugh and when. You take notes on your phone in the dark.' }] },
    { id: 'lv_rooftop2', title: 'The terrace', text: 'A launch party on a hotel terrace. {contact} waves you over to a group that includes someone you\'ve wanted to meet for years.', opts: [
      { k: 'go', label: 'Go over', check: ['cha', 12], ok: { tie: { contact: 3 }, refs: 1 }, bad: { stress: 3 }, t: 'You hold your own. They ask for your number.', tb: 'You arrive mid-anecdote and laugh at the wrong moment.' },
      { k: 'bar', label: 'Stay at the bar', ok: { stress: -2 }, t: 'The bartender used to be a sound recordist. You talk till close.' }] },
    { id: 'lv_lost', title: 'Last train', text: 'You miss the last train home. So does a stranger who says they\'re a casting director.', opts: [
      { k: 'share', label: 'Share a taxi', check: ['cha', 11], ok: { refs: 1, cash: -20 }, bad: { cash: -20 }, t: 'They are a casting director. They remember you.', tb: 'They are a casting director\'s flatmate. Still: good chat.' },
      { k: 'walk', label: 'Walk home', ok: { energy: -6, stress: -2 }, t: 'A long walk through a quiet city. You come up with an idea on the way.' }] }
  ],
  hunt: [
    { id: 'lv_listing', title: 'Too good to be true', text: 'A job listing promises "exposure, a credit and pizza" for a feature shooting over six weeks.', opts: [
      { k: 'apply', label: 'Apply anyway', check: ['eth', 12], ok: { refs: 1 }, bad: { stress: 3 }, t: 'It\'s unpaid, but the producer is good and keeps your number.', tb: 'There is no pizza. There is barely a film.' },
      { k: 'skip', label: 'Skip it', ok: { stress: -1 }, t: 'You skip it and spend the time on your reel instead.' }] },
    { id: 'lv_cold', title: 'Cold email', text: 'You\'ve written a cold email to a producer you admire. It\'s good. It might be too long.', opts: [
      { k: 'cut', label: 'Cut it to three lines', check: ['struc', 11], ok: { refs: 1 }, bad: {}, t: 'Three lines. They reply in two.', tb: 'Three lines. No reply. That\'s how cold emails go.' },
      { k: 'send', label: 'Send it as it is', ok: {}, t: 'You send it. Somewhere, it is being skimmed.' }] },
    { id: 'lv_interview_wait', title: 'The waiting room', text: 'In the waiting room for an interview, the other candidate is {contact}. You\'re up for the same job.', opts: [
      { k: 'chat', label: 'Chat as friends', ok: { tie: { contact: 3 }, stress: -2 }, t: 'You both relax. Whoever gets it, the other gets a drink.' },
      { k: 'psych', label: 'Quietly psych them out', check: ['cha', 14], ok: { stand: .05 }, bad: { tie: { contact: -4 } }, t: 'They go in rattled. You go in calm.', tb: 'They see straight through it and tell everyone.' }] }
  ],
  network: [
    { id: 'lv_badge', title: 'The wrong badge', text: 'The registration desk has given you a badge that says "Executive Producer".', opts: [
      { k: 'wear', label: 'Wear it', check: ['cha', 13], ok: { refs: 1, stand: .05 }, bad: { stress: 4 }, t: 'People are very nice to you all evening. One of them is still emailing.', tb: 'A real executive producer reads your badge, then your face.' },
      { k: 'swap', label: 'Get it changed', ok: {}, t: 'Honest, and the woman at the desk remembers you fondly.' }] },
    { id: 'lv_corner', title: 'The corner', text: 'Everyone important is in one corner of the room, standing in a tight circle.', opts: [
      { k: 'in', label: 'Find a way in', check: ['cha', 14], ok: { refs: 1, stand: .1 }, bad: { stress: 3 }, t: 'You time it with a joke and the circle opens. You\'re in.', tb: 'The circle doesn\'t open. You stand near it for too long.' },
      { k: 'other', label: 'Talk to whoever\'s alone', ok: { xp: { col: .04 } }, t: 'The person on their own by the window is a producer who hates these things. You get along great.' }] },
    { id: 'lv_cards', title: 'Out of cards', text: 'You run out of business cards in the first twenty minutes.', opts: [
      { k: 'phone', label: 'Swap numbers instead', ok: {}, t: 'Phones out, numbers swapped. More personal, honestly.' },
      { k: 'napkin', label: 'Write on napkins with flair', check: ['tas', 11], ok: { stand: .05 }, bad: {}, t: 'Your napkin becomes a talking point. Someone frames it, allegedly.', tb: 'The napkins smudge. You become "the napkin person".' }] }
  ],
  catchup: [
    { id: 'lv_news', title: 'Big news', text: '{contact} has big news and can\'t decide whether to tell you yet.', opts: [
      { k: 'wait', label: 'Let them get there', ok: { tie: { contact: 3 } }, t: 'They tell you over dessert. You\'re the first to know.' },
      { k: 'push', label: 'Make them tell you now', check: ['cha', 11], ok: { tie: { contact: 2 } }, bad: { tie: { contact: -1 } }, t: 'They crack, laughing. It\'s great news.', tb: 'They clam up. You hear it from someone else a week later.' }] },
    { id: 'lv_bill', title: 'The bill', text: 'Dinner with {contact} is over and the bill arrives. You both reach for it.', opts: [
      { k: 'pay', label: 'Insist on paying', ok: { cash: -45, tie: { contact: 3 } }, t: 'They let you, after a short and very polite fight.' },
      { k: 'split', label: 'Split it', ok: {}, t: 'Down the middle, like adults.' }] },
    { id: 'lv_advice', title: 'Their advice', text: '{contact} has strong opinions about where your career should go next.', opts: [
      { k: 'listen', label: 'Hear them out', ok: { xp: { vis: .04 }, tie: { contact: 2 } }, t: 'Most of it is wrong. One sentence is so right it stings.' },
      { k: 'change', label: 'Change the subject', ok: { stress: -2 }, t: 'You talk about anything else. It\'s a lovely evening.' }] }
  ],
  home: [
    { id: 'lv_neighbours', title: 'Through the wall', text: 'Your neighbours are rehearsing something very dramatic through the wall. It\'s actually quite good.', opts: [
      { k: 'knock', label: 'Knock and say so', check: ['cha', 11], ok: { refs: 1, stress: -2 }, bad: { stress: 2 }, t: 'They\'re a theatre company. You\'re invited to opening night.', tb: 'They thought you were complaining. They\'re quiet for a week.' },
      { k: 'listen', label: 'Make tea and listen', ok: { stress: -3 }, t: 'Free theatre. The second act needs work.' }] },
    { id: 'lv_box', title: 'The box', text: 'Clearing out a cupboard, you find a box of your old work: notebooks, terrible drawings, a cassette.', opts: [
      { k: 'read', label: 'Read it all', ok: { xp: { orig: .06 }, stress: -2 }, t: 'Some of it is awful. One idea from when you were seventeen is still good.' },
      { k: 'bin', label: 'Bin it', ok: { stress: -1 }, t: 'Lighter. You keep the cassette. Obviously.' }] },
    { id: 'lv_cook', title: 'Sunday cooking', text: 'You decide to cook something ambitious from a recipe with forty steps.', opts: [
      { k: 'go', label: 'Commit', check: ['eth', 11], ok: { stress: -5, energy: 3 }, bad: { stress: 2 }, t: 'It\'s magnificent. You eat it for four days.', tb: 'Step thirty-one involves a blowtorch you don\'t own.' },
      { k: 'order', label: 'Order in', ok: { cash: -25, stress: -2 }, t: 'Dumplings and a film. Perfect Sunday.' }] }
  ],
  read: [
    { id: 'lv_margin', title: 'Notes in the margin', text: 'A second-hand screenplay from the market has someone else\'s notes in the margins. They\'re brilliant.', opts: [
      { k: 'study', label: 'Study every note', ok: { xp: { struc: .07 } }, t: 'Whoever they were, they\'ve taught you more than most classes.' },
      { k: 'find', label: 'Try to find out who wrote them', check: ['tas', 13], ok: { refs: 1, xp: { struc: .03 } }, bad: {}, t: 'The handwriting belongs to a script editor, still working. You write to them.', tb: 'A dead end. The notes are still brilliant.' }] },
    { id: 'lv_review', title: 'A cruel review', text: 'You read an old review that tore apart a film you love. It\'s cruel, and partly right.', opts: [
      { k: 'think', label: 'Think about what it gets right', ok: { xp: { tas: .06 } }, t: 'You rewatch the film with the review in mind. You love it differently now.' },
      { k: 'angry', label: 'Write a furious reply you\'ll never send', ok: { stress: -3, xp: { dial: .03 } }, t: 'Two pages of fury. Some of your best writing.' }] },
    { id: 'lv_library', title: 'The library', text: 'The film library has an archive of production files: budgets, call sheets, memos from forty years ago.', opts: [
      { k: 'dig', label: 'Spend the whole day there', ok: { xp: { bud: .05, fin: .03 }, energy: -3 }, t: 'You learn how a real budget bends. A memo about a camel makes you laugh out loud.' },
      { k: 'one', label: 'Read one file properly', ok: { xp: { pack: .03 } }, t: 'One film, start to finish, on paper. You understand it better than the people who made it.' }] }
  ],
  write: [
    { id: 'lv_cafe', title: 'The café regular', text: 'The person at the next café table has been writing for as long as you have. Today they look over and say, "Stuck?"', opts: [
      { k: 'swap', label: 'Swap pages', check: ['col', 11], ok: { xp: { dial: .06 }, refs: 1 }, bad: {}, t: 'They\'re good, and their note on your scene is better than yours.', tb: 'Your styles don\'t mix. Nice to have a café friend, though.' },
      { k: 'head', label: 'Headphones on', ok: { xp: { struc: .04 } }, t: 'Two pages, finally. They nod at you on the way out.' }] },
    { id: 'lv_delete', title: 'Kill your darlings', text: 'Your favourite scene in the draft doesn\'t belong. You know it. You don\'t want to know it.', opts: [
      { k: 'cut', label: 'Cut it', check: ['struc', 12], ok: { xp: { struc: .08 } }, bad: { stress: 3 }, t: 'The draft breathes. You put the scene in a folder called "later".', tb: 'Without it, the next scene makes no sense. You need a new bridge.' },
      { k: 'keep', label: 'Keep it for now', ok: { stress: -1 }, t: 'You keep it. Future you can decide.' }] },
    { id: 'lv_dialogue', title: 'Overheard', text: 'On the bus, two strangers have the best argument you\'ve ever heard. Every line is perfect.', opts: [
      { k: 'note', label: 'Write it all down', ok: { xp: { dial: .07 } }, t: 'Three pages of real speech. It ends up, slightly changed, in your script.' },
      { k: 'listen', label: 'Just listen', ok: { stress: -2, xp: { char: .03 } }, t: 'You miss your stop. Worth it.' }] },
    { id: 'lv_title', title: 'The title', text: 'Your script\'s title has stopped working for you, and you can\'t stop thinking about it.', opts: [
      { k: 'list', label: 'Write fifty alternatives', check: ['orig', 12], ok: { xp: { orig: .06 } }, bad: {}, t: 'Number forty-three is perfect.', tb: 'You end up back where you started. It was fine all along.' },
      { k: 'ask', label: 'Ask {contact}', ok: { tie: { contact: 2 } }, t: 'They suggest something so obvious you\'re annoyed you didn\'t think of it.' }] }
  ],
  study: [
    { id: 'lv_library2', title: 'All-nighter', text: 'A deadline tomorrow, half the work left, and the library closes at ten.', opts: [
      { k: 'night', label: 'Pull an all-nighter', check: ['eth', 12], ok: { xp: { vis: .04 }, energy: -12 }, bad: { energy: -12, stress: 5 }, t: 'Done by six. You sleep through lunch and feel like a hero.', tb: 'You fall asleep at three on the keyboard. It\'s mostly the letter K.' },
      { k: 'ask', label: 'Ask for an extension', check: ['cha', 12], ok: { stress: -3 }, bad: { stress: 3 }, t: 'Granted, with a look.', tb: 'Denied, with a longer look.' }] },
    { id: 'lv_group', title: 'The group project', text: 'Your group project has five people, and two of them have disappeared.', opts: [
      { k: 'carry', label: 'Carry it', ok: { xp: { eth: .05 }, energy: -6 }, t: 'You do the work of three. The teacher knows exactly who did what.' },
      { k: 'chase', label: 'Chase them down', check: ['cha', 12], ok: { xp: { col: .05 } }, bad: { stress: 3 }, t: 'Both reappear, apologetic and useful.', tb: 'One reappears. The other has left the course.' }] },
    { id: 'lv_tutor', title: 'Office hours', text: 'You\'re the only student who turns up to the tutor\'s office hours.', opts: [
      { k: 'deep', label: 'Ask the question nobody asks', check: ['tas', 11], ok: { xp: { vis: .06 }, refs: 1 }, bad: {}, t: 'An hour goes by. They lend you a book and their old notes.', tb: 'They answer briefly. Still, they know your name now.' },
      { k: 'quick', label: 'Keep it quick', ok: {}, t: 'In and out. They appreciate it, honestly.' }] }
  ]
};
for (const k in MORE_LIFE) { (LIFE_SCENES[k] = LIFE_SCENES[k] || []).push(...MORE_LIFE[k]); for (const s of MORE_LIFE[k]) SCENES.push(Object.assign({ event: 1, jobs: [] }, s)); }

// ---- spam: parts that combine ----
SPAM.push(...['Your screenplay has been selected (fee applies)', 'FINAL NOTICE: your crew card has expired', 'Meet singles who also own a fog machine', 'Your package is waiting: a dolly track (size XXL)', 'Congratulations, you are our 1,000,000th cinematographer', 'Doctors HATE this one trick for continuity',
  'Claim your free Oscar-adjacent statuette', 'You have (1) unread headshot', 'Invest in our blockchain film studio', 'URGENT: your lens cap has been compromised', 'An heir in a distant country needs a script doctor', 'Your reel has been flagged as TOO GOOD', 'Re: your late uncle\'s steadicam', 'Become a producer in 7 days (no films required)',
  'Cheap lights! Bright lights! Questionable lights!', 'Your streaming password expires in 3 hours', 'Re: Re: Re: the craft table incident', 'A famous director wants to follow you (verify here)', 'Your account shows suspicious acting', 'Hot new trend: clapping slates with your mind', 'Last chance: genuine moon-landing set pieces',
  'We noticed you looked at a boom pole', 'You\'ve been pre-approved for a three-picture deal', 'Exclusive: the secret to the perfect logline (paywall)', 'Your free trial of Pro Gaffer Tape is ending', 'Urgent invoice for 4,000 sandwiches', 'Unclaimed residuals in your name (send a small fee)']);
// ---- fan mail ({work} is your newest release, if you have one) ----
FANS.push(...['I\'ve watched {work} eleven times. My cat has watched it four.', 'Not a question, just: thank you for {work}.', 'My friend and I argued about the ending of {work} for a whole train journey. Who\'s right?', 'I\'m a nurse on night shifts and {work} got me through them.',
  'Saw {work} at a tiny screening and I\'ve been telling everyone since.', 'Could you sign something for my mum? She says you\'re "the real thing".', 'I started making my own stuff because of you. It\'s bad. I\'m getting better.', 'Please tell me there\'s more coming. Please.',
  'I teach drama to teenagers and {work} is the only thing they all agreed on.', 'Weird question: where did you find that location?', 'You don\'t know me but you basically raised me through a screen. Thank you.', 'I proposed to my partner after watching {work}. She said yes. No pressure.',
  'Hello from very far away. {work} made it here too.', 'Honestly not my kind of thing but I keep thinking about it.', 'My dad doesn\'t like anything, and he liked {work}.', 'What do you listen to when you work? Asking for my own work.', 'I named my goldfish after you. He is thriving.',
  'A small fan account has started. It\'s just me so far. Hi.', 'I think about one shot in {work} every single day.', 'I\'m writing my thesis partly about {work}. Is that weird?']);
// ---- favours friends ask by email ----
FAVOURS.push(...[
  ['Can I pick your brain?', 'Hi {me}, I\'ve got an interview next week for something a lot like what you do. Twenty minutes on the phone? I\'ll owe you a lunch. {them}'],
  ['Lend me your eyes', 'Hi {me}, I\'ve shot a test and I can\'t tell any more if it\'s good. Five minutes, honest opinion, no mercy. {them}'],
  ['A weird one', 'Hi {me}, my nephew wants to "work in films" and my sister has asked me to find him a real person to talk to. You\'re the most real person I know. {them}'],
  ['Do you still have…', 'Hi {me}, do you still have that hard drive from the shoot? I need one clip for my reel and I\'ll buy you anything. {them}'],
  ['Read this cover letter', 'Hi {me}, I\'ve rewritten my cover letter nine times. Tell me if it sounds desperate. It does, doesn\'t it. {them}'],
  ['Come to my screening?', 'Hi {me}, my short is playing at a tiny festival on Saturday and I need at least one face in the audience I recognise. {them}'],
  ['Kit emergency', 'Hi {me}, our kit van is stuck behind a parade. Do you know anyone with a spare monitor for tomorrow? {them}'],
  ['A quick quote?', 'Hi {me}, I\'m writing a piece about people working in the business and I\'d love one line from you. Just one. {them}'],
  ['Be my plus-one', 'Hi {me}, I have two tickets to a very fancy dinner and I don\'t want to go alone. Black tie, terrible speeches, excellent dessert. {them}'],
  ['Who do I call?', 'Hi {me}, I\'ve got an idea that needs a producer and I don\'t know a single one. Who would you call? {them}'],
  ['Sanity check', 'Hi {me}, I\'ve been offered a deal and something about it smells. Can I forward it to you? {them}'],
  ['Stand in for me?', 'Hi {me}, I\'m double-booked on Thursday. Could you take my place at a careers talk at my old school? They\'ll love you. {them}']
]);
// ---- invitations from friends ----
INVITES.find(v => v.k === 'dinner').t = 'a dinner party at {who}\'s place';
INVITES.push(
  { k: 'quiz', t: 'a pub quiz with {who}\'s team', meet: 1, tie: 4, stress: -4, cost: 10, xp: { tas: .03 } },
  { k: 'housewarming', t: '{who}\'s housewarming', meet: 2, tie: 5, stress: -3, cost: 20 },
  { k: 'booklaunch', t: 'a book launch with {who}', meet: 2, tie: 3, xp: { struc: .03 }, stand: .1 },
  { k: 'standup', t: 'a stand-up night with {who}', meet: 1, tie: 4, stress: -5, cost: 15, xp: { comic: .03 } },
  { k: 'jazz', t: 'a jazz bar with {who}', meet: 1, tie: 4, stress: -4, cost: 25, xp: { rhythm: .03 } },
  { k: 'poker', t: 'poker night at {who}\'s place', meet: 1, tie: 4, stress: -2, cost: 30 },
  { k: 'hike', t: 'a sunrise hike with {who}', tie: 6, stress: -6, e: 8 },
  { k: 'filmclub', t: 'a film club double bill with {who}', meet: 1, tie: 4, xp: { tas: .05 } },
  { k: 'openingnight', t: 'the opening night of a play {who} worked on', meet: 2, tie: 4, stand: .2, xp: { pres: .03 }, cost: 30 },
  { k: 'boat', t: 'a boat trip with {who}', meet: 1, tie: 6, stress: -6, cost: 35 },
  { k: 'gamenight', t: 'board games at {who}\'s place', tie: 5, stress: -4 },
  { k: 'launch', t: 'a launch party {who} is throwing', meet: 3, tie: 3, stress: -2, cost: 10, stand: .1 },
  { k: 'climb', t: 'a climbing session with {who}', tie: 4, stress: -5, e: 7 },
  { k: 'listening', t: 'a listening party for {who}\'s friend\'s album', meet: 2, tie: 3, xp: { song: .03 } }
);
Object.assign(INVITE_TXT, {
  birthday: INVITE_TXT.birthday.concat(['it\'s my birthday {when} and i\'m doing the thing where i pretend i don\'t care. please come', 'birthday {when}. there will be cake. there will be speeches. there will be you?']),
  dinner: INVITE_TXT.dinner.concat(['dinner at mine {when}. i bought a new pan and i need witnesses', 'cooking for friends {when}, very low stakes, very high wine']),
  quiz: ['pub quiz {when}. we need someone who knows films. that\'s literally you', 'our quiz team lost to a team called "Quiztopher Nolan" last week. revenge {when}?', 'quiz {when}? the film round is ours'],
  housewarming: ['i finally have a flat with a door that shuts. housewarming {when}!', 'housewarming {when}. bring nothing. or bring a plant', 'moved in!! party {when}, come see the tiny balcony'],
  booklaunch: ['a friend\'s book launch {when}. free wine and very clever people. come be clever with me', 'book launch {when}, i promised to bring people. you\'re people'],
  standup: ['stand-up night {when}, my mate is trying new material. pray for us', 'comedy {when}? first round on me if nobody makes us part of the act'],
  jazz: ['there\'s a jazz trio {when} that will change your life. or at least your evening', 'jazz bar {when}. low lights, good drinks, no talking about work'],
  poker: ['poker at mine {when}. bring cash you\'re prepared to lose to me', 'card night {when}. we play badly and eat well'],
  hike: ['sunrise hike {when}. i know. i KNOW. but the view', 'walk up the big hill {when}? early start, huge breakfast after'],
  filmclub: ['film club {when}, double bill, i\'m picking the second one so it\'ll be weird', 'come to film club {when}? we argue for longer than the films run'],
  openingnight: ['opening night {when}! i worked on it! please come and clap a lot', 'the play opens {when}. i\'ve got two comps with your name on them'],
  boat: ['someone lent me a boat {when}. don\'t ask. come', 'boat trip {when}. i can mostly drive it'],
  gamenight: ['board games {when}. it will get competitive. you have been warned', 'game night at mine {when}, bring snacks and a grudge'],
  launch: ['launching the thing {when}!! party, speeches, free drinks. come', 'launch party {when}. i need friendly faces in the crowd'],
  climb: ['climbing {when}? beginners welcome, terror optional', 'bouldering {when}. it\'s basically puzzles for your arms'],
  listening: ['my friend\'s album listening party {when}. it\'s good, actually good', 'come hear a record nobody\'s heard yet {when}?']
});
// what you send back when you say yes, or have to say no
const YES_TXT = ['yes! see you there', 'count me in', 'wouldn\'t miss it', 'yes yes yes', 'i\'m there. what do i bring?', 'perfect, see you then', 'deal. save me a seat', 'oh I\'m so in', 'yes, and i\'m bringing my good mood', 'see you there!!'];
const HELP_TXT = ['of course. I\'ll be there', 'yes, obviously. what time?', 'on it. bring coffee', 'you got it', 'say no more. I\'ll be there', 'of course! you owe me a pizza'];
const NO_TXT = ['so sorry, can\'t that night', 'ah, I\'m slammed. next time?', 'can\'t, sorry!! have fun', 'argh, I\'m booked. raincheck?', 'I wish. working. tell me everything after', 'can\'t make it, but I\'m there in spirit', 'not this time, but please ask me again'];
// ---- favours people ask in person ----
const ASK_WHAT = ['help moving flat', 'a hand painting a set for their short', 'someone to run lines with before an audition', 'a lift to the airport at dawn', 'help building a bookcase that came in 140 pieces', 'someone to hold a boom pole for an afternoon', 'help carrying a piano up three floors', 'a second opinion on a flat they\'re about to rent', 'someone to look after their dog for a day', 'help hanging the lights for a gallery show', 'a reader for an audition tape', 'help sorting forty boxes of old costumes', 'company at a hospital appointment', 'a hand setting up a pop-up cinema', 'someone to time their wedding speech'];
// ---- gossip ----
GOSSIP_LINES.push(...['{a} has started saying "the work" instead of "the film". it\'s been a week', '{a} and {b} are writing something together. nobody knows what. both are being smug about it', 'heard {a} turned down a huge job to go on a silent retreat', '{a} has a podcast now. of course they do',
  '{a} sent back the catering three times on their last shoot. the caterer has a list now', 'apparently {a} is learning to fly. planes. for a role. or for fun. unclear', '{a} got recognised at the supermarket and has been unbearable since', '{a} told an interviewer {b} was their "greatest influence". {b} has never met them',
  '{a} has bought a vineyard. a very small vineyard. it\'s mostly a garden', 'so {a} and {b} had a screaming match about lenses in the car park. both were wrong', '{a} is "taking a year off". it\'s been four years', 'word is {a} is up for something big at a studio. fingers crossed for them honestly']);
// ---- the industry invites you to things ----
INVITE_MAILS.push(
  { k: 'retro', subj: 'A retrospective Q&A', body: 'We\'re screening a classic from our archive and would love a working voice in the conversation afterwards. Thirty minutes, a stool, a glass of water.', yes: 'Say yes', fx: { stand: .5, energy: -4, meet: 1, tas: .05 }, min: 16 },
  { k: 'quiz', subj: 'Industry quiz night', body: 'Our annual industry quiz. Teams of six, a trophy shaped like a clapperboard, and the same producer winning every year. Stop him.', yes: 'Join a team', fx: { stress: -3, meet: 2, cost: 15 }, min: 0 },
  { k: 'craft', subj: 'Craft talk: how it\'s really done', body: 'An evening of short talks from people at the start of their careers, for people at the very start of theirs. Ten minutes each. Bring a story.', yes: 'Give a talk', fx: { stand: .4, energy: -5, meet: 1 }, min: 6 },
  { k: 'open', subj: 'Studio open day', body: 'Our stages are open to the industry for a day: tours, kit demos and a canteen that is better than it needs to be.', yes: 'Go along', fx: { meet: 2, energy: -4, main: .1 }, min: 0 },
  { k: 'charity', subj: 'Charity screening', body: 'A fundraiser for the hardship fund that helps crew between jobs. One film, one raffle, a lot of goodwill.', yes: 'Buy a ticket', fx: { cost: 60, stand: .3, meet: 1, stress: -2 }, min: 4 },
  { k: 'lab', subj: 'Development lab: readers wanted', body: 'Our development lab needs readers for this round: ten scripts, a written report each, a long lunch to argue about them.', yes: 'Sign up', fx: { energy: -8, main: .2, meet: 1, tas: .05 }, min: 10 },
  { k: 'awardsdinner', subj: 'Awards dinner: a seat at our table', body: 'We have a seat at our table for the craft awards dinner. Black tie, terrible chicken, excellent gossip.', yes: 'Accept the seat', fx: { stand: .6, energy: -6, meet: 2, cost: 50 }, min: 20 },
  { k: 'mixer', subj: 'Newcomers\' mixer', body: 'An evening for people in their first few years in the business. No speeches, a free drink, and a room full of people who will be running things in ten years.', yes: 'Go along', fx: { meet: 3, energy: -4, cost: 10 }, min: 0 },
  { k: 'festivalpanel', subj: 'Festival panel: the next ten years', body: 'Our festival has a panel on where the industry is going, and we\'d like someone who\'s actually working in it. Travel and a hotel covered.', yes: 'Agree to speak', fx: { stand: .9, energy: -8, meet: 2, intl: 2 }, min: 30 },
  { k: 'judging', subj: 'Judge our student awards?', body: 'Forty student films, one weekend, three prizes. The students will remember who picked them.', yes: 'Judge it', fx: { stand: .5, energy: -8, tas: .08, meet: 1 }, min: 20 }
);
// ---- networking evenings once you know everyone ----
const MIXER_VENUES = ['a rooftop bar', 'the back room of a pizzeria', 'a gallery with warm white wine', 'a boat moored on the river', 'a hotel bar with very low lighting', 'a converted church', 'a members\' club that pretends not to be', 'a karaoke bar booked for the night', 'a cinema foyer after a screening', 'a brewery with a projector', 'a bookshop after hours', 'a sound stage with fairy lights'];
const MIXER_SAME = ['Familiar faces everywhere: you catch up with {a} and {b}.', 'You know half the room now. {a} drags you into a long story; {b} rescues you.', 'The same circuit, a new venue. You end up in a corner with {a}, planning something.', 'No new faces tonight, but {a} introduces you to their plus-one, who is very funny.', 'It\'s more reunion than mixer. {a} buys a round; {b} tells you who\'s hiring.', 'You spend the evening with {a}, trading notes on who\'s doing what.'];
// ---- tired at work: a mistake that sounds like your job ----
const TIRED_SLIPS = {
  cam: ['mislabel a whole day\'s footage', 'leave a filter on for three takes', 'forget to change the battery and lose the end of a take'],
  snd: ['leave a radio mic on in the toilet', 'record a whole scene with the wrong input', 'forget to wild-track the room'],
  art: ['dress the set with yesterday\'s props', 'put the wrong poster on the wall in a continuity scene', 'leave the paint wet on the hero door'],
  cos: ['send an actor out in last week\'s jacket', 'forget the hat in scene twelve', 'pin a hem that falls down on camera'],
  set: ['forget the call sheet changes', 'lose the keys to the truck', 'send the extras to the wrong car park'],
  ad: ['forget the call sheet changes', 'lose an actor for twenty minutes', 'call lunch half an hour early'],
  edt: ['send the wrong version to the producer', 'overwrite a day\'s assembly', 'export the cut without the music'],
  pro: ['send the budget with last month\'s numbers', 'double-book the location', 'forget to sign off a payment'],
  act: ['miss your cue', 'go blank on a line you knew yesterday', 'turn up to set with the wrong pages'],
  wri: ['send notes on the wrong draft', 'lose the latest pages', 'reply-all with a joke meant for one person'],
  dir: ['call cut on the best take', 'forget a shot on the list', 'snap at the wrong person'],
  mus: ['send the cue at the wrong tempo', 'forget to bounce the stems', 'miss the session start'],
  office: ['send the wrong version to the producer', 'forget a meeting you set up', 'file the contracts in the bin'],
  any: ['send the wrong version to the producer', 'forget the call sheet changes', 'lose a whole morning to a typo', 'turn up an hour late', 'drop something expensive']
};
