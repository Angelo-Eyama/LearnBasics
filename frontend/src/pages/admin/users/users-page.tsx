"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Search, MoreHorizontal, Shield, Ban, Eye, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import useAdminUsers from "@/hooks/useAdminUsers"
import { Loading } from "@/components/ui/loading"
import { formatDate } from "@/utils/utils"

function getHighestRole(roles: { name: string }[]) {
    if (roles.some(role => role.name.toLowerCase() === "administrador")) return "Administrador"
    if (roles.some(role => role.name.toLowerCase() === "moderador")) return "Moderador"
    return "Estudiante"
}

export default function AdminUsersPage() {
    const { users, isLoading, isError, error, deleteUser, changeUserStatus } = useAdminUsers()
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedUser, setSelectedUser] = useState<(typeof users)[0] | null>(null)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    if (isLoading) return <Loading />
    if (isError) {
        toast.error("Error al cargar los usuarios", {
            description: Array.isArray(error?.message)
                ? error.message.map((err: any) => err.msg || JSON.stringify(err)).join(", ")
                : (error?.message || "Error al cargar los usuarios")
        })
        return null
    }

    const filteredUsers = users.filter((user) => {
        return (
            user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.roles.some((role) => role.name.toLowerCase().includes(searchQuery.toLowerCase()))
        )
    })

    const handleStatusChange = (userId: number, newStatus: string) => {
        changeUserStatus(userId)
        toast.success("Estado de usuario actualizado", {
            description: `Se ha cambiado el estado del usuario a ${newStatus}.`,
        })
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
                <Button variant="ghost" size="sm" asChild className="mr-2">
                    <Link to="/admin/">
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Volver
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold">Gestion de usuarios</h1>
            </div>
            <div className="mb-6">
                <p className="text-muted-foreground">Gestiona a los usuarios y sus permisos</p>
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
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="flex items-center space-x-3">
                                            <Avatar className="h-8 w-8">
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
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Abrir menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                                <DropdownMenuItem asChild>
                                                    <Link to={`/admin/users/${user.id}`}>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        Ver detalles
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() => handleStatusChange(user.id, user.active === true ? "desbloqueado" : "bloqueado")}
                                                >
                                                    <Shield className="mr-2 h-4 w-4" />
                                                    {user.active === true ? "Bloquear" : "Desbloquear"}
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-destructive focus:text-destructive"
                                                    onClick={() => {
                                                        setSelectedUser(user)
                                                        setIsDeleteDialogOpen(true)
                                                    }}
                                                >
                                                    <Ban className="mr-2 h-4 w-4" />
                                                    Eliminar usuario
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
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

