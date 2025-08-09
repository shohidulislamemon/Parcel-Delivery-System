const DeliveryAgent = require('../models/DeliveryAgent');
const User = require('../models/User');
const Parcel = require('../models/Parcel');

const CryptoJS = require('crypto-js'); 

const createDeliveryAgent = async (req, res) => {
  try {
    const { fullname, email, phone, division, address, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Agent already exists" });
    }

    // Encrypt the password using CryptoJS
    const encryptedPassword = CryptoJS.AES.encrypt(password, process.env.PASS).toString();

    // Create a new user with the role "delivery-agent"
    const newUser = new User({
      fullname,
      email,
      phone,
      role: "delivery-agent", // Set role as "delivery-agent"
      password: encryptedPassword, // Save the encrypted password
      division,
      address,
    });

    await newUser.save();

    // Create the delivery agent and link to the created user
    const newDeliveryAgent = new DeliveryAgent({
      userId: newUser._id,
      fullname,
      email,
      phone,
      division,
      address,
      status: 0, // Default to inactive
    });

    await newDeliveryAgent.save();

    res.status(201).json({ message: "Delivery agent created successfully", newDeliveryAgent });
  } catch (error) {
    console.error("Error creating delivery agent:", error);
    res.status(500).json({ message: "Failed to create delivery agent", error });
  }
};


const getDeliveryAgent = async (req, res) => {
  try {
    const { id } = req.params;
    const agent = await DeliveryAgent.findById(id).populate("userId");
    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }
    res.status(200).json(agent);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving agent", error: err });
  }
};

// Get all delivery agents
const getAllDeliveryAgents = async (req, res) => {
  try {
    // Find all users with the "delivery-agent" role
    const users = await User.find({ role: "delivery-agent" });
    
    // Get delivery agents linked to these users
    const agentIds = users.map(user => user._id);  // Get the user IDs of all "delivery-agent" users

    // Fetch all delivery agents associated with the above users
    const agents = await DeliveryAgent.find({ userId: { $in: agentIds } }).populate("userId");

    res.status(200).json(agents);  // Send the filtered agents as the response
  } catch (err) {
    res.status(500).json({ message: "Error retrieving agents", error: err });
  }
};


// Update delivery agent (e.g., change status, assigned parcels, etc.)
const updateDeliveryAgent = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedAgent = await DeliveryAgent.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedAgent) {
      return res.status(404).json({ message: "Agent not found" });
    }
    res.status(200).json(updatedAgent);
  } catch (err) {
    res.status(500).json({ message: "Error updating agent", error: err });
  }
};

// Assign parcels to a delivery agent
const assignParcelsToAgent = async (req, res) => {
  try {
    const { id } = req.params;
    const { parcelIds } = req.body; // array of parcel IDs

    const agent = await DeliveryAgent.findById(id);
    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    const parcels = await Parcel.find({ _id: { $in: parcelIds } });
    if (parcels.length !== parcelIds.length) {
      return res.status(400).json({ message: "One or more parcels not found" });
    }

    agent.assignedParcels.push(...parcelIds);
    await agent.save();

    res.status(200).json(agent);
  } catch (err) {
    res.status(500).json({ message: "Error assigning parcels", error: err });
  }
};

// Delete a delivery agent
const deleteDeliveryAgent = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the delivery agent by ID
    const agent = await DeliveryAgent.findById(id);

    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    // Delete the associated User
    await User.findByIdAndDelete(agent.userId);

    // Now delete the DeliveryAgent document
    await DeliveryAgent.findByIdAndDelete(id);

    res.status(200).json({ message: "Agent and associated user deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting agent and user", error: err });
  }
};


module.exports = {
  createDeliveryAgent,
  getDeliveryAgent,
  getAllDeliveryAgents,
  updateDeliveryAgent,
  assignParcelsToAgent,
  deleteDeliveryAgent,
};
