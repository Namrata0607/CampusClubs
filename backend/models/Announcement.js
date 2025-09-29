import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema({
  content: { type: String, required: true },
  club: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Club",
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
}, { timestamps: true });

export default mongoose.model("Announcement", announcementSchema);
