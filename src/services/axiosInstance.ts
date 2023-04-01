import axios from "axios";
let baseURL = "https://api.tutoring.sg/api";

const instance = axios.create({
  baseURL,
  withCredentials: true,
});

export default instance;
