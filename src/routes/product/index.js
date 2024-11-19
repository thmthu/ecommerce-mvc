"use strict";
const ProductController = require("../../controllers/product.controller");
const express = require("express");
const { asyncHandler } = require("../../auth/checkAuth");
const router = express.Router();
router.post("/", asyncHandler(ProductController.createProduct));
router.get("/get-all", asyncHandler(ProductController.getAllProducts));
router.get("/get-by-id/:id", asyncHandler(ProductController.getProductById));
router.get(
  "/search/:keyword",
  asyncHandler(ProductController.getProductByNameOrDescription)
);
router.get('/create-page', ProductController.getCreateRestaurant);


module.exports = router;
