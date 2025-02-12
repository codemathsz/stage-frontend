import axios from "axios";

export const API = axios.create({
  baseURL:
    "http://localhost:8080/",
  headers: {
    "ngrok-skip-browser-warning": "69420",
  },
});
