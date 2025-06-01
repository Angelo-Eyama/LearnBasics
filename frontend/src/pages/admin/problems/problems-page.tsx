"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Loading } from "@/components/ui/loading"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
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
import { Search, MoreHorizontal, Edit, Trash, PlusCircle, ArrowLeft } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAdminProblems } from "@/hooks/useAdminProblems"
import { parseServerString } from "@/utils/utils"

export default function AdminProblemsPage() {
    const { problems: fetchedProblems, deleteProblemMutation, isLoading, isError } = useAdminProblems()
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedProblem, setSelectedProblem] = useState<(typeof fetchedProblems)[0] | null>(null)
    const [difficultyFilter, setDifficultyFilter] = useState("Todas")
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    const filteredProblems = fetchedProblems.filter((problem) => {
        // Filtro de busqueda
        const matchesSearch =
            problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            parseServerString(problem.tags).some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

        // Filtro de dificultad
        const matchesDifficulty =
            difficultyFilter === "Todas" || problem.difficulty.toLowerCase() === difficultyFilter.toLowerCase()

        return matchesSearch && matchesDifficulty
    })

    const handleDeleteProblem = () => {
        if (!selectedProblem) return

        setIsDeleteDialogOpen(false)
        deleteProblemMutation(selectedProblem.id)
        setSelectedProblem(null)
    }
    const navigate = useNavigate()
    if (isError){
        return (
            <div className="container mx-auto py-6 px-4">
                <h1 className="text-3xl font-bold mb-4">Error al cargar los problemas</h1>
                <p className="text-red-500">No se pudieron cargar los problemas. Por favor, inténtalo de nuevo más tarde.</p>
                <Button variant="outline" onClick={() => navigate("/admin/")}>
                    Volver al panel de administración
                </Button>
            </div>
        )
    }
    if (isLoading) {
        return (
            <div className="container mx-auto py-6 px-4">
                <Loading message="Cargando problemas... Espere un momento" />
            </div>
        )
    }

    return (
        <div className="container mx-auto py-6 px-4">
            <title>Gestion de problemas</title>
            <div className="flex items-center mb-6">
                <Button variant="ghost" size="sm" asChild className="mr-2">
                    <Link to="/admin/">
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Volver
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold">Gestión de problemas</h1>
            </div>
            <div className="flex justify-between items-center mb-6">
                <div className="mb-6 mx-4">
                    <p className="text-muted-foreground">Crea y gestiona los problemas de la aplicación</p>
                </div>
                <Button asChild>
                    <Link to="/admin/problems/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Crear problema
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader className="pb-2">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <CardTitle>Problemas</CardTitle>
                            <CardDescription>
                                Mostrando {filteredProblems.length} de {fetchedProblems.length} problemas
                            </CardDescription>
                        </div>
                        <div className="flex flex-col md:flex-row gap-2">
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar problemas..."
                                    className="pl-8"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Dificultad" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Todas">Todas</SelectItem>
                                    <SelectItem value="Facil">Facil</SelectItem>
                                    <SelectItem value="Normal">Normal</SelectItem>
                                    <SelectItem value="Dificil">Dificil</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Titulo</TableHead>
                                <TableHead>Dificultad</TableHead>
                                <TableHead>Etiquetas</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredProblems.map((problem) => (
                                <TableRow key={problem.id}>
                                    <TableCell className="font-medium hover:underline">{<Link to={`/admin/problems/${problem.id}`}> {problem.title}</Link>}</TableCell>
                                    <TableCell>
                                        <Badge
                                            className={
                                                problem.difficulty === "Facil"
                                                    ? "bg-green-500"
                                                    : problem.difficulty === "Normal"
                                                        ? "bg-yellow-500"
                                                        : "bg-red-500"
                                            }
                                        >
                                            {problem.difficulty}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {parseServerString(problem.tags).map((tag) => (
                                                <Badge key={tag} variant="outline" className="text-xs">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Abrir menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel className="text-center">Acciones</DropdownMenuLabel>
                                                <DropdownMenuItem asChild>
                                                    <Link to={`/admin/problems/${problem.id}`}>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Editar problema
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-destructive focus:text-destructive"
                                                    onClick={() => {
                                                        setSelectedProblem(problem)
                                                        setIsDeleteDialogOpen(true)
                                                    }}
                                                >
                                                    <Trash className="mr-2 h-4 w-4" />
                                                    Eliminar problema
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
                        <DialogTitle>Eliminar problema</DialogTitle>
                        <DialogDescription>
                            ¿Estás seguro de querer eliminar el problema "{selectedProblem?.title}"? <br />
                            <b>Esta acción no se puede deshacer.</b>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancelar
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteProblem}>
                            Eliminar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

