"use strict";
const OrderService = require("../services/order.service");
const CartService = require("../services/cart.service");
const AccessService = require("../services/access.service");
const { hashId } = require("../utils/hash");
class OrderController {
  getOrder = async (req, res) => {
    const result = await OrderService.getAllUserOrders(req.user.id);
    const avatar = await AccessService.getAvatar(req.user.id);
    console.log("result = ", result);
    return res.render("order.ejs", {
      page: "order",
      avatar,
      isAuthenticated: req.isAuthenticated(),
      orders: result,
      hashId,
    });
  };
  checkout = async (req, res) => {
    const price = parseFloat(req.body.price);

    const products = await CartService.getUserCart(req.user.id);

    const avatar = await AccessService.getAvatar(req.user.id);
    return res.render("checkout.ejs", {
      page: "checkout",
      avatar,
      isAuthenticated: req.isAuthenticated(),
      price,
      products,
    });
  };
  createOrder = async (req, res) => {
    const { price, fullName, email, phoneNumber, address } = req.body;
    const products = await CartService.getUserCart(req.user.id);
    const userId = req.user.id;
    const result = await OrderService.createUserOrder(
      userId,
      fullName,
      address,
      phoneNumber,
      email,
      price,
      products
    );
    await CartService.clearUserCart(req.user.id);
    res.redirect("/home");
  };
  getDetail = async (req, res) => {
    const order = await OrderService.getOrderById(req.params.id);
    const avatar = await AccessService.getAvatar(req.user.id);
    console.log(order);
    return res.render("order-detail.ejs", {
      orderId: req.params.id,
      cart: order.order_products,
      totalPrice: order.totalPrice,
      page: "detail",
      avatar,
      isAuthenticated: req.isAuthenticated(),
    });
  };
}
module.exports = new OrderController();
