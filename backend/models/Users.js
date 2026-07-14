import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema({
    id: String,
    name: { type: String, required: true, trim: true },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    avatar: String,
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
});

export default model("User", userSchema);
