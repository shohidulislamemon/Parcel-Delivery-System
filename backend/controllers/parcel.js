
const Parcel = require("../models/Parcel");

// CREATE A PARCEL
const createParcel = async (req, res) => {
  try {
    const parcel = await Parcel.create(req.body);
    res.status(200).json(parcel);
  } catch (error) {
    res.status(500).json(error);
  }
};

// GET ALL PARCELS
const getAllParcels = async (req, res) => {
  try {
    const parcels = await Parcel.find().sort({ createdAt: -1 });
    res.status(200).json(parcels);
  } catch (error) {
    res.status(500).json(error);
  }
};

// UPDATE PARCEL (general fields; status can also come here)
const updateParcel = async (req, res) => {
  try {
    const updatedParcel = await Parcel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true } // ✅ enforce enum & validators
    );

    if (!updatedParcel) return res.status(404).json("Parcel not found");
    res.status(200).json(updatedParcel);
  } catch (error) {
    res.status(500).json(error);
  }
};

// ASSIGN to delivery agent (name + email) → sets status=2
// PATCH /parcels/:id/assign   { name, email }
const assignParcelToAgent = async (req, res) => {
  try {
    const { name, email } = req.body || {};
    if (!name || !email) {
      return res.status(400).json({ error: "name and email are required" });
    }

    // simple email sanity check (optional)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
      return res.status(400).json({ error: "Invalid email" });
    }

    const parcel = await Parcel.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          assignedAgentName: name.trim(),
          assignedAgentEmail: String(email).toLowerCase().trim(),
          assignedAt: new Date(),
          status: 2, // Assigned to Delivery Agent
        },
      },
      { new: true, runValidators: true }
    );

    if (!parcel) return res.status(404).json("Parcel not found");
    res.status(200).json(parcel);
  } catch (error) {
    res.status(500).json(error);
  }
};

// UNASSIGN (clears agent fields) → sets status=1 (Pending)
const unassignParcel = async (req, res) => {
  try {
    const parcel = await Parcel.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          assignedAgentName: null,
          assignedAgentEmail: null,
          assignedAt: null,
          status: 1, // Pending
        },
      },
      { new: true, runValidators: true }
    );

    if (!parcel) return res.status(404).json("Parcel not found");
    res.status(200).json(parcel);
  } catch (error) {
    res.status(500).json(error);
  }
};

// FIND SINGLE PARCEL
const getParcel = async (req, res) => {
  try {
    const parcel = await Parcel.findById(req.params.id);
    if (!parcel) return res.status(404).json("Parcel not found");
    res.status(200).json(parcel);
  } catch (error) {
    res.status(500).json(error);
  }
};

// GET USER PARCELS (by senderEmail)
const getUserParcels = async (req, res) => {
  try {
    const email = req.body.email;
    if (!email) return res.status(400).json({ error: "Email required" });

    const parcels = await Parcel.find({ senderEmail: email }).sort({
      createdAt: -1,
    });

    res.status(200).json(parcels);
  } catch (error) {
    res.status(500).json(error);
  }
};

// GET DELIVERY AGENT PARCELS
// POST /parcels/agent/me   body: { email }
// Optional: /parcels/agent/me?status=2,3  (filter by status codes)
const getDeliveryAgentParcels = async (req, res) => {
  try {
    const emailRaw = req.body.email;
    if (!emailRaw) return res.status(400).json({ error: "Email required" });

    const email = String(emailRaw).toLowerCase().trim();

    const filter = { assignedAgentEmail: email };

    // optional status filter: ?status=2,3
    if (req.query.status) {
      const codes = String(req.query.status)
        .split(",")
        .map((s) => Number(s))
        .filter((n) => Number.isInteger(n));
      if (codes.length) filter.status = { $in: codes };
    }

    const parcels = await Parcel.find(filter).sort({ createdAt: -1 });
    res.status(200).json(parcels);
  } catch (error) {
    res.status(500).json(error);
  }
};

// DELETE PARCEL
const deleteParcel = async (req, res) => {
  try {
    await Parcel.findByIdAndDelete(req.params.id);
    res.status(200).json("Parcel has been deleted");
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  createParcel,
  getAllParcels,
  updateParcel,
  assignParcelToAgent,
  unassignParcel,
  getParcel,
  getUserParcels,
  deleteParcel,
  getDeliveryAgentParcels,
};
