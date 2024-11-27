"use strict";

const AccessService = require("../services/access.service");
const bcrypt = require("bcrypt");
const Customer = require("../models/customer.model");
const { OK, CREATED, SuccessResponse } = require("../core/success.response");
class AccessController {
  logout = (req, res, next) => {
    res.clearCookie('sessionId'); // Clear the session cookie
    return res.redirect('/home'); // Redirect to the login page
  };
  signIn = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      console.log("controler");
      const result = await AccessService.signIn({
        email,
        password,
      });
      console.log("==========", result);
      if (result.code === 200) {
        res.cookie("sessionId", result.sessionId, {
          httpOnly: true, // Bảo vệ cookie khỏi JavaScript trên client
          secure: true, // Chỉ truyền qua HTTPS
          maxAge: 24 * 60 * 60 * 1000, // Cookie hết hạn sau 1 ngày
        });
        return res.status(200).redirect("/home");
      } else {
        return res
          .status(result.code)
          .render("login", { error: result.message });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .render("login", { error: error });
    }
  };
  signUp = async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      const result = await AccessService.signUp({
        name: username,
        email,
        password,
      });
      if (result.code === 201) {
        res.cookie("sessionId", result.sessionId, {
          httpOnly: true, // Bảo vệ cookie khỏi JavaScript trên client
          secure: true, // Chỉ truyền qua HTTPS
          maxAge: 24 * 60 * 60 * 1000, // Cookie hết hạn sau 1 ngày
        });
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
