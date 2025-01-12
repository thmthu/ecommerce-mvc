require("dotenv").config();
const { VNPay, ignoreLogger } = require("vnpay");

const vnpay = new VNPay({
  secureSecret: process.env.VNPAY_SECURE_SECRET,
  tmnCode: process.env.VNPAY_TMN_CODE,
});
module.exports = vnpay;
