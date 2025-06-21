"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Plus, Eye, X, Trash } from "lucide-react"
import { toast } from "sonner"
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query"
import { parseServerString } from "@/utils/utils"
import BadgeClosable from "@/components/ui/badge-closable"
import NotFound from "@/pages/public/not-found"
import { Loading } from "@/components/ui/loading"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    getProblemById,
    ProblemRead,
    ProblemUpdate,
    updateProblem,
    getTestCasesByProblemId,
    TestCaseCreate,
    createTestCase,
    deleteTestCase
} from "@/client"

type InputType = 'int' | 'string' | 'float' | 'bool';
export default function ProblemDetailPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const [newTestCase, setNewTestCase] = useState<TestCaseCreate>({
        description: "",
        inputs: [],
        expected_output: "",
        problemID: parseInt(id!),
    });
    const [newTag, setNewTag] = useState("")

    // Query para obtener los datos del problema
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

    // Query para obtener los casos de prueba del problema
    const { data: testCases = [] } = useQuery({
        queryKey: ["testCases", id],
        queryFn: async () => {
            if (!id) throw new Error("ID del problema no proporcionado")
            const response = await getTestCasesByProblemId({
                path: { problem_id: parseInt(id) }
            })
            if (response.status !== 200 || !("data" in response)) {
                toast.error(`Error ${response.status} al obtener los casos de prueba`)
                throw new Error(`Error ${response.status} al obtener los casos de prueba`)
            }
            return response.data
        }
    })

    // Estado local para manejar el formulario del problema
    const [formData, setFormData] = useState<ProblemRead>({
        id: 0,
        title: "",
        description: "",
        difficulty: "",
        tags: "",
        functionName: "",
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
                functionName: problem.functionName || "",
                tags: problem.tags || "",
                authorID: problem.authorID,
                hints: problem.hints || "",
                score: problem.score || 0,
            })
        }
    }, [problem])


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

    // Mutación para crear un nuevo caso de prueba
    const createTestCaseMutation = useMutation({
        mutationFn: async (testCase: TestCaseCreate) => {
            const response = await createTestCase({
                body: testCase
            })
            if (response.status !== 200 || !("data" in response)) {
                toast.error(`Error ${response.status}`, {
                    description: Array.isArray(response.error?.detail)
                        ? response.error.detail.map((err: any) => err.msg || JSON.stringify(err)).join(", ")
                        : (response.error?.detail || "Error al crear el caso de prueba")
                });
                throw new Error(`Error ${response.status} al crear el caso de prueba")`);
            }
            return response.data
        },
        onSuccess: () => {
            toast.success("Caso de prueba creado exitosamente")
            queryClient.invalidateQueries({ queryKey: ["testCases", id] })
            setNewTestCase({
                description: "",
                inputs: [],
                expected_output: "",
                problemID: parseInt(id!),
            })
        }
    })

    //Mutación para eliminar un caso de prueba
    const deleteTestCaseMutation = useMutation({
        mutationFn: async (testCaseID: number) => {
            const response = await deleteTestCase({
                path: { test_case_id: testCaseID }
            })
            if (response.status !== 200 || !("data" in response)) {
                toast.error(`Error ${response.status}`, {
                    description: Array.isArray(response.error?.detail)
                        ? response.error.detail.map((err: any) => err.msg || JSON.stringify(err)).join(", ")
                        : (response.error?.detail || "Error al eliminar el reporte")
                });
                throw new Error(`Error ${response.status} al eliminar el reporte`);
            }
        },
        onSuccess: () => {
            toast.success("Caso de prueba eliminado exitosamente")
            queryClient.invalidateQueries({ queryKey: ["testCases", id] })
        }
    })

    const handleAddTestCase = () => {
        if (!newTestCase.expected_output || !newTestCase.description) {
            toast.warning("Por favor, complete todos los campos obligatorios: Descripcion y salida esperada");
            return;
        }
        if (newTestCase.inputs!.some(input => input.value === '')) {
            toast.warning("Por favor, complete todos los valores de entrada declarados");
            return;
        }

        // Convertir los valores según su tipo
        const formattedInputs = newTestCase.inputs!.map(input => {
            let formattedValue: any;

            switch (input.type) {
                case 'int':
                    formattedValue = parseInt(String(input.value));
                    break;
                case 'float':
                    formattedValue = parseFloat(String(input.value));
                    break;
                case 'bool':
                    formattedValue = input.value === 'True' ? true : false;
                    break;
                case 'string':
                default:
                    formattedValue = input.value;
                    break;
            }

            return {
                type: input.type,
                value: formattedValue
            };
        });

        // Crear un nuevo objeto con los datos correctos
        const testCaseToCreate: TestCaseCreate = {
            description: newTestCase.description,
            inputs: formattedInputs,
            expected_output: newTestCase.expected_output,
            problemID: parseInt(id!)
        };

        // Enviar la mutación con el objeto correcto
        createTestCaseMutation.mutateAsync(testCaseToCreate);
    }

    const handleRemoveTestCase = (testCaseId: number) => {
        deleteTestCaseMutation.mutate(testCaseId);
    };

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

    const handleAddTag = () => {
        if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
            setFormData((prev) => ({
                ...prev,
                tags: prev.tags ? prev.tags.concat(', ', newTag.trim()) : newTag.trim(),
            }))
            setNewTag("")
        }
    }

    const handleRemoveTag = (tagToRemove: string) => {
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
                        <Card className="border-4">
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
                                        placeholder="Proporcione una descripción detallada del problema, con ejemplos de entrada y salida, y restricciones."
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="functionName">Nombre de la funcion a probar</Label>
                                    <Input
                                        id="functionName"
                                        name="functionName"
                                        placeholder="Si el problema pide una funcion, indique su nombre"
                                        value={formData.functionName}
                                        onChange={handleFormChange}
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
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card className="border-4">
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
                                                onClickEvent={handleRemoveTag}
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
                                                    handleAddTag()
                                                }
                                            }}
                                        />
                                        <Button type="button" size="sm" onClick={handleAddTag}>
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-4">
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

            <Card className="mt-6 border-4">
                <CardHeader>
                    <CardTitle>Casos de prueba (tests)</CardTitle>
                    <CardDescription>Añada las pruebas necesarias para validar la solución</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {/* Listado de tests para este problema */}
                        {testCases.map((testCase, index) => (
                            <Card key={testCase.id || index} className="p-4 border border-border">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="space-y-1">
                                        <p className="font-medium">Caso de prueba #{index + 1}</p>
                                        <p className="text-sm text-muted-foreground">{testCase.description}</p>
                                    </div>
                                    <AlertDialog>
                                        <AlertDialogTrigger>
                                            <Button
                                                variant="outline"
                                                className="text-destructive hover:bg-destructive/80 "
                                                disabled={deleteTestCaseMutation.isPending}
                                            >
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Eliminar caso de prueba</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    ¿Estás seguro de que deseas eliminar este caso de prueba? Esta acción no se puede deshacer.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => handleRemoveTestCase(testCase.id)}
                                                    className="destructive hover:bg-red-500"
                                                >
                                                    Eliminar
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                                <div className="grid gap-2 text-sm">
                                    <p>
                                        {testCase.inputs && <span className="font-medium">Entradas: </span>}
                                        {testCase.inputs && testCase.inputs.map((input, i) => (
                                            <span key={i}>
                                                {String(input.value)}
                                                <span className="opacity-70">({input.type})  </span>
                                            </span>
                                        ))}
                                    </p>
                                    <p>
                                        <span className="font-medium">Salida esperada: </span>
                                        <span className="px-1.5 py-0.5">{testCase.expected_output}</span>
                                    </p>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* Formulario para nuevo caso de prueba */}
                    <div className="space-y-4 border-t pt-4">
                        <h4 className="font-medium">Añadir nuevo caso de prueba</h4>
                        <ul>
                            <li>Para las entradas booleanas, debe indicar <span className="font-bold">True</span> o <span className="font-bold">False</span> según aplique.</li>
                        </ul>
                        <Card className="border border-border p-4">
                            <div className="grid gap-4">
                                <div>
                                    <Label htmlFor="testDescription">Descripción del caso de prueba</Label>
                                    <Input
                                        id="testDescription"
                                        placeholder="¿Qué se está probando con este caso?"
                                        value={String(newTestCase.description)}
                                        onChange={(e) => setNewTestCase(prev => ({
                                            ...prev,
                                            description: e.target.value
                                        }))}
                                        className="mt-1"
                                    />
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <Label>Entradas con tipo</Label>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setNewTestCase(prev => ({
                                                    ...prev,
                                                    inputs: [...prev.inputs!, { type: 'int', value: '' }]
                                                }));
                                            }}
                                        >
                                            <Plus className="h-4 w-4 mr-1" />
                                            Añadir entrada
                                        </Button>
                                    </div>

                                    <div className="space-y-2">
                                        {newTestCase.inputs!.map((input, index) => (
                                            <div key={index} className="flex gap-2 items-center">
                                                <Input
                                                    value={String(input.value)}
                                                    onChange={(e) => {
                                                        const newInputs = [...newTestCase.inputs!];
                                                        newInputs[index].value = e.target.value;
                                                        setNewTestCase(prev => ({
                                                            ...prev,
                                                            inputs: newInputs
                                                        }));
                                                    }}
                                                    placeholder={`Valor ${index + 1}`}
                                                    className="flex-1"
                                                />
                                                <Select
                                                    value={input.type}
                                                    onValueChange={(value: InputType) => {
                                                        const newInputs = [...newTestCase.inputs!];
                                                        newInputs[index].type = value as InputType;
                                                        setNewTestCase(prev => ({
                                                            ...prev,
                                                            inputs: newInputs
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
                                                        <SelectItem value="bool">Booleano</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    onClick={() => {
                                                        const newInputs = newTestCase.inputs!.filter((_, i) => i !== index);
                                                        setNewTestCase(prev => ({
                                                            ...prev,
                                                            inputs: newInputs
                                                        }));
                                                    }}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="expectedOutput">Salida esperada</Label>
                                    <Input
                                        id="expectedOutput"
                                        placeholder="Resultado que debe producir la función"
                                        value={newTestCase.expected_output}
                                        onChange={(e) => setNewTestCase(prev => ({
                                            ...prev,
                                            expected_output: e.target.value
                                        }))}
                                        className="mt-1"
                                        required
                                    />
                                </div>

                                <Button
                                    type="button"
                                    onClick={handleAddTestCase}
                                    disabled={createTestCaseMutation.isPending}
                                    className="w-full"
                                >
                                    {createTestCaseMutation.isPending ? (
                                        <>Guardando...</>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4 mr-2" />
                                            Guardar caso de prueba
                                        </>
                                    )}
                                </Button>
                            </div>
                        </Card>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

