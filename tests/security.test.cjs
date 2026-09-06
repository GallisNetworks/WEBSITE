const test=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const crypto=require('node:crypto');
test('published pages have CSP and structured-data hashes match',()=>{
 const paths=['index.html','privacy.html','privacy-policy.html','refund-policy.html','legal.html','terms.html','Home.html','cookie-policy.html',...fs.readdirSync('services').filter(p=>p.endsWith('.html')).map(p=>'services/'+p)];
 for(const path of paths){
  const html=fs.readFileSync(path,'utf8');const csp=html.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/)?.[1];
  assert.ok(csp,path);assert.ok(csp.includes("default-src 'self'"),path);assert.ok(csp.includes("base-uri 'none'"),path);
  const scripts=csp.match(/script-src ([^;]+)/)[1];assert.ok(!scripts.includes('unsafe-inline'));assert.ok(!scripts.includes('unsafe-eval'));
  for(const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)){
   assert.ok(csp.includes('sha256-'+crypto.createHash('sha256').update(match[1]).digest('base64')),path);
  }
  assert.ok(!/<script[^>]+src="(?:jquery|nicepage|intlTelInput)/.test(html),path);
 }
});
test('all five social profiles are present and production form stays inactive',()=>{
 const html=fs.readFileSync('index.html','utf8');
 for(const p of ['tiktok','instagram','facebook','x','bluesky'])assert.ok(html.includes('id="social-'+p+'"'));
 assert.equal(fs.readFileSync('CNAME','utf8'),'www.gallisnetworks.com');
 const config=fs.readFileSync('assets/config.js','utf8');assert.match(config,/enquiriesEnabled: false/);assert.match(config,/serverProtectionVerified: false/);
 assert.ok(!fs.readFileSync('sitemap.xml','utf8').includes('social-x.html'));
});
