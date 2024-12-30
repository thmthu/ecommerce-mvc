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
passport.use(customerStrategy);
passport.use(googleStrategy);

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
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

module.exports = router;
