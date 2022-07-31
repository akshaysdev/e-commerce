const express = require('express');

const v1Routes = express.Router();

const { verifyAuthentication } = require('../../helpers/authentication');

const { authRouter } = require('./auth/routes');
const { sellerRouter } = require('./seller/routes');
const { buyerRouter } = require('./buyer/routes');
const { deliveryRouter } = require('./delivery/routes');

v1Routes.use('/auth', authRouter);

v1Routes.use('/seller', verifyAuthentication, sellerRouter);

v1Routes.use('/buyer', verifyAuthentication, buyerRouter);

v1Routes.use('/delivery', verifyAuthentication, deliveryRouter);

module.exports = v1Routes;
