import Club from "../models/Club.js";

// @desc Get student dashboard - joined clubs and announcements
// @route GET /api/student/dashboard
export const getDashboard = async (req, res, next) => {
  try {
    // Find clubs where this student is a member (approved)
    const joinedClubs = await Club.find({
      "members.student": req.user._id,
      "members.status": "approved"
    })
    .populate("admin", "name email")
    .populate({ path: "announcements", model: "Announcement" })
    .select("name logo description category announcements");

    // Find pending membership requests
    const pendingRequests = await Club.find({
      "members.student": req.user._id,
      "members.status": "pending"
    })
    .select("name logo description category");

    res.json({
      joinedClubs,
      pendingRequests,
      totalJoined: joinedClubs.length,
      totalPending: pendingRequests.length
    });
  } catch (err) {
    next(err);
  }
};

// @desc Get all clubs for exploration
// @route GET /api/student/clubs
export const getAllClubs = async (req, res, next) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;
    
    // Build filter object
    const filter = {};
    if (category && category !== 'all') {
      filter.category = category;
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    
    const clubs = await Club.find(filter)
      .populate("admin", "name")
      .select("name logo description category members createdAt")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Add membership info for current user
    const clubsWithMembershipInfo = clubs.map(club => {
      const memberEntry = club.members.find(m => m.student.toString() === req.user._id.toString());
      return {
        ...club.toObject(),
        memberCount: club.members.filter(m => m.status === 'approved').length,
        userMembershipStatus: memberEntry ? memberEntry.status : 'not_member'
      };
    });

    const total = await Club.countDocuments(filter);
    
    res.json({
      clubs: clubsWithMembershipInfo,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalClubs: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc Get individual club details
// @route GET /api/student/clubs/:id
export const getClubDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const club = await Club.findById(id)
      .populate("admin", "name email")
      .populate("members.student", "name email")
      .populate({ path: "events", model: "Event" })
      .populate({ path: "announcements", model: "Announcement" });

    if (!club) {
      return next({ status: 404, message: "Club not found" });
    }

    // Check current user's membership status
    const memberEntry = club.members.find(m => m.student._id.toString() === req.user._id.toString());
    const userMembershipStatus = memberEntry ? memberEntry.status : 'not_member';

    const clubDetails = {
      ...club.toObject(),
      userMembershipStatus,
      approvedMembers: club.members.filter(m => m.status === 'approved'),
      pendingMembers: club.members.filter(m => m.status === 'pending')
    };

    res.json(clubDetails);
  } catch (err) {
    next(err);
  }
};

// @desc Join a club (send membership request)
// @route POST /api/student/clubs/:id/join
export const joinClub = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const club = await Club.findById(id);
    if (!club) {
      return next({ status: 404, message: "Club not found" });
    }

    // Check if already a member or has pending request
    const existingMember = club.members.find(m => m.student.toString() === req.user._id.toString());
    if (existingMember) {
      if (existingMember.status === 'approved') {
        return next({ status: 400, message: "Already a member of this club" });
      }
      if (existingMember.status === 'pending') {
        return next({ status: 400, message: "Membership request already pending" });
      }
    }

    // Add membership request
    club.members.push({
      student: req.user._id,
      status: 'pending'
    });

    await club.save();

    res.status(201).json({
      message: "Membership request sent successfully",
      status: 'pending'
    });
  } catch (err) {
    next(err);
  }
};

// @desc Leave a club
// @route DELETE /api/student/clubs/:id/leave
export const leaveClub = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const club = await Club.findById(id);
    if (!club) {
      return next({ status: 404, message: "Club not found" });
    }

    // Find and remove the member
    const memberIndex = club.members.findIndex(m => m.student.toString() === req.user._id.toString());
    if (memberIndex === -1) {
      return next({ status: 400, message: "You are not a member of this club" });
    }

    club.members.splice(memberIndex, 1);
    await club.save();

    res.json({
      message: "Successfully left the club"
    });
  } catch (err) {
    next(err);
  }
};