import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {Link} from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Users, BookText, MessageSquare } from "lucide-react"

export default function AdminDashboardPage() {
    return (
        <div className="container mx-auto py-6 px-4">
            <title>Panel de administración</title>
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Panel de administración</h1>
                <p className="text-muted-foreground">Desde aquí se gestiona el contenido de la aplicación</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xl">Usuarios</CardTitle>
                        <CardDescription>Gestión de cuentas de usuario</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center">
                            <div className="text-3xl font-bold">128</div>
                            <Users className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <Button asChild className="w-full mt-4">
                            <Link to="/admin/users">Gestionar usuarios</Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xl">Problemas</CardTitle>
                        <CardDescription>Gestión de los problemas de programación</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center">
                            <div className="text-3xl font-bold">42</div>
                            <BookText className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <Button asChild className="w-full mt-4">
                            <Link to="/admin/problems">Gestionar problemas</Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xl">Commentarios</CardTitle>
                        <CardDescription>Moderación de comentarios de usuarios</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center">
                            <div className="text-3xl font-bold">256</div>
                            <MessageSquare className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <Button asChild className="w-full mt-4">
                            <Link to="/admin/comments">Gestionar comentarios</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
