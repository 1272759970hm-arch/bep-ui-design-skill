const assert=require('node:assert/strict'),q=require('../assets/offline/query-controls.js');
const fields=q.propertyFilterFields();assert.ok(!fields.some(f=>f.options.some(o=>o.label==='全部')));assert.ok(!fields.some(f=>f.label==='大业主客商类别'));
const selected={nature:['owned'],region:['A','B'],subject:['large'],risk:['risk']};assert.deepEqual(q.filterValue(fields,selected).risk,['risk']);assert.deepEqual(q.filterValue(fields,{...selected,subject:['small']}).risk,[]);
assert.throws(()=>q.filterValue(fields,{...selected,subject:['nonexistent']}));assert.throws(()=>q.filterValue(fields,{...selected,unknown:[]}));
assert.throws(()=>q.filterSchema([{key:'a',label:'A',mode:'multi',options:[{label:'x',value:'x'}],showWhen:{field:'b',values:['x']}},{key:'b',label:'B',mode:'multi',options:[{label:'x',value:'x'}],showWhen:{field:'a',values:['x']}}]));
const single=[{key:'one',label:'One',mode:'single',options:[{label:'x',value:'x'},{label:'y',value:'y'}]}];assert.throws(()=>q.filterValue(single,{one:['x','y']}));
assert.equal(q.filterControl({available:false}), '');assert.ok(q.filterControl({fields,value:selected}).includes('高级筛选'));
console.log('filter: post-change fields, conditional clearing, invalid values, dependency cycles, single selection, hidden entry passed');
