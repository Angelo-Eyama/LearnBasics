"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
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
import { Search, MoreHorizontal, Eye, Check, X, MessageSquare, ArrowLeft } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAdminComments } from "@/hooks/useAdminComments"
import { formatDate, getDiceBearAvatar } from "@/utils/utils"
import { Loading } from "@/components/ui/loading"


export default function AdminCommentsPage() {
    const {comments, changeCommentApproval, deleteComment, isError, isLoading } = useAdminComments()
    const [searchQuery, setSearchQuery] = useState("")
    const [approvalFilter, setApprovalFilter] = useState("all")
    const [selectedComment, setSelectedComment] = useState<(typeof comments)[0] | null>(null)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
    const navigate = useNavigate()
    const filteredComments = comments.filter((comment) => {
        const matchesSearch =
            comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            comment.user.username.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesStatus = approvalFilter === "all"
            || (approvalFilter === "approved" && comment.isApproved)
            || (approvalFilter === "rejected" && !comment.isApproved)

        return matchesSearch && matchesStatus
    })

    const handleApprovalFilter = (value: string) => {
        setApprovalFilter(value)
    }

    const handleStatusChange = (commentId: number) => {
        changeCommentApproval(commentId)
    }

    const handleDeleteComment = () => {
        if (!selectedComment) return

        setIsDeleteDialogOpen(false)
        deleteComment(selectedComment.id)
        setSelectedComment(null)
    }

    if (isError) {
        return (
            <div className="container mx-auto py-6 px-4">
                <h1 className="text-3xl font-bold mb-4">Error al cargar los comentarios</h1>
                <p className="text-red-500">No se pudieron cargar los comentarios. Por favor, inténtalo de nuevo más tarde.</p>
                <Button variant="outline">
                    <Link to="/admin">Volver al panel de administración</Link>
                </Button>
            </div>
        )
    }
    if (isLoading) {
        return (
            <div className="container mx-auto py-6 px-4">
                <Loading message="Cargando comentarios... Espere un momento" />
            </div>
        )
    }

    return (
        <div className="container mx-auto py-6 px-4">
            <title>Gestion de comentarios</title>
            <div className="flex items-center mb-6">
                <Button variant="ghost" size="sm" className="mr-2" onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Volver
                </Button>
                <h1 className="text-3xl font-bold">Gestión de comentarios</h1>
            </div>
            <div className="mb-6">
                <p className="text-muted-foreground">Gestiona los comentarios y su visibilidad</p>
            </div>

            <Card>
                <CardHeader className="pb-2">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <CardTitle>Comentarios</CardTitle>
                            <CardDescription>
                                Mostrando {filteredComments.length} de {comments.length} comentarios
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
                            <Select value={approvalFilter} onValueChange={handleApprovalFilter}>
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    <SelectItem value="approved">Aprobados</SelectItem>
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
                                                <AvatarImage src={getDiceBearAvatar(comment.user.username)} alt={comment.user.username} />
                                                <AvatarFallback>{comment.user.username.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{comment.user.username}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="max-w-xs truncate">{comment.content}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Link to={`/admin/problems/${comment.problemID}`} className="text-primary hover:underline max-w-xs truncate">
                                            {comment.problem.title}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={comment.isApproved ? "default" : "destructive"}
                                        >
                                            {comment.isApproved ? "Aprobado" : "Rechazado"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{formatDate(comment.timePosted)}</TableCell>
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
                                                <DropdownMenuItem onClick={() => handleStatusChange(comment.id)}>
                                                    {
                                                        comment.isApproved ?
                                                            (<>
                                                                <X className="mr-2 h-4 w-4" /> Rechazar
                                                            </>)
                                                            :
                                                            (<>
                                                                <Check className="mr-2 h-4 w-4" /> Aprobar
                                                            </>)
                                                    }
                                                </DropdownMenuItem>
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
                                    <AvatarFallback>{selectedComment.user.username.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">{selectedComment.user.username}</p>
                                    <p className="text-xs text-muted-foreground">{formatDate(selectedComment.timePosted)}</p>
                                </div>
                            </div>
                            <div className="p-4 border rounded-md">
                                <p>{selectedComment.content}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                <p className="text-sm">
                                    Problema relacionado:{" "}
                                    <Link to={`/admin/problems/${selectedComment.problemID}`} className="text-primary hover:underline max-w-xs truncate">
                                        {selectedComment.problem.title}
                                    </Link>
                                </p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Badge
                                    variant={
                                        selectedComment.isApproved
                                            ? "default"
                                            : "destructive"
                                    }>
                                    {selectedComment.isApproved ? "Aprobado" : "Rechazado"}
                                </Badge>
                            </div>
                        </div>
                    )}
                    <DialogFooter className="flex justify-between sm:justify-between">
                        <div className="flex gap-2">
                            {selectedComment && !selectedComment.isApproved && (
                                <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => {
                                        handleStatusChange(selectedComment.id)
                                        setIsViewDialogOpen(false)
                                    }}
                                >
                                    <Check className="mr-2 h-4 w-4" />
                                    Aprobar
                                </Button>
                            )}
                            {selectedComment && selectedComment.isApproved && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        handleStatusChange(selectedComment.id)
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

