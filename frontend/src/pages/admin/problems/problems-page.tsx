"use client"

import { useState } from "react"
import {Link} from "react-router-dom"
import { Button } from "@/components/ui/button"
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
import { Search, MoreHorizontal, Eye, Edit, Trash, PlusCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

// Mock problems data
const problems = [
    {
        id: "1",
        title: "Two Sum",
        difficulty: "Easy",
        tags: ["Arrays", "Hash Table"],
        status: "Published",
        createdAt: "2023-01-15",
    },
    {
        id: "2",
        title: "Reverse Linked List",
        difficulty: "Easy",
        tags: ["Linked List", "Recursion"],
        status: "Published",
        createdAt: "2023-02-20",
    },
    {
        id: "3",
        title: "Binary Tree Level Order Traversal",
        difficulty: "Medium",
        tags: ["Tree", "BFS", "Binary Tree"],
        status: "Published",
        createdAt: "2023-03-10",
    },
    {
        id: "4",
        title: "Merge K Sorted Lists",
        difficulty: "Hard",
        tags: ["Linked List", "Divide and Conquer", "Heap"],
        status: "Draft",
        createdAt: "2023-04-05",
    },
    {
        id: "5",
        title: "LRU Cache",
        difficulty: "Medium",
        tags: ["Hash Table", "Linked List", "Design"],
        status: "Published",
        createdAt: "2023-05-12",
    },
]

export default function AdminProblemsPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [difficultyFilter, setDifficultyFilter] = useState("all")
    const [statusFilter, setStatusFilter] = useState("all")
    const [selectedProblem, setSelectedProblem] = useState<(typeof problems)[0] | null>(null)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    const filteredProblems = problems.filter((problem) => {
        // Search filter
        const matchesSearch =
            problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            problem.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

        // Difficulty filter
        const matchesDifficulty =
            difficultyFilter === "all" || problem.difficulty.toLowerCase() === difficultyFilter.toLowerCase()

        // Status filter
        const matchesStatus = statusFilter === "all" || problem.status.toLowerCase() === statusFilter.toLowerCase()

        return matchesSearch && matchesDifficulty && matchesStatus
    })

    const handleStatusChange = (problemId: string, newStatus: string) => {
        toast.success("Problema actualizado", {
            description: `El estado del problema ha cambiado a ${newStatus}.`,
        })
    }

    const handleDeleteProblem = () => {
        if (!selectedProblem) return

        setIsDeleteDialogOpen(false)
        toast.success("Problema eliminado", {
            description: `El problema "${selectedProblem.title}" ha sido eliminado.`,
        })
        setSelectedProblem(null)
    }

    return (
        <div className="container mx-auto py-6 px-4">
            <title>Gestion de problemas</title>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Gestión de problemas</h1>
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
                                Mostrando {filteredProblems.length} de {problems.length} problemas
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
                                    <SelectItem value="all">Todas</SelectItem>
                                    <SelectItem value="easy">Facil</SelectItem>
                                    <SelectItem value="medium">Medio</SelectItem>
                                    <SelectItem value="hard">Dificil</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    <SelectItem value="published">Publicados</SelectItem>
                                    <SelectItem value="draft">Borrador</SelectItem>
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
                                <TableHead>Estado</TableHead>
                                <TableHead>Fecha de creación</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredProblems.map((problem) => (
                                <TableRow key={problem.id}>
                                    <TableCell className="font-medium">{problem.title}</TableCell>
                                    <TableCell>
                                        <Badge
                                            className={
                                                problem.difficulty === "Easy"
                                                    ? "bg-green-500"
                                                    : problem.difficulty === "Medium"
                                                        ? "bg-yellow-500"
                                                        : "bg-red-500"
                                            }
                                        >
                                            {problem.difficulty}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {problem.tags.map((tag) => (
                                                <Badge key={tag} variant="outline" className="text-xs">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={problem.status === "Published" ? "default" : "secondary"}>{problem.status}</Badge>
                                    </TableCell>
                                    <TableCell>{problem.createdAt}</TableCell>
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
                                                    <Link to={`/admin/problems/${problem.id}`}>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        Ver problema
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link to={`/admin/problems/${problem.id}/edit`}>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Editar problema
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        handleStatusChange(problem.id, problem.status === "Published" ? "Borrador" : "Publicado")
                                                    }
                                                >
                                                    {problem.status === "Published" ? "Borrador" : "Publicado"}
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

