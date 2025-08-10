// backend/app.js
const express = require("express");
const cors = require("cors");

const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const parcelRoute = require("./routes/parcel");
const deliveryAgentRoute = require("./routes/deliveryAgent");

const app = express();

// ------- CORS (env or sane defaults) -------
const DEFAULT_ALLOWED = [
  "http://admin.excelbd.com:4000",
  "http://localhost:5173",
  "http://localhost:5174",
];

const allowedOrigins = (process.env.CORS_ORIGINS || DEFAULT_ALLOWED.join(","))
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

// if behind proxy (nginx/render/heroku)
app.set("trust proxy", 1);

// use a function so we can allow only known origins + allow server-to-server (no Origin)
const corsOptions = {
  origin(origin, cb) {
    if (!origin) return cb(null, true); // curl/Postman/server-to-server
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error(`CORS: origin not allowed -> ${origin}`));
  },
  credentials: true, // set true only if you use cookies/sessions
};

// CORS must come BEFORE routes
app.use(cors(corsOptions));
// Preflight for all routes
// app.options("/.*/", cors(corsOptions));

app.use(express.json());

// Health
app.get("/healthz", (req, res) => res.status(200).json({ ok: true }));

// // API routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/parcels", parcelRoute);
app.use("/api/v1/delivery-agents", deliveryAgentRoute);

// 404
app.use((req, res) => res.status(404).json({ error: "Not Found" }));

// Error handler (keeps CORS headers from above)
app.use((err, req, res, next) => {
  console.error("[app] Error:", err?.message || err);
  res.status(500).json({ error: err?.message || "Server error" });
});

module.exports = app;
