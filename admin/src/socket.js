// src/socket.js
import { io } from "socket.io-client";
import { API_ORIGIN } from "./requestMethods";

export const socket = io(API_ORIGIN, {
  withCredentials: true,
  transports: ["websocket", "polling"],
  autoConnect: false, // we'll connect after we know who we are
});

// Call once you know the user's email/role (admin)
export function connectAndRegister({ email, role = "admin" } = {}) {
  if (!socket.connected) socket.connect();
  if (email) socket.emit("register", { email, role });
}

export function joinParcelRoom(parcelId) {
  if (!parcelId) return;
  if (socket.connected) socket.emit("joinParcel", String(parcelId));
  else socket.once("connect", () => socket.emit("joinParcel", String(parcelId)));
}

export function leaveParcelRoom(parcelId) {
  if (!parcelId || !socket.connected) return;
  socket.emit("leaveParcel", String(parcelId));
}
