const request = require('supertest');
const chai = require('chai');
const { expect } = chai;
const app = require('../app'); // Adjust the path to your server file


// Example test case
describe('Handler API', () => {

    let handlerEndPoint = '/api/v1/client/handler';
    const searchContext = {
        "context": {
            "domain": "uei:charging",
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
            "action": "search",
            "version": "1.1.0",
            "transaction_id": "fc24f1e9-6d01-44bf-888c-d5884ca0f66f",
            "message_id": "yuyuyuyuy",
            "timestamp": "2023-10-09T04:46:28.012Z",
            "bap_id": "{{bap_id}}",
            "bap_uri": "{{bap_uri}}"
        },
        "message": {
            "intent": {
                "item": {
                    "descriptor": {
                        "name": "open-adas"
                    }
                },
                "category": {
                    "descriptor": {
                        "id": "OSS Project"
                    }
                }
            }
        }
    }

    /*
   describe('POST /api/v1/client/handler', () => {
 
       it('should return 201', async () => {
           const res = await request(app).post().send();
 
 
           expect(res.status).to.equal(200);
           
});
});*/
});