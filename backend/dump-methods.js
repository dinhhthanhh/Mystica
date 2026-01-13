const fs = require('fs');
try {
    const { Solar, Lunar } = require('./node_modules/lunar-javascript');
    const lunar = Solar.fromDate(new Date()).getLunar();

    const methods = [];
    for (let prop in lunar) {
        if (typeof lunar[prop] === 'function') {
            methods.push(prop);
        }
    }

    fs.writeFileSync('lunar-methods.txt', methods.sort().join('\n'), 'utf-8');
    console.log('SUCCESS: Methods dumped to lunar-methods.txt');
} catch (e) {
    console.error('ERROR:', e.message);
}
