const User = require("../models/User");

// DELETING USER
const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(201).json("The user has been deleted successfully");
    } catch (error) {
        res.status(500).json(error);
    }
};

// GET ALL USERS
const getAllUsers = async (req, res) => {
     try {
        const customers = await User.find({ role: 'customer' }).sort({ createdAt: -1 });
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json(error);
    }
};

module.exports = {
    deleteUser,
    getAllUsers
};
