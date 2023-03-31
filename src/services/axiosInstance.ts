import axios from "axios";
let baseURL = process.env.BASE_URL
  ? "http://localhost:8000/api"
  : process.env.BASE_URL;

const instance = axios.create({
  baseURL,
  withCredentials: true,
});

export default instance;
