module.exports = (passport) => async(req, res) => {
  passport.authenticate(
    'google', 
    { scope: 'https://www.googleapis.com/auth/userinfo.profile'}
  )(req, res);
}
