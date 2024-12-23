"use strict";
const express = require("express");
const passport = require("passport");
const AccessController = require("../../controllers/access.controller");
const AccessService = require("../../services/access.service");
const { validateSignUp, validateSignIn } = require("../../middleware/validate");
const { customerStrategy } = require("../../auth/authUtils");
const { ensureAuthenticated } = require("../../middleware/authMiddleware");
const router = express.Router();
const upload = require('../../middleware/upload'); 
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

    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        req.session.error = info.message;
        return res.redirect("/login");
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        req.session.userId = user._id; // Store user ID in session
        return res.redirect('/home');
      });
    })(req, res, next);
  });
});

router.get("/login", async (req, res) => {
  const error = req.session.error ? req.session.error : null;
  delete req.session.error;
  const avatar = await AccessService.getAvatar(req.session.userId);
  res.render("login.ejs", { avatar, error });
});

router.get("/register", AccessController.getRegister);

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

router.get("/profile", ensureAuthenticated, AccessController.getProfile);

// Route for updating profile
router.post('/update-profile', upload.single('avatar'), AccessController.updateProfile);

// Route for changing password
router.get('/change-password', AccessController.getChangePassword);
router.post('/change-password', AccessController.changePassword);

module.exports = router;
