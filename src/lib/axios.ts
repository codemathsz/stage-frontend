import axios from "axios";
import Cookies from "js-cookie";

const token = Cookies.get("token");
export const API = axios.create({
  baseURL: "http://204.48.26.186:8080",
  headers: { Authorization: `Bearer ${token}` },
});
