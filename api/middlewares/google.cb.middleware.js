module.exports = (passport) => async(req, res, next) => {
  try {
    passport.authenticate('google', (error, profile) => {
      if (error || !profile.googleId) {
        return res.status(400).send('Please, try againe later');
      };
      req.profile = profile;
      return next();
    })(req, res, next);
  } catch (error) {
    console.log('[GOOGLE CB MDW]', error);
  }
};
