"use strict";
const {
  BadRequestError,
  NotFoundError,
  AuthFailureError,
} = require("../core/error.response");
const { asyncHandler } = require("../helpers/asyncHandler");
const JWT = require("jsonwebtoken");
const { findById } = require("../services/key.service");
const HEADER = {
  // API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = JWT.sign(payload, publicKey, {
      expiresIn: "2 days",
    });
    const refreshToken = JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
    });
    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.log("err verify: ", err);
      } else {
        console.log("data verify: ", decode);
      }
    });

    return { accessToken, refreshToken };
  } catch (e) {
    console.error("Error in createTokenPair: ", e);
    throw new BadRequestError("Token generation failed", 500); // Or throw the original error `throw e;`
  }
};

const authentication = asyncHandler(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError("Invalid request");

  const keyStore = await findById(userId);
  if (!keyStore) throw new NotFoundError("Not found keyStore");

  const accessToken = req.header(HEADER.AUTHORIZATION);
  if (!accessToken) throw new AuthFailureError("Invalid Request");
  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.userId)
      throw new AuthFailureError("Invalid userId");
    req.keyStore = keyStore;
    return next();
  } catch (e) {
    throw e;
  }
});
module.exports = { createTokenPair, authentication };
