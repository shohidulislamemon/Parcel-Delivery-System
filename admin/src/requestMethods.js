// src/requestMethods.js
import axios from "axios";

// Map admin host -> API origin (EDIT <API-HOST> to your real API host/IP)
const HOST_MAP = {
  "localhost:5173": "http://localhost:8000",
  "localhost:5174": "http://localhost:8000",
  "admin.excelbd.com:4000": "http://localhost:8000",
  "admin.excelbd.com": "http://<API-HOST>:8000",
};

const HERE = (typeof window !== "undefined" && window.location.host) || "localhost:5173";
export const API_ORIGIN = (HOST_MAP[HERE] || "http://localhost:8000").replace(/\/+$/, "");
export const API_BASE = `${API_ORIGIN}/api/v1`;

export const publicRequest = axios.create({ baseURL: API_BASE });
