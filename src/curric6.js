// ---------------- The curriculum, part six: programme projects ----------------
// The assessed projects a film-school year is built around, modelled on real MFA module structures
// (no-dialogue shorts, documentary "question" films, first-year films, graduation films, garment commissions...).
// [year, name, brief, [the call, [option, stat, outcome], ...]]
const CURR_MODS = {
  dir: [
    [1, 'Interpreting the scene', 'Shoot one scene from a set text with a cinematographer, AD, editor and sound team. You\'re marked on interpretation and on how you lead the team.', ['The set scene has been shot a hundred times by students before you.', ['Find a reading nobody else has tried', 'vstory', 'The tutors watch it twice.'], ['Do the classic version very well', 'stag', 'Solid, and forgotten by lunch.']]],
    [1, 'The no-dialogue short', 'A four-minute film with about 100 words of dialogue, two rolls of film, few actors and one location.', ['Your story needs a confession scene.', ['Stage the confession without words', 'vstory', 'The silence is the scene everyone remembers.'], ['Spend your words there', 'dial', 'It works; the rest of the film has none left.']]],
    [1, 'First-year film', 'Ten to fifteen minutes from a first-year writer\'s script, with a full crew and a professional first AD.', ['The writer resists your changes.', ['Work through it scene by scene with them', 'cha', 'A better script and a lasting collaborator.'], ['Rewrite it on the shoot', 'vstory', 'Your film, and a writer who won\'t work with you again.']]],
    [2, 'The digital fiction', 'A fifteen-minute film on a small crew and a small budget. Take risks and test your film language.', ['You have one big idea that could fail.', ['Try it', 'vstory', 'It\'s the clip on your reel.'], ['Play it safe', 'setm', 'Competent.']]],
    [3, 'Graduation film', 'Your largest school production, made for festivals and the industry showcase.', ['The film is ten minutes too long at the cut.', ['Cut your favourite scene', 'shape', 'The film flies.'], ['Keep it', 'vstory', 'Programmers stop watching at minute twelve.']]],
  ],
  wri: [
    [1, 'Three treatments', 'Develop three original short-film treatments from your own life and passions; directors and producers choose one.', ['A producer loves your weakest idea.', ['Make the case for your strongest', 'pres', 'They come round.'], ['Go with it', 'cha', 'You spend a year on your third-best idea.']]],
    [1, 'The two-hander for the stage', 'A ten-minute play for two actors, rehearsed with a professional director and performed at a new-writing venue.', ['The director wants to cut your ending.', ['Try it their way in rehearsal', 'dial', 'You find a better ending than either.'], ['Refuse', 'struc', 'Your ending stays; the audience are puzzled.']]],
    [2, 'The pilot', 'Storylines, a scene-by-scene outline, then a first and second draft of a TV pilot.', ['Your tutor says the pilot has no engine.', ['Rebuild the premise', 'struc', 'It becomes a series.'], ['Polish the dialogue', 'dial', 'Beautiful dialogue in a one-off.']]],
    [3, 'The feature and the bible', 'A feature screenplay in three drafts, plus a second pilot and a series bible for the portfolio, delivered to deadlines.', ['A deadline arrives and draft two isn\'t right.', ['Deliver on time with a note of what\'s next', 'tas', 'Professional, and the tutors notice.'], ['Ask for another week', 'struc', 'Better pages, and a reputation for being late.']]],
  ],
  tv: [
    [2, 'IP for high-end TV', 'Partner with a producer to turn a book or true story into a series proposal with an episode outline, pitched to commissioners.', ['The commissioners want it set in the present day.', ['Find the modern version of the story', 'adapt', 'It sells.'], ['Keep the period', 'world', 'It\'s admired and passed on.']]],
    [3, 'The writers\' room term', 'The class runs as a writers\' room: everyone breaks everyone\'s pilot and writes their own.', ['Your pilot is broken by the room into something else.', ['Take the best of it back to your version', 'struc', 'Stronger, and still yours.'], ['Write the room\'s version', 'cha', 'Everyone likes it except you.']]],
  ],
  cam: [
    [1, 'Short tales', 'Make a short film in a tiny studio from a single word given by the tutors.', ['The word is "absence".', ['Light the empty space where someone was', 'light', 'Haunting.'], ['Show someone looking sad', 'col', 'Literal.']]],
    [1, 'The painting', 'Recreate a painting on the main stage with design and VFX: you match its light.', ['The window light in the painting is impossible.', ['Cheat it with a hidden source', 'light', 'Indistinguishable from the painting.'], ['Be truthful to physics', 'colour', 'Correct, and wrong.']]],
    [2, 'Lighting challenges on 35mm', 'A series of lighting challenges shot on 35mm film, each testing exposure, framing and movement.', ['You can\'t see the result until the rushes come back.', ['Trust your meter and your tests', 'light', 'The rushes look exactly as planned.'], ['Bracket every shot', 'speed', 'Safe, and you run out of stock.']]],
    [3, 'Graduation film', 'Seven shooting days, built sets, specialist lenses if you pitch for them, and you lead the camera and lighting crew.', ['You can have anamorphic lenses or a crane, not both.', ['Choose the one the story needs', 'eye', 'The look serves the film.'], ['The crane, for production value', 'move', 'Impressive moves in an ordinary-looking film.']]],
  ],
  edt: [
    [1, 'A moment of change', 'A three-week edit of a short documentary about someone experiencing a moment of change.', ['The moment of change wasn\'t filmed.', ['Build it from what came before and after', 'struc', 'The audience feels it happen.'], ['Explain it with a title card', 'speed', 'Clear and flat.']]],
    [1, 'The trims bin', 'A three-minute personal statement cut from 30 minutes of other films\' leftovers.', ['A shot is beautiful and fits nothing.', ['Build the piece around it', 'shape', 'It becomes the heart.'], ['Leave it out', 'rhythm', 'A tidy piece.']]],
    [2, 'The question documentary', 'Fifteen minutes about a question about the world, delivered coherent, watchable and on schedule.', ['The director wants to include everything they shot.', ['Show them a version that works', 'shape', 'They agree, in the end.'], ['Include it all', 'cha', 'An hour long and baggy.']]],
    [3, 'Four graduation films', 'Documentary, fiction, animation and science films, each with its own director and schedule.', ['Two schedules clash.', ['Plan both with the post supervisor', 'tas', 'Both films lock on time.'], ['Pull all-nighters', 'speed', 'Both films lock, and you get ill.']]],
  ],
  post: [
    [1, 'The full soundtrack', 'Take a turnover of a finished film and deliver a full soundtrack: dialogue edit, Foley, FX, atmospheres and music editing.', ['There\'s no production sound for one scene.', ['Rebuild it in Foley and ADR', 'sound', 'Nobody can tell.'], ['Score over it', 'score', 'It sounds like a music video.']]],
    [2, 'The mute short', 'Design and mix a full soundtrack for a silent live-action short, with your own time in the dubbing theatre.', ['You have one day in the dubbing theatre.', ['Pre-mix everything before you go in', 'tas', 'The day goes on the creative choices.'], ['Mix from scratch on the day', 'sound', 'You run out of time.']]],
    [3, 'Graduation mixes', 'Three weeks of tracklay and five days of mixing per graduation film, across documentary, fiction and animation.', ['A director wants silence where you built a huge sequence.', ['Try the silence', 'sdes', 'It\'s the strongest moment in the film.'], ['Fight for the sequence', 'sound', 'It goes in; the director never quite likes it.']]],
    [2, 'Post supervision', 'Run the post schedules of several graduation films sharing facilities.', ['Two films need the mix theatre the same week.', ['Re-plan by delivery date', 'tas', 'Both deliver.'], ['First come, first served', 'speed', 'One misses the showcase.']]],
  ],
  mus: [
    [1, 'Without images', 'Score an eight-to-ten-minute audio drama with writers and sound designers.', ['The scene is a long silence between two people.', ['Leave the silence alone', 'score', 'The silence speaks.'], ['Fill it with an underscore', 'orch', 'The tension drains away.']]],
    [1, 'The 36-hour score', 'Score a short pixilated animation in 36 hours.', ['You have an idea that needs live players.', ['Do it with what you can record yourself', 'speed', 'Done, and charming.'], ['Chase the players', 'orch', 'Brilliant, and late.']]],
    [2, 'Session day', 'Record your cues with professional session musicians in a world-class studio.', ['The first cue runs over time.', ['Simplify the next cues', 'tas', 'Everything recorded.'], ['Keep perfecting', 'orch', 'One perfect cue, three unrecorded.']]],
    [3, 'Graduation scores', 'Score the graduation films (documentary, fiction, animation, natural history) and a playable game.', ['The game designer wants music that never repeats.', ['Build layers and variations', 'score', 'It feels endless.'], ['Write one long track', 'speed', 'It repeats after twelve minutes.']]],
  ],
  des: [
    [1, 'The fantasy stage set', 'A paper project: design a fantasy set as if it were to be built on a large studio stage, with drawings and a model.', ['Your design wouldn\'t fit the stage.', ['Rework it to the stage plan', 'sets', 'Buildable, and still magical.'], ['Present it anyway', 'world', 'Gorgeous, and impossible.']]],
    [2, 'Foreign setting, historical period', 'Design a story set abroad, in another era: research, architecture, technical drawings and visuals.', ['Your research has gaps.', ['Find primary sources', 'period', 'Every detail holds up.'], ['Fill the gaps with invention', 'world', 'Experts will wince.']]],
    [3, 'Summer fiction film', 'Design a fiction film with a substantial design element on a stage or location.', ['The location falls through a week out.', ['Rebuild it on the stage', 'sets', 'You save the shoot.'], ['Find any location', 'speed', 'It looks like a compromise.']]],
  ],
  cos: [
    [1, 'Fundamentals', 'Pattern cutting, draping, tailoring and script breakdowns, brought to a professional standard.', ['Your breakdown misses a costume change.', ['Recheck the script page by page', 'cont', 'You find two more.'], ['Fix it when it comes up', 'speed', 'It comes up on the shoot day.']]],
    [2, 'The year-long garment', 'Draw a scenario card and build a screen-ready garment from concept to finish over the year.', ['Your fabric runs out halfway.', ['Re-source and adapt the design', 'wardrobe', 'A better garment.'], ['Piece it together', 'speed', 'The seam shows on camera.']]],
    [3, 'Head of costume', 'Lead the costume department on a graduation film, with minimal supervision.', ['The director changes the period two weeks out.', ['Re-plan with the team that afternoon', 'tas', 'You deliver.'], ['Push back hard', 'cha', 'The director goes round you.']]],
  ],
  pro: [
    [1, 'Schedule and budget', 'Break down a feature script, schedule it in scheduling software and budget it.', ['The budget comes out double the target.', ['Rewrite the schedule, then the budget', 'bud', 'You get it down without losing the film.'], ['Cut every line by half', 'fin', 'A budget nobody believes.']]],
    [2, 'First-year film', 'Develop, budget, schedule, produce and deliver a short fiction film.', ['A location owner asks for twice the fee on the day.', ['Negotiate calmly, with a backup ready', 'bud', 'You pay a little more and keep the day.'], ['Pay it', 'fin', 'You pay it, and word spreads.']]],
    [3, 'The business dossier', 'Present the full financing, sales and distribution plan for your own development project to an industry panel.', ['The panel calls your sales estimates optimistic.', ['Show the comparable films', 'mkt', 'They accept the numbers.'], ['Defend them on instinct', 'pres', 'They don\'t.']]],
  ],
  doc: [
    [1, 'Observation scene', 'Research, shoot and edit a single observational scene, without interfering.', ['Your subject performs for the camera.', ['Keep filming until they forget it', 'eye', 'They do.'], ['Use the performance', 'cha', 'Charming and false.']]],
    [2, 'The question film', 'A 15-20 minute documentary answering a question about the world, on schedule and on budget.', ['A contributor withdraws after filming.', ['Respect it and rebuild', 'eth', 'A harder edit, and a clear conscience.'], ['Use the footage anyway', 'struc', 'A better film and a complaint.']]],
    [3, 'Graduation documentary', 'Twenty to forty minutes that give revealing insight into a contemporary issue.', ['The story turns dangerous for your subject.', ['Protect them and change the plan', 'eth', 'The film is braver for it.'], ['Keep going', 'eye', 'A great film, at a cost.']]],
  ],
  anim: [
    [1, 'Ideas to animatic', 'A mission statement, storyboards and an animatic cut with an editor.', ['The editor\'s cut changes your story.', ['Watch it fresh, then decide', 'struc', 'Theirs is better in places.'], ['Restore your boards', 'digi', 'Your version, a little slow.']]],
    [2, 'The character film', 'Design characters from traits, pair them at random, record actors and animate a meeting.', ['The random pairing makes no sense.', ['Find the comedy in it', 'comic', 'The audience loves it.'], ['Ask for a new pairing', 'cha', 'Denied.']]],
    [3, 'Graduation animation', 'Greenlit on the animatic; animated for six months with fortnightly reports; seven days in the dubbing theatre.', ['You\'re behind with two months to go.', ['Simplify the remaining shots', 'tas', 'Finished and festival-ready.'], ['Keep the ambition and crunch', 'digi', 'Brilliant shots, and some unfinished.']]],
  ],
  ad: [
    [1, 'Trainee assignment', 'Placed on a production by the scheme; evaluated in writing by the ADs and production manager.', ['You\'re given background to run on day one.', ['Ask the 2nd AD exactly what they need', 'setm', 'The crowd moves on cue.'], ['Improvise', 'speed', 'The crowd walks through the shot.']]],
    [2, 'Production management', 'Schedule, budget and keep safe a documentary or fiction production.', ['A storm is forecast for the beach day.', ['Swap in the cover set', 'setm', 'A full day shot.'], ['Risk it', 'speed', 'Half a day lost.']]],
    [3, 'Second AD placement', 'Run call sheets and actors on a real production.', ['An actor will be late and the first scene needs them.', ['Re-order the morning with the 1st', 'setm', 'Nobody waits.'], ['Wait for them', 'cha', 'An hour lost.']]],
  ],
  act: [
    [1, 'Scene study', 'Work through scenes with a partner, presented to the class for notes.', ['Your partner hasn\'t learned the lines.', ['Run lines with them at lunch', 'cha', 'The scene comes alive.'], ['Carry the scene yourself', 'range', 'You look good; the scene doesn\'t.']]],
    [2, 'Showcase', 'A showcase of scenes for agents and casting directors.', ['You can pick a showy monologue or a quiet scene.', ['The scene that shows who you are', 'range', 'An agent calls.'], ['The showy monologue', 'pres', 'Applause and no calls.']]],
  ],
  vfx: [
    [1, 'The set extension', 'Extend a stage set from the painting workshop so it looks like a real place.', ['The plate has camera shake.', ['Track it properly', 'digi', 'Locked solid.'], ['Stabilise the shot', 'speed', 'It looks stabilised.']]],
    [3, 'Graduation VFX', 'Deliver the VFX shots for graduation films, from pipeline tests to final comps.', ['Six shots are due and you can only finish four well.', ['Talk to the editor about cutting two', 'tas', 'Four great shots.'], ['Do all six roughly', 'speed', 'Six shots that look like VFX.']]],
  ],
  col: [
    [2, 'Grading the graduation films', 'Grade the final films with each director and DP.', ['The director and DP disagree about the look.', ['Grade both versions of a scene', 'col', 'They agree on a third.'], ['Take the DP\'s side', 'colour', 'The director signs off unhappy.']]],
  ],
  mkp: [
    [2, 'The ageing make-up', 'Age an actor forty years for a graduation film.', ['The make-up takes four hours and the call is at six.', ['Pre-make pieces and rehearse the application', 'mkup', 'Two hours, and it holds.'], ['Start at two in the morning', 'speed', 'Done, and the actor is exhausted.']]],
  ],
  stage: [
    [2, 'The rehearsed reading', 'A new play rehearsed for a week and read for an invited audience.', ['The audience laughs in the wrong place.', ['Find out why and rewrite', 'dial', 'The next reading is a different play.'], ['Tell the actors to play it straighter', 'stag', 'Still laughing.']]],
  ],
  pod: [
    [1, 'The audio feature', 'An eight-to-ten-minute audio drama with writers, sound designers and composers.', ['The script has a car chase.', ['Tell it through sound and breath', 'sdes', 'Thrilling in your ears.'], ['Have someone describe it', 'dial', 'Like a radio commentary.']]],
  ],
  creator: [
    [1, 'The five-minute game', 'A playable mobile game built around one mechanic, with a maximum of five minutes of play.', ['Players don\'t finish it.', ['Watch where they stop and fix that', 'digi', 'They finish and play again.'], ['Make it shorter', 'speed', 'Shorter, still confusing.']]],
  ],
};
for (const f in CURR_MODS) if (CURR[f]) CURR[f].mods = CURR_MODS[f];
