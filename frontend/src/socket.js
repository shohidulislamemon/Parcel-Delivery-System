// src/socket.js
import { io } from "socket.io-client";
import { API_ORIGIN } from "./requestMethods";

export const socket = io(API_ORIGIN, {
  withCredentials: true,
  transports: ["websocket", "polling"],
  autoConnect: false,
});

let identity = null;

/** Call after login (or on app load if user already in Redux) */
export function registerSocket({ email, role = "user" }) {
  identity = { email, role };
  if (!socket.connected) socket.connect();
  if (email) socket.emit("register", { email, role });
}

/** Call on logout */
export function disconnectSocket() {
  identity = null;
  if (socket.connected) socket.disconnect();
}

// Re-register after reconnects
socket.on("connect", () => {
  if (identity?.email) socket.emit("register", identity);
});

// Parcel rooms (detail page)
export function joinParcelRoom(id) {
  const pid = String(id);
  if (socket.connected) socket.emit("joinParcel", pid);
  else socket.once("connect", () => socket.emit("joinParcel", pid));
}
export function leaveParcelRoom(id) {
  if (!socket.connected) return;
  socket.emit("leaveParcel", String(id));
}
