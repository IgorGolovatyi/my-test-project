const tryLaterError = 'Please, try againe later';
const googleName = 'google';

module.exports = (passport) => async(req, res, next) => {
  try {
    passport.authenticate(googleName, (error, profile) => {
      if (error || !profile.googleId) {
        return res.status(400).send(tryLaterError);
      };
      req.profile = profile;
      return next();
    })(req, res, next);
  } catch (error) {
    console.log('[GOOGLE CB MDW]', error);
  }
};
