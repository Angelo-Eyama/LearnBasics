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
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import useAuth, { isLoggedIn } from "@/hooks/useAuth"
import { toast } from "sonner"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const { loginMutation } = useAuth()
  const handleLogin = async () => { try {
    await loginMutation.mutateAsync({
      username: username,
      password: password
    })
    setPassword("")
    navigate("/")
  } catch (error) {
    toast.error("Credenciales incorrectas")
  }}
  
  useEffect(() => {
    if(isLoggedIn()) {
      navigate("/")
    }
  })


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Iniciar sesion</CardTitle>
          <CardDescription>
            Introduzca su nombre de usuario y contraseña
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="text">Nombre de usuario</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="your_username"
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Contraseña</Label>
                  <a
                    href="/auth/reset-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    ¿Olvidó su contraseña?
                  </a>
                </div>
                <Input id="password" type="password" onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <div className="flex flex-col gap-3">
                {
                  
                  <Button type="button" className="w-full" onClick={handleLogin}>
                    Iniciar sesion
                  </Button>
                }
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              ¿Todavía no tiene una cuenta?{" "}
              <Link to="/auth/register" className="underline underline-offset-4 hover:font-bold">
                Registrese
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
