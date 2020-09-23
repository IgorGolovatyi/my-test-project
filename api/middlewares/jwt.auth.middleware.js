const accessTokenName = 'accessToken';
const invalidTypeError = 'Please, send accessc token';
const notRtfreshToken = 'Please, auth for google';

const usersModelName = 'users';
const jwtName = 'jwt';

module.exports = (passport, mongoose) => async (req, res, next) => {
    try {
        const { findById } = mongoose;
        
        passport.authenticate(jwtName, async (err, jwtData={}) => {
            const { id, type } = jwtData;
            if (err) return res.status(401).send(err);
            if (type != accessTokenName) return res.status(401).send(invalidTypeError);

            const user = await findById({ name: usersModelName, id });
            if (!user.refreshToken) return res.status(401).send(notRtfreshToken);

            req.user = user;
            next();
        })(req, res, next);
    } catch (error) {
        console.log('[JWT AUTH MDW]', error);
    }
  };