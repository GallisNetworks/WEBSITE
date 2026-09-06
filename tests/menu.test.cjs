const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
test('mobile menu toggles, closes on links and restores focus on Escape',()=>{
 const attrs={'aria-expanded':'false'},events={},navEvents={},keys={};let opened=false,focused=false;
 const menu={setAttribute:(k,v)=>attrs[k]=v,getAttribute:k=>attrs[k],addEventListener:(k,v)=>events[k]=v,focus:()=>focused=true};
 const nav={classList:{remove:()=>opened=false,toggle:(n,v)=>opened=v},addEventListener:(k,v)=>navEvents[k]=v};
 const document={body:{classList:{add(){}}},querySelector:s=>s==='.menu-toggle'?menu:s==='#navigation'?nav:null,querySelectorAll:()=>[],addEventListener:(k,v)=>keys[k]=v};
 vm.runInNewContext(fs.readFileSync('assets/site.js','utf8'),{document,window:{}});
 events.click();assert.equal(opened,true);assert.equal(attrs['aria-expanded'],'true');
 keys.keydown({key:'Escape'});assert.equal(opened,false);assert.equal(focused,true);
 events.click();navEvents.click({target:{closest:()=>({})}});assert.equal(opened,false);assert.equal(attrs['aria-expanded'],'false');
});
