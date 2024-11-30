"use strict";
const bcrypt = require("bcrypt");
const { getInforData } = require("../utils/index");
const customerModel = require("../models/customer.model");
const {
  ConflictRequestError,
  BadRequestError,
  AuthFailureError,
} = require("../core/error.response");
const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};
class AccessService {
  
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

    console;
    return {
      code: 201,
      metadata: {
        shop: getInforData({
          fields: ["id", "name", "email"],
          object: newCustomer,
        }),
      },
    };
  };
}
module.exports = AccessService;
