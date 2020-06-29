const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { getAndSetCache, deleteCache } = require('./сachе');
mongoose.set('useFindAndModify', false);

async function mongooseConnect() {
    return new Promise ((res, rej)=> {
        mongoose.connect( process.env.MONGOOS_URL, { useNewUrlParser: true },
        (err) => {
            console.log((!err) ? 'App connect to ModgoDB' : err);
            mongoose.connection.on('error', err => {
                logError(err);
            });
            err && rej(err) || res();
        });
    });
};

async function checkModelExist(name) {
    if (!mongoose.models[name]) throw new Error(`Model ${name} not exist!`);
};  

async function checkModelName(name) {
    if (!name || name == 'undefined') throw new Error('Invalid model name');
};  

async function getObjectId() {
    return mongoose.Types.ObjectId();
};

async function createModel(name, schema) {
    await checkModelName(name);
    mongoose.model(name, new Schema(schema));
    console.log(`Create model: ${name}`);
};

async function findOneOrCreate({ name='undefined', where = {},  payload = {} }) {
    const record = await findOne({ name, payload: where, });
    if (record) return record;
    return await createOneRecord({ name, payload });;
};

async function createOneRecord({ name='undefined', payload = {} }) {
    await checkModelExist(name);
    return mongoose.models[name].create(payload);
};

async function findOne({ name='undefined', payload = {} }) {
    await checkModelExist(name);
    return mongoose.models[name].findOne(payload, null);
};

async function bulkWrite({ name='undefined', payload = [] }) {
    await checkModelExist(name);
    const options = { ordered: false, j: false };
    return mongoose.models[name].bulkWrite(payload, options);
};

async function findMany({ 
        name='undefined', payload = {}, skip=null, limit = null, 
        exclude = null, sort = { _id: -1 }
    }) {
    await checkModelExist(name);
    return mongoose.models[name].find(payload, exclude, { sort, limit, skip });
};

async function deleteOne({ name='undefined', payload = {} }) {
    await checkModelExist(name);
    console.log(payload)
    return await mongoose.models[name].deleteOne(payload);
};

async function findByIdAndUpdate({ name='undefined', id, update }) {
    await checkModelExist(name);
    return mongoose.models[name].findByIdAndUpdate(id, update);
};

async function findById({ name='undefined', id = '' }) {
    await checkModelExist(name);
    return mongoose.models[name].findById(id);
};

async function findByIdPupulate({ 
    name='undefined', id = '', path, limit = null, skip = null 
}) {
    await checkModelExist(name);
    const record = await mongoose.models[name].findById(id)
        .populate({ path, options: { limit, skip }});
    return record;
};


module.exports = {
    mongooseConnect: mongooseConnect,
    getObjectId: getObjectId,
    createModel: createModel,
    findOneOrCreate: findOneOrCreate,
    createOneRecord: createOneRecord,
    findOne: findOne,
    bulkWrite: bulkWrite,
    findMany: findMany,

    deleteOne: deleteCache(deleteOne, [{
        type: 'object',
        values: ['name', { type: 'object', name: 'payload', values: ['_id'] }],
    }]),

    findByIdAndUpdate: deleteCache(findByIdAndUpdate, [{
        type: 'object',
        values: ['name', 'id'],
    }]),

    findById: getAndSetCache(findById, [{
        type: 'object',
        values: ['name', 'id'],
    }]),

    findByIdPupulate: findByIdPupulate,
    
};
