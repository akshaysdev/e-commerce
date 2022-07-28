const express = require('express');

const sellerRouter = express.Router();
const seller = require('./seller');

sellerRouter.post('/create-catalog/:sellerId', seller.createCatalog);

sellerRouter.post('/create-product/:catalogId', seller.createProduct);

sellerRouter.get('/orders/:sellerId', seller.fetchAllOrders);

module.exports = { sellerRouter };
