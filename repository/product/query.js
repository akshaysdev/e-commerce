const { ObjectId } = require('mongoose').Types;

const fetchAllProductsBySellerIdQuery = (sellerId, productIds) => {
  return [
    { $lookup: { from: 'catalogs', localField: 'catalogId', foreignField: '_id', as: 'catalog' } },
    { $unwind: '$catalog' },
    { $match: { 'catalog.sellerId': ObjectId(sellerId), _id: { $in: productIds.map(ObjectId) }, stock: { $gte: 1 } } },
    { $project: { _id: 1, price: 1 } }
  ];
};

const bulkUpdateProductsStockQuery = (productIds) => {
  const operations = [];

  productIds.forEach((productId) => {
    operations.push({
      updateOne: {
        filter: { _id: productId },
        update: { $inc: { stock: -1 } },
      },
    });
  });

  return operations;
};

module.exports = { fetchAllProductsBySellerIdQuery, bulkUpdateProductsStockQuery };
