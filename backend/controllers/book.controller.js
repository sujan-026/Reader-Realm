import Book from "../models/Book.js";
import mongoose from "mongoose";

export const getBooks = async (req, res) => {
  try {
    const books = await Book.find({});
    res.status(200).json({ success: true, data: books });
  } catch (error) {
    console.log("error in fetching books: ", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getBookById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid book id" });
  }

  try {
    const book = await Book.findById(id);
    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });
    }
    res.status(200).json({ success: true, data: book });
  } catch (error) {
    console.log("error in fetching books: ", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const createBook = async (req, res) => {
  const book = req.body;

  if (!book.title || !book.author || !book.coverImage) {
    return res
      .status(400)
      .json({ success: false, message: "Please fill all required fields" });
  }

  const newBook = new Book({
    ...book,
    title: String(book.title).trim(),
    author: String(book.author).trim(),
  });

  try {
    await newBook.save();
    res.status(201).json({ success: true, data: newBook });
  } catch (error) {
    console.error("Error creating book:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteBook = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid book id" });
  }

  try {
    const deleted = await Book.findByIdAndDelete(id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });
    }
    res.status(200).json({ success: true, message: "Book removed" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateBook = async (req, res) => {
  const { id } = req.params;
  const book = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid book id" });
  }

  try {
    const updatedBook = await Book.findByIdAndUpdate(id, book, { new: true });
    if (!updatedBook) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });
    }
    res.status(200).json({ success: true, data: updatedBook });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
