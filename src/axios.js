import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:4004'
});

instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      console.log("Token in axios interceptor:", token);
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      console.log("Request config:", config.headers)
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

export default instance; 