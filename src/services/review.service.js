"use strict";
const review = require("../models/review.model.js");
const { BadRequestError, FORBIDDEN } = require("../core/error.response");
const { ObjectId } = require("mongodb");
class ReviewService {
  static async createUserReview(
    email,
    userName,
    productId,
    comment,
    star,
    sessionId
  ) {
    if (!sessionId) {
      throw new FORBIDDEN("User need login to review");
    }
    console.log("serviec", email, userName, productId, comment, star);
    const userReviewed = await review.findOne({ email: email });
    console.log("userReviewed", userReviewed);
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
    const reviews = await review
      .find({ product_id: new ObjectId(productId) })
      .lean();
    console.log("okkkkkk", reviews);
    if (!reviews) throw new FORBIDDEN("No reviews found");
    return {
      success: true,
      metadata: {
        reviews: reviews,
      },
    };
  }
}
module.exports = ReviewService;
