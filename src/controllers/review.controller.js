"use strict";
const ReviewService = require("../services/review.service");
class ReviewController {
  getReviews = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    try {
      const result = await ReviewService.getReviews(req.params.id, skip, limit);
      if (!result) {
        return res.status(404).json({ message: "Not Found" });
      }
      console.log(result);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(error.status).json({ message: error.message });
    }
  };
  createReview = async (req, res) => {
    const { comment, star } = req.body;
    console.log("createReview", comment, star);
    if (!req.user || req.user === undefined) {
      return res.status(401).json({ message: "Please login to add review" });
    }
    const userId = req.user ? req.user.id : null;
    try {
      const result = await ReviewService.createUserReview(
        req.params.id,
        comment,
        star,
        userId
      );
      return res.status(200).json(result);
    } catch (error) {
      console.log("controkker", error.message);
      return res.status(error.status).json({ message: error.message });
    }
  };
}
module.exports = new ReviewController();
