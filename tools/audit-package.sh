#!/bin/sh
# Audit the built page-style zip: only manifest/css/fonts/licences; no JS, no network references in CSS; no API permissions.
set -e
z=$(ls -t dist/*.zip | head -1); echo "auditing $z"
bad=$(unzip -Z1 "$z" | grep -vE '^(manifest\.json|claude\.css|LICENSE|fonts/|icons/|fonts/[A-Za-z-]+\.(ttf|txt)|icons/[a-z0-9-]+\.(svg|png))$' || true)
[ -z "$bad" ] || { echo "FAIL unexpected files: $bad"; exit 1; }
unzip -p "$z" claude.css | grep -nE 'https?://|@import' && { echo "FAIL network reference in CSS"; exit 1; }
unzip -p "$z" manifest.json | python3 -c "import json,sys; m=json.load(sys.stdin); assert not m.get('permissions') and not m.get('host_permissions') and not m.get('optional_permissions') and 'background' not in m, 'extra permissions/background'; assert all(cs['matches']==['https://claude.ai/*'] and not cs.get('js') for cs in m['content_scripts']), 'content script scope'" 
echo "PACKAGE AUDIT PASS"
