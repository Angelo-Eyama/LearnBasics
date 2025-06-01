"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MoreHorizontal, Flag } from "lucide-react"
import { FaStar } from "react-icons/fa6";
import { parseServerString } from "@/utils/utils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { getProblems, ProblemRead } from "@/client"
import { useQuery } from "@tanstack/react-query"

export default function ProblemsPage() {
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState("")
    const [difficultyFilter, setDifficultyFilter] = useState("Todas")
    const { data: problemsData } = useQuery({
        queryKey: ["problems"],
        queryFn: async () => {
            const response = await getProblems()
            if (response.status === 200 && 'data' in response) {
                return response.data
            }
            throw new Error("Error al obtener los problemas")
        }
    })
    if (!problemsData) return null

    const filteredProblems = problemsData.filter((problem) => {
        const matchesSearch =
            problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            parseServerString(problem.tags).some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

        const matchesDifficulty =
            difficultyFilter === "Todas" || problem.difficulty.toLowerCase() === difficultyFilter.toLowerCase()

        return matchesSearch && matchesDifficulty
    })
    const handleClickProblem = (problemId: number) => {
        const problem = problemsData.find((problem: ProblemRead) => problem.id === problemId)
        navigate(`/problems/${problemId}`, {
            state: { problemData: problem }
        }
        )
    }

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
                            <SelectItem value="Todas">Todas las dificultades</SelectItem>
                            <SelectItem value="Facil">Facil</SelectItem>
                            <SelectItem value="Normal">Normal</SelectItem>
                            <SelectItem value="Dificil">Dificil</SelectItem>
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
                                            <span
                                                className="hover:underline cursor-pointer"
                                                onClick={() => handleClickProblem(problem.id)}
                                            >
                                                {problem.title}
                                            </span>
                                            
                                            <Badge className="ml-2">
                                                <FaStar className="h-3 w-3" />
                                                {problem.score} Puntos
                                            </Badge>
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
                                    {parseServerString(problem.tags).map((tag) => (
                                        <Badge key={tag} variant="outline">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between items-center">
                                <Button onClick={() => handleClickProblem(problem.id)}>
                                    Resolver
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
                                setDifficultyFilter("Todas")
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

