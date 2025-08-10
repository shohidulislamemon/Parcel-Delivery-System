// backend/sockets/io.js
const { Server } = require("socket.io");

let io;

function initSocket(httpServer, allowedOrigins = []) {
  io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins.length ? allowedOrigins : "*",
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });

  io.on("connection", (socket) => {
    socket.on("register", ({ email, role }) => {
      const em = String(email || "").toLowerCase().trim();
      const r = String(role || "").toLowerCase().trim();
      if (!em) return;

      if (socket.data?.email) {
        socket.leave(`email:${socket.data.email}`);
        socket.leave(`agent:${socket.data.email}`);
        socket.leave("admins");
      }

      socket.data = { email: em, role: r };

      // Customer/user room
      socket.join(`email:${em}`);

      // Delivery agent room
      if (r.includes("agent")) {
        socket.join(`agent:${em}`);
      }

      // OPTIONAL: Admins broadcast room (use io.to("admins") on emits)
      if (r === "admin") {
        socket.join("admins");
      }
    });

    // Join a specific parcel room (detail page)
    socket.on("joinParcel", (parcelId) => {
      if (!parcelId) return;
      socket.join(`parcel:${String(parcelId)}`);
    });

    // Leave a specific parcel room when page unmounts
    socket.on("leaveParcel", (parcelId) => {
      if (!parcelId) return;
      socket.leave(`parcel:${String(parcelId)}`);
    });

    socket.on("disconnect", () => {
      // Rooms are auto-cleaned; nothing required here
    });
  });

  return io;
}

function getIO() {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
}

module.exports = { initSocket, getIO };
