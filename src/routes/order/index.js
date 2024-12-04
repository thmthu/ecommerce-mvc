"use strict";
const OrderController = require("../../controllers/order.controller");
const express = require("express");
const {ensureAuthenticated} = require("../../middleware/authMiddleware");
const router = express.Router();

router.get("/order", ensureAuthenticated, OrderController.getOrder);
router.post("/create-order", ensureAuthenticated, OrderController.createOrder);

module.exports = router;