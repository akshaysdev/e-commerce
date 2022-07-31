const { verificationEmailContent } = require('../../helpers/authentication');

module.exports = class EmailService {
  constructor({ sendEmail }) {
    this.sendEmail = sendEmail;
  }

  /**
   * It takes in an object with an email and a token, and then it sends an email to the email address
   * with the token in the email
   * @param data - an object with an email and a token
   */
  async sendMail({ _id: userId, token, email }) {
    try {
      const content = verificationEmailContent(userId, token);

      await this.sendEmail(email, content);
    } catch (error) {
      error.meta = { ...error.meta, 'EmailService.sendMail': { email } };
      throw error;
    }
  }
};
