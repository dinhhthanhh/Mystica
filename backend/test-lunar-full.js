const fs = require('fs');
try {
    const { Solar, Lunar, I18n } = require('./node_modules/lunar-javascript');

    const solar = Solar.fromDate(new Date());
    const lunar = solar.getLunar();

    const data = {
        solar: {
            date: solar.toYmd(),
            weekDay: solar.getWeekInChinese()
        },
        lunar: {
            dateText: lunar.toString(),
            monthInChinese: lunar.getMonthInChinese(),
            dayInChinese: lunar.getDayInChinese(),
            zhiXing: lunar.getZhiXing(),
            xiu: lunar.getXiu(),
            naYin: (lunar.getDayNaYin ? lunar.getDayNaYin() : 'N/A'),
            pengZuGan: (lunar.getPengZuGan ? lunar.getPengZuGan() : 'N/A'),
            pengZuZhi: (lunar.getPengZuZhi ? lunar.getPengZuZhi() : 'N/A'),
            liuYao: (lunar.getLiuYao ? lunar.getLiuYao() : 'N/A'),
            positions: {
                xi: { desc: (lunar.getDayPositionXiDesc ? lunar.getDayPositionXiDesc() : 'N/A') },
                fu: { desc: (lunar.getDayPositionFuDesc ? lunar.getDayPositionFuDesc() : 'N/A') },
                cai: { desc: (lunar.getDayPositionCaiDesc ? lunar.getDayPositionCaiDesc() : 'N/A') }
            },
            yi: lunar.getDayYi(),
            ji: lunar.getDayJi(),
            jiShen: lunar.getDayJiShen(),
            xiongSha: lunar.getDayXiongSha(),
            times: lunar.getTimes().map(t => ({
                zhi: t.getZhi(),
                tianShen: t.getTianShen(),
                tianShenType: t.getTianShenType()
            }))
        }
    };

    fs.writeFileSync('lunar-data.json', JSON.stringify(data, null, 2), 'utf-8');
    console.log('SUCCESS: Written to lunar-data.json');
} catch (e) {
    console.error('ERROR:', e.message);
    fs.writeFileSync('lunar-error.log', e.stack, 'utf-8');
}
