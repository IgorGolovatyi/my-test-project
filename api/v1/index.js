module.exports = (router, middlewares, passport, mongoose)=> {
    require('./users')(router, middlewares, passport, mongoose);
    require('./feed')(router, middlewares, mongoose);
    require('./favorites')(router, middlewares, mongoose);
    
    return router;
};


