#!/usr/bin/env python3
"""Inject src/*.js into index.html between their marker comments.
Run after editing any of them: python3 tools/build.py (and node tools/fill-build.js first after editing data/fill/)."""
import pathlib, re
root = pathlib.Path(__file__).resolve().parent.parent
html = (root / 'index.html').read_text()
for name, anchor in [('cat-fill', 'const CATALOGUES = ['),
                     ('portrait', '// ================= Apple Box — World Core UI ================='),
                     ('real-looks', '// ================= Apple Box — World Core UI ================='),
                     ('home', '// ================= Apple Box — World Core UI ================='),
                     ('career-sim', '// ================= Apple Box — World Core UI ================='),
                     ('career-depth', '// ================= Apple Box — World Core UI ================='),
                     ('life', '// ================= Apple Box — World Core UI ================='),
                     ('life-scenes', '// ================= Apple Box — World Core UI ================='),
                     ('life-scenes-more', '// ================= Apple Box — World Core UI ================='),
                     ('life-scenes-third', '// ================= Apple Box — World Core UI ================='),
                     ('life-voice', '// ================= Apple Box — World Core UI ================='),
                     ('life-city', '// ================= Apple Box — World Core UI ================='),
                     ('life-scenes-low', '// ================= Apple Box — World Core UI ================='),
                     ('life-social', '// ================= Apple Box — World Core UI ================='),
                     ('life-world', '// ================= Apple Box — World Core UI ================='),
                     ('fiction', '// ================= Apple Box — World Core UI ================='),
                     ('trivia', '// ================= Apple Box — World Core UI ================='),
                     ('life-deals', '// ================= Apple Box — World Core UI ================='),
                     ('gea', '// ================= Apple Box — World Core UI ================='),
                     ('press', '// ================= Apple Box — World Core UI ================='),
                     ('companies', '// ================= Apple Box — World Core UI ================='),
                     ('life-phone', '// ================= Apple Box — World Core UI ================='),
                     ('computer', '// ================= Apple Box — World Core UI ================='),
                     ('city-plus', '// ================= Apple Box — World Core UI ================='),
                     ('strategy', '// ================= Apple Box — World Core UI ================='),
                     ('industry', '// ================= Apple Box — World Core UI ================='),
                     ('media', '// ================= Apple Box — World Core UI ================='),
                     ('computer2', '// ================= Apple Box — World Core UI ================='),
                     ('media-industry', '// ================= Apple Box — World Core UI ================='),
                     ('clippings', '// ================= Apple Box — World Core UI ================='),
                     ('mentor', '// ================= Apple Box — World Core UI ================='),
                     ('corrections', '// ================= Apple Box — World Core UI ================='),
                     ('cinema', '// ================= Apple Box — World Core UI ================='),
                     ('campaign', '// ================= Apple Box — World Core UI ================='),
                     ('cohort', '// ================= Apple Box — World Core UI ================='),
                     ('competitions', '// ================= Apple Box — World Core UI ================='),
                     ('consequence', '// ================= Apple Box — World Core UI ================='),
                     ('job-tasks', '// ================= Apple Box — World Core UI ================='),
                     ('feed', '// ================= Apple Box — World Core UI ================='),
                     ('life-story', '// ================= Apple Box — World Core UI ================='),
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
