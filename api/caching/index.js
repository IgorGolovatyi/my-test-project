const cron = require('node-cron');

module.exports = (сachе, mongoose)=> {
    const { deleteCache, getAndSetCache, clearAllCache } = сachе;
    const { deleteOne, findByIdAndUpdate, findById } = mongoose;

    mongoose.deleteOne = deleteCache(deleteOne, [{
        type: 'object',
        values: ['name', { type: 'object', name: 'payload', values: ['_id'] }],
    }]);

    mongoose.findByIdAndUpdate = deleteCache(findByIdAndUpdate, [{
        type: 'object',
        values: ['name', 'id'],
    }]);

    mongoose.indById = getAndSetCache(findById, [{
        type: 'object',
        values: ['name', 'id'],
    }]);

    cron.schedule('00 02 * * *', async() => {
        await clearAllCache();
    }, {
        scheduled: true,
    });
};
