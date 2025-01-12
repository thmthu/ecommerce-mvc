"use strict";
const OrderService = require("../services/order.service");
const CartService = require("../services/cart.service");
const AccessService = require("../services/access.service");
const ProductService = require("../services/product.service");
const customerModel = require("../models/customer.model");
const { ObjectId } = require("mongodb");
const vnpay = require("../configs/configVnpay");
const { hashId } = require("../utils/hash");
require("dotenv").config();

class OrderController {
  getOrder = async (req, res) => {
    const result = await OrderService.getAllUserOrders(req.user.id);
    const avatar = await AccessService.getAvatar(req.user.id);
    const numProducts = await CartService.getCartProductsSize(req.user.id);
    console.log("result = ", result);
    return res.render("order.ejs", {
      page: "order",
      avatar,
      numProducts,
      isAuthenticated: req.isAuthenticated(),
      orders: result,
      hashId,
    });
  };
  checkout = async (req, res) => {
    const price = parseFloat(req.body.price);
    const products = await CartService.getUserCart(req.user.id);
    const user = await AccessService.getUserById(req.user.id);
    const avatar = await AccessService.getAvatar(req.user.id);
    const numProducts = await CartService.getCartProductsSize(req.user.id);
    const address = user.address ? user.address : "";
    const phoneNumber = user.phone ? user.phone : "";
    const email = user.email;
    const fullName = user.name;
    console.log("user addEventListener: " + email, fullName);
    console.log("userPayment: " + user.payment);
    return res.render("checkout.ejs", {
      page: "checkout",
      avatar,
      numProducts,
      isAuthenticated: req.isAuthenticated(),
      price,
      products,
      address,
      phoneNumber,
      userPayment: user.payment,
      email,
      fullName,
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
    for (const product of products) {
      await ProductService.decreaseProductQuantity(
        product.product_id,
        product.quantity
      );
      await ProductService.increaseProductQuantitySold(
        product.product_id,
        product.quantity
      );
    }
    await CartService.clearUserCart(req.user.id);
    res.redirect("/checkout");
  };
  getDetail = async (req, res) => {
    const order = await OrderService.getOrderById(req.params.id);
    const avatar = await AccessService.getAvatar(req.user.id);
    const numProducts = await CartService.getCartProductsSize(req.user.id);
    console.log(order);
    return res.render("order-detail.ejs", {
      orderId: req.params.id,
      cart: order.order_products,
      totalPrice: order.totalPrice,
      page: "detail",
      avatar,
      numProducts,
      isAuthenticated: req.isAuthenticated(),
    });
  };
  directToVnpay = async (req, res) => {
    const { amountInput, contentPayment, langSelect } = req.body;
    const data = {
      vnp_Amount: amountInput.toString(),
      vnp_IpAddr:
        req.headers.forwarded ||
        req.ip ||
        req.socket.remoteAddress ||
        req.connection.remoteAddress ||
        "127.0.0.1",
      vnp_OrderInfo: "Transaction for ecommerce shop",
      vnp_ReturnUrl: `${process.env.DOMAIN}/order`,
      vnp_TxnRef: new Date().getTime().toString(),
      vnp_BankCode: "",
      vnp_Locale: "vi",
      vnp_OrderType: "other",
    };
    const url = vnpay.buildPaymentUrl(data);
    return res.json({
      success: true,
      message: "create url successfully",
      url: url,
    });
  };

  successVnpayRoute = async (req, res) => {
    let resultFromVerify;
    try {
      let data = req.query;
      const verify = vnpay.verifyReturnUrl(data);
      resultFromVerify = verify;
      console.log("\n quey", req.query, "\n result", verify);
      if (!verify.isVerified) {
        return res.send("Xác thực tính toàn vẹn dữ liệu không thành công");
      }
      if (!verify.isSuccess) {
        return res.send("Đơn hàng thanh toán không thành công");
      }
      const price = resultFromVerify.vnp_Amount / 2000;
      const user = await AccessService.getUserById(req.user.id);
      const email = user.email;
      const userName = user.name;
      const phoneNumber = user.phone;
      const address = user.address;
      const products = await CartService.getUserCart(req.user.id);
      const userId = req.user.id;
      const result = await OrderService.createUserOrder(
        userId,
        userName,
        address,
        phoneNumber,
        email,
        price,
        products
      );
      for (const product of products) {
        await ProductService.decreaseProductQuantity(
          product.product_id,
          product.quantity
        );
        await ProductService.increaseProductQuantitySold(
          product.product_id,
          product.quantity
        );
      }

      const updatedUser = await customerModel.findByIdAndUpdate(
        new ObjectId(req.user.id),
        { payment: false }
      );
      console.log("updatedUser = ", updatedUser.payment);
      await CartService.clearUserCart(req.user.id);
      res.redirect("/home");
    } catch (error) {
      console.error("Error processing return URL:", error);

      return res.send("Dữ liệu không hợp lệ");
    }
  };
}
module.exports = new OrderController();
