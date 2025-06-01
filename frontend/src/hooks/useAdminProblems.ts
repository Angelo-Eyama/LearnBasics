import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { getProblems, deleteProblem } from "@/client";

export const useAdminProblems = () => {
    const queryClient = useQueryClient();

    const { data: problems, isLoading, isError, error } = useQuery({
        queryKey: ["adminProblems"],
        queryFn: async () => {
            const response = await getProblems();
            if (response.status !== 200 || !("data" in response)) {
                toast.error(`Error ${response.status} al obtener los problemas`);
                throw new Error(`Error ${response.status} al obtener los problemas`);
            }
            return response.data;
        }
    });

    const { mutate: deleteProblemMutation } = useMutation({
        mutationFn: async (problemId: number) => {
            const response = await deleteProblem({ path: { problem_id: problemId } });
            if (response.status !== 200 || !("data" in response)) {
                toast.error(`Error ${response.status}`, {
                    description: Array.isArray(response.error?.detail)
                        ? response.error.detail.map((err: any) => err.msg || JSON.stringify(err)).join(", ")
                        : (response.error?.detail || "Error al eliminar el problema")
                });
                throw new Error(`Error ${response.status} al eliminar el problema`);
            }
            return response.data;
        },
        onSuccess: () => {
            toast.success("Problema eliminado con éxito");
            queryClient.invalidateQueries({ queryKey: ["adminProblems"] });
        },
        onError: () => {
            toast.error("Error al eliminar el problema");
        }
    });

    return {
        problems: problems || [],
        isLoading,
        isError,
        error,
        deleteProblemMutation
    };
}