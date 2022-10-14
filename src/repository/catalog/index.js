const { fetchAllProductsForCatalog } = require('./query');
const CatalogSchema = require('./schema');

module.exports = class CatalogRepository {
  constructor({ mongoDb }) {
    this.repository = CatalogSchema(mongoDb);
  }

  /**
   * This function creates a new catalog object and returns it
   * @param catalogObject - The object that will be created in the database.
   * @returns The catalog object
   */
  async create(catalogObject) {
    try {
      const catalog = await this.repository.create(catalogObject);

      return catalog;
    } catch (error) {
      error.meta = { ...error.meta, 'CatalogRepository.create': { catalogObject } };
      throw error;
    }
  }

  /**
   * Finds a catalog by sellerId
   * @param sellerId - The sellerId of the catalog to find.
   * @returns The catalog object
   */
  async findBySellerId(sellerId) {
    try {
      const catalog = await this.repository.findOne({ sellerId });

      return catalog;
    } catch (error) {
      error.meta = { ...error.meta, 'CatalogRepository.findBySellerId': { sellerId } };
      throw error;
    }
  }

  /**
   * Finds a catalog by its id
   * @param catalogId - The id of the catalog to find.
   * @returns The catalog object
   */
  async findById(catalogId) {
    try {
      const catalog = await this.repository.findOne({ catalogId });

      return catalog;
    } catch (error) {
      error.meta = { ...error.meta, 'CatalogRepository.findBySellerId': { catalogId } };
      throw error;
    }
  }

  /**
   * It fetches all the products for a given sellerId
   * @param sellerId - The sellerId of the seller whose catalog you want to fetch.
   * @returns An array of catalogs with products
   */
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
