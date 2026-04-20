const fs = require('fs');
const content = fs.readFileSync('database/server.js', 'utf8');
const lines = content.split('\n');

const constVars = new Set();
const varRegex = /const\s+([a-zA-Z0-9_]+)\s*=/g;
let match;
while ((match = varRegex.exec(content)) !== null) {
  constVars.add(match[1]);
}

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  for (const v of constVars) {
    const regex = new RegExp(`\\b${v}\\s*[-+*\/]?=`, 'g');
    if (regex.test(line)) {
        if (!line.includes(`const ${v}`)) {
             console.log(`Line ${i+1} might reassign const ${v}: ${line.trim()}`);
        }
    }
  }
}
