"use strict";
const ProductController = require("../../controllers/product.controller");
const express = require("express");
const { asyncHandler } = require("../../auth/checkAuth");
const { ensureAuthenticated } = require("../../middleware/authMiddleware");
const {createProduct, deleteByDate}= require("../../mock-data/generate-product")
const router = express.Router();
router.get("/product-create", createProduct);
router.get("/product-delete", deleteByDate);
router.get("/product-page", ProductController.getProductPage);

router.get("/get-all", asyncHandler(ProductController.getAllProduct));
router.get("/get-by-id/:id", asyncHandler(ProductController.getProductById));
router.get("/search", ProductController.getProductByNameOrDescription);
router.get("/home", ProductController.getHome);
router.get("/contact", ProductController.getContact);
router.get("/checkout", ensureAuthenticated, ProductController.getCheckOut);
router.get("/shop", ProductController.getShop);
router.get("/detail/:id", ProductController.getDetail);
router.get("/filter", ProductController.getFilter);

module.exports = router;
