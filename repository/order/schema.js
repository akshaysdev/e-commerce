const Schema = require('mongoose').Schema;

const OrderSchema = new Schema(
  {
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    buyerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    productIds: {
      type: Array(Schema.Types.ObjectId),
      ref: 'Product',
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = (mongoDb) => {
  return mongoDb.model('Order', OrderSchema);
};
