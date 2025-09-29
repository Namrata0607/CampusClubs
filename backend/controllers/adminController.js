import Club from "../models/Club.js";
import Event from "../models/Event.js";
import Announcement from "../models/Announcement.js";

// GET /api/admin/dashboard
export const getDashboard = async (req, res, next) => {
  try {
    // Return all clubs created by this admin. Use `find` (array) instead of `findOne` (single doc).
    const clubs = await Club.find({ admin: req.user._id })
      .populate("members.student", "name email")
      .populate({ path: "events", model: "Event" })
      .populate({ path: "announcements", model: "Announcement" });

    if (!clubs || clubs.length === 0) return next({ status: 404, message: "No clubs found" });
    res.json(clubs);
  } catch (err) {
    next(err);
  }
};

// POST /api/admin/clubs
export const createClub = async (req, res, next) => {
  try {
    const { name, logo, description, category } = req.body;

    const club = await Club.create({
      name,
      logo,
      description,
      category,
      admin: req.user._id,
    });

    res.status(201).json(club);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/admin/clubs/:id
export const updateClub = async (req, res, next) => {
  try {
    const { id } = req.params;
    const club = await Club.findByIdAndUpdate(id, req.body, { new: true });

    if (!club) return next({ status: 404, message: "Club not found" });

    res.json(club);
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/members
export const getMembers = async (req, res, next) => {
  try {
    const club = await Club.findOne({ admin: req.user._id }).populate("members.student", "name email");

    if (!club) return next({ status: 404, message: "Club not found" });

    res.json(club.members);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/admin/members/:studentId  → approve/reject member
export const updateMemberStatus = async (req, res, next) => {
  try {
    const { memberId } = req.params; // Changed from studentId to memberId
    const { status } = req.body || {};

    // Validate required fields
    if (!status) {
      return next({ status: 400, message: "Status is required in request body" });
    }

    if (!['pending', 'approved'].includes(status)) {
      return next({ status: 400, message: "Status must be 'pending' or 'approved'" });
    }

    const club = await Club.findOne({ admin: req.user._id });

    if (!club) return next({ status: 404, message: "Club not found" });

    const member = club.members.find((m) => m.student.toString() === memberId);
    if (!member) return next({ status: 404, message: "Member not found" });

    member.status = status;
    await club.save();

    res.json({ message: "Member status updated", member });
  } catch (err) {
    next(err);
  }
};
