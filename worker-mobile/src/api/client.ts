import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://localhost:5000/api/v1';

export const apiClient = axios.create({ baseURL: BASE_URL });

apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('worker_accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
