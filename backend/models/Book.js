import mongoose, { Schema } from "mongoose";

const bookSchema = new mongoose.Schema({
    id: String,
    title: String,
    author: String,
    coverImage: String,
    blurImage: String,
    description: String,
    rating: Number,
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
    genres: [String],
    publicationDate: String,
    featured: Boolean,
});

const Book = mongoose.model("Book", bookSchema);

export default Book;