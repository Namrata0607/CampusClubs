import express from "express";
import {
  getDashboard,
  getAllClubs,
  createClub,
  getClubById,
  updateClub,
  deleteClub,
  getMembers,
  getRequests,
  handleRequest,
  createEvent,
  updateEvent,
  deleteEvent,
  getClubEvents,
  createAnnouncement,
  deleteAnnouncement,
  getClubAnnouncements,
} from "../controllers/adminController.js";

import { authMiddleware, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware, adminOnly);

// Dashboard
router.get("/dashboard", getDashboard);

// Club management
router.get("/clubs", getAllClubs);
router.post("/clubs", createClub);
router.get("/clubs/:id", getClubById);
router.patch("/clubs/:id", updateClub);
router.delete("/clubs/:id", deleteClub);

// Member management
router.get("/members", getMembers);
// router.patch("/members/:memberId", updateMemberStatus);

// Request management
router.get("/requests", getRequests);
router.patch("/requests/:requestId/:action", handleRequest);

// Event management
router.post("/clubs/:clubId/events", createEvent);
router.get("/clubs/:clubId/events", getClubEvents);
router.patch("/events/:eventId", updateEvent);
router.delete("/events/:eventId", deleteEvent);

// Announcement management
router.post("/clubs/:clubId/announcements", createAnnouncement);
router.get("/clubs/:clubId/announcements", getClubAnnouncements);
router.delete("/announcements/:announcementId", deleteAnnouncement);

export default router;