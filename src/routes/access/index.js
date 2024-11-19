"use strict";
const AccessController = require("../../controllers/access.controller");
const express = require("express");
const { asyncHandler } = require("../../auth/checkAuth");
const router = express.Router();
const {authentication} =require ("../../auth/authUtils")
router.post("/signup", asyncHandler(AccessController.signUp));
router.post("/signin", asyncHandler(AccessController.signIn));
// router.use(authentication)
router.post("/logout", asyncHandler(AccessController.logout));

module.exports = router;
