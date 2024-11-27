"use strict";
const AccessController = require("../../controllers/access.controller");
const express = require("express");
const { asyncHandler } = require("../../auth/checkAuth");
const { validateSignUp, validateSignIn } = require("../../middleware/validate");
const router = express.Router();
const { authentication } = require("../../auth/authUtils");

router.post("/register", AccessController.signUp);
router.post("/login", asyncHandler(AccessController.signIn));

// router.use(authentication)
router.post("/logout", asyncHandler(AccessController.logout));

module.exports = router;
