
import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:8080/api", // ajusta según tu backend
  headers: {
    "Content-Type": "application/json",
  },
});

export default client;
