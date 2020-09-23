const { Schema : { Types: { ObjectId }}} = require('mongoose');
const name = 'favorites';
const news= 'news';

module.exports = { 
    name,
    schema: {
        favorites: [{ type: ObjectId, ref: news, default: [] }],
    },
};