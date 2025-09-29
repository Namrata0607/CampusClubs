import mongoose from "mongoose";

const clubSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logo: { type: String }, // store URL of logo
  description: { type: String, required: true },
  category: { type: String, required: true },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // linked to club admin
    required: true,
  },
  members: [
    {
      student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      status: { type: String, enum: ["pending", "approved"], default: "pending" }
    }
  ],
  // References to events created by this club
  events: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Event" }
  ],
  // References to announcements for this club
  announcements: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Announcement" }
  ],
}, { timestamps: true });

export default mongoose.model("Club", clubSchema);
