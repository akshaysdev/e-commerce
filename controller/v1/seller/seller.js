const { sellerService } = require('../../../service/service');

const { response } = require('../../../error/response');

const createCatalog = async (req, res) => {
  try {
    const response = await sellerService.createCatalog(req.body, req.params.sellerId);

    res.status(201).json(response);
  } catch (error) {
    res.status(error.status || 500).json(response(error));
  }
};

const createProduct = async (req, res) => {
  try {
    const response = await sellerService.createProduct(req.body, req.params.catalogId);

    res.status(201).json(response);
  } catch (error) {
    res.status(error.status || 500).json(response(error));
  }
};

const fetchAllOrders = async (req, res) => {
  try {
    const response = await sellerService.fetchAllOrders(req.params.sellerId);

    res.status(201).json(response);
  } catch (error) {
    res.status(error.status || 500).json(response(error));
  }
};

module.exports = { createCatalog, createProduct, fetchAllOrders };