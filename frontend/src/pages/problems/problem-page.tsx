"use client"

import { useState, lazy, Suspense } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, MessageSquare, ThumbsUp, Send } from "lucide-react"
import { Loading } from "@/components/ui/loading"

const MonacoEditor = lazy(() => import('@monaco-editor/react')); //Carga dinámica del componente

// Mock problem data
const problem = {
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
// Prototipo: export default function ProblemDetailPage({ params }: { params: { id: string } })
export default function ProblemDetailPage() {
    const [language, setLanguage] = useState("javascript")
    const [code, setCode] = useState(problem.starterCode.javascript)
    const [activeTab, setActiveTab] = useState("description")
    const [newComment, setNewComment] = useState("")
    const [comments, setComments] = useState(problem.comments)
    const [output, setOutput] = useState("")
    const [isRunning, setIsRunning] = useState(false)

    const handleLanguageChange = (lang: string) => {
        setLanguage(lang)
        setCode(problem.starterCode[lang as keyof typeof problem.starterCode] || "")
    }

    const handleRunCode = () => {
        setIsRunning(true)
        setOutput("Running code...\n")

        // Simulate code execution with a timeout
        setTimeout(() => {
            setOutput("Output: [0, 1]\nTest cases passed: 3/3\nExecution time: 42ms")
            setIsRunning(false)
        }, 1000)
    }

    const handleSubmitComment = () => {
        if (!newComment.trim()) return

        const comment = {
            id: `${comments.length + 1}`,
            user: {
                name: "You",
                avatar: "/placeholder.svg?height=40&width=40",
            },
            content: newComment,
            timestamp: "Just now",
            likes: 0,
        }

        setComments([comment, ...comments])
        setNewComment("")
    }

    return (
        <div className="container mx-auto py-6 px-4">
            <div className="flex items-center mb-6">
                <Button variant="ghost" size="sm" asChild className="mr-2">
                    <Link to="/problems">
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back to Problems
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">{problem.title}</h1>
                    <div className="flex items-center mt-1 space-x-2">
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
                        {problem.tags.map((tag) => (
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
                                    <TabsTrigger value="description">Description</TabsTrigger>
                                    <TabsTrigger value="hints">Hints</TabsTrigger>
                                    <TabsTrigger value="discussion">Discussion</TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="hints" value={activeTab}>
                                <TabsContent value="description" className="mt-0">
                                    <div className="prose dark:prose-invert max-w-none">
                                        <pre className="whitespace-pre-wrap font-sans text-sm">{problem.description}</pre>
                                    </div>
                                </TabsContent>
                                <TabsContent value="hints" className="mt-0">
                                    <div className="space-y-4">
                                        {problem.hints.map((hint, index) => (
                                            <div key={index} className="p-4 border rounded-md">
                                                <h3 className="font-medium mb-2">Hint {index + 1}</h3>
                                                <p>{hint}</p>
                                            </div>
                                        ))}
                                    </div>
                                </TabsContent>
                                <TabsContent value="discussion" className="mt-0">
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-2">
                                            <Textarea
                                                placeholder="Add a comment or question..."
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
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
                                                        <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium">{comment.user.name}</p>
                                                        <p className="text-xs text-muted-foreground">{comment.timestamp}</p>
                                                    </div>
                                                </div>
                                                <p className="mb-2">{comment.content}</p>
                                                <div className="flex items-center text-sm text-muted-foreground">
                                                    <Button variant="ghost" size="sm" className="h-8 px-2">
                                                        <ThumbsUp className="h-4 w-4 mr-1" />
                                                        {comment.likes}
                                                    </Button>
                                                    <Button variant="ghost" size="sm" className="h-8 px-2">
                                                        <MessageSquare className="h-4 w-4 mr-1" />
                                                        Reply
                                                    </Button>
                                                </div>
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
                                {isRunning ? "Running..." : "Run Code"}
                            </Button>
                            <Button variant="default">Submit Solution</Button>
                        </div>
                    </div>

                    <Card className="border rounded-md overflow-hidden h-[calc(100vh-300px)] pb-0 pt-0.5 px-0.5">
                        <Suspense fallback={<Loading />}>
                            <MonacoEditor
                                height="100%"
                                language={language === "javascript" ? "javascript" : "python"}
                                theme="vs-dark"
                                value={code}
                                onChange={(value) => setCode(value || "")}
                                options={{
                                    minimap: { enabled: false },
                                    scrollBeyondLastLine: false,
                                    fontSize: 14,
                                    automaticLayout: true,
                                }}
                            />
                        </Suspense>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle>Output</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="p-4 h-[200px] bg-black text-white font-mono text-sm overflow-auto whitespace-pre-wrap rounded-md">
                                {output || "Run your code to see the output here..."}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

