"use strict";

const CartService = require("../services/cart.service");
class CartController {
  getUserCart = async (req, res, next) => {
    const result = await CartService.getUserCart(req.body);
    return res.json({
      message: "ok",
      metadata: result,
    });
  };
  addToCart = async (req, res, next) => {
    console.log(req.body);
    const result = await CartService.addToCart(req.body);
    return res.json({
      message: "ok",
      metadata: result,
    });
  };
  updateCart = async (req, res, next) => {
    const result = await CartService.modifyQuantity(req.body);
    return res.json({
      message: "ok",
      metadata: result,
    });
  };
  removeFromCart = async (req, res, next) => {
    const result = await CartService.removeProduct(req.body);
    return res.json({
      message: "ok",
      metadata: result,
    });
  };
}
module.exports = new CartController();
