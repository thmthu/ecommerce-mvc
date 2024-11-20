"use strict";

const AccessService = require("../services/access.service");
const bcrypt = require("bcrypt");
const Customer = require("../models/customer.model");
const { OK, CREATED, SuccessResponse } = require("../core/success.response");
class AccessController {
  logout = async (req, res, next) => {
    console.log("logout controller");
    console.log(req.keyStore);
    new SuccessResponse({
      message: "logout success",
      metadata: await AccessService.logout({ keyStore: req.keyStore }), // Truyền đối tượng keyStore đúng cách
    }).send(res);
  };
  signIn = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      // Validate the input
      if (!email || !password) {
        return res
          .status(400)
          .render("login", { error: "All fields are required" });
      }

      // Find the user by email
      const user = await Customer.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .render("login", { error: "Invalid email or password" });
      }

      // Compare the password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .render("login", { error: "Invalid email or password" });
      }

      res.redirect("./home");
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .render("login", { error: "Server error. Please try again later." });
    }
  };
  signUp = async (req, res, next) => {
    try {
      const { username, email, password } = req.body;

      // Validate the input
      if (!username || !email || !password) {
        return res
          .status(400)
          .render("register", { error: "All fields are required" });
      }

      if (password.length < 8) {
        return res
          .status(400)
          .render("register", {
            error: "Password must be at least 8 characters long",
          });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res
          .status(400)
          .render("register", { error: "Invalid email format" });
      }

      // Call the signUp service
      const result = await AccessService.signUp({
        name: username,
        email,
        password,
      });

      if (result.code === 201) {
        return res.status(201).redirect("/login");
      } else {
        return res
          .status(result.code)
          .render("register", { error: result.message });
      }
    } catch (error) {
      console.error("===", error);
      return res.status(500).render("register", { error: error });
    }
  };
}
module.exports = new AccessController();
