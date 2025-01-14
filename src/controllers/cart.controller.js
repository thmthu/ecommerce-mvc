"use strict";

const CartService = require("../services/cart.service");
const AccessService = require("../services/access.service");
class CartController {
  getUserCart = async (req, res, next) => {
    const userId = req.user == undefined ? null : req.user.id;
    const result = await CartService.getUserCart(userId);
    const avatar = await AccessService.getAvatar(userId);
    const numProducts = await CartService.getCartProductsSize(userId);
    return res.render("cart.ejs", {
      cart: result,
      page: "cart",
      avatar,
      numProducts,
      isAuthenticated: req.isAuthenticated(),
    });
  };
  addToCart = async (req, res, next) => {
    console.log(req.body);
    if (!req.user || req.user == undefined) {
      return res.json({ message: "Please login to add to cart" });
    }
    const userId = req.user.id;
    const product = req.body.product;
    product.price = parseFloat(product.price);
    product.quantity = parseInt(product.quantity);
    product.type = parseInt(product.type);
    const result = await CartService.addToCart(userId, product);
    const numProducts = await CartService.getCartProductsSize(userId);
    return res.json({ message: "Product added to cart", result, numProducts });
  };
  updateCart = async (req, res, next) => {
    const userId = req.user.id;
    const product = req.body;
    console.log(product);

    const result = await CartService.updateUserCartQuantity(userId, product);
    return res.json({
      message: "ok",
      metadata: result,
    });
  };
  removeFromCart = async (req, res, next) => {
    const userId = req.user.id;
    const productId = req.body.productId;

    const result = await CartService.removeProduct(userId, productId);
    const numProducts = await CartService.getCartProductsSize(userId);
    return res.json({ message: "Product removed from cart", result, numProducts });
  };
}
module.exports = new CartController();
