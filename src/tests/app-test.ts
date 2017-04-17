import {expect} from 'chai';
import * as request from 'request';
import AppKernel from './app/AppKernel';

describe('App >', function() {
    describe('Create and run an application', function() {
        let kernel = new AppKernel();

        before('start server', function(done) {
            kernel.enableSocket();
            kernel.listen(4242);
            (kernel as any).server.on('listening', () => {
                done();
            });
        });

        after('close server', function() {
            kernel.close();
        });

        it('should start server', function(done) {
            request.get('http://localhost:4242/', {}, (error, response) => {
                expect(error).to.be.null;
                expect(response).to.be.not.null;
                done();
            });
        });

        it('should expose /posts route', function(done) {
            request.get('http://localhost:4242/app/posts/', {}, (error, response) => {
                expect(error).to.be.null;
                expect(response).to.be.not.null;
                expect(response.statusCode).to.be.equal(200);
                done();
            });
        });

        it('should expose /posts/:id route', function(done) {
            request.get('http://localhost:4242/app/posts/1', {}, (error, response, body) => {
                expect(error).to.be.null;
                expect(response).to.be.not.null;
                expect(response.statusCode).to.be.equal(200);
                let data = JSON.parse(body);
                expect(data.post).to.be.equal('1');
                done();
            });
        });
    });
});
