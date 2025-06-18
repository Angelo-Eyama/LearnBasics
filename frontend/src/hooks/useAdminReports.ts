import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { getReports, deleteReport, readReport } from "@/client";

export const useAdminReports = () => {
    const queryClient = useQueryClient();

    const { data: reports, isLoading, isError } = useQuery({
        queryKey: ["adminReports"],
        queryFn: async () => {
            const response = await getReports();
            if (response.status !== 200 || !("data" in response)) {
                toast.error(`Error ${response.status} al obtener los reportes`);
                throw new Error(`Error ${response.status} al obtener los reportes`);
            }
            return response.data;
        },
    });

    const { mutate: deleteReportMutation } = useMutation({
        mutationFn: async (reportId: number) => {
            const response = await deleteReport({ path: { report_id: reportId } });
            if (response.status !== 200 || !("data" in response)) {
                toast.error(`Error ${response.status}`, {
                    description: Array.isArray(response.error?.detail)
                        ? response.error.detail.map((err: any) => err.msg || JSON.stringify(err)).join(", ")
                        : (response.error?.detail || "Error al eliminar el reporte")
                });
                throw new Error(`Error ${response.status} al eliminar el reporte`);
            }
            return response.data;
        },
        onSuccess: () => {
            toast.success("Reporte eliminado con éxito");
            queryClient.invalidateQueries({ queryKey: ["adminReports"] });
        },
    });

    const { mutate: readReportMutation } = useMutation({
        mutationFn: async (reportId: number) => {
            const response = await readReport({ path: { report_id: reportId }} );
            if (response.status !== 200 || !("data" in response)) {
                toast.error(`Error ${response.status}`, {
                    description: Array.isArray(response.error?.detail)
                        ? response.error.detail.map((err: any) => err.msg || JSON.stringify(err)).join(", ")
                        : (response.error?.detail || "Error al marcar el reporte como leído")
                });
                throw new Error(`Error ${response.status} al marcar el reporte como leído`);
            }
            return response.data;
        },
        onSuccess: () => {
            toast.success("Reporte leído");
            queryClient.invalidateQueries({ queryKey: ["adminReports"] });
        }
    });

    return {
        reports,
        isLoading,
        isError,
        deleteReportMutation,
        readReportMutation
    };
}
