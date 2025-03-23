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
import { Search, MoreHorizontal, Eye, Check, X, MessageSquare } from "lucide-react"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock comments data
const comments = [
    {
        id: "1",
        content: "I found it helpful to use a hash map to store the numbers I've seen so far, along with their indices.",
        user: {
            name: "Alex Johnson",
            avatar: "/placeholder.svg?height=40&width=40",
        },
        problem: "Two Sum",
        problemId: "1",
        status: "Approved",
        createdAt: "2023-10-15T14:30:00Z",
    },
    {
        id: "2",
        content: "Watch out for edge cases like duplicate numbers in the array!",
        user: {
            name: "Maria Garcia",
            avatar: "/placeholder.svg?height=40&width=40",
        },
        problem: "Two Sum",
        problemId: "1",
        status: "Approved",
        createdAt: "2023-10-12T09:15:00Z",
    },
    {
        id: "3",
        content: "This problem is too easy, needs more challenging test cases.",
        user: {
            name: "John Smith",
            avatar: "/placeholder.svg?height=40&width=40",
        },
        problem: "Two Sum",
        problemId: "1",
        status: "Pending",
        createdAt: "2023-10-18T11:45:00Z",
    },
    {
        id: "4",
        content: "The time complexity of my solution is O(n) and space complexity is O(n).",
        user: {
            name: "Emily Chen",
            avatar: "/placeholder.svg?height=40&width=40",
        },
        problem: "Binary Tree Level Order Traversal",
        problemId: "3",
        status: "Approved",
        createdAt: "2023-10-10T16:20:00Z",
    },
    {
        id: "5",
        content: "This is spam content that should be removed.",
        user: {
            name: "Spam User",
            avatar: "/placeholder.svg?height=40&width=40",
        },
        problem: "LRU Cache",
        problemId: "5",
        status: "Rejected",
        createdAt: "2023-10-05T08:30:00Z",
    },
]

export default function AdminCommentsPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [selectedComment, setSelectedComment] = useState<(typeof comments)[0] | null>(null)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

    const filteredComments = comments.filter((comment) => {
        // Search filter
        const matchesSearch =
            comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            comment.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            comment.problem.toLowerCase().includes(searchQuery.toLowerCase())

        // Status filter
        const matchesStatus = statusFilter === "all" || comment.status.toLowerCase() === statusFilter.toLowerCase()

        return matchesSearch && matchesStatus
    })

    const handleStatusChange = (commentId: string, newStatus: string) => {
        toast.success("Comentario actualizado", {
            description: `El estado del comentario ha cambiado a ${newStatus}.`,
        })
    }

    const handleDeleteComment = () => {
        if (!selectedComment) return

        setIsDeleteDialogOpen(false)
        toast.success("Comentario eliminado",{
            description: "El comentario ha sido eliminado correctamente.",
        })
        setSelectedComment(null)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString()
    }

    return (
        <div className="container mx-auto py-6 px-4">
            <title>Gestion de comentarios</title>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Moderación de comentarios</h1>
                    <p className="text-muted-foreground">Revisar y gestionar los comentarios de los usuarios</p>
                </div>
            </div>

            <Card>
                <CardHeader className="pb-2">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <CardTitle>Comentarios</CardTitle>
                            <CardDescription>
                                Mosntrando {filteredComments.length} de {comments.length} comentarios
                            </CardDescription>
                        </div>
                        <div className="flex flex-col md:flex-row gap-2">
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar comentarios..."
                                    className="pl-8"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    <SelectItem value="approved">Aprobados</SelectItem>
                                    <SelectItem value="pending">Pendientes</SelectItem>
                                    <SelectItem value="rejected">Rechazados</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Usuario</TableHead>
                                <TableHead>Comentario</TableHead>
                                <TableHead>Problema</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead>Fecha de creacion</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredComments.map((comment) => (
                                <TableRow key={comment.id}>
                                    <TableCell>
                                        <div className="flex items-center space-x-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
                                                <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{comment.user.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="max-w-xs truncate">{comment.content}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Link to={`/problems/${comment.problemId}`} className="text-primary hover:underline">
                                            {comment.problem}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                comment.status === "Approved"
                                                    ? "default"
                                                    : comment.status === "Pending"
                                                        ? "outline"
                                                        : "destructive"
                                            }
                                        >
                                            {comment.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{formatDate(comment.createdAt)}</TableCell>
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
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        setSelectedComment(comment)
                                                        setIsViewDialogOpen(true)
                                                    }}
                                                >
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    Ver comentario completo
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                {comment.status !== "Approved" && (
                                                    <DropdownMenuItem onClick={() => handleStatusChange(comment.id, "Approved")}>
                                                        <Check className="mr-2 h-4 w-4" />
                                                        Aprobar
                                                    </DropdownMenuItem>
                                                )}
                                                {comment.status !== "Rejected" && (
                                                    <DropdownMenuItem onClick={() => handleStatusChange(comment.id, "Rejected")}>
                                                        <X className="mr-2 h-4 w-4" />
                                                        Rechazar
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-destructive focus:text-destructive"
                                                    onClick={() => {
                                                        setSelectedComment(comment)
                                                        setIsDeleteDialogOpen(true)
                                                    }}
                                                >
                                                    <X className="mr-2 h-4 w-4" />
                                                    Eliminar comentario
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
                        <DialogTitle>Eliminar comentario</DialogTitle>
                        <DialogDescription>
                            ¿ Está seguro de querer eliminar este comentario ? <br /> 
                            <b>Esta accion no puede ser revertida </b>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteComment}>
                            Eliminar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Detalles</DialogTitle>
                    </DialogHeader>
                    {selectedComment && (
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={selectedComment.user.avatar} alt={selectedComment.user.name} />
                                    <AvatarFallback>{selectedComment.user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">{selectedComment.user.name}</p>
                                    <p className="text-xs text-muted-foreground">{formatDate(selectedComment.createdAt)}</p>
                                </div>
                            </div>
                            <div className="p-4 border rounded-md">
                                <p>{selectedComment.content}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                <p className="text-sm">
                                    Problema relacionado:{" "}
                                    <Link to={`/problems/${selectedComment.problemId}`} className="text-primary hover:underline">
                                        {selectedComment.problem}
                                    </Link>
                                </p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Badge
                                    variant={
                                        selectedComment.status === "Approved"
                                            ? "default"
                                            : selectedComment.status === "Pending"
                                                ? "outline"
                                                : "destructive"
                                    }
                                >
                                    {selectedComment.status}
                                </Badge>
                            </div>
                        </div>
                    )}
                    <DialogFooter className="flex justify-between sm:justify-between">
                        <div className="flex gap-2">
                            {selectedComment && selectedComment.status !== "Approved" && (
                                <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => {
                                        handleStatusChange(selectedComment.id, "Approved")
                                        setIsViewDialogOpen(false)
                                    }}
                                >
                                    <Check className="mr-2 h-4 w-4" />
                                    Aprobar
                                </Button>
                            )}
                            {selectedComment && selectedComment.status !== "Rejected" && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        handleStatusChange(selectedComment.id, "Rejected")
                                        setIsViewDialogOpen(false)
                                    }}
                                >
                                    <X className="mr-2 h-4 w-4" />
                                    Rechazar
                                </Button>
                            )}
                        </div>
                        <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                            Cerrar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

