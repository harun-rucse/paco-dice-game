import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL,
  withCredentials: true,
  headers: {
    "Content-type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${
      JSON.parse(localStorage.getItem("jwt-token")) || ""
    }`,
  },
});

export default api;
