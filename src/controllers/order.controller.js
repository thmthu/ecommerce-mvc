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
    checkout = async (req, res) => {
        const price = parseFloat(req.body.price);
        let products = req.body.products;

        products = JSON.parse(products); // Parse the JSON string to an array of objects

        console.log(products);
        const avatar = await AccessService.getAvatar(req.session.userId);
        return res.render("checkout.ejs", {
            page: "checkout",
            avatar,
            isAuthenticated: req.isAuthenticated(),
            price,
            products,
        });
    }
    createOrder = async (req, res) => {
        const {price, products, fullName, email, phoneNumber, address} = req.body;
        const userId = req.session.userId;
        const result = await OrderService.createUserOrder(userId, fullName, address, phoneNumber, email, price, products);  
        await CartService.clearUserCart(req.session.userId);
        res.redirect("/home");
    }
}
module.exports = new OrderController();