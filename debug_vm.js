const fs = require('fs');
try {
    const code = fs.readFileSync('test_script_1.js', 'utf8');
    const { Script } = require('vm');
    new Script(code, { filename: 'test_script_1.js', displayErrors: true });
} catch (e) {
    console.error(e.stack);
}
