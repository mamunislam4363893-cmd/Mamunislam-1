try {
    const tempMail = require('./services/tempmail-providers');
    console.log('Successfully required tempmail-providers');
} catch (e) {
    console.error('Failed to require:', e.message);
    console.error('Stack:', e.stack);
}
