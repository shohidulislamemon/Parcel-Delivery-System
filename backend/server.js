const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors")
const mongoose = require("mongoose");
const authRoute=require("./routes/auth.js");
const userRoute=require("./routes/user.js");
const parcelRoute=require("./routes/parcel.js");

dotenv.config();
const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// ROUTES

app.use("/api/v1/auth",authRoute);
app.use("/api/v1/users",userRoute);
app.use("/api/v1/parcels",parcelRoute)



//DATABASE CONNECTION
const DB = process.env.DB;
mongoose.connect(DB).then(() => {
    console.log("Database connection is successful");
}).catch((err)=>{
    console.log(err)
})


//SERVER
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});