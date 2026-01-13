const { Solar, Lunar, I18n } = require('lunar-javascript');

console.log('Testing Vietnamese support...');
try {
    I18n.setLanguage('vn');
    console.log('Set language to vn');
    const solar = Solar.fromDate(new Date());
    const lunar = solar.getLunar();
    console.log('Zodiac (vn):', lunar.getYearShengXiao());
    console.log('Should Do (vn):', lunar.getDayYi());
} catch (e) {
    console.log('vn failed', e.message);
}

try {
    I18n.setLanguage('vi');
    console.log('Set language to vi');
    const solar = Solar.fromDate(new Date());
    const lunar = solar.getLunar();
    console.log('Zodiac (vi):', lunar.getYearShengXiao());
    console.log('Should Do (vi):', lunar.getDayYi());
} catch (e) {
    console.log('vi failed', e.message);
}
