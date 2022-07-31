const { bulkUpdateProductsStockQuery, fetchAllProductsBySellerIdQuery } = require('./query');
const ProductSchema = require('./schema');

module.exports = class ProductRepository {
  constructor({ mongoDb }) {
    this.repository = ProductSchema(mongoDb);
  }

  /**
   * It creates a product
   * @param productObject - The object that will be used to create the product.
   * @returns The product object
   */
  async create(productObject) {
    try {
      const product = await this.repository.create(productObject);

      return product;
    } catch (error) {
      error.meta = { ...error.meta, 'ProductRepository.create': { productObject } };
      throw error;
    }
  }

  /**
   * It fetches all products by sellerId and productIds
   * @param sellerId - The sellerId of the seller whose products are to be fetched.
   * @param productIds - An array of product ids
   * @returns An array of products
   */
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

  /**
   * It updates a product by its id
   * @param productId - The id of the product you want to update.
   * @param productObject - This is the object that contains the updated product information.
   * @returns The updated product
   */
  async updateProductById(productId, productObject) {
    try {
      const products = await this.repository.updateOne({ _id: productId }, productObject);

      return products;
    } catch (error) {
      error.meta = { ...error.meta, 'ProductRepository.updateProductById': { productIds } };
      throw error;
    }
  }

  /**
   * It takes an array of products and returns a boolean
   * @param products - An array of objects with the following structure:
   * @returns a boolean value.
   */
  async bulkUpdateStocks(products) {
    try {
      const operations = bulkUpdateProductsStockQuery(products);

      await this.repository.bulkWrite(operations, { ordered: false });

      return true;
    } catch (error) {
      error.meta = { ...error.meta, 'ProductRepository.bulkUpdateStocks': { products } };
      throw error;
    }
  }

  /**
   * Find a product by name and catalogId
   * @param name - The name of the product to search for.
   * @param catalogId - The id of the catalog that the product belongs to.
   * @returns A product
   */
  async findByNameAndCatalogId(name, catalogId) {
    try {
      const regex = new RegExp(['^', name, '$'].join(''), 'gi');
      const product = await this.repository.findOne({ name: { $regex: regex }, catalogId });

      return product;
    } catch (error) {
      error.meta = { ...error.meta, 'ProductRepository.findByNameAndCatalogId': { name, catalogId } };
      throw error;
    }
  }
};
