const { Schema : { Types: { ObjectId }}} = require('mongoose');

module.exports = { 
    name: 'favorites',
    schema: {
        favorites: [{ type: ObjectId, ref: 'news', default: [] }],
    },
};