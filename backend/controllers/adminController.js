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
    const { name, logo, description, category, rules, maxMembers } = req.body;

    const club = await Club.create({
      name,
      logo,
      description,
      category,
      rules,
      maxMembers,
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

// GET /api/admin/clubs - Get all clubs for admin
export const getAllClubs = async (req, res, next) => {
  try {
    const clubs = await Club.find({ admin: req.user._id })
      .populate("members.student", "name email")
      .sort({ createdAt: -1 });

    // Always return an array, even if empty
    res.json(clubs || []);
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/clubs/:id - Get single club by ID
export const getClubById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const club = await Club.findOne({ _id: id, admin: req.user._id })
      .populate("members.student", "name email");

    if (!club) return next({ status: 404, message: "Club not found" });

    res.json(club);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/admin/clubs/:id - Delete club
export const deleteClub = async (req, res, next) => {
  try {
    const { id } = req.params;
    const club = await Club.findOneAndDelete({ _id: id, admin: req.user._id });

    if (!club) return next({ status: 404, message: "Club not found" });

    res.json({ message: "Club deleted successfully" });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/members
export const getMembers = async (req, res, next) => {
  try {
    const clubs = await Club.find({ admin: req.user._id }).populate("members.student", "name email");

    if (!clubs || clubs.length === 0) {
      return res.json({
        totalMembers: 0,
        approvedMembers: 0,
        pendingMembers: 0,
        members: []
      });
    }

    // Aggregate all members from all clubs managed by this admin
    let allMembers = [];
    let approvedCount = 0;
    let pendingCount = 0;

    clubs.forEach(club => {
      club.members.forEach(member => {
        allMembers.push({
          ...member.toObject(),
          clubName: club.name,
          clubId: club._id
        });
        
        if (member.status === 'approved') {
          approvedCount++;
        } else if (member.status === 'pending') {
          pendingCount++;
        }
      });
    });

    // Filter to show only approved members for the main display
    const approvedMembers = allMembers.filter(member => member.status === 'approved');

    res.json({
      totalMembers: approvedCount, // Only count approved members as "total"
      approvedMembers: approvedCount,
      pendingMembers: pendingCount,
      members: approvedMembers // Return only approved members
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/requests - Get all membership requests
export const getRequests = async (req, res, next) => {
  try {
    // Find all clubs managed by this admin
    const clubs = await Club.find({ admin: req.user._id });
    const clubIds = clubs.map(club => club._id);

    // Find all requests for these clubs
    const requests = await Club.aggregate([
      { $match: { _id: { $in: clubIds } } },
      { $unwind: "$members" },
      { $match: { "members.status": { $in: ["pending", "approved", "rejected"] } } },
      {
        $lookup: {
          from: "users",
          localField: "members.student",
          foreignField: "_id",
          as: "student"
        }
      },
      {
        $project: {
          _id: "$members._id",
          club: { _id: "$_id", name: "$name" },
          student: { $arrayElemAt: ["$student", 0] },
          status: "$members.status",
          createdAt: "$members.joinedAt"
        }
      },
      { $sort: { createdAt: -1 } }
    ]);

    res.json(requests || []);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/admin/requests/:requestId/:action - Approve/Reject membership request
export const handleRequest = async (req, res, next) => {
  try {
    const { requestId, action } = req.params;

    if (!['approve', 'reject'].includes(action)) {
      return next({ status: 400, message: "Action must be 'approve' or 'reject'" });
    }

    const status = action === 'approve' ? 'approved' : 'rejected';

    // Find the club that contains this request
    const club = await Club.findOne({
      admin: req.user._id,
      "members._id": requestId
    });

    if (!club) {
      return next({ status: 404, message: "Request not found" });
    }

    // Update the member status
    const member = club.members.id(requestId);
    if (!member) {
      return next({ status: 404, message: "Member request not found" });
    }

    member.status = status;
    await club.save();

    res.json({ message: `Request ${action}d successfully`, member });
  } catch (err) {
    next(err);
  }
};
