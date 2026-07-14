import express from "express";

import {
  createBook,
  deleteBook,
  getBookById,
  getBooks,
  updateBook,
} from "../controllers/book.controller.js";

const router = express.Router();

router.get("/", getBooks);
router.get("/:id", getBookById);
router.post("/", createBook);
router.delete("/:id", deleteBook);
router.put("/:id", updateBook);

export default router;
