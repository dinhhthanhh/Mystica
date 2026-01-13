const { Solar, Lunar, I18n } = require('./backend/node_modules/lunar-javascript');
const { LunarVN } = require('./backend/src/calendar/lunar-vn');

I18n.setMessages('vn', LunarVN);
I18n.setLanguage('vn');

const solar = Solar.fromDate(new Date());
const lunar = solar.getLunar();

console.log('Lunar Month (InChinese):', lunar.getMonthInChinese());
console.log('Lunar Day (InChinese):', lunar.getDayInChinese());
console.log('Solar Week:', solar.getWeek());
console.log('Solar Month:', solar.getMonth());
console.log('Solar Year:', solar.getYear());

console.log('Methods on Lunar starting with getDay:');
console.log(Object.keys(lunar).filter(k => k.startsWith('getDay')));
console.log('Methods on Solar starting with get:');
console.log(Object.keys(solar).filter(k => k.startsWith('get')));
