import { client as customClient } from '@/client/client.gen';

const client = customClient;

// Agregamos un interceptor para manejar el token de acceso
client.instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export { client };