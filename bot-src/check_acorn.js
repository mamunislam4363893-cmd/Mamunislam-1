const fs = require('fs');
const acorn = require('acorn');

const code = fs.readFileSync('web/script.js', 'utf8');

let ast;
try {
  ast = acorn.parse(code, { ecmaVersion: 2020 });
} catch (e) {
  console.log("PARSE ERROR", e);
  process.exit();
}

const constDecls = new Set();
let reassignments = [];

function walk(node, scope) {
  if(!node) return;
  if(Array.isArray(node)) {
    node.forEach(n => walk(n, scope));
    return;
  }
  
  if (node.type === 'VariableDeclaration' && node.kind === 'const') {
     node.declarations.forEach(d => {
       if (d.id.type === 'Identifier') {
          constDecls.add(d.id.name);
       }
     });
  }
  
  if (node.type === 'AssignmentExpression') {
     if (node.left.type === 'Identifier') {
         if (constDecls.has(node.left.name)) {
             reassignments.push({name: node.left.name, line: node.loc ? node.loc.start.line : '?'});
             console.log("FOUND REASSIGNMENT:", node.left.name);
         }
     }
  }
  
  for(let key in node) {
    if(key === 'type' || key === 'loc' || key === 'start' || key === 'end') continue;
    if(typeof node[key] === 'object') {
       walk(node[key], scope);
    }
  }
}

ast = acorn.parse(code, { ecmaVersion: 2020, locations: true });
walk(ast, {});
console.log("Done checking ast");
