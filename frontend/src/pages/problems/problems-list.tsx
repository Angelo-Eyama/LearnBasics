"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, CheckCircle2, MoreHorizontal, Flag } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

// Mock problems data
const problems = [
    {
        id: "1",
        title: "Two Sum",
        difficulty: "Facil",
        tags: ["Arrays", "Hash Table"],
        description:
            "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
        solved: true,
    },
    {
        id: "2",
        title: "Reverse Linked List",
        difficulty: "Facil",
        tags: ["Linked List", "Recursion"],
        description: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
        solved: false,
    },
    {
        id: "3",
        title: "Binary Tree Level Order Traversal",
        difficulty: "Normal",
        tags: ["Tree", "BFS", "Binary Tree"],
        description: "Given the root of a binary tree, return the level order traversal of its nodes' values.",
        solved: true,
    },
    {
        id: "4",
        title: "Merge K Sorted Lists",
        difficulty: "Dificil",
        tags: ["Linked List", "Divide and Conquer", "Heap"],
        description:
            "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
        solved: false,
    },
    {
        id: "5",
        title: "LRU Cache",
        difficulty: "Normal",
        tags: ["Hash Table", "Linked List", "Design"],
        description: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.",
        solved: false,
    },
]

export default function ProblemsPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [difficultyFilter, setDifficultyFilter] = useState("all")
    const [statusFilter, setStatusFilter] = useState("all")


    const filteredProblems = problems.filter((problem) => {
        // Search filter
        const matchesSearch =
            problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            problem.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

        // Difficulty filter
        const matchesDifficulty =
            difficultyFilter === "all" || problem.difficulty.toLowerCase() === difficultyFilter.toLowerCase()

        // Status filter
        const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "solved" && problem.solved) ||
            (statusFilter === "unsolved" && !problem.solved)

        return matchesSearch && matchesDifficulty && matchesStatus
    })

    return (
        <div className="container mx-auto py-6 px-4">
            <title>Lista de problemas</title>
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Problemas de programación</h1>
                <p className="text-muted-foreground">Practica tus conocimientos de programación con estos problemas</p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Busca problemas por nombre o etiquetas"
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                        <SelectTrigger className="w-[190px]">
                            <SelectValue placeholder="Dificultad" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas las dificultades</SelectItem>
                            <SelectItem value="Facil">Facil</SelectItem>
                            <SelectItem value="Normal">Normal</SelectItem>
                            <SelectItem value="Dificil">Dificil</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[190px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos los problemas</SelectItem>
                            <SelectItem value="solved">Resueltos</SelectItem>
                            <SelectItem value="unsolved">Sin resolver</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-4">
                {filteredProblems.length > 0 ? (
                    filteredProblems.map((problem) => (
                        <Card key={problem.id}>
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="flex items-center">
                                            <Link to={`/problems/${problem.id}`} className="hover:underline">
                                                {problem.title}
                                            </Link>
                                            {problem.solved && <CheckCircle2 className="ml-2 h-5 w-5 text-green-500" />}
                                        </CardTitle>
                                        <CardDescription className="mt-1">{problem.description}</CardDescription>
                                    </div>
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
                                </div>
                            </CardHeader>
                            <CardContent className="pb-2">
                                <div className="flex flex-wrap gap-2">
                                    {problem.tags.map((tag) => (
                                        <Badge key={tag} variant="outline">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between items-center">
                                <Button asChild>
                                    <Link to={`/problems/${problem.id}`}>{problem.solved ? "Revisar" : "Resolver"}</Link>
                                </Button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Abrir menu</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="mx-4">
                                        <DropdownMenuItem asChild>
                                            <AlertDialog>
                                                <AlertDialogTrigger className="w-full" >
                                                    <Button variant="ghost" className="w-full hover:bg-red-400">
                                                        <Flag className="h-5 w-5 mr-2" /> Reportar
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Reportar problema</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Comuniquenos si ha encontrado algún error en este problema.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <Label htmlFor="report" />
                                                    <Textarea
                                                        id="description"
                                                        name="description"
                                                        rows={5}                                                        
                                                        required
                                                        placeholder="Describa el problema que ha encontrado, cuanto más detallado mejor. Los administradores revisarán su reporte y tomarán las medidas necesarias. Gracias"
                                                    />
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                        <AlertDialogAction>Reportar</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </CardFooter>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-10">
                        <p className="text-muted-foreground">No se han encontrado problemas con este filtro.</p>
                        <Button
                            variant="link"
                            onClick={() => {
                                setSearchQuery("")
                                setDifficultyFilter("all")
                                setStatusFilter("all")
                            }}
                        >
                            Limpiar filtros
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

