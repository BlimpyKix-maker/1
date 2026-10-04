// ---------------- The early years, filled in ----------------
// The first rung is where you spend the most time, so it gets the most moments: the commute, the hunt, the mixers,
// the side hustle, the classes, the nights in and out, and the small jobs. Many of them open a door or close one:
// a new name in your phone, a reputation, a favour owed, someone who now thinks less of you.
const LOW_ROAD = [
  { id: "lr_bus2", meetRole: "actor", v: ["transit"], title: "The night bus", text: "The last bus home. A man at the back is quietly crying over a stack of headshots.", teach: "Most actors work other jobs for years; casting directors see thousands of headshots a week, and the photo is often the only thing that gets read.", opts: [
    { k: "talk", label: "Sit with him", check: ["cha", 10], ok: { meet: 1, stress: -1 }, bad: {}, t: "He's an actor who just lost a part he'd been promised. By the end of the route you're both laughing. He takes your number.", tb: "He'd rather be alone. You respect that." },
    { k: "leave", label: "Give him some space", ok: {}, t: "You look out of the window. Everyone's carrying something." }] },
  { id: "lr_train", v: ["transit"], title: "The delayed train", text: "Signal failure. Forty minutes stuck between stations, and you're due on set.", teach: "Being late on set costs money by the minute; crews call ahead the moment they know, and good ADs remember who did.", opts: [
    { k: "call", label: "Call ahead straight away", check: ["com", 9], ok: { flag: "reliable" }, bad: { stress: 2 }, t: "The AD says 'thanks for the heads-up' and means it.", tb: "No signal in the tunnel. You arrive late and flustered." },
    { k: "script", label: "Use the time to read", ok: { xp: { tas: .05 } }, t: "You finish a script someone lent you. Annoyingly, it's good." }] },
  { id: "lr_busker", meetRole: "composer", v: ["transit"], title: "The busker", text: "A busker in the station is playing a film theme beautifully, to nobody.", opts: [
    { k: "listen", label: "Stop and listen, drop a coin", ok: { stress: -2, cash: -2 }, t: "Three minutes of something lovely before the day starts." },
    { k: "ask", label: "Ask if they've ever thought of scoring films", check: ["cha", 11], ok: { meet: 1 }, bad: {}, t: "They've scored three student shorts. You swap numbers; you'll need music one day.", tb: "They have, and they're very tired of being asked." }] },
  { id: "lr_lost", v: ["transit"], title: "The lost tourist", text: "A tourist with a paper map is asking for the studios. You're going that way.", opts: [
    { k: "walk", label: "Walk them there", ok: { energy: -2, stress: -1 }, t: "They're a retired projectionist on a pilgrimage. You hear about the night the print caught fire in 1974." },
    { k: "point", label: "Point them in the right direction", ok: {}, t: "They thank you. You'll never know how it went." }] },
  { id: "lr_phone", v: ["transit"], title: "Overheard", text: "Two people in suits on the tram are loudly discussing a film that's about to lose its director.", teach: "Productions change directors more often than people think; the news usually travels through crews days before the trades.", opts: [
    { k: "use", label: "File it away", check: ["tas", 11], ok: { stand: .2 }, bad: {}, t: "Two days later it's in the trades. You knew first, and you said so to exactly the right person.", tb: "You mention it to someone. It turns out to be wrong." },
    { k: "ignore", label: "Mind your own business", ok: {}, t: "Gossip is cheap. You've got your own day." }] },
  { id: "lr_bike2", v: ["bike", "scooter"], title: "The shortcut", text: "There's a shortcut through the studio backlot, technically for staff only.", opts: [
    { k: "take", label: "Take it", ok: { risk: .25, energy: 2 }, t: "Through a fake Western town and a fake New York street. You arrive early and delighted." },
    { k: "long", label: "Go the long way", ok: { energy: -2 }, t: "Ten minutes longer. No security guard yelling at you." }] },
  { id: "lr_bike3", v: ["bike", "scooter"], title: "The flat tyre", text: "A flat, a mile from anywhere, with a call time in thirty minutes.", opts: [
    { k: "fix", label: "Fix it at the roadside", check: ["eth", 11], ok: { flag: "reliable" }, bad: { stress: 3 }, t: "Greasy hands, on time. Nobody knows, but you do.", tb: "The patch won't hold. You walk the last mile, late." },
    { k: "cab", label: "Leave it and grab a cab", ok: { cash: -25 }, t: "Expensive. On time." }] },
  { id: "lr_car2", v: ["car", "van"], title: "The car pool", text: "Two crew members who live near you ask if you'd drive them in each day.", opts: [
    { k: "yes", label: "Say yes", ok: { tie: { mates: 3 }, meet: 1, energy: -2 }, t: "Forty minutes a day of gossip about everyone on the crew. Invaluable." },
    { k: "no", label: "Say you like the quiet", ok: { stress: -1 }, t: "Your podcast and your thoughts. Fair enough." }] },
  { id: "lr_car3", v: ["car", "van"], title: "The parking ticket", text: "You park in the crew lot and come back to a ticket. The lot was for someone else's production.", opts: [
    { k: "appeal", label: "Talk to the lot attendant", check: ["cha", 11], ok: { cash: 0 }, bad: { cash: -60 }, t: "He waives it, and tells you which lot is yours.", tb: "He's heard it all before. You pay." },
    { k: "pay", label: "Pay it and move on", ok: { cash: -60 }, t: "An expensive lesson in reading call sheets properly." }] }
];
const LOW_LIFE = {
  hunt: [
    { id: "lj_unpaid", title: "The unpaid opportunity", text: "A listing offers 'exposure and a credit' for a month of full-time work on a feature.", teach: "Unpaid 'opportunities' are common at the bottom of the business; some lead somewhere, most just use people up. Unions and many cities now push back on them.", opts: [
      { k: "take", label: "Apply anyway: a credit is a credit", ok: { energy: -6, meet: 1, stand: .2 }, t: "It's a real film with real people. You'll be broke, and you'll be on set." },
      { k: "pass", label: "Pass: your time is worth something", ok: { stress: -1 }, t: "You keep looking. Someone else will take it." }] },
  	{ id: "lj_ghosted", title: "Ghosted", text: "The job you interviewed for last month has been filled. Nobody told you; you saw it online.", opts: [
      { k: "write", label: "Write a gracious note anyway", check: ["com", 10], ok: { refs: 1 }, bad: {}, t: "The coordinator replies: 'you were our second choice, I'll keep you in mind.' They do.", tb: "No reply. But you feel better." },
      { k: "vent", label: "Vent about it online", ok: { stress: -2, stand: -.3 }, t: "It feels great for an hour. Someone screenshots it." }] },
    { id: "lj_typo", title: "The typo", text: "You notice a glaring typo in the cover letter you sent to five places this morning.", opts: [
      { k: "fix", label: "Resend with a short apology", check: ["com", 10], ok: {}, bad: { stress: 2 }, t: "One reply: 'appreciate the attention to detail.' Ha.", tb: "Two people now have both versions." },
      { k: "leave", label: "Leave it and hope", ok: { stress: 1 }, t: "Nobody mentions it. Probably nobody read that far." }] },
    { id: "lj_board", title: "The noticeboard", text: "A handwritten note on the café board: 'Need a runner, horror short, this weekend, pizza provided.'", opts: [
      { k: "call", label: "Call the number", ok: { energy: -8, meet: 2, xp: { eth: .05 } }, t: "A barn, fake blood, a director who is nineteen and brilliant. You'll work together again." },
      { k: "skip", label: "Leave it for someone hungrier", ok: {}, t: "Somebody tears off the last tab by lunchtime." }] },
    { id: "lj_referral", title: "Can I use your name?", text: "{contact} offers to let you mention them on an application.", opts: [
      { k: "yes", label: "Yes, gratefully", ok: { refs: 1, due: { contact: 1 } }, t: "It opens a door. You owe them one now, and they know it." },
      { k: "no", label: "Thank them, but stand on your own", ok: { tie: { contact: 1 } }, t: "They respect it. You hope you don't regret it." }] },
    { id: "lj_spreadsheet", title: "The spreadsheet", text: "You've applied to sixty jobs this year. You could finally track them properly.", opts: [
      { k: "track", label: "Build the spreadsheet", check: ["eth", 10], ok: { xp: { eth: .05 }, stress: -1 }, bad: {}, t: "Colour-coded, with follow-up dates. You notice which companies always reply.", tb: "You make a beautiful header and nothing else." },
      { k: "wing", label: "Keep winging it", ok: {}, t: "Chaos, but familiar chaos." }] }
  ],
  network: [
    { id: "ln_corner", title: "The corner", text: "At the mixer you end up in a corner with someone who won't stop talking about their crypto film fund.", opts: [
      { k: "escape", label: "Escape gracefully", check: ["cha", 10], ok: { meet: 1 }, bad: { energy: -4 }, t: "A smile, a 'must grab a drink', and you're talking to an editor by the window instead.", tb: "Forty minutes on tokenised distribution. You'll never get them back." },
      { k: "listen", label: "Listen; maybe it's real", ok: { risk: .3 }, t: "It is not real. You give them your email, which is now on several lists." }] },
    { id: "ln_famous", title: "Someone famous", text: "A director you admire is at the bar, alone, looking at their phone.", opts: [
      { k: "approach", label: "Say one specific thing you loved about their work", check: ["cha", 13], ok: { meet: 1, stand: .3 }, bad: { stress: 3 }, t: "They light up, because nobody ever mentions that film. Twenty minutes later you've got an email address.", tb: "You gush. They nod politely and go back to their phone." },
      { k: "leave", label: "Leave them in peace", ok: {}, t: "You'll meet them properly one day, as a colleague." }] },
    { id: "ln_nametag", title: "The name tag", text: "Your name tag says the wrong name. Someone has been calling you 'Brenda' all night.", opts: [
      { k: "own", label: "Become Brenda", check: ["comic", 10], ok: { meet: 2, stress: -2 }, bad: {}, t: "By midnight half the room knows 'Brenda' and wants to work with them.", tb: "It's funny for exactly one conversation." },
      { k: "fix", label: "Get a new tag", ok: {}, t: "Order restored, mystery lost." }] },
    { id: "ln_rival", title: "Them again", text: "Someone from your film course is at the mixer, already working as a coordinator, and very keen to tell you so.", opts: [
      { k: "gracious", label: "Congratulate them and mean it", check: ["com", 11], ok: { meet: 1, stress: -1 }, bad: { stress: 2 }, t: "They soften, and tell you about a job going on their production.", tb: "It comes out a bit tight. They notice." },
      { k: "compete", label: "Match their story with yours", ok: { stress: 2, stand: .1 }, t: "A small, pointless contest. You both lose." }] },
    { id: "ln_card", title: "The business card", text: "A producer hands you a business card and says 'call me'. Their assistant rolls their eyes.", opts: [
      { k: "assistant", label: "Talk to the assistant instead", check: ["cha", 10], ok: { meet: 1, tie: { contact: 1 } }, bad: {}, t: "The assistant is funny, sharp and actually reads the emails. Better contact.", tb: "The assistant has heard every pitch twice." },
      { k: "call", label: "Call the producer on Monday", ok: { stress: 1 }, t: "You get voicemail. Then voicemail. Then the assistant, who is lovely." }] }
  ],
  catchup: [
    { id: "lc_ask", title: "The favour", text: "Over coffee, {contact} asks if you'd read their script. It's a hundred and sixty pages.", opts: [
      { k: "read", label: "Read it properly and give notes", check: ["tas", 11], ok: { tie: { contact: 6 }, xp: { tas: .05 }, energy: -5 }, bad: { tie: { contact: -2 } }, t: "Your notes are kind and useful. They rewrite it and send you a thank-you card.", tb: "Your notes are honest. Too honest. Coffee is quieter next time." },
      { k: "skim", label: "Skim it and say something nice", ok: { tie: { contact: 1 } }, t: "They can tell. They don't say so." }] },
    { id: "lc_news", title: "Big news", text: "{contact} has just got their first big job, and you didn't.", opts: [
      { k: "happy", label: "Be happy for them", check: ["com", 10], ok: { tie: { contact: 5 } }, bad: { stress: 2 }, t: "You are, mostly. They promise to bring you onto the next one.", tb: "You say the right words. They don't quite land." },
      { k: "ask", label: "Ask if their production needs anyone else", ok: { tie: { contact: -1 }, refs: 1 }, t: "A little awkward, but it works: they put your name forward." }] },
    { id: "lc_gossip", title: "The gossip", text: "{contact} tells you something juicy about a producer you might work for.", opts: [
      { k: "keep", label: "Keep it to yourself", ok: { trust: { contact: 4 } }, t: "They notice you never repeat things. That's worth a lot." },
      { k: "share", label: "Pass it on to a friend", ok: { tie: { contact: -3 }, stress: -1, risk: .2 }, t: "It travels faster than you'd like." }] },
    { id: "lc_bill", title: "The bill", text: "{contact} forgot their wallet. Again.", opts: [
      { k: "pay", label: "Get this one", ok: { cash: -18, tie: { contact: 2 }, due: { contact: 1 } }, t: "They swear they'll get the next three." },
      { k: "split", label: "Ask them to send it later", ok: { tie: { contact: -1 } }, t: "They do, two weeks later, with a sheepish emoji." }] }
  ],
  hustle: [
    { id: "lh_wedding", title: "The wedding video", text: "A couple you served at the bar want you to film their wedding. Cash, this Saturday.", opts: [
      { k: "shoot", label: "Shoot it properly", check: ["comp", 10], ok: { cash: 300, xp: { comp: .08 }, energy: -10 }, bad: { cash: 150, energy: -10 }, t: "The first dance at golden hour. They cry when they see it. So do you, a bit.", tb: "The battery dies during the vows. They're very nice about it." },
      { k: "no", label: "Say you're not a wedding person", ok: {}, t: "They hire someone else. The bar tips stay the same." }] },
    { id: "lh_delivery", meetRole: "producer", title: "The delivery", text: "Your delivery drop is a film production office. They look desperate.", opts: [
      { k: "offer", label: "Mention you're looking for production work", check: ["cha", 11], ok: { meet: 1, refs: 1 }, bad: {}, t: "The coordinator takes your number. 'We lose a runner a week.'", tb: "They take the pizza and close the door." },
      { k: "drop", label: "Just drop it off", ok: { cash: 8 }, t: "A good tip. Back on the bike." }] },
    { id: "lh_rude", meetRole: "casting", title: "The rude customer", text: "A customer is rude to you all evening, then leaves a business card: they're a casting director.", opts: [
      { k: "call", label: "Call them anyway", check: ["com", 12], ok: { meet: 1 }, bad: { stress: 3 }, t: "On the phone they're charming. 'Oh God, was I awful? Bad day.' They call you in for a reader job.", tb: "They don't remember you, or pretend not to." },
      { k: "bin", label: "Bin the card", ok: { stress: -1 }, t: "Life's too short. Probably." }] },
    { id: "lh_extra", title: "Background work", text: "A friend says a TV shoot needs fifty extras tomorrow. It pays, and there's lunch.", teach: "Background actors are hired through specialist agencies; a day on set as an extra is how many crew first see how a set actually works.", opts: [
      { k: "go", label: "Do it, and watch the crew all day", ok: { cash: 120, xp: { setm: .05, tas: .05 }, energy: -8 }, t: "Twelve hours of standing in a fake bar. You learn more about how a set runs than in a month of reading." },
      { k: "no", label: "Keep your shift", ok: { cash: 60 }, t: "Reliable money beats a free lunch." }] },
    { id: "lh_quit", title: "The manager", text: "Your manager says you can have the shift you need off for a job interview only if you work every weekend for a month.", opts: [
      { k: "deal", label: "Take the deal", ok: { energy: -10, stress: 2 }, t: "You go to the interview. You also don't see a weekend until next month." },
      { k: "push", label: "Push back", check: ["cha", 12], ok: { stress: -1 }, bad: { stress: 3, cash: -60 }, t: "They give in: 'fine, just this once.' They'll remember you held your ground.", tb: "They cut your hours to make a point." }] }
  ],
  train: [
    { id: "lt_teacher", title: "The teacher's offer", text: "Your teacher says they need an assistant on a short they're shooting next month. Unpaid.", opts: [
      { k: "yes", label: "Say yes", ok: { meet: 1, tie: { contact: 3 }, energy: -6 }, t: "You spend a month watching someone very good at their job. Best class you never paid for." },
      { k: "no", label: "Say you can't afford to", ok: {}, t: "They understand. They ask the student next to you." }] },
    { id: "lt_partner", title: "The group project", text: "You're paired with the class's most difficult student for the final project.", opts: [
      { k: "win", label: "Win them over", check: ["col", 11], ok: { meet: 1, xp: { col: .08 } }, bad: { stress: 3 }, t: "Turns out they're difficult because they care. Your project is the best in the class.", tb: "You do all the work. They take all the credit at the screening." },
      { k: "solo", label: "Quietly do it yourself", ok: { energy: -6, xp: { eth: .05 } }, t: "Done, and done well. Lonely, though." }] },
    { id: "lt_kit", title: "Borrowed kit", text: "The school lets you borrow a camera kit for the weekend, if you sign for it.", opts: [
      { k: "shoot", label: "Shoot something", check: ["comp", 10], ok: { xp: { comp: .08, vstory: .05 } }, bad: { cash: -80 }, t: "Two days of shooting your neighbourhood at dawn. Some of it is beautiful.", tb: "A lens cap goes missing. You pay for it." },
      { k: "pass", label: "Don't risk it", ok: {}, t: "The kit stays in its case. So does your idea." }] },
    { id: "lt_crit", title: "The critique", text: "The class watches your exercise. Someone says it's 'derivative'.", opts: [
      { k: "listen", label: "Ask what they mean", check: ["com", 10], ok: { xp: { orig: .08 } }, bad: { stress: 3 }, t: "They're right, and specific. Your next one is yours.", tb: "You get defensive. The room goes quiet." },
      { k: "shrug", label: "Shrug it off", ok: {}, t: "Everything is derivative. You think." }] }
  ],
  out: [
    { id: "lo_karaoke", title: "Karaoke", text: "The crew have gone to karaoke and someone has put your name down for a power ballad.", opts: [
      { k: "sing", label: "Commit completely", check: ["pres", 10], ok: { tie: { mates: 4 }, stress: -4, meet: 1 }, bad: { tie: { mates: 2 } }, t: "Key change, knee slide, standing ovation. You are a legend now.", tb: "It's bad. It's so bad it's good. People are kind." },
      { k: "no", label: "Hide in the toilets", ok: { stress: 1 }, t: "They sing it for you, with your name, very loudly." }] },
    { id: "lo_ex", title: "The ex", text: "Your ex is at the bar, with someone who works in the business.", opts: [
      { k: "hello", label: "Go and say hello", check: ["com", 11], ok: { meet: 1, stress: -1 }, bad: { stress: 4 }, t: "It's fine. Better than fine: their new partner is a line producer, and nice.", tb: "It's awkward. You leave early." },
      { k: "leave", label: "Find another bar", ok: {}, t: "There are other bars." }] },
    { id: "lo_quiz", title: "Pub quiz", text: "Your team is one point behind going into the film round.", opts: [
      { k: "carry", label: "Carry the film round", check: ["tas", 11], ok: { stress: -3, tie: { contact: 2 } }, bad: {}, t: "You get the 1940s cinematographer nobody else knew. Victory, and a bar tab.", tb: "You're sure it was 1962. It was 1963." },
      { k: "relax", label: "Just enjoy it", ok: { stress: -2 }, t: "You come fourth. The chips were great." }] },
    { id: "lo_rooftop", title: "The rooftop", text: "A friend's rooftop party. A stranger says they're 'between projects', which means they could be anyone.", opts: [
      { k: "curious", label: "Ask what the last project was", check: ["cha", 10], ok: { meet: 1 }, bad: {}, t: "They produced a film you loved. They're also between projects because they're very tired. You talk till 2 a.m.", tb: "It was a corporate video about insurance. They talk about it for an hour." },
      { k: "view", label: "Enjoy the view", ok: { stress: -3 }, t: "The city all lit up. You're here. That's something." }] },
    { id: "lo_fight", title: "The argument", text: "A friend gets into an argument with someone from a production you want to work on.", opts: [
      { k: "calm", label: "Calm it down", check: ["cha", 12], ok: { meet: 1, tie: { contact: 2 } }, bad: { tie: { contact: -3 } }, t: "Everyone shakes hands. The production person thanks you, and remembers your face.", tb: "Both of them end up annoyed with you." },
      { k: "side", label: "Back your friend", ok: { tie: { contact: 4 }, stand: -.3 }, t: "Your friend never forgets it. Neither does the production person." }] }
  ],
  home: [
    { id: "lhm_call", title: "The call home", text: "Your parent calls. They want to know when you'll get a 'proper job'.", opts: [
      { k: "explain", label: "Explain what you actually do", check: ["com", 10], ok: { stress: -2 }, bad: { stress: 2 }, t: "For the first time, they seem to get it. They ask to see your name in the credits.", tb: "It ends with 'well, as long as you're happy', which is worse." },
      { k: "change", label: "Change the subject", ok: {}, t: "You talk about the weather for twenty minutes. It's comforting, actually." }] },
    { id: "lhm_leak", title: "The leak", text: "Water is coming through the ceiling. Your landlord isn't answering.", opts: [
      { k: "fix", label: "Fix it yourself", check: ["prac", 10], ok: { stress: -1 }, bad: { cash: -80, stress: 3 }, t: "A bucket, a wrench and a video tutorial. Fixed.", tb: "You make it worse. The plumber is not cheap." },
      { k: "wait", label: "Put a bucket under it and wait", ok: { stress: 2 }, t: "Drip. Drip. Drip. All night." }] },
    { id: "lhm_cook", title: "Cooking for the flat", text: "Your flatmates are broke too. You could cook something big for everyone.", opts: [
      { k: "cook", label: "Make the big pot of something", ok: { cash: -15, stress: -3 }, t: "Five people round a too-small table. The best night of the month cost almost nothing." },
      { k: "alone", label: "Toast, alone, in your room", ok: { energy: 2 }, t: "Peace and quiet and toast." }] },
    { id: "lhm_old", title: "The old reel", text: "You find the first short you ever made on an old hard drive.", opts: [
      { k: "watch", label: "Watch it", ok: { stress: -1, xp: { tas: .04 } }, t: "It's terrible. Something in it is still yours, though. You know what to keep." },
      { k: "delete", label: "Delete it before anyone sees", ok: {}, t: "Gone. Nobody will ever know about the slow-motion pigeons." }] }
  ],
  read: [
    { id: "lr_classic", title: "The classic", text: "You finally watch the classic everyone quotes at you. It's three hours long.", opts: [
      { k: "watch", label: "Watch it all, properly", check: ["eth", 9], ok: { xp: { tas: .1 } }, bad: { energy: -3 }, t: "You get it now. Every film you've seen this year borrowed from it.", tb: "You fall asleep in the second hour and wake to the credits." },
      { k: "half", label: "Watch the famous bits online", ok: { xp: { tas: .03 } }, t: "You can quote it now. You still haven't seen it." }] },
    { id: "lr_trades", title: "The trades", text: "You read the trades cover to cover and spot a pattern: one producer is buying every horror script in town.", opts: [
      { k: "note", label: "Note the name", check: ["tas", 11], ok: { stand: .2 }, bad: {}, t: "When their next horror film is crewing up, you're first to apply.", tb: "Their next film is a musical." },
      { k: "skip", label: "Skip to the gossip", ok: { stress: -1 }, t: "Who is suing whom. Delicious." }] },
    { id: "lr_lend", title: "The borrowed book", text: "A book about a great editor's process, lent by {contact}, has been on your shelf for months.", opts: [
      { k: "read", label: "Read it and return it with a note", ok: { xp: { shape: .06 }, tie: { contact: 3 } }, t: "You learn a cutting trick and send a postcard with the book. They love the postcard." },
      { k: "keep", label: "Keep forgetting", ok: { tie: { contact: -1 } }, t: "They ask about it, gently, at the next party." }] }
  ],
  write: [
    { id: "lw_cafe", title: "The café writer", text: "The person at the next table is also writing a screenplay, and keeps glancing at yours.", opts: [
      { k: "swap", label: "Offer to swap ten pages", check: ["cha", 10], ok: { meet: 1, xp: { dial: .05 } }, bad: {}, t: "Their dialogue is better than yours; your structure is better than theirs. A writing group of two is born.", tb: "They'd rather not, and move tables." },
      { k: "hide", label: "Angle your laptop away", ok: {}, t: "Ideas are cheap, but still." }] }
  ],
  study: [
    { id: "ls_allnighter", title: "The deadline", text: "Your coursework is due at nine. It is midnight.", opts: [
      { k: "finish", label: "Finish it properly", check: ["eth", 11], ok: { energy: -12, xp: { eth: .06 } }, bad: { energy: -15, stress: 3 }, t: "Submitted at 8:58. It's good.", tb: "Submitted at 9:04. It's fine." },
      { k: "ask", label: "Ask for an extension", check: ["cha", 10], ok: {}, bad: { stress: 2 }, t: "Granted, with a raised eyebrow.", tb: "Denied. You submit what you've got." }] }
  ]
};
const LOW_WORK = {
  intern: [
    { id: "t_int_coffee", title: "Nineteen coffees", text: "The office wants nineteen coffees, all different, in fifteen minutes.", teach: "Interns and assistants are judged on small things done perfectly; remembering how the boss takes their coffee has started more careers than film school.", opts: [
      { k: "system", label: "Write a system on a napkin", check: ["eth", 10], ok: { tie: { head: 3 }, flag: "reliable" }, bad: { tie: { head: -1 } }, t: "Every cup right. Someone asks you to do it every day, which is both an honour and a curse.", tb: "Two oat milks went to the wrong people. One of them was the boss." },
      { k: "ask", label: "Ask a colleague to help carry", ok: { tie: { mates: 2 } }, t: "Teamwork. The coffee is lukewarm but everyone gets one." }] },
    { id: "t_int_meeting", title: "The meeting", text: "You're asked to take notes in a meeting where two executives disagree about everything.", opts: [
      { k: "neutral", label: "Write it down exactly, neutrally", check: ["com", 10], ok: { tie: { head: 4 }, trust: { head: 3 } }, bad: {}, t: "Both executives think your notes prove them right. Your boss is impressed.", tb: "Your notes are accurate. That's the problem." },
      { k: "side", label: "Quietly favour your boss's version", ok: { tie: { head: 2 }, flag: "fudger" }, t: "Your boss likes it. Someone else reads it closely." }] },
    { id: "t_int_lost", title: "The lost courier", text: "A courier with the director's cut on a hard drive has gone to the wrong building.", opts: [
      { k: "chase", label: "Run across town after it", check: ["eth", 11], ok: { tie: { head: 5 }, stand: .2, energy: -8 }, bad: { energy: -8 }, t: "You find the courier eating a sandwich two blocks away. Drive recovered. Legend status.", tb: "You run to the wrong wrong building." },
      { k: "phone", label: "Call the courier company", ok: { tie: { head: 1 } }, t: "It turns up at five. Nobody died." }] },
    { id: "t_int_credit", title: "Your idea", text: "An idea you mentioned in the kitchen comes up in a meeting, attributed to a junior executive.", opts: [
      { k: "say", label: "Say, lightly, that you'd floated it", check: ["cha", 12], ok: { stand: .3, tie: { head: 2 } }, bad: { tie: { head: -3 } }, t: "The boss looks at you differently. The junior executive does too, less kindly.", tb: "It comes out petty. Nobody is impressed." },
      { k: "let", label: "Let it go", ok: { stress: 1 }, t: "You'll have other ideas. You'll also write them down first." }] },
    { id: "t_int_phone", title: "Who's calling?", text: "A famous actor calls the office, and you're the only one at the desk.", opts: [
      { k: "pro", label: "Be calm and take a perfect message", check: ["com", 10], ok: { tie: { head: 3 } }, bad: { stress: 2 }, t: "Name, number, time, mood. Your boss reads it and says 'good'.", tb: "You say 'I love your work'. Twice." },
      { k: "chat", label: "Chat a little", check: ["cha", 13], ok: { meet: 1 }, bad: { tie: { head: -2 } }, t: "They're bored and lonely; you talk for five minutes. They ask for you next time.", tb: "Too familiar. They ask for your boss, frostily." }] }
  ],
  set: [
    { id: "t_set_lunch", title: "Lunch line", text: "The lunch line is long, and a senior crew member cuts in front of you.", opts: [
      { k: "let", label: "Let it go", ok: {}, t: "Hierarchy has its own logic on set. You get the last of the lasagne." },
      { k: "joke", label: "Make a joke of it", check: ["comic", 11], ok: { tie: { mates: 3 }, meet: 1 }, bad: { tie: { mates: -1 } }, t: "They laugh, and save you a seat. They turn out to be the gaffer.", tb: "They don't laugh." }] },
    { id: "t_set_lost", title: "The lost prop", text: "The hero's watch, needed in the next shot, is missing. Everyone is looking at the PAs.", opts: [
      { k: "search", label: "Search methodically", check: ["eth", 10], ok: { tie: { head: 4 } }, bad: { stress: 3 }, t: "In the lead actor's trailer, in a coffee cup. You found it. Your name is known now.", tb: "Someone else finds it in a coffee cup." },
      { k: "prop", label: "Tell the props team straight away", ok: { tie: { head: 2 } }, t: "They have a spare. Of course they have a spare." }] },
    { id: "t_set_fan", title: "The fan", text: "A fan has slipped past the barrier and is heading for the lead actor.", opts: [
      { k: "steer", label: "Steer them away kindly", check: ["cha", 10], ok: { tie: { head: 3, lead: 2 } }, bad: { stress: 2 }, t: "They get an autograph through a PA (you) and leave delighted.", tb: "They get to the actor anyway. Security is not pleased with you." },
      { k: "radio", label: "Radio security", ok: { tie: { head: 1 } }, t: "Security handles it. It takes a while." }] }
  ],
  office: [
    { id: "t_off_cc", title: "Reply all", text: "Someone has replied all to the whole company with something they shouldn't have.", opts: [
      { k: "nothing", label: "Say nothing, delete it", ok: { trust: { head: 2 } }, t: "The office splits into people who forwarded it and people who didn't. You stay out of it." },
      { k: "forward", label: "Forward it to a friend", ok: { risk: .3, stress: -1 }, t: "Your friend loves it. IT keeps logs." }] },
    { id: "t_off_desk", title: "The desk", text: "Your boss's desk is chaos. They ask if you can 'just tidy it a bit'.", opts: [
      { k: "system", label: "Organise it into a system", check: ["eth", 11], ok: { tie: { head: 4 }, flag: "reliable" }, bad: { tie: { head: -2 } }, t: "They find a contract they thought was lost. You are now indispensable.", tb: "They can't find anything now. 'It was chaos, but it was my chaos.'" },
      { k: "light", label: "Just stack the paper neatly", ok: {}, t: "Neat chaos. Acceptable chaos." }] }
  ],
  cinema: [
    { id: "t_cin_late", title: "The latecomer", text: "Twenty minutes into the film, a man insists on being shown to his seat in the middle of a row.", opts: [
      { k: "torch", label: "Torch him in discreetly", check: ["com", 10], ok: { stress: -1 }, bad: { stress: 2 }, t: "Silent, efficient, invisible. A woman in row G gives you a tiny thumbs up.", tb: "He stands on four sets of toes. Someone complains to the manager about you." },
      { k: "aisle", label: "Seat him on the aisle instead", ok: {}, t: "He sulks. Everyone else is grateful." }] },
    { id: "t_cin_critic", title: "The critic", text: "A well-known critic comes in for the matinee every week and always sits in the same seat.", opts: [
      { k: "save", label: "Keep their seat free for them", ok: { meet: 1 }, t: "Three weeks later they ask your name. Then what you thought of the film. They listen." },
      { k: "nothing", label: "Treat them like anyone else", ok: {}, t: "First come, first served. They sit somewhere else and are fine about it." }] }
  ]
};
for (const s of LOW_ROAD) { ROAD_SCENES.push(s); SCENES.push(Object.assign({ event: 1, jobs: [] }, s)); }
for (const k in LOW_LIFE) { (LIFE_SCENES[k] = LIFE_SCENES[k] || []).push(...LOW_LIFE[k]); for (const s of LOW_LIFE[k]) SCENES.push(Object.assign({ event: 1, jobs: [] }, s)); }
for (const fam in LOW_WORK) { (ROLE_SCENES[fam] = ROLE_SCENES[fam] || []).push(...LOW_WORK[fam]); for (const s of LOW_WORK[fam]) SCENES.push(Object.assign({ role: fam, jobs: [] }, s)); }
