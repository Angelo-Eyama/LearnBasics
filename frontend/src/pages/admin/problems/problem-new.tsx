"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Plus } from "lucide-react"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { createProblem, ProblemCreate } from "@/client"
import { useMutation } from "@tanstack/react-query"
import { parseServerString } from "@/utils/utils"
import BadgeClosable from "@/components/ui/badge-closable"

export default function NewProblemPage() {
    const [formData, setFormData] = useState<ProblemCreate>({
        authorID: 1,
        title: "",
        description: "",
        difficulty: "",
        tags: "",
        hints: "",
        score: 0,
    })
    const navigate = useNavigate()
    const createProblemMutation = useMutation({
        mutationFn: async (data: ProblemCreate) => {
            const response = await createProblem({ body: data })
            if (response.status !== 200 || !("data" in response)) {
                toast.error(`Error ${response.status}`, {
                    description: Array.isArray(response.error?.detail)
                        ? response.error.detail.map((err: any) => err.msg || JSON.stringify(err)).join(", ")
                        : (response.error?.detail || "Error al crear el problema"),
                })
                throw new Error(`Error ${response.status} al crear el problema`)
            }
            navigate("/admin/problems")
            return response.data
        }
    })

    const [newTag, setNewTag] = useState("")

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        createProblemMutation.mutateAsync(formData)
    }

    const handleCodeChange = (language: string, code: string) => {
        console.log(`Código actualizado para ${language}:`, code)
    }

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const addTag = () => {
        if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
            setFormData((prev) => ({
                ...prev,
                tags: prev.tags ? prev.tags.concat(', ', newTag.trim()) : newTag.trim(),
            }))
            setNewTag("")
        }
    }

    const removeTag = (tagToRemove: string) => {
        setFormData((prev) => ({
            ...prev,
            tags: prev.tags.split(', ').filter(tag => tag !== tagToRemove).join(', ')
        }))
    }

    return (
        <div className="container mx-auto py-6 px-4">
            <title>Nuevo problema</title>
            <div className="flex items-center mb-6">
                <Button variant="ghost" size="sm" className="mr-2" onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Volver
                </Button>
                <h1 className="text-3xl font-bold">Crear nuevo problema</h1>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Detalles del problema</CardTitle>
                                <CardDescription>Información básica del problema</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Titulo</Label>
                                    <Input id="title" name="title" value={formData.title} onChange={handleFormChange} required />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Descripción</Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        rows={10}
                                        value={formData.description}
                                        onChange={handleFormChange}
                                        required
                                        placeholder="Proporcione una descripción detallada del problema, con ejemplos de entrada y salida, y restricciones."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="hints">Pista</Label>
                                    <Input
                                        id="hints"
                                        name="hints"
                                        placeholder="Añada pistas para ayudar a los usuarios a resolver el problema"
                                        value={formData.hints}
                                        onChange={handleFormChange}
                                        required
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Prototipo de código</CardTitle>
                                <CardDescription>Proporcione un trozo de código en diferentes lenguajes de programación</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="javascript">JavaScript</Label>
                                    <Textarea
                                        id="javascript"
                                        rows={6}
                                        value={"formData.starterCode.javascript"}
                                        onChange={(e) => handleCodeChange("javascript", e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="python">Python</Label>
                                    <Textarea
                                        id="python"
                                        rows={6}
                                        value={"formData.starterCode.python}"}
                                        onChange={(e) => handleCodeChange("python", e.target.value)}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Casos de prueba (tests)</CardTitle>
                                <CardDescription>Añada las pruebas necesarias para validar la solución</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Textarea
                                    id="testCases"
                                    name="testCases"
                                    rows={6}
                                    value={"formData.testCases"}

                                    placeholder="Input: nums = [2,7,11,15], target = 9
Output: [0,1]

Input: nums = [3,2,4], target = 6
Output: [1,2]"
                                />
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Ajustes del problema</CardTitle>
                                <CardDescription>Configura los detalles del problema</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2 grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="difficulty" className="font-semibold my-2">Dificultad</Label>
                                        {
                                            formData.difficulty!! &&
                                            <Badge
                                                className={
                                                    formData.difficulty === "Facil"
                                                        ? "bg-green-500"
                                                        : formData?.difficulty === "Normal"
                                                            ? "bg-yellow-500"
                                                            : "bg-red-500"
                                                }
                                            >
                                                {formData.difficulty}
                                            </Badge>
                                        }
                                        <Select
                                            value={formData?.difficulty}
                                            onValueChange={(value) => handleSelectChange("difficulty", value)}
                                        >
                                            <SelectTrigger className="mt-2">
                                                <SelectValue placeholder="Nueva dificultad" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Facil">Facil</SelectItem>
                                                <SelectItem value="Normal">Normal</SelectItem>
                                                <SelectItem value="Dificil">Dificil</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="score" className="font-semibold my-2">Puntuacion</Label>
                                        <Input
                                            id="score"
                                            name="score"
                                            type="number"
                                            value={formData.score}
                                            onChange={handleFormChange}
                                            placeholder="Puntuación del problema"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="font-semibold">Etiquetas</Label>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {parseServerString(formData.tags).map((tag) => (
                                            <BadgeClosable
                                                key={tag}
                                                text={tag}
                                                roleName={tag}
                                                onClickEvent={removeTag}
                                            />
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <Input
                                            value={newTag}
                                            onChange={(e) => setNewTag(e.target.value)}
                                            placeholder="Añada alguna etiqueta"
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault()
                                                    addTag()
                                                }
                                            }}
                                        />
                                        <Button type="button" size="sm" onClick={addTag}>
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Guardar</CardTitle>
                                <CardDescription>Al hacer clic al boton, el problema pasará a estar publicado en la plataforma</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-2">
                                    <Button type="submit" disabled={createProblemMutation.isPending} className="flex-1">
                                        <Save className="mr-2 h-4 w-4" />
                                        {createProblemMutation.isPending ? "Guardando..." : "Guardar"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </div>
    )
}

