const cron = require('node-cron');
const msToOneDay = 1000 * 60 * 60 * 24;
const newsModelName = 'news';

module.exports = (mongoose, newsapi)=> {
    const { everything } = newsapi;
    const { bulkWrite } = mongoose;

    async function getNews(iterator = 1) {
        const toDate = new Date;
        const fromDate = toDate - msToOneDay;
        const request = await everything(fromDate, toDate);
        const { status, articles, code, message } = request;

        if (!status == 'ok' && iterator == 3) return console.log('[GET NEWS]', code, message);
        if (!status == 'ok') return setTimeout(getNews, 1000 * 60 * 5, ++iterator);

        const payload = articles.map((record) => {
            return { insertOne: { document: { ...record, source: record.source.name }}};
        });
        bulkWrite({ name: newsModelName, payload });
        
    };
    // getNews();
    cron.schedule('00 14 * * *', async() => {
        await getNews();
    }, {
        scheduled: true,
    });
}
