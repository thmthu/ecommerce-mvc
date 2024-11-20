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
  getHome = (req, res) => {
    return res.render("index.ejs", { page: "home" });
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

      console.log(req);

      // Validate the input
      if (!query) {
        return res.status(400).render('index.ejs', { error: 'Search query is required', page: 'home'});
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
      res.status(500).render('index.ejs', { error: 'Server error. Please try again later.', page: 'home' });
    }
  };
  
}
module.exports = new ProductController();
