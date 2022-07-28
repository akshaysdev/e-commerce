const express = require('express');

const buyerRouter = express.Router();
const buyer = require('./buyer');

buyerRouter.get('/list-of-sellers', buyer.fetchAllSellers);

buyerRouter.get('/catalog/:sellerId', buyer.fetchCatalog);

buyerRouter.post('/create-order/:sellerId', buyer.createOrder);

buyerRouter.get('/orders/:buyerId', buyer.fetchAllOrders);

module.exports = { buyerRouter };
