import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Attach JWT to all requests
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");
    if (token) {
      // Make sure to include "Bearer "
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
