const express = require('express');
const { verifyBuyerAuthorization } = require('../../../helpers/authentication');

const buyerRouter = express.Router();
const buyer = require('./buyer');

buyerRouter.get('/list-of-sellers', verifyBuyerAuthorization, buyer.fetchAllSellers);

buyerRouter.get('/catalog/:sellerId', verifyBuyerAuthorization, buyer.fetchCatalog);

buyerRouter.post('/create-order/:sellerId', verifyBuyerAuthorization, buyer.createOrder);

buyerRouter.get('/orders/:buyerId', verifyBuyerAuthorization, buyer.fetchAllOrders);

module.exports = { buyerRouter };
