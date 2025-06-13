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

export function LoginForm({ className }: React.ComponentProps<"div">) {
  const navigate = useNavigate()
  const { loginMutation } = useAuth()
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }
  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    loginMutation.mutateAsync(formData)
    setFormData({
      username: "",
      password: "",}
    )
  }

  useEffect(() => {
    if (loginMutation.isSuccess || isLoggedIn()) {
      navigate("/")
    }
  }, [loginMutation.isSuccess, navigate])

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Card>
        <CardHeader>
          <CardTitle>Iniciar sesion</CardTitle>
          <CardDescription>
            Introduzca su nombre de usuario y contraseña
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="text">Nombre de usuario</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="your_username"
                  onChange={handleFormChange}
                  value={formData.username}
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
                <Input
                  id="password"
                  name="password"
                  placeholder="********"
                  value={formData.password}
                  type="password"
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="flex flex-col gap-3">
                {

                  <Button type="submit" className="w-full cursor-pointer focus:bg-slate-700">
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
