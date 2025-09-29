import express from "express";
import { signup, signin, getMe } from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public Routes
router.post("/signup", signup);
router.get("/signin", signin);

// Private Route (test JWT auth)
router.get("/me", authMiddleware, getMe);

export default router;
