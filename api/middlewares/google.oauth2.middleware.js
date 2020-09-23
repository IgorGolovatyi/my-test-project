const googleName = 'google';
const scope = 'https://www.googleapis.com/auth/userinfo.profile';

module.exports = (passport) => async(req, res) => {
  passport.authenticate(googleName, { scope })(req, res);
}
