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
        toast("Problem status updated", {
            description: `Problem status has been changed to ${newStatus}.`,
        })
    }

    const handleDeleteProblem = () => {
        if (!selectedProblem) return

        setIsDeleteDialogOpen(false)
        toast.error("Problem deleted", {
            description: `Problem "${selectedProblem.title}" has been deleted.`,
        })
        setSelectedProblem(null)
    }

    return (
        <div className="container mx-auto py-6">
            <title>Gestion de problemas</title>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Problem Management</h1>
                    <p className="text-muted-foreground">Create and manage coding problems</p>
                </div>
                <Button asChild>
                    <Link to="/admin/problems/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Problem
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader className="pb-2">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <CardTitle>Problems</CardTitle>
                            <CardDescription>
                                Showing {filteredProblems.length} of {problems.length} problems
                            </CardDescription>
                        </div>
                        <div className="flex flex-col md:flex-row gap-2">
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search problems..."
                                    className="pl-8"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
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
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="published">Published</SelectItem>
                                    <SelectItem value="draft">Draft</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Difficulty</TableHead>
                                <TableHead>Tags</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
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
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem asChild>
                                                    <Link to={`/admin/problems/${problem.id}`}>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View Problem
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link to={`/admin/problems/${problem.id}/edit`}>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit Problem
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        handleStatusChange(problem.id, problem.status === "Published" ? "Draft" : "Published")
                                                    }
                                                >
                                                    {problem.status === "Published" ? "Unpublish" : "Publish"}
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
                                                    Delete Problem
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
                        <DialogTitle>Delete Problem</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{selectedProblem?.title}"? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteProblem}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

