const express = require("express");
const { deleteUser, getAllUsers,getUserByEmail } = require("../controllers/user");
const router = express.Router();


// DELETING USER
router.delete("/:id",deleteUser)

// GET ALL USER

router.get("/",getAllUsers)
// GET /api/users/by-email?email=jane@example.com
router.get("/by-email", getUserByEmail);


module.exports =router;