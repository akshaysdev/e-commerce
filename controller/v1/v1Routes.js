const express = require('express');

const v1Routes = express.Router();

const { authRouter } = require('./auth/routes');
const { sellerRouter } = require('./seller/routes');
const { buyerRouter } = require('./buyer/routes');

v1Routes.use('/auth', authRouter);

v1Routes.use('/seller', sellerRouter);

v1Routes.use('/buyer', buyerRouter);

module.exports = v1Routes;
