const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.set('useFindAndModify', false);

async function mongooseConnect() {
    return new Promise ((res, rej)=> {
        mongoose.connect( process.env.MONGOOS_URL, 
            { useNewUrlParser: true, useUnifiedTopology: true },
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
    return await mongoose.Types.ObjectId();
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
    return await mongoose.models[name].create(payload);
};

async function findOne({ name='undefined', payload = {} }) {
    try {
        await checkModelExist(name);
        return await mongoose.models[name].findOne(payload, null);
    } catch (error) {
        console.log(error);
        return null;
    }
    
};

async function bulkWrite({ name='undefined', payload = [] }) {
    await checkModelExist(name);
    const options = { ordered: false, j: false };
    return await mongoose.models[name].bulkWrite(payload, options);
};

async function findMany({ 
        name='undefined', payload = {}, skip=null, limit = null, 
        exclude = null, sort = { _id: -1 }
    }) {
    await checkModelExist(name);
    return await mongoose.models[name].find(payload, exclude, { sort, limit, skip });
};

async function deleteOne({ name='undefined', payload = {} }) {
    await checkModelExist(name);
    console.log(payload)
    return await mongoose.models[name].deleteOne(payload);
};

async function findByIdAndUpdate({ name='undefined', id, update }) {
    try {
        await checkModelExist(name);
        return await mongoose.models[name].findByIdAndUpdate(id, update);
    } catch (error) {
        console.log(error);
        return null;
    }
};

async function findById({ name='undefined', id = '' }) {
    try {
        await checkModelExist(name);
        return await mongoose.models[name].findById(id);
    } catch (error) {
        console.log(error);
        return null;
    }
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
    mongooseConnect,
    getObjectId,
    createModel,
    findOneOrCreate,
    createOneRecord,
    findOne,
    bulkWrite: bulkWrite,
    findMany,
    deleteOne,
    findByIdAndUpdate,
    findById,
    findByIdPupulate,
};
