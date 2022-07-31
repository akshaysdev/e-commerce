const createError = require('http-errors');
const { jobType } = require('../../constants');

module.exports = class BuyerService {
  constructor({ userRepository, catalogRepository, orderRepository, productRepository, deliveryService }) {
    this.userRepository = userRepository;
    this.catalogRepository = catalogRepository;
    this.orderRepository = orderRepository;
    this.productRepository = productRepository;
    this.deliveryService = deliveryService;
  }

  /**
   * It fetches all sellers from the database
   * @returns An array of all sellers
   */
  async fetchAllSellers() {
    try {
      const sellers = await this.userRepository.fetchAllSellers();

      return sellers;
    } catch (error) {
      throw error;
    }
  }

  /**
   * It fetches all products by sellerId from the catalogRepository
   * @param sellerId - The sellerId of the seller whose products are to be fetched.
   */
  async fetchAllProductsBySellerId(sellerId) {
    try {
      const catalog = await this.catalogRepository.fetchAllProductsBySellerId(sellerId);

      return catalog || { message: 'No Product available' };
    } catch (error) {
      error.meta = { ...error.meta, 'BuyerService.fetchAllProductsBySellerId': { sellerId } };
      throw error;
    }
  }

  /**
   * It creates an order for a buyer
   * @param sellerId - The sellerId of the seller who is selling the products
   * @param orderObject - The object that will be created in the database.
   * @returns The order object
   */
  async createOrder(sellerId, orderObject) {
    try {
      const productQuantity = {};
      const productIdsOrdered = orderObject.products.map((product) => {
        productQuantity[product.id] = product.quantity;
        return product.id;
      });

      let products = await this.productRepository.fetchProductsByIds(sellerId, productIdsOrdered);
      if (!products.length) {
        throw createError(422, 'Products are out of stock');
      }

      const productsExceedingQuantity = {};
      products = products.filter((product) => {
        const res = product.stock >= (productQuantity[product._id] || 1);
        if (!res) {
          productsExceedingQuantity[product.name] = { availableStock: product.stock };
        }
        return res;
      });

      if (Object.keys(productsExceedingQuantity).length) {
        throw createError(422, 'Products exceed quantity', { productsExceedingQuantity });
      }
      const finalProducts = products.map((product) => {
        return { productId: product._id, quantity: productQuantity[product._id] };
      });
      const totalPrice = products.reduce((acc, product) => acc + product.price * productQuantity[product._id], 0);

      orderObject.products = finalProducts;
      orderObject.totalPrice = totalPrice;
      orderObject.sellerId = sellerId;
      const order = await this.orderRepository.create(orderObject);

      this.queueBackgroundJobs({
        name: jobType.product.name,
        className: this.productRepository,
        functionName: this.productRepository.bulkUpdateStocks,
        meta: orderObject.products,
      });

      this.queueBackgroundJobs({
        name: jobType.delivery.name,
        className: this.deliveryService,
        functionName: this.deliveryService.assignDeliveryPartner,
        meta: { orderId: order._id, buyerId: order.buyerId },
      });

      return order;
    } catch (error) {
      error.meta = { ...error.meta, 'BuyerService.createOrder': { sellerId, orderObject } };
      throw error;
    }
  }

  /**
   * It fetches all orders for a given buyer
   * @param buyerId - The id of the buyer whose orders we want to fetch.
   * @returns An array of orders
   */
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
