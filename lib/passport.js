const passport = require('passport');

const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const { ExtractJwt, Strategy: JwtStrategy } = require('passport-jwt');
const jwt = require('jsonwebtoken');

const { 
  PASSPORT_JWT_SECRET, 
  PASSPORT_JWT_EXPIRE_REFRESH, 
  PASSPORT_JWT_EXPIRE_ACCESS, 
  PASSPORT_GOOGLE_ID,
  PASSPORT_GOOGLE_SECRET,
  PASSPORT_GOOGLE_CB_URL,
} = process.env;

const secretJWT = PASSPORT_JWT_SECRET || 'test';
const expireRefreshToken = (PASSPORT_JWT_EXPIRE_REFRESH || 1440) * 60 * 1000; // min, sec, ms
const expireAccessToken = (PASSPORT_JWT_EXPIRE_ACCESS || 30) * 60 * 1000; // min, sec, ms
const refreshTokeName = 'refreshToken';
const accessTokenName = 'accessToken';
const expireByTokenType = { 
  [refreshTokeName]: expireRefreshToken, 
  [accessTokenName]: expireAccessToken,
};

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
  secretOrKey: secretJWT,
};

const googleOptions = {
  clientID: PASSPORT_GOOGLE_ID || '',
  clientSecret: PASSPORT_GOOGLE_SECRET || '',
  callbackURL: PASSPORT_GOOGLE_CB_URL || 'v1/users/auth/google/cb',
  profileFields: ["emails"]
};

passport.use(new GoogleStrategy(googleOptions, async function(
  token, refreshToken, profile, done) {
  try {
    const { id: googleId, displayName = '' } = profile;
    return done(false, { googleId, displayName });
  } catch (error) {
    return done(error, {});
  }
}));

passport.use(new JwtStrategy(jwtOptions, async(payload, done) => {
    if (!payload) return done('Please, send valid data', {});
    if (Date.now() > payload.expire) return done('Token expired, refresh or login', {});     
    return done(false, payload);
}));

const getExpireTokenByType = async function getExpireTokenByType(type) {
  if (expireByTokenType[type]) return expireByTokenType[type];
  throw new Error('Token type is not fined');
}

const createJWT = async function createJWT(type, payload) {
  const expire = await getExpireTokenByType(type);
  const date = Date.now();

  payload.expire = date + expire;
  payload.type = type;

  const token = jwt.sign(payload, secretJWT);
  return token;
}

module.exports = { passport, createJWT };