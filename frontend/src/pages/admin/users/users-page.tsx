"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Search, Eye, ArrowLeft, PlusCircle, Trash, Lock } from "lucide-react"
import { FiUnlock } from "react-icons/fi";
import useAdminUsers from "@/hooks/useAdminUsers"
import { Loading } from "@/components/ui/loading"
import { formatDate, getHighestRole, getDiceBearAvatar } from "@/utils/utils"


export default function AdminUsersPage() {
    const { users, isLoading, isError, deleteUser, changeUserStatus } = useAdminUsers()
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedUser, setSelectedUser] = useState<(typeof users)[0] | null>(null)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    if (isLoading) {
        return (
            <div className="container mx-auto py-6 px-4">
                <Loading message="Cargando usuarios... Espere un momento" />
            </div>
        )
    }
    if (isError) {
        return (
            <div className="container mx-auto py-6 px-4">
                <h1 className="text-3xl font-bold mb-4">Error al cargar los usuarios</h1>
                <p className="text-red-500">No se pudieron cargar los usuarios. Por favor, inténtalo de nuevo más tarde.</p>
                <Button variant="outline" onClick={() => navigate("/admin/")}>
                    Volver al panel de administración
                </Button>
            </div>
        )
    }

    const filteredUsers = users.filter((user) => {
        return (
            user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.roles.some((role) => role.name.toLowerCase().includes(searchQuery.toLowerCase()))
        )
    })

    const handleStatusChange = (userId: number) => {
        changeUserStatus(userId)
    }

    const handleDeleteUser = () => {
        if (!selectedUser) return
        deleteUser(selectedUser.id)
        setIsDeleteDialogOpen(false)
        setSelectedUser(null)
    }

    return (
        <div className="container mx-auto py-6 px-4">
            <title>Gestion de usuarios</title>
            <div className="flex items-center mb-6">
                <Button variant="ghost" size="sm" className="mr-2" onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Volver
                </Button>
                <h1 className="text-3xl font-bold">Gestión de usuarios</h1>
            </div>
            <div className="flex justify-between items-center mb-6">
                <div className="mb-6 mx-4">
                    <p className="text-muted-foreground">Gestiona a los usuarios y sus permisos</p>
                </div>
                <Button asChild>
                    <Link to="/admin/users/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Crear nuevo usuario
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader className="pb-2">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <CardTitle>Usuarios</CardTitle>
                            <CardDescription>
                                Mostrando {filteredUsers.length} de {users.length} usuarios
                            </CardDescription>
                        </div>
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar usuarios..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Usuario</TableHead>
                                <TableHead>Rol</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead>Registrado desde</TableHead>
                                <TableHead className="text-center">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="flex items-center space-x-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={getDiceBearAvatar(user.username)} alt={user.username} />
                                                <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <Link to={`/admin/users/${user.id}`} className="text-sm font-medium hover:underline">{user.username}</Link>
                                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={getHighestRole(user.roles) === "Administrador" ? "default" : getHighestRole(user.roles) === "Moderador" ? "outline" : "secondary"}
                                        >
                                            {getHighestRole(user.roles)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="items-center">
                                        <Badge variant={user.active === true ? "default" : "destructive"}>{user.active ? "Desbloqueado" : "Bloqueado"}</Badge>
                                    </TableCell>
                                    <TableCell> {formatDate(user.creationDate, { year: '2-digit', month: 'short', day: 'numeric', weekday: 'short' })} </TableCell>
                                    <TableCell className="text-center">
                                        <Button variant={"ghost"} asChild>
                                            <Link to={`/admin/users/${user.id}`}>
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <Button onClick={() => handleStatusChange(user.id)} variant="ghost" className="ml-2" title="Bloquear/Desbloquear usuario">
                                            {
                                                user.active ?
                                                    <Lock className="h-4 w-4" />
                                                    :
                                                    <FiUnlock className="h-4 w-4" />
                                            }
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            className="ml-2"
                                            onClick={() => {
                                                setSelectedUser(user)
                                                setIsDeleteDialogOpen(true)
                                            }}
                                        >
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Eliminar usuario</DialogTitle>
                        <DialogDescription>
                            ¿Estás seguro de que quieres eliminar la cuenta de {selectedUser?.username}? <br /> <b>Esta acción no se puede deshacer.</b>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteUser}>
                            Eliminar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

