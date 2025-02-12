import axios from "axios";

export const API = axios.create({
  baseURL:
    "https://abae-2804-2cac-bb83-7500-c093-20f3-c18-8d12.ngrok-free.app/",
  headers: {
    "ngrok-skip-browser-warning": "69420",
  },
});
