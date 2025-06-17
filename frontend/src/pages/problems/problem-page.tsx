"use client"

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Send } from "lucide-react"
import Editor from "@/components/editor"
import { getProblemById, getCommentsByProblemId, createComment, CommentCreate } from "@/client"
import { parseServerString, formatDate } from "@/utils/utils"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Loading } from "@/components/ui/loading"
import { getUserId } from "@/hooks/useAuth"
import { createSubmission } from "@/client"

const starterCode = {
    javascript: `function nombreFuncion(arg1, arg2) {
  // Tu código aquí
};`,
    python: `def nombreFuncion(arg1, arg2):
    # Tu código aquí
    pass`,
    C: `#include <stdio.h>
int nombreFuncion(int arg1, int arg2) {
// Tu código aquí
}`
}
export default function ProblemDetailPage() {
    const { id } = useParams<{ id: string }>()
    const userId = parseInt(getUserId()!)
    const queryClient = useQueryClient()

    // Query para obtener el problema por ID
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

    // Query para obtener los comentarios del problema
    const { data: commentsData, isLoading: commentsLoading, isError: commentsError } = useQuery({
        queryKey: ["commentsProblem", id],
        queryFn: async () => {
            if (!id) throw new Error("ID del problema no proporcionado")
            const response = await getCommentsByProblemId({
                path: { problem_id: parseInt(id!) }
            })
            if (response.status !== 200 || !("data" in response)) {
                toast.error(`Error ${response.status} al obtener los comentarios`)
                throw new Error(`Error ${response.status} al obtener los comentarios`)
            }
            return response.data?.comments
        }
    })

    // Mutacion para crear un nuevo comentario
    const newCommentMutation = useMutation({
        mutationFn: async (data: CommentCreate) => {
            const response = await createComment({
                body: data
            })
            if (response.status !== 200 && !("data" in response)) {
                toast.error(`Error al crear el comentario`)
                throw new Error(`Error al crear el comentario`)
            }
            return response.data;
        },
        onSuccess: (newComment) => {
            console.log("Comentario creado exitosamente:", newComment);
            queryClient.invalidateQueries({ queryKey: ["commentsProblem", id] });
            setComments(commentsData || [])
            setNewComment("")
        },
        onError: (error) => {
            console.error("Error al crear el comentario:", error);
            toast.error("Error al crear el comentario")
        }
    })

    //Mutacion para subir una solucion
    const newSubmissionMutation = useMutation({
        mutationFn: async (data: {
            code: string,
            language: string,
            problemID: number,
            userID: number,
            status: string
        }) => {
            const response = await createSubmission({
                body: data
            })
            if (response.status !== 200 && !("data" in response)) {
                throw new Error(`Error al subir la solución`)
            }
            return response.data;
        },
        onSuccess: (newSubmission) => {
            console.log("Solución subida exitosamente:", newSubmission);
            toast.success("Solución subida correctamente")
        },
        onError: (error) => {
            console.error(error);
            toast.error("Error al subir la solución")
        }
    })

    const [language, setLanguage] = useState("javascript")
    const [code, setCode] = useState(starterCode.javascript)
    const [activeTab, setActiveTab] = useState("description")
    const [newComment, setNewComment] = useState("")
    const [comments, setComments] = useState(commentsData || [])
    const [output, setOutput] = useState("")
    const [isRunning, setIsRunning] = useState(false)

    // useEffect para actualizar los comentarios cuando cambian los datos
    useEffect(() => {
        if (commentsData) {
            setComments(commentsData)
        }
    }, [commentsData])

    const handleLanguageChange = (lang: string) => {
        setLanguage(lang)
        setCode(starterCode[lang as keyof typeof starterCode])
    }

    const handleRunCode = () => {
        setIsRunning(true)
        setOutput("Ejecutando codigo...\n")

        // Simulación de ejecución del código
        setTimeout(() => {
            setOutput("Output: [0, 1]\nTest cases passed: 3/3\nExecution time: 42ms")
            setIsRunning(false)
        }, 1000)
    }

    const handleSubmitComment = () => {
        if (!newComment.trim()) return
        const commentData = {
            content: newComment,
            problemID: parseInt(id!),
            userID: userId!,
        }
        newCommentMutation.mutate(commentData)
    }

    const handleCodeSubmit = () => {
        if (!code.trim()) {
            toast.warning("El código no puede estar vacío")
            return
        }
        newSubmissionMutation.mutateAsync({
            code: JSON.stringify(code),
            language,
            problemID: parseInt(id!),
            userID: userId!,
            status: "Pendiente"
        })
    }
    const navigate = useNavigate();

    if (isLoading || commentsLoading) {
        return (
            <div className="container mx-auto py-6 px-4">
                <h1 className="text-3xl font-bold mb-4">Error al cargar los detalles del problema</h1>
                <p className="text-red-500">No se pudieron cargar los detalles del problema. Por favor, inténtalo de nuevo más tarde.</p>
                <Button variant="outline" onClick={() => navigate(-1)}>
                    Volver
                </Button>
            </div>
        )
    }
    if (isError || commentsError) {
        return (
            <div className="container mx-auto py-6 px-4">
                <Loading message="Cargando detalles... Espere un momento" />
            </div>
        )
    }

    if (!problem || !id) return <div>Problema no encontrado</div>

    return (
        <div className="container mx-auto py-6 px-4">
            <title>{problem.title}</title>
            <div className="flex items-center mb-6">
                <Button variant="ghost" size="sm" className="mr-2" onClick={() => navigate(-1)}>
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Volver
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">{problem.title}</h1>
                    <div className="flex items-center mt-1 space-x-2">
                        <Badge
                            className={
                                problem.difficulty === "Facil"
                                    ? "bg-green-500"
                                    : problem.difficulty === "Normal"
                                        ? "bg-yellow-500"
                                        : "bg-red-500"
                            }>
                            {problem.difficulty}
                        </Badge>
                        {parseServerString(problem.tags).map((tag) => (
                            <Badge key={tag} variant="outline"> {tag} </Badge>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <Card className="border rounded-md overflow-hidden">
                        <CardHeader className="pb-2">
                            <Tabs value={activeTab} onValueChange={setActiveTab}>
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="description">Descripcion</TabsTrigger>
                                    <TabsTrigger value="hints">Pistas</TabsTrigger>
                                    <TabsTrigger value="discussion">Comentarios</TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="hints" value={activeTab}>
                                <TabsContent value="description" className="mt-0">
                                    <div className="prose dark:prose-invert max-w-none max-h-[calc(100vh-300px)] overflow-auto">
                                        <pre className="whitespace-pre-wrap font-sans text-sm">{problem.description}</pre>
                                    </div>
                                </TabsContent>
                                <TabsContent value="hints" className="mt-0">
                                    <div className="space-y-4">
                                        <div className="p-4 border rounded-md">
                                            <h3 className="font-medium mb-2">Pista</h3>
                                            <p>{problem.hints}</p>
                                        </div>
                                    </div>
                                </TabsContent>
                                <TabsContent value="discussion" className="mt-0">
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-2">
                                            <Textarea
                                                placeholder="Añadir un comentario o una pregunta..."
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                                className="flex-1"
                                            />
                                            <Button onClick={handleSubmitComment}>
                                                <Send className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        {comments?.map((comment) => (
                                            <div key={comment.id} className="p-4 border rounded-md">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <div>
                                                        <p className="font-medium">{comment.user.username}</p>
                                                        <p className="text-xs text-muted-foreground">{formatDate(comment.timePosted)}</p>
                                                    </div>
                                                </div>
                                                <p className="mb-2">{comment.content}</p>
                                            </div>
                                        ))}
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Tabs value={language} onValueChange={handleLanguageChange}>
                                <TabsList>
                                    <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                                    <TabsTrigger value="python">Python</TabsTrigger>
                                    <TabsTrigger value="C">C</TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button onClick={handleRunCode} disabled={isRunning}>
                                {isRunning ? "Ejecutando..." : "Ejecutar"}
                            </Button>
                            <Button variant="default" onClick={handleCodeSubmit}>Subir solucion</Button>
                        </div>
                    </div>

                    <Card className="border h-[calc(100vh-300px)] pb-0 pt-0.5 px-0.5">
                        <Editor language={language} code={code} theme="vs-dark" setCode={setCode} />
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle>Salida</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="p-4 h-[200px] bg-black text-white font-mono text-sm overflow-auto whitespace-pre-wrap rounded-md">
                                {output || "Ejecuta el código y la salida se mostrará aquí..."}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

