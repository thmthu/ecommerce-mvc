"use strict";
const ProductService = require("../services/product.service");
const { CREATED, SuccessResponse } = require("../core/success.response");
class ProductController {
  createProduct = async (req, res, next) => {
    new CREATED({
      message: "Create new product success",
      metadata: await ProductService.createProduct(
        req.body.product_type,
        req.body
      ),
    }).send(res);
  };
  getAllProducts = async (req, res, next) => {
    new SuccessResponse({
      message: "Get all products success",
      metadata: await ProductService.getAllProducts(),
    }).send(res);
  };
  getProductById = async (req, res, next) => {
    const { id } = req.params;
    new SuccessResponse({
      message: "Get product by ID success",
      metadata: await ProductService.getProductById(id),
    }).send(res);
  };
  getProductByNameOrDescription = async (req, res, next) => {
    const { keyword } = req.params;
    new SuccessResponse({
      message: "Get products by name or description success",
      metadata: await ProductService.findProductByNameOrDescript(keyword),
    }).send(res);
  };
  getCart = (req, res) => {
    return res.render("cart.ejs", {page: "cart"});
  };
  getHome = (req, res) => {
    return res.render("index.ejs", {page: "home"});
  };
  getContact = (req, res) => {
    return res.render("contact.ejs", {page: "contact"});
  };
  getCheckOut = (req, res) => {
    return res.render("checkout.ejs", {page: "checkout"});
  }
  getShop = (req, res) => {
    return res.render("shop.ejs", {page: "shop"});
  }
}
module.exports = new ProductController();
