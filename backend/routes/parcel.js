
const express = require("express");
const {
  createParcel,
  getAllParcels,
  updateParcel,
  updateParcelStatus,     // optional
  assignParcelToAgent,
  unassignParcel,
  getParcel,
  getUserParcels,
  getDeliveryAgentParcels,
  deleteParcel,
} = require("../controllers/parcel");

const router = express.Router();

router.post("/", createParcel);
router.get("/", getAllParcels);
router.get("/find/:id", getParcel);

router.put("/:id", updateParcel);
router.patch("/:id/status", updateParcelStatus); // optional, if you want a clean status-only path

router.patch("/:id/assign", assignParcelToAgent);
router.patch("/:id/unassign", unassignParcel);

router.post("/me", getUserParcels);
// NOTE: your deliveryAgent routes already mount /api/v1/delivery-agents
// and call getDeliveryAgentParcels at POST /delivery-agents/me
// Only add this if you also want it under /parcels:
// router.post("/agent/me", getDeliveryAgentParcels);

router.delete("/:id", deleteParcel);

module.exports = router;
