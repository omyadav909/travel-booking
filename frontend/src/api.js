import axios from 'axios';

const API = axios.create({
  baseURL: 'https://travel-booking-backend-s6ts.onrender.com'
});

export default API;
