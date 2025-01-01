"use strict";

const CartService = require("../services/cart.service");
const AccessService = require("../services/access.service");
class CartController {
  getUserCart = async (req, res, next) => {
    const result = await CartService.getUserCart(req.user.id);
    const avatar = await AccessService.getAvatar(req.user.id);
    return res.render("cart.ejs", {
      cart: result,
      page: "cart",
      avatar,
      isAuthenticated: req.isAuthenticated(),
    });
  };
  addToCart = async (req, res, next) => {
    console.log(req.body);
    const userId = req.user.id;
    const product = req.body.product;
    product.price = parseFloat(product.price);
    product.quantity = parseInt(product.quantity);
    product.type = parseInt(product.type);
    const result = await CartService.addToCart(userId, product);
    return res.redirect("/shop");
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
    return res.json({ message: "Product removed from cart", result });
  };
}
module.exports = new CartController();
