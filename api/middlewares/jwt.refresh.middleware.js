const refreshTokeName = 'refreshToken';

const invalidTypeError = 'Please, send refresh token';
const notRtfreshToken = 'Please, auth for google';

const usersModelName = 'users';

module.exports = (passport, mongoose) => async (req, res, next) => {
    try {
        const { headers: { authorization }} = req;
        const { findById } = mongoose;
        const refreshToken = authorization.split(' ')[1];

        passport.authenticate('jwt', async (err, jwtData={}, token) => {
            const { id, type } = jwtData;
            if (err) return res.status(401).send(err);
            if (type != refreshTokeName) return res.status(401).send(invalidTypeError);

            const user = await findById({ name: usersModelName, id });
            if (user.refreshToken != refreshToken) return res.status(401).send(notRtfreshToken);

            req.user = user;
            next();
        })(req, res, next);
    } catch (error) {
        console.log('[JWT REFRESH MDW]', error);
    }
  };