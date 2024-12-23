"use strict";
const ReviewService = require("../services/review.service");
class ReviewController {
  getReview = async (req, res) => {
    try {
      const result = await ReviewService.getReview(req.params.product_id);

      if (!result) {
        return res.status(404).json({ message: "Not Found" });
      }
      return res.json(result).render("review.ejs", {
        page: "review",
        isAuthenticated: req.isAuthenticated(),
        orders: result,
      });
    } catch (error) {
      return res.status(500).render("review", { error: error });
    }
  };
  createReview = async (req, res) => {
    const { email, userName, productId, comment, star, sessionId } = req.body;
    console.log("createReview", email, userName, comment, star, sessionId);
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
      console.log(error);
      return res.status(error.status).json({ message: error.message });
    }
  };
}
module.exports = new ReviewController();
