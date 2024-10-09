require('dotenv').config();
process.env.NODE_ENV = 'test';
console.log('======Node Environment login test case===========:', process.env.NODE_ENV);

const request = require('supertest');
const chai = require('chai');
const { expect } = chai;
const app = require('../app/server'); // Adjust the path to your server file



describe('Authentication API', () => {

    // Replace with your actual API endpoint and data
    const loginEndpoint = '/api/v1/auth/login';

    describe('POST /api/v1/auth/login', () => {

        // login success
        it('should successfully log in with valid credentials and return a JWT token', async () => {
            // Simulate multiple login attempts within a short time
            const validLogin = {
                email: 'sa@mailinator.com',
                password: 'Super@123'
            };

            const response = await request(app)
                .post(loginEndpoint)
                .send(validLogin);

            expect(response.status).to.equal(200);
            if (response.body.data.hasOwnProperty('access_token')) {
                expect(response.body.data).to.have.property('access_token'); // Ensure JWT token is present
                console.log("========", response.body.data.access_token, "===============");
                process.env.JWT_TOKEN_TEST = response.body.data.access_token;
            } else {
                console.log("=========================")
            }


        });

        // login failure
        it('should return a 401 (Unauthorized) for invalid credentials', async () => {
            const invalidLogin = {
                email: 'sa@mailinator.com',
                password: 'wrongpassword'
            };

            const response = await request(app)
                .post(loginEndpoint)
                .send(invalidLogin);

            expect(response.status).to.equal(401);
            expect(response.body).to.have.property('error'); // Check for error message
            expect(response.body.error).to.equal("Incorrect username or password, Please check and try again");

        });
    });
});