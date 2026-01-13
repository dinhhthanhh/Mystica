const { Solar, Lunar } = require('lunar-javascript');

const date = new Date();
const solar = Solar.fromDate(date);
const lunar = solar.getLunar();

console.log('Lunar Day:', lunar.getDay());
console.log('Lunar Month:', lunar.getMonth());
console.log('Lunar Year:', lunar.getYear());
console.log('Heavenly Stem:', lunar.getDayGan());
console.log('Earthly Branch:', lunar.getDayZhi());
console.log('Zodiac:', lunar.getYearShengXiao());
console.log('Should Do (Yi):', lunar.getDayYi());
console.log('Should Not Do (Ji):', lunar.getDayJi());
console.log('Auspicious Hours:', lunar.getDayTimes().filter(t => t.getTianShenType() === '吉').map(t => `${t.getZhi()} (${t.getTianShen()})`));
