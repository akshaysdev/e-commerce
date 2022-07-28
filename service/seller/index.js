const createError = require('http-errors');

module.exports = class SellerService {
  constructor({ catalogRepository, productRepository, userRepository, orderRepository }) {
    this.catalogRepository = catalogRepository;
    this.productRepository = productRepository;
    this.userRepository = userRepository;
    this.orderRepository = orderRepository;
  }

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
