import axios from "axios";
import { store } from "../redux/store";
import { isTokenValide } from "./token";
import { logout } from "../redux/authSlice";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/admin",
  headers: {
    "Content-Type": "application/json",
  },
});

//Atach token
axiosInstance.interceptors.request.use(
  (request) => {
    const state = store.getState();
    const token = state.auth.token;
    console.log("running request instance");

    if (token && isTokenValide(token)) {
      request.headers.Authorization = `Bearer ${token}`;
    } else {
      store.dispatch(logout());
      localStorage.clear();
    }
    return request;
  },
  (error) => error
);

//unauthorizaed
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      // window.location.href = "/login";
      console.error("Unauthorized - token may have expired");
    }
    return Promise.reject(error);
  }
);
