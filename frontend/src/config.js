import axios from "axios";

const BACKEND_PORT = 3000;
const BACKEND_URL = `http://localhost:${BACKEND_PORT}/api/v1`;
const request = axios.create({withCredentials: true, baseURL: BACKEND_URL})
export { request,BACKEND_URL};