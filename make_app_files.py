#!/usr/bin/env python3
"""Writes app-files.json: the web files the native app needs (from sw.js ASSETS), with size and SHA-256.
The app downloads a new version only when every file matches this list. Run before each publish."""
import hashlib, json, re, sys, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
sw = open('sw.js').read()
assets = json.loads('[' + re.search(r"const ASSETS=\[(.*?)\];", sw, re.S).group(1).replace("'", '"') + ']')
version = re.search(r"<title>BenKen Stage Pro · V(\d+\.\d+)", open('index.html').read()).group(1)
files = []
for a in assets:
    p = a[2:] if a.startswith('./') else a
    if not p: continue
    data = open(p, 'rb').read()
    files.append({'path': p, 'size': len(data), 'sha256': hashlib.sha256(data).hexdigest()})
json.dump({'version': version, 'files': files}, open('app-files.json', 'w'), indent=1)
print('app-files.json', version, len(files), 'files', sum(f['size'] for f in files), 'bytes')
