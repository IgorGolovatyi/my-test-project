module.exports = (router, middlewares, mongoose)=> {
    const { authJWT } = middlewares;
    const { findByIdPupulate, findByIdAndUpdate, findOne } = mongoose;

    const faforiteFindedMessage = 'This news has already been added';
    const faforiteNotFindedMessage = 'This news not exist by favorites';

    const favoritesModelName = 'favorites';
    
    router.post('/favorites/save/:_id', authJWT, async function faforiteSsave({ user, params }, res) {
        const { _id: id } = user;
        const { _id } = params;
        const check = await findOne({ 
            name: favoritesModelName, payload: { _id: id, favorites: _id }
        });
        if (check) return res.status(200).send(faforiteFindedMessage);
        const result = await findByIdAndUpdate({ 
            name: favoritesModelName, id, update: { $push: { favorites: _id }}
        });
        return res.status(200).send('Save OK');
    });

    router.get('/favorites', authJWT, async function getFaforites({ user, query }, res) {
        const { limit = null, skip = null } = query;
        const { id } = user;
        const result = await findByIdPupulate({ 
            name: favoritesModelName, id, path: favoritesModelName, 
            limit: Number(limit), skip: Number(skip) 
        });
        // console.log(result.favorites[0].author);
        return res.status(200).send(result.favorites || []);
    });

    router.delete('/favorites/:_id', authJWT, async function deleteFaforites({ user, params }, res) {
        const { _id: id } = user;
        const { _id } = params;
        const check = await findOne({ 
            name: favoritesModelName, payload: { _id: id, favorites: _id }
        });
        if (!check) return res.status(200).send(faforiteNotFindedMessage);
        const result = await findByIdAndUpdate({ 
            name: favoritesModelName, id, update: { $pull: { favorites: _id }}
        });
        return res.status(200).send("Delete OK");
    });

    return router;
}
