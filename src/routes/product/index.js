"use strict";
const ProductController = require("../../controllers/product.controller");
const express = require("express");
const { asyncHandler } = require("../../auth/checkAuth");
const {ensureAuthenticated} = require("../../middleware/authMiddleware");
const router = express.Router();
router.post("/", asyncHandler(ProductController.createProduct));
router.get("/get-all", asyncHandler(ProductController.getAllProducts));
router.get("/get-by-id/:id", asyncHandler(ProductController.getProductById));
router.get(
  "/search",
  ProductController.getProductByNameOrDescription
);
router.get("/register", ProductController.getRegister);
router.get("/login", ProductController.getLogin);
router.get('/cart', ensureAuthenticated, ProductController.getCart);
router.get('/home', ProductController.getHome);
router.get('/contact', ProductController.getContact);
router.get('/checkout', ensureAuthenticated, ProductController.getCheckOut);
router.get('/shop', ProductController.getShop);
router.get('/detail/:id', ProductController.getDetail);
router.get('/filter', ProductController.getFilter);


module.exports = router;
