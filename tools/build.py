#!/usr/bin/env python3
"""Inject src/*.js into index.html between their marker comments.
Run after editing any of them: python3 tools/build.py (and node tools/fill-build.js first after editing data/fill/)."""
import pathlib, re
root = pathlib.Path(__file__).resolve().parent.parent
html = (root / 'index.html').read_text()
for name, anchor in [('cat-fill', 'const CATALOGUES = ['),
                     ('portrait', '// ================= Apple Box — World Core UI ================='),
                     ('career-sim', '// ================= Apple Box — World Core UI ================='),
                     ('career-ui', '// ---------- render & routing ----------')]:
    body = (root / 'src' / f'{name}.js').read_text().rstrip() + '\n'
    block = f'// <{name}>\n{body}// </{name}>\n'
    pat = re.compile(rf'// <{name}>\n.*?// </{name}>\n', re.S)
    if pat.search(html):
        html = pat.sub(lambda m: block, html)
    else:
        assert anchor in html, anchor
        html = html.replace(anchor, block + anchor, 1)
(root / 'index.html').write_text(html)
print('built', len(html), 'bytes')
