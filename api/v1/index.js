module.exports = (router, middlewares, { createJWT }, mongoose)=> {
    require('./users')(router, middlewares, createJWT, mongoose);
    require('./feed')(router, middlewares, mongoose);
    require('./favorites')(router, middlewares, mongoose);
    
    return router;
};


