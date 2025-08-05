const Parcel = require("../models/Parcel");

// CREATE A PARCEL
const createParcel = async (req, res) => {
  try {
    const newParcel = Parcel(req.body);
    const parcel = await newParcel.save();
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

// UPDATE PARCEL
// const updateParcel = async (req, res) => {
//   try {
//     const updatedParcel = await Parcel.findById(req.params.id);
//     res.status(200).json(updatedParcel);
//   } catch (error) {
//     res.status(500).json(error);
//   }
// };
const updateParcel = async (req, res) => {
  try {
    const updatedParcel = await Parcel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true } // returns the updated document
    );

    if (!updatedParcel) {
      return res.status(404).json("Parcel not found");
    }

    res.status(200).json(updatedParcel);
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

// GET USER PARCEL
const getUserParcels = async (req, res) => {
  try {
    const parcels = await Parcel.find({ senderEmail: req.body.email }).sort({
      createdAt: -1,
    });
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
  getParcel,
  getUserParcels,
  deleteParcel,
};
