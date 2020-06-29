const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;

const tetsQueue = new Array(9).fill(false);
tetsQueue[0] = true;

let newsUrl = null;
let newsId = null;

    before(async()=>{
        const preparation = await require('./preparation')();
        for (let key in preparation) {
            global[key] = preparation[key];
        };
    });

    describe('User refresh token', function() {
        before(function(done) {
            while(!tetsQueue[0]);
            done();
        });
        after(function(done) {
            tetsQueue[1] = true;
            done();
        });
        const route = '/users/refresh'
        it(`Users send valid accessToken, status 401`, function(done) {
            chai.request(url)
                .get(route)
                .set('content-type', 'application/json')
                .set('Authorization', 'Bearer ' + accessToken)
                .send()
                .end(function(err, res) {
                expect(res).to.have.status(401);
                expect(err).to.be.null;
                done();
                });
        });
        it(`Users send not valid refreshToken, status 401`, function(done) {
            chai.request(url)
                .get(route)
                .set('content-type', 'application/json')
                .set('Authorization', 'Bearer ' + expiredRefreshToken)
                .send()
                .end(function(err, res) {
                expect(res).to.have.status(401);
                expect(err).to.be.null;
                done();
                });
        });
        it('Users send valid refreshToken, status 200', function(done) {
            chai.request(url)
                .get(route)
                .set('content-type', 'application/json')
                .set('Authorization', 'Bearer ' + refreshToken)
                .send()
                .end(function(err, res) {
                expect(res).to.have.status(200);
                expect(err).to.be.null;
                const result = JSON.parse(res.text);
                expect(result).to.not.have.a.property('error');
                expect(result).to.be.an('object');
                expect(result).to.have.a.property('accessToken');
                expect(result).to.have.a.property('refreshToken');

                accessToken = result.accessToken;
                refreshToken = result.refreshToken;

                done();
                });
        });
    });  

    describe('Create news', function() {
        before(function(done) {
            while(!tetsQueue[1]);
            done();
        });
        after(function(done) {
            tetsQueue[2] = true;
            done();
        });
        const route = '/feed'
        const newsBody = {
            title: 'Test news',
            description: 'Testing news',
            urlToImage: null,
            content: 'News content',
        };

        it(`Users not authorized, status 401`, function(done) {
            chai.request(url)
                .post(route)
                .set('content-type', 'application/json')
                .send(newsBody)
                .end(function(err, res) {
                expect(res).to.have.status(401);
                expect(err).to.be.null;
                done();
                });
        });

        it(`Users authorized, status 200`, function(done) {
            chai.request(url)
                .post(route)
                .set('content-type', 'application/json')
                .set('Authorization', 'Bearer ' + accessToken)
                .send(newsBody)
                .end(function(err, res) {
                expect(res).to.have.status(200);
                expect(err).to.be.null;

                const result = JSON.parse(res.text);
                expect(result).to.not.have.a.property('error');
                expect(result).to.be.an('object');
                expect(result).to.have.a.property('_id');
                expect(result).to.have.a.property('title');
                expect(result).to.have.a.property('description');
                expect(result).to.have.a.property('urlToImage');
                expect(result).to.have.a.property('content');
                expect(result).to.have.a.property('author');
                expect(result).to.have.a.property('userId');
                expect(result).to.have.a.property('url');
                expect(result).to.have.a.property('publishedAt');
                newsUrl = result.url;
                newsId = result._id;

                done();
                });
        });
    });  

    describe('Add news to favorite', function() {
        let route = '';
        before(function(done) {
            while(!tetsQueue[2]);
            route = '/favorites/save/' + newsId
            done();
        });
        after(function(done) {
            tetsQueue[3] = true;
            done();
        });

        it(`Users not authorized, status 401`, function(done) {
            chai.request(url)
                .post(route)
                .set('content-type', 'application/json')
                .send()
                .end(function(err, res) {
                expect(res).to.have.status(401);
                expect(err).to.be.null;
                done();
                });
        });

        it(`Users authorized, valid id, status 200`, function(done) {
            chai.request(url)
                .post(route)
                .set('content-type', 'application/json')
                .set('Authorization', 'Bearer ' + accessToken)
                .send()
                .end(function(err, res) {

                expect(res).to.have.status(200);
                expect(err).to.be.null;

                done();
                });
        });
        it(`Users authorized, not valid id, status 404`, function(done) {
            chai.request(url)
                .post(route + 'j')
                .set('content-type', 'application/json')
                .set('Authorization', 'Bearer ' + accessToken)
                .send()
                .end(function(err, res) {
                expect(res).to.have.status(404);
                expect(err).to.be.null;

                done();
                });
        });
    });  

    describe('Get favorites news', function() {
        before(function(done) {
            while(!tetsQueue[3]);
            done();
        });
        after(function(done) {
            tetsQueue[4] = true;
            done();
        });
        const route = '/favorites'; 
        it(`Users not authorized, status 401`, function(done) {
            chai.request(url)
                .get(route)
                .set('content-type', 'application/json')
                .send()
                .end(function(err, res) {
                expect(res).to.have.status(401);
                expect(err).to.be.null;
                done();
                });
        });
        it(`Users authorized, status 200`, function(done) {
            chai.request(url)
                .get(route)
                .set('content-type', 'application/json')
                .set('Authorization', 'Bearer ' + accessToken)
                .send()
                .end(function(err, res) {
                expect(res).to.have.status(200);
                expect(err).to.be.null;

                const result = JSON.parse(res.text);

                expect(result).to.not.have.a.property('error');
                expect(result).to.be.an('array');

                const news = result[0];

                expect(news).to.have.a.property('_id');
                expect(news).to.have.a.property('title');
                expect(news).to.have.a.property('description');
                expect(news).to.have.a.property('urlToImage');
                expect(news).to.have.a.property('content');
                expect(news).to.have.a.property('author');
                expect(news).to.have.a.property('userId');
                expect(news).to.have.a.property('url');
                expect(news).to.have.a.property('publishedAt');
                
                done();
                });
        });
    });  

    describe('Delete favorites news', function() {
        let route = ''; 
        before(function(done) {
            while(!tetsQueue[4]);
            route = '/favorites/' + newsId;
            done();
        });
        after(function(done) {
            tetsQueue[5] = true;
            done();
        });
        it(`Users not authorized, status 401`, function(done) {
            chai.request(url)
                .delete(route)
                .set('content-type', 'application/json')
                .end(function(err, res) {
                expect(res).to.have.status(401);
                expect(err).to.be.null;
                done();
                });
        });
        it(`Users authorized, status 200`, function(done) {
            chai.request(url)
                .delete(route)
                .set('content-type', 'application/json')
                .set('Authorization', 'Bearer ' + accessToken)
                .send()
                .end(function(err, res) {

                expect(res).to.have.status(200);
                expect(err).to.be.null;
                done();
                });
        });
    });  

    describe('Get users news to url', function() {
        let route = '';
        let notValidUrl = '';

        before(function(done) {
            while(!tetsQueue[5]);
            route = '/feed/news/' + newsId;
            notValidUrl = route + 'j';
            done();
        });
        after(function(done) {
            tetsQueue[6] = true;
            done();
        });
        it(`Get news, valid link, status 200`, function(done) {
            chai.request(url)
                .get(route)
                .set('content-type', 'application/json')
                .send()
                .end(function(err, res) {

                expect(res).to.have.status(200);
                expect(err).to.be.null;

                const result = JSON.parse(res.text);
                expect(result).to.not.have.a.property('error');
                expect(result).to.be.an('object');
                expect(result).to.have.a.property('_id');
                expect(result).to.have.a.property('title');
                expect(result).to.have.a.property('description');
                expect(result).to.have.a.property('urlToImage');
                expect(result).to.have.a.property('content');
                expect(result).to.have.a.property('author');
                expect(result).to.have.a.property('userId');
                expect(result).to.have.a.property('url');
                expect(result).to.have.a.property('publishedAt');
                expect(result).to.have.a.property('userId');

                done();
                });
        });
        it(`Get news, not valid link, status 403`, function(done) {
            chai.request(url)
                .get(notValidUrl)
                .set('content-type', 'application/json')
                .send()
                .end(function(err, res) {
                expect(res).to.have.status(403);
                expect(err).to.be.null;
                done();
                });
        });
    });  
        

    describe('Get all news', function() {
        before(function(done) {
            while(!tetsQueue[6]);
            done();
        });
        after(function(done) {
            tetsQueue[7] = true;
            done();
        });
        const route = '/feed'
        it(`Get all news, status 200`, function(done) {
            chai.request(url)
                .get(route)
                .set('content-type', 'application/json')
                .send()
                .end(function(err, res) {
                expect(res).to.have.status(200);
                expect(err).to.be.null;

                const result = JSON.parse(res.text);
                expect(result).to.not.have.a.property('error');
                expect(result).to.be.an('array');

                const news = result[0];

                expect(news).to.have.a.property('_id');
                expect(news).to.have.a.property('title');
                expect(news).to.have.a.property('description');
                expect(news).to.have.a.property('urlToImage');
                expect(news).to.have.a.property('content');
                expect(news).to.have.a.property('author');
                expect(news).to.have.a.property('userId');
                expect(news).to.have.a.property('url');
                expect(news).to.have.a.property('publishedAt');

                done();
                });
        });
    });  

    describe('Delete news to id', function() {
        before(function(done) {
            while(!tetsQueue[7]);
            done();
        });
        after(function(done) {
            tetsQueue[8] = true;
            done();
        });
        const route = '/feed/'
        it(`Delete not authorized, status 401`, function(done) {
            chai.request(url)
                .delete(route + newsId)
                .set('content-type', 'application/json')
                .send()
                .end(function(err, res) {
                expect(res).to.have.status(401);
                expect(err).to.be.null;
                done();
                });
        });
        it(`Delete authorized, users news, status 200`, function(done) {
            chai.request(url)
                .delete(route + newsId)
                .set('content-type', 'application/json')
                .set('Authorization', 'Bearer ' + accessToken)
                .send()
                .end(function(err, res) {
                expect(res).to.have.status(200);
                expect(err).to.be.null;
                done();
                });
        });
        it(`Delete authorized, not users news, status 404`, function(done) {
            chai.request(url)
                .delete(route + newsId)
                .set('content-type', 'application/json')
                .set('Authorization', 'Bearer ' + accessToken)
                .send()
                .end(function(err, res) {
                expect(res).to.have.status(404);
                expect(err).to.be.null;
                done();
                });
        });
    });  

    describe('User logout', function() {
        before(function(done) {
            while(!tetsQueue[8]);
            done();
        });
        const route = '/users/logout'
        it(`Logout not authorized, status 401`, function(done) {
            chai.request(url)
                .get(route)
                .set('content-type', 'application/json')
                .send()
                .end(function(err, res) {
                expect(res).to.have.status(401);
                expect(err).to.be.null;
                done();
                });
        });
        it(`Logout authorized, status 200`, function(done) {
            chai.request(url)
                .get(route)
                .set('content-type', 'application/json')
                .set('Authorization', 'Bearer ' + accessToken)
                .send()
                .end(function(err, res) {
                expect(res).to.have.status(200);
                expect(err).to.be.null;
                done();
            });
        });
    });   

    after(async() => {
        await endTest();
        process.exit(0);
    });
