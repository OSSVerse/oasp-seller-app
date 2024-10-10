require('dotenv').config();
console.log('======Node Environment order test case===========:', process.env.NODE_ENV);

const request = require('supertest');
const chai = require('chai');
const { expect } = chai;
const app = require('../app/server'); // Adjust the path to your server file

describe('Order API', () => {
    const orderEndpoint = '/api/v1/orders';
    const loginEndpoint = '/api/v1/auth/login';

    let admin_jwt_token; // Declare a variable to hold the JWT token

    let orgAdminEmail = 'Tokomo@gmail.com';
    let orgAdminPass = 'Tokomo@123';

    let order_id;

    // Group for post request
    describe('Order /api/v1/orders', () => {

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

        // get all orders for user
        it('should return a list of orders for user', async () => {
            const response = await request(app)
                .get(orderEndpoint)
                .set('access-token', `Bearer ${admin_jwt_token}`);
            // console.log(response);
            expect(response.status).to.equal(200);

            expect(response.body).to.have.property('data'); // Ensure the 'data' property exists
            expect(response.body.data).to.be.an('array'); // Check if it's an array

            if (response.body.data.length > 0) {
                order_id = response.body.data[0]._id;
                console.log("===========order_id=======", order_id)
            } else { console.log("===========No orders for this user/ provider============") }
        });

        // update order status and fullfilment details for an order by _id
        it('should update the order status', async () => {
            const updatePayload = {
                status: "Completed",
                fulfillments: [
                    {
                        name: "env 1",
                        link: "https://link.test.co"
                    }
                ]
            };

            const res = await request(app)
                .post(`/api/v1/orders/${order_id}/status`)
                .set('access-token', `Bearer ${admin_jwt_token}`)
                .set('Content-Type', 'application/json')
                .send(updatePayload);


            expect(res.status).to.equal(200); // Adjust based on expected status code
            expect(res.body).to.have.property('state'); // Check status
            console.log("=========== order state=======", res.body.state);
            expect(res.body.state).to.equal('Completed');
            expect(res.body).to.have.property('fulfillments').that.is.an('array');
            expect(res.body.fulfillments[0]).to.have.property('name'); // Check fulfillment name
            expect(res.body.fulfillments[0]).to.have.property('link'); // Check fulfillment link
        });
    })
})
