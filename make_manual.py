#!/usr/bin/env python3
"""Build manual.html from manualGroups and manualSections in index.html.

Run after changing the manual text in index.html (before make_app_files.py):
    python3 make_manual.py
"""
import html
import json
import re

source = open('index.html', encoding='utf-8').read()


def constant(name):
    start = source.index('const ' + name + '=') + len('const ' + name + '=')
    end = source.index(';\n', start)
    return json.loads(source[start:end])


sections = dict((title, lines) for title, lines in constant('manualSections'))
groups = constant('manualGroups')
web = re.search(r'<title>BenKen Stage Pro · V(26\.\d+)', source).group(1)
native = re.search(r'the native app V(\d+\.\d+)', source)
native = native.group(1) if native else ''

missing = set(sections) - {t for _, titles in groups for t in titles}
if missing:
    raise SystemExit('Chapters missing from manualGroups: ' + ', '.join(sorted(missing)))

e = lambda text: html.escape(text, quote=True)


def slug(text):
    text = {'Chord sheets, size and playback': 'chord-sheet-playback',
            'Create a song and import files': 'create-song-import'}.get(text, text)
    return re.sub(r'[^a-z0-9]+', '-', text.lower()).strip('-')


style = """<style>
:root{color-scheme:dark}
body{max-width:980px;margin:0 auto 40px;padding:0 24px;background:#081426;color:#edf3fb;font:18px/1.7 system-ui,-apple-system,sans-serif}
h1{color:#e5ad83;font-size:clamp(30px,5vw,46px);line-height:1.15;margin:0 0 8px}
.version{color:#9fb2c7;margin:0 0 36px}
a{color:#e5ad83}
.toc{display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:28px 36px;margin:0 0 56px}
.toc h2{font-size:13px;letter-spacing:1.2px;text-transform:uppercase;color:#9fb2c7;margin:0 0 8px;padding-bottom:6px;border-bottom:1px solid #29445f}
.toc ol{list-style:none;margin:0;padding:0}
.toc li{margin:0}
.toc a{display:block;padding:5px 0;text-decoration:none;line-height:1.35}
.toc a:hover,.toc a:focus-visible{text-decoration:underline}
.group-title{font-size:14px;letter-spacing:1.4px;text-transform:uppercase;color:#9fb2c7;margin:64px 0 0;padding-top:20px;border-top:2px solid #e5ad83}
section{margin:28px 0;padding-top:4px;scroll-margin-top:84px}
.group-title{scroll-margin-top:84px}
section h2{color:#e5ad83;font-size:24px;line-height:1.3;margin:0 0 6px}
section li{margin:10px 0}
.top{font-size:14px}
footer{margin:64px 0 40px;color:#9fb2c7;font-size:14px}
.backbar{position:sticky;top:0;z-index:5;margin:0 -24px 24px;padding:calc(env(safe-area-inset-top) + 10px) 24px 10px;background:rgba(8,20,38,.94);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);border-bottom:1px solid #29445f}
.backbar a{display:inline-flex;align-items:center;gap:8px;min-height:44px;padding:0 18px;border:1px solid #e5ad83;border-radius:12px;color:#e5ad83;text-decoration:none;font-weight:600;font-size:16px}
@media(max-width:600px){body{margin:0 auto 24px;font-size:17px}.toc{gap:22px}}
@media print{body{background:white;color:black;max-width:none}.toc,.top,.backbar{display:none}h1,section h2,a{color:black}.group-title{color:black;border-color:black}}
</style>"""

out = ['<!doctype html><html lang="en"><head><meta charset="utf-8">'
       '<meta name="viewport" content="width=device-width,initial-scale=1"><title>BenKen user manual</title>', style,
       '</head><body id="top"><div class="backbar"><a href="index.html">← Back to BenKen</a></div><h1>BenKen Stage Pro™ — User manual</h1>',
       f'<p class="version">Web V{web}' + (f' · Native app V{native}' if native else '') + '</p>',
       '<nav class="toc" aria-label="Contents">']
for group, titles in groups:
    out.append(f'<div><h2>{e(group)}</h2><ol>' +
               ''.join(f'<li><a href="#{slug(t)}">{e(t)}</a></li>' for t in titles if t in sections) + '</ol></div>')
out.append('</nav>')
for group, titles in groups:
    out.append(f'<h2 class="group-title" id="{slug("group " + group)}">{e(group)}</h2>')
    for title in titles:
        if title not in sections:
            continue
        lines = sections[title]
        body = f'<p>{e(lines[0])}</p>' if len(lines) == 1 else '<ol>' + ''.join(f'<li>{e(x)}</li>' for x in lines) + '</ol>'
        out.append(f'<section id="{slug(title)}"><h2>{e(title)}</h2>{body}<a class="top" href="#top">Back to contents ↑</a></section>')
out.append('<footer>Made for BenKen™ · Copyright © Kenneth Hjelle 2026</footer></body></html>\n')
open('manual.html', 'w', encoding='utf-8').write(''.join(out))
print('manual.html', sum(len(t) for _, t in groups), 'chapters in', len(groups), 'groups, web', web, 'native', native)
