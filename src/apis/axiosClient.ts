import { fetchGeoLocation } from "@/utils/geoLocation";
import axios from "axios";

const tokenChannel = new BroadcastChannel("token_channel");

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

let isRefreshing = false;
let refreshSubscribers = <any>[];

const subscribeTokenRefresh = (cb: any) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token: any) => {
  refreshSubscribers.map((cb: any) => cb(token));
};

axiosClient.interceptors.response.use(
  async (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const geoLocationDetails = await fetchGeoLocation();
          const data = JSON.stringify(geoLocationDetails);
          const response = await axiosClient.post("/auth/refreshToken", data);
          if (response.status === 200 && response.data) {
            localStorage.setItem("accessToken", response.data.accessToken);
            originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;

            tokenChannel.postMessage(response.data.accessToken);
            onRefreshed(response.data.accessToken);
            isRefreshing = false;
            refreshSubscribers = [];

            return axiosClient(originalRequest);
          }
        } catch (refreshError) {
          isRefreshing = false;
          console.log("Error refreshing token:", refreshError);
          localStorage.removeItem("accessToken");
          return Promise.reject(refreshError);
        }
      }
      return new Promise((resolve) => {
        subscribeTokenRefresh((token: any) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(axiosClient(originalRequest));
        });
      });
    }
    if (
      error.response &&
      error.response.status === 403 &&
      !originalRequest._retry
    ) {
      console.log("Login session expired:", error);
      originalRequest._retry = true;
      localStorage.removeItem("accessToken");
    }
    return Promise.reject(error);
  }
);

// Listen for token updates from other tabs
tokenChannel.onmessage = (event) => {
  const token = event.data;
  if (token) {
    localStorage.setItem("accessToken", token);
  } else {
    localStorage.removeItem("accessToken");
  }
};

export default axiosClient;
