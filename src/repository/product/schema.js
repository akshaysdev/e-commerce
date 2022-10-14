const Schema = require('mongoose').Schema;

/* Creating a schema for the product model. */
const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      index: true,
      default: 1,
    },
    catalogId: {
      type: Schema.Types.ObjectId,
      ref: 'Catalog',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = (mongoDb) => {
  return mongoDb.model('Product', ProductSchema);
};
