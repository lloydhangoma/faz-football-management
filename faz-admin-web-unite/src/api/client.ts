import axios from "axios";
const baseURL = (import.meta.env.VITE_API_URL || "/api").replace(/\/+$/, "");
export const API = axios.create({
  baseURL,
  withCredentials: true
});
