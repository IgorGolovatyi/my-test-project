module.exports = (passport, mongoose, newsapi)=> {
    const schemas = require('./schemas');
    const middlewares = require('./middlewares')(passport, mongoose);
    require('./news')(mongoose, newsapi);
    const v1 = require('./v1');
    return { schemas, middlewares, v1 };
};