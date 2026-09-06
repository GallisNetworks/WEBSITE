"""Rebuild static CSP hashes after editing structured data. No build needed for Pages."""
from pathlib import Path
import base64
import hashlib
import re

ROOT = Path(__file__).resolve().parents[1]
for path in [*ROOT.glob('*.html'), *ROOT.glob('services/*.html'), *ROOT.glob('blog/*.html')]:
    html = path.read_text()
    html = re.sub(r'<meta http-equiv="Content-Security-Policy"[^>]*>', '', html)
    if path.name in ('social-tiktok.html', 'social-x.html'):
        # Sandboxed helper documents need third-party scripts; parent does not.
        policy = "base-uri 'none'; object-src 'none'; form-action 'none'; upgrade-insecure-requests"
    else:
        hashes = ["'sha256-" + base64.b64encode(hashlib.sha256(text.encode()).digest()).decode() + "'"
                  for text in re.findall(r'<script type="application/ld\+json">(.*?)</script>', html, re.S)]
        policy = ("default-src 'self'; base-uri 'none'; object-src 'none'; "
                  "script-src 'self' https://challenges.cloudflare.com " + ' '.join(hashes) + "; "
                  "style-src 'self' 'unsafe-inline'; img-src 'self' https://cdn.bsky.app data:; "
                  "connect-src 'self' https://formspree.io https://challenges.cloudflare.com https://public.api.bsky.app; "
                  "frame-src 'self' https://www.facebook.com https://challenges.cloudflare.com; "
                  "form-action https://formspree.io; upgrade-insecure-requests")
    tag = '<meta http-equiv="Content-Security-Policy" content="' + policy + '">'
    html = html.replace('<meta charset="utf-8">', '<meta charset="utf-8">' + tag, 1)
    if 'name="referrer"' not in html:
        html = html.replace(tag, tag + '<meta name="referrer" content="strict-origin-when-cross-origin">', 1)
    path.write_text(html)
