import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { validateRegister } from "@/utils/validation"
import { isLoggedIn } from "@/hooks/useAuth"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

export function RegisterForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        if (isLoggedIn()) {
            navigate("/")
        }
    })

    function handleRegister() {
        const error = validateRegister(firstName, lastName, username, email, password, confirmPassword)
        toast.error(error)
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
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="text">Apellidos</Label>
                                <Input
                                    id="last-name"
                                    type="text"
                                    placeholder="Hernando Varela"
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="text">Correo electrónico</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="mail@example.com"
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="text">Nombre de usuario</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="jdoe"
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
                                <Input id="password" type="password" onChange={(e) => setConfirmPassword(e.target.value)} required />
                            </div>


                            <div className="flex flex-col gap-3">
                                <Button type="button" className="w-full" onClick={handleRegister}>
                                    Crear nueva cuenta
                                </Button>
                            </div>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            ¿Ya tiene una cuenta con nosotros?{" "}
                            <Link to="/auth/login" className="underline underline-offset-4 hover:font-bold">
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
