const nodemailer = require('nodemailer');

const sendEmail = async (email, content) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.MAIL_ADMIN,
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
