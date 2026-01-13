const axios = require('axios');
const date = new Date().toISOString().split('T')[0];
axios.get(`http://localhost:3001/calendar/day/${date}`)
    .then(res => {
        console.log('SUCCESS: API Response received');
        console.log(JSON.stringify(res.data, null, 2));

        // Check for Chinese characters
        const dataStr = JSON.stringify(res.data);
        const hasChinese = /[\u4e00-\u9fa5]/.test(dataStr);
        if (hasChinese) {
            console.log('\nWARNING: Chinese characters detected!');
            // Find which keys have Chinese
            const findChinese = (obj, path = '') => {
                for (let key in obj) {
                    const val = obj[key];
                    const currentPath = path ? `${path}.${key}` : key;
                    if (typeof val === 'string' && /[\u4e00-\u9fa5]/.test(val)) {
                        console.log(`- ${currentPath}: ${val}`);
                    } else if (typeof val === 'object' && val !== null) {
                        findChinese(val, currentPath);
                    }
                }
            };
            findChinese(res.data);
        } else {
            console.log('\nSUCCESS: No Chinese characters found in response.');
        }
    })
    .catch(err => {
        console.error('ERROR: API request failed');
        console.error(err.message);
    });
