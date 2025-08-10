// routes/parcels.js
const express = require("express");
const {
  createParcel,
  getAllParcels,
  updateParcel,
  getParcel,
  getUserParcels,
  deleteParcel,
  assignParcelToAgent,
  unassignParcel,
} = require("../controllers/parcel");

const router = express.Router();

router.post("/", createParcel);
router.get("/", getAllParcels);
router.put("/:id", updateParcel);

router.get("/find/:id", getParcel);
router.post("/me", getUserParcels);



// NEW: assign/unassign
router.patch("/:id/assign", assignParcelToAgent);
router.patch("/:id/unassign", unassignParcel);

router.delete("/:id", deleteParcel);

module.exports = router;
