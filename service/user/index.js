const createError = require('http-errors');
const crypto = require('crypto');

const { validatePassword, validateEmail } = require('../../helpers/user');
const { verifyEmailContent } = require('../../helpers/authentication');
const { hash } = require('../../constants');

module.exports = class UserService {
  constructor({ userRepository, sendEmail }) {
    this.userRepository = userRepository;
    this.sendEmail = sendEmail;
  }

  async validateUser({ name, email, password, type }) {
    try {
      if (!name) {
        throw createError(422, 'Name is required');
      }

      if (!email) {
        throw createError(422, 'Email is required');
      }

      validateEmail(email);

      if (!password) {
        throw createError(422, 'Password is required');
      }

      validatePassword(password);

      if (!type) {
        throw createError(422, 'Type is required');
      }

      const user = await this.userRepository.findByEmail(email);
      if (user) {
        throw createError(422, 'User already exists');
      }
    } catch (error) {
      error.meta = { ...error.meta, 'UserService.validateUser': { name, email, password, type } };
      throw error;
    }
  }

  async register(userObject) {
    try {
      await this.validateUser(userObject);

      const token = crypto.randomBytes(32).toString('hex');
      userObject.token = token;

      const hashedPassword = crypto
        .pbkdf2Sync(userObject.password, hash.SALT, hash.ITERATIONS, hash.KEY_LEN, hash.DIGEST)
        .toString(`hex`);
      userObject.password = hashedPassword;

      userObject.type = userObject.type.charAt(0).toUpperCase() + userObject.type.substring(1);

      const user = await this.userRepository.create(userObject);

      if (user) {
        const content = verifyEmailContent(user._id, token);

        await this.sendEmail(user.email, content);
      }

      return { status: true, message: 'Verification link has been sent to your email' };
    } catch (error) {
      error.meta = { ...error.meta, 'UserService.register': { userObject } };
      throw error;
    }
  }

  async verify(userId, token) {
    try {
      const user = await this.userRepository.findById(userId);

      if (user.verified) {
        return { status: true, message: 'Already verified' };
      }

      if (!user) {
        throw createError(422, 'User not found');
      }

      if (user.token !== token) {
        throw createError(422, 'Invalid token');
      }

      await this.userRepository.markAsVerified(userId);

      return { status: true, message: 'Email is verified' };
    } catch (error) {
      error.meta = { ...error.meta, 'UserService.verify': { userId, token } };
      throw error;
    }
  }

  async resendVerification(userId) {
    try {
      const user = await this.userRepository.findById(userId);

      if (!user) {
        throw createError(422, 'User not found');
      }

      const token = crypto.randomBytes(32).toString('hex');
      await this.userRepository.updateToken(userId, token);

      if (user) {
        const content = verifyEmailContent(userId, token);

        await this.sendEmail(user.email, content);
      }

      return { status: true, message: 'Resent verification link to the email' };
    } catch (error) {
      error.meta = { ...error.meta, 'UserService.verify': { userId } };
      throw error;
    }
  }

  async login({ email, password }) {
    try {
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        throw createError(422, 'User not found');
      }

      if (!user.verified) {
        throw createError(422, 'User not verified');
      }

      const hashedPassword = crypto
        .pbkdf2Sync(password, hash.SALT, hash.ITERATIONS, hash.KEY_LEN, hash.DIGEST)
        .toString(`hex`);

      if (user.password !== hashedPassword) {
        throw createError(422, 'Invalid password');
      }

      return { status: true, message: 'User logged in', name: user.name, email: user.email, _id: user._id };
    } catch (error) {
      error.meta = { ...error.meta, 'UserService.login': { email, password } };
      throw error;
    }
  }
};
