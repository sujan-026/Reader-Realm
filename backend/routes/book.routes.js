import express from "express";
import {
  createBook,
  deleteBook,
  getBookById,
  getBooks,
  updateBook,
} from "../controllers/book.controller.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getBooks);
router.get("/:id", getBookById);
router.post("/", protect, adminOnly, createBook);
router.delete("/:id", protect, adminOnly, deleteBook);
router.put("/:id", protect, adminOnly, updateBook);

export default router;
