const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const y=require('../assets/offline/yikan.js'),samples=require('../assets/offline/native-rings.js');
for(const kind of ['single','multi'])for(const state of ['negative','zero','normal','hundred','over']){
 const sample=samples[kind][state],file=fs.readFileSync(path.join(__dirname,'../assets/offline/native',kind+'-ring-'+state+'.svg'),'utf8');
 assert.equal(sample.svg.trim(),file.trim());assert.ok(y.nativeRingState({kind,state}).includes(sample.outlinedSvg));assert.ok(!sample.outlinedSvg.includes('<text'));assert.ok(y.nativeRingState({kind,state,outlined:false}).includes(sample.svg));
}
for(const sample of Object.values(samples.single)){
 const h=y.progressRing({value:sample.value,name:'收费率'});assert.ok(h.includes('data-provenance="original-sample-paths"'));
 for(const p of sample.svg.match(/<path\b[^>]*\/>/g))assert.ok(h.includes(p));
 assert.ok(h.includes(sample.value.toFixed(2)));assert.ok(!h.includes('待定义'));
}
for(const [v,state] of [[-10,'negative'],[0,'zero'],[50,'normal'],[100,'hundred'],[110,'over']])assert.ok(y.progressRing({value:v}).includes('data-state="'+state+'"'));
assert.ok(y.progressRing({value:110}).includes('stroke-opacity=".36"'));
assert.ok(y.progressRing({value:-10}).includes('0 0 0 '));
assert.ok(y.progressRing({value:250}).includes('250.00%'));assert.ok(y.progressRing({value:250}).includes('多圈'));
assert.ok(y.progressRing({value:null}).includes('缺少数据'));
assert.ok(!y.progressRing({value:10,name:'<script>'}).includes('<script>'));
console.log('ring states: ten original SVGs match, five exact sample paths reused, signed and over-100 binding, missing/unsupported values preserved');
