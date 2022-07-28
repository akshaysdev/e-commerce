const Schema = require('mongoose').Schema;

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
