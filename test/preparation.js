require('dotenv').config();
const jwt = require('jsonwebtoken');
const monggose = require('../lib/mongoose');
const usersSchema = require('../api/schemas/users.schema');
const favoritesSchema = require('../api/schemas/favorites.schema');
const schemas = [usersSchema, favoritesSchema];
const { createModel, deleteOne, createOneRecord, mongooseConnect, getObjectId } = monggose;

const { 
    PASSPORT_JWT_SECRET, 
    PASSPORT_JWT_EXPIRE_REFRESH, 
    PASSPORT_JWT_EXPIRE_ACCESS, 
    API_URL =  'http://localhost:3030',
    EXPRESS_ROUT_VERSION = 'v1',
} = process.env;

const url = `${API_URL}/${EXPRESS_ROUT_VERSION}`; 

const expiredRefreshToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlZjh' 
  + 'iMzYyYjEyMGE0MDQ3Y2FkMDQ4MSIsImV4cGlyZSI6MTU5MzM5MTA2MDgzNywidHlwZSI6InJlZnJlc2'
  + 'hUb2tlbiIsImlhdCI6MTU5MzM4NzQ2MH0.U6o5UkhUjKwH0LxCOOjK-NYjkzcu_CAmWAR54MGPtpY';

const secretJWT = PASSPORT_JWT_SECRET || 'test';
const expireRefreshToken = (PASSPORT_JWT_EXPIRE_REFRESH || 1440) * 60 * 1000; // min, sec, ms
const expireAccessToken = (PASSPORT_JWT_EXPIRE_ACCESS || 30) * 60 * 1000; // min, sec, ms
const refreshTokeName = 'refreshToken';
const accessTokenName = 'accessToken';
const expireByTokenType = { 
  [refreshTokeName]: expireRefreshToken, 
  [accessTokenName]: expireAccessToken,
};



const getExpireTokenByType = function getExpireTokenByType(type) {
    if (expireByTokenType[type]) return expireByTokenType[type];
    throw new Error('Token type is not fined');
};

const createJWT = function createJWT(type, payload) {
    const expire = getExpireTokenByType(type);
    const date = Date.now();

    payload.expire = date + expire;
    payload.type = type;

    const token = jwt.sign(payload, secretJWT);
    return token;
};

module.exports = async()=> {
    await mongooseConnect();

    const user = { 
        _id: await getObjectId(),
        googleId: 'tester',
        displayName: 'Test Test', 
    };

    const refreshToken = createJWT(refreshTokeName, { id: user._id });
    const accessToken = createJWT(accessTokenName, { id: user._id });
    user.refreshToken = refreshToken;

    const deleteRecords = [];
    schemas.map(async function({ name, schema }) { 
        await createModel(name, schema);
        const result = await createOneRecord({ name, payload: user });
        deleteRecords.push(result);
    });

    const endTest = async function() {
        deleteRecords.map(async e=> await e.remove());
    };

    return { endTest, refreshToken, accessToken, url, expiredRefreshToken };
};