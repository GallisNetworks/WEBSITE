"""Source checks only: not a browser, cookie scan or WCAG conformance audit."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
root=Path(__file__).resolve().parents[1]
class Audit(HTMLParser):
 def __init__(self): super().__init__(); self.ids=[]; self.refs=[]; self.images=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if 'id' in a:self.ids.append(a['id'])
  if tag=='img':self.images.append(a);assert 'alt' in a,'Missing alt attribute'
  for k in ('src','href'):
   if a.get(k):self.refs.append(a[k])
paths=[root/'index.html',*root.glob('services/*.html'),*[root/p for p in ['privacy-policy.html','cookie-policy.html','terms.html','refund-policy.html','legal.html','404.html','thank-you.html']]]
titles=set()
for p in paths:
 a=Audit();s=p.read_text();a.feed(s);
 import re
 title=re.search(r'<title>(.*?)</title>',s)[1];assert title not in titles,p; titles.add(title)
 assert 'name="description"' in s,p
 assert len(a.ids)==len(set(a.ids)),p
 assert 'lang="en-GB"' in s and 'id="main"' in s,p
 for ref in a.refs:
  u=urlsplit(ref)
  if u.scheme or u.netloc or not u.path:continue
  target=((root/unquote(u.path).lstrip('/')) if u.path.startswith('/') else (p.parent/unquote(u.path))).resolve()
  assert target.exists(),f'{p.name}: missing {ref}'
print(f'PASS: {len(paths)} content pages: local link/file existence, alt attributes, language, main target, unique IDs.')
def lum(h):
 v=[int(h[i:i+2],16)/255 for i in (0,2,4)]
 v=[n/12.92 if n<=.04045 else ((n+.055)/1.055)**2.4 for n in v]
 return sum(n*w for n,w in zip(v,[.2126,.7152,.0722]))
for a,b in [('181d1b','ffffff'),('58635b','ffffff'),('58635b','f5f5ee'),('181d1b','c6ee78'),('452276','ffffff')]:
 x,y=sorted([lum(a),lum(b)]);ratio=(y+.05)/(x+.05);assert ratio>=4.5
 print(f'PASS: #{a} on #{b}: {ratio:.2f}:1')
