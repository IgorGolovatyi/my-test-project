module.exports = ({ passport }, mongoose, newsapi, сachе)=> {
    const schemas = require('./schemas');
    const middlewares = require('./middlewares')(passport, mongoose);
    require('./news')(mongoose, newsapi);
    require('./caching')(сachе, mongoose);
    const v1 = require('./v1');
    return { schemas, middlewares, routVersions: { v1 }};
};