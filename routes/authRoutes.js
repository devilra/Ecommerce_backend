import express from "express";
import {
  getUserProfile,
  loginUser,
  logout,
  registerUser,
  updateUserProfile,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logout);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, upload.single("image"), updateUserProfile);

export default router;
