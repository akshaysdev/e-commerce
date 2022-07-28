const { ObjectId } = require('mongoose').Types;
const createError = require('http-errors');

const { userType } = require('../../constants');


const matchQuery = (id, type) => {
  let match;

  switch (type) {
    case userType.SELLER:
      match = { sellerId: ObjectId(id) };
      break;
    case userType.BUYER:
      match = { buyerId: ObjectId(id) };
      break;
    default:
      throw createError('Invalid user type');
  }

  return match;
};

const fetchAllOrders = (sellerOrBuyerId, type) => {
  return [
    { $match: matchQuery(sellerOrBuyerId, type) },
    { $sort: { createdAt: -1 } },
    { $lookup: { from: 'users', localField: 'buyerId', foreignField: '_id', as: 'buyer' } },
    { $unwind: '$buyer' },
    { $lookup: { from: 'users', localField: 'sellerId', foreignField: '_id', as: 'seller' } },
    { $unwind: '$seller' },
    { $lookup: { from: 'products', localField: 'productIds', foreignField: '_id', as: 'products' } },
    {
      $project: {
        _id: 0,
        orderId: '$_id',
        totalPrice: 1,
        seller: {
          _id: '$seller._id',
          name: '$seller.name',
        },
        buyer: {
          _id: '$buyer._id',
          name: '$buyer.name',
        },
        products: {
          _id: 1,
          name: 1,
          price: 1,
        },
      },
    },
  ];
};

module.exports = { fetchAllOrders };
