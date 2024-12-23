"use strict";
const bcrypt = require("bcrypt");
const { getInforData } = require("../utils/index");
const customerModel = require("../models/customer.model");
const {
  ConflictRequestError,
  NotFoundRequestError
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
      success: true,
      metadata: {
        shop: getInforData({
          fields: ["id", "name", "email"],
          object: newCustomer,
        }),
      },
    };
  };

  static getUserById = async (userId) => {
    const user = await customerModel.findById(userId);

    if (!user) {
      return null;
    }

    return user;
  };

  static getAvatar = async (userId) => {
    const user = await customerModel.findById(userId);

    if (!user) {
      return null;
    }

    return user.avatar;
  }
}
module.exports = AccessService;
