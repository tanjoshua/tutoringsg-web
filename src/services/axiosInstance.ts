import axios from "axios";
let baseURL =
  "http://http://tutoringsgserver-env.eba-hzvzecp2.ap-southeast-1.elasticbeanstalk.com/api";

const instance = axios.create({
  baseURL,
  withCredentials: true,
});

export default instance;
