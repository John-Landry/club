import axios from "axios"
import { ACCESS_TOKEN } from "./constants"
// I'm gonna use Axios to send Network requests.
// I'm gonna write an interceptor , this will Intercept messages I'm sending and attach the correct headers
const api = axios.create({
  // This lets me change the URL in .env.
  baseURL: import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : apiUrl,
});
//  it will check if the message has an access token and if so, it will attach it and send it

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;