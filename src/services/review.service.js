"use strict";
const review = require("../models/review.model.js");
const { model, Schema, Types } = require("mongoose"); // Ensure Types is imported
const { BadRequestError, FORBIDDEN } = require("../core/error.response");

class ReviewService {
  static async createUserReview(
    email,
    userName,
    productId,
    comment,
    star,
    sessionId
  ) {
    // if (!sessionId){
    //     throw new Error("User need login to review");
    // }
    console.log("serviec", email, userName, productId, comment, star);
    const userReviewed = await review.findOne({ email: email });
    if (userReviewed) {
      throw new FORBIDDEN("User has already reviewed this product");
    }
    const newReview = await review.create({
      email,
      product_id: productId,
      comment,
      star,
      user_name: userName,
    });
    if (!newReview) {
      throw new BadRequestError("Failed to create review");
    }
    return {
      success: true,
      metadata: {
        review: newReview,
      },
    };
  }
  static async reviewsByProductId(productId) {
    const reviews = await review.find({ product_id: productId });
    if (!reviews) throw new Forbiden("No reviews found");
    return {
      success: true,
      metadata: {
        reviews: reviews,
      },
    };
  }
}
module.exports = ReviewService;
