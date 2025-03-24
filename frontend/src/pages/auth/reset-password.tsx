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
            toast.error("Las contraseñas no coinciden",{
                description: "Por favor, asegúrate de que las contraseñas coincidan.",
            })
            return
        }

        if (password.length < 8) {
            toast.error("Contraseña muy corta",{
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
                        <CardTitle className="text-2xl">Password Reset Successful</CardTitle>
                        <CardDescription>
                            Your password has been reset successfully. You will be redirected to the login page shortly.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button asChild className="w-full">
                            <Link to="/auth/login">Go to Login</Link>
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
                        <CardTitle className="text-2xl">Reset Password</CardTitle>
                        <CardDescription>
                            Enter your email address and we'll send you a link to reset your password.
                        </CardDescription>
                    </CardHeader>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            toast.info("Enlace de reinicio enviado",{
                                description: "Si su correo está registrado, recibirá un enlace para restablecer su contraseña.",
                            })
                        }}
                    >
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="name@example.com" required />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-2">
                            <Button type="submit" className="w-full">
                                Send Reset Link
                            </Button>
                            <Button variant="ghost" asChild className="w-full">
                                <Link to="/auth/login">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Login
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
                    <CardTitle className="text-2xl">Create New Password</CardTitle>
                    <CardDescription>Enter a new password for your account</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">New Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
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
                            {isSubmitting ? "Resetting Password..." : "Reset Password"}
                        </Button>
                        <Button variant="ghost" asChild className="w-full">
                            <Link to="/auth/login">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Login
                            </Link>
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}

