// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: import.meta.env.VITE_BASE_API_URL,
//   headers:{
//     "Authorization":`Bearer ${localStorage.getItem('token')}`
//   }
// });

// export default axiosInstance;



import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL,
});

// Add a request interceptor to dynamically set the Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;