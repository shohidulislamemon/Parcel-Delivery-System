// src/requestMethods.js
import axios from "axios";

// Try Vite first, then CRA, then fallback to localhost
const apiFromVite =
  typeof import.meta !== "undefined" &&
  import.meta.env &&
  import.meta.env.VITE_API_BASE_URL;

const apiFromCRA =
  typeof process !== "undefined" &&
  process.env &&
  process.env.REACT_APP_API_URL;

export const API_BASE = (apiFromVite || apiFromCRA || "http://localhost:8000/api/v1")
  .replace(/\/+$/, ""); // trim trailing slash

// For Socket.IO: use the server origin, not /api/v1
export const API_ORIGIN = API_BASE.replace(/\/api\/v\d+$/, "");

export const publicRequest = axios.create({
  baseURL: API_BASE,
});
