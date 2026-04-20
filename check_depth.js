const fs = require('fs');
const html = fs.readFileSync('web/admin.html', 'utf8');
let depth = 0;
const lines = html.split('\n');
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const opens = (line.match(/<div/g) || []).length;
    const closes = (line.match(/<\/div>/g) || []).length;
    depth += opens - closes;
    if (line.includes('id="page-groups"')) {
        console.log(`page-groups found at line ${i+1}, depth is ${depth}`);
    }
    if (line.includes('id="providerModal"')) {
        console.log(`providerModal found at line ${i+1}, depth is ${depth}`);
    }
}
