const express = require('express');

const authRouter = express.Router();
const user = require('./user');

// Authentication routes for the API

authRouter.post('/register', user.register);

authRouter.get('/verify/:userId/:token', user.verify);

authRouter.get('/resend-verification/:userId/', user.resendVerification);

authRouter.post('/login', user.login);

authRouter.post('/logout', user.logout);

module.exports = { authRouter };
