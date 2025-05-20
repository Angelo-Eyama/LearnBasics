"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Send } from "lucide-react"
import Editor from "@/components/editor"
import { getCommentsByProblemId, type ProblemRead, createComment, CommentCreate, CommentRead } from "@/client"
import { useLocation } from "react-router-dom"
import { parseServerString, formatDate } from "@/utils/utils"
import { useQuery, useMutation, QueryClient } from "@tanstack/react-query"
import useAuth from "@/hooks/useAuth"


// Mock problem data
const problema = {
    id: "1",
    title: "Two Sum",
    difficulty: "Easy",
    tags: ["Arrays", "Hash Table"],
    description: `
Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

Example 1:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].

Example 2:
Input: nums = [3,2,4], target = 6
Output: [1,2]

Example 3:
Input: nums = [3,3], target = 6
Output: [0,1]

Constraints:
- 2 <= nums.length <= 10^4
- -10^9 <= nums[i] <= 10^9
- -10^9 <= target <= 10^9
- Only one valid answer exists.
  `,
    hints: [
        "A really brute force way would be to search for all possible pairs of numbers but that would be too slow.",
        "Try to use the fact that the complement of the number we need is already in the hash table.",
    ],
    starterCode: {
        javascript: `function twoSum(nums, target) {
  // Your code here
};`,
        python: `def two_sum(nums, target):
    # Your code here
    pass`,
    },
    comments: [
        {
            id: "1",
            user: {
                name: "Alex Johnson",
                avatar: "/placeholder.svg?height=40&width=40",
            },
            content: "I found it helpful to use a hash map to store the numbers I've seen so far, along with their indices.",
            timestamp: "2 days ago",
            likes: 5,
        },
        {
            id: "2",
            user: {
                name: "Maria Garcia",
                avatar: "/placeholder.svg?height=40&width=40",
            },
            content: "Watch out for edge cases like duplicate numbers in the array!",
            timestamp: "1 week ago",
            likes: 3,
        },
    ],
}

const starterCode = {
    javascript: `function twoSum(nums, target) {
  // Your code here
};`,
    python: `def two_sum(nums, target):
    # Your code here
    pass`,
}
// Prototipo: export default function ProblemDetailPage({ params }: { params: { id: string } })
export default function ProblemDetailPage() {
    const queryClient = new QueryClient()
    const location = useLocation();
    const problem: ProblemRead = location.state?.problemData;
    const { user } = useAuth()
    const { data: commentsData } = useQuery({
        queryKey: ["comments", problem.id],
        queryFn: async () => {
            const response = await getCommentsByProblemId({
                path: {
                    problem_id: problem.id,
                }
            })
            if (response.status === 200 && response.data) {
                return response.data;
            }
            throw new Error("Error al obtener comentarios")
        },

    })
    const [language, setLanguage] = useState("javascript")
    const [code, setCode] = useState(starterCode.javascript)
    const [activeTab, setActiveTab] = useState("description")
    const [newComment, setNewComment] = useState("")
    const [comments, setComments] = useState(commentsData || [])
    const [output, setOutput] = useState("")
    const [isRunning, setIsRunning] = useState(false)

    const handleLanguageChange = (lang: string) => {
        setLanguage(lang)
        setCode(starterCode.python)
    }

    const handleRunCode = () => {
        setIsRunning(true)
        setOutput("Ejecutando codigo...\n")

        // Simulate code execution with a timeout
        setTimeout(() => {
            setOutput("Output: [0, 1]\nTest cases passed: 3/3\nExecution time: 42ms")
            setIsRunning(false)
        }, 1000)
    }

    const newCommentMutation = useMutation({
        mutationFn: async (data: CommentCreate) => {
            const response = await createComment({
                body: {
                    content: data.content,
                    problemID: problem.id,
                    userID: user?.id || 4,
                }
            })
            if (response.status === 200 && response.data) {
                return response.data;
            }
        },
        onSuccess: (newComment) => {
                console.log("Comentario creado exitosamente:", newComment);
                queryClient.invalidateQueries({queryKey: ["comments", problem.id]});
                setComments(commentsData || [])
                setNewComment("")
        }
    })

    const handleSubmitComment = () => {
        if (!newComment.trim()) return
        const commentData = {
            content: newComment,
            problemID: problem.id,
            userID: user?.id || 4,
        }
        newCommentMutation.mutate(commentData)
        
    }

    return (
        <div className="container mx-auto py-6 px-4">
            <title>{problem.title}</title>
            <div className="flex items-center mb-6">
                <Button variant="ghost" size="sm" asChild className="mr-2">
                    <Link to="/problems">
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Volver
                    </Link>
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
                            }
                        >
                            {problem.difficulty}
                        </Badge>
                        {parseServerString(problem.tags).map((tag) => (
                            <Badge key={tag} variant="outline">
                                {tag}
                            </Badge>
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

                                        {comments.map((comment) => (
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
                                </TabsList>
                            </Tabs>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button onClick={handleRunCode} disabled={isRunning}>
                                {isRunning ? "Ejecutando..." : "Ejecutar"}
                            </Button>
                            <Button variant="default">Subir solucion</Button>
                        </div>
                    </div>

                    <Card className="border rounded-md overflow-hidden h-[calc(100vh-300px)] pb-0 pt-0.5 px-0.5">
                        <Editor language={language === "javascript" ? "javascript" : "python"} code={code} theme="vs-dark" setCode={setCode} />
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

