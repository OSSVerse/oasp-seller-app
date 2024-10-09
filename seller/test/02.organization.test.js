setTimeout(() => { console.log('Sleep!') }, 30000)


require('dotenv').config();
process.env.NODE_ENV = 'test';
console.log('======Node Environment organization test case===========:', process.env.NODE_ENV);
console.log("========process.env.JWT_TOKEN_TEST========", process.env.JWT_TOKEN_TEST);

const request = require('supertest');
const chai = require('chai');
const { expect } = chai;
const app = require('../app/server'); // Adjust the path to your server file

describe('Organization API', () => {

    // Replace with your actual API endpoint and data
    const createOrgEndpoint = '/api/v1/organizations';

    describe('POST /api/v1/organizations', () => {

        // create organization
        it('should successfully create organization, and organization admin', async () => {
            const validOrg = {
                "user": {
                    "email": "Tokomo1@gmail.com",
                    "mobile": "9000000002",
                    "name": "Tokomo1",
                    "password": "Tokomo@123"
                },
                "providerDetails": {
                    "name": "Tokomo1",
                    "address": "123 Example Street, Example City, Country",
                    "contactEmail": "Tokomo@example.com",
                    "contactMobile": "0987654321",
                    "addressProof": "Example Address Proof",
                    "idProof": "74ffec96-98bd-4275-b1cc-68834405c9ea",
                    "bankDetails": {
                        "accHolderName": "Tokomo",
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
            }

            const response = await request(app)
                .post(createOrgEndpoint)
                .send(validOrg);

            expect(response.status).to.equal(200);

        })
    });
});