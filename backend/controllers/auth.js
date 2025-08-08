const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const User = require("../models/User")
const dotenv = require("dotenv")

 
dotenv.config();

// REGISTER USER
const registerUser = async (req, res) => {
  try {
    const existingUser = await User.findOne({
      email: req.body.email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Create new user
    const newUser = new User({
      fullname: req.body.fullName, // Match frontend casing
      email: req.body.email.toLowerCase(),
      age: req.body.age,
      division: req.body.division,
      address: req.body.address,
      password: CryptoJS.AES.encrypt(
        req.body.password,
        process.env.PASS
      ).toString(),
    });

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
        const hashedPassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.PASS
        )
        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
        if (originalPassword !== req.body.password) {
            return res.status(401).json("Invalid email or password")
        }
        const { password, ...info } = user._doc;
        const accessToken = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SEC,
            { expiresIn: "10d" }
        )
        res.status(200).json({ ...info, accessToken });
    } catch (error) {
        res.status(500).json(error)
    }

}

module.exports = { registerUser, loginUser };