const { ObjectId } = require('mongoose').Types;
const createError = require('http-errors');

const { userType } = require('../../constants');

/**
 * It returns a MongoDB query object that matches the given user id and type
 * @param id - The id of the user
 * @param type - The type of user that is making the request.
 */
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

/**
 * It fetches all the orders of a particular user (buyer or seller) and returns the order details
 * @param sellerOrBuyerId - The id of the user who is either the seller or the buyer.
 * @param type - 'buyer' or 'seller'
 * @returns An array of objects.
 */
const fetchAllOrders = (sellerOrBuyerId, type) => {
  return [
    { $match: matchQuery(sellerOrBuyerId, type) },
    { $sort: { createdAt: -1 } },
    { $lookup: { from: 'users', localField: 'buyerId', foreignField: '_id', as: 'buyer' } },
    { $unwind: '$buyer' },
    { $lookup: { from: 'users', localField: 'sellerId', foreignField: '_id', as: 'seller' } },
    { $unwind: '$seller' },
    { $unwind: '$buyer' },
    { $lookup: { from: 'users', localField: 'deliveryPartnerId', foreignField: '_id', as: 'deliveryPartner' } },
    { $unwind: { path: '$deliveryPartner', preserveNullAndEmptyArrays: true } },
    { $unwind: '$products' },
    { $lookup: { from: 'products', localField: 'products.productId', foreignField: '_id', as: 'actualProduct' } },
    { $unwind: '$actualProduct' },
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
        deliveryPartner: {
          _id: '$deliveryPartner._id',
          name: '$deliveryPartner.name',
        },
        isDelivered: 1,
        product: {
          _id: '$products._id',
          name: '$actualProduct.name',
          price: '$actualProduct.price',
          quantity: '$products.quantity',
        },
      },
    },
    {
      $group: {
        _id: {
          orderId: '$orderId',
          buyer: '$buyer',
          seller: '$seller',
          deliveryPartner: '$deliveryPartner',
          isDelivered: '$isDelivered',
          totalPrice: '$totalPrice',
        },
        products: { $push: '$product' },
      },
    },
    {
      $project: {
        _id: 0,
        orderId: '$_id.orderId',
        buyer: '$_id.buyer',
        seller: '$_id.seller',
        deliveryPartner: '$_id.deliveryPartner',
        totalPrice: '$_id.totalPrice',
        isDelivered: '$_id.isDelivered',
        products: '$products',
      },
    },
  ];
};

module.exports = { fetchAllOrders };
