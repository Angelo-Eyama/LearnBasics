"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { Search, MoreHorizontal, Eye, Check, X, MessageSquare } from "lucide-react"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock comments data
const comments = [
    {
        id: "1",
        content: "I found it helpful to use a hash map to store the numbers I've seen so far, along with their indices.",
        user: {
            name: "Alex Johnson",
            avatar: "/placeholder.svg?height=40&width=40",
        },
        problem: "Two Sum",
        problemId: "1",
        status: "Approved",
        createdAt: "2023-10-15T14:30:00Z",
    },
    {
        id: "2",
        content: "Watch out for edge cases like duplicate numbers in the array!",
        user: {
            name: "Maria Garcia",
            avatar: "/placeholder.svg?height=40&width=40",
        },
        problem: "Two Sum",
        problemId: "1",
        status: "Approved",
        createdAt: "2023-10-12T09:15:00Z",
    },
    {
        id: "3",
        content: "This problem is too easy, needs more challenging test cases.",
        user: {
            name: "John Smith",
            avatar: "/placeholder.svg?height=40&width=40",
        },
        problem: "Two Sum",
        problemId: "1",
        status: "Pending",
        createdAt: "2023-10-18T11:45:00Z",
    },
    {
        id: "4",
        content: "The time complexity of my solution is O(n) and space complexity is O(n).",
        user: {
            name: "Emily Chen",
            avatar: "/placeholder.svg?height=40&width=40",
        },
        problem: "Binary Tree Level Order Traversal",
        problemId: "3",
        status: "Approved",
        createdAt: "2023-10-10T16:20:00Z",
    },
    {
        id: "5",
        content: "This is spam content that should be removed.",
        user: {
            name: "Spam User",
            avatar: "/placeholder.svg?height=40&width=40",
        },
        problem: "LRU Cache",
        problemId: "5",
        status: "Rejected",
        createdAt: "2023-10-05T08:30:00Z",
    },
]

export default function AdminCommentsPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [selectedComment, setSelectedComment] = useState<(typeof comments)[0] | null>(null)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

    const filteredComments = comments.filter((comment) => {
        // Search filter
        const matchesSearch =
            comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            comment.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            comment.problem.toLowerCase().includes(searchQuery.toLowerCase())

        // Status filter
        const matchesStatus = statusFilter === "all" || comment.status.toLowerCase() === statusFilter.toLowerCase()

        return matchesSearch && matchesStatus
    })

    const handleStatusChange = (commentId: string, newStatus: string) => {
        toast("Comment status updated", {
            description: `Comment status has been changed to ${newStatus}.`,
        })
    }

    const handleDeleteComment = () => {
        if (!selectedComment) return

        setIsDeleteDialogOpen(false)
        toast.error("Comment deleted",{
            description: "The comment has been deleted successfully.",
        })
        setSelectedComment(null)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString()
    }

    return (
        <div className="container mx-auto py-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Comment Moderation</h1>
                    <p className="text-muted-foreground">Review and moderate user comments</p>
                </div>
            </div>

            <Card>
                <CardHeader className="pb-2">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <CardTitle>Comments</CardTitle>
                            <CardDescription>
                                Showing {filteredComments.length} of {comments.length} comments
                            </CardDescription>
                        </div>
                        <div className="flex flex-col md:flex-row gap-2">
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search comments..."
                                    className="pl-8"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="approved">Approved</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Comment</TableHead>
                                <TableHead>Problem</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredComments.map((comment) => (
                                <TableRow key={comment.id}>
                                    <TableCell>
                                        <div className="flex items-center space-x-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
                                                <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{comment.user.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="max-w-xs truncate">{comment.content}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Link to={`/problems/${comment.problemId}`} className="text-primary hover:underline">
                                            {comment.problem}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                comment.status === "Approved"
                                                    ? "default"
                                                    : comment.status === "Pending"
                                                        ? "outline"
                                                        : "destructive"
                                            }
                                        >
                                            {comment.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{formatDate(comment.createdAt)}</TableCell>
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
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        setSelectedComment(comment)
                                                        setIsViewDialogOpen(true)
                                                    }}
                                                >
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View Full Comment
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                {comment.status !== "Approved" && (
                                                    <DropdownMenuItem onClick={() => handleStatusChange(comment.id, "Approved")}>
                                                        <Check className="mr-2 h-4 w-4" />
                                                        Approve
                                                    </DropdownMenuItem>
                                                )}
                                                {comment.status !== "Rejected" && (
                                                    <DropdownMenuItem onClick={() => handleStatusChange(comment.id, "Rejected")}>
                                                        <X className="mr-2 h-4 w-4" />
                                                        Reject
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-destructive focus:text-destructive"
                                                    onClick={() => {
                                                        setSelectedComment(comment)
                                                        setIsDeleteDialogOpen(true)
                                                    }}
                                                >
                                                    <X className="mr-2 h-4 w-4" />
                                                    Delete Comment
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
                        <DialogTitle>Delete Comment</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this comment? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteComment}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Comment Details</DialogTitle>
                    </DialogHeader>
                    {selectedComment && (
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={selectedComment.user.avatar} alt={selectedComment.user.name} />
                                    <AvatarFallback>{selectedComment.user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">{selectedComment.user.name}</p>
                                    <p className="text-xs text-muted-foreground">{formatDate(selectedComment.createdAt)}</p>
                                </div>
                            </div>
                            <div className="p-4 border rounded-md">
                                <p>{selectedComment.content}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                <p className="text-sm">
                                    On problem:{" "}
                                    <Link to={`/problems/${selectedComment.problemId}`} className="text-primary hover:underline">
                                        {selectedComment.problem}
                                    </Link>
                                </p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Badge
                                    variant={
                                        selectedComment.status === "Approved"
                                            ? "default"
                                            : selectedComment.status === "Pending"
                                                ? "outline"
                                                : "destructive"
                                    }
                                >
                                    {selectedComment.status}
                                </Badge>
                            </div>
                        </div>
                    )}
                    <DialogFooter className="flex justify-between sm:justify-between">
                        <div className="flex gap-2">
                            {selectedComment && selectedComment.status !== "Approved" && (
                                <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => {
                                        handleStatusChange(selectedComment.id, "Approved")
                                        setIsViewDialogOpen(false)
                                    }}
                                >
                                    <Check className="mr-2 h-4 w-4" />
                                    Approve
                                </Button>
                            )}
                            {selectedComment && selectedComment.status !== "Rejected" && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        handleStatusChange(selectedComment.id, "Rejected")
                                        setIsViewDialogOpen(false)
                                    }}
                                >
                                    <X className="mr-2 h-4 w-4" />
                                    Reject
                                </Button>
                            )}
                        </div>
                        <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

