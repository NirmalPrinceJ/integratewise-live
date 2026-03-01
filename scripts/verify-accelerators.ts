import { registry } from '../packages/accelerators/src/index';

const list = registry.list();
console.log(`Verified ${list.length} Accelerators:`);
list.forEach(a => console.log(`- [${a.type}] ${a.name} (${a.id})`));
