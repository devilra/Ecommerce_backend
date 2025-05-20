import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import connectDB from "./config/db.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL
    credentials: true, // Allow sending cookies
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

const PORT = process.env.PORT;

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server Connected ${PORT}`);
  connectDB();
});
