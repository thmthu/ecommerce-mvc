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
  getShop = (req, res) => {
    return res.render("shop.ejs", { page: "shop" });
  };
}
module.exports = new ProductController();
