import axios, { Axios } from "axios";

export const axiosServer = new Axios({
  baseURL: import.meta.env.VITE_API_URL,
});
