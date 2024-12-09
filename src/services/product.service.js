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
  static async getRandomProducts(limit) {
    return await product.aggregate([{ $sample: { size: limit } }]);
  }
  static async getLatestProducts(limit) {
    return await product.find().sort({ createdAt: -1 }).limit(limit);
  }
  static async getRelatedProducts(type, id, limit) {
    return await product
      .find({ product_type: type, _id: { $ne: id } })
      .limit(limit);
  }
  static async findProductByNameOrDescription(query) {
    return await product.find({
      $or: [
        { product_name: { $regex: query, $options: "i" } },
        { product_description: { $regex: query, $options: "i" } },
      ],
    });
  }
  static async findProductByFilter(query, price, color, size, gender) {
      let filter = {};

      if (query) {
        filter.$or = [
          { product_name: { $regex: query, $options: 'i' } },
          { product_description: { $regex: query, $options: 'i' } },
        ];
      }

      if (price) {
        const priceRanges = Array.isArray(price) ? price : [price];
        const priceFilter = priceRanges.map(range => {
          const [min, max] = range.split('-').map(Number);
          return { product_price: { $gte: min, $lte: max } };
        });

        if (filter.$or) {
          filter.$and = [{ $or: filter.$or }, { $or: priceFilter }];
          delete filter.$or;
        } else {
          filter.$or = priceFilter;
        }
      }

      if (color) {
        filter.product_color = { $in: Array.isArray(color) ? color : [color] };
      }

      if (size) {
        filter.product_size = { $in: Array.isArray(size) ? size : [size] };
      }

      if (gender) {
        filter.product_type = { $in: Array.isArray(gender) ? gender : [gender] };
      }
      return await product.find(filter);
     
    }
    //Limit: số product cho từng trang
    //skip: index của trang - 1, skip nghĩa là bỏ qua bao nhiêu index đầu tiên
    // ví dụ  trang 1, => skip (1-1)*50, trang 2 => skip (2,1)*50, trang 3 => skip (2-1)*50
    static async productForPage({limit: limit,skip: skip}){
      return await product.find().skip(skip*limit).limit(limit).lean();
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
