const assert=require('node:assert/strict'),q=require('../assets/offline/query-controls.js');
const jan={year:2024,month:1,day:31,granularity:'day'};
assert.equal(q.changeDate(jan,{month:2}).day,29);assert.equal(q.changeDate({...jan,year:2025},{month:2}).day,28);
assert.throws(()=>q.validateDate({year:2025,month:2,day:29,granularity:'day'}));
assert.equal(q.dateLabel({...jan,month:3,day:4}),'2024年3月4日');assert.equal(q.dateLabel({...jan,granularity:'year'}),'2024年');
assert.ok(!q.withinBounds({...jan,year:2023},{min:jan}));assert.ok(q.withinBounds({...jan,day:1,granularity:'month'},{min:jan}));
assert.throws(()=>q.dateControl({value:jan,years:[2025]}));
assert.throws(()=>q.dateControl({value:jan,min:{year:2025,month:1,day:1},max:{year:2024,month:1,day:1}}));
assert.ok(q.dateControl({value:jan,years:[2023,2024,2025]}).includes('2024年1月31日'));
console.log('date controls: leap years, invalid dates, month clamps, unpadded labels, granularity bounds, explicit year range passed');

const nodes=[{id:'r',name:'区域',parentId:null,selectable:false},{id:'p',name:'项目',parentId:'r',selectable:true}];assert.equal(q.organizationModel(nodes,'p').value,'p');assert.throws(()=>q.organizationModel(nodes,'r'));assert.throws(()=>q.organizationModel([...nodes,nodes[1]]));assert.throws(()=>q.organizationModel([{...nodes[0],parentId:'p'},nodes[1]]));assert.throws(()=>q.organizationModel([nodes[1]]));console.log('organization model: explicit selection, duplicate ID, cycles, orphan path rejection passed');

assert.match(q.dateControl({value:{year:2024,month:2,day:29,granularity:'day'},picker:'calendar'}), /data-source="6671:132073\/132304\/132460"/);
assert.throws(()=>q.dateControl({value:{year:2024,month:2,day:29,granularity:'day'},picker:'other'}),/日期选择/);
