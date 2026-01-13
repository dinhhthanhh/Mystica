const { Solar, Lunar, I18n } = require('./backend/node_modules/lunar-javascript');

const solar = Solar.fromDate(new Date());
const lunar = solar.getLunar();

console.log('--- BASIC INFO ---');
console.log('Solar Date:', solar.toYmd());
console.log('Lunar Date:', lunar.toString());
console.log('Lunar Month (InChinese):', lunar.getMonthInChinese());
console.log('Lunar Day (InChinese):', lunar.getDayInChinese());

console.log('\n--- 12 OFFICERS & 28 MANSIONS ---');
console.log('12 Officers (ZhiXing):', lunar.getZhiXing());
console.log('28 Mansions (Xiu):', lunar.getXiu());
console.log('Xiu Zheng:', lunar.getXiuZheng());
console.log('Xiu Animal:', lunar.getXiuAnimal());

console.log('\n--- ELEMENTS & OTHERS ---');
console.log('NaYin:', lunar.getNaYin());
console.log('PengZuGan:', lunar.getPengZuGan());
console.log('PengZuZhi:', lunar.getPengZuZhi());
console.log('LiuYao:', lunar.getLiuYao());

console.log('\n--- DIRECTIONS ---');
console.log('Xi:', lunar.getDayPositionXi(), lunar.getDayPositionXiDesc());
console.log('Fu:', lunar.getDayPositionFu(), lunar.getDayPositionFuDesc());
console.log('Cai:', lunar.getDayPositionCai(), lunar.getDayPositionCaiDesc());

console.log('\n--- YI / JI & DETAILED DEITY ---');
console.log('Yi (Should do):', lunar.getDayYi());
console.log('Ji (Should not do):', lunar.getDayJi());
console.log('Ji Shen (Lucky Deity):', lunar.getDayJiShen());
console.log('Xiong Sha (Unlucky Deity):', lunar.getDayXiongSha());

console.log('\n--- TIME SLOTS ---');
const times = lunar.getTimes();
times.forEach(t => {
    console.log(`${t.getZhi()}: ${t.getTianShen()} - ${t.getTianShenType()}`);
});
