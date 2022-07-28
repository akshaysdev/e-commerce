const { userType } = require('../../constants');
const UserSchema = require('./schema');

module.exports = class UserRepository {
  constructor({ mongoDb }) {
    this.repository = UserSchema(mongoDb);
  }

  async create(userObject) {
    try {
      const user = await this.repository.create(userObject);

      return user;
    } catch (error) {
      error.meta = { ...error.meta, 'UserRepository.create': { userObject } };
      throw error;
    }
  }

  async findByEmail(email) {
    try {
      const user = await this.repository.findOne({ email });

      return user;
    } catch (error) {
      error.meta = { ...error.meta, 'UserRepository.findByEmail': { email } };
      throw error;
    }
  }

  async findById(id) {
    try {
      const user = await this.repository.findById(id);

      return user;
    } catch (error) {
      error.meta = { ...error.meta, 'UserRepository.findById': { id } };
      throw error;
    }
  }

  async markAsVerified(userId) {
    try {
      await this.repository.updateOne({ _id: userId }, { verified: true, $unset: { token: '' } });

      return true;
    } catch (error) {
      error.meta = { ...error.meta, 'UserRepository.markAsVerified': { userId } };
      throw error;
    }
  }

  async updateToken(userId, token) {
    try {
      await this.repository.updateOne({ _id: userId }, { token });

      return true;
    } catch (error) {
      error.meta = { ...error.meta, 'UserRepository.updateToken': { userId, token } };
      throw error;
    }
  }

  async fetchAllSellers() {
    try {
      const sellers = await this.repository.find({ type: userType.SELLER }).select('name');

      return sellers;
    } catch (error) {
      throw error;
    }
  }
};
