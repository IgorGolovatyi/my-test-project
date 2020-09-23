const stringType = 'string';
const user = 'user';


module.exports = { 
    name: user,
    schema: {
        googleId: { type: stringType },
        refreshToken: { type: stringType },
        displayName: { type: stringType },
    }, 
};