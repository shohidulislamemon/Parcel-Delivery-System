const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();

// Middleware to verify if the user is authenticated
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    // Extract token from Authorization header
    const token = authHeader.split(" ")[1]; // split by space to get token
    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
      if (err) {
        return res.status(403).json("Token is not valid");
      }
      req.user = user; // Attach user info to the request object
      next();
    });
  } else {
    return res.status(401).json("You are not authenticated");
  }
};

// Middleware to verify if the user is authenticated and authorized (admin only)
const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === "admin") {
      // If the user role is 'admin', allow access
      next();
    } else {
      return res.status(403).json("You are not permitted to do this operation");
    }
  });
};

// Middleware to verify if the user has 'admin' role
const verifyAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json("You are not authorized");
  }
  next();
};

module.exports = { verifyToken, verifyTokenAndAuthorization, verifyAdmin };
