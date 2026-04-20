const fs = require('fs');
const html = fs.readFileSync('web/admin.html', 'utf8');
const lines = html.split('\n');
let depth = 0;
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('<main')) console.log('main starts at', i+1);
    if (line.includes('page-costmanage')) console.log('costmanage at', i+1, 'depth', depth);
    if (line.includes('page-broadcast')) console.log('broadcast at', i+1, 'depth', depth);
    
    // Count opening tags roughly
    const opens = (line.match(/<div(\s|>)/g) || []).length;
    const closes = (line.match(/<\/div>/g) || []).length;
    depth += opens - closes;
    
    if (line.includes('page-adnetworks')) console.log('adnetworks at', i+1, 'depth', depth);
    if (line.includes('page-groups')) console.log('groups at', i+1, 'depth', depth);
}
console.log('Final depth of div:', depth);
