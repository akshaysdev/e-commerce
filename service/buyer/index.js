const createError = require('http-errors');

module.exports = class BuyerService {
  constructor({ userRepository, catalogRepository, orderRepository, productRepository }) {
    this.userRepository = userRepository;
    this.catalogRepository = catalogRepository;
    this.orderRepository = orderRepository;
    this.productRepository = productRepository;
  }

  async fetchAllSellers() {
    try {
      const sellers = await this.userRepository.fetchAllSellers();

      return sellers;
    } catch (error) {
      throw error;
    }
  }

  async fetchAllProductsBySellerId(sellerId) {
    try {
      const catalog = await this.catalogRepository.fetchAllProductsBySellerId(sellerId);

      return catalog;
    } catch (error) {
      error.meta = { ...error.meta, 'BuyerService.fetchAllProductsBySellerId': { sellerId } };
      throw error;
    }
  }

  async createOrder(sellerId, orderObject) {
    try {
      const products = await this.productRepository.fetchProductsByIds(sellerId, orderObject.productIds);

      if (!products.length) {
        throw createError(422, 'Products are out of stock');
      }

      const productIds = products.map((product) => product._id);
      const totalPrice = products.reduce((acc, product) => acc + product.price, 0);

      orderObject.productIds = productIds;
      orderObject.totalPrice = totalPrice;
      orderObject.sellerId = sellerId;
      const order = await this.orderRepository.create(orderObject);

      await this.productRepository.bulkUpdateStocks(orderObject.productIds);

      return order;
    } catch (error) {
      error.meta = { ...error.meta, 'BuyerService.createOrder': { sellerId, orderObject } };
      throw error;
    }
  }

  async fetchAllOrders(buyerId) {
    try {
      const orders = await this.orderRepository.findAllOrdersByBuyerId(buyerId);

      return orders;
    } catch (error) {
      error.meta = { ...error.meta, 'BuyerService.fetchAllOrders': { buyerId } };
      throw error;
    }
  }
};
