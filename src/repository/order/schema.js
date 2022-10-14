const Schema = require('mongoose').Schema;

/* Creating a schema for the order model. */
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
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveryPartnerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    products: [
      {
        _id: false,
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
      },
    ],
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
