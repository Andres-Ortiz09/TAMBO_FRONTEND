import axios from "axios";

const client = axios.create({
  baseURL: "https://tambo-backend.onrender.com/api", 
  headers: {
    "Content-Type": "application/json",
  },
});

export default client;
