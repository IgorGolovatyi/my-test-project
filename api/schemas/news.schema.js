const news = 'news';
const user = 'user';
const stringType = 'string';
const oidType = 'oid';

module.exports = { 
    name: news,
    schema: {
        source: { type: stringType },
        author: { type: stringType },
        title: { type: stringType },
        description: { type: stringType },
        url: { type: stringType },
        urlToImage: { type: stringType },
        publishedAt: { type: stringType },
        content: { type: stringType },
        userId: { type: oidType, ref: user },
    },
};