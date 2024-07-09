import { fetchGeoLocation } from "@/utils/geoLocation";
import axios from "axios";

const axiosClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_SERVER_URL}:${process.env.NEXT_PUBLIC_SERVER_PORT}/${process.env.NEXT_PUBLIC_VERSION}`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
  withCredentials: true,
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

var checkVar = 0;

axiosClient.interceptors.response.use(
  async (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    console.log(error);
    checkVar += 1;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      if (checkVar <= 2) {
        try {
          const geoLocationDetails = await fetchGeoLocation();
          const data = JSON.stringify(geoLocationDetails);
          const response = await axiosClient.post("/auth/refreshToken", data);
          if (response.status === 200 && response.data) {
            localStorage.setItem("accessToken", response.data.accessToken);
            originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
            return axiosClient(originalRequest);
          }
        } catch (error) {
          console.log("Error refreshing token:", error);
          localStorage.removeItem("accessToken");
          window.location.href = "/account/login";
          return Promise.reject(error);
        }
      }
    }
    if (
      error.response &&
      error.response.status === 403 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      localStorage.removeItem("accessToken");
      window.location.href = "/account/login";
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
