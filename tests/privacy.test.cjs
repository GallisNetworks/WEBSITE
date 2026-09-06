const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
function setup(raw=null,blocked=false){
 const boxes=['tiktok','facebook','x','bluesky'].map(p=>({dataset:{provider:p},checked:false}));const actions={};const listeners={};let stored=raw,interval;
 const panel={hidden:true,setAttribute(){},focus(){},querySelectorAll:()=>boxes,querySelector:s=>({addEventListener:(e,fn)=>actions[s]=fn})};
 const document={body:{appendChild(){}},activeElement:null,createElement:()=>panel,querySelectorAll:()=>[],querySelector:()=>({})};
 const window={addEventListener:(e,fn)=>listeners[e]=fn,dispatchEvent(e){listeners[e.type]?.(e);},setInterval(fn){interval=fn;}};
 vm.runInNewContext(fs.readFileSync('assets/privacy.js','utf8'),{document,window,location:{pathname:'/'},Event,localStorage:{getItem(){if(blocked)throw Error();return stored;},setItem(k,v){if(blocked)throw Error();stored=v;},removeItem(){stored=null;}}});
 return {window,panel,boxes,actions,stored:()=>stored,storage(v){stored=v;listeners.storage({key:'gallis-privacy-v1'});},interval:()=>interval()};
}
test('new visitors start denied and reject remembers all four refusals',()=>{const a=setup();assert.equal(a.panel.hidden,false);assert.equal(a.window.GALLIS_PRIVACY.allowed('x'),false);a.actions['[data-reject]']();assert.equal(a.panel.hidden,true);assert.ok(Object.values(JSON.parse(a.stored()).choices).every(v=>v===false));});
test('granular choices persist and can be revoked across tabs',()=>{const a=setup();a.boxes[2].checked=true;a.actions['[data-save]']();assert.equal(a.window.GALLIS_PRIVACY.allowed('x'),true);assert.equal(a.window.GALLIS_PRIVACY.allowed('tiktok'),false);const b=setup(a.stored());assert.equal(b.window.GALLIS_PRIVACY.allowed('x'),true);a.storage(null);assert.equal(a.window.GALLIS_PRIVACY.allowed('x'),false);});
test('malformed, expired and future choices fail closed',()=>{for(const raw of ['oops','{}',JSON.stringify({version:1,savedAt:0,choices:{tiktok:true,facebook:true,x:true,bluesky:true}}),JSON.stringify({version:1,savedAt:Date.now()+999999,choices:{tiktok:true,facebook:true,x:true,bluesky:true}})])assert.equal(setup(raw).window.GALLIS_PRIVACY.allowed('x'),false);});
test('blocked storage supports only current page choice without throwing',()=>{const a=setup(null,true);a.boxes[3].checked=true;a.actions['[data-save]']();assert.equal(a.window.GALLIS_PRIVACY.allowed('bluesky'),true);assert.equal(a.stored(),null);});
