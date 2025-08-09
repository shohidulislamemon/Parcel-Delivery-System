const express = require("express");
const router = express.Router();
const {
  createDeliveryAgent,
  getDeliveryAgent,
  getAllDeliveryAgents,
  updateDeliveryAgent,
  assignParcelsToAgent,
  deleteDeliveryAgent,
} = require("../controllers/deliveryAgent");
const { verifyAdmin } = require("../middleware/verifyToken");

// Create delivery agent
router.post("/", createDeliveryAgent);

// Get a specific delivery agent by ID
router.get("/:id", getDeliveryAgent);

// Get all delivery agents
router.get("/", getAllDeliveryAgents);

// Update delivery agent
router.put("/:id", updateDeliveryAgent);

// Assign parcels to a delivery agent
router.post("/:id/assign-parcels", assignParcelsToAgent);

// Delete a delivery agent
router.delete("/:id", deleteDeliveryAgent);

module.exports = router;
