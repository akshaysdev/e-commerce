const { deliveryService } = require('../../../service/service');

const { response } = require('../../../error/response');

const activeOrders = async (req, res) => {
  try {
    const response = await deliveryService.activeOrders(req.params.deliveryPartnerId);

    res.status(201).json(response);
  } catch (error) {
    res.status(error.status || 500).json(response(error));
  }
};

const markDelivered = async (req, res) => {
  try {
    const response = await deliveryService.markAsDelivered(req.body.orderId, req.params.deliveryPartnerId);

    res.status(201).json(response);
  } catch (error) {
    res.status(error.status || 500).json(response(error));
  }
};

module.exports = { activeOrders, markDelivered };