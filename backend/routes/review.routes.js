import express from "express";
import {
  createReview,
  deleteReview,
  getReview,
  getReviewById,
  updateReview,
} from "../controllers/review.controller.js";

const router = express.Router();

router.get("/", getReview);
router.get("/:id", getReviewById);
router.post("/", createReview);
router.delete("/:id", deleteReview);
router.put("/:id", updateReview);

export default router;
