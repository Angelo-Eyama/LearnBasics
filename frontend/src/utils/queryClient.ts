// queryClient.js
import { QueryClient } from '@tanstack/react-query';
import apiClient from './apiClient';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            queryFn: async ({ queryKey, signal }) => {
                const [endpoint, params] = Array.isArray(queryKey) ? queryKey : [queryKey];
                const { data } = await apiClient.get(endpoint, {
                    params,
                    signal // Para cancelación de peticiones
                });
                return data;
            },
            retry: (failureCount, error) => {
                // No reintentar en errores 401 (no autorizado)
                if (error.response?.status === 401) return false;
                return failureCount < 3;
            }
        },
        mutations: {
            mutationFn: async (variables) => {
                const { endpoint, method = 'POST', ...data } = variables;

                switch (method.toUpperCase()) {
                    case 'POST':
                        return (await apiClient.post(endpoint, data)).data;
                    case 'PUT':
                        return (await apiClient.put(endpoint, data)).data;
                    case 'PATCH':
                        return (await apiClient.patch(endpoint, data)).data;
                    case 'DELETE':
                        return (await apiClient.delete(endpoint, { data })).data;
                    default:
                        throw new Error(`Método HTTP no soportado: ${method}`);
                }
            }
        }
    }
});

export default queryClient;