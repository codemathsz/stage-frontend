import axios from "axios";

export const API = axios.create({
  baseURL:
    "https://d115-2804-2cac-bb83-7500-c497-c112-efce-8f33.ngrok-free.app/",
  headers: {
    "ngrok-skip-browser-warning": "69420",
  },
});
