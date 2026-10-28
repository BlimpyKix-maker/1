# The writing library

Round 24. The game writes every script, song, play, podcast and video from a fixed **story DNA** (`src/dna.js`) and a
library of hand-written fragments (`src/wlib-*.js`, `src/dnapools.js`). The library was written once and is committed;
nothing calls a model while you play. The engine (`src/storyengine.js`) picks fragments that fit a work's DNA and fills
their slots, so no two works read the same.

## Rules for every fragment

- Original writing only. No real person, company, brand, film, song, book, place-name pun on a real work, quotation,
  lyric, slogan or catch-phrase. No famous lines paraphrased. Generic real cities and ordinary places are fine.
- No names: people are always slots. No profanity stronger than "damn" / "hell". No slurs, no sexual content, no
  graphic gore (horror may be eerie and frightening, not gory).
- Specific and concrete beats vague: an object, a sound, a gesture. Short. A fragment should be usable in many works.
- Plain JavaScript string literals in single quotes; escape apostrophes as `\'`. Lines in a multi-line fragment are
  separated by `\n`.

## Fragment format

Each library file pushes arrays onto a shared table:

```js
WLIB.add('kind', [
  ['genres', 'tones', 'tag', level, 'text'],
  ...
]);
```

- `genres`: `'*'` or a comma list from: Drama, Comedy, Crime, Thriller, Horror, Action, Martial arts, Western, Romance,
  Musical, Sci-fi, Fantasy, War, Period, Documentary, Animation, Superhero.
- `tones`: `'*'` or a comma list from: light, bittersweet, dark, absurd, tense.
- `tag`: what the fragment is for (each kind lists its tags below).
- `level`: craft level. 1 = clumsy / on the nose (what a beginner writes), 2 = competent, 3 = sharp, subtext,
  surprising. Use 0 where craft level does not apply. Aim for roughly 25% level 1, 40% level 2, 35% level 3.

## Slots

| Slot | Means | Example fill |
|---|---|---|
| `{H}` | the hero's first name | Mara |
| `{R}` | the opponent's name (a person) | Victor |
| `{A}` | the ally / friend / love interest's name | June |
| `{he}` `{him}` `{his}` `{He}` `{His}` | the hero's pronouns | she, her, her |
| `{rhe}` `{rhim}` `{rhis}` `{Rhe}` | the opponent's pronouns | he, him, his |
| `{JOB}` | the hero's job, no article | night nurse |
| `{PLACE}` | the work's main place, with article | the ferry office |
| `{CITY}` | the city or town | Lisbon |
| `{OBJ}` | the signature object, with article | the brass compass |
| `{LOSS}` | who or what the hero lost, with possessive or article | {his} brother / the farm |
| `{WANT}` | what the hero wants, verb phrase | get the farm back |
| `{TIME}` | DAY / NIGHT / DAWN / DUSK (sluglines only) | NIGHT |
| `{YEARS}` | a span of time in words | eleven years |

Use only these slots. A fragment does not need any slot.

## Kinds (who writes what)

### Screen (`src/wlib-screen.js`)
- `open` (tag `open`): the opening action paragraph of a scene, 1–3 sentences, present tense, screenplay style.
  May start with a slugline line `INT. ... – {TIME}` or `EXT. ... – {TIME}`, using `{PLACE}` in caps form is NOT
  possible, so write sluglines with a generic location that fits the genre (e.g. `INT. STAIRWELL – {TIME}`), or omit.
- `action` (tag `action`): a single action line in the middle of a scene.
- `button` (tag `button`): the last beat of a scene: an action line or one line of dialogue (`H: ...`).

### Dialogue (`src/wlib-dialogue.js`)
- `exch` (tags: `setup`, `conflict`, `reveal`, `turn`, `payoff`, `breather`): an exchange of 3–7 lines.
  Each line starts with a speaker code: `H:` the hero, `R:` the opponent, `A:` the ally. An optional parenthetical
  follows the code: `H: (not looking up) You're late.` A line starting `>` is an action line. Exchanges between
  H and A, or H and R. Level 1 says the feeling out loud; level 3 says it sideways.

### Songs (`src/wlib-song.js`)
- `lyric` (tags `verse`, `chorus`, `bridge`, `hook`): one lyric line (`hook` = a short title-able phrase of 2–5 words
  that a chorus can repeat). Genres field: use `'*'`. Tones field = mood: light, bittersweet, dark, absurd, tense.
  Put the theme in the tag after a dot: `verse.love`, `chorus.freedom`, `hook.memory` (themes: family, power, love,
  memory, identity, justice, survival, faith, ambition, freedom, loneliness, revenge).

### Stage, podcasts, video (`src/wlib-other.js`)
- `stage` (tags `open`, `direction`, `mono`): play openings (stage directions), mid-play directions, and monologue
  fragments of 2–4 sentences spoken by `{H}` (written as plain text, no speaker code).
- `pod` (tags `format`, `hook`, `arc`): a podcast show format sentence, an episode hook, a season arc sentence.
  Use `{H}` as the host and `{CITY}` freely.
- `vid` (tags `format`, `hook`): an online video's format and its opening hook line spoken to camera.
- `num` (tags `open`, `want`, `eleven`, `finale`): musical numbers described in one sentence (the opening number, the
  "I want" song, the eleven o'clock number, the finale).

### Reception (`src/wlib-reception.js`)
- `note` (tags `good.<trait>` / `bad.<trait>`): a script reader's note, one or two sentences, second person
  ("Your…"). Traits: `hero`, `foe`, `world`, `incident`, `mid`, `end`, `theme`, `image`, `trick`, `dialogue`,
  `structure`.
- `crit` (tags `good.<trait>` / `bad.<trait>`, same traits plus `cast`, `look`, `score`): a critic's line about a
  finished film, play or record, third person, may use slots.
- `vo` (tag `vo`): a trailer voice-over line (`In a world…`-style clichés are fine only at level 1).
- `speech` (tags `thanks`, `story`, `close`): a fragment of an awards acceptance speech by `{H}` (the winner).

Tricks (structures) and endings are keys the reception lines may name: tricks `backwards`, `onenight`, `oneroom`,
`twotimes`, `mosaic`, `framed`, `unreliable`, `letters`, `chapters`, `longtake`, `dream`, `circular`, `linear`;
endings `triumph`, `pyrrhic`, `bittersweet`, `tragic`, `open`, `ironic`, `reunion`, `escape`. For `good.trick` /
`bad.trick` lines, put the trick key after a second dot: `good.trick.backwards`. For `good.end` / `bad.end`, the
ending key: `good.end.pyrrhic`.
