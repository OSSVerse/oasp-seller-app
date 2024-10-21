const request = require('supertest');
const chai = require('chai');
const { expect } = chai;
const app = require('../app'); // Adjust the path to your server file
import { v4 as uuidv4 } from 'uuid';

// Example test case
describe('Handler API', () => {

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    let handlerEndPoint = '/api/v1/client/handler';
    let domain = "Software Assurance";
    let transaction_id = uuidv4();
    let message_id = uuidv4();
    const productName = 'open-adas';
    const productCategory = 'OSS Project';

    let context = {
        "domain": `${domain}`,
        "location": {
            "city": {
                "name": "Bangalore",
                "code": "std:080"
            },
            "country": {
                "name": "India",
                "code": "IND"
            }
        },
        "action": `search`,
        "version": "1.1.0",
        "transaction_id": `${transaction_id}`,
        "message_id": `${message_id}`,
        "timestamp": "2023-10-09T04:46:28.012Z",
        "bap_id": "{{bap_id}}",
        "bap_uri": "{{bap_uri}}"
    };

    let billing = {
        "name": "Buyer Name",
        "address": "Buyer address with pincode",
        "state": {
            "name": "buyer state"
        },
        "city": {
            "name": "buyer city"
        },
        "email": "buyer@example.com",
        "phone": "9999999999"
    };

    let message;
    let handlerRequest;

    describe('POST /api/v1/client/handler', () => {
        // Each test case will run in order as defined
        console.log("================== action - search ==================================")
        it('Search, should return 202', async () => {
            message = {
                "intent": {
                    "item": {
                        "descriptor": {
                            "name": `${productName}`
                        }
                    },
                    "category": {
                        "descriptor": {
                            "id": `${productCategory}`
                        }
                    }
                }
            };

            context.action = 'search';
            handlerRequest = {
                context,
                message
            };

            const res = await request(app).post(handlerEndPoint).send(handlerRequest);
            expect(res.status).to.equal(202);

            // Sleep for 30 second before each test
            await sleep(25000);

        });

        console.log("================== action - select ==================================")
        it('Select, should return 202', async () => {
            message = {
                "order": {
                    "provider": {
                        "id": "c9788812-68cd-4ed0-ad5d-493f8000c264"
                    },
                    "items": [
                        {
                            "id": "53b8e7fc-4b5c-4647-a590-83cb710ece0c"
                        }
                    ]
                }
            };
            context.action = 'select';
            handlerRequest = {
                context,
                message
            };

            const res = await request(app).post(handlerEndPoint).send(handlerRequest);
            expect(res.status).to.equal(202);

            // Sleep for 30 second before each test
            await sleep(25000);
        });

        console.log("================== action - init ==================================")
        it('Init, should return 202', async () => {
            message = {
                "order": {
                    "provider": {
                        "id": "c9788812-68cd-4ed0-ad5d-493f8000c264"
                    },
                    "items": [
                        {
                            "id": "53b8e7fc-4b5c-4647-a590-83cb710ece0c"
                        }
                    ]
                },
                "billing": billing
            };
            context.action = 'init';
            handlerRequest = {
                context,
                message
            };

            const res = await request(app).post(handlerEndPoint).send(handlerRequest);
            expect(res.status).to.equal(202);

            // Sleep for 30 second before each test
            await sleep(25000);
        });

        console.log("================== action - confirm ==================================")
        it('Confirm, should return 202', async () => {
            message = {
                "order": {
                    "provider": {
                        "id": "c9788812-68cd-4ed0-ad5d-493f8000c264"
                    },
                    "items": [
                        {
                            "id": "53b8e7fc-4b5c-4647-a590-83cb710ece0c"
                        }
                    ]
                },
                "billing": billing
            };
            context.action = 'confirm';
            handlerRequest = {
                context,
                message
            };

            const res = await request(app).post(handlerEndPoint).send(handlerRequest);
            expect(res.status).to.equal(202);

            // Sleep for 30 second before each test
            await sleep(25000);
        });

        /*
        // can't possible here because order details is not returned 
        /// as part of previous API calls - only 202 - accepted is returned
        console.log("================== action - status ==================================")
        it('Status, should return 202', async () => {
            message = {
                "order_id": "order-$2a$10$KMrRPY5h5POrk2KmDFK2O.oaY7.T/yzRcv79bzsPXi5i7GBeSAqI6"
            };
            context.action = 'status';
            handlerRequest = {
                context,
                message
            };

            const res = await request(app).post(handlerEndPoint).send(handlerRequest);
            expect(res.status).to.equal(202);

            // Sleep for 30 second before each test
            await sleep(25000);
        });
        */
    });
});
