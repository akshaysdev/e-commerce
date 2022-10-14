const { ObjectId } = require('mongoose').Types;

/**
 * It fetches all the products for a given sellerId, and filters out the products that are out of stock
 * @param sellerId - The seller's ID.
 * @returns An array of objects with the seller's catalog and the products that are in stock.
 */
const fetchAllProductsForCatalog = (sellerId) => {
  return [
    { $match: { sellerId: ObjectId(sellerId) } },
    { $lookup: { from: 'users', localField: 'sellerId', foreignField: '_id', as: 'seller' } },
    { $unwind: '$seller' },
    { $lookup: { from: 'products', localField: '_id', foreignField: 'catalogId', as: 'products' } },
    {
      $project: {
        _id: 0,
        seller: {
          _id: '$seller._id',
          name: '$seller.name',
        },
        catalog: {
          _id: '$_id',
          name: '$name',
        },
        products: {
          _id: 1,
          name: 1,
          price: 1,
          stock: 1,
        },
      },
    },
    {
      $project: {
        seller: 1,
        catalog: 1,
        products: {
          $filter: {
            input: '$products',
            as: 'product',
            cond: { $gte: ['$$product.stock', 1] },
          },
        },
      },
    },
  ];
};

module.exports = { fetchAllProductsForCatalog };
