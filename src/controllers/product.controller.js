"use strict";
const ProductService = require("../services/product.service");
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
  getProductByKey = async (req, res) => {
    const key = req.params.key;
    const products = await ProductService.findProductByNameOrDescript(key);
    console.log(products);
    return res.render("shop.ejs", { products: products });
  };
}
module.exports = new ProductController();
