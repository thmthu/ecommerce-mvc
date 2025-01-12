"use strict";
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { ObjectId } = require("mongodb");

const { getInforData } = require("../utils/index");
const { findById } = require("./customer.service");
const customerModel = require("../models/customer.model");
require("dotenv").config();

const {
  ConflictRequestError,
  NotFoundError,
  FORBIDDEN,
} = require("../core/error.response");
const {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
} = require("../mailtrap/email");
class AccessService {
  static signUp = async ({ name, email, password }) => {
    const emailAvailable = await customerModel.findOne({ email }).lean();
    if (emailAvailable) {
      throw new ConflictRequestError("Email is not available", 500);
    }
    const userNameAvailable = await customerModel.findOne({ name }).lean();
    if (userNameAvailable) {
      throw new ConflictRequestError("User name is not available", 500);
    }
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const passwordHash = await bcrypt.hash(password, 10);
    const newCustomer = await customerModel.create({
      name,
      email,
      password: passwordHash,
      verificationToken,
      role: "Customer",
      verificationTokenExpiresAt: Date.now() + 3 * 60 * 1000, // 24 hours
    });
    if (!newCustomer) {
      throw new Error("Failed to create new shop");
    }
    await sendVerificationEmail(email, verificationToken);
    console.log("Verification email sent");
    return {
      success: true,
      newCustomer: newCustomer,
      metadata: {
        shop: getInforData({
          fields: ["id", "name", "email"],
          object: newCustomer,
        }),
      },
    };
  };
  static resendVerifycation = async (userId) => {
    const myUser = await customerModel.findOne({ _id: new ObjectId(userId) });
    const email = myUser.email;
    if (!email) {
      throw new NotFoundError(`User not found`);
    }
    if (myUser.isVerified === true) {
      throw new FORBIDDEN("Email has already been verified");
    }
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const user = await customerModel.findOne({ email });
    if (!user) {
      throw new NotFoundError(`User ${email} not found`);
    }
    user.verificationToken = verificationToken;
    user.isVerified = false;
    user.verificationTokenExpiresAt = Date.now() + 3 * 60 * 1000;
    await user.save();
    await sendVerificationEmail(email, verificationToken);

    return {
      success: true,
    };
  };
  static verifyEmail = async (userId, verificationToken) => {
    const myUser = await findById({ userId });
    const email = myUser.email;
    console.log(email);
    if (!email) {
      throw new NotFoundError(`User ${email} not found`);
    }
    console.log("service verified email", email);
    const user = await customerModel.findOne({
      email,
    });
    if (!user) {
      throw new NotFoundError(`User ${email} not found`);
    }
    if (user.verificationTokenExpiresAt < Date.now()) {
      throw new FORBIDDEN("Expired verification code");
    }
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
      throw new FORBIDDEN("Invalid verification code");
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
  static forgotPassword = async (email) => {
    const user = await customerModel.findOne({ email });

    if (!user) {
      throw new NotFoundError(`User ${email} not found`);
    }
    if (user.isVerified === false) {
      throw new FORBIDDEN("Email is not verified");
    }
    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 3 * 60 * 1000; // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();

    // send email
    console.log("before reset");
    await sendPasswordResetEmail(
      user.email,
      `${process.env.DOMAIN}/reset-password/${resetToken}`
    );
    console.log("after reset");

    return {
      status: 200,
      success: true,
      message: "Password reset link sent to your email",
    };
  };

  static resetPassword = async ({ token, password }) => {
    console.log("reset Token", token);
    const user = await customerModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      throw new NotFoundError(`Token not found or expired`);
    }

    // update password
    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    await sendResetSuccessEmail(user.email);

    return {
      status: 200,
      success: true,
      message: "Reset password successfully",
    };
  };
  static checkEmailVeryfied = async (email) => {
    const user = await customerModel.findOne({ email });
    if (!user) {
      throw new NotFoundError(`User ${email} not found`);
    }
    if (user.isVerified === false) {
      throw new FORBIDDEN("Email is not verified");
    }
    return {
      status: 200,
      success: true,
      message: "Email is verified",
    };
  };
}
module.exports = AccessService;
