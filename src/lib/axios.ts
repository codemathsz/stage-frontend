import axios from "axios";
import Cookies from "js-cookie";

export const API = axios.create({
  baseURL: "http://204.48.26.186:8080",
  withCredentials: true,  // Define que as credenciais serão enviadas com as requisições
});

const routesPublics = ["/users/auth"];

API.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");

    const isPublicRoute =
      config.url &&
      routesPublics.some((rota) => {
        if (config.url) {
          return config.url.includes(rota);
        }
      });

    if (!isPublicRoute && token) {
      config.headers = {
        ...config.headers,  // Mantém os headers já existentes
        "Content-Type": "application/json",  // Define o tipo de conteúdo como JSON
        Authorization: `Bearer ${token}`,    // Adiciona o token de autorização
      };
    }

    return config;
  },
  (error) => Promise.reject(error)
);
