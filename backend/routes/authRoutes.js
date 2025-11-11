import express from "express";
import { signup, signin, getMe, updateProfile, changePassword } from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public Routes
router.post("/signup", signup);
router.post("/signin", signin);

// Private Routes (JWT Auth Required)
router.get("/me", authMiddleware, getMe);
router.put("/profile", authMiddleware, updateProfile);
router.put("/change-password", authMiddleware, changePassword);

export default router;
