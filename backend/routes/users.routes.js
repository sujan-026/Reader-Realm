import express from "express";
import {
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  getUsers,
} from "../controllers/users.controller.js";
import {
  protect,
  adminOnly,
  adminOrSelf,
  optionalProtect,
} from "../middleware/auth.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts. Try again later.",
  },
});

const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many signup attempts. Try again later.",
  },
});

router.post("/login", loginLimiter, loginUser);
router.post("/", signupLimiter, optionalProtect, createUser);

router.get("/", protect, adminOnly, getUsers);
router.get("/:id", protect, adminOrSelf, getUserById);
router.put("/:id", protect, adminOrSelf, updateUser);
router.delete("/:id", protect, adminOnly, deleteUser);

export default router;
