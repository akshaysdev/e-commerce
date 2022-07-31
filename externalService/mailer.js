const nodemailer = require('nodemailer');

/**
 * It sends an email to the given email address with the given content
 * @param email - The email address of the user to send the email to.
 * @param content - The content of the email.
 */
const sendEmail = async (email, content) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAILER_HOST,
      port: process.env.MAILER_PORT,
      auth: {
        user: process.env.MAILER_USERNAME,
        pass: process.env.MAILER_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.MAILER_ADMIN,
      to: email,
      subject: content.subject,
      html: content.html,
    });

    console.log('Email sent sucessfully');
  } catch (error) {
    console.log('Email not sent');
    console.error(error);
  }
};

module.exports = { sendEmail };
