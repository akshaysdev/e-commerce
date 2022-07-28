const { bulkUpdateProductsStockQuery, fetchAllProductsBySellerIdQuery } = require('./query');
const ProductSchema = require('./schema');

module.exports = class ProductRepository {
  constructor({ mongoDb }) {
    this.repository = ProductSchema(mongoDb);
  }

  async create(productObject) {
    try {
      const product = await this.repository.create(productObject);

      return product;
    } catch (error) {
      error.meta = { ...error.meta, 'ProductRepository.create': { productObject } };
      throw error;
    }
  }

  async fetchProductsByIds(sellerId, productIds) {
    try {
      const query = fetchAllProductsBySellerIdQuery(sellerId, productIds);

      const products = await this.repository.aggregate(query).allowDiskUse(true);

      return products;
    } catch (error) {
      error.meta = { ...error.meta, 'ProductRepository.fetchProductsByIds': { sellerId, productIds } };
      throw error;
    }
  }

  async updateProductById(productId, productObject) {
    try {
      const products = await this.repository.updateOne({ _id: productId }, productObject);

      return products;
    } catch (error) {
      error.meta = { ...error.meta, 'ProductRepository.updateProductById': { productIds } };
      throw error;
    }
  }

  async bulkUpdateStocks(productIds) {
    try {
      const operations = bulkUpdateProductsStockQuery(productIds);

      await this.repository.bulkWrite(operations, { ordered: false });

      return true;
    } catch (error) {
      error.meta = { ...error.meta, 'ProductRepository.bulkUpdateStocks': { productIds } };
      throw error;
    }
  }

  async findByNameAndCatalogId(name, catalogId) {
    try {
      const product = await this.repository.findOne({ name, catalogId });

      return product;
    } catch (error) {
      error.meta = { ...error.meta, 'ProductRepository.findByNameAndCatalogId': { name, catalogId } };
      throw error;
    }
  }
};
