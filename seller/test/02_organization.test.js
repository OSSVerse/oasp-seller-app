require('dotenv').config();
console.log('======Node Environment organization test case===========:', process.env.NODE_ENV);

const request = require('supertest');
const chai = require('chai');
const { expect } = chai;
const app = require('../app/server'); // Adjust the path to your server file

describe('Organization API', () => {

    const orgEndpoint = '/api/v1/organizations';
    const loginEndpoint = '/api/v1/auth/login';

    let super_jwt_token; // Declare a variable to hold the JWT token

    let org = 'Tokomo';
    let orgAdminName = 'Tokomo';
    let orgAdminEmail = 'Tokomo@gmail.com';
    let orgAdminPass = 'Tokomo@123';


    // Group for post request
    describe('POST /api/v1/organizations', () => {

        // Login before running the tests to get jwt_token
        before(async () => {
            const validLogin = {
                email: 'sa@mailinator.com',  // Replace with super admin credentials
                password: 'Super@123'
            };

            const response = await request(app)
                .post(loginEndpoint)
                .send(validLogin);

            expect(response.status).to.equal(200);
            expect(response.body.data).to.have.property('access_token'); // Ensure JWT token is present
            super_jwt_token = response.body.data.access_token; // Store the token for later use
            expect(typeof super_jwt_token).to.be.a('string');
        });

        // Create organization
        it('should successfully create organization, and organization admin', async () => {
            const createOrg = {
                "user": {
                    "email": `${orgAdminEmail}`,
                    "mobile": "9000000002",
                    "name": `${orgAdminName}`,
                    "password": `${orgAdminPass}`
                },
                "providerDetails": {
                    "name": `${org}`,
                    "address": "123 Example Street, Example City, Country",
                    "contactEmail": "ex@example.com",
                    "contactMobile": "0987654321",
                    "addressProof": "Example Address Proof",
                    "idProof": "74ffec96-98bd-4275-b1cc-68834405c9ea",
                    "bankDetails": {
                        "accHolderName": "example name",
                        "accNumber": "1234567890",
                        "IFSC": "IFSC0001234",
                        "cancelledCheque": "Cancelled Cheque Document URL",
                        "bankName": "Bank of Springfield",
                        "branchName": "Main Branch"
                    },
                    "PAN": {
                        "PAN": "ABCDE1234F",
                        "proof": "Example PAN Proof"
                    },
                    "GSTN": {
                        "GSTN": "22AAAAA0000A1Z5",
                        "proof": "Example GSTN Proof"
                    },
                    "FSSAI": "12345678901234"
                }
            };

            const response = await request(app)
                .post(orgEndpoint)
                .set('access-token', `Bearer ${super_jwt_token}`) // Pass the token here
                .send(createOrg);

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('providerDetail');
            expect(response.body.providerDetail).to.have.property('_id');
        });
    });

    // Group for GET requests
    describe('GET /api/v1/organizations', () => {
        let orgId;
        let orgName;

        // get all organization for user
        it('should return a list of organizations', async () => {
            const response = await request(app)
                .get(orgEndpoint)
                .set('access-token', `Bearer ${super_jwt_token}`);
            // console.log(response);
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('organizations'); // Ensure the 'organizations' property exists
            expect(response.body.organizations).to.be.an('array'); // Check if it's an array
            expect(response.body.organizations.length).to.be.greaterThan(0); // Ensure the array length is > 0

            orgId = response.body.organizations[0]._id;
            orgName = response.body.organizations[0].name;
        });

        // Get organization by ID
        it('should return a single organization by ID', async () => {

            const response = await request(app)
                .get(`${orgEndpoint}/${orgId}`)
                .set('access-token', `Bearer ${super_jwt_token}`); // Pass the token here

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('providerDetail');
            expect(response.body.providerDetail).to.have.property('name');
            expect(response.body.providerDetail.name).to.equal(`${orgName}`);

        });
    });
});
