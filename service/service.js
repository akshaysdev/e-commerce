const { container } = require('../externalService/dependencyInjection');

const userService = container.resolve('userService');

const sellerService = container.resolve('sellerService');

const buyerService = container.resolve('buyerService');

module.exports = { userService, sellerService, buyerService };
