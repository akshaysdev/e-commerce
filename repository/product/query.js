const { ObjectId } = require('mongoose').Types;

/**
 * It fetches all products by sellerId and productIds
 * @param sellerId - The seller's id
 * @param productIds - An array of product ids
 * @returns An array of objects.
 */
const fetchAllProductsBySellerIdQuery = (sellerId, productIds) => {
  return [
    { $lookup: { from: 'catalogs', localField: 'catalogId', foreignField: '_id', as: 'catalog' } },
    { $unwind: '$catalog' },
    { $match: { 'catalog.sellerId': ObjectId(sellerId), _id: { $in: productIds.map(ObjectId) }, stock: { $gte: 1 } } },
    { $project: { _id: 1, name: 1, price: 1, stock: 1 } }
  ];
};

/**
 * It takes an array of products and returns an array of MongoDB operations that will update the stock
 * of each product
 * @param products - An array of objects containing the productId and quantity of each product in the
 * order.
 * @returns An array of objects.
 */
const bulkUpdateProductsStockQuery = (products) => {
  const operations = [];

  products.forEach((product) => {
    operations.push({
      updateOne: {
        filter: { _id: product.productId },
        update: { $inc: { stock: -product.quantity } },
      },
    });
  });

  return operations;
};

module.exports = { fetchAllProductsBySellerIdQuery, bulkUpdateProductsStockQuery };
