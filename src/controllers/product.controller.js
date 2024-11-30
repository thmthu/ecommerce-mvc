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
    return res.render("cart.ejs", { page: "cart", isAuthenticated: req.isAuthenticated() });
  };
  getHome = async (req, res) => {
    try {
      const products = await Product.aggregate([{ $sample: { size: 4 } }]);
      const latestProducts = await Product.find().sort({ createdAt: -1 }).limit(4);

      // Render the index page with the random products
      res.render('index.ejs', { page: 'home', featuredProducts: products, latestProducts: latestProducts, isAuthenticated: req.isAuthenticated() });
    } catch (error) {
      console.error(error);
      res.redirect('./home');
    }
  };
  getContact = (req, res) => {
    return res.render("contact.ejs", { page: "contact", isAuthenticated: req.isAuthenticated() });
  };
  getCheckOut = (req, res) => {
    return res.render("checkout.ejs", { page: "checkout", isAuthenticated: req.isAuthenticated()});
  };
  getShop = async (req, res) => {
    const products = await ProductService.getAllProducts();
    console.log(products);
    return res.render("shop.ejs", { products: products, page: "shop", isAuthenticated: req.isAuthenticated()});
  };
  getDetail = async (req, res) => {
    const product = await ProductService.getProductById(req.params.id);
    const relatedProducts = await Product.find({
      product_type: product.product_type,
      _id: { $ne: product._id } // Exclude the current product
    }).limit(4); // Limit to 4 related products
    return res.render("detail.ejs", { product: product, relatedProducts: relatedProducts ,page: "detail", isAuthenticated: req.isAuthenticated()});
  };
  getAllProduct = async (req, res) => {
    const products = await ProductService.getAllProducts();
    return res.render("shop.ejs", { products: products, isAuthenticated: req.isAuthenticated()});
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
      res.render('shop.ejs', { products: products, page: 'shop', isAuthenticated: req.isAuthenticated()});
    } catch (error) {
      console.error(error);
      res.redirect('./home');
    }
  };

  getFilter = async (req, res) => {
    try {
      const { query, price, color, size, gender} = req.query;

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

      // Find products with the selected filters
      const products = await Product.find(filter);

      // Render the shop page with the filtered products
      res.render('shop.ejs', { products: products, page: 'shop', isAuthenticated: req.isAuthenticated()});
    } catch (error) {
      console.error(error);
      res.status(500).render('shop.ejs', { error: 'Server error. Please try again later.', isAuthenticated: req.isAuthenticated()});
    }
  };
  
}
module.exports = new ProductController();
