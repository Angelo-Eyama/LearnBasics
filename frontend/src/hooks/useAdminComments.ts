import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { getComments, deleteComment, changeCommentApproval } from "@/client";


export const useAdminComments = () => {
    const queryClient = useQueryClient();

    const { data: comments, isLoading, isError } = useQuery({
        queryKey: ["adminComments"],
        queryFn: async () => {
            const response = await getComments();
            if (response.status !== 200 || !("data" in response)) {
                toast.error(`Error ${response.status} al obtener los comentarios`);
                throw new Error(`Error ${response.status} al obtener los comentarios`);
            }
            return response.data;
        },
    })

    const { mutate: deleteCommmentMutation } = useMutation({
        mutationFn: async (commentId: number) => {
            const response = await deleteComment({ path: { comment_id: commentId}})
            if (response.status !== 200 || !("data" in response)) {
                toast.error(`Error ${response.status}`, {
                    description: Array.isArray(response.error?.detail)
                        ? response.error.detail.map((err: any) => err.msg || JSON.stringify(err)).join(", ")
                        : (response.error?.detail || "Error al eliminar el comentario")
                });
                throw new Error(`Error ${response.status} al eliminar el comentario`);
            }
            return response.data;
        },
        onSuccess: () => {
            toast.success("Comentario eliminado con éxito");
            queryClient.invalidateQueries({ queryKey: ["adminComments"] });
        },
    })

    const { mutate: changeCommentApprovalMutation } = useMutation({
        mutationFn: async (commentId: number) => {
            const response = await changeCommentApproval({ path: { comment_id: commentId } });
            if (response.status !== 200 || !("data" in response)) {
                toast.error(`Error ${response.status}`, {
                    description: Array.isArray(response.error?.detail)
                        ? response.error.detail.map((err: any) => err.msg || JSON.stringify(err)).join(", ")
                        : (response.error?.detail || "Error al cambiar la aprobación del comentario")
                });
                throw new Error(`Error ${response.status} al cambiar la aprobación del comentario`);
            }
            return response.data;
        },
        onSuccess: () => {
            toast.success("Aprobación del comentario cambiada con éxito");
            queryClient.invalidateQueries({ queryKey: ["adminComments"] });
        },
        onError: () => {
            toast.error("Error al cambiar la aprobación del comentario");
        }
    })

    return {
        comments: comments?.comments || [],
        isLoading,
        isError,
        deleteComment: deleteCommmentMutation,
        changeCommentApproval: changeCommentApprovalMutation
    }
}