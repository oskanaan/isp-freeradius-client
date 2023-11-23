import axios from 'axios';
import { API_CONFIG } from './config';
import store from "@/store"; // Adjust the import path as necessary

const http = axios.create({
  baseURL: API_CONFIG.baseURL
});

http.interceptors.request.use(request => {
  const token = localStorage.getItem("jwt");

  if (token) {
    request.headers["Authorization"] = `Bearer ${token}`;
  }
  return request;
}, (error) => {
  return Promise.reject(error);
});

http.interceptors.response.use(
response => {
  return response
},
error => {
  if (error.code === "ERR_NETWORK") {
    store.state.errorMessage = "Cannot connect to the radius server, try to refresh after a while."
    store.dispatch('toggleFailureSnackbar');
  } else {
    throw error
  }
})

export default http