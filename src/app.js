const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const port = process.env.EXPRESS_PORT || 3000;
const routVersion = process.env.EXPRESS_ROUT_VERSION || 'v1';

const app = express();
const router = require('express').Router();

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

require(`./${routVersion}`)(router, api.middlewares, passport, mongoose);

app.use('/' + routVersion, router);

app.use(async function onError(error, res) {
    console.log('[EXPRESS]', error);
    res.status(500).send('Internal server error');
})

app.listen(port, '0.0.0.0', ()=> console.log(`API running at :${port} port`));


