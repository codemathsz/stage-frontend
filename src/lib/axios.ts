import axios from "axios";
import Cookies from "js-cookie";

export const API = axios.create({
  baseURL: "http://204.48.26.186:8080",
});

const routesPublics = ["/users/auth"];

API.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");

    const isPublicRoute =
      config.url &&
      routesPublics.some((rota) => {
        if (config.url) {
          config.url.includes(rota);
        }
      });

    if (!isPublicRoute && token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);
