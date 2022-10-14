const express = require('express');
const { verifySellerAuthorization } = require('../../../helpers/authentication');

const sellerRouter = express.Router();
const seller = require('./seller');

sellerRouter.post('/create-catalog/:sellerId', verifySellerAuthorization, seller.createCatalog);

sellerRouter.post('/create-product/:catalogId', verifySellerAuthorization, seller.createProduct);

sellerRouter.get('/orders/:sellerId', verifySellerAuthorization, seller.fetchAllOrders);

module.exports = { sellerRouter };
