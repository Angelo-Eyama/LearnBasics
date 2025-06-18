"use client"

import { useState } from "react"
import { useAdminReports } from "@/hooks/useAdminReports"
import { Badge } from "@/components/ui/badge"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDate } from "@/utils/utils"
import { ArrowLeft, Eye, Trash, Check } from "lucide-react"
import { Loading } from "@/components/ui/loading"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { ReportRead } from "@/client"

export default function AdminReportsPage() {
    const navigate = useNavigate();
    const { reports, isLoading, isError, deleteReportMutation, readReportMutation } = useAdminReports()
    const [selectedReport, setSelectedReport] = useState<ReportRead | null>(null)
    
    const handleDeleteReport = () => {
        if (!selectedReport) return;
        deleteReportMutation(selectedReport.id)
    }

    const handleReadReport = () => {
        if (!selectedReport) return;
        readReportMutation(selectedReport.id)
    }

    if (isError) {
        return (
            <div className="container mx-auto py-6 px-4">
                <h1 className="text-3xl font-bold mb-4">Error al cargar los reportes</h1>
                <p className="text-red-500">No se pudieron cargar los reportes. Por favor, inténtalo de nuevo más tarde.</p>
                <Button variant="outline">
                    <Link to="/admin">Volver al panel de administración</Link>
                </Button>
            </div>
        )
    }
    if (isLoading) {
        return (
            <div className="container mx-auto py-6 px-4">
                <Loading message="Cargando reportes... Espere un momento" />
            </div>
        )
    }
    if (!reports) return null

    return (
        <div className="container mx-auto py-6 px-4">
            <title>Gestion de reportes</title>
            <div className="flex items-center mb-6">
                <Button variant="ghost" size="sm" className="mr-2" onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Volver
                </Button>
                <h1 className="text-3xl font-bold">Gestión de comentarios</h1>
            </div>
            <div className="mb-6">
                <p className="text-muted-foreground">Gestiona errores reportados por los usuarios</p>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Problema</TableHead>
                        <TableHead>Comentario</TableHead>
                        <TableHead>Fecha de creacion</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-center">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        reports?.map((report) => (
                            <TableRow>
                                <TableCell>
                                    <div className="text-xs text-muted-foreground">
                                        {report.id}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Link to={`/admin/problems/${report.problemID}`} className="text-primary hover:underline max-w-xs truncate">
                                        {report.problemID}
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    <div className="max-w-xs truncate">{report.content}</div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-xs text-muted-foreground">{formatDate(report.timePosted!)}</div>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={report.read ? "default" : "outline"}
                                    >
                                        {report.read ? "Revisado" : "Pendiente"}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="grid grid-cols-3 content-center gap-1">

                                        <Dialog>
                                            <DialogTrigger>
                                                <Button>
                                                    <Eye className="h-1 w-1" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Detalles del reporte</DialogTitle>
                                                    <DialogDescription>
                                                        {report.content}
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <DialogFooter>
                                                    <DialogClose >
                                                        <Button variant="outline">Volver</Button>
                                                    </DialogClose>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                        
                                        <AlertDialog>
                                            <AlertDialogTrigger>
                                                <Button variant="outline" >
                                                    <Trash className="h-1 w-1" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Eliminar reporte</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        ¿Está seguro de querer eliminar este reporte? RECOMENDAMOS guardar para tener un registro activo del avance de la aplicación
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <div className="space-y-4 py-4">
                                                    <div className="space-y-2">
                                                    </div>
                                                </div>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={
                                                            () => {
                                                                setSelectedReport(report)
                                                                handleDeleteReport()
                                                            }
                                                        }
                                                    >
                                                        <Trash className="mr-2 h-4 w-4" />
                                                        Eliminar
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                        
                                        <Button onClick={() => {
                                            setSelectedReport(report)
                                            handleReadReport()
                                        }}>
                                            <Check className="h-1 w-1" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}