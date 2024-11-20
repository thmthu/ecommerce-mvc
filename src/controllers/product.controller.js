"use strict";
const ProductService = require("../services/product.service");
const Product = require('../models/product.model')['product'];
class ProductController {
  getRegister = (req, res) => {
    return res.render("register.ejs");
  };
  getLogin = (req, res) => {
    return res.render("login.ejs");
  };
  getCart = (req, res) => {
    return res.render("cart.ejs", { page: "cart" });
  };
  getHome = async (req, res) => {
    try {
      const products = await Product.aggregate([{ $sample: { size: 4 } }]);
      const latestProducts = await Product.find().sort({ createdAt: -1 }).limit(4);

      // Render the index page with the random products
      res.render('index.ejs', { page: 'home', featuredProducts: products, latestProducts: latestProducts });
    } catch (error) {
      console.error(error);
      res.redirect('./home');
    }
  };
  getContact = (req, res) => {
    return res.render("contact.ejs", { page: "contact" });
  };
  getCheckOut = (req, res) => {
    return res.render("checkout.ejs", { page: "checkout" });
  };
  getShop = async (req, res) => {
    const products = await ProductService.getAllProducts();
    console.log(products);
    return res.render("shop.ejs", { products: products, page: "shop" });
  };
  getDetail = async (req, res) => {
    const product = await ProductService.getProductById(req.params.id);
    console.log(product);
    return res.render("detail.ejs", { product: product, page: "detail" });
  };
  getAllProduct = async (req, res) => {
    const products = await ProductService.getAllProducts();
    return res.render("shop.ejs", { products: products });
  };
  getProductByNameOrDescription = async (req, res) => {
    try {
      const { query } = req.query;

      // Validate the input
      if (!query) {
        res.redirect('./home');
      }

      // Find products by name or description
      const products = await Product.find({
        $or: [
          { product_name: { $regex: query, $options: 'i' } },
          { product_description: { $regex: query, $options: 'i' } },
        ],
      });

      // Render the results
      res.render('shop.ejs', { products: products, page: 'shop'});
    } catch (error) {
      console.error(error);
      res.redirect('./home');
    }
  };

  getFilter = async (req, res) => {
    try {
      const { price, color, size, gender} = req.query;

      let filter = {};

      if (price) {
        const priceRanges = Array.isArray(price) ? price : [price];
        filter.$or = priceRanges.map(range => {
          const [min, max] = range.split('-').map(Number);
          return { product_price: { $gte: min, $lte: max } };
        });
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

      // Find products with the selected filters
      const products = await Product.find(filter);

      // Render the shop page with the filtered products
      res.render('shop.ejs', { products: products, page: 'shop' });
    } catch (error) {
      console.error(error);
      res.status(500).render('shop.ejs', { error: 'Server error. Please try again later.' });
    }
  };
  
}
module.exports = new ProductController();
