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

// controllers/user.js
const getUserByEmail = async (req, res) => {
  try {
    const emailInput = req.params.email ?? req.query.email ?? req.body.email;
    if (!emailInput) {
      return res.status(400).json({ message: "Email is required" });
    }

    const email = String(emailInput).trim().toLowerCase();

    // Add { role: 'customer' } here too if you only want customers
    const user = await User.findOne({ email })
      .select("-password -resetToken -__v"); // hide sensitive fields

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user", error: error.message });
  }
};


module.exports = {
    deleteUser,
    getAllUsers,
    getUserByEmail
};
