import axios from "axios";

export const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const register = (data) => API.post("/auth/signup", data);
export const login = (data) => API.post("/auth/signin", data);
export const logout = () => API.post("/auth/logout", {}, {
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
});
