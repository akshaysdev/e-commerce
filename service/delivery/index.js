const { jobType } = require('../../constants');

module.exports = class DeliveryService {
  constructor({ userRepository, orderRepository, queueBackgroundJobs }) {
    this.userRepository = userRepository;
    this.orderRepository = orderRepository;
    this.queueBackgroundJobs = queueBackgroundJobs;
  }

  /**
   * It finds delivery partners by location
   * @param location - The location of the delivery partner.
   * @returns An array of delivery partners
   */
  async findDeliveryPartners(location) {
    try {
      const deliveryPartners = await this.userRepository.findDeliveryPartnersByLocation(location);

      return deliveryPartners;
    } catch (error) {
      error.meta = { ...error.meta, 'DeliveryService.findDeliveryPartners': { location } };
      throw error;
    }
  }

  /**
   * It finds a random delivery partner from the list of delivery partners available in the buyer's
   * location and assigns the order to that delivery partner
   * @returns A boolean value
   */
  async assignDeliveryPartner({ orderId, buyerId }) {
    try {
      const buyer = await this.userRepository.findById(buyerId);
      const deliveryPartners = await this.findDeliveryPartners(buyer?.location);

      if (!deliveryPartners.length) {
        return true;
      }

      const idx = Math.floor(Math.random() * (deliveryPartners.length - 1));
      const deliveryPartnerId = deliveryPartners[idx]?._id;

      if (!deliveryPartnerId) {
        return true;
      }

      const isUpdated = await this.userRepository.updateActiveOrders(deliveryPartnerId, [orderId]);
      if (isUpdated) {
        await this.orderRepository.updateOrderWithDeliveryPartner(orderId, deliveryPartnerId);
      }

      return true;
    } catch (error) {
      error.meta = { ...error.meta, 'DeliveryService.assignDeliveryPartner': { orderId, buyerId } };
      throw error;
    }
  }

  /**
   * It fetches all the undelivered orders and queues a background job to assign a delivery partner to
   * each of them
   * @param deliveryPartnerId - The id of the delivery partner who is trying to accept the order.
   */
  async autoAssignDeliveryPartners(deliveryPartnerId) {
    try {
      const orders = await this.orderRepository.fetchAllUnDeliveredOrders();

      if (!orders.length) {
        return true;
      }

      for (const order of orders) {
        this.queueBackgroundJobs({
          name: jobType.delivery.name,
          className: this,
          functionName: this.assignDeliveryPartner,
          meta: { orderId: order._id, buyerId: order.buyerId },
        });
      }

      return true;
    } catch (error) {
      error.meta = { ...error.meta, 'DeliveryService.autoAssignOrders': { deliveryPartnerId } };
      throw error;
    }
  }

  /**
   * It marks an order as delivered and closes the order for the delivery partner
   * @param orderId - The id of the order that is being marked as delivered.
   * @param deliveryPartnerId - The id of the delivery partner who is delivering the order.
   * @returns isUpdated
   */
  async markAsDelivered(orderId, deliveryPartnerId) {
    try {
      const isUpdated = await this.orderRepository.markOrderAsDelivered(orderId);

      if (isUpdated) {
        await this.userRepository.closeDeliveredOrder(deliveryPartnerId, orderId);
      }

      return isUpdated;
    } catch (error) {
      error.meta = { ...error.meta, 'DeliveryService.markAsDelivered': { orderId } };
      throw error;
    }
  }

  /**
   * It fetches the active orders for a delivery partner
   * @param deliveryPartnerId - The id of the delivery partner
   * @returns An array of orders
   */
  async activeOrders(deliveryPartnerId) {
    try {
      const orders = await this.userRepository.fetchActiveOrders(deliveryPartnerId);

      return orders;
    } catch (error) {
      error.meta = { ...error.meta, 'DeliveryService.activeOrders': { deliveryPartnerId } };
      throw error;
    }
  }
};
