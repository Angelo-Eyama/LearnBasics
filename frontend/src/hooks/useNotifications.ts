import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyNotifications, readNotification } from '@/client';
import { toast } from 'sonner';

export function useNotifications() {
    const queryClient = useQueryClient();

    // Query para obtener las notificaciones
    const {
        data: notificationsData,
        isLoading,
        isError,
        error,
        refetch
    } = useQuery({
        queryKey: ['notifications'],
        queryFn: async () => {
            const response = await getMyNotifications();
            if ('data' in response) {
                return response.data; // data -> { notifications: [], total: 0 }
            }
            throw new Error("Error al obtener notificaciones");
        }
    });

    // Función para marcar una notificación como leída
    const toggleNotificationRead = async (notificationId: number) => {
        const response = await readNotification({
            path: {
                notification_id: notificationId,
            }
        });
        if (!('data' in response)) {
            toast.error("Error al cambiar el estado de la notificación");
            throw new Error("Error al cambiar el estado de la notificación");
        }
        return response.data;
    };

    const { mutate: markNotificationAsRead } = useMutation({
        mutationFn: toggleNotificationRead,
        onSuccess: () => {
            // Invalidar la caché para refrescar automáticamente los datos
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
        onError: () => {
            toast.error("Error al marcar la notificación como leída");
        }
    });

    const markAllAsRead = () => {
        const notifications = notificationsData?.notifications || [];
        notifications.forEach((notification) => {
            if (!notification.read) {
                markNotificationAsRead(notification.id);
            }
        });
    };

    return {
        notifications: notificationsData?.notifications || [],
        totalNotifications: notificationsData?.total || 0,
        isLoading,
        isError,
        error,
        refetch,
        markNotificationAsRead,
        markAllAsRead,
    };
}