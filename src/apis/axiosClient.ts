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

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    console.log(error);
    console.log(originalRequest);
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          const { data } = await axiosClient.post("/auth/refresh", {
            refreshToken,
          });
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("refreshToken", data.refreshToken);
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return axiosClient(originalRequest);
        }
      } catch (error) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
