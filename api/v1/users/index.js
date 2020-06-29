module.exports = (router, middlewares, passport, mongoose)=> {
    const { googleCbMdw, googleOauth2Mdw, authJWT, refreshJWT } = middlewares;
    const { createJWT } = passport;
    const { createOneRecord, findByIdAndUpdate, findOne } = mongoose;

    const refreshTokeName = 'refreshToken';
    const accessTokenName = 'accessToken';

    const usersModelName = 'users';
    const favoritesModelName = 'favorites';

    router.get('/users/auth/google', googleOauth2Mdw);
    
    router.get('/users/auth/google/cb', googleCbMdw, async function googleCb({ profile }, res) {
        const { googleId } = profile;
        let user = await findOne({ name: usersModelName, payload: { googleId }});
        if (!user) {
            user = await createOneRecord({ name: usersModelName, payload: { ...profile }});
            await createOneRecord({ 
                name: favoritesModelName, payload: { _id: user._id, favorites: [] 
            }});
        }
        const { id } = user;
        const refreshToken = await createJWT(refreshTokeName, { id });
        const accessToken = await createJWT(accessTokenName, { id });

        user.refreshToken = refreshToken;
        await findByIdAndUpdate({ name: usersModelName, id, update: { refreshToken }});

        delete profile.googleId;
        res.status(200).send({ refreshToken, accessToken, ...profile});
    });

    router.get('/users/logout', authJWT, async function logout({ user: { id }}, res) {
        await findByIdAndUpdate({ 
            name: usersModelName, id, update: { refreshToken: null }
        });
        res.status(200).send('Logout OK');
    });

    router.get('/users/refresh', refreshJWT, async function refresh({ user: { id }}, res) {
        const refreshToken = await createJWT(refreshTokeName, { id });
        const accessToken = await createJWT(accessTokenName, { id });
        await findByIdAndUpdate({ 
            name: usersModelName, id, update: { refreshToken }
        });
        res.status(200).send({ refreshToken, accessToken });
    });

    return router;
}
