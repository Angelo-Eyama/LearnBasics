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
import { Search, MoreHorizontal, Shield, UserCog, Ban, Eye } from "lucide-react"
import { toast } from "sonner"

// Mock users data
const users = [
    {
        id: "1",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "User",
        status: "Active",
        problemsSolved: 42,
        joinedDate: "Jan 15, 2023",
    },
    {
        id: "2",
        name: "John Doe",
        email: "john.doe@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Admin",
        status: "Active",
        problemsSolved: 78,
        joinedDate: "Mar 3, 2022",
    },
    {
        id: "3",
        name: "Alice Johnson",
        email: "alice.johnson@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "User",
        status: "Inactive",
        problemsSolved: 15,
        joinedDate: "Jul 22, 2023",
    },
    {
        id: "4",
        name: "Bob Williams",
        email: "bob.williams@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "User",
        status: "Active",
        problemsSolved: 31,
        joinedDate: "Apr 10, 2023",
    },
    {
        id: "5",
        name: "Carol Martinez",
        email: "carol.martinez@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Moderator",
        status: "Active",
        problemsSolved: 56,
        joinedDate: "Feb 5, 2023",
    },
]

export default function AdminUsersPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedUser, setSelectedUser] = useState<(typeof users)[0] | null>(null)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    const filteredUsers = users.filter((user) => {
        return (
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.role.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })

    const handleStatusChange = (userId: string, newStatus: string) => {
        toast("User status updated", {
            description: `User status has been changed to ${newStatus}.`,
        })
    }

    const handleRoleChange = (userId: string, newRole: string) => {
        toast("User role updated", {
            description: `User role has been changed to ${newRole}.`,
        })
    }

    const handleDeleteUser = () => {
        if (!selectedUser) return

        setIsDeleteDialogOpen(false)
        toast("User deleted", {
            description: `User ${selectedUser.name} has been deleted.`,
        })
        setSelectedUser(null)
    }

    return (
        <div className="container mx-auto py-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">User Management</h1>
                <p className="text-muted-foreground">Manage users and their permissions</p>
            </div>

            <Card>
                <CardHeader className="pb-2">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <CardTitle>Users</CardTitle>
                            <CardDescription>
                                Showing {filteredUsers.length} of {users.length} users
                            </CardDescription>
                        </div>
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search users..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Problems Solved</TableHead>
                                <TableHead>Joined</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="flex items-center space-x-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={user.avatar} alt={user.name} />
                                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{user.name}</p>
                                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={user.role === "Admin" ? "default" : user.role === "Moderator" ? "outline" : "secondary"}
                                        >
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={user.status === "Active" ? "default" : "destructive"}>{user.status}</Badge>
                                    </TableCell>
                                    <TableCell>{user.problemsSolved}</TableCell>
                                    <TableCell>{user.joinedDate}</TableCell>
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
                                                    <Link to={`/admin/users/${user.id}`}>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View Details
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() => handleRoleChange(user.id, user.role === "Admin" ? "User" : "Admin")}
                                                >
                                                    <UserCog className="mr-2 h-4 w-4" />
                                                    {user.role === "Admin" ? "Remove Admin" : "Make Admin"}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleStatusChange(user.id, user.status === "Active" ? "Inactive" : "Active")}
                                                >
                                                    <Shield className="mr-2 h-4 w-4" />
                                                    {user.status === "Active" ? "Deactivate" : "Activate"}
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-destructive focus:text-destructive"
                                                    onClick={() => {
                                                        setSelectedUser(user)
                                                        setIsDeleteDialogOpen(true)
                                                    }}
                                                >
                                                    <Ban className="mr-2 h-4 w-4" />
                                                    Delete User
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
                        <DialogTitle>Delete User</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete {selectedUser?.name}? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteUser}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

