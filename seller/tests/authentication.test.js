console.log("======= process.env.NODE_ENV =======", process.env.NODE_ENV);

const chai = require('chai');
const expect = chai.expect;
const supertest = require('supertest');
const app = require('../app/server');  // Point to server.js

console.log("======= process.env.NODE_ENV =======", process.env.NODE_ENV);

describe('Authentication Routes', () => {
    describe('POST /api/v1/auth/login', () => {

        it('should return error for invalid credentials', (done) => {
            const invalidLogin = {
                email: 'sa@mailinator.com',
                password: 'Super@1234'
            };

            supertest(app)
                .post('http://localhost:3008/api/v1/auth/login')
                .send(invalidLogin)
                .expect(401)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) return done(err);

                    expect(res.body).to.have.property('error');
                    // If the error message is specific to invalid credentials
                    expect(res.body.error).to.equal('Incorrect username or password, Please check and try again');

                    done();
                });
        });

        it('Valid login - super admin', (done) => {
            // Simulate multiple login attempts within a short time
            const validLogin = {
                email: 'sa@mailinator.com',
                password: 'Super@123'
            };

            supertest(app)
                .post('http://localhost:3008/api/v1/auth/login')
                .send(validLogin)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);

                    // Repeat multiple times, potentially with delays
                    // Check for rate limiting error messages or response codes
                    // ...

                    done();
                });
        });
    });
});