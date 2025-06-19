"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Plus, Eye, X } from "lucide-react"
import { toast } from "sonner"
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query"
import { getProblemById, ProblemRead, ProblemUpdate, TestCase, updateProblem } from "@/client"
import { parseServerString } from "@/utils/utils"
import BadgeClosable from "@/components/ui/badge-closable"
import NotFound from "@/pages/public/not-found"
import { Loading } from "@/components/ui/loading"
import { Badge } from "@/components/ui/badge"
type InputType = 'int' | 'float' | 'string';
interface TypedInput {
    value: string;
    type: InputType;
}
export default function ProblemDetailPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const [testCases, setTestCases] = useState<TestCase[]>([])
    const [newTestCase, setNewTestCase] = useState<TestCase & { typedInputs: TypedInput[] }>({
        inputs: [],
        expected_output: "",
        description: "",
        typedInputs: [{ value: '', type: 'int' }]
    });

    // Añade estas funciones de manejo
    const handleAddTestCase = () => {
        throw new Error("Function not implemented.")
    }

    const { data: problem, isLoading, isError } = useQuery({
        queryKey: ["adminProblems", id],
        queryFn: async () => {
            if (!id) throw new Error("ID del problema no proporcionado")
            const response = await getProblemById({
                path: { problem_id: parseInt(id) }
            })
            if (response.status !== 200 || !("data" in response)) {
                toast.error(`Error ${response.status} al obtener el problema`)
                throw new Error(`Error ${response.status} al obtener el problema`)
            }
            return response.data
        },
        enabled: !!id,
        retry: false
    })

    // Estado local para manejar el formulario
    const [formData, setFormData] = useState<ProblemRead>({
        id: 0,
        title: "",
        description: "",
        difficulty: "",
        tags: "",
        authorID: 0,
        hints: "",
        score: 0,
    })
    // Inicializar el formulario con los datos del problema
    useEffect(() => {
        if (problem) {
            setFormData({
                id: problem.id,
                title: problem.title,
                description: problem.description,
                difficulty: problem.difficulty,
                tags: problem.tags || "",
                authorID: problem.authorID,
                hints: problem.hints || "",
                score: problem.score || 0,
            })
        }
    }, [problem])

    const [newTag, setNewTag] = useState("")

    // Mutaciones para actualizar el problema
    const updateProblemMutation = useMutation({
        mutationFn: async (updatedData: ProblemUpdate) => {
            const response = await updateProblem({
                body: updatedData,
                path: { problem_id: parseInt(id!) }
            })
            if (response.status !== 200 || !("data" in response)) {
                toast.error("Ha ocurrido un error al actualizar el problema")
                throw new Error(`Error ${response.status} al actualizar el problema`)
            }
        },
        onSuccess: () => {
            toast.success("Problema actualizado exitosamente")
            queryClient.invalidateQueries({ queryKey: ["adminProblems", id] })
        },
        onError: (error) => {
            toast.error(`Error al actualizar el problema: ${error instanceof Error ? error.message : "Error desconocido"}`)
        }
    })

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        updateProblemMutation.mutateAsync(formData)
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

    if (!id) return <NotFound />
    if (isLoading) {
        return (
            <div className="container mx-auto py-6 px-4">
                <Loading message="Cargando problema... Espere un momento" />
            </div>
        )
    }
    if (isError) {
        return (
            <div className="container mx-auto py-6 px-4">
                <h1 className="text-3xl font-bold mb-4">Error al cargar los usuarios</h1>
                <p className="text-red-500">No se pudieron cargar los usuarios. Por favor, inténtalo de nuevo más tarde.</p>
                <Link to="/admin/problems" className="text-blue-500 hover:underline mt-4 inline-block">
                    Volver a la lista de problemas
                </Link>
            </div>
        )
    }

    function handleRemoveTestCase(index: number): void {
        throw new Error("Function not implemented." + index)
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
                                <CardTitle>Casos de prueba (tests)</CardTitle>
                                <CardDescription>Añada las pruebas necesarias para validar la solución</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {testCases.map((testCase, index) => (
                                        <Card key={index} className="p-4 border border-border">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="space-y-1">
                                                    <p className="font-medium">Caso de prueba #{index + 1}</p>
                                                    {testCase.description && (
                                                        <p className="text-sm text-muted-foreground">{testCase.description}</p>
                                                    )}
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleRemoveTestCase(index)}
                                                    className="text-destructive"
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <div className="grid gap-2 text-sm">
                                                <p>
                                                    <span className="font-medium">Entradas: </span>
                                                    {testCase.inputs.map((input: any, i) => (
                                                        <span key={i} className={`
                                                            ${typeof input === 'number' && Number.isInteger(input) ? 'text-blue-500' : ''}
                                                            ${typeof input === 'number' && !Number.isInteger(input) ? 'text-green-500' : ''}
                                                            ${typeof input === 'string' ? 'text-purple-500' : ''}
                                                        `}>
                                                            {typeof input === 'string' ? `"${input}"` : input}
                                                            {i < testCase.inputs.length - 1 ? ', ' : ''}
                                                        </span>
                                                    ))}
                                                </p>
                                                <p><span className="font-medium">Salida esperada:</span> {testCase.expected_output}</p>
                                            </div>
                                        </Card>
                                    ))}
                                </div>

                                {/* Formulario para nuevo caso de prueba */}
                                <div className="space-y-4 border-t pt-4">
                                    <h4 className="font-medium">Añadir nuevo caso de prueba</h4>
                                    <Card className="border border-border p-2">
                                        <div className="grid grid-cols-2 gap-2">
                                            <Input type="text"
                                                placeholder="Descripción del caso de prueba"
                                                value={newTestCase.description}
                                                onChange={(e) => setNewTestCase(prev => ({
                                                    ...prev,
                                                    description: e.target.value
                                                }))}
                                            />
                                            <Input type="text"
                                                placeholder="Nombre de la función a evaluar"
                                                value={newTestCase.description}
                                                onChange={(e) => setNewTestCase(prev => ({
                                                    ...prev,
                                                    description: e.target.value
                                                }))}
                                            />
                                        </div>

                                        <Label>Entradas con tipo</Label>

                                        {newTestCase.typedInputs.map((input, index) => (
                                            <div key={index} className="flex gap-2">
                                                <Input
                                                    value={input.value}
                                                    onChange={(e) => {
                                                        const newInputs = [...newTestCase.typedInputs];
                                                        newInputs[index].value = e.target.value;
                                                        setNewTestCase(prev => ({
                                                            ...prev,
                                                            typedInputs: newInputs
                                                        }));
                                                    }}
                                                    placeholder={`Valor ${index + 1}`}
                                                    className="flex-1"
                                                />
                                                <Select
                                                    value={input.type}
                                                    onValueChange={(value: InputType) => {
                                                        const newInputs = [...newTestCase.typedInputs];
                                                        newInputs[index].type = value;
                                                        setNewTestCase(prev => ({
                                                            ...prev,
                                                            typedInputs: newInputs
                                                        }));
                                                    }}
                                                >
                                                    <SelectTrigger className="w-[120px]">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="int">Entero</SelectItem>
                                                        <SelectItem value="float">Decimal</SelectItem>
                                                        <SelectItem value="string">Texto</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <Button
                                                    type="button"
                                                    variant="default"
                                                    size="icon"
                                                    onClick={() => {
                                                        const newInputs = newTestCase.typedInputs.filter((_, i) => i !== index);
                                                        setNewTestCase(prev => ({
                                                            ...prev,
                                                            typedInputs: newInputs
                                                        }));
                                                    }}

                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => {
                                                        const newInputs = newTestCase.typedInputs.filter((_, i) => i !== index);
                                                        setNewTestCase(prev => ({
                                                            ...prev,
                                                            typedInputs: newInputs
                                                        }));
                                                    }}
                                                    className="text-destructive"
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}

                                        <Label>Salida esperada</Label>
                                        <Input
                                            type="text"
                                            placeholder="Salida esperada"
                                            value={newTestCase.expected_output}
                                            onChange={(e) => setNewTestCase(prev => ({
                                                ...prev,
                                                expected_output: e.target.value
                                            }))}
                                            className="mt-2"
                                            required
                                        />
                                        <div className="flex gap-2 mt-2">
                                            <Button
                                                type="button"
                                                onClick={() => {
                                                        setNewTestCase(prev => ({
                                                            ...prev,
                                                            typedInputs: [...prev.typedInputs, { value: '', type: 'int' }]
                                                        }));
                                                    }}
                                                className="w-1/3 mx-2"
                                                variant="secondary"
                                            >
                                                <Plus className="h-4 w-4 mr-2" />
                                                Añadir entrada
                                            </Button>
                                            <Button
                                                type="button"
                                                onClick={() => console.log("!TODO: Guardar caso de prueba")}
                                                className="w-1/3 mx-2"
                                                variant="default"
                                            >
                                                <Save className="h-4 w-4 mr-2" />
                                                Guardar caso de prueba
                                            </Button>
                                        </div>
                                    </Card>
                                </div>
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
                                <div className="text-sm text-muted-foreground mb-2">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        asChild
                                        className="ml-2"
                                    >
                                        <Link to={`/admin/users/${formData.authorID}`}>
                                            <Eye className="h-4 w-4 mr-1" />
                                            Ver autor
                                        </Link>
                                    </Button>
                                </div>
                                <div className="space-y-2 grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="difficulty" className="font-semibold my-2">Dificultad</Label>
                                        <Badge
                                            className={
                                                problem?.difficulty === "Facil"
                                                    ? "bg-green-500"
                                                    : problem?.difficulty === "Normal"
                                                        ? "bg-yellow-500"
                                                        : "bg-red-500"
                                            }
                                        >
                                            {problem?.difficulty}
                                        </Badge>
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
                                <CardDescription>Al hacer clic al boton, el problema estará publicado en la plataforma con los nuevos cambios.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-2">
                                    <Button type="submit" disabled={updateProblemMutation.isPending} className="flex-1">
                                        <Save className="mr-2 h-4 w-4" />
                                        {updateProblemMutation.isPending ? "Guardando..." : "Guardar"}
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

