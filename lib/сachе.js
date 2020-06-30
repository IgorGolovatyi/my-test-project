let cache = {}; // Need to replace with redis

const parseType = {
    object: (arg, values)=> {
        let key = '';
        values.map((e) => {
            if (typeof e == 'object') {
                const { type, values: val, name } = e;
                return key += parseType[type](arg[name], val);
            };
            return key += arg[e];
        });
        return key;
    },
    string: (arg)=> arg,
    number: (arg)=> arg,
};

async function buildingKey(buildingCacheKey, args) {
    let key = '';
    for (let i=0; i<buildingCacheKey.length; i++) {
        const { type, values } = buildingCacheKey[i];
        key += parseType[type](args[i], values);
    };
    return key;
};

module.exports = {
    getAndSetCache: function getAndSetCache(fnc, buildingCacheKey) {
        return async function() {
            let key = await buildingKey(buildingCacheKey, arguments);
            console.log('getAndSetCache 1', key, cache);
            if (cache[key]) return cache[key];
            const result = await fnc(...arguments);
            cache[key] = result;
            console.log('getAndSetCache 2', key,  cache);
            return result;
        }
    },
    
    deleteCache: function deleteCache(fnc, buildingCacheKey) {
        return async function() {
            let key = await buildingKey(buildingCacheKey, arguments);
            delete cache[key];
            console.log('deleteCache', key, cache);
            return await fnc(...arguments);
        }
    },

    clearAllCache: async function clearAllCache() {
        cache = {};
    },
}
