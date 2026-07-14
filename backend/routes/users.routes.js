import express from "express";
import {
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  getUsers,
} from "../controllers/users.controller.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.post("/login", loginUser);

export default router;
