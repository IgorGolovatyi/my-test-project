module.exports = { 
    name: 'news',
    schema: {
        source: { type: 'string' },
        author: { type: 'string' },
        title: { type: 'string' },
        description: { type: 'string' },
        url: { type: 'string' },
        urlToImage: { type: 'string' },
        publishedAt: { type: 'string' },
        content: { type: 'string' },
        userId: { type: 'oid', ref: 'user' },
    },
};