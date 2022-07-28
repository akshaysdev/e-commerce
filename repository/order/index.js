const { userType } = require('../../constants');
const { fetchAllOrders } = require('./query');
const OrderSchema = require('./schema');

module.exports = class OrderRepository {
  constructor({ mongoDb }) {
    this.repository = OrderSchema(mongoDb);
  }

  async create(orderObject) {
    try {
      const order = await this.repository.create(orderObject);

      return order;
    } catch (error) {
      error.meta = { ...error.meta, 'OrderRepository.create': { orderObject } };
      throw error;
    }
  }

  async findAllOrdersBySellerId(sellerId) {
    try {
      const query = fetchAllOrders(sellerId, userType.SELLER);

      const orders = await this.repository.aggregate(query).allowDiskUse(true);

      return orders;
    } catch (error) {
      error.meta = { ...error.meta, 'OrderRepository.findAllOrdersBySellerId': { sellerId } };
      throw error;
    }
  }

  async findAllOrdersByBuyerId(buyerId) {
    try {
      const query = fetchAllOrders(buyerId, userType.BUYER);

      const orders = await this.repository.aggregate(query).allowDiskUse(true);

      return orders;
    } catch (error) {
      error.meta = { ...error.meta, 'OrderRepository.findAllOrdersByBuyerId': { buyerId } };
      throw error;
    }
  }

  async findById(orderId) {
    try {
      const order = await this.repository.findOne({ orderId });

      return order;
    } catch (error) {
      error.meta = { ...error.meta, 'OrderRepository.findById': { orderId } };
      throw error;
    }
  }
};
