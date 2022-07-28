const express = require('express');

const authRouter = express.Router();
const user = require('./user');

authRouter.post('/register', user.register);

authRouter.get('/verify/:userId/:token', user.verify);

authRouter.get('/resend-verification/:userId/', user.resendVerification);

authRouter.post('/login', user.login);

module.exports = { authRouter };
