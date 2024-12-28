"use strict";
const bcrypt = require("bcrypt");
const { getInforData } = require("../utils/index");
const customerModel = require("../models/customer.model");
const {
  ConflictRequestError,
  NotFoundError,
  FORBIDDEN,
} = require("../core/error.response");
const {
  sendVerificationEmail,
  sendWelcomeEmail,
} = require("../mailtrap/email");
class AccessService {
  static signUp = async ({ name, email, password }) => {
    console.log("signUp", name, email, password);
    const emailAvailable = await customerModel.findOne({ email }).lean();
    if (emailAvailable) {
      console.log("Email error");
      throw new ConflictRequestError("Email is not available", 500);
    }
    const userNameAvailable = await customerModel.findOne({ name }).lean();
    if (userNameAvailable) {
      console.log("name error");

      throw new ConflictRequestError("User name is not available", 500);
    }
    console.log("userNameAvailable", userNameAvailable);
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const passwordHash = await bcrypt.hash(password, 10);
    const newCustomer = await customerModel.create({
      name,
      email,
      password: passwordHash,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });
    if (!newCustomer) {
      throw new Error("Failed to create new shop");
    }
    await sendVerificationEmail(email, verificationToken);
    req.logIn(newCustomer, (err) => {
      if (err) {
        return next(err);
      }
      req.session.userId = newCustomer._id; // Store user ID in session
      return res.status(201).json({
        success: true,
        message: "Verification email sent. Please check your inbox.",
        redirect: "/home", // Indicate where to redirect after signup
      });
    });
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
  static verifyEmail = async (email, verificationToken) => {
    const user = await customerModel.findOne({ email });
    console.log("=======before check user");
    if (!user) {
      throw new NotFoundError(`User ${email} not found`);
    }
    console.log("=======before check");
    if (user.verificationToken === verificationToken) {
      user.isVerified = true;
      user.verificationToken = null;
      user.verificationTokenExpiresAt = null;
      await user.save();
      console.log("before send email");
      await sendWelcomeEmail(email, user.name);
      return {
        success: true,
      };
    } else {
      console.log("error verification token");
      throw new FORBIDDEN("Verification token is incorrect");
    }
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
  };
}
module.exports = AccessService;
