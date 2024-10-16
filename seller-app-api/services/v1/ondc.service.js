import { v4 as uuidv4 } from 'uuid';
//import config from "../../lib/config";
import HttpRequest from "../../utils/HttpRequest";
import { InitRequest, ConfirmRequest, SelectRequest } from '../../models'

import ProductService from './product.service'
const productService = new ProductService();
import logger from '../../lib/logger'


const env = process.env.NODE_ENV;
const path = require('path');
const configPath = path.join(__dirname, `../../lib/config/${env}_env_config.json`);
const config = require(configPath);

//const fs = require('fs');
//const configContent = fs.readFileSync(configPath, 'utf-8');

class OndcService {

    async handler(payload = {}, req = {}) {

        // console.log("===========configContent===============", configContent);

        // console.log("=============console.log(__dirname)==============", __dirname)
        // console.log("============process.env.NODE_ENV==============", process.env.NODE_ENV)
        // console.log("=======================seller-app-config======================", config);
        // console.log("=======================seller-app-config-sellerConfig======================", config.sellerConfig);


        const requestType = payload.context.action;
        try {
            switch (requestType) {
                case 'search':
                    const result = await this.productSearch(payload, req);
                    return result;

                case 'select':
                    return await this.orderSelect(req.body, req);

                case 'init':
                    return await this.orderInit(req.body, req);

                case 'confirm':
                    return await this.orderConfirm(req.body, req);

                case 'cancel':
                    return await this.orderCancel(req.body, req);

                case 'track':
                    return await this.orderTrack(req.body, req);

                case 'status':
                    return await this.orderStatus(req.body, req);

                case '/status/cancel':
                    return await this.orderCancelFromSeller(req.body, req);

                case '/status/updateOrder':
                    return await this.orderStatusUpdate(req.body, req);

                case '/status/updateOrderItems':
                    return await this.handleCancel(req.body, req);

                case 'update':
                    return await this.orderUpdate(req.body, req);

                case 'support':
                    return await this.orderSupport(req.body, req);
            }
        } catch (error) {
            console.error('Error processing request:', error);
        }
    }



    async productSearch(payload = {}, req = {}) {
        try {

            // logger.log('info', `[Ondc Service] search logistics payload : param >>:`, payload);
            // logger.log('info', `========== search payload=============`, payload.message.intent);
            // logger.log('info', `========== search payload cat id=============`, payload?.message?.intent?.category?.descriptor?.id || "no id");
            // logger.log('info', `========== search payload cat name=============`, payload?.message?.intent?.category?.descriptor?.name || "no name");

            const order = payload;
            const selectMessageId = payload.context.message_id;

            this.postSearchRequest(order, selectMessageId)

            return {}
        } catch (err) {
            logger.error('error', `[Ondc Service] search logistics payload - search logistics payload : param :`, err);
            throw err;
        }
    }

    async orderSelect(payload = {}, req = {}) {
        try {
            // const {criteria = {}, payment = {}} = req || {};

            logger.log('info', `[Ondc Service] search logistics payload : param :`, payload);

            // const order = payload.message.order;
            const selectMessageId = payload.context.message_id;
            const logisticsMessageId = uuidv4();
            // logger.log('info', "============ check-point 1 ======================");
            let storeLocationEnd = {}
            let totalProductValue = 0
            for (let items of payload.message.order.items) {
                const product = await productService.getForOndc(items.id)
                totalProductValue += product.MRP
            }
            // logger.log('info', "============ check-point 2 ======================");
            /*
                        let org = await productService.getOrgForOndc(payload.message.order.provider.id);
            
                        if (org.providerDetail.storeDetails) {
                            storeLocationEnd = {
                                gps: `${org.providerDetail.storeDetails.location.lat},${org.providerDetail.storeDetails.location.long}`,
                                address: {
                                    area_code: org.providerDetail.storeDetails.address.area_code
                                }
                            }
                        }
            */
            /*
                        const searchRequest = {
                            "context": {
                                "domain": "Software Assurance",
                                "country": "IND",
                                "city": "std:080",
                                "action": "search",
                                "core_version": "1.1.0",
                                "bap_id": config.get("sellerConfig").BPP_ID,
                                "bap_uri": config.get("sellerConfig").BPP_URI,
                                "transaction_id": uuidv4(),
                                "message_id": logisticsMessageId,
                                "timestamp": new Date(),
                                "ttl": "PT30S"
                            },
                            "message": {
                                "intent": {
                                    "category": {
                                        "id": "Standard Delivery" //TODO: based on provider it should change
                                    },
                                    "provider": {
                                        "time": { //TODO: HARD Coded
                                            "days": "1,2,3,4,5,6,7",
                                            "range": {
                                                "end": "2359",
                                                "start": "0000"
                                            }
                                        }
                                    },
                                    "fulfillment": {
                                        "type": "Prepaid", //TODO: ONLY prepaid orders should be there
                                        "start": {
                                            "location": storeLocationEnd
                                        },
                                        "end": payload.message.order.fulfillments[0].end
                                    },
                                    "@ondc/org/payload_details": { //TODO: HARD coded
                                        "weight": {
                                            "unit": "Kilogram",
                                            "value": 10
                                        },
                                        "category": "Grocery", //TODO: @abhinandan Take it from Product schema
                                        "value": {
                                            "currency": "INR",
                                            "value": `${totalProductValue}`
                                        }
                                    }
                                }
                            }
                        }
            */
            //process select request and send it to protocol layer
            //  this.postSelectRequest(searchRequest, logisticsMessageId, selectMessageId)
            this.postSelectRequest(payload, logisticsMessageId, selectMessageId)

            return payload
        } catch (err) {
            logger.error('error', `[Ondc Service] search logistics payload - search logistics payload : param :`, err);
            throw err;
        }
    }

    async postSelectRequest(payload, logisticsMessageId, selectMessageId) {

        try {
            //1. post http to protocol/logistics/v1/search
            /*
                        try {
                            let headers = {};
                            let httpRequest = new HttpRequest(
                                'http://openfort-oasp.ossverse.com',
                                `/protocol/logistics/v1/search`,
                                'POST',
                                searchRequest,
                                headers
                            );
            
            
                            await httpRequest.send();
            
                        } catch (e) {
                            logger.error('error', `[Ondc Service] post http select response : `, e);
                            return e
                        }
            */
            //2. wait async to fetch logistics responses

            //async post request
            setTimeout(() => {
                logger.log('info', `[Ondc Service] search logistics payload - timeout : param :`, payload);
                // logger.log('info', "============ check-point 3 ======================");
                this.buildSelectRequest(payload, logisticsMessageId, selectMessageId)
            }, 10000); //TODO move to config
        } catch (e) {
            logger.error('error', `[Ondc Service] post http select response : `, e);
            return e
        }
    }

    async buildSelectRequest(payload, logisticsMessageId, selectMessageId) {

        try {
            logger.log('info', `[Ondc Service] search logistics payload - build select request : param :`, { logisticsMessageId, selectMessageId });
            //1. look up for logistics
            //let logisticsResponse = await this.getLogistics(logisticsMessageId, selectMessageId, 'select')
            //2. if data present then build select response
            let selectResponse = await productService.productSelect(payload)
            //3. post to protocol layer

            // logger.log('info', "============ check-point end ======================");
            await this.postSelectResponse(selectResponse);

        } catch (e) {
            logger.error('error', `[Ondc Service] search logistics payload - build select request : param :`, e);
            return e
        }
    }

    async postSearchRequest(searchRequest, selectMessageId) {
        try {
            this.buildSearchRequest(searchRequest, selectMessageId)
        } catch (e) {
            logger.error('error', `[Ondc Service] post http select response : `, e);
            return e;
        }
    }

    async buildSearchRequest(searchRequest, searchMessageId) {

        try {
            let searchResponse = await productService.search(searchRequest, searchMessageId)
            await this.postSearchResponse(searchResponse);

        } catch (e) {
            logger.error('error', `[Ondc Service] search logistics payload - build select request : param :`, e);
            return e
        }
    }

    //get all logistics response from protocol layer
    async getLogistics(logisticsMessageId, retailMessageId, type) {
        try {

            logger.log('info', `[Ondc Service] get logistics : param :`, { logisticsMessageId, retailMessageId, type });

            let headers = {};
            let query = ''
            if (type === 'select') {
                query = `logisticsOnSearch=${logisticsMessageId}&select=${retailMessageId}`
            } else if (type === 'init') {
                query = `logisticsOnInit=${logisticsMessageId}&init=${retailMessageId}`
            } else if (type === 'confirm') {
                query = `logisticsOnConfirm=${logisticsMessageId}&confirm=${retailMessageId}`
            } else if (type === 'track') {
                query = `logisticsOnTrack=${logisticsMessageId}&track=${retailMessageId}`
            } else if (type === 'status') {
                query = `logisticsOnStatus=${logisticsMessageId}&status=${retailMessageId}`
            } else if (type === 'update') {
                query = `logisticsOnUpdate=${logisticsMessageId}&update=${retailMessageId}`
            } else if (type === 'cancel') {
                query = `logisticsOnCancel=${logisticsMessageId}&cancel=${retailMessageId}`
            } else if (type === 'support') {
                query = `logisticsOnSupport=${logisticsMessageId}&support=${retailMessageId}`
            }
            let httpRequest = new HttpRequest(
                config.get("sellerConfig").BPP_URI,
                `/protocol/v1/response/network-request-payloads?${query}`,
                'get',
                {},
                headers
            );

            console.log(httpRequest)

            let result = await httpRequest.send();

            logger.log('info', `[Ondc Service] get logistics : response :`, result.data);

            return result.data

        } catch (e) {
            logger.error('error', `[Ondc Service] get logistics : response :`, e);
            return e
        }

    }

    //return select response to protocol layer
    async postSelectResponse(selectResponse) {
        try {

            logger.info('info', `[Ondc Service] post http select response : `, selectResponse);

            let headers = {};
            let httpRequest = new HttpRequest(
                config.sellerConfig.BPP_URI,
                //`http://openfort-oasp-client.ossverse.com`,
                `/on_select`,
                'POST',
                selectResponse,
                headers
            );

            let result = await httpRequest.send();

            return result.data

        } catch (e) {
            logger.error('error', `[Ondc Service] post http select response : `, e);
            return e
        }

    }

    //return select response to protocol layer
    async postSearchResponse(searchResponse) {
        try {

            // logger.info('info', `[Ondc Service] post http search response : `, searchResponse);

            let headers = {};
            let httpRequest = new HttpRequest(
                config.sellerConfig.BPP_URI,
                //'http://openfort-oasp-client.ossverse.com',
                `/on_search`,
                'POST',
                searchResponse,
                headers
            );

            let result = await httpRequest.send();

            // console.log("======search response from PS======", result);

            return result.data

        } catch (e) {
            logger.error('error', `[Ondc Service] post http search response : `, e);
            return e
        }

    }

    async orderInit(payload = {}, req = {}) {
        try {
            // const {criteria = {}, payment = {}} = req || {};
            logger.log('info', `[Ondc Service] init logistics payload : param :`, payload.message.order);

            const selectRequest = await SelectRequest.findOne({
                where: {
                    transactionId: payload.context.transaction_id,
                    providerId: payload.message.order.provider.id
                },
                order: [
                    ['createdAt', 'DESC']
                ]
            })

            // logger.log('info', "======== checkpoint 1 - DBO by trn.id ===========", selectRequest);

            let org = await productService.getOrgForOndc(payload.message.order.provider.id);

            const logistics = selectRequest.selectedLogistics;

            // logger.log('info', "======== checkpoint 2 - selectedLogistics ===========", logistics);

            let storeLocationEnd = {}
            if (org?.providerDetail?.storeDetails?.location?.lat) {
                storeLocationEnd = {
                    location: {
                        gps: `${org.providerDetail.storeDetails.location.lat},${org.providerDetail.storeDetails.location.long}`,
                        address: {
                            area_code: org.providerDetail.storeDetails.address.area_code,
                            name: org.providerDetail.name,
                            building: org.providerDetail.storeDetails.address.building,
                            locality: org.providerDetail.storeDetails.address.locality,
                            city: org.providerDetail.storeDetails.address.city,
                            state: org.providerDetail.storeDetails.address.state,
                            country: org.providerDetail.storeDetails.address.country
                        }
                    },
                    contact:
                    {
                        phone: org.providerDetail.storeDetails.supportDetails.mobile,
                        email: org.providerDetail.storeDetails.supportDetails.email
                    }
                }
            }

            // logger.log('info', "======== checkpoint 3 ===========");
            // logger.log('info', `[Ondc Service] old selected logistics :`, logistics);

            const order = payload.message.order;
            const initMessageId = payload.context.message_id;
            const logisticsMessageId = uuidv4(); //TODO: in future this is going to be array as packaging for single select request can be more than one
            const contextTimeStamp = new Date()


            //let deliveryType = logistics.message.catalog["bpp/providers"][0].items.find((element) => { return element.category_id === config.get("sellerConfig").LOGISTICS_DELIVERY_TYPE });


            // logger.log('info', "======== checkpoint 4 - deliveryType ===========", deliveryType);
            /*
            const initRequest = {
                "context": {
                    "domain": "Software Assurance",
                    "country": "IND",
                    "city": "std:080", //TODO: take city from retail context
                    "action": "init",
                    "core_version": "1.1.0",
                    "bap_id": config.get("sellerConfig").BPP_ID,
                    "bap_uri": config.get("sellerConfig").BPP_URI,
                    "bpp_id": logistics.context.bpp_id, //STORED OBJECT
                    "bpp_uri": logistics.context.bpp_uri, //STORED OBJECT
                    "transaction_id": logistics.context.transaction_id,
                    "message_id": logisticsMessageId,
                    "timestamp": contextTimeStamp,
                    "ttl": "PT30S"
                },
                "message": {
                    "order": {
                        "provider": {
                            "id": logistics.message.catalog["bpp/providers"][0].id
                        },
                        "items": [deliveryType],
                        "fulfillments": [{
                            "id": logistics.message.catalog["bpp/fulfillments"][0].id,
                            "type": logistics.message.catalog["bpp/fulfillments"][0].type,
                            "start": storeLocationEnd,
                            "end": order.fulfillments[0].end
                        }],
                        "billing": { //TODO: discuss whos details should go here buyer or seller
                            "name": order.billing.name,
                            "address": {
                                "name": order.billing.address.name,
                                "building": order.billing.address.building,
                                "locality": order.billing.address.locality,
                                "city": order.billing.address.city,
                                "state": order.billing.address.state,
                                "country": order.billing.address.country,
                                "area_code": order.billing.address.area_code
                            },
                            "tax_number": org.providerDetail.GSTN.GSTN ?? "27ACTPC1936E2ZN", //FIXME: take GSTN no
                            "phone": org.providerDetail.storeDetails.supportDetails.mobile, //FIXME: take provider details
                            "email": org.providerDetail.storeDetails.supportDetails.email, //FIXME: take provider details
                            "created_at": contextTimeStamp,
                            "updated_at": contextTimeStamp
                        },
                        "payment": {
                            "@ondc/org/settlement_details": []//order.payment['@ondc/org/settlement_details'] //TODO: need details of prepaid transactions to be settle for seller
                        }
                    }
                }
            }
                */
            //logger.log('info', `[Ondc Service] build init request :`, {logisticsMessageId,initMessageId: initMessageId});

            this.postInitRequest(payload, logisticsMessageId, initMessageId)
            // logger.log('info', "======== checkpoint 5 - deliveryType ===========");
            return { 'status': 'ACK' }
        } catch (err) {
            logger.error('error', `[Ondc Service] build init request :`, { error: err.stack, message: err.message });
            console.log(err)
            return err
        }
    }


    async postInitRequest(selectRequest, logisticsMessageId, selectMessageId) {

        try {
            //1. post http to protocol/logistics/v1/search
            /*
                        try {
                            let headers = {};
                            let httpRequest = new HttpRequest(
                                config.get("sellerConfig").BPP_URI,
                                `/protocol/logistics/v1/init`,
                                'POST',
                                searchRequest,
                                headers
                            );
            
            
                            await httpRequest.send();
                        } catch (e) {
                            logger.error('error', `[Ondc Service] post http select response : `, e);
                            return e
                        }
            */
            //2. wait async to fetch logistics responses

            //async post request
            setTimeout(() => {
                logger.log('info', `[Ondc Service] search logistics payload - timeout : param :`, selectRequest);
                this.buildInitRequest(selectRequest, logisticsMessageId, selectMessageId)
                // logger.log('info', "============ check-point 6 ======================");
            }, 5000); //TODO move to config
        } catch (e) {
            logger.error('error', `[Ondc Service] post http select response : `, e);
            return e
        }
    }

    async buildInitRequest(selectRequest, logisticsMessageId, initMessageId) {

        try {
            logger.log('info', `[Ondc Service] build init request :`, { logisticsMessageId, initMessageId });

            //1. look up for logistics
            // let logisticsResponse = await this.getLogistics(logisticsMessageId, initMessageId, 'init')

            //2. if data present then build select response
            // logger.log('info', `[Ondc Service] build init request - get logistics response :`, logisticsResponse);
            let selectResponse = await productService.productInit(selectRequest)

            //3. post to protocol layer
            await this.postInitResponse(selectResponse);

        } catch (err) {
            logger.error('error', `[Ondc Service] build init request :`, { error: err.stack, message: err.message });
            return err
        }
    }


    //return init response to protocol layer
    async postInitResponse(initResponse) {
        try {

            logger.info('info', `===== [Ondc Service] post init request ====== :`, initResponse);

            let headers = {};
            let httpRequest = new HttpRequest(
                config.sellerConfig.BPP_URI,
                // `http://openfort-oasp-client.ossverse.com`,
                `/on_init`,
                'POST',
                initResponse,
                headers
            );

            let result = await httpRequest.send();

            return result.data

        } catch (err) {
            logger.error('error', `[Ondc Service] post init request :`, { error: err.stack, message: err.message });
            return err
        }

    }

    async orderConfirm(payload = {}, req = {}) {
        try {
            //const {criteria = {}, payment = {}} = req || {};

            const bcrypt = require('bcryptjs');

            const orderData = JSON.stringify(payload.message.order);
            const hash = await bcrypt.hash(orderData, 10); // Adjust the salt rounds as needed

            const orderID = `order-${hash}`;
            //  console.log("=========orderID-hash===========", orderID);

            const selectRequest = await SelectRequest.findOne({
                where: {
                    transactionId: payload.context.transaction_id,
                    providerId: payload.message.order.provider.id
                },
                order: [
                    ['createdAt', 'DESC'],
                ]
            })


            const initRequest = await InitRequest.findOne({
                where: {
                    transactionId: payload.context.transaction_id,
                    providerId: payload.message.order.provider.id
                },
                order: [
                    ['createdAt', 'DESC'],
                ]
            })


            //  const logistics = selectRequest.selectedLogistics;
            const order = payload.message.order;
            const selectMessageId = payload.context.message_id;
            const logisticsMessageId = uuidv4(); //TODO: in future this is going to be array as packaging for single select request can be more than one

            let org = await productService.getOrgForOndc(payload.message.order.provider.id);

            // console.log("org details ---", org)
            let storeLocationEnd = {}
            if (org?.providerDetail?.storeDetails?.location) {
                storeLocationEnd = {
                    location: {
                        gps: `${org.providerDetail.storeDetails.location.lat},${org.providerDetail.storeDetails.location.long}`,
                        address: {
                            area_code: org.providerDetail.storeDetails.address.area_code,
                            name: org.providerDetail.name,
                            building: org.providerDetail.storeDetails.address.building,
                            locality: org.providerDetail.storeDetails.address.locality,
                            city: org.providerDetail.storeDetails.address.city,
                            state: org.providerDetail.storeDetails.address.state,
                            country: org.providerDetail.storeDetails.address.country
                        }
                    },
                    contact:
                    {
                        phone: org.providerDetail.storeDetails.supportDetails.mobile,
                        email: org.providerDetail.storeDetails.supportDetails.email
                    },
                    person: {
                        name: org.providerDetail.name //TODO: missing from curent impl
                    }
                }
            }


            // const logisticsOrderId = uuidv4();

            // let end = { ...order.fulfillments[0].end }

            // end.location.address.locality = end.location.address.locality ?? end.location.address.street
            // end.person = { name: end.location.address.name }

            //const isInvalidItem =false
            let itemDetails = []
            for (const items of payload.message.order.items) {
                let item = await productService.getForOndc(items.id)
                // logger.log("info", "========= check-point - 1 item details =====", item);
                let details = {
                    "descriptor": {
                        "name": item.commonDetails.productName
                    },
                    "price": {
                        "currency": "INR",
                        "value": "" + item.commonDetails.MRP
                    },
                    "category_id": item.commonDetails.productCategory,
                    "productSubcategory1": item.commonDetails.productSubcategory1,
                    "description": item.commonDetails.description,
                    "longDescription": item.commonDetails.longDescription,
                    "quantity": {
                        "count": 1,
                        "measure": { //TODO: hard coded
                            "unit": "Unit-count",
                            "value": 1
                        }
                    }
                }
                itemDetails.push(details)
            }


            // let deliveryType = selectRequest.selectedLogistics.message.catalog['bpp/providers'][0].items.find((element) => { return element.category_id === config.get("sellerConfig").LOGISTICS_DELIVERY_TYPE });
            // logger.log("info", "========= check-point - 1.1 order ================", order);
            const contextTimestamp = new Date()
            //const orderID = uuidv4();
            const confirmRequest = {
                "context": {
                    "domain": payload.context.domain,
                    "action": payload.context.action,
                    "core_version": "1.1.0",
                    "bap_id": payload.context.bap_id,
                    "bap_uri": payload.context.bap_uri,
                    "bpp_id": payload.context.bpp_id,//STORED OBJECT
                    "bpp_uri": payload.context.bpp_uri, //STORED OBJECT
                    "transaction_id": payload.context.transaction_id,
                    "message_id": payload.context.message_id,
                    "city": payload.context.location.city.code,
                    "country": payload.context.location.country.code,
                    "timestamp": contextTimestamp
                },
                "message": {
                    "order": {
                        "@ondc/org/linked_order": {
                            "items": itemDetails,
                            "provider": {
                                "descriptor": {
                                    name: org.providerDetail.name
                                },
                                "address": {
                                    area_code: org?.providerDetail?.storeDetails?.address?.area_code || "OASP area_code",
                                    name: org.providerDetail.name,
                                    building: org?.providerDetail?.storeDetails?.address?.building || "OASP building",
                                    locality: org?.providerDetail?.storeDetails?.address?.locality || "OASP locality",
                                    city: org?.providerDetail?.storeDetails?.address?.city || "OASP city",
                                    state: org?.providerDetail?.storeDetails?.address?.state || "OASP state",
                                    country: org?.providerDetail?.storeDetails?.address?.country || "OASP country"
                                }
                            },
                            "order": {
                                //"id": order?.id || "order-id-dummy",
                                "id": orderID,
                                "weight": {//TODO: hard coded
                                    "unit": "N/A",
                                    "value": 0
                                }
                            }
                        },
                        "id": orderID,
                        "items": itemDetails, //TODO: fix this map to right item id from select request
                        "provider": initRequest.dataValues.onInitResponse.message.order.provider,
                        "fulfillments": [],
                        /*"fulfillments": [{
                            "id": order.fulfillments[0].id,
                            "type": "Prepaid",
                            "start": storeLocationEnd,
                            "end": end,
                            "tags": {
                                "@ondc/org/order_ready_to_ship": "no" //TODO: hard coded
                            }
                        }],*/
                        //"quote": initRequest.selectedLogistics.message.order.quote,
                        "quote": initRequest.dataValues.onInitResponse.message.order.quote,
                        /* "payment": { //TODO: hard coded
                             "type": "ON-ORDER",
                             "collected_by": "BAP",
                             "@ondc/org/settlement_details": []
                         },*/
                        "payment": initRequest.dataValues.onInitResponse.message.order.payment,
                        "billing": {
                            ...payload.message.order.billing,
                            "tax_number": org.providerDetail.GSTN.GSTN ?? "27ACTPC1936E2ZN", //FIXME: take GSTN no
                            "phone": org?.providerDetail?.contactMobile, //FIXME: take provider details
                            "email": org?.providerDetail?.contactEmail, //FIXME: take provider details
                            "created_at": contextTimestamp,
                            "updated_at": contextTimestamp
                        }, //TODO: pass valid GST number from seller
                        state: "Created",
                        created_at: contextTimestamp,
                        updated_at: contextTimestamp
                    }
                }

            }
            // logger.log("info", "========= check-point - 2 confirmRequest ==========", confirmRequest);
            logger.info('info', `[Ondc Service] post init request :confirmRequestconfirmRequestconfirmRequestconfirmRequestconfirmRequestconfirmRequest`, confirmRequest);
            this.postConfirmRequest(confirmRequest, logisticsMessageId, selectMessageId)
            //}, 10000); //TODO move to config

            return { status: "ACK" }
        } catch (err) {
            console.log(err);
            console.error("Line number:", err.lineNumber);
            throw err;
        }
    }


    async postConfirmRequest(searchRequest, logisticsMessageId, selectMessageId) {

        try {
            //1. post http to protocol/logistics/v1/search
            /*
                        try {
            
                            let headers = {};
                            let httpRequest = new HttpRequest(
                                config.get("sellerConfig").BPP_URI,
                                `/protocol/logistics/v1/confirm`,
                                'POST',
                                searchRequest,
                                headers
                            );
            
                            await httpRequest.send();
            
                        } catch (e) {
                            logger.error('error', `[Ondc Service] post http select response : `, e);
                            return e
                        }
            */
            //2. wait async to fetch logistics responses

            //async post request
            setTimeout(() => {
                logger.log('info', `[Ondc Service] search logistics payload - timeout : param :`, searchRequest);
                //logger.log("info", "========= check-point - 3  ==========");
                this.buildConfirmRequest(searchRequest, logisticsMessageId, selectMessageId)
            }, 10000); //TODO move to config
        } catch (e) {
            logger.error('error', `[Ondc Service] post http select response : `, e);
            return e
        }
    }


    async buildConfirmRequest(searchRequest, logisticsMessageId, initMessageId) {

        try {
            //1. look up for logistics
            //let logisticsResponse = await this.getLogistics(logisticsMessageId, initMessageId, 'confirm')
            //2. if data present then build select response

            //logger.log("info", "========= check-point - 4  ==========");
            let selectResponse = await productService.productConfirm(searchRequest)

            //logger.log("info", "========= check-point - N  ==========");
            //3. post to protocol layer
            await this.postConfirmResponse(selectResponse);


            //4. trigger on_status call to BAP
            /* const confirmRequest = logisticsResponse.retail_confirm[0]//select first select request
                        const context = { ...selectResponse.context, action: 'on_status', timestamp: new Date(), message_id: uuidv4() }
                        const orderId = confirmRequest.message.order.order_id
            
                        console.log("context--->", context)
                        await this.triggerOnStatus(context, orderId);
            */
        } catch (e) {
            console.log(e)
            return e
        }
    }

    async triggerOnStatus(context, orderId) {

        console.log("context", context)
        console.log("orderId", orderId)
        let status = {
            "context": context,
            "message": {
                "order_id": orderId
            }
        }

        await this.orderStatus(status, {}, true)
    }


    //return confirm response to protocol layer
    async postConfirmResponse(confirmResponse) {
        try {

            let headers = {};
            let httpRequest = new HttpRequest(
                config.sellerConfig.BPP_URI,
                //`http://openfort-oasp-client.ossverse.com`,
                `/on_confirm`,
                'POST',
                confirmResponse,
                headers
            );

            console.log(httpRequest)
            console.log("==========on_confirm response======", confirmResponse)

            let result = await httpRequest.send();

            return result.data

        } catch (e) {
            return e
        }

    }
    async orderTrack(payload = {}, req = {}) {
        try {
            //const {criteria = {}, payment = {}} = req || {};

            const confirmRequest = await ConfirmRequest.findOne({
                where: {
                    transactionId: payload.context.transaction_id,
                    retailOrderId: payload.message.order_id
                }
            })

            const logistics = confirmRequest.selectedLogistics;

            //const order = payload.message.order;
            const selectMessageId = payload.context.message_id;
            const logisticsMessageId = uuidv4(); //TODO: in future this is going to be array as packaging for single select request can be more than one

            const trackRequest = {
                "context": {
                    "domain": "nic2004:60232",
                    "action": "track",
                    "core_version": "1.1.0",
                    "bap_id": config.get("sellerConfig").BPP_ID,
                    "bap_uri": config.get("sellerConfig").BPP_URI,
                    "bpp_id": logistics.context.bpp_id,//STORED OBJECT
                    "bpp_uri": logistics.context.bpp_uri, //STORED OBJECT
                    "transaction_id": confirmRequest.logisticsTransactionId,
                    "message_id": logisticsMessageId,
                    "city": "std:080",
                    "country": "IND",
                    "timestamp": new Date()
                },
                "message":
                {
                    "order_id": confirmRequest.orderId,//payload.message.order_id,
                }

            }


            // setTimeout(this.getLogistics(logisticsMessageId,selectMessageId),3000)
            //setTimeout(() => {
            this.postTrackRequest(trackRequest, logisticsMessageId, selectMessageId)
            // }, 5000); //TODO move to config

            return { status: 'ACK' }
        } catch (err) {
            throw err;
        }
    }


    async postTrackRequest(searchRequest, logisticsMessageId, selectMessageId) {

        try {
            //1. post http to protocol/logistics/v1/search

            try {

                let headers = {};
                let httpRequest = new HttpRequest(
                    config.get("sellerConfig").BPP_URI,
                    `/protocol/logistics/v1/track`,
                    'POST',
                    searchRequest,
                    headers
                );


                await httpRequest.send();

            } catch (e) {
                logger.error('error', `[Ondc Service] post http select response : `, e);
                return e
            }

            //2. wait async to fetch logistics responses

            //async post request
            setTimeout(() => {
                logger.log('info', `[Ondc Service] search logistics payload - timeout : param :`, searchRequest);
                this.buildTrackRequest(logisticsMessageId, selectMessageId)
            }, 10000); //TODO move to config
        } catch (e) {
            logger.error('error', `[Ondc Service] post http select response : `, e);
            return e
        }
    }

    async buildTrackRequest(logisticsMessageId, initMessageId) {

        try {
            //1. look up for logistics
            let logisticsResponse = await this.getLogistics(logisticsMessageId, initMessageId, 'track')
            //2. if data present then build select response

            let selectResponse = await productService.productTrack(logisticsResponse)

            //3. post to protocol layer
            await this.postTrackResponse(selectResponse);

        } catch (e) {
            console.log(e)
            return e
        }
    }


    //return track response to protocol layer
    async postTrackResponse(trackResponse) {
        try {

            let headers = {};
            let httpRequest = new HttpRequest(
                config.get("sellerConfig").BPP_URI,
                `/protocol/v1/on_track`,
                'POST',
                trackResponse,
                headers
            );

            console.log(httpRequest)

            let result = await httpRequest.send();

            return result.data

        } catch (e) {
            return e
        }

    }

    // order status
    async orderStatus(payload = {}, req = {}, unsoliciated = true) {
        try {
            //const {criteria = {}, payment = {}} = req || {};

            // console.log("info", "======== check-point 1 ======");
            const confirmRequest = await ConfirmRequest.findOne({
                where: {
                    transactionId: payload.context.transaction_id,
                    retailOrderId: payload.message.order_id
                }
            })

            // console.log("info", "======== check-point 2 confirmRequest:  ======", confirmRequest);
            // const logistics = confirmRequest.selectedLogistics;

            //const order = payload.message.order;
            const selectMessageId = payload.context.message_id;
            const logisticsMessageId = uuidv4(); //TODO: in future this is going to be array as packaging for single select request can be more than one

            const statusRequest = {
                "context": {
                    "domain": "Software Assurance",
                    "action": "status",
                    "core_version": "1.1.0",
                    "bap_id": payload.context.bap_id,
                    "bap_uri": payload.context.bap_uri,
                    "bpp_id": payload.context.bpp_id,//STORED OBJECT
                    "bpp_uri": payload.context.bpp_uri, //STORED OBJECT
                    "transaction_id": payload.context.transaction_id,
                    "message_id": payload.context.message_id,
                    "city": payload?.context?.location?.city?.code || "std:080",
                    "country": payload?.context?.location?.country?.code || "IND",
                    "timestamp": new Date()
                },
                "message":
                {
                    "order_id": confirmRequest.orderId,
                }

            }

            console.log("info", "======== check-point 3 ======");
            // setTimeout(this.getLogistics(logisticsMessageId,selectMessageId),3000)
            //setTimeout(() => {
            this.postStatusRequest(statusRequest, logisticsMessageId, selectMessageId, unsoliciated, payload)
            //}, 5000); //TODO move to config

            return { status: 'ACK' }
        } catch (err) {
            throw err;
        }
    }
    async orderStatusUpdate(payload = {}, req = {}) {
        try {
            // const {criteria = {}, payment = {}} = req || {};

            const confirmRequest = await ConfirmRequest.findOne({
                where: {
                    retailOrderId: payload.data.orderId
                }
            })

            const logistics = confirmRequest.selectedLogistics;

            const order = payload.data;
            const selectMessageId = uuidv4();
            const logisticsMessageId = uuidv4(); //TODO: in future this is going to be array as packaging for single select request can be more than one

            const trackRequest = {
                "context": {
                    "domain": "nic2004:60232",
                    "action": "update",
                    "core_version": "1.1.0",
                    "bap_id": config.get("sellerConfig").BPP_ID,
                    "bap_uri": config.get("sellerConfig").BPP_URI,
                    "bpp_id": logistics.context.bpp_id,//STORED OBJECT
                    "bpp_uri": logistics.context.bpp_uri, //STORED OBJECT
                    "transaction_id": confirmRequest.logisticsTransactionId,
                    "message_id": logisticsMessageId,
                    "city": "std:080", //TODO: take it from request
                    "country": "IND",
                    "timestamp": new Date()
                },
                "message": {
                    "order": {
                        "id": order.orderId,
                        "state": "Accepted",
                        "items": logistics.items,
                        "@ondc/org/linked_order": {
                            "items": [{
                                "descriptor": {
                                    "name": "KIT KAT"
                                },
                                "quantity": {
                                    "count": 2,
                                    "measure": {
                                        "value": 200,
                                        "unit": "Gram"
                                    }
                                },
                                "price": {
                                    "currency": "INR",
                                    "value": "200.00"
                                },
                                "category_id": "Grocery"
                            }]
                        },
                        "fulfillments": [{
                            "id": logistics.message.order.fulfillments[0].id,
                            "type": logistics.message.order.fulfillments[0].type,
                            "tracking": logistics.message.order.fulfillments[0].tracking,
                            "tags": {
                                "@ondc/org/order_ready_to_ship": "yes"
                            }
                        }],
                        "updated_at": new Date()
                    },
                    "update_target": "fulfillment"
                }

            }


            payload = { message: { order: order }, context: confirmRequest.confirmRequest.context }
            // setTimeout(this.getLogistics(logisticsMessageId,selectMessageId),3000)
            //setTimeout(() => {
            this.postUpdateOrderStatusRequest(payload, trackRequest, logisticsMessageId, selectMessageId)
            //}, 5000); //TODO move to config

            return { status: 'ACK' }
        } catch (err) {
            throw err;
        }
    }
    async orderCancelFromSeller(payload = {}, req = {}) {
        try {
            //const {criteria = {}, payment = {}} = req || {};

            const confirmRequest = await ConfirmRequest.findOne({
                where: {
                    retailOrderId: payload.data.orderId
                }
            })

            const logistics = confirmRequest.selectedLogistics;

            const order = payload.data;

            order.context = confirmRequest.confirmRequest.context

            const selectMessageId = uuidv4();
            const logisticsMessageId = uuidv4(); //TODO: in future this is going to be array as packaging for single select request can be more than one

            const trackRequest = {
                "context": {
                    "domain": "nic2004:60232",
                    "action": "cancel",
                    "core_version": "1.1.0",
                    "bap_id": config.get("sellerConfig").BPP_ID,
                    "bap_uri": config.get("sellerConfig").BPP_URI,
                    "bpp_id": logistics.context.bpp_id,//STORED OBJECT
                    "bpp_uri": logistics.context.bpp_uri, //STORED OBJECT
                    "transaction_id": confirmRequest.logisticsTransactionId,
                    "message_id": logisticsMessageId,
                    "city": "std:080", //TODO: take it from request
                    "country": "IND",
                    "timestamp": new Date()
                },
                "message": {
                    "order_id": order.orderId,
                    "cancellation_reason_id": order.cancellation_reason_id
                }
            }

            payload = { message: { order: order }, context: confirmRequest.confirmRequest.context }

            console.log("payload-------------->", payload);
            // setTimeout(this.getLogistics(logisticsMessageId,selectMessageId),3000)
            //setTimeout(() => {
            this.postSellerCancelRequest(payload, trackRequest, logisticsMessageId, selectMessageId)
            //}, 5000); //TODO move to config

            return { status: 'ACK' }
        } catch (err) {

            console.log("err--->", err);
            throw err;
        }
    }
    async orderUpdate(payload = {}, req = {}) {
        try {
            //const {criteria = {}, payment = {}} = req || {};

            const confirmRequest = await ConfirmRequest.findOne({
                where: {
                    retailOrderId: payload.message.order.id
                }
            })

            const logistics = confirmRequest.selectedLogistics;

            const order = payload.message.order
            const selectMessageId = payload.context.message_id;
            const logisticsMessageId = uuidv4(); //TODO: in future this is going to be array as packaging for single select request can be more than one

            const trackRequest = {
                "context": {
                    "domain": "nic2004:60232",
                    "action": "update",
                    "core_version": "1.1.0",
                    "bap_id": config.get("sellerConfig").BPP_ID,
                    "bap_uri": config.get("sellerConfig").BPP_URI,
                    "bpp_id": logistics.context.bpp_id,//STORED OBJECT
                    "bpp_uri": logistics.context.bpp_uri, //STORED OBJECT
                    "transaction_id": confirmRequest.logisticsTransactionId,
                    "message_id": logisticsMessageId,
                    "city": "std:080", //TODO: take it from request
                    "country": "IND",
                    "timestamp": new Date()
                },
                "message": {
                    "order": {
                        "id": order.orderId,
                        "state": "Accepted",
                        "items": logistics.items,
                        "@ondc/org/linked_order": {
                            "items": [{ //TODO: get valid item from list and update the fields
                                "descriptor": {
                                    "name": "KIT KAT"
                                },
                                "quantity": {
                                    "count": 2,
                                    "measure": {
                                        "value": 200,
                                        "unit": "Gram"
                                    }
                                },
                                "price": {
                                    "currency": "INR",
                                    "value": "200.00"
                                },
                                "category_id": "Grocery"
                            }]
                        },
                        "fulfillments": [{
                            "id": logistics.message.order.fulfillments[0].id,
                            "type": logistics.message.order.fulfillments[0].type,
                            "tracking": logistics.message.order.fulfillments[0].tracking,
                            "tags": {
                                "@ondc/org/order_ready_to_ship": "yes" //TBD: passing this value for update triggers logistics workflow
                            }
                        }],
                        "updated_at": new Date()
                    },
                    "update_target": "fulfillment"
                }

            }


            payload = { message: { order: order }, context: confirmRequest.confirmRequest.context }
            // setTimeout(this.getLogistics(logisticsMessageId,selectMessageId),3000)
            //setTimeout(() => {
            this.postUpdateRequest(payload, trackRequest, logisticsMessageId, selectMessageId)
            //}, 5000); //TODO move to config

            return { status: 'ACK' }
        } catch (err) {
            throw err;
        }
    }

    async orderStatusUpdateItems(payload = {}, req = {}) {
        try {
            //const {criteria = {}, payment = {}} = req || {};

            const confirmRequest = await ConfirmRequest.findOne({
                where: {
                    retailOrderId: payload.data.orderId
                }
            })

            console.log("")

            const logistics = confirmRequest.selectedLogistics;

            const order = payload.data;
            const selectMessageId = uuidv4();//payload.context.message_id;
            const logisticsMessageId = uuidv4(); //TODO: in future this is going to be array as packaging for single select request can be more than one

            const trackRequest = {
                "context": {
                    "domain": "nic2004:60232",
                    "action": "update",
                    "core_version": "1.1.0",
                    "bap_id": config.get("sellerConfig").BPP_ID,
                    "bap_uri": config.get("sellerConfig").BPP_URI,
                    "bpp_id": logistics.context.bpp_id,//STORED OBJECT
                    "bpp_uri": logistics.context.bpp_uri, //STORED OBJECT
                    "transaction_id": confirmRequest.logisticsTransactionId,
                    "message_id": logisticsMessageId,
                    "city": "std:080", //TODO: take it from request
                    "country": "IND",
                    "timestamp": new Date()
                },
                "message": {
                    "order": {
                        "id": order.orderId,
                        "state": "Accepted",
                        "items": logistics.items,
                        "@ondc/org/linked_order": {
                            "items": [{ //TODO: get valid item from list and update the fields
                                "descriptor": {
                                    "name": "KIT KAT"
                                },
                                "quantity": {
                                    "count": 2,
                                    "measure": {
                                        "value": 200,
                                        "unit": "Gram"
                                    }
                                },
                                "price": {
                                    "currency": "INR",
                                    "value": "200.00"
                                },
                                "category_id": "Grocery"
                            }]
                        },
                        "fulfillments": [{
                            "id": logistics.message.order.fulfillments[0].id,
                            "type": logistics.message.order.fulfillments[0].type,
                            "tracking": logistics.message.order.fulfillments[0].tracking,
                            "tags": {
                                "@ondc/org/order_ready_to_ship": "yes" //TBD: passing this value for update triggers logistics workflow
                            }
                        }],
                        "updated_at": new Date()
                    },
                    "update_target": "fulfillment"
                }

            }


            payload = { message: { order: order }, context: { ...confirmRequest.confirmRequest.context, message_id: uuidv4() } };
            // setTimeout(this.getLogistics(logisticsMessageId,selectMessageId),3000)
            //setTimeout(() => {
            this.postUpdateItemRequest(payload, trackRequest, logisticsMessageId, selectMessageId);
            //}, 5000); //TODO move to config

            return { status: 'ACK' }
        } catch (err) {
            throw err;
        }
    }


    async postStatusRequest(statusRequest, logisticsMessageId, selectMessageId, unsoliciated, payload) {

        try {
            //1. post http to protocol/logistics/v1/search
            /*
                        try {
            
                            let headers = {};
                            let httpRequest = new HttpRequest(
                                config.get("sellerConfig").BPP_URI,
                                `/protocol/logistics/v1/status`,
                                'POST',
                                statusRequest,
                                headers
                            );
            
            
                            await httpRequest.send();
            
                        } catch (e) {
                            logger.error('error', `[Ondc Service] post http select response : `, e);
                            return e
                        }
            */
            //2. wait async to fetch logistics responses

            //async post request
            setTimeout(() => {
                logger.log('info', `[Ondc Service] search logistics payload - timeout : param :`, statusRequest);
                this.buildStatusRequest(statusRequest, logisticsMessageId, selectMessageId, unsoliciated, payload)
            }, 10000); //TODO move to config
        } catch (e) {
            logger.error('error', `[Ondc Service] post http select response : `, e);
            return e
        }
    }

    async postUpdateRequest(orderData, searchRequest, logisticsMessageId, selectMessageId) {

        try {
            //1. post http to protocol/logistics/v1/search

            // try { //TODO: post this request for update items
            //
            //     console.log("------->>>",searchRequest,selectMessageId,logisticsMessageId)
            //     console.log("------result ->>>",config.get("sellerConfig").BPP_URI )
            //     let headers = {};
            //     let httpRequest = new HttpRequest(
            //         config.get("sellerConfig").BPP_URI,
            //         `/protocol/logistics/v1/update`,
            //         'POST',
            //         searchRequest,
            //         headers
            //     );
            //
            //
            //     let result = await httpRequest.send();
            //     console.log("------result ->>>",result )
            //
            // } catch (e) {
            //     logger.error('error', `[Ondc Service] post http select response : `, e);
            //     return e
            // }

            //2. wait async to fetch logistics responses

            //async post request
            setTimeout(() => {
                logger.log('info', `[Ondc Service] search logistics payload - timeout : param :`, searchRequest);
                this.buildUpdateRequest(orderData, logisticsMessageId, selectMessageId)
            }, 5000); //TODO move to config
        } catch (e) {
            logger.error('error', `[Ondc Service] post http select response : `, e);
            return e
        }
    }
    // async postUpdateItemRequest(orderData,searchRequest,logisticsMessageId,selectMessageId){
    //
    //     try{
    //         //1. post http to protocol/logistics/v1/search
    //
    //         // try { //TODO: post this request for update items
    //         //
    //         //     console.log("------->>>",searchRequest,selectMessageId,logisticsMessageId)
    //         //     console.log("------result ->>>",config.get("sellerConfig").BPP_URI )
    //         //     let headers = {};
    //         //     let httpRequest = new HttpRequest(
    //         //         config.get("sellerConfig").BPP_URI,
    //         //         `/protocol/logistics/v1/update`,
    //         //         'POST',
    //         //         searchRequest,
    //         //         headers
    //         //     );
    //         //
    //         //
    //         //     let result = await httpRequest.send();
    //         //     console.log("------result ->>>",result )
    //         //
    //         // } catch (e) {
    //         //     logger.error('error', `[Ondc Service] post http select response : `, e);
    //         //     return e
    //         // }
    //
    //         //2. wait async to fetch logistics responses
    //
    //         //async post request
    //         setTimeout(() => {
    //             logger.log('info', `[Ondc Service] search logistics payload - timeout : param :`,searchRequest);
    //            this.buildUpdateRequest(orderData,logisticsMessageId, selectMessageId)
    //         }, 5000); //TODO move to config
    //     }catch (e){
    //         logger.error('error', `[Ondc Service] post http select response : `, e);
    //         return e
    //     }
    // }
    async postUpdateItemRequest(orderData, searchRequest, logisticsMessageId, selectMessageId) {

        try {
            //1. post http to protocol/logistics/v1/search

            // try { //TODO: post this request for update items
            //
            //     console.log("------->>>",searchRequest,selectMessageId,logisticsMessageId)
            //     console.log("------result ->>>",config.get("sellerConfig").BPP_URI )
            //     let headers = {};
            //     let httpRequest = new HttpRequest(
            //         config.get("sellerConfig").BPP_URI,
            //         `/protocol/logistics/v1/update`,
            //         'POST',
            //         searchRequest,
            //         headers
            //     );
            //
            //
            //     let result = await httpRequest.send();
            //     console.log("------result ->>>",result )
            //
            // } catch (e) {
            //     logger.error('error', `[Ondc Service] post http select response : `, e);
            //     return e
            // }

            //2. wait async to fetch logistics responses

            //async post request
            setTimeout(() => {
                logger.log('info', `[Ondc Service] search logistics payload - timeout : param :`, searchRequest);
                this.buildUpdateItemRequest(orderData, logisticsMessageId, selectMessageId)
            }, 5000); //TODO move to config
        } catch (e) {
            logger.error('error', `[Ondc Service] post http select response : `, e);
            return e
        }
    }
    async postUpdateOrderStatusRequest(orderData, searchRequest, logisticsMessageId, selectMessageId) {

        try {
            //1. post http to protocol/logistics/v1/search

            try { //TODO: post this request for update items

                let headers = {};
                let httpRequest = new HttpRequest(
                    config.get("sellerConfig").BPP_URI,
                    `/protocol/logistics/v1/update`,
                    'POST',
                    searchRequest,
                    headers
                );


                await httpRequest.send();

            } catch (e) {
                logger.error('error', `[Ondc Service] post http select response : `, e);
                return e
            }

            //2. wait async to fetch logistics responses

            //async post request
            setTimeout(() => {
                logger.log('info', `[Ondc Service] search logistics payload - timeout : param :`, searchRequest);
                this.buildOrderStatusRequest(orderData, logisticsMessageId, selectMessageId)
            }, 5000); //TODO move to config
        } catch (e) {
            logger.error('error', `[Ondc Service] post http select response : `, e);
            return e
        }
    }

    async orderCancel(payload = {}, req = {}) {
        try {
            //const {criteria = {}, payment = {}} = req || {};

            const confirmRequest = await ConfirmRequest.findOne({
                where: {
                    transactionId: payload.context.transaction_id,
                    retailOrderId: payload.message.order_id
                }
            })

            const logistics = confirmRequest.selectedLogistics;

            //const order = payload.message.order;
            const selectMessageId = payload.context.message_id;
            const logisticsMessageId = uuidv4(); //TODO: in future this is going to be array as packaging for single select request can be more than one

            const trackRequest = {
                "context": {
                    "domain": "nic2004:60232",
                    "action": "cancel",
                    "core_version": "1.1.0",
                    "bap_id": config.get("sellerConfig").BPP_ID,
                    "bap_uri": config.get("sellerConfig").BPP_URI,
                    "bpp_id": logistics.context.bpp_id,//STORED OBJECT
                    "bpp_uri": logistics.context.bpp_uri, //STORED OBJECT
                    "transaction_id": confirmRequest.logisticsTransactionId,
                    "message_id": logisticsMessageId,
                    "city": "std:080",
                    "country": "IND",
                    "timestamp": new Date()
                },
                "message":
                {
                    "order_id": confirmRequest.orderId,
                    "cancellation_reason_id": payload.message.cancellation_reason_id
                }

            }


            // setTimeout(this.getLogistics(logisticsMessageId,selectMessageId),3000)
            //setTimeout(() => {
            this.postCancelRequest(trackRequest, logisticsMessageId, selectMessageId)
            //}, 5000); //TODO move to config

            return { status: 'ACK' }
        } catch (err) {
            throw err;
        }
    }

    async postCancelRequest(searchRequest, logisticsMessageId, selectMessageId) {

        try {
            //1. post http to protocol/logistics/v1/search

            try {

                let headers = {};
                let httpRequest = new HttpRequest(
                    config.get("sellerConfig").BPP_URI,
                    `/protocol/logistics/v1/cancel`,
                    'POST',
                    searchRequest,
                    headers
                );


                await httpRequest.send();

            } catch (e) {
                logger.error('error', `[Ondc Service] post http select response : `, e);
                return e
            }

            //2. wait async to fetch logistics responses

            //async post request
            setTimeout(() => {
                logger.log('info', `[Ondc Service] search logistics payload - timeout : param :`, searchRequest);
                this.buildCancelRequest(logisticsMessageId, selectMessageId)
            }, 10000); //TODO move to config
        } catch (e) {
            logger.error('error', `[Ondc Service] post http select response : `, e);
            return e
        }
    }
    async postSellerCancelRequest(cancelData, cancelRequest, logisticsMessageId, selectMessageId) {

        try {
            //1. post http to protocol/logistics/v1/search

            try {

                let headers = {};
                let httpRequest = new HttpRequest(
                    config.get("sellerConfig").BPP_URI,
                    `/protocol/logistics/v1/cancel`,
                    'POST',
                    cancelRequest,
                    headers
                );


                await httpRequest.send();

            } catch (e) {
                logger.error('error', `[Ondc Service] post http select response : `, e);
                return e
            }

            //2. wait async to fetch logistics responses

            //async post request
            setTimeout(() => {
                logger.log('info', `[Ondc Service] search logistics payload - timeout : param :`, cancelRequest);
                this.buildSellerCancelRequest(cancelData, logisticsMessageId, selectMessageId)
            }, 10000); //TODO move to config
        } catch (e) {
            logger.error('error', `[Ondc Service] post http select response : `, e);
            return e
        }
    }
    async buildStatusRequest(statusRequest, logisticsMessageId, initMessageId, unsoliciated, payload) {

        try {
            //1. look up for logistics
            // let logisticsResponse = await this.getLogistics(logisticsMessageId, initMessageId, 'status')
            //2. if data present then build select response

            console.log("statusRequest-----build>", statusRequest);
            //let statusResponse = await productService.productStatus(logisticsResponse, statusRequest, unsoliciated, payload)
            let statusResponse = await productService.productStatus("requestQuery-dummy", statusRequest, unsoliciated, payload)

            console.log("info", "======== check-point-N-statusResponse:  ======", statusResponse);
            //3. post to protocol layer
            await this.postStatusResponse(statusResponse);

        } catch (e) {
            console.log(e)
            return e
        }
    }
    async buildUpdateRequest(statusRequest, logisticsMessageId, initMessageId) {

        try {
            //1. look up for logistics
            let logisticsResponse = await this.getLogistics(logisticsMessageId, initMessageId, 'update')
            //2. if data present then build select response

            let statusResponse = await productService.productUpdate(logisticsResponse)

            //3. post to protocol layer
            await this.postUpdateResponse(statusResponse);

        } catch (e) {
            console.log(e)
            return e
        }
    }

    async buildUpdateItemRequest(statusRequest, logisticsMessageId, initMessageId) {

        try {
            //1. look up for logistics
            let logisticsResponse = await this.getLogistics(logisticsMessageId, initMessageId, 'update')
            //2. if data present then build select response

            let statusResponse = await productService.productUpdateItem(statusRequest, logisticsResponse)

            //3. post to protocol layer
            await this.postUpdateResponse(statusResponse);

        } catch (e) {
            console.log(e)
            return e
        }
    }

    async buildOrderStatusRequest(statusRequest, logisticsMessageId, initMessageId) {

        try {
            //1. look up for logistics
            let logisticsResponse = await this.getLogistics(logisticsMessageId, initMessageId, 'update')
            //2. if data present then build select response

            let statusResponse = await productService.productOrderStatus(logisticsResponse, statusRequest)

            //3. post to protocol layer
            await this.postStatusResponse(statusResponse);

        } catch (e) {
            console.log(e)
            return e
        }
    }


    async buildCancelRequest(logisticsMessageId, initMessageId) {

        try {
            //1. look up for logistics
            let logisticsResponse = await this.getLogistics(logisticsMessageId, initMessageId, 'cancel')
            //2. if data present then build select response

            let statusResponse = await productService.productCancel(logisticsResponse)

            //3. post to protocol layer
            await this.postCancelResponse(statusResponse);

        } catch (e) {
            console.log(e)
            return e
        }
    }

    async buildSellerCancelRequest(cancelData, logisticsMessageId, initMessageId) {

        try {
            //1. look up for logistics
            let logisticsResponse = await this.getLogistics(logisticsMessageId, initMessageId, 'cancel')
            //2. if data present then build select response

            let statusResponse = await productService.productSellerCancel(cancelData, logisticsResponse)

            //3. post to protocol layer
            await this.postSellerCancelResponse(statusResponse);

        } catch (e) {
            console.log(e)
            return e
        }
    }


    //return track response to protocol layer
    async postStatusResponse(statusResponse) {
        try {

            let headers = {};
            let httpRequest = new HttpRequest(
                config.sellerConfig.BPP_URI,
                //`http://openfort-oasp-client.ossverse.com`,
                `/on_status`,
                'POST',
                statusResponse,
                headers
            );

            console.log(httpRequest)

            let result = await httpRequest.send();

            console.log("info", "======== checkpoint-last-result ======", result);
            return result.data

        } catch (e) {
            return e
        }

    }

    //return track response to protocol layer
    async postUpdateResponse(statusResponse) {
        try {

            let headers = {};
            let httpRequest = new HttpRequest(
                config.get("sellerConfig").BPP_URI,
                `/protocol/v1/on_update`,
                'POST',
                statusResponse,
                headers
            );

            console.log(httpRequest)

            let result = await httpRequest.send();

            return result.data

        } catch (e) {
            return e
        }

    }

    //return track response to protocol layer
    async postCancelResponse(statusResponse) {
        try {

            let headers = {};
            let httpRequest = new HttpRequest(
                config.get("sellerConfig").BPP_URI,
                `/protocol/v1/on_cancel`,
                'POST',
                statusResponse,
                headers
            );

            console.log(httpRequest)

            let result = await httpRequest.send();

            return result.data

        } catch (e) {
            return e
        }

    }


    //return track response to protocol layer
    async postSellerCancelResponse(statusResponse) {
        try {

            let headers = {};
            let httpRequest = new HttpRequest(
                config.get("sellerConfig").BPP_URI,
                `/protocol/v1/on_cancel`,
                'POST',
                statusResponse,
                headers
            );

            console.log(httpRequest)

            let result = await httpRequest.send();

            return result.data

        } catch (e) {
            return e
        }

    }

    async orderSupport(payload = {}, req = {}) {
        try {
            //const {criteria = {}, payment = {}} = req || {};

            const selectRequest = await ConfirmRequest.findOne({
                where: {
                    transactionId: payload.message.ref_id
                }
            })

            const logistics = selectRequest.selectedLogistics;

            const selectMessageId = payload.context.message_id;
            const logisticsMessageId = uuidv4(); //TODO: in future this is going to be array as packaging for single select request can be more than one

            const trackRequest = {
                "context": {
                    "domain": "nic2004:60232",
                    "action": "support",
                    "core_version": "1.1.0",
                    "bap_id": config.get("sellerConfig").BPP_ID,
                    "bap_uri": config.get("sellerConfig").BPP_URI,
                    "bpp_id": logistics.context.bpp_id,//STORED OBJECT
                    "bpp_uri": logistics.context.bpp_uri, //STORED OBJECT
                    "transaction_id": selectRequest.logisticsTransactionId,
                    "message_id": logisticsMessageId,
                    "city": "std:080",
                    "country": "IND",
                    "timestamp": new Date()
                },
                "message":
                {
                    "ref_id": selectRequest.transactionId,
                }

            }


            // setTimeout(this.getLogistics(logisticsMessageId,selectMessageId),3000)
            //setTimeout(() => {
            this.postSupportRequest(trackRequest, logisticsMessageId, selectMessageId)
            //}, 5000); //TODO move to config

            return trackRequest
        } catch (err) {
            throw err;
        }
    }



    async postSupportRequest(searchRequest, logisticsMessageId, selectMessageId) {

        try {
            //1. post http to protocol/logistics/v1/search

            try {

                let headers = {};
                let httpRequest = new HttpRequest(
                    config.get("sellerConfig").BPP_URI,
                    `/protocol/logistics/v1/support`,
                    'POST',
                    searchRequest,
                    headers
                );


                await httpRequest.send();

            } catch (e) {
                logger.error('error', `[Ondc Service] post http select response : `, e);
                return e
            }

            //2. wait async to fetch logistics responses

            //async post request
            setTimeout(() => {
                logger.log('info', `[Ondc Service] search logistics payload - timeout : param :`, searchRequest);
                this.buildSupportRequest(logisticsMessageId, selectMessageId)
            }, 10000); //TODO move to config
        } catch (e) {
            logger.error('error', `[Ondc Service] post http select response : `, e);
            return e
        }
    }
    async buildSupportRequest(logisticsMessageId, initMessageId) {

        try {
            //1. look up for logistics
            let logisticsResponse = await this.getLogistics(logisticsMessageId, initMessageId, 'support')
            //2. if data present then build select response

            let selectResponse = await productService.productSupport(logisticsResponse)

            //3. post to protocol layer
            await this.postSupportResponse(selectResponse);

        } catch (e) {
            console.log(e)
            return e
        }
    }



    //return track response to protocol layer
    async postSupportResponse(trackResponse) {
        try {

            let headers = {};
            let httpRequest = new HttpRequest(
                config.get("sellerConfig").BPP_URI,
                `/protocol/v1/on_support`,
                'POST',
                trackResponse,
                headers
            );

            console.log(httpRequest)

            let result = await httpRequest.send();

            return result.data

        } catch (e) {
            return e
        }

    }


}

export default OndcService;
