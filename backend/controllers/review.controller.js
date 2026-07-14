import Review from "../models/Review.js";
import Book from "../models/Book.js"; // Import Book model
import mongoose from "mongoose";

// Get all reviews
export const getReview = async (req, res) => {
  try {
    const reviews = await Review.find().populate("bookId", "title author"); // Populate book details
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get a review by ID
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

// Create a new review
export const createReview = async (req, res) => {
  try {
    const { bookId, userId, userName, userAvatar, rating, text } = req.body;

    // Validate required fields
    if (!bookId || !userId || !userName || !rating || !text) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Check if book exists
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

    // Create new review
    const newReview = new Review({
      bookId,
      userId,
      userName,
      userAvatar,
      rating,
      text,
      date: new Date(),
    });

    await newReview.save();

    // Add review ID to the book's `reviews` array
    book.reviews.push(newReview._id);
    await book.save();

    res.status(201).json({ success: true, data: newReview });
  } catch (error) {
    console.error("Error creating review:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Delete a review
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

    // Remove review from book's `reviews` array
    await Book.findByIdAndUpdate(review.bookId, { $pull: { reviews: id } });

    await Review.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Review removed" });
  } catch (error) {
    console.error("Error deleting review:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Update a review
export const updateReview = async (req, res) => {
  const { id } = req.params;
  const { rating, text } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid review ID" });
  }

  try {
    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { rating, text, date: new Date() },
      { new: true }
    );

    if (!updatedReview) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    res.status(200).json({ success: true, data: updatedReview });
  } catch (error) {
    console.error("Error updating review:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
