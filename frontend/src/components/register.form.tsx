import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Link } from "react-router-dom"

export function RegisterForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    function handleLogin() {
        console.log("Login: ", { username, password })
        handleError()
    }

    function handleError() {
        if (username === "" || password === "") {
            setError("Por favor, llene todos los campos")
        } else {
            setError("Credenciales incorrectas")
        }
        setTimeout(() => {
            setError("")
        }, 3000)
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Crear cuenta</CardTitle>
                    <CardDescription>
                        Introduzca sus datos para crear una cuenta y utilizar nuestra plataforma
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="text">Nombre</Label>
                                <Input
                                    id="first-name"
                                    type="text"
                                    placeholder="Diego"
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="text">Apellidos</Label>
                                <Input
                                    id="last-name"
                                    type="text"
                                    placeholder="Hernando Varela"
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="text">Correo electrónico</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="mail@example.com"
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-3">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Contraseña</Label>
                                </div>
                                <Input id="password" type="password" onChange={(e) => setPassword(e.target.value)} required />
                            </div>
                            <div className="grid gap-3">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Repita su contraseña</Label>
                                </div>
                                <Input id="password" type="password" onChange={(e) => setPassword(e.target.value)} required />
                            </div>


                            <div className="flex flex-col gap-3">
                                <Button type="button" className="w-full" onClick={handleLogin}>
                                    Crear nueva cuenta
                                </Button>
                            </div>
                            {
                                error && (
                                    <div className="flex flex-col gap-3 bg-red-400 p-4 rounded-md">
                                        <p>
                                            {error}
                                        </p>
                                    </div>
                                )
                            }
                        </div>
                        <div className="mt-4 text-center text-sm">
                            ¿Ya tiene una cuenta con nosotros?{" "}
                            <Link to="/login" className="underline underline-offset-4 hover:font-bold">
                                Iniciar sesion
                            </Link>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Al crear una cuenta con nosotros, usted acepta nuestros{" "}
                            <Link to="/terms" className="underline underline-offset-4 hover:font-bold">
                                términos y condiciones
                            </Link>
                            {" "}y nuestra{" "}
                            <Link to="/privacy" className="underline underline-offset-4 hover:font-bold">
                                política de privacidad
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
