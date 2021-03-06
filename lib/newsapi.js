const NewsAPI = require('newsapi');
const newsapi = new NewsAPI(process.env.NEWSAPI_KEY || 'a93b86aa18fa40a38cd64f6b7e8e6e5b');


const everything = function everything(
      fromDate, toDate, searchInfoTag='node.js', pageSize=100,
    ) {
    return newsapi.v2.everything({
    q: searchInfoTag,
    from: fromDate,
    to: toDate,
    pageSize,
  });
};

module.exports = { everything };