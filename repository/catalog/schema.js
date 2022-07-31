const Schema = require('mongoose').Schema;

/* Creating a new schema for the Catalog model. */
const CatalogSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = (mongoDb) => {
  return mongoDb.model('Catalog', CatalogSchema);
};
