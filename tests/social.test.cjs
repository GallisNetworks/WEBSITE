const test=require('node:test');const assert=require('node:assert/strict');const vm=require('node:vm');const fs=require('node:fs');
test('feeds make no frame until requested, preserve a fallback, and can be removed',()=>{
 const nodes={};let created=0;
 for(const id of ['tiktok','facebook']){
  nodes[id]={button:{dataset:{loadFeed:id},hidden:true,addEventListener(_,fn){this.click=fn;}},feed:{innerHTML:'original profile link',clientWidth:300,replaceChildren(frame){this.frame=frame;}},status:{}};
 }
 vm.runInNewContext(fs.readFileSync('assets/social.js','utf8'),{document:{querySelectorAll(){return Object.values(nodes).map(n=>n.button);},querySelector(s){const id=s.includes('tiktok')?'tiktok':'facebook';return s.includes('status')?nodes[id].status:nodes[id].feed;},createElement(type){assert.equal(type,'iframe');created++;return {setAttribute(){},addEventListener(){}};}}});
 assert.equal(created,0);
 nodes.tiktok.button.click();assert.equal(created,1);assert.equal(nodes.tiktok.feed.frame.src,'social-tiktok.html');
 nodes.tiktok.button.click();assert.equal(nodes.tiktok.feed.innerHTML,'original profile link');assert.match(nodes.tiktok.status.textContent,/removed/);
 nodes.facebook.button.click();assert.match(nodes.facebook.feed.frame.src,/^https:\/\/www.facebook.com\/plugins\/page.php/);assert.match(nodes.facebook.feed.frame.src,/width=300/);
});
