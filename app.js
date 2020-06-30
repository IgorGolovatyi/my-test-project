require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const router = require('express').Router();

const { 
    mongoose, newsapi, passport, сachе,
} = require('./lib');
const { 
    schemas, middlewares, routVersions 
} = require('./api')(passport, mongoose, newsapi, сachе);

(async function APP() {
    await mongoose.mongooseConnect();
    schemas.map(({ name, schema }) => mongoose.createModel(name, schema));
    
    const port = process.env.EXPRESS_PORT || 3000;
    const routVersion = process.env.EXPRESS_ROUT_VERSION || 'v1';

    const app = express();

    app.use(helmet());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    app.use('/' + routVersion, router);

    routVersions[routVersion](router, middlewares, passport, mongoose);

    app.use(async function onError(error, res) {
        console.log('[EXPRESS]', error);
        res.status(500).send('Internal server error');
    })

    app.listen(port, '0.0.0.0', ()=> console.log(`API running at :${port} port`));

})();
