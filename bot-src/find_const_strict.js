const fs = require('fs');
const code = fs.readFileSync('web/script.js', 'utf8');

// A very simple crude parser searching for const initialization
const lines = code.split('\n');
const consts = new Set();
for(let line of lines) {
  let m = line.match(/^\s*const\s+([a-zA-Z0-9_]+)\s*=/);
  if(m) consts.add(m[1]);
  m = line.match(/\s+const\s+([a-zA-Z0-9_]+)\s*=/);
  if(m) consts.add(m[1]);
}

for(let i=0; i<lines.length; i++) {
  let line = lines[i];
  // Remove string literals to avoid false positives
  let noStr = line.replace(/`[^`]*`/g, '').replace(/"[^"]*"/g, '').replace(/'[^']*'/g, '');
  
  for(let c of consts) {
    if(noStr.includes(`const ${c}`)) continue;
    
    let regex = new RegExp(`\\b${c}\\s*[-+*/%]?=`);
    if(regex.test(noStr)) {
        console.log("LINE", i+1, c, "->", line.trim());
    }
  }
}
