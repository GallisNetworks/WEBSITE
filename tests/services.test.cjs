const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
function setup(hash = '') {
  const ids = ['networking','security','cameras','iot','drones','starlink','websites','architecture'];
  const make = (id, key) => ({id:(key === 'tab' ? 'tab-' : 'service-') + id, dataset:{[key]:id}, attrs:{}, events:{}, hidden:false,
    setAttribute(k,v){this.attrs[k]=v;},addEventListener(k,fn){this.events[k]=fn;},focus(){this.focused=true;}});
  const tabs = ids.map(id => make(id,'tab')); const panels = ids.map(id => make(id,'panel'));
  const list = make('list','list'); const callbacks = {};
  const window = {location:{hash},addEventListener(k,fn){callbacks[k]=fn;}};
  vm.runInNewContext(fs.readFileSync('assets/site.js','utf8'),{window,document:{body:{classList:{add(){}}},
    querySelector(s){return s === '.service-tabs' ? list : null;},querySelectorAll(s){return s === '[data-tab]' ? tabs : s === '[data-panel]' ? panels : [];}}});
  return {tabs,panels,window,callbacks};
}
test('one selected service, matching accessible panel and one tab stop',()=>{
 const app=setup();assert.equal(app.tabs.filter(x=>x.tabIndex===0).length,1);assert.equal(app.panels.filter(x=>!x.hidden).length,1);
 assert.equal(app.tabs[0].attrs['aria-controls'],app.panels[0].id);assert.equal(app.panels[0].attrs['aria-labelledby'],app.tabs[0].id);
 app.tabs[3].events.click({preventDefault(){}});assert.equal(app.panels[3].hidden,false);assert.equal(app.panels[0].hidden,true);assert.equal(app.tabs[3].attrs['aria-selected'],'true');
});
test('arrow keys wrap, Home/End work and focus follows selection',()=>{
 const app=setup();app.tabs[0].events.keydown({key:'ArrowLeft',preventDefault(){}});assert.equal(app.tabs[7].focused,true);assert.equal(app.panels[7].hidden,false);
 app.tabs[7].events.keydown({key:'Home',preventDefault(){}});assert.equal(app.panels[0].hidden,false);
 app.tabs[0].events.keydown({key:'End',preventDefault(){}});assert.equal(app.panels[7].hidden,false);
});
test('direct service anchors open the correct panel',()=>{
 const app=setup('#service-drones');assert.equal(app.panels[4].hidden,false);app.window.location.hash='#service-websites';app.callbacks.hashchange();assert.equal(app.panels[6].hidden,false);
});
