// "use strict";
const {
  product,
  femaleClothe,
  maleClothe,
} = require("../models/product.model");
const { BadRequestError, Forbiden } = require("../core/error.response");
class ProductFactory {
  static async createProduct(type, payload) {
    switch (type) {
      case "MaleClothe":
        return new MaleClothe(payload).createProduct();
      case "FemaleClothe":
        return new FemaleClothe(payload).createProduct();
      default:
        throw new BadRequestError(`Invalid Product Types  ${type}`);
    }
  }
  static async getAllProducts() {
    return await product.find();
  }
  static async getProductById(id) {
    return await product.findById(id);
  }
  static async findProductByNameOrDescript(keyWords) {
    return await product.find({
      $or: [
        { product_name: { $regex: keyWords, $options: "i" } },
        { product_description: { $regex: keyWords, $options: "i" } },
      ],
    });
  }
}

class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_color,
    product_size,
    product_quantity,
    product_type,
    // product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_color = product_color;
    this.product_size = product_size;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    // this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }
  async createProduct() {
    return await product.create(this);
  }
}

class FemaleClothe extends Product {
  async createProduct() {
    const newClothing = await femaleClothe.create(this.product_attributes);
    if (!newClothing)
      throw new BadRequestError("create new FemaleClothe error");
    const newProduct = await super.createProduct();
    if (!newProduct) throw new BadRequestError("create new Product error");
    return newProduct;
  }
}

class MaleClothe extends Product {
  async createProduct() {
    const newElectronic = await maleClothe.create(this.product_attributes);
    if (!newElectronic)
      throw new BadRequestError("create new MaleClothe error");
    const newProduct = await super.createProduct();
    if (!newProduct) throw new BadRequestError("create new Product error");
    return newProduct;
  }
}
module.exports = ProductFactory;
