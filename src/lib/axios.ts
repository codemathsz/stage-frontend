import axios from "axios";

export const API = axios.create({
  baseURL:
    "https://95be-2804-2cac-bb83-7500-d8ac-d66f-edb2-3fc8.ngrok-free.app/",

  headers: {
    "ngrok-skip-browser-warning": "69420",
  },
});
