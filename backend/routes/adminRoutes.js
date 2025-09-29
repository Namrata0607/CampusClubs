import express from "express";
import {
  getDashboard,
  createClub,
  updateClub,
  getMembers,
  updateMemberStatus,
//   createEvent,
//   updateEvent,
//   deleteEvent,
//   createAnnouncement,
//   deleteAnnouncement,
} from "../controllers/adminController.js";

import { authMiddleware, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware, adminOnly);

// Dashboard
router.get("/dashboard", getDashboard);

// Club profile
router.post("/clubs", createClub);
router.patch("/clubs/:id", updateClub);
router.get("/members", getMembers);
router.patch("/members/:memberId", updateMemberStatus);

export default router;