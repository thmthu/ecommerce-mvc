"use strict";

const AccessService = require("../services/access.service");
const CartService = require("../services/cart.service");
const bcrypt = require("bcrypt");
const path = require("path");
const passport = require("passport");
class AccessController {
  getRegister = async (req, res) => {
    const userId = req.user == undefined ? null : req.user.id;
    const avatar = await AccessService.getAvatar(userId);
    const numProducts = await CartService.getCartProductsSize(userId);
    return res.render("register.ejs", { avatar, numProducts });
  };
  getVerificationpage = async (req, res) => {
    const avatar = await AccessService.getAvatar(req.user.id);
    const numProducts = await CartService.getCartProductsSize(req.user.id);
    res.render("verifycation-signup", { avatar, numProducts, isAuthenticated: req.isAuthenticated() });
  };
  logOut = function (req, res, next) {
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
        res.redirect("/login");
      });
    });
  };
  getLogin = async (req, res) => {
    const error = req.session.error ? req.session.error : null;
    delete req.session.error;
    const avatar = await AccessService.getAvatar(null);
    const numProducts = await CartService.getCartProductsSize(null);
    res.render("login.ejs", { avatar, numProducts, error });
  };
  login = async (req, res, next) => {
    req.session.regenerate((err) => {
      if (err) {
        console.log("Error regenerating session:", err);
        return next(err);
      }

      passport.authenticate("local", async (err, user, info) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          return res.status(401).json({
            success: false,
            message: info.message || "Authentication failed.",
          });
        }
        req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }

          return res.status(201).json({
            success: true,
            message: "SignIn successfully.",
            redirect: "/home", // Chuyển hướng đến /home sau khi login xong
          });
        });
      })(req, res, next);
    });
  };
  signUp = async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      const result = await AccessService.signUp({
        name: username,
        email,
        password,
      });
      if (result.success) {
        console.log("ok signUp");
        console.log("sign up ", req);
        req.logIn(result.newCustomer, (err) => {
          if (err) {
            console.log("Verification email sent 2 ");
            return next(err);
          }
          console.log("~Verification email sent 3 ", result.newCustomer);
          console.log("~User .id logged in", req.user.id);
          console.log("~User ._id logged in", req.user._id);
          console.log(
            "~User ._id to string logged in",
            req.user._id.toString()
          );

          return res.status(201).json({
            success: true,
            message: "Verification email sent. Please check your inbox.",
            redirect: "/email-verify", // Indicate where to redirect after signup
          });
        });
      } else {
        const avatar = await AccessService.getAvatar(req.user.id);
        console.log("!ok signUp");
        const numProducts = await CartService.getCartProductsSize(req.user.id);

        return res
          .status(400)
          .render("register", { avatar, numProducts, error: result.message });
      }
    } catch (error) {
      console.log("!ok catch signUp", error);
      const avatar = await AccessService.getAvatar(null);
      return res.status(401).json({ error: error.message });
    }
  };
  resendVerifycation = async (req, res) => {
    try {
      await AccessService.resendVerifycation(req.user.id);
      return res
        .status(200)
        .json({ message: "Verification email sent successfully" });
    } catch (error) {
      console.log("verify controller:", error, error.status, error.message);
      return res.status(error.status).json({ error: error.message });
    }
  };
  verifyEmail = async (req, res, next) => {
    const { verificationToken } = req.body;
    console.log("verify", verificationToken, req.user.id);
    try {
      await AccessService.verifyEmail(req.user.id, verificationToken);
      return res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
      console.log("verify controller:", error, error.status, error.message);
      return res.status(error.status).json({ error: error.message });
    }
  };
  getProfile = async (req, res) => {
    try {
      const user = await AccessService.getUserById(req.user.id);
      const avatar = await AccessService.getAvatar(req.user.id);
      const numProducts = await CartService.getCartProductsSize(req.user.id);
      return res.render("profile.ejs", {
        page: "profile",
        avatar,
        numProducts,
        user: user,
        isAuthenticated: req.isAuthenticated(),
      });
    } catch (error) {
      res.redirect("/home");
    }
  };

  updateProfile = async (req, res) => {
    try {
      const userId = req.user.id; // Assuming user is authenticated and user ID is available in req.user
      const { name, address, phone } = req.body;
      let avatar = null;

      // Check if a file was uploaded
      if (req.files && req.files.avatar) {
        const avatarFile = req.files.avatar;
        avatar = `avatar-${Date.now()}${path.extname(avatarFile.name)}`;
        const uploadPath = path.join(__dirname, "../views/img", avatar);

        // Move the file to the uploads directory
        avatarFile.mv(uploadPath, (err) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to upload avatar" });
          }
        });
      }

      // Find the user by ID
      const user = await AccessService.getUserById(userId);

      // Update user information
      if (name) user.name = name;
      if (address) user.address = address;
      if (phone) user.phone = phone;
      if (avatar) user.avatar = avatar;

      // Save the updated user
      await user.save();

      res.redirect("/profile"); // Redirect to profile page after update
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update profile" });
    }
  };

  getChangePassword = async (req, res) => {
    const avatar = await AccessService.getAvatar(req.user.id);
    const numProducts = await CartService.getCartProductsSize(req.user.id);
    return res.render("change-password.ejs", {
      page: "change-password",
      avatar,
      numProducts,
      error: null,
      isAuthenticated: req.isAuthenticated(),
    });
  };

  changePassword = async (req, res) => {
    try {
      const userId = req.user.id; // Assuming user is authenticated and user ID is available in req.user
      const { oldPassword, password, confirmPassword } = req.body;

      // Find the user by ID
      const user = await AccessService.getUserById(userId);
      const avatar = await AccessService.getAvatar(userId);
      const numProducts = await CartService.getCartProductsSize(userId);

      // Verify old password
      if (!(await bcrypt.compare(oldPassword, user.password))) {
        return res.status(400).render("change-password.ejs", {
          page: "change-password",
          avatar,
          numProducts,
          error: "Old password is incorrect",
          isAuthenticated: req.isAuthenticated(),
        });
      }

      // Validate new passwords
      if (password !== confirmPassword) {
        return res.status(400).render("change-password.ejs", {
          page: "change-password",
          avatar,
          numProducts,
          error: "New passwords do not match",
          isAuthenticated: req.isAuthenticated(),
        });
      }

      // Update password
      user.password = await bcrypt.hash(password, 10);

      // Save the updated user
      await user.save();

      res.redirect("/profile"); // Redirect to profile page after password change
    } catch (error) {
      console.error(error);
      res.status(500).render("change-password.ejs", {
        page: "change-password",
        avatar,
        numProducts,
        error: "Failed to change password",
        isAuthenticated: req.isAuthenticated(),
      });
    }
  };
}
module.exports = new AccessController();
