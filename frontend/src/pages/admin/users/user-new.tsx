"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save } from "lucide-react"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { UserCreate } from "@/client"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { getDiceBearAvatar } from "@/utils/utils"
import { validateRegister } from "@/utils/validation"
import { createUser } from "@/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export default function NewUserPage() {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [formData, setFormData] = useState<UserCreate>({
        username: "",
        firstName: "",
        lastName: "",
        email: "",
        roles: [],
        active: true,
        isVerified: false,
        score: 0,
        password: "",
    })

    // Mutacion para crear un nuevo usuario
    const createUserMutation = useMutation({
        mutationFn: async (data: UserCreate) => {
            const response = await createUser({ body: data })
            if (response.status !== 200 || !("data" in response)) {
                toast.error(`Error ${response.status}`, {
                    description: Array.isArray(response.error?.detail)
                        ? response.error.detail.map((err: any) => err.msg || JSON.stringify(err)).join(", ")
                        : (response.error?.detail || "Error al crear el usuario")
                })
                throw new Error(`Error ${response.status} al crear el usuario`)
            }
            return response.data
        },
        onSuccess: () => {
            toast.success("Usuario creado correctamente")
            queryClient.invalidateQueries({ queryKey: ["adminUsers"] })
            navigate("/admin/users")
        },
        onError: () => {
            toast.error("Error al crear el usuario")
        }
    })

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const responseValidation = validateRegister(
            formData.firstName,
            formData.lastName,
            formData.username,
            formData.email,
            password,
            confirmPassword
        )
        if (responseValidation !== "") {
            toast.error(responseValidation)
            return
        }
        formData.password = password
        createUserMutation.mutateAsync(formData)
    }

    return (
        <div className="container mx-auto py-6 px-4">
            <title>Crear usuario</title>
            <div className="flex items-center mb-6">
                <Button variant="ghost" size="sm" className="mr-2">
                    <Button variant="ghost" size="sm" className="mr-2" onClick={() => navigate(-1)}>
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Volver
                    </Button>
                </Button>
                <h1 className="text-3xl font-bold">Crear nuevo usuario</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-1">
                    <CardHeader className="flex flex-col items-center text-center">
                        <Avatar className="h-24 w-24 mb-4">
                            <AvatarImage
                                src={getDiceBearAvatar(formData.username)}
                                alt={formData.username}
                                className="border-2"
                            />
                            <AvatarFallback>{formData.username.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <CardTitle>{formData.username}</CardTitle>
                        <CardDescription>{formData.email}</CardDescription>
                    </CardHeader>
                </Card>

                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Rellenar información de usuario</CardTitle>
                            <CardDescription>Introduzca los detalles de la nueva cuenta</CardDescription>
                        </CardHeader>
                        <form onSubmit={handleSubmit}>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="username">Nombre de usuario</Label>
                                        <Input id="username" name="username" value={formData.username} onChange={handleFormChange} />
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
                                        <Label htmlFor="password">Contraseña</Label>
                                        <Input id="password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                                        <Input id="confirmPassword" name="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)
                                        } />
                                    </div>
                                    <div className="space-y-2 w-fit">
                                        <Label htmlFor="bio">Puntuacion</Label>
                                        <Input id="score" name="score" type="number" value={formData.score!} onChange={handleFormChange}/>
                                    </div>
                                    
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <p>Por defecto, se le asignará el rol de Estudiante</p>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" className="mt-4 hover:bg-gray-500" onClick={handleSubmit} disabled={createUserMutation.isPending}>
                                    <Save className="mr-2 h-4 w-4" />
                                    Crear usuario
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    )
}

