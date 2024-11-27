"use strict";
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { getInforData } = require("../utils/index");
const customerModel = require("../models/customer.model");
const KeyTokenService = require("./key.service");
const SessionService = require("./session.service");
const { findByEmail } = require("../services/customer.service");
const {
  ConflictRequestError,
  BadRequestError,
  AuthFailureError,
} = require("../core/error.response");
const { createTokenPair } = require("../auth/authUtils");
const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};
class AccessService {
  static logout = async ({ keyStore }) => {
    console.log("logout ", keyStore);
    const delKey = await KeyTokenService.removeByUserid(keyStore.userId);
    console.log(delKey);
    return delKey;
  };
  static signIn = async ({ email, password }) => {
    const foundCustomer = await findByEmail({ email });
    if (!foundCustomer) throw new BadRequestError("Customer is not registered");
    const match = await bcrypt.compare(password, foundCustomer.password);
    if (!match) throw new BadRequestError("Wrong password");
    const sessionId = await SessionService.createSessionId(foundCustomer._id);
    if (!sessionId) throw AuthFailureError("Error when create seesion id");
    return {
      code: 200,
      metadata: {
        customer: getInforData({
          fields: ["id", "name", "email"],
          object: foundCustomer,
        }),
      },
      sessionId,
    };
  };
  static signUp = async ({ name, email, password }) => {
    const hoderCustomer = await customerModel.findOne({ email }).lean();

    if (hoderCustomer) {
      throw new ConflictRequestError("customer already register", 500);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newCustomer = await customerModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });
    if (!newCustomer) {
      throw new Error("Failed to create new shop");
    }
    const sessionId = await SessionService.createSessionId(newCustomer._id);
    console.log("access service", sessionId);
    if (!sessionId) throw AuthFailureError("Error when create seesion id");

    console;
    return {
      code: 201,
      metadata: {
        shop: getInforData({
          fields: ["id", "name", "email"],
          object: newCustomer,
        }),
      },
      sessionId,
    };
  };
}
module.exports = AccessService;
