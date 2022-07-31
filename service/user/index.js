const createError = require('http-errors');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const { validatePassword, validateEmail } = require('../../helpers/user');
const { verificationEmailContent } = require('../../helpers/authentication');
const { hash, jobType } = require('../../constants');

module.exports = class UserService {
  constructor({ userRepository, queueBackgroundJobs, emailService }) {
    this.userRepository = userRepository;
    this.queueBackgroundJobs = queueBackgroundJobs;
    this.emailService = emailService;
  }

  /**
   * It validates the user's input and throws an error if the input is invalid
   */
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

  /**
   * It validates the user object, creates a token, hashes the password, and then creates the user
   * @param userObject - The user object that is passed to the register function.
   */
  async register(userObject) {
    try {
      await this.validateUser(userObject);

      const token = crypto.randomBytes(32).toString('hex');
      userObject.token = token;

      const hashedPassword = crypto
        .pbkdf2Sync(userObject.password, hash.SALT, hash.ITERATIONS, hash.KEY_LEN, hash.DIGEST)
        .toString(`hex`);
      userObject.password = hashedPassword;

      userObject.type = userObject.type.toUpperCase();
      userObject.location = userObject.location.toUpperCase();

      const user = await this.userRepository.create(userObject);

      if (user) {
        const meta = {
          _id: user._id,
          token: user.token,
          email: user.email,
        };

        this.queueBackgroundJobs({
          name: jobType.verification.name,
          className: this.emailService,
          functionName: this.emailService.sendMail,
          meta,
        });
      }

      return { status: true, message: 'Verification link has been sent to your email' };
    } catch (error) {
      error.meta = { ...error.meta, 'UserService.register': { userObject } };
      throw error;
    }
  }

  /**
   * It takes a userId and a token, finds the user in the database, checks if the user is already
   * verified, if not, checks if the token matches the one in the database, and if it does, marks the
   * user as verified
   * @param userId - The user's id
   * @param token - The token that was sent to the user's email address.
    * @returns A message indicating if the user was verified or not.
   */
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

  /**
   * It takes a userId, finds the user, generates a token, updates the user with the token, and then
   * queues a background job to send an email to the user with the token
   * @param userId - The userId of the user who needs to be verified.
   */
  async resendVerification(userId) {
    try {
      const user = await this.userRepository.findById(userId);

      if (!user) {
        throw createError(422, 'User not found');
      }

      const token = crypto.randomBytes(32).toString('hex');
      await this.userRepository.updateToken(userId, token);

      if (user) {
        const meta = {
          _id: userId,
          token,
          email: user.email,
        };

        this.queueBackgroundJobs({
          name: jobType.verification.name,
          className: this.emailService,
          functionName: this.emailService.sendMail,
          meta,
        });
      }

      return { status: true, message: 'Resent verification link to the email' };
    } catch (error) {
      error.meta = { ...error.meta, 'UserService.verify': { userId } };
      throw error;
    }
  }

  /**
   * It takes in an email and password, finds the user in the database, checks if the user is verified,
   * hashes the password, compares the hashed password with the one in the database, and if they match,
   * it returns a status of true, a message of 'User logged in', and an access token
   * @returns A message with the status of the login, and the access token
   */
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

      if (user.password !== hashedPassword || user.email !== email) {
        throw createError(422, 'Invalid user credentials');
      }

      const accessToken = jwt.sign({ user: { _id: user._id, type: user.type } }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1h',
      });

      return { status: true, message: 'User logged in', accessToken };
    } catch (error) {
      error.meta = { ...error.meta, 'UserService.login': { email, password } };
      throw error;
    }
  }
};
