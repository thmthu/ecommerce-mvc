"use strict";

const AccessService = require("../services/access.service");
const bcrypt = require("bcrypt");
const Customer = require("../models/customer.model");
const { OK, CREATED, SuccessResponse } = require("../core/success.response");
class AccessController {
  signUp = async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      const result = await AccessService.signUp({
        name: username,
        email,
        password,
      });
      if (result.success) {
        return res.status(201).redirect("/login");
      } else {
        return res.status(400).render("register", { error: result.message });
      }
    } catch (error) {
      return res.status(500).render("register", { error: error });
    }
  };
}
module.exports = new AccessController();
