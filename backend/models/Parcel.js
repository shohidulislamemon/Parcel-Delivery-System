// models/Parcel.js
const mongoose = require("mongoose");

const ParcelSchema = new mongoose.Schema(
  {
    from: { type: String, required: true },
    to: { type: String, required: true },
    senderName: { type: String, required: true },
    recipientName: { type: String, required: true },
    senderEmail: { type: String, required: true },
    recipientEmail: { type: String, required: true },
    weight: { type: Number, required: true },
    cost: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    note: { type: String },
    feedback: { type: String },

    // 0 None, 1 Pending, 2 Assigned, 3 Delivered, 4 Returned
    status: { type: Number, enum: [0, 1, 2, 3, 4, 5], default: 0 },

    // NEW: assignment fields (nullable)
    assignedAgentName: { type: String, default: null, trim: true },
    assignedAgentEmail: { type: String, default: null, lowercase: true, trim: true },
    assignedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Optional: query by agent email quickly
ParcelSchema.index({ assignedAgentEmail: 1 }, { sparse: true });

module.exports = mongoose.model("Parcel", ParcelSchema);
