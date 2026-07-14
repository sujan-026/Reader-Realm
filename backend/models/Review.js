import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    id: String,
    userId: String,
    userName: String,
    userAvatar: String,
    rating: Number,
    text: String,
    date: String,
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
});

export default mongoose.model("Review", reviewSchema);
