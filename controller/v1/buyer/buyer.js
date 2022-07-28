const { buyerService } = require('../../../service/service');

const { response } = require('../../../error/response');

const fetchAllSellers = async (req, res) => {
  try {
    const response = await buyerService.fetchAllSellers();

    res.status(201).json(response);
  } catch (error) {
    res.status(error.status || 500).json(response(error));
  }
};

const fetchCatalog = async (req, res) => {
  try {
    const response = await buyerService.fetchAllProductsBySellerId(req.params.sellerId);

    res.status(201).json(response);
  } catch (error) {
    res.status(error.status || 500).json(response(error));
  }
};

const createOrder = async (req, res) => {
  try {
    const response = await buyerService.createOrder(req.params.sellerId, req.body);

    res.status(201).json(response);
  } catch (error) {
    res.status(error.status || 500).json(response(error));
  }
};

const fetchAllOrders = async (req, res) => {
  try {
    const response = await buyerService.fetchAllOrders(req.params.buyerId);

    res.status(201).json(response);
  } catch (error) {
    res.status(error.status || 500).json(response(error));
  }
};

module.exports = { fetchAllSellers, fetchCatalog, createOrder, fetchAllOrders };