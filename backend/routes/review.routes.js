import express from "express";
import {
  createReview,
  deleteReview,
  getReview,
  getReviewById,
  updateReview,
} from "../controllers/review.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getReview);
router.get("/:id", getReviewById);
router.post("/", protect, createReview);
router.delete("/:id", protect, deleteReview);
router.put("/:id", protect, updateReview);

export default router;
