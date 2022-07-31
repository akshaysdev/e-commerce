const express = require('express');
const { verifyDeliveryPartnerAuthorization } = require('../../../helpers/authentication');

const deliveryRouter = express.Router();
const delivery = require('./delivery');

deliveryRouter.post('/mark-delivered/:deliveryPartnerId', verifyDeliveryPartnerAuthorization, delivery.markDelivered);

deliveryRouter.get('/active-orders/:deliveryPartnerId', verifyDeliveryPartnerAuthorization, delivery.activeOrders);

module.exports = { deliveryRouter };
