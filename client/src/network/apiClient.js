import axios from 'axios';
import { useMemo } from 'react';

const useApiClient = () => {
  const apiClient = useMemo(() => {
    const instance = axios.create({
      baseURL: 'http://localhost:3000/api/v1', // URL del backend
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Aggiungi interceptor per gestire errori globali
    instance.interceptors.response.use(
      (response) => response.data,
      (error) => {
        console.error('Errore API:', error.response?.data || error.message);
        throw error;
      }
    );

    return instance;
  }, []);

  return apiClient;
};

export default useApiClient;