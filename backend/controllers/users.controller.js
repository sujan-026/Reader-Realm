import bcrypt from "bcryptjs";
import User from "../models/Users.js";
import mongoose from "mongoose";

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid user ID" });
  }

  try {
    const user = await User.findById(id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("Error fetching user:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Create a new user
export const createUser = async (req, res) => {
  const { name, avatar, email, role, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Complete details of Users is required",
      });
  }

  try {
    // Hash the password before saving it to the database
    const salt = await bcrypt.genSalt(10); // Generate 10 rounds of salt
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      avatar,
      email,
      role,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Update user by ID
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, avatar, email, role, password } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid user ID" });
  }

  try {
    // If password is being updated, hash it before saving
    let updatedUserData = { name, avatar, email, role };
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updatedUserData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(id, updatedUserData, {
      new: true,
    });

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Delete user by ID
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid user ID" });
  }

  try {
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Authenticate user (login)
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email only (not with password)
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Compare the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Exclude password before sending response
    const { password: _, ...userWithoutPassword } = user.toObject();

    res.status(200).json({ success: true, data: userWithoutPassword });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
