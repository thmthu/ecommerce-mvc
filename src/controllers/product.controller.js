"use strict";
const ProductService = require("../services/product.service");
class ProductController {
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
}
module.exports = new ProductController();
