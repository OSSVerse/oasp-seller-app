require('dotenv').config();
console.log('======Node Environment product test case===========:', process.env.NODE_ENV);

const request = require('supertest');
const chai = require('chai');
const { expect } = chai;
const app = require('../app/server'); // Adjust the path to your server file

describe('Product API', () => {
    const productEndpoint = '/api/v1/products';
    const loginEndpoint = '/api/v1/auth/login';

    let admin_jwt_token; // Declare a variable to hold the JWT token

    let orgAdminEmail = 'Tokomo@gmail.com';
    let orgAdminPass = 'Tokomo@123';

    // Group for post request
    describe('POST /api/v1/products', () => {



        // Login before running the tests to get jwt_token
        before(async () => {
            const validLogin = {
                email: `${orgAdminEmail}`,
                password: `${orgAdminPass}`
            };

            const response = await request(app)
                .post(loginEndpoint)
                .send(validLogin);

            expect(response.status).to.equal(200);
            expect(response.body.data).to.have.property('access_token'); // Ensure JWT token is present
            admin_jwt_token = response.body.data.access_token; // Store the token for later use
            expect(typeof admin_jwt_token).to.be.a('string');
        });

        let productName = "open-adas";
        let productCode = "PC00100";
        // Create product
        it('should successfully create product', async () => {
            const createProduct = {
                "commonDetails": {
                    "productCode": `${productCode}`,
                    "productName": `${productName}`,
                    "MRP": 11000,
                    "purchasePrice": 11000,
                    "productCategory": "OSS Project",
                    "productSubcategory1": "Assurance & Assessment Service",
                    "longDescription": "Assurance & Assessment Service",
                    "description": "Assurance & Assessment Service",
                    "type": "item"
                }
            };

            const response = await request(app)
                .post(productEndpoint)
                .set('access-token', `Bearer ${admin_jwt_token}`) // Pass the token here
                .send(createProduct);

            expect(response.status).to.equal(200);
            expect(response.body.data).to.have.property('_id');
            expect(response.body.data).to.have.property('productName');
            expect(response.body.data.productName).to.equal(`${productName}`);
            expect(response.body.data).to.have.property('productCode');
            expect(response.body.data.productCode).to.equal(`${productCode}`);
        });
    });

    // Group for GET requests
    describe('GET /api/v1/products', () => {
        let productId;
        let productName;
        let productCode;

        // get all products for user
        it('should return a list of products', async () => {
            const response = await request(app)
                .get(productEndpoint)
                .set('access-token', `Bearer ${admin_jwt_token}`);
            // console.log(response);
            expect(response.status).to.equal(200);

            expect(response.body).to.have.property('data'); // Ensure the 'data' property exists
            expect(response.body.data).to.be.an('array'); // Check if it's an array
            expect(response.body.data.length).to.be.greaterThan(0); // Ensure the array length is > 0

            productId = response.body.data[0]._id;
            productName = response.body.data[0].productName;
            productCode = response.body.data[0].productCode;
        });

        // Get product by ID
        it('should return a single product by ID', async () => {

            const response = await request(app)
                .get(`${productEndpoint}/${productId}`)
                .set('access-token', `Bearer ${admin_jwt_token}`); // Pass the token here

            console.log("===========product by id======== ", response);
            expect(response.status).to.equal(200);

            expect(response.body).to.have.property('commonDetails');
            expect(response.body.commonDetails).to.have.property('productName');
            expect(response.body.commonDetails.productName).to.equal(`${productName}`);

            expect(response.body.commonDetails).to.have.property('productCode');
            expect(response.body.commonDetails.productCode).to.equal(`${productCode}`);
        });
    });


});