const mongoose = require("mongoose");

const ParcelSchema = new mongoose.Schema({
    from: { type: String, required: true }, 
    to: { type: String, required: true },   
    senderName: { type: String, required: true },
    recipientName: { type: String, required: true },
    senderEmail: { type: String, required: true },
    recipientEmail: { type: String, required: true },
    weight: { type: Number, required: true }, 
    cost: { type: Number, required: true },  
    date: { type: Date, default: Date.now },  
    note: { type: String }, 
    feedback: { type: String },
    status: { type: Number, default: 0 },
},{
    timestamp:true
});

module.exports = mongoose.model("Parcel", ParcelSchema);
