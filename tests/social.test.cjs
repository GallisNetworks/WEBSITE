const test=require('node:test');const assert=require('node:assert/strict');const vm=require('node:vm');const fs=require('node:fs');
const actor='did:plc:vfgfspxjsta2ei3aat4ylqsq';
class Node {
 constructor(tag='div'){this.tag=tag;this.childNodes=[];this.dataset={};this.attributes={};this.listeners={};this.clientWidth=300;this.classList={add(){},remove(){}};}
 appendChild(n){this.childNodes.push(n);}
 replaceChildren(...nodes){this.childNodes=nodes;}
 cloneNode(){const n=new Node(this.tag);n.textContent=this.textContent;return n;}
 setAttribute(k,v){this.attributes[k]=v;}
 addEventListener(k,v){this.listeners[k]=v;}
}
function setup(fetchImpl=async()=>({ok:true,json:async()=>({feed:[]})}), permitted=true){
 const listeners={};let opened=0;const consent={allowed:()=>permitted,open:()=>opened++};
 const nodes={};let calls=0;const timers=new Map();let id=0;
 for(const platform of ['tiktok','facebook','x','bluesky']){
  const button=new Node('button');button.dataset.loadFeed=platform;
  const feed=new Node();const placeholder=new Node('p');placeholder.textContent='Profile fallback';feed.appendChild(placeholder);
  nodes[platform]={button,feed,status:new Node()};
 }
 const document={hidden:false,querySelectorAll:()=>Object.values(nodes).map(n=>n.button),querySelector:s=>{const p=s.match(/="([^"]+)"/)[1];return s.includes('status')?nodes[p].status:nodes[p].feed;},createElement:tag=>new Node(tag)};
 vm.runInNewContext(fs.readFileSync('assets/social.js','utf8'),{document,window:{GALLIS_PRIVACY:consent,addEventListener(k,fn){(listeners[k] ||= []).push(fn);},setTimeout(fn,delay){timers.set(++id,{fn,delay});return id;},clearTimeout(n){timers.delete(n);}},AbortController,URL,fetch:async(...args)=>{calls++;return fetchImpl(...args);}});
 return {nodes,timers,document,opened:()=>opened,revoke(){permitted=false;for(const fn of listeners['gallis:privacy-change']||[])fn();},calls:()=>calls,click:p=>nodes[p].button.listeners.click()};
}
function item(text='<img src=x onerror=alert(1)>',thumb='javascript:alert(1)'){
 return {post:{uri:'at://'+actor+'/app.bsky.feed.post/abc',author:{did:actor},record:{text,createdAt:'2026-09-01T12:00:00Z'},embed:{images:[{thumb}]}}};
}
test('no social request before visitor action; helpers cannot access parent origin',()=>{
 const app=setup();assert.equal(app.calls(),0);
 for(const p of ['tiktok','x']){app.click(p);const frame=app.nodes[p].feed.childNodes[0];assert.equal(frame.src,'social-'+p+'.html');assert.ok(!frame.attributes.sandbox.includes('allow-same-origin'));app.click(p);assert.equal(app.nodes[p].feed.childNodes[0].textContent,'Profile fallback');}
 app.click('facebook');assert.match(app.nodes.facebook.feed.childNodes[0].src,/^https:\/\/www.facebook.com\/plugins\/page.php/);
 assert.match(app.nodes.facebook.feed.childNodes[0].src,/width=300/);
});
test('Bluesky uses public API without credentials; hostile post text is never HTML',async()=>{
 const app=setup(async(url,options)=>{assert.match(url,/^https:\/\/public.api.bsky.app\/xrpc\/app.bsky.feed.getAuthorFeed/);assert.equal(options.credentials,'omit');return {ok:true,json:async()=>({feed:[item()]})};});
 await app.click('bluesky');const card=app.nodes.bluesky.feed.childNodes[0];
 assert.equal(card.childNodes.find(n=>n.tag==='p').textContent,'<img src=x onerror=alert(1)>');
 assert.equal(card.childNodes.filter(n=>n.tag==='img').length,0);
 assert.match(card.childNodes.find(n=>n.tag==='a').href,/^https:\/\/bsky.app\/profile\/did:plc:/);
 assert.ok([...app.timers.values()].some(t=>t.delay===300000));
});
test('feed removal cancels requests and ignores late responses',async()=>{
 let finish;const app=setup(()=>new Promise(resolve=>{finish=resolve;}));
 const pending=app.click('bluesky');app.click('bluesky');
 finish({ok:true,json:async()=>({feed:[item()]})});await pending;
 assert.equal(app.nodes.bluesky.feed.childNodes[0].textContent,'Profile fallback');
 assert.equal(app.timers.size,0);
});
test('refresh failure retains last successful content',async()=>{
 let count=0;const app=setup(async()=>{if(count++)throw new Error('offline');return {ok:true,json:async()=>({feed:[item('Real post')]})};});
 await app.click('bluesky');const card=app.nodes.bluesky.feed.childNodes[0];
 const refresh=[...app.timers.values()].find(t=>t.delay===300000);await refresh.fn();
 assert.equal(app.nodes.bluesky.feed.childNodes[0],card);assert.match(app.nodes.bluesky.status.textContent,/could not refresh/);
});
test('malformed feed and posts from other authors never replace fallback',async()=>{
 for(const data of [{feed:null},{feed:[null,{post:{author:{did:'someone-else'}}}]}]){
 const app=setup(async()=>({ok:true,json:async()=>data}));await app.click('bluesky');
 assert.equal(app.nodes.bluesky.feed.childNodes[0].textContent,'Profile fallback');}
});
test('hidden page pauses automatic feed requests',async()=>{
 const app=setup();app.document.hidden=true;await app.click('bluesky');assert.equal(app.calls(),0);
});

test('denied consent prevents frames and API requests; revocation removes loaded frames',async()=>{
 const denied=setup(undefined,false);for(const p of ['tiktok','facebook','x','bluesky'])await denied.click(p);assert.equal(denied.calls(),0);assert.equal(denied.opened(),4);assert.equal(denied.nodes.x.feed.childNodes[0].textContent,'Profile fallback');
 const allowed=setup();allowed.click('x');allowed.revoke();assert.equal(allowed.nodes.x.feed.childNodes[0].textContent,'Profile fallback');
});
test('revocation aborts an in-flight API request and ignores its result',async()=>{
 let finish,signal;const app=setup((u,o)=>{signal=o.signal;return new Promise(resolve=>finish=resolve);});const pending=app.click('bluesky');app.revoke();assert.equal(signal.aborted,true);finish({ok:true,json:async()=>({feed:[item()]})});await pending;assert.equal(app.nodes.bluesky.feed.childNodes[0].textContent,'Profile fallback');
});
