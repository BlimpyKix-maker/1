// ---------------- About: credits, licences and sources (audit L12) ----------------
// What the page is built from and on whose terms: the typefaces and their licence, where the numbers come from,
// that every film, person, company and prize in the world is invented or renamed, and what the AI feature does.
// The long versions live in SOURCES.md and assets/FONT-LICENSES.txt in the project.
const ABOUT_FONTS = [['Barlow Condensed', 'The Barlow Project Authors'], ['Barlow', 'The Barlow Project Authors'], ['IBM Plex Mono', 'IBM Corp.']];
function aboutHTML() {
  const ai = typeof AI_PAGES !== 'undefined' && AI_PAGES;
  return `<div class="card"><h3>About this game</h3>
    <p>A life in the film business, from the first unpaid job to whatever you make of it. The world is simulated week by week and is the same for everyone who starts with the same seed.</p>
    <h4>A made-up world</h4>
    <p class="small">Every film, person, company, festival, prize, platform and brand in the game is invented, or renamed so that it isn't the real one. Film histories are retold in the game's own words; no real tagline, slogan or line of dialogue is used. Any resemblance to real events is how history went, retold; any resemblance to a real person's private life is accidental.</p>
    <h4>Where the numbers come from</h4>
    <p class="small">Box office shapes, fees, union scales, streaming payouts, renewal rates, recoupment odds and board practice are calibrated against public reports and trade sources, listed with links in the project's research notes. Only numbers are taken from them, never text.</p>
    <h4>Typefaces</h4>
    <p class="small">${ABOUT_FONTS.map(([n, by]) => `<b>${n}</b> by ${by}`).join(', ')}. All three are used under the SIL Open Font License 1.1 and travel inside the page; the game makes no outside requests.</p>
    <h4>AI</h4>
    <p class="small">${ai ? 'One optional feature, "Read the pages", asks an AI model to write a few pages of a script you are working on. Those pages are marked as AI-written, can be wrong or odd, and can be turned off on the script page. Nothing else in the game calls a model while you play.' : 'This build has no AI features: nothing in the game calls a model while you play.'}</p>
  </div>`;
}
OS_EXTRA.about = ['ℹ️', 'About', 'Credits, licences and sources'];
OS_VIEWS.about = () => aboutHTML();
{ const g = OS_GROUPS.find(x => x[0] === 'Learn'); if (g && !g[1].includes('about')) g[1].push('about'); }
