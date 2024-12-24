"use strict";
const ReviewService = require("../services/review.service");
class ReviewController {
  getReview = async (req, res) => {
    try {
      const result = await ReviewService.reviewsByProductId(req.params.id);

      if (!result) {
        return res.status(404).json({ message: "Not Found" });
      }
      return res.json(result);
    } catch (error) {
      return res.status(500);
    }
  };
  createReview = async (req, res) => {
    const { email, userName, productId, comment, star } = req.body;
    console.log("createReview", email, userName, comment, star);
    const sessionId = req.session.userId;
    try {
      const result = await ReviewService.createUserReview(
        email,
        userName,
        req.params.id,
        comment,
        star,
        sessionId
      );
      return res.json(result);
    } catch (error) {
      console.log("controkker", error.message);
      return res.status(error.status).json({ message: error.message });
    }
  };
}
module.exports = new ReviewController();
