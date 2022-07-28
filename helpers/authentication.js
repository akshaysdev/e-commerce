const verifyEmailContent = (userId, token) => {
  return {
    subject: `Verify Email`,
    html: `Please verify your email by clicking the link below:<br/> <a href="${process.env.CLIENT_URL}/v1/auth/verify/${userId}/${token}">Verify</a><br/>Thanks, <br/>E-Commerce`,
  };
};

module.exports = { verifyEmailContent };
