// backend/server.js
require("dotenv").config();

const http = require("http");
const mongoose = require("mongoose");
const app = require("./app");
const { initSocket } = require("./sockets/io");

const PORT = Number(process.env.PORT) || 8000;
const DB = process.env.DB;

// Share CORS origins with Socket.IO (comma-separated)
const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

console.log("[server] allowed CORS origins:", allowedOrigins.length ? allowedOrigins : "(none → allow all)");

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);
initSocket(server, allowedOrigins);

// Connect DB, then start server
(async () => {
  try {
    if (!DB) throw new Error("Missing env DB");
    await mongoose.connect(DB);
    console.log("[server] Mongo connected");

    server.listen(PORT, () => {
      console.log(`[server] API listening on ${PORT}`);
    });
  } catch (err) {
    console.error("[server] Startup error:", err);
    process.exit(1);
  }
})();

// Graceful shutdown
const shutdown = (signal) => {
  console.log(`\n[server] ${signal} received. Shutting down...`);
  server.close(async () => {
    console.log("[server] HTTP closed");
    try {
      await mongoose.connection.close(false);
      console.log("[server] Mongo closed");
    } catch (e) {
      console.error("[server] Mongo close error:", e);
    } finally {
      process.exit(0);
    }
  });
  setTimeout(() => process.exit(1), 10_000).unref();
};

["SIGINT", "SIGTERM"].forEach((sig) => process.on(sig, () => shutdown(sig)));
process.on("uncaughtException", (e) => console.error("[server] Uncaught:", e));
process.on("unhandledRejection", (r) => console.error("[server] Unhandled:", r));
