"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { ArrowLeft, Upload, Save } from "lucide-react"
import {Link} from "react-router-dom"

// Mock user data - in a real app, this would come from your API
const user = {
    id: "1",
    name: "Jane Smith",
    username: "janesmith",
    email: "jane.smith@example.com",
    avatar: "/placeholder.svg?height=100&width=100",
    location: "San Francisco, CA",
    bio: "Full-stack developer passionate about solving complex problems and building intuitive user interfaces.",
    skills: "JavaScript, TypeScript, React, Node.js, Python",
    githubUsername: "janesmith",
}

export default function EditProfilePage() {
    const [formData, setFormData] = useState(user)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false)
            toast.success("Perfil actualizado", 
                {description: "Tu perfil se ha actualizado correctamente"})
        }, 1000)
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
                                <AvatarImage src={formData.avatar} alt={formData.name} />
                                <AvatarFallback>{formData.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <Button variant="outline" className="w-full">
                                <Upload className="mr-2 h-4 w-4" />
                                Subir nueva foto
                            </Button>
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
                                    <Label htmlFor="name">Nombre completo</Label>
                                    <Input id="name" name="name" value={formData.name} onChange={handleChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="username">Nombre de usuario</Label>
                                    <Input id="username" name="username" value={formData.username} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Correo Electrónico</Label>
                                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="location">Ciudad</Label>
                                    <Input id="location" name="location" value={formData.location} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bio">Sobre mi</Label>
                                <Textarea id="bio" name="bio" rows={4} value={formData.bio} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="skills">Habilidades (separadas por comas)</Label>
                                <Input id="skills" name="skills" value={formData.skills} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="githubUsername">Nombre de usuario de GitHub</Label>
                                <Input
                                    id="githubUsername"
                                    name="githubUsername"
                                    value={formData.githubUsername}
                                    onChange={handleChange}
                                />
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

