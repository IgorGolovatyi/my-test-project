const { 
    API_URL =  'http://localhost:3030',
    EXPRESS_ROUT_VERSION = 'v1',
 } = process.env;

const newsUrl = `${API_URL}/${EXPRESS_ROUT_VERSION}/feed/news/`;

module.exports = (router, middlewares, mongoose)=> {
    const { authJWT } = middlewares;
    const { 
        findById, createOneRecord, findMany, getObjectId, deleteOne, findOne,
    } = mongoose;

    const newsModelName = 'news';

    router.get('/feed', async function newsAll({ query }, res) {
        const { limit = null, skip = null } = query;
        const result = await findMany({ 
            name: newsModelName, limit: Number(limit), skip: Number(skip) 
        });
        return res.status(200).send(result);
    });

    router.get('/feed/news/:id', async function newsById({ params }, res) {
        const { id = '' } = params;
        const result = await findById({ name: newsModelName, id });

        if (result) delete result._v;

        return res.status(result && 200 || 404).send(result || 'News not found');
    });

    router.post('/feed', authJWT, async function newsAdd({ body, user }, res) {
        const { displayName: author, _id: userId } = user;
        const _id = await getObjectId();
        const url = newsUrl + _id;
        const sourse = API_URL;
        const publishedAt = (new Date).toISOString();
        const payload = { ...body, author, userId, _id, url, sourse, publishedAt };
        const result = await createOneRecord({ name: newsModelName, payload });

        delete result._v;

        return res.status(200).send(result);
    });

    router.delete('/feed/:_id', authJWT, async function newsDelete({ params, user }, res) {
        const { _id = '' } = params;
        const { _id: userId } = user;
        const { n, ok } = await deleteOne({ name: newsModelName, payload: { _id, userId } });
        if (n && ok) return res.status(200).send('Delete OK');
        return res.status(404).send('News not found');
    });
    
    return router;
}
