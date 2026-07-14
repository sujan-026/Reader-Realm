import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import bookRoutes from "./routes/book.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import userRoutes from "./routes/users.routes.js";
import cors from "cors";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

app.use(express.json()); // Allows us to get JSON data in the request body

app.use("/api/books", bookRoutes);

app.use("/api/reviews", reviewRoutes);

app.use("/api/users", userRoutes);

app.listen(port, () => {
  connectDB();
  console.log(`Server is running on port ${port}`);
});
