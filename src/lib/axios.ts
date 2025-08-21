import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});


export default instance;