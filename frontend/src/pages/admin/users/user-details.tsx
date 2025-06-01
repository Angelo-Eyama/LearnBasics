"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import { ArrowLeft, Save, Ban, CheckCircle, CircleX, Bell, Send } from "lucide-react"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"
import { useParams } from "react-router-dom"
import { createNotification, getUserById, UserRead, assignRole, verifyUser, revokeRole, changeUserStatus, updateUser, UserUpdate } from "@/client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import NotFound from "@/pages/public/not-found"
import BadgeClosable from "@/components/ui/badge-closable"
import { formatDate, getHighestRole } from "@/utils/utils"
import { Loading } from "@/components/ui/loading"


export default function UserDetailPage() {
    const { id } = useParams<{ id: string }>()
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    // Query para obtener los datos del usuario seleccionado
    const { data: user, isLoading, isError } = useQuery({
        queryKey: ["adminUsers", id],

        queryFn: async () => {
            if (!id) throw new Error("ID de usuario no proporcionado");
            const response = await getUserById({
                path: { user_id: parseInt(id) }
            });
            if (response.status !== 200 || !("data" in response)) {
                throw new Error(`Error ${response.status} al obtener el usuario`);
            }
            return response.data;
        },
        enabled: !!id,
        retry: false
    })

    // Estado local para almacenar los datos del formulario del usuario
    const [formData, setFormData] = useState<UserRead>(
        {
            id: 0,
            username: "",
            firstName: "",
            lastName: "",
            email: "",
            creationDate: "",
            roles: [],
            active: true,
            isVerified: false,
            score: 0,
            bio: "",
        }
    )

    // Estado para la notificación
    const [notificationTitle, setNotificationTitle] = useState("")
    const [notificationMessage, setNotificationMessage] = useState("")
    // Inicializar el formulario con los datos del usuario
    useEffect(() => {
        if (user) {
            setFormData({
                id: user.id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                creationDate: user.creationDate,
                roles: user.roles || [],
                active: user.active,
                isVerified: user.isVerified,
                score: user.score || 0,
                bio: user.bio || "",
            })
        }
    }, [user]);

    // Mutaciones con React Query
    const updateUserMutation = useMutation({
        mutationFn: async (updatedData: UserUpdate) => {
            updateUser({
                body: updatedData,
                path: { user_id: parseInt(id!) }
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["adminUsers", id] })
            toast.success("Usuario actualizado correctamente")
        },
    })

    const assignRoleMutation = useMutation({
        mutationFn: async (roleName: string) => {
            await assignRole({
                path: {
                    user_id: parseInt(id!),
                    role_name: roleName,
                }
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["adminUsers", id] })
            toast.success("Rol asignado correctamente")
        },
        onError: (error) => {
            console.error("Error al asignar el rol:", error)
            toast.error("Error al asignar el rol")
        }
    })

    const revokeRoleMutation = useMutation({
        mutationFn: async (roleName: string) => {
            await revokeRole({
                path: {
                    user_id: parseInt(id!),
                    role_name: roleName,
                }
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["adminUsers", id] })
            toast.success("Rol revocado correctamente")
        },
        onError: (error) => {
            console.error("Error al revocar el rol:", error)
            toast.error("Error al revocar el rol")
        }
    })

    const changeStatusMutation = useMutation({
        mutationFn: async () => {
            await changeUserStatus({
                path: { user_id: parseInt(id!) }
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["adminUsers", id] })
            toast.success("Estado del usuario actualizado correctamente")
        },
        onError: (error) => {
            console.error("Error al cambiar el estado del usuario:", error)
            toast.error("Error al cambiar el estado del usuario")
        }
    })

    const verifyUserMutation = useMutation({
        mutationFn: async () => {
            const response = await verifyUser({
                path: { user_id: parseInt(id!) }
            })
            if (response.status !== 200) {
                toast.error("Error al verificar el usuario")
                throw new Error(`Error ${response.status} al verificar el usuario`)
            }
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["adminUsers", id] })
            toast.success("Usuario verificado correctamente")
        }
    })

    const sendNotificationMutation = useMutation({
        mutationFn: async ({ title, description }: { title: string, description: string }) => {
            await createNotification({
                body: {
                    title,
                    description,
                    userID: parseInt(id!),
                    read: false,
                },
            })
        },
        onSuccess: () => {
            toast.success("Notificación enviada correctamente")
        },
        onError: (error) => {
            console.error("Error al enviar la notificación:", error)
            toast.error("Error al enviar la notificación")
        }
    })

    if (!user) return <NotFound />;

    // Handlers para los cambios
    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        updateUserMutation.mutateAsync(formData)
    }

    const handleAssignRole = (roleName: string) => {
        assignRoleMutation.mutateAsync(roleName)
        setFormData((prev) => ({
            ...prev,
            roles: [...prev.roles, { name: roleName }]
        }))
    }

    const handleRevokeRole = (roleName: string) => {
        revokeRoleMutation.mutateAsync(roleName)
        setFormData((prev) => ({
            ...prev,
            roles: prev.roles.filter(role => role.name !== roleName)
        }))
    }

    const handleVerifyUser = () => {
        verifyUserMutation.mutateAsync()
        setFormData((prev) => ({ ...prev, isVerified: true }))
    }

    const handleToggleStatus = () => {
        changeStatusMutation.mutateAsync()
        setFormData((prev) => ({ ...prev, active: !prev.active }))
    }

    const handleSendNotification = () => {
        if (!notificationMessage.trim() || !notificationTitle.trim()) {
            toast.error("Mensaje vacío", {
                description: "Por favor, completa los campos antes de enviar la notificación.",
            })
            return
        }
        sendNotificationMutation.mutateAsync({
            title: notificationTitle,
            description: notificationMessage,
        })
    }

    // Estados de carga y error
    if (!id || isError) return <NotFound />
    if (isLoading) return <Loading />
    if (!user) return <NotFound />

    return (
        <div className="container mx-auto py-6 px-4">
            <title>{user.username}</title>
            <div className="flex items-center mb-6">
                <Button variant="ghost" size="sm" className="mr-2" onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Volver
                </Button>
                <h1 className="text-3xl font-bold">Detalles de usuario</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-1">
                    <CardHeader className="flex flex-col items-center text-center">
                        <Avatar className="h-24 w-24 mb-4">
                            <AvatarFallback>{formData.username.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <CardTitle>{formData.username}</CardTitle>
                        <CardDescription>{formData.email}</CardDescription>
                        <div className="flex space-x-2 mt-2">
                            <Badge
                                variant={
                                    getHighestRole(formData.roles) === "Administrador" ? "default" : getHighestRole(user.roles) === "Moderador" ? "outline" : "secondary"
                                }
                            >
                                {getHighestRole(formData.roles)}
                            </Badge>
                            <Badge variant={formData.active === true ? "default" : "destructive"}>{user.active ? "Desbloqueado" : "Bloqueado"}</Badge>

                            {formData.isVerified ? (
                                <Badge variant="default" className="flex items-center gap-1 bg-green-500">
                                    <CheckCircle className="h-3 w-3" />
                                    Verificado
                                </Badge>
                            ) : (
                                <Badge variant="outline" className="flex items-center gap-1">
                                    <CircleX className="h-3 w-3" />
                                    No verificado
                                </Badge>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <span className="text-sm text-muted-foreground">Registrado desde</span>
                                <span>{formatDate(formData.creationDate)}</span>
                            </div>
                        </div>
                        <div className="pt-4 border-t">
                            <h3 className="font-medium mb-2">Acciones rápidas</h3>
                            <div className="flex flex-col space-y-2">
                                <Button variant="outline" className="justify-start cursor-pointer hover:bg-amber-800" onClick={handleToggleStatus}>
                                    <Ban className="mr-2 h-4 w-4" />
                                    {formData.active === true ? "Bloquear cuenta" : "Desbloquear cuenta"}
                                </Button>
                                {!formData.isVerified && (
                                    <Button variant="default" className="justify-start" onClick={handleVerifyUser}>
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Verificar usuario
                                    </Button>
                                )}
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="outline" className="justify-start">
                                            <Bell className="mr-2 h-4 w-4" />
                                            Enviar notificación
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Enviar notificación</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Enviar notificación a {formData.firstName}. Esta notificación aparecerá en la bandeja de entrada del usuario.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <div className="space-y-4 py-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="notification-title">Título</Label>
                                                <Input
                                                    id="notification-title"
                                                    placeholder="Introduzca aquí el título de la notificación..."
                                                    value={notificationTitle}
                                                    onChange={(e) => setNotificationTitle(e.target.value)}
                                                />
                                                <Label htmlFor="notification-message">Mensaje</Label>
                                                <Textarea
                                                    id="notification-message"
                                                    placeholder="Introduzca aquí la descripción de la notificación..."
                                                    value={notificationMessage}
                                                    onChange={(e) => setNotificationMessage(e.target.value)}
                                                    rows={4}
                                                />
                                            </div>
                                        </div>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={handleSendNotification}
                                                disabled={sendNotificationMutation.isPending}
                                            >
                                                <Send className="mr-2 h-4 w-4" />
                                                {sendNotificationMutation.isPending ? "Enviando..." : "Enviar notificación"}
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Editar información de usuario</CardTitle>
                            <CardDescription>Actualizar detalles y permisos de usuario</CardDescription>
                        </CardHeader>
                        <form onSubmit={handleSubmit}>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="id">Identificador</Label>
                                        <Input id="id" name="id" value={formData.id} disabled />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">Nombre</Label>
                                        <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleFormChange} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Apellidos</Label>
                                        <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleFormChange} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Correo electrónico</Label>
                                        <Input id="email" name="email" type="email" value={formData.email} onChange={handleFormChange} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="username">Nombre de usuario</Label>
                                        <Input id="username" name="username" value={formData.username} onChange={handleFormChange} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="role">Roles</Label>
                                        {
                                            formData.roles.length > 0 ? (
                                                formData.roles.map((role) => (
                                                    <BadgeClosable
                                                        key={role.name}
                                                        text={role.name}
                                                        roleName={role.name}
                                                        onClickEvent={handleRevokeRole}
                                                    />
                                                ))
                                            ) : (
                                                <span className="text-sm text-muted-foreground">No tiene roles asignados</span>
                                            )
                                        }
                                        <Select onValueChange={(value) => handleAssignRole(value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Asignar nuevo rol" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="estudiante">Estudiante</SelectItem>
                                                <SelectItem value="moderator">Moderador</SelectItem>
                                                <SelectItem value="administrador">Administrador</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" disabled={updateUserMutation.isPending} className="mt-4 hover:bg-gray-500">
                                    <Save className="mr-2 h-4 w-4" />
                                    {updateUserMutation.isPending ? "Guardando..." : "Guardar cambios"}
                                </Button>
                                <Button className="mt-4 ml-2 hover:bg-gray-500" variant="secondary">
                                    <Link to="/admin/users">Volver</Link>
                                </Button>

                            </CardFooter>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    )
}