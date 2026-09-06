"""Create compressed delivery copies; retain original photographs and logo."""
from pathlib import Path
import re,subprocess,json
root=Path(__file__).resolve().parents[1]
pages=[root/'index.html',*root.glob('services/*.html')]
originals=sorted({name for p in pages for name in re.findall(r'(?:\.\./)?images/([^" ]+\.(?:jpg|jpeg))',p.read_text())})
if not originals and (root/'docs/IMAGE-OPTIMISATION.json').exists():
 originals=[row['original'] for row in json.loads((root/'docs/IMAGE-OPTIMISATION.json').read_text()) if row['original']!='LogoFiles1.png']
out=root/'images/optimised';out.mkdir(exist_ok=True)
report=[]
for name in originals+['LogoFiles1.png']:
 source=root/'images'/name;dest=out/(source.stem+'.webp')
 subprocess.run(['convert',str(source),'-auto-orient','-resize','192x192>' if name=='LogoFiles1.png' else '1280x1280>','-strip','-quality','82',str(dest)],check=True)
 report.append({'original':name,'delivery':str(dest.relative_to(root)),'before':source.stat().st_size,'after':dest.stat().st_size})
for p in [*pages,*[root/n for n in ['privacy-policy.html','cookie-policy.html','terms.html','refund-policy.html','legal.html','404.html','thank-you.html']]]:
 s=p.read_text()
 for row in report:s=s.replace('images/'+row['original'],row['delivery'])
 p.write_text(s)
(root/'docs/IMAGE-OPTIMISATION.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({'images':len(report),'before':sum(x['before'] for x in report),'after':sum(x['after'] for x in report)}))
