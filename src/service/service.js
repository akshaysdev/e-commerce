const { container } = require('../utils/dependencyInjection');

const userService = container.resolve('userService');

const sellerService = container.resolve('sellerService');

const buyerService = container.resolve('buyerService');

const deliveryService = container.resolve('deliveryService');

module.exports = { userService, sellerService, buyerService, deliveryService };
