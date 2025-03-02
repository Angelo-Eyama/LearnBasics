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
import {useState} from "react"
import {Link, useNavigate} from "react-router-dom"
import { loginForAccessToken, BodyLoginLoginForAccessToken as accessToken } from "@/client"
import { useAuth } from "@/context/useAuth"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const { login } = useAuth()
  function handleLogin() {
    let data : accessToken = {
      username: username,
      password: password
    }
    loginForAccessToken({ body: data }).then((response) => {
      if(response.data && response.data.access_token){
        localStorage.setItem("access_token", response.data.access_token)
        login()
        navigate("/home")
      }
    }).catch((error) => {
      console.log(error.detail)
      if (error.response && error.response.detail) {
        handleError(error.response.detail);
      } else {
        handleError("Error del servidor");
      }
    })
  }

  function handleError(message: string){
    setError(message)
    setTimeout(() => {
      setError("")
    }, 3000)
  }


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
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    ¿Olvidó su contraseña?
                  </a>
                </div>
                <Input id="password" type="password" onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="button" className="w-full" onClick={handleLogin}>
                  Iniciar sesion
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
              ¿Todavía no tiene una cuenta?{" "}
              <Link to="/register" className="underline underline-offset-4 hover:font-bold">
                Registrese
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
