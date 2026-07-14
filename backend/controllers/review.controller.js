import Review from "../models/Review.js";
import Book from "../models/Book.js";
import mongoose from "mongoose";

export const getReview = async (req, res) => {
  try {
    const reviews = await Review.find().populate("bookId", "title author");
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getReviewById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid review ID" });
  }

  try {
    const review = await Review.findById(id);
    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    res.status(200).json({ success: true, data: review });
  } catch (error) {
    console.error("Error fetching review:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const createReview = async (req, res) => {
  try {
    const { bookId, rating, text, userAvatar } = req.body;

    if (!bookId || rating == null || !text) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const numericRating = Number(rating);
    if (
      Number.isNaN(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Rating must be between 1 and 5" });
    }

    if (String(text).trim().length < 3) {
      return res
        .status(400)
        .json({ success: false, message: "Review text is too short" });
    }

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid book ID" });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });
    }

    // Identity comes from the authenticated token — never trust body userId
    const newReview = new Review({
      bookId,
      userId: req.user.id,
      userName: req.user.name || "Anonymous",
      userAvatar,
      rating: numericRating,
      text: String(text).trim().slice(0, 2000),
      date: new Date(),
    });

    await newReview.save();

    book.reviews.push(newReview._id);
    await book.save();

    res.status(201).json({ success: true, data: newReview });
  } catch (error) {
    console.error("Error creating review:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteReview = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid review ID" });
  }

  try {
    const review = await Review.findById(id);
    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    const isOwner = review.userId?.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    await Book.findByIdAndUpdate(review.bookId, { $pull: { reviews: id } });
    await Review.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Review removed" });
  } catch (error) {
    console.error("Error deleting review:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateReview = async (req, res) => {
  const { id } = req.params;
  const { rating, text } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid review ID" });
  }

  try {
    const review = await Review.findById(id);
    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    const isOwner = review.userId?.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    const updates = { date: new Date() };
    if (rating != null) {
      const numericRating = Number(rating);
      if (
        Number.isNaN(numericRating) ||
        numericRating < 1 ||
        numericRating > 5
      ) {
        return res
          .status(400)
          .json({ success: false, message: "Rating must be between 1 and 5" });
      }
      updates.rating = numericRating;
    }
    if (text !== undefined) {
      updates.text = String(text).trim().slice(0, 2000);
    }

    const updatedReview = await Review.findByIdAndUpdate(id, updates, {
      new: true,
    });

    res.status(200).json({ success: true, data: updatedReview });
  } catch (error) {
    console.error("Error updating review:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
