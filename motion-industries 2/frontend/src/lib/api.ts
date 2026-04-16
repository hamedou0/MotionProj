import axios from "axios";
import { getToken } from "./auth";

//single configued Axios instance shared across the whole app
const api = axios.create({
    baseURL: '/api',
    headers: { 'Content-Type': 'application/json'}
})

//runs automatically before every request made through this instance 
api.interceptors.request.use(config => {
    const token = getToken();
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

export default api;