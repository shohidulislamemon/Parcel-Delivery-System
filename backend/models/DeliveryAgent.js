const mongoose = require("mongoose");

const DeliveryAgentSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", 
            required: true,
        },
        fullname: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        status: {
            type: Number,
            default: 0, // 0 for inactive, 1 for active
        },
        division: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        assignedParcels: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Parcel", 
            },
        ],
    },
    {
        timestamps: true, 
    }
);

module.exports = mongoose.model("DeliveryAgent", DeliveryAgentSchema);
