"use client"

import type React from "react"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { KeyRound, ArrowLeft, Check } from "lucide-react"
import { useNavigate, useSearchParams } from "react-router-dom";

export default function ResetPasswordPage() {
    const navigate = useNavigate()
    const [searchParams,] = useSearchParams()
    const token = searchParams?.get("token")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isSuccess, setIsSuccess] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            toast.error("Las contraseñas no coinciden", {
                description: "Por favor, asegúrate de que las contraseñas coincidan.",
            })
            return
        }

        if (password.length < 8) {
            toast.error("Contraseña muy corta", {
                description: "La contraseña debe tener al menos 8 caracteres.",
            })
            return
        }

        setIsSubmitting(true)

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false)
            setIsSuccess(true)

            // Redirect after a delay
            setTimeout(() => {
                navigate("/auth/login")
            }, 3000)
        }, 1500)
    }

    if (isSuccess) {
        return (
            <div className="container flex h-screen w-screen flex-col items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                            <Check className="h-6 w-6 text-green-600" />
                        </div>
                        <CardTitle className="text-2xl">Reinicio de contraseña realizada</CardTitle>
                        <CardDescription>
                            Su contraseña ha sido restablecida con éxito. Ahora puede iniciar sesión con su nueva contraseña.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button asChild className="w-full">
                            <Link to="/auth/login">Volver a iniciar sesion</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    if (!token) {
        return (
            <div className="container flex h-screen w-screen flex-col items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-2xl">Reiniciar contraseña</CardTitle>
                        <CardDescription>
                            Por favor, ingrese su correo electrónico para recibir un enlace de reinicio de contraseña.
                            <br />
                            Si su correo está registrado, recibirá un enlace para restablecer su contraseña.
                        </CardDescription>
                    </CardHeader>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            toast.info("Funcionalidad no implementada", {
                                description: "Pero pendiente para un futuro cercano 😅",
                            })
                        }}
                    >
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Correo electrónico</Label>
                                <Input id="email" type="email" placeholder="correo@ejemplo.com" required />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-2 mt-2">
                            <Button type="submit" className="w-full">
                                Enviar enlace de reinicio
                            </Button>
                            <Button variant="ghost" asChild className="w-full">
                                <Link to="/auth/login">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Volver a iniciar sesión
                                </Link>
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        )
    }

    return (
        <div className="container flex h-screen w-screen flex-col items-center justify-center">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <KeyRound className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">Crear nueva contraseña</CardTitle>
                    <CardDescription>Introduzca la nueva contraseña para su cuenta</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">Nueva contraseña</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirme su nueva contraseña</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-2">
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? "Reiniciando contraseña..." : "Reiniciar contraseña"}
                        </Button>
                        <Button variant="ghost" asChild className="w-full">
                            <Link to="/auth/login">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Volver a iniciar sesión
                            </Link>
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}

