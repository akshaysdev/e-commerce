const { ObjectId } = require('mongoose').Types;

/**
 * It fetches all the active orders for a delivery person
 * @param userId - The id of the user whose active orders are to be fetched.
 * @returns An array of objects.
 */
const queryToFetchAllActiveOrdersForDelivery = (userId) => {
  return [
    { $match: { _id: ObjectId(userId) } },
    { $lookup: { from: 'orders', localField: 'activeOrders', foreignField: '_id', as: 'orders' } },
    { $project: { _id: 0, orders: 1 } },
    { $unwind: '$orders' },
    { $lookup: { from: 'users', localField: 'orders.buyerId', foreignField: '_id', as: 'buyer' } },
    { $unwind: '$buyer' },
    { $lookup: { from: 'users', localField: 'orders.sellerId', foreignField: '_id', as: 'seller' } },
    { $unwind: '$seller' },
    {
      $lookup: {
        from: 'products',
        let: { productIds: '$orders.productIds' },
        pipeline: [
          { $match: { $expr: { $in: ['$_id', '$$productIds'] } } },
          { $project: { _id: 1, name: 1, price: 1 } },
        ],
        as: 'products',
      },
    },
    {
      $project: {
        orderDetails: {
          _id: '$orders._id',
          totalPrice: '$orders.totalPrice',
          isDelivered: '$orders.isDelivered',
          products: '$products',
          createdAt: '$orders.createdAt',
          buyer: {
            _id: '$buyer._id',
            name: '$buyer.name',
          },
          seller: {
            _id: '$seller._id',
            name: '$seller.name',
          },
        },
      },
    },
    { $sort: { 'orders.createdAt': -1 } },
  ];
};

module.exports = { queryToFetchAllActiveOrdersForDelivery };
