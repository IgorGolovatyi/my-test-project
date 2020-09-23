const cron = require('node-cron');
const scheduled = '00 02 * * *';
const objectType = 'object';
const payloadName = 'payload';
const _idValue = '_id';
const idValue = 'id';
const naemValue = 'name'

module.exports = (сachе, mongoose)=> {
    const { deleteCache, getAndSetCache, clearAllCache } = сachе;
    const { deleteOne, findByIdAndUpdate, findById } = mongoose;

    mongoose.deleteOne = deleteCache(deleteOne, [{
        type: objectType,
        values: [naemValue, { type: objectType, name: payloadName, values: [_idValue] }],
    }]);

    mongoose.findByIdAndUpdate = deleteCache(findByIdAndUpdate, [{
        type: objectType,
        values: [naemValue, idValue],
    }]);

    mongoose.indById = getAndSetCache(findById, [{
        type: objectType,
        values: [naemValue, idValue],
    }]);

    cron.schedule(scheduled, async() => {
        await clearAllCache();
    }, {
        scheduled: true,
    });
};
