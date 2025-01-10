"use strict";
const express = require("express");
const passport = require("passport");
const AccessController = require("../../controllers/access.controller");
const { validateSignUp, validateSignIn } = require("../../middleware/validate");
const { customerStrategy } = require("../../auth/strategy/customerStrategy");
const { googleStrategy } = require("../../auth/strategy/googleStrategy");

const { ensureAuthenticated } = require("../../middleware/authMiddleware");
const customerModel = require("../../models/customer.model");
const { ObjectId } = require("mongodb");
const router = express.Router();

require("dotenv").config();
const { VNPay, ignoreLogger } = require("vnpay");

const vnpay = new VNPay({
  secureSecret: process.env.VNPAY_SECURE_SECRET,
  tmnCode: process.env.VNPAY_TMN_CODE,
  vnpayHost: "https://sandbox.vnpayment.vn",
  testMode: true, // tùy chọn, ghi đè vnpayHost thành sandbox nếu là true
  hashAlgorithm: "SHA512", // tùy chọn

  /**
   * Sử dụng enableLog để bật/tắt logger
   * Nếu enableLog là false, loggerFn sẽ không được sử dụng trong bất kỳ phương thức nào
   */
  enableLog: true, // optional

  /**
   * Hàm `loggerFn` sẽ được gọi để ghi log
   * Mặc định, loggerFn sẽ ghi log ra console
   * Bạn có thể ghi đè loggerFn để ghi log ra nơi khác
   *
   * `ignoreLogger` là một hàm không làm gì cả
   */
  loggerFn: ignoreLogger, // optional
});
router.post("/vnpay", async (req, res) => {
  // const bankList = await vnpay.getBankList();
  // // const productTypeList = Object.entries(ProductCode).map(([key, value]) => ({ key, value }));
  // const contentPaymentDefault = `Thanh toan don hang ${new Date().toISOString()}`;

  // const { amountInput, contentPayment, productTypeSelect, bankSelect, langSelect } = req.body;

  // // Validate amount
  // if (!amountInput || amountInput <= 0) {
  //     return res.render('home', {
  //         scripts: `<script>alert('Số tiền chưa hợp lệ');window.location.href = '/';</script>`,
  //         bankList,
  //         // productTypeList,
  //         contentPaymentDefault,
  //     });
  // }

  // // Validate content payment
  // if (!contentPayment) {
  //     return res.render('home', {
  //         scripts: `<script>alert('Vui lòng điền nội dung thanh toán');window.location.href = '/';</script>`,
  //         bankList,
  //         // productTypeList,
  //         contentPaymentDefault,
  //     });
  // }

  /**
   * Prepare data for build payment url
   * Note: In the VNPay documentation, it's stated that you must multiply the amount by 100.
   * However, when using the `vnpay` package, this is done automatically.
   */
  console.log(
    "1 ",
    req.headers.forwarded,
    "2 ",
    req.ip,
    "3 ",
    req.socket.remoteAddress,
    "4 ",
    req.connection.remoteAddress
  );
  const data = {
    vnp_Amount: 100000,
    vnp_IpAddr:
      req.headers.forwarded ||
      req.ip ||
      req.socket.remoteAddress ||
      req.connection.remoteAddress ||
      "127.0.0.1",
    vnp_OrderInfo: " mbnh jjg fg uy bn ",
    vnp_ReturnUrl: "https://irrelevant-oliy-random121-e6a2fa8c.koyeb.app/home",
    vnp_TxnRef: new Date().getTime().toString(),
    vnp_BankCode: "",
    vnp_Locale: "vi",
    vnp_OrderType: "ao",
  };
  console.log(process.env.VNPAY_SECURE_SECRET, process.env.VNPAY_TMN_CODE);
  console.log("data at vnpay", data);
  const url = vnpay.buildPaymentUrl(data);
  console.log("url", url);
  return res.redirect(url);
});

passport.use(customerStrategy);
passport.use(googleStrategy);

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google"),
  (req, res) => {
    res.redirect("/home");
  }
);
passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, { id: user.id });
  });
});

passport.deserializeUser(async (user, done) => {
  try {
    const myUser = await customerModel.findById(new ObjectId(user.id));
    done(null, myUser);
  } catch (err) {
    done(err);
  }
});
router.get("/register", AccessController.getRegister);
router.post("/register", validateSignUp, AccessController.signUp);
router.post("/login/password", AccessController.login);
router.get("/login", AccessController.getLogin);
router.post("/logout", AccessController.logOut);

router.get("/profile", ensureAuthenticated, AccessController.getProfile);
router.post("/update-profile", AccessController.updateProfile);

// Route for changing password
router.get("/change-password", AccessController.getChangePassword);
router.post("/change-password", AccessController.changePassword);

router.get("/email-verify", AccessController.getVerificationpage);
router.post("/email-verify", AccessController.verifyEmail);
router.post("/email-resendVerify", AccessController.resendVerifycation);

router.get("/forgot-password", AccessController.getForgotPasswordPage);
router.post("/forgot-password", AccessController.fogortPassword);
router.get("/reset-password/:token", AccessController.getResetPasswordPage);
router.post("/reset-password/:token", AccessController.resetPassword);

module.exports = router;
