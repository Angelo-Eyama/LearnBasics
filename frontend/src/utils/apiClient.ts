// apiClient.js
import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8000',
});

// Interceptor para añadir el token
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Manejo centralizado de errores
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Puedes manejar la expiración del token aquí
            console.error('Token inválido o expirado');
            // Opcional: redirigir a login
        }
        return Promise.reject(error);
    }
);

export default apiClient;