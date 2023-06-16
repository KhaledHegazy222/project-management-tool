import axios from "axios";

export const axiosServer = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
