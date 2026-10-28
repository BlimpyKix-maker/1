// The writing library's table (Round 24). The fragment files (src/wlib-*.js) add to it; src/storyengine.js reads it.
// Format and rules: docs/WRITING-LIBRARY.md.
const WLIB = { T: {}, add(k, a) { const L = this.T[k] = this.T[k] || []; for (const e of a) L.push(e); } };
