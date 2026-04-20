const fs = require('fs');
const html = fs.readFileSync('web/admin.html', 'utf8');
const scriptMatch = html.match(/<script>(.*?)<\/script>/gs);
if (scriptMatch) {
    scriptMatch.forEach((scriptTag, idx) => {
        const code = scriptTag.replace(/<script>/, '').replace(/<\/script>/, '');
        fs.writeFileSync(`test_script_${idx}.js`, code);
        try {
            const { Script } = require('vm');
            new Script(code);
            console.log(`Script ${idx} parsed successfully.`);
        } catch (e) {
            console.error(`Script ${idx} syntax error:`, e.message);
        }
    });
} else {
    console.log("No scripts found");
}
