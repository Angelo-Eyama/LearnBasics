"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Link } from "react-router-dom"
import { Eye, Edit, Mail, Award, FileCode, Bell, CheckCircle, CircleX, Trash } from "lucide-react"
import { FaGithub } from "react-icons/fa";
import useAuth from "@/hooks/useAuth"
import { parseServerString, decideRank, formatDate, getDiceBearAvatar } from "@/utils/utils"
import { useNotifications } from "@/hooks/useNotifications"
import { useMutation, useQuery } from "@tanstack/react-query"
import { getMySubmissions, SubmissionRead, deleteMySubmission } from "@/client"
import { toast } from "sonner"

export default function ProfilePage() {
    const { user: userData } = useAuth()
    const {
        notifications,
        markNotificationAsRead,
        markAllAsRead,
    } = useNotifications()
    const [notificationsTab, setNotificationsTab] = useState("all")
    const [selectedSubmission, setSelectedSubmission] = useState<(SubmissionRead)>()

    // Query para obtener las entregas del usuario
    const {
        data: userSubmissions,
    } = useQuery({
        queryKey: ['submissions'],
        queryFn: async () => {
            const response = await getMySubmissions()
            if (response.status !== 200 || !response.data) {
                toast.error("Error al obtener las entregas")
                throw new Error("Error al obtener las entregas")
            }
            return response.data
        },
    })

    // Mutacion para eliminar una entrega
    const deleteSubmissionMutation = useMutation({
        mutationFn: async (submissionId: number) => {
            const response = await deleteMySubmission({path: {submission_id: submissionId}})
            if (response.status !== 200 || !("data" in response)) {
                toast.error(`Error ${response.status}`, {
                    description: Array.isArray(response.error?.detail)
                        ? response.error.detail.map((err: any) => err.msg || JSON.stringify(err)).join(", ")
                        : (response.error?.detail || "Error al eliminar la entrega")
                })
                throw new Error(`Error ${response.status} al eliminar la entrega`)
            }
            toast.success("Entrega eliminada correctamente")
            return response.data
        }
    })

    if (!userData) return null
    const handleToggleRead = (notificationId: number) => {
        markNotificationAsRead(notificationId)
    }

    const filteredNotifications = notifications.filter((notification) => {
        if (notificationsTab === "all") return true
        if (notificationsTab === "unread") return !notification.read
        if (notificationsTab === "read") return notification.read
        return true
    })
    return (
        <div className="container mx-auto py-6 px-4">
            <title>Mi perfil</title>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Mi perfil</h1>
                <Button asChild>
                    <Link to="/edit-profile">
                        <Edit className="mr-2 h-4 w-4" />
                        Editar perfil
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-1">
                    <CardHeader className="flex flex-col items-center text-center">
                        <Avatar className="h-24 w-24 mb-4 border-2 border-primary">
                            <AvatarImage src={getDiceBearAvatar(userData.username)} alt={userData.username} />
                            <AvatarFallback>{userData?.username?.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <CardTitle>{`${userData?.firstName} ${userData?.lastName}`}</CardTitle>
                        <CardDescription>@{userData?.username}</CardDescription>
                        <div className="flex gap-2 mt-2">
                            <Badge className="mt-2">{decideRank(userData?.score)}</Badge>
                            {userData?.isVerified ? (
                                <Badge variant="default" className="mt-2 flex items-center gap-1 bg-green-500">
                                    <CheckCircle className="h-3 w-3" />
                                    Verificado
                                </Badge>
                            )
                                :
                                (
                                    <Badge variant="destructive" className="mt-2 flex items-center gap-1">
                                        <CircleX className="h-3 w-3" />
                                        No Verificado
                                    </Badge>
                                )
                            }
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center">
                            <Mail className="mr-2 h-4 w-4 opacity-70" />
                            <span>{userData?.email}</span>
                        </div>

                        {userData?.github && (
                            <div className="flex items-center">
                                <FaGithub className="mr-2 h-4 w-4 opacity-70" />
                                <a
                                    href={`${userData.github}`}
                                    target="_blank"
                                    className="text-primary hover:underline"
                                >
                                    {userData?.github.split("/").pop()}
                                </a>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Sobre mi</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>{userData?.bio || "Sin descripcion"}</p>
                            <div className="mt-4">
                                <h3 className="leading-none font-semibold mb-2">Habilidades</h3>
                                <div className="flex flex-wrap gap-2">
                                    {parseServerString(userData?.skills).map((skill) => (
                                        <Badge key={skill} variant="secondary">
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Estadisticas</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                                    <Award className="h-8 w-8 mb-2 text-primary" />
                                    <span className="text-2xl font-bold">{decideRank(userData.score)}</span>
                                    <span className="text-sm text-muted-foreground">Rango actual</span>
                                    <span className="text-sm text-muted-foreground">{userData.score} puntos</span>
                                </div>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <div className="flex flex-col items-center p-4 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors">
                                            <FileCode className="h-8 w-8 mb-2 text-primary" />
                                            <span className="text-2xl font-bold">{userSubmissions?.total}</span>
                                            <span className="text-sm text-muted-foreground">Total de entregas</span>
                                        </div>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="min-w-3xl max-w-6xl w-[95vw] overflow-hidden">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Historial de entregas</AlertDialogTitle>
                                        </AlertDialogHeader>

                                        <div className="overflow-x-auto w-full">
                                            <Table className="w-full min-w-[700px]">
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Problema</TableHead>
                                                        <TableHead>Lenguaje</TableHead>
                                                        <TableHead>Estado</TableHead>
                                                        <TableHead>Entregado</TableHead>
                                                        <TableHead className="text-center">Acciones</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {userSubmissions?.submissions.map((submission) => (
                                                        <TableRow key={submission.id}>
                                                            <TableCell>
                                                                <Link
                                                                    to={`/problems/${submission.problemID}`}
                                                                    className="text-primary hover:underline"
                                                                >
                                                                    {submission?.problem?.title || 'Sin título'}
                                                                </Link>
                                                            </TableCell>
                                                            <TableCell>{submission.language}</TableCell>
                                                            <TableCell>
                                                                <Badge
                                                                    variant={
                                                                        submission.status === "Correcto"
                                                                            ? "outline"
                                                                            : submission.status === "Incorrecto"
                                                                                ? "destructive"
                                                                                : "secondary"
                                                                    }
                                                                    className={submission.status === "Correcto" ? "bg-green-400" : submission.status === "Incorrecto" ? "bg-red-400" : ""}
                                                                >
                                                                    {submission.status}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell>{formatDate(submission.timeSubmitted)}</TableCell>
                                                            <TableCell className="text-right">
                                                                <Button variant="outline" size="sm" onClick={() => setSelectedSubmission(submission)} className="mx-2">
                                                                    <Eye className="h-4 w-4 mx-1" />
                                                                    Ver
                                                                </Button>
                                                                <Button variant="destructive" size="sm" onClick={() => deleteSubmissionMutation.mutateAsync(submission.id)}>
                                                                    <Trash className="h-4 w-4 ml-1" />
                                                                    Eliminar
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cerrar</AlertDialogCancel>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>

                                {selectedSubmission && (
                                    <AlertDialog
                                        open={!!selectedSubmission}
                                        onOpenChange={(open) => !open && setSelectedSubmission(undefined)}
                                    >
                                        <AlertDialogContent className="max-w-4xl">
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Detalles de entregas</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    {selectedSubmission?.problem?.title || 'Sin título'} - {formatDate(selectedSubmission.timeSubmitted)}
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <p className="text-sm font-medium">Estado</p>
                                                        <Badge
                                                            variant={
                                                                selectedSubmission.status === "Accepted"
                                                                    ? "outline"
                                                                    : selectedSubmission.status === "Incorrecto"
                                                                        ? "destructive"
                                                                        : "secondary"
                                                            }
                                                            className="mt-1"
                                                        >
                                                            {selectedSubmission.status}
                                                        </Badge>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">Lenguaje</p>
                                                        <Badge className="mt-1" variant={"outline"}>
                                                            {selectedSubmission.language}
                                                        </Badge>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">Tests</p>
                                                        {selectedSubmission.passed_tests} / {selectedSubmission.total_tests}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">Tiempo de ejecucion</p>
                                                        {selectedSubmission.execution_time} s
                                                    </div>
                                                </div>

                                                <div>
                                                    <p className="text-sm font-medium mb-2">Codigo</p>
                                                    <div className="bg-muted p-4 rounded-md overflow-auto max-h-[400px] whitespace-pre-wrap">
                                                        {selectedSubmission.code}
                                                    </div>
                                                </div>
                                                {
                                                    selectedSubmission.suggestions &&
                                                    <div>
                                                        <p className="text-sm font-medium mb-2">Sugerencias</p>
                                                        <div className="bg-muted p-4 rounded-md overflow-auto max-h-[400px] whitespace-pre-line">
                                                            {selectedSubmission.suggestions}
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cerrar</AlertDialogCancel>
                                                <AlertDialogAction asChild>
                                                    <Link to={`/problems/${selectedSubmission.problemID}`}>Ir al problema</Link>
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notificaciones */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center">
                                <Bell className="h-5 w-5 mr-2" />
                                Notificaciones
                            </CardTitle>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={markAllAsRead}
                                disabled={!notifications.some((n) => !n.read)}
                            >
                                Marcar todas como leidas
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="all" value={notificationsTab} onValueChange={setNotificationsTab}>
                                <TabsList className="mb-4">
                                    <TabsTrigger value="all">Todas</TabsTrigger>
                                    <TabsTrigger value="unread">
                                        No leídas
                                        {notifications.filter((n) => !n.read).length > 0 && (
                                            <Badge variant="secondary" className="ml-2">
                                                {notifications.filter((n) => !n.read).length}
                                            </Badge>
                                        )}
                                    </TabsTrigger>
                                    <TabsTrigger value="read">Leídas</TabsTrigger>
                                </TabsList>

                                <div className="space-y-4">
                                    {filteredNotifications.length > 0 ? (
                                        filteredNotifications.map((notification) => (
                                            <div
                                                key={notification.id}
                                                className={`p-4 border rounded-lg ${!notification.read ? "bg-muted/50 border-primary/20" : ""}`}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="font-medium">{notification.title}</h4>
                                                        <p className="text-sm text-muted-foreground mt-1">{notification.description}</p>
                                                    </div>
                                                    {!notification.read && (
                                                        <Button variant="ghost" size="sm" onClick={() => handleToggleRead(notification.id)}>
                                                            Marcar como leída
                                                        </Button>
                                                    )}
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-2">{formatDate(notification.timePosted)}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-muted-foreground">No hay notificaciones</div>
                                    )}
                                </div>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
