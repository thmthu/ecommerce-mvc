"use strict";

const AccessService = require("../services/access.service");
const { OK, CREATED, SuccessResponse } = require("../core/success.response");
class AccessController {
  logout = async (req, res, next) => {
    console.log("logout controller")
    console.log(req.keyStore)
    new SuccessResponse({
      message: 'logout success',
      metadata: await AccessService.logout({ keyStore: req.keyStore }), // Truyền đối tượng keyStore đúng cách
    }).send(res);
  };
  signIn = async (req, res, next) => {
    new SuccessResponse({
      metadata: await AccessService.signIn(req.body),
    }).send(res);
  };
  signUp = async (req, res, next) => {
    new CREATED({
      message: "register OK!",
      metadata: await AccessService.signUp(req.body),
    }).send(res);
  };

}
module.exports = new AccessController();
