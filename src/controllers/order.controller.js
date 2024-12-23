"use strict";
const OrderService = require("../services/order.service");
const CartService = require("../services/cart.service");
const AccessService = require("../services/access.service");
class OrderController {
    getOrder = async (req, res) => {
        const result = await OrderService.getAllUserOrders(req.session.userId);
        const avatar = await AccessService.getAvatar(req.session.userId);
        console.log('result = ', result);
        return res.render("order.ejs", {
        page: "order",
        avatar,
        isAuthenticated: req.isAuthenticated(),
        orders: result,
        });
    }
    createOrder = async (req, res) => {
        const { price, products } = req.body;
        const result = await OrderService.createUserOrder(req.session.userId, price, products);
        CartService.clearUserCart(req.session.userId);
        res.redirect("/home");
    }
}
module.exports = new OrderController();