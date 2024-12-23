"use strict";
const ReviewController = require("../../controllers/review.controller");
const express = require("express");
const router = express.Router();

router.post("/reviews-create/:id", ReviewController.createReview);

module.exports = router;
