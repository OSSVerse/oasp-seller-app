import { OndcService } from '../../services/v1';

const ondcService = new OndcService();

function acknowledge(res, data) {
    try {
        res.status(202).json(data);
    } catch (error) {
        if (error instanceof Exception) {
            throw error;
        }

        throw new Exception(
            ExceptionType.Acknowledgement_Failed,
            "Acknowledge to client connection failed",
            500,
            error
        );
    }
}

function acknowledgeACK(res, context) {
    try {
        const contextData = JSON.parse(JSON.stringify(context));
        acknowledge(res, {
            context: contextData,
            message: {
                ack: {
                    status: "ACK"
                }
            }
        });
    } catch (error) {
        if (error instanceof Exception) {
            logger.error(error);
            throw error;
        }

        throw new Exception(
            ExceptionType.Acknowledgement_Failed,
            "Acknowledge to client connection failed",
            500,
            error
        );
    }
}

class OndcController {

    handler(req, res, next) {
        acknowledgeACK(res, req.body.context);

        ondcService.handler(req.body, req).then(data => {
            console.log(data);
        }).catch((err) => {
            next(err);
        });
    }

    productSearch(req, res, next) {
        // const currentUserAccessToken = res.get('currentUserAccessToken');
        ondcService.productSearch(req.body, req).then(data => {
            res.json(data);
        }).catch((err) => {
            next(err);
        });
    }

    orderSelect(req, res, next) {
        // const currentUserAccessToken = res.get('currentUserAccessToken');
        ondcService.orderSelect(req.body, req).then(data => {
            res.json(data);
        }).catch((err) => {
            next(err);
        });
    }
    orderInit(req, res, next) {
        // const currentUserAccessToken = res.get('currentUserAccessToken');
        ondcService.orderInit(req.body, req).then(data => {
            res.json(data);
        }).catch((err) => {
            next(err);
        });
    }
    orderConfirm(req, res, next) {
        // const currentUserAccessToken = res.get('currentUserAccessToken');
        ondcService.orderConfirm(req.body, req).then(data => {
            res.json(data);
        }).catch((err) => {
            next(err);
        });
    }
    orderTrack(req, res, next) {
        // const currentUserAccessToken = res.get('currentUserAccessToken');
        ondcService.orderTrack(req.body, req).then(data => {
            res.json(data);
        }).catch((err) => {
            next(err);
        });
    }
    orderCancel(req, res, next) {
        // const currentUserAccessToken = res.get('currentUserAccessToken');
        ondcService.orderCancel(req.body, req).then(data => {
            res.json(data);
        }).catch((err) => {
            next(err);
        });
    }
    orderStatus(req, res, next) {
        // const currentUserAccessToken = res.get('currentUserAccessToken');
        ondcService.orderStatus(req.body, req).then(data => {
            res.json(data);
        }).catch((err) => {
            next(err);
        });
    }

    orderStatusUpdate(req, res, next) {
        // const currentUserAccessToken = res.get('currentUserAccessToken');
        ondcService.orderStatusUpdate(req.body, req).then(data => {
            res.json(data);
        }).catch((err) => {
            next(err);
        });
    }

    orderStatusUpdateItems(req, res, next) {
        // const currentUserAccessToken = res.get('currentUserAccessToken');
        ondcService.orderStatusUpdateItems(req.body, req).then(data => {
            res.json(data);
        }).catch((err) => {
            next(err);
        });
    }
    orderCancelFromSeller(req, res, next) {
        // const currentUserAccessToken = res.get('currentUserAccessToken');
        ondcService.orderCancelFromSeller(req.body, req).then(data => {
            res.json(data);
        }).catch((err) => {
            next(err);
        });
    }
    orderUpdate(req, res, next) {
        // const currentUserAccessToken = res.get('currentUserAccessToken');
        ondcService.orderUpdate(req.body, req).then(data => {
            res.json(data);
        }).catch((err) => {
            next(err);
        });
    }
    orderSupport(req, res, next) {
        // const currentUserAccessToken = res.get('currentUserAccessToken');
        ondcService.orderSupport(req.body, req).then(data => {
            res.json(data);
        }).catch((err) => {
            next(err);
        });
    }


}

module.exports = OndcController;
