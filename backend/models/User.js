const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        fullname: { type: String, required: true },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [/.+\@.+\..+/, 'Please fill a valid email address']
        },
        age: { type: Number },
        division: { type: String, required: true },
        address: { type: String, required: true },
        password: { type: String, required: true },
        status: { type: Number, default: 0 },

        role: { type: String, default: "customer" },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", UserSchema);
