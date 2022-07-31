const { userType } = require('../../constants');
const { queryToFetchAllActiveOrdersForDelivery } = require('./query');
const UserSchema = require('./schema');

module.exports = class UserRepository {
  constructor({ mongoDb }) {
    this.repository = UserSchema(mongoDb);
  }

 /**
  * It creates a user
  * @param userObject - The object that will be used to create the user.
  * @returns The user object
  */
  async create(userObject) {
    try {
      const user = await this.repository.create(userObject);

      return user;
    } catch (error) {
      error.meta = { ...error.meta, 'UserRepository.create': { userObject } };
      throw error;
    }
  }

  /**
   * It finds a user by email
   * @param email - The email of the user to find.
   * @returns The user object
   */
  async findByEmail(email) {
    try {
      const user = await this.repository.findOne({ email });

      return user;
    } catch (error) {
      error.meta = { ...error.meta, 'UserRepository.findByEmail': { email } };
      throw error;
    }
  }

  /**
   * It finds a user by id
   * @param id - The id of the user to find.
   * @returns The user object
   */
  async findById(id) {
    try {
      const user = await this.repository.findById(id);

      return user;
    } catch (error) {
      error.meta = { ...error.meta, 'UserRepository.findById': { id } };
      throw error;
    }
  }

  /**
   * It marks a user as verified by updating the user's document in the database
   * @param userId - The user's id
   * @returns A boolean value
   */
  async markAsVerified(userId) {
    try {
      await this.repository.updateOne({ _id: userId }, { verified: true, $unset: { token: '' } });

      return true;
    } catch (error) {
      error.meta = { ...error.meta, 'UserRepository.markAsVerified': { userId } };
      throw error;
    }
  }

  /**
   * It updates the token of a user
   * @param userId - The user's id
   * @param token - The token to be updated
   * @returns A boolean value.
   */
  async updateToken(userId, token) {
    try {
      await this.repository.updateOne({ _id: userId }, { token });

      return true;
    } catch (error) {
      error.meta = { ...error.meta, 'UserRepository.updateToken': { userId, token } };
      throw error;
    }
  }

  /**
   * It updates the active orders of a user
   * @param userId - The user's id
   * @param orders - {
   * @returns True
   */
  async updateActiveOrders(userId, orders) {
    try {
      await this.repository.updateOne({ _id: userId }, { $push: { activeOrders: orders } });

      return true;
    } catch (error) {
      error.meta = { ...error.meta, 'UserRepository.updateActiveOrders': { userId, orders } };
      throw error;
    }
  }

  /**
   * This function removes the delivered order from the user's active orders
   * @param userId - The id of the user who's order is being closed
   * @param deliveredOrderId - The id of the order that was delivered
   * @returns True
   */
  async closeDeliveredOrder(userId, deliveredOrderId) {
    try {
      await this.repository.updateOne({ _id: userId }, { $pull: { activeOrders: deliveredOrderId } });

      return true;
    } catch (error) {
      error.meta = { ...error.meta, 'UserRepository.closeDeliveredOrder': { userId, deliveredOrderId } };
      throw error;
    }
  }

  /**
   * It fetches all active orders for a delivery person
   * @param userId - The id of the user who is requesting the orders
   * @returns An array of orders
   */
  async fetchActiveOrders(userId) {
    try {
      const query = queryToFetchAllActiveOrdersForDelivery(userId);

      const orders = await this.repository.aggregate(query).allowDiskUse(true);

      return orders;
    } catch (error) {
      throw error;
    }
  }

  /**
   * It finds all the delivery partners who are within the given location and have less than 5 active
   * orders
   * @param location - The location of the user
   * @returns An array of users
   */
  async findDeliveryPartnersByLocation(location) {
    try {
      const users = await this.repository
        .find({
          type: userType.DELIVERY_PARTNER,
          location,
          verified: { $eq: true },
          $where: 'this.activeOrders.length < 5',
        })
        .select('_id name activeOrders');

      return users;
    } catch (error) {
      error.meta = { ...error.meta, 'UserRepository.findDeliveryPartnersByLocation': { location } };
      throw error;
    }
  }

  /**
   * It fetches all sellers from the database
   * @returns An array of sellers
   */
  async fetchAllSellers() {
    try {
      const sellers = await this.repository.find({ type: userType.SELLER }).select('name');

      return sellers;
    } catch (error) {
      throw error;
    }
  }
};
