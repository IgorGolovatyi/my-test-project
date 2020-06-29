const googleCbMdw = require('./google.cb.middleware');
const googleOauth2Mdw = require('./google.oauth2.middleware');
const authJWT = require('./jwt.auth.middleware');
const refreshJWT = require('./jwt.refresh.middleware');

module.exports = (passport, mongoose)=> { 
    return {
        googleCbMdw: googleCbMdw(passport),
        googleOauth2Mdw: googleOauth2Mdw(passport),
        authJWT: authJWT(passport, mongoose),
        refreshJWT: refreshJWT(passport, mongoose),
    };
};