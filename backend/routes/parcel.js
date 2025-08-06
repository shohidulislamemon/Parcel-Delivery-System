const express = require("express");
const { createParcel, getAllParcels, updateParcel, getParcel, getUserParcels, deleteParcel } = require("../controllers/parcel");
const {  verifyToken, verifyTokenAndAuthorization } = require("../middleware/verifyToken");
const router = express.Router();

// ADDING PARCEL
router.post("/",verifyToken ,createParcel);

// GET ALL PARCEL
// router.get("/",verifyTokenAndAuthorization,getAllParcels);
router.get("/",getAllParcels);

// UPDATE PARCEL
router.put("/:id",updateParcel);

// GET A SPECIFIC PARCEL
router.get("/find/:id",getParcel)

// GET USER PARCEL
router.post("/me",getUserParcels)

// DELETE PARCEL
router.delete("/:id",deleteParcel)

module.exports = router;
