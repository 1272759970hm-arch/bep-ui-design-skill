const assert = require('node:assert/strict');
const y = require('../assets/offline/yikan.js');

// Confirmed business states must win over a conflicting generic tone.
assert.match(y.statusTag({status:'高户效', tone:'danger'}), /data-tone="normal">高户效/);
assert.match(y.statusTag({status:'低户效', tone:'danger'}), /data-tone="severe">低户效/);
assert.throws(() => y.statusTag({status:'低户效待确认'}), /已确认/);
assert.match(y.statusTag({tone:'info', label:'<待核对>'}), /&lt;待核对&gt;/);
assert.throws(() => y.statusTag({tone:'info'}), /文案/);
console.log('Status tags: confirmed business mapping, generic state validation and escaped labels passed.');
