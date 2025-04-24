const sinon = require('sinon');
const request = require('supertest');
const app = require('../../../app/server');
const OrderController = require('../../../app/modules/order/controllers/order.controller');
const { authentication, authorisation } = require('../../../app/lib/middlewares');

describe('Order Routes with Middleware', () => {
    let server;
    let sandbox;

    before(() => {
        sandbox = sinon.createSandbox(); // Create a Sinon sandbox
        server = app; // Initialize the app/server
    });

    after(() => {
        sandbox.restore(); // Restore all mocked methods
        server.close(); // Close the server after tests
    });

    beforeEach(() => {
        // Mock all controller methods
        sandbox.stub(OrderController.prototype, 'create').resolves();
        sandbox.stub(OrderController.prototype, 'list').resolves();
        sandbox.stub(OrderController.prototype, 'listReturnRequests').resolves();
        sandbox.stub(OrderController.prototype, 'get').resolves();
        sandbox.stub(OrderController.prototype, 'updateOrderStatus').resolves();
        sandbox.stub(OrderController.prototype, 'getONDC').resolves();
        sandbox.stub(OrderController.prototype, 'ondcUpdate').resolves();
        sandbox.stub(OrderController.prototype, 'cancel').resolves();
        sandbox.stub(OrderController.prototype, 'cancelOrder').resolves();
        sandbox.stub(OrderController.prototype, 'cancelItems').resolves();
        sandbox.stub(OrderController.prototype, 'updateReturnItem').resolves();

        // Mock middleware
        sandbox.stub(authentication, 'middleware').returns((req, res, next) => next());
        sandbox.stub(authorisation, 'middleware').returns((req, res, next) => next());
    });

    afterEach(() => {
        sandbox.restore(); // Restore all mocks after each test
    });

    it('POST /v1/orders should call orderController.create', async () => {
        await request(server)
            .post('/v1/orders')
            .send({ orderData: 'sampleData' }) // Mock payload
            .expect(200); // Assuming successful response

        sinon.assert.calledOnce(OrderController.prototype.create);
    });

    it('GET /v1/orders should call authentication middleware and orderController.list', async () => {
        await request(server)
            .get('/v1/orders')
            .set('Authorization', 'Bearer mockToken') // Simulate authentication header
            .expect(200); // Assuming successful response

        sinon.assert.calledOnce(authentication.middleware);
        sinon.assert.calledOnce(OrderController.prototype.list);
    });

    it('GET /v1/orders/return/request should call authentication middleware and orderController.listReturnRequests', async () => {
        await request(server)
            .get('/v1/orders/return/request')
            .set('Authorization', 'Bearer mockToken') // Simulate authentication header
            .expect(200); // Assuming successful response

        sinon.assert.calledOnce(authentication.middleware);
        sinon.assert.calledOnce(OrderController.prototype.listReturnRequests);
    });

    it('GET /v1/orders/:orderId should call orderController.get', async () => {
        const orderId = '12345';
        await request(server)
            .get(`/v1/orders/${orderId}`)
            .expect(200); // Assuming successful response

        sinon.assert.calledOnce(OrderController.prototype.get);
    });

    it('POST /v1/orders/:orderId/status should call authentication, authorisation, and orderController.updateOrderStatus', async () => {
        const orderId = '12345';
        await request(server)
            .post(`/v1/orders/${orderId}/status`)
            .set('Authorization', 'Bearer mockToken') // Simulate authentication header
            .send({ status: 'Accepted' }) // Mock payload
            .expect(200); // Assuming successful response

        sinon.assert.calledOnce(authentication.middleware);
        sinon.assert.calledOnce(authorisation.middleware);
        sinon.assert.calledOnce(OrderController.prototype.updateOrderStatus);
    });

    it('GET /v1/orders/:orderId/ondcGet should call orderController.getONDC', async () => {
        const orderId = '12345';
        await request(server)
            .get(`/v1/orders/${orderId}/ondcGet`)
            .expect(200); // Assuming successful response

        sinon.assert.calledOnce(OrderController.prototype.getONDC);
    });

    it('PUT /v1/orders/:orderId/ondcUpdate should call orderController.ondcUpdate', async () => {
        const orderId = '12345';
        await request(server)
            .put(`/v1/orders/${orderId}/ondcUpdate`)
            .send({ updateData: 'mockData' }) // Mock payload
            .expect(200); // Assuming successful response

        sinon.assert.calledOnce(OrderController.prototype.ondcUpdate);
    });

    it('POST /v1/orders/:orderId/cancel should call orderController.cancel', async () => {
        const orderId = '12345';
        await request(server)
            .post(`/v1/orders/${orderId}/cancel`)
            .expect(200); // Assuming successful response

        sinon.assert.calledOnce(OrderController.prototype.cancel);
    });

    it('POST /v1/orders/:orderId/cancelOrder should call orderController.cancelOrder', async () => {
        const orderId = '12345';
        await request(server)
            .post(`/v1/orders/${orderId}/cancelOrder`)
            .expect(200); // Assuming successful response

        sinon.assert.calledOnce(OrderController.prototype.cancelOrder);
    });

    it('POST /v1/orders/:orderId/item/cancel should call orderController.cancelItems', async () => {
        const orderId = '12345';
        await request(server)
            .post(`/v1/orders/${orderId}/item/cancel`)
            .expect(200); // Assuming successful response

        sinon.assert.calledOnce(OrderController.prototype.cancelItems);
    });

    it('POST /v1/orders/:orderId/item/return should call orderController.updateReturnItem', async () => {
        const orderId = '12345';
        await request(server)
            .post(`/v1/orders/${orderId}/item/return`)
            .expect(200); // Assuming successful response

        sinon.assert.calledOnce(OrderController.prototype.updateReturnItem);
    });
});