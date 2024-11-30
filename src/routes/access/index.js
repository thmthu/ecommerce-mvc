"use strict";
const express = require("express");
const passport = require("passport");
const AccessController = require("../../controllers/access.controller");
const { validateSignUp, validateSignIn } = require("../../middleware/validate");
const { customerStrategy } = require("../../auth/authUtils");
const router = express.Router();

router.post("/register", validateSignUp, AccessController.signUp);
passport.use(customerStrategy);

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, { id: user.id, username: user.username });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});
router.post(
  "/login/password",
  passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/login",
    failureFlash: true, // Enable flash messages for better debugging
  }),
  (err, req, res, next) => {
    if (err) {
      console.error("Authentication error:", err);
      return res.status(500).send("An error occurred during login.");
    }
    next();
  }
);

router.post("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) return next(err);

    req.session.destroy((err) => {
      if (err) return next(err);
      res.redirect("/login");
    });
  });
});

module.exports = router;
