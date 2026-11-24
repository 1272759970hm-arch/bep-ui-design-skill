const assert=require('node:assert/strict'),y=require('../assets/offline/yikan.js'),b=require('../assets/offline/business-ranking.js');
const rows=Array.from({length:7},(_,i)=>({id:'org'+(i+1),rank:i+1,name:'秘密组织'+(i+1),values:[100-i],canDrill:true}));
const get=id=>b.peerNeighborhood(rows,id,{complete:true,totalPeers:7}).map(r=>r.rank);
assert.deepEqual(get('org1'),[1,2]);assert.deepEqual(get('org4'),[1,3,4,5]);assert.deepEqual(get('org7'),[1,6,7]);assert.deepEqual(get('org2'),[1,2,3]);
assert.throws(()=>b.peerNeighborhood(rows,'org4',{complete:false,totalPeers:7}));assert.throws(()=>b.peerNeighborhood(rows.slice(1),'org4',{complete:true,totalPeers:6}));assert.throws(()=>b.peerNeighborhood(rows,'missing',{complete:true,totalPeers:7}));
const scopes=[{id:'p',kind:'peers',selfId:'org4',complete:true,totalPeers:7,columns:['排名','名称','收入'],rows}];const safe=b.prepareScopes(scopes);assert.ok(safe[0].rows.every(r=>r.id==='org4'||r.name==='***'));assert.ok(safe[0].rows.every(r=>!r.canDrill));const html=y.businessRanking({scopes});assert.ok(!html.includes('秘密组织1'));assert.ok(html.includes('秘密组织4'));assert.ok(!html.includes('data-ranking-drill='));assert.ok(html.includes('disabled'));
const sub=y.businessRanking({scopes:[{...scopes[0],kind:'subordinates',rows:rows.slice(0,2)}]});assert.ok(sub.includes('data-ranking-drill="org1"'));
assert.throws(()=>y.businessRanking({scopes,selectedScope:'bad'}));console.log('business ranking: first/middle/last boundaries, de-duplication, complete data requirement, peer masking, drill boundaries, scope validation passed');

assert.deepEqual(b.peerNeighborhood([rows[0],rows[2],rows[3],rows[4]],'org4',{neighborhoodProvided:true,totalPeers:7}).map(r=>r.rank),[1,3,4,5]);assert.throws(()=>b.peerNeighborhood([rows[0],rows[3]],'org4',{neighborhoodProvided:true,totalPeers:7}));console.log('server-provided sparse neighborhood validation passed');
