const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const User = require("../models/User")
const dotenv = require("dotenv")


dotenv.config();



// REGISTER USER

const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, age, division, address } = req.body;

    // Validate if all fields are provided
    if (!fullName || !email || !password || !age || !division || !address) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use." });
    }

    // Create a new user with the "customer" role by default
    const newUser = new User({
      fullname: fullName,
      email: email.toLowerCase(),
      age,
      division,
      address,
      password: CryptoJS.AES.encrypt(password, process.env.PASS).toString(),
      role: "customer",  // Role is now explicitly set to "customer"
    });

    // Save the new user to the database
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Failed to register user", error });
  }
};




// LOGIN USER
const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email.toLowerCase() });
    if (!user) {
      return res.status(404).json("No account found with this email");
    }

    const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS);
    const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
    if (originalPassword !== req.body.password) {
      return res.status(401).json("Invalid email or password");
    }

    const { password, ...info } = user._doc;
    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SEC,
      { expiresIn: "10d" }
    );
    res.status(200).json({ ...info, accessToken, role: user.role });
  } catch (error) {
    res.status(500).json(error);
  }
};


module.exports = { registerUser, loginUser };