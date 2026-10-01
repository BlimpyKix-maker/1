#!/usr/bin/env python3
"""Apply data/rename/{people,films,studios}.tsv (id <TAB> new name) to the catalogue in index.html.
People and studios set `n:`, films set `t:`. Entries are one per line inside each catalogue's
`studios: [`, `people: [` and `films: [` arrays (ids can repeat across kinds, so the array matters)."""
import pathlib, re
root = pathlib.Path(__file__).resolve().parent.parent
maps = {}
for kind in ['people', 'films', 'studios']:
    f = root / 'data' / 'rename' / f'{kind}.tsv'
    maps[kind] = dict(l.split('\t', 1) for l in f.read_text().splitlines() if l.strip() and '\t' in l) if f.exists() else {}
field = {'people': 'n', 'films': 't', 'studios': 'n'}
lines = (root / 'index.html').read_text().split('\n')
sec, count = None, {k: 0 for k in maps}
def q(s): return "'" + s.replace('\\', '\\\\').replace("'", "\\'") + "'"
strpat = r"""(?:'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")"""
for i, l in enumerate(lines):
    m = re.match(r'^(studios|people|films): \[', l)
    if m: sec = m.group(1); continue
    if l.startswith('],') or l.startswith('};') or l.startswith('const JOBS'): sec = None
    if not sec or not l.startswith('  { id: '): continue
    mid = re.match(r"^  \{ id: '([^']+)'", l)
    if not mid or mid.group(1) not in maps[sec]: continue
    new = maps[sec][mid.group(1)].strip()
    l2, n = re.subn(r'(, %s: )%s' % (field[sec], strpat), lambda mm: mm.group(1) + q(new), l, count=1)
    if n: lines[i] = l2; count[sec] += 1
(root / 'index.html').write_text('\n'.join(lines))
print('renamed', count, 'of', {k: len(v) for k, v in maps.items()})
