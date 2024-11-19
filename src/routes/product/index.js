"use strict";
const ProductController = require("../../controllers/product.controller");
const express = require("express");
const { asyncHandler } = require("../../auth/checkAuth");
const router = express.Router();
router.post("/", asyncHandler(ProductController.createProduct));
router.get("/get-all", asyncHandler(ProductController.getAllProducts));
router.get("/:id", asyncHandler(ProductController.getProductById));
router.get(
  "/search/:keyword",
  asyncHandler(ProductController.getProductByNameOrDescription)
);

module.exports = router;
