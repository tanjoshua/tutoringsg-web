import axios from "axios";
let baseURL = process.env.BASE_URL;

const instance = axios.create({
  baseURL,
  withCredentials: true,
});

export default instance;
