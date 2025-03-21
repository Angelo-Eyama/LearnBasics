"use client"

import { useState } from "react"
import {Link} from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, CheckCircle2 } from "lucide-react"

// Mock problems data
const problems = [
    {
        id: "1",
        title: "Two Sum",
        difficulty: "Easy",
        tags: ["Arrays", "Hash Table"],
        description:
            "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
        solved: true,
    },
    {
        id: "2",
        title: "Reverse Linked List",
        difficulty: "Easy",
        tags: ["Linked List", "Recursion"],
        description: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
        solved: false,
    },
    {
        id: "3",
        title: "Binary Tree Level Order Traversal",
        difficulty: "Medium",
        tags: ["Tree", "BFS", "Binary Tree"],
        description: "Given the root of a binary tree, return the level order traversal of its nodes' values.",
        solved: true,
    },
    {
        id: "4",
        title: "Merge K Sorted Lists",
        difficulty: "Hard",
        tags: ["Linked List", "Divide and Conquer", "Heap"],
        description:
            "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
        solved: false,
    },
    {
        id: "5",
        title: "LRU Cache",
        difficulty: "Medium",
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
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Programming Problems</h1>
                <p className="text-muted-foreground">Practice your coding skills with these challenges</p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search problems by title or tag..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Difficulties</SelectItem>
                            <SelectItem value="easy">Easy</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Problems</SelectItem>
                            <SelectItem value="solved">Solved</SelectItem>
                            <SelectItem value="unsolved">Unsolved</SelectItem>
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
                                            problem.difficulty === "Easy"
                                                ? "bg-green-500"
                                                : problem.difficulty === "Medium"
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
                            <CardFooter>
                                <Button asChild>
                                    <Link to={`/problems/${problem.id}`}>{problem.solved ? "Review Problem" : "Solve Problem"}</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-10">
                        <p className="text-muted-foreground">No problems found matching your filters.</p>
                        <Button
                            variant="link"
                            onClick={() => {
                                setSearchQuery("")
                                setDifficultyFilter("all")
                                setStatusFilter("all")
                            }}
                        >
                            Clear filters
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

