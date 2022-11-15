const hash = {
  SALT: process.env.SALT_PASSWORD,
  ITERATIONS: 2000,
  KEY_LEN: 64,
  DIGEST: 'sha512',
};

const userType = {
  BUYER: 'BUYER',
  SELLER: 'SELLER',
  DELIVERY_PARTNER: 'DELIVERY PARTNER',
};

const jobType = {
  delivery: { name: 'delivery', concurrency: 1 },
  verification: { name: 'verification', concurrency: 1 },
  product: { name: 'product', concurrency: 1 },
  confirmation: { name: 'confirmation', concurrency: 1 },
};

const tokenAge = '1d';

const orderStatus = {
  DELIVERED: true,
  NOT_DELIVERED: false,
}

module.exports = { hash, userType, orderStatus, jobType, tokenAge };
