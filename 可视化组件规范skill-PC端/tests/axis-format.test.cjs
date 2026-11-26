const assert=require('node:assert/strict');
const y=require('../assets/offline/yikan.js');
for(const [range,suffix] of [[[0,2500],''],[[0,20000],'万'],[[0,40000000],'万'],[[0,200000000],'亿'],[[0,4000000000],'亿'],[[-20000,15000],'万']]){
 const a=y.axisModel(range,{range});assert.equal(a.labels.length,6);assert.equal(a.suffix,suffix);assert.ok(a.range[0]<=range[0]&&a.range[1]>=range[1]);assert.ok(!a.labels.some(x=>x.includes(',')));
 const nonzero=a.labels.filter((_,i)=>Math.abs(a.ticks[i])>1e-9);if(a.digits)assert.ok(nonzero.every(x=>x.replace(suffix,'').split('.')[1].length===a.digits));
}
const money=y.axisModel([0,2],{unit:'亿元',range:[0,2]});assert.equal(money.suffix,'亿');assert.equal(money.labels.at(-1),'2.0亿');
const pct=y.axisModel([97.1,98.2],{unit:'%'});assert.equal(pct.scale,1);assert.ok(pct.labels.every(x=>x.endsWith('%')));
const series=Array.from({length:7},(_,i)=>({name:'s'+i,unit:'桩',values:[i,i+1]}));const html=y.trend({time:['a','b'],series});
for(const c of y.seriesPalette(7))assert.ok(html.includes('stroke="'+c+'"'));
assert.throws(()=>y.trend({time:['a'],series:[{unit:'元',values:[2]},{unit:'万元',values:[2]}]}),/统一单位/);
const amount=y.trend({time:['a'],series:[{name:'金额',unit:'万元',values:[126.48]}]});assert.ok(amount.includes('126.48万元'));
console.log('axis: six ticks, shared magnitude, aligned decimals, signed ranges, prefixed units, percentage, all seven colors, precision passed');
