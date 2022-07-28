const hash = {
  SALT: 'e-commerce-app-salt',
  ITERATIONS: 2000,
  KEY_LEN: 64,
  DIGEST: 'sha512',
};

const userType = {
  BUYER: 'Buyer',
  SELLER: 'Seller',
};

module.exports = { hash, userType };
