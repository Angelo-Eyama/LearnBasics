"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loading } from "@/components/ui/loading"
import { toast } from "sonner"
import { ArrowLeft, Save } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import useAuth from "@/hooks/useAuth"
import { updateCurrentUser, UserUpdate, deleteCurrentUser } from "@/client"
import { useQueryClient, useMutation } from "@tanstack/react-query"
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
import { getDiceBearAvatar } from "@/utils/utils"

export default function EditProfilePage() {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const { user, isLoading: isLoadingUser, error: isUserError } = useAuth()
    const [formData, setFormData] = useState<UserUpdate>(() => ({
        firstName: "",
        lastName: "",
        email: "",
        bio: "",
        skills: "",
        github: "",
    }))
    //Actualizar el estado del formulario si este cambia
    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName ?? "",
                lastName: user.lastName ?? "",
                email: user.email ?? "",
                bio: user.bio ?? "",
                skills: user.skills ?? "",
                github: user.github ?? "",
            })
        }
    }, [user])

    const updateProfileMutation = useMutation({
        mutationFn: async (data: UserUpdate) => {
            const response = await updateCurrentUser({ body: data })
            if (response?.data) {
                return response.data
            } else {
                toast.error("Error al actualizar perfil", { description: `${response.error.detail}` })
                throw response.error
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["currentUser"] })
            toast.success("Perfil actualizado con éxito")
            navigate("/profile")
        },
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    if (!user) return null
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        updateProfileMutation.mutateAsync(formData)
        setIsSubmitting(false)
    }
    const handleDelete = () => {
        try {
            deleteCurrentUser();
            queryClient.invalidateQueries({ queryKey: ["currentUser"] })
            localStorage.removeItem("access_token");
            navigate("/");
        } catch (error) {
            toast.error("Error al eliminar la cuenta", { description: `${error}` })
        }
    }

    if (isLoadingUser) return <Loading message="Cargando perfil..." />
    if (isUserError) {
        return (
            <div className="container mx-auto py-12 px-4">
                <div className="text-center p-6 bg-destructive/10 rounded-lg">
                    <h2 className="text-2xl font-bold text-destructive mb-2">Error al cargar el perfil</h2>
                    <p>No se pudieron cargar los datos del usuario. Por favor, inténtalo de nuevo.</p>
                    <Button onClick={() => navigate('/profile')} className="mt-4">
                        Volver al perfil
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6 px-4">
            <title>Mi perfil - Editar</title>
            <div className="flex items-center mb-6">
                <Button variant="ghost" size="sm" asChild className="mr-2">
                    <Link to="/profile">
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Volver
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold">Editar perfil</h1>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="md:col-span-1">
                        <CardHeader>
                            <CardTitle>Foto de perfil</CardTitle>
                            <CardDescription>Actualiza tu foto de perfil</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center">
                            <Avatar className="h-32 w-32 mb-4">
                                <AvatarImage src={getDiceBearAvatar(user.username)} alt={formData.firstName ?? ""} />
                                <AvatarFallback>{formData.firstName?.charAt(0)}</AvatarFallback>
                            </Avatar>

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" className="w-full mt-4">
                                        Eliminar cuenta
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Esta acción eliminará permanentemente tu cuenta y no podrás recuperarla.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleDelete} className="bg-destructive">
                                            Eliminar cuenta
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>

                        </CardContent>
                    </Card>

                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Información personal</CardTitle>
                            <CardDescription>Actualice aquí sus datos personales</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">Nombre</Label>
                                    <Input id="firstName" name="firstName" value={formData.firstName ?? ""} onChange={handleChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Apellidos</Label>
                                    <Input id="lastName" name="lastName" value={formData.lastName ?? ""} onChange={handleChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="username">Nombre de usuario</Label>
                                    <Input id="username" name="username" value={user.username} disabled />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Correo Electrónico</Label>
                                    <Input id="email" name="email" type="email" value={formData.email ?? ""} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bio">Sobre mi</Label>
                                <Textarea id="bio" name="bio" rows={4} value={formData.bio ?? ""} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="skills">Habilidades (separadas por coma y espacio)</Label>
                                <Input id="skills" name="skills" value={formData.skills ?? ""} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="github">Enlace a cuenta de github</Label>
                                <Input id="github" name="github" type="url" value={formData.github ?? ""} onChange={handleChange} />
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-4">
                            <Link to="/profile">
                                <Button type="submit">
                                    <ArrowLeft className="h-4 w-4 mr-1" /> Volver
                                </Button>
                            </Link>
                            <Button type="submit" disabled={isSubmitting}>
                                <Save className="h-4 w-4 mr-1" />
                                {isSubmitting ? "Guardando..." : "Guardar cambios"}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </form>
        </div>
    )
}

