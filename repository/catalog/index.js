const { fetchAllProductsForCatalog } = require('./query');
const CatalogSchema = require('./schema');

module.exports = class CatalogRepository {
  constructor({ mongoDb }) {
    this.repository = CatalogSchema(mongoDb);
  }

  async create(catalogObject) {
    try {
      const catalog = await this.repository.create(catalogObject);

      return catalog;
    } catch (error) {
      error.meta = { ...error.meta, 'CatalogRepository.create': { catalogObject } };
      throw error;
    }
  }

  async findBySellerId(sellerId) {
    try {
      const catalog = await this.repository.findOne({ sellerId });

      return catalog;
    } catch (error) {
      error.meta = { ...error.meta, 'CatalogRepository.findBySellerId': { sellerId } };
      throw error;
    }
  }

  async findById(catalogId) {
    try {
      const catalog = await this.repository.findOne({ catalogId });

      return catalog;
    } catch (error) {
      error.meta = { ...error.meta, 'CatalogRepository.findBySellerId': { catalogId } };
      throw error;
    }
  }

  async fetchAllProductsBySellerId(sellerId) {
    try {
      const query = fetchAllProductsForCatalog(sellerId);

      const catalogWithProducts = await this.repository.aggregate(query).allowDiskUse(true);

      return catalogWithProducts[0];
    } catch (error) {
      error.meta = { ...error.meta, 'CatalogRepository.fetchAllProductsBySellerId': { sellerId } };
      throw error;
    }
  }
};
