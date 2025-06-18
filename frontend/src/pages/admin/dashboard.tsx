import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Users, BookText, MessageSquare, BugIcon } from "lucide-react"
import useAuth from "@/hooks/useAuth"

export default function AdminDashboardPage() {
    const { user } = useAuth()
    const isAdmin = user?.roles?.some(role => role.name === "administrador")
    return (
        <div className="container mx-auto py-6 px-4">
            <title>Panel de administración</title>
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Panel de administración</h1>
                <p className="text-muted-foreground">Desde aquí se gestiona el contenido de la aplicación</p>
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${isAdmin ? "4" : "3"} gap-6`}>
                {
                    isAdmin && <Card>
                        <CardHeader className="flex justify-between items-center">
                            <CardTitle className="text-xl">Usuarios</CardTitle>
                            <CardDescription>Gestión de cuentas de usuario</CardDescription>
                            <Users className="pt-1 h-8 w-8 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <Button asChild className="w-full mt-2 focus:outline-none">
                                <Link to="/admin/users">Gestionar usuarios</Link>
                            </Button>
                        </CardContent>
                    </Card>
                }

                <Card>
                    <CardHeader className="flex justify-between items-center">
                        <CardTitle className="text-xl">Problemas</CardTitle>
                        <CardDescription>Gestión de los problemas de programación</CardDescription>
                        <BookText className="h-8 w-8 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <Button asChild className="w-full mt-2">
                            <Link to="/admin/problems">Gestionar problemas</Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2 flex justify-between items-center">
                        <CardTitle className="text-xl">Comentarios</CardTitle>
                        <CardDescription>Moderación de comentarios de usuarios</CardDescription>
                        <MessageSquare className="h-8 w-8 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <Button asChild className="w-full mt-2">
                            <Link to="/admin/comments">Gestionar comentarios</Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2 flex justify-between items-center">
                        <CardTitle className="text-xl">Reportes</CardTitle>
                        <CardDescription>Control de errores y reportes</CardDescription>
                        <BugIcon className="h-8 w-8 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <Button asChild className="w-full mt-2">
                            <Link to="/admin/reports">Gestionar reportes</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
