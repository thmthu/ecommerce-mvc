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
    cb(null, { id: user.id });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

router.post("/login/password", (req, res, next) => {
  req.session.regenerate((err) => {
    if (err) {
      console.log("Error regenerating session:", err);
      return next(err);
    }

    passport.authenticate("local", {
      successRedirect: "/home",
      failureRedirect: "/login",
      failureFlash: true,
    })(req, res, next);
  });
});

router.get("/login", (req, res) => {
  res.render("login.ejs", { error: req.flash("error") });
});

router.post("/logout", function (req, res, next) {
  console.log("Session ID (req.sessionID):", req.sessionID);
  console.log("Cookie (connect.sid):", req.cookies["connect.sid"]); // ID từ cookie

  req.logout(function (err) {
    if (err) return next(err);

    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return next(err);
      }

      for (let cookie in req.cookies) {
        if (req.cookies.hasOwnProperty(cookie)) {
          res.clearCookie(cookie, { path: "/" });
        }
      }
      console.log("Session destroyed and cookie cleared.");
      console.log("Session ID after destroy:", req.sessionID);
      console.log("Cookie after clearing:", req.cookies["connect.sid"]);
      res.redirect("/login");
    });
  });
});

module.exports = router;
