import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes"; // Correctly importing the user routes
import adminRoutes from "./routes/adminRoutes";
import cors from "cors";
import express from "express";
import { errorHandler } from "./middleware/errorHandler";
const app = express();

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For form data

app.use(
  cors()

);

// User routes
app.use("/users", userRoutes);

// Admin routes
app.use("/admin", adminRoutes);

app.use(errorHandler);

const Port = process.env.PORT || 5000;

app.listen(Port, () => console.log(`Server started on ${Port}`));
