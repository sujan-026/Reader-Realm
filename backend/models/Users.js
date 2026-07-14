import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema({
    id: String,
    name: String,
    email: String,
    avatar: String,
    password: String,
    role: String,
});

export default model("User", userSchema);
