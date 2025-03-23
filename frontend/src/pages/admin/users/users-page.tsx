"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { Search, MoreHorizontal, Shield, UserCog, Ban, Eye } from "lucide-react"
import { toast } from "sonner"

// Mock users data
const users = [
    {
        id: "1",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "User",
        status: "Active",
        problemsSolved: 42,
        joinedDate: "Jan 15, 2023",
    },
    {
        id: "2",
        name: "John Doe",
        email: "john.doe@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Admin",
        status: "Active",
        problemsSolved: 78,
        joinedDate: "Mar 3, 2022",
    },
    {
        id: "3",
        name: "Alice Johnson",
        email: "alice.johnson@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "User",
        status: "Inactive",
        problemsSolved: 15,
        joinedDate: "Jul 22, 2023",
    },
    {
        id: "4",
        name: "Bob Williams",
        email: "bob.williams@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "User",
        status: "Active",
        problemsSolved: 31,
        joinedDate: "Apr 10, 2023",
    },
    {
        id: "5",
        name: "Carol Martinez",
        email: "carol.martinez@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Moderator",
        status: "Active",
        problemsSolved: 56,
        joinedDate: "Feb 5, 2023",
    },
]

export default function AdminUsersPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedUser, setSelectedUser] = useState<(typeof users)[0] | null>(null)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    const filteredUsers = users.filter((user) => {
        return (
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.role.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })

    const handleStatusChange = (userId: string, newStatus: string) => {
        toast.success("Estado de usuario actualizado", {
            description: `El estado del usuario ha cambiado a ${newStatus}.`,
        })
    }

    const handleRoleChange = (userId: string, newRole: string) => {
        toast.success("Rol actualizado", {
            description: `El rol del usuario ha cambiado a ${newRole}.`,
        })
    }

    const handleDeleteUser = () => {
        if (!selectedUser) return

        setIsDeleteDialogOpen(false)
        toast.success("Usuario eliminado", {
            description: `El usuario ${selectedUser.name} se ha eliminado.`,
        })
        setSelectedUser(null)
    }

    return (
        <div className="container mx-auto py-6 px-4">
            <title>Gestion de usuarios</title>
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Gestion de usuarios</h1>
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
                                <TableHead>Problemas Resueltos</TableHead>
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
                                                <AvatarImage src={user.avatar} alt={user.name} />
                                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{user.name}</p>
                                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={user.role === "Admin" ? "default" : user.role === "Moderator" ? "outline" : "secondary"}
                                        >
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={user.status === "Active" ? "default" : "destructive"}>{user.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-center">{user.problemsSolved}</TableCell>
                                    <TableCell>{user.joinedDate}</TableCell>
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
                                                    onClick={() => handleRoleChange(user.id, user.role === "Admin" ? "User" : "Admin")}
                                                >
                                                    <UserCog className="mr-2 h-4 w-4" />
                                                    {user.role === "Admin" ? "Quitar Admin" : "Hacer Admin"}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleStatusChange(user.id, user.status === "Active" ? "Inactive" : "Active")}
                                                >
                                                    <Shield className="mr-2 h-4 w-4" />
                                                    {user.status === "Active" ? "Desactivar" : "Activar"}
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
                            ¿Estás seguro de que quieres eliminar la cuenta de {selectedUser?.name}? <br /> <b>Esta acción no se puede deshacer.</b>
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

