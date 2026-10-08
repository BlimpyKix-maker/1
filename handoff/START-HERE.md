# Apple Box: handoff package

Everything needed to keep working on Apple Box from a different Claude account (or no account at all).

In the GitHub repo these files sit in `handoff/`; `HANDOFF.md` and `index.html` are at the repo root. `apple-box.bundle` is only in the downloadable zip, since the repo already holds the full history.

## What's in here

| File | What it is |
|---|---|
| `index.html` | The game, current version. Open it in any browser to play; no internet or account needed. |
| `apple-box.bundle` | The whole project with its full history (189 commits, all source in `src/`, build tools, tests, data). A single-file git repository. |
| `HANDOFF.md` | The technical guide: how it's built, where everything lives, the rules that keep saves working, how to test. |
| `your-requests.md` | Every request you've made, word for word, in order. |
| `conversation-log.md` | The full conversation: your messages and Claude's replies, without the command output. |

## Getting the project onto a new account

**Option A: GitHub (easiest if the new account can reach the repo).**
The code is at `github.com/BlimpyKix-maker/1`, branch `claude/cool-sagan-4jiu5s`. Add the new account's GitHub user as a collaborator on that repo (or transfer or fork it), then start a Claude Code session on it.

**Option B: from this package (no GitHub access needed).**
1. Turn the bundle back into a normal project folder:
   `git clone apple-box.bundle apple-box`
2. Push it to a new GitHub repo the new account owns:
   `cd apple-box && git remote set-url origin https://github.com/<new-owner>/<new-repo>.git && git push -u origin --all`
3. Start a Claude Code session on that repo.

**To get a new shareable game link:** the current artifact link belongs to the original account. In the new account, ask Claude to publish `index.html` as an artifact (it uses the `sample` capability for "Read the pages").

## First message to paste into the new session

> This is Apple Box, a single-file film-industry life sim. Read HANDOFF.md first, then your-requests.md (my past requests, in order) and skim conversation-log.md for context. Edit src/*.js, build with `python3 tools/build.py`, run every test listed in HANDOFF.md before publishing, keep world generation deterministic, and never put real filmmaker or award names in trailers or taglines. Then continue with: <your next request>

(In the repo they're already at `handoff/your-requests.md` and `handoff/conversation-log.md`.)

## Note on saved games
Saved careers live in the browser's own storage, tied to the page address and device. They are not in this package. A new artifact link, or `index.html` opened from disk, starts with an empty Saves page. The game has no export button yet; ask the new session to add one if you want to carry a career across.
