const createError = require('http-errors');
const { hasSpecialCharacter } = require('../../helpers/user');

module.exports = class SellerService {
  constructor({ catalogRepository, productRepository, userRepository, orderRepository }) {
    this.catalogRepository = catalogRepository;
    this.productRepository = productRepository;
    this.userRepository = userRepository;
    this.orderRepository = orderRepository;
  }

  /**
   * It validates the catalog object and throws an error if the catalog is invalid
   * @returns A boolean value
   */
  async validateCatalog({ catalog, sellerId }) {
    try {
      const seller = await this.userRepository.findById(sellerId);
      if (!seller) {
        throw createError(422, 'Seller does not exist');
      }

      if (!catalog.name) {
        throw createError(422, 'Catalog name is required');
      }

      const existingCatalog = await this.catalogRepository.findBySellerId(sellerId);
      if (existingCatalog) {
        throw createError(422, 'Catalog already exists for the seller');
      }

      return true;
    } catch (error) {
      error.meta = { ...error.meta, 'SellerService.validateCatalog': { catalog, sellerId } };
      throw error;
    }
  }

  /**
   * It validates the product object and throws an error if the product is invalid
   * @returns A boolean value
   */
  async validateProduct({ product, catalogId }) {
    try {
      const existingCatalog = await this.catalogRepository.findById(catalogId);

      if (!existingCatalog) {
        throw createError(422, 'Cannot create a product without a catalog');
      }

      if (!product.name) {
        throw createError(422, 'Product name is required');
      }

      if (!product.price) {
        throw createError(422, 'Product price is required');
      }

      if (hasSpecialCharacter(product.name)) {
        throw createError(422, 'Product name cannot have any special characters');
      }

      const existingProduct = await this.productRepository.findByNameAndCatalogId(product.name, catalogId);
      if (existingProduct) {
        throw createError(422, 'Product already exists for the catalog');
      }

      return true;
    } catch (error) {
      error.meta = { ...error.meta, 'SellerService.validateCatalog': { product, catalogId } };
      throw error;
    }
  }

  /**
   * It creates a catalog for a seller
   * @param catalogObject - The catalog object that you want to create.
   * @param sellerId - The sellerId of the seller who is creating the catalog.
   * @returns The catalog object
   */
  async createCatalog(catalogObject, sellerId) {
    try {
      await this.validateCatalog({ catalog: catalogObject, sellerId });

      catalogObject.sellerId = sellerId;
      const catalog = await this.catalogRepository.create(catalogObject);

      return catalog;
    } catch (error) {
      error.meta = { ...error.meta, 'SellerService.createCatalog': { catalogObject, sellerId } };
      throw error;
    }
  }

  /**
   * It creates a product in the database
   * @param productObject - The product object that you want to create.
   * @param catalogId - The id of the catalog that the product belongs to.
   * @returns The product object
   */
  async createProduct(productObject, catalogId) {
    try {
      await this.validateProduct({ product: productObject, catalogId });

      productObject.catalogId = catalogId;
      const product = await this.productRepository.create(productObject);

      return product;
    } catch (error) {
      error.meta = { ...error.meta, 'SellerService.createProduct': { productObject, catalogId } };
      throw error;
    }
  }

  /**
   * It fetches all orders for a seller
   * @param sellerId - The seller's id
   * @returns An array of orders
   */
  async fetchAllOrders(sellerId) {
    try {
      const orders = await this.orderRepository.findAllOrdersBySellerId(sellerId);

      return orders;
    } catch (error) {
      error.meta = { ...error.meta, 'SellerService.fetchAllOrders': { sellerId } };
      throw error;
    }
  }
};
