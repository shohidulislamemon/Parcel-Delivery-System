// controllers/parcel.js
const Parcel = require("../models/Parcel");
const { getIO } = require("../sockets/io");

const mongoose = require("mongoose");

function emitParcelUpdate(parcel, opts = {}) {
  const io = getIO();
  if (!io) return;

  const {
    alsoAgentEmails = [],
    notifyAdmins = true,
  } = opts;

  const norm = v => String(v || "").trim().toLowerCase();

  const payload = {
    _id: parcel._id,
    status: parcel.status,
    assignedAgentName: parcel.assignedAgentName ?? null,
    assignedAgentEmail: parcel.assignedAgentEmail ?? null,
    senderEmail: parcel.senderEmail ?? null,
    recipientEmail: parcel.recipientEmail ?? null,
    updatedAt:
      parcel.updatedAt instanceof Date
        ? parcel.updatedAt.toISOString()
        : (parcel.updatedAt ?? null),
  };

  // always notify viewers of this parcel
  io.to(`parcel:${String(parcel._id)}`).emit("parcel:updated", payload);

  // customer
  if (payload.senderEmail) {
    io.to(`email:${norm(payload.senderEmail)}`).emit("parcel:updated", payload);
  }

  // agent(s): current + any previous/extra
  const agentEmails = new Set(
    [payload.assignedAgentEmail, ...alsoAgentEmails].map(norm).filter(Boolean)
  );
  agentEmails.forEach(e => io.to(`agent:${e}`).emit("parcel:updated", payload));

  // optional: admin dashboards
  if (notifyAdmins) io.to("admins").emit("parcel:updated", payload);
}


// CREATE (no socket emit here)
const createParcel = async (req, res) => {
  try {
    const parcel = await Parcel.create(req.body);
    res.status(200).json(parcel);
  } catch (error) {
    res.status(500).json(error);
  }
};

// GET ALL
const getAllParcels = async (req, res) => {
  try {
    const parcels = await Parcel.find().sort({ createdAt: -1 });
    res.status(200).json(parcels);
  } catch (error) {
    res.status(500).json(error);
  }
};

// UPDATE (generic) → emit ONLY if status or assignment changed
const updateParcel = async (req, res) => {
  try {
    const before = await Parcel.findById(req.params.id).lean();
    if (!before) return res.status(404).json("Parcel not found");

    const updated = await Parcel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    const statusChanged =
      typeof req.body.status !== "undefined" &&
      Number(before.status) !== Number(updated.status);

    const assignmentChanged =
      (Object.prototype.hasOwnProperty.call(req.body, "assignedAgentEmail") &&
        String(before.assignedAgentEmail || "") !== String(updated.assignedAgentEmail || "")) ||
      (Object.prototype.hasOwnProperty.call(req.body, "assignedAgentName") &&
        String(before.assignedAgentName || "") !== String(updated.assignedAgentName || ""));

    if (statusChanged || assignmentChanged) {
      const oldAgent = String(before.assignedAgentEmail || "").toLowerCase().trim();
      const newAgent = String(updated.assignedAgentEmail || "").toLowerCase().trim();
      const alsoAgentEmails = oldAgent && oldAgent !== newAgent ? [oldAgent] : [];
      emitParcelUpdate(updated, { alsoAgentEmails });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json(error);
  }
};


// STATUS-ONLY endpoint (always emits)
const updateParcelStatus = async (req, res) => {
  try {
    const status = Number(req.body.status);
    const updated = await Parcel.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json("Parcel not found");
    emitParcelUpdate(updated); // status change -> emit
    res.status(200).json(updated);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// ASSIGN → status=2 (emit)
const assignParcelToAgent = async (req, res) => {
  try {
    const { name, email } = req.body || {};
    if (!name || !email) return res.status(400).json({ error: "name and email are required" });

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
      return res.status(400).json({ error: "Invalid email" });
    }

    const before = await Parcel.findById(req.params.id).lean();

    const updated = await Parcel.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          assignedAgentName: name.trim(),
          assignedAgentEmail: String(email).toLowerCase().trim(),
          assignedAt: new Date(),
          status: 2,
        },
      },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json("Parcel not found");

    const oldAgent = String(before?.assignedAgentEmail || "").toLowerCase().trim();
    const newAgent = String(updated.assignedAgentEmail || "").toLowerCase().trim();
    const alsoAgentEmails = oldAgent && oldAgent !== newAgent ? [oldAgent] : [];

    emitParcelUpdate(updated, { alsoAgentEmails });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json(error);
  }
};


// UNASSIGN → status=1 (emit)
const unassignParcel = async (req, res) => {
  try {
    const before = await Parcel.findById(req.params.id).lean();

    const updated = await Parcel.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          assignedAgentName: null,
          assignedAgentEmail: null,
          assignedAt: null,
          status: 1,
        },
      },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json("Parcel not found");

    const oldAgent = String(before?.assignedAgentEmail || "").toLowerCase().trim();
    const alsoAgentEmails = oldAgent ? [oldAgent] : [];

    emitParcelUpdate(updated, { alsoAgentEmails });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json(error);
  }
};


// FIND ONE
const getParcel = async (req, res) => {
  try {
    const parcel = await Parcel.findById(req.params.id);
    if (!parcel) return res.status(404).json("Parcel not found");
    res.status(200).json(parcel);
  } catch (error) {
    res.status(500).json(error);
  }
};

// USER PARCELS
const getUserParcels = async (req, res) => {
  try {
    const email = req.body.email;
    if (!email) return res.status(400).json({ error: "Email required" });

    const parcels = await Parcel.find({ senderEmail: email }).sort({ createdAt: -1 });
    res.status(200).json(parcels);
  } catch (error) {
    res.status(500).json(error);
  }
};

// AGENT PARCELS
const getDeliveryAgentParcels = async (req, res) => {
  try {
    const emailRaw = req.body.email;
    if (!emailRaw) return res.status(400).json({ error: "Email required" });

    const email = String(emailRaw).toLowerCase().trim();
    const filter = { assignedAgentEmail: email };

    if (req.query.status) {
      const codes = String(req.query.status)
        .split(",")
        .map(Number)
        .filter(Number.isInteger);
      if (codes.length) filter.status = { $in: codes };
    }

    const parcels = await Parcel.find(filter).sort({ createdAt: -1 });
    res.status(200).json(parcels);
  } catch (error) {
    res.status(500).json(error);
  }
};

// DELETE (emit)
const deleteParcel = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Prevent CastError -> 500
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid parcel id" });
    }

    const deleted = await Parcel.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Parcel not found" });
    }

    // Broadcast deletion
    const io = req.app.get("io");
    if (io) {
      // global broadcast
      io.emit("parcel:deleted", { _id: id });

      // or, if you use per-room:
      // io.to(`parcel:${id}`).emit("parcel:deleted", { _id: id });
    }

    // Use 204 No Content to keep responses clean
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createParcel,               // (no emit)
  getAllParcels,
  updateParcel,               // emits only when status/assignment changes
  updateParcelStatus,         // emits
  assignParcelToAgent,        // emits
  unassignParcel,             // emits
  getParcel,
  getUserParcels,
  getDeliveryAgentParcels,
  deleteParcel,               // emits
};
