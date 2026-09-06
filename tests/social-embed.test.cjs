const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
test('helper widgets require the expected embedding parent message',()=>{
 let handler;const scripts=[],parent={};const window={parent,addEventListener:(e,fn)=>handler=fn};const document={body:{dataset:{platform:'x'},appendChild:s=>scripts.push(s)},createElement:()=>({})};
 vm.runInNewContext(fs.readFileSync('assets/social-embed.js','utf8'),{window,document,URL,location:{href:'https://www.gallisnetworks.com/social-x.html'}});
 assert.equal(scripts.length,0);handler({source:parent,origin:'https://bad.example',data:'gallis:load-consented-feed'});assert.equal(scripts.length,0);
 handler({source:parent,origin:'https://www.gallisnetworks.com',data:'gallis:load-consented-feed'});assert.equal(scripts.length,1);assert.equal(scripts[0].src,'https://platform.twitter.com/widgets.js');
});
