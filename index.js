(async function APP() {
    require('dotenv').config();

    const { express, mongoose, newsapi, passport } = require('./lib');

    const api = require('./api')(passport.passport, mongoose, newsapi);
    // const { middlewares, schemas, v1 } = api;
    await mongoose.mongooseConnect();
    api.schemas.map(({ name, schema })=> mongoose.createModel(name, schema));

    express(api, passport, mongoose);
})();
