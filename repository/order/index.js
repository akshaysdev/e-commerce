const { userType, orderStatus } = require('../../constants');
const { fetchAllOrders } = require('./query');
const OrderSchema = require('./schema');

module.exports = class OrderRepository {
  constructor({ mongoDb }) {
    this.repository = OrderSchema(mongoDb);
  }

  /**
   * It creates an order
   * @param orderObject - The object that will be used to create the order.
   * @returns The order object
   */
  async create(orderObject) {
    try {
      const order = await this.repository.create(orderObject);

      return order;
    } catch (error) {
      error.meta = { ...error.meta, 'OrderRepository.create': { orderObject } };
      throw error;
    }
  }

  /**
   * It fetches all the orders for a seller
   * @param sellerId - The seller's id
   * @returns An array of orders
   */
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

  /**
   * It fetches all the orders for a given buyerId
   * @param buyerId - The id of the buyer
   * @returns An array of orders
   */
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

  /**
   * Finds an order by its id
   * @param orderId - The orderId of the order you want to find.
   * @returns The order object
   */
  async findById(orderId) {
    try {
      const order = await this.repository.findOne({ orderId });

      return order;
    } catch (error) {
      error.meta = { ...error.meta, 'OrderRepository.findById': { orderId } };
      throw error;
    }
  }

  /**
   * It fetches all the undelivered orders from the database
   * @returns An array of orders
   */
  async fetchAllUnDeliveredOrders() {
    try {
      const orders = await this.repository
        .find({ isDelivered: orderStatus.NOT_DELIVERED, deliveryPartnerId: { $eq: null } })
        .sort({ createdAt: 1 });

      return orders;
    } catch (error) {
      throw error;
    }
  }

  /**
   * It updates the order with the delivery partner id
   * @param orderId - The id of the order to be updated
   * @param deliveryPartnerId - The id of the delivery partner that will be assigned to the order.
   * @returns True or False
   */
  async updateOrderWithDeliveryPartner(orderId, deliveryPartnerId) {
    try {
      await this.repository.updateOne({ _id: orderId }, { deliveryPartnerId });

      return true;
    } catch (error) {
      error.meta = { ...error.meta, 'OrderRepository.updateOrderWithDeliveryPartner': { orderId, deliveryPartnerId } };
      throw error;
    }
  }

  /**
   * It updates the order with the given id and marks it as delivered
   * @param orderId - The id of the order to be marked as delivered.
   * @returns A boolean value
   */
  async markOrderAsDelivered(orderId) {
    try {
      await this.repository.updateOne({ _id: orderId }, { isDelivered: orderStatus.DELIVERED });

      return true;
    } catch (error) {
      error.meta = { ...error.meta, 'OrderRepository.markOrderAsDelivered': { orderId } };
      throw error;
    }
  }
};
