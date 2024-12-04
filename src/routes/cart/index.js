"use strict";
const CartController = require("../../controllers/cart.controller");
const express = require("express");
const {ensureAuthenticated} = require("../../middleware/authMiddleware");
const router = express.Router();
// get all thông tin items trong cart để hiện ra giỏ hàng hoặc checkout, nhận user Id 
//=> m cần tìm cách khi user đăng nhập thì phải lưu lại userId ở đâu đó để truyền vào đây
/*
{
    "userId": "67456c3308155bd20423b408"
}
    */
router.get("/cart", ensureAuthenticated, CartController.getUserCart); 
// thêm vào giỏi hàng, khi nào bấm vào nút add to cart ở trang product thì thêm
//body để send req:
/*
{
    "userId": "67456c3308155bd20423b408",
    "product": {
        "product_id": "673c43d9075bcb82f35de912",
        "quantity": 1,
        "price": 5
    }
}
 */
router.post("/cart-add", CartController.addToCart);
//Up and dow quantity ở trang product detail hoặc ở cart, 
router.post("/cart-update", CartController.updateCart);
router.post("/cart-remove-product", CartController.removeFromCart);

module.exports = router;
