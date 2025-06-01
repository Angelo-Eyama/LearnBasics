import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getUsers, deleteUser, changeUserStatus } from "@/client";
import { toast } from "sonner";

export const useAdminUsers = () => {
    const queryClient = useQueryClient();

    const { data: users, isLoading, isError, error } = useQuery({
        queryKey: ["adminUsers"],
        queryFn: async () => {
            const response = await getUsers();
            if (response.status !== 200 || !("data" in response)) {
                toast.error(`Error ${response.status} al obtener los usuarios`)
                throw new Error(`{Error ${response.status} al obtener los usuarios}`);
            }
            return response.data;
        }
    })

    const { mutate: deleteUserMutation } = useMutation({
        mutationFn: async (userId: number) => {
            const response = await deleteUser({
                path: {
                    user_id: userId
                }
            })
            if (response.status !== 200 || !("data" in response)) {
                toast.error(`Error ${response.status}`, {
                    description: Array.isArray(response.error?.detail)
                        ? response.error.detail.map((err: any) => err.msg || JSON.stringify(err)).join(", ")
                        : (response.error?.detail || "Error al eliminar el usuario")
                })
                throw new Error(`Error ${response.status} al eliminar el usuario`)
            }
            return response.data;
        },
        onSuccess: () => {
            toast.success("Usuario eliminado con éxito")
            queryClient.invalidateQueries({ queryKey: ["adminUsers"] })
            queryClient.invalidateQueries({ queryKey: ["currentUser"] })
        },
        onError: () => {
            toast.error("Error al eliminar el usuario")
        }
    })

    const { mutate: chageUserStatusMutation } = useMutation({
        mutationFn: async (userId: number) => {
            const response = await changeUserStatus({
                path: { user_id: userId }
            })

            if (response.status !== 200 || !("data" in response)) {
                toast.error(`Error ${response.status}`, {
                    description: Array.isArray(response.error?.detail)
                        ? response.error.detail.map((err: any) => err.msg || JSON.stringify(err)).join(", ")
                        : (response.error?.detail || "Error al cambiar el estado del usuario")
                })
                throw new Error(`Error ${response.status} al cambiar el estado del usuario`)
            }
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["adminUsers"] })
            toast.success("Estado del usuario cambiado con éxito")
        },
        onError: () => {
            toast.error("Error al cambiar el estado del usuario")
        }
    })

    return {
        users: users?.users || [],
        totalUsers: users?.total || 0,
        isLoading,
        isError,
        error,
        deleteUser: deleteUserMutation,
        changeUserStatus: chageUserStatusMutation
    }
}
export default useAdminUsers;