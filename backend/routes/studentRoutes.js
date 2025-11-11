import express from "express";
import { 
  getDashboard, 
  getAllClubs, 
  getClubDetails, 
  joinClub, 
  leaveClub,
  getClubEvents,
  getClubAnnouncements
} from "../controllers/studentController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All student routes require authentication
router.use(authMiddleware);

// Dashboard - show joined clubs and announcements
router.get("/dashboard", getDashboard);

// Explore clubs - browse all available clubs
router.get("/clubs", getAllClubs);

// Get individual club details
router.get("/clubs/:id", getClubDetails);

// Join/Leave club actions
router.post("/clubs/:id/join", joinClub);
router.delete("/clubs/:id/leave", leaveClub);

// Get club events (member-only)
router.get("/clubs/:clubId/events", getClubEvents);

// Get club announcements (member-only)
router.get("/clubs/:clubId/announcements", getClubAnnouncements);

export default router;