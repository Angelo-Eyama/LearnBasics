"use client"

import type React from "react"

import { useState } from "react"
import {Link} from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Ban, Shield, Activity } from "lucide-react"
import { toast } from "sonner"

// Mock user data
const user = {
    id: "1",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    avatar: "/placeholder.svg?height=100&width=100",
    role: "User",
    status: "Active",
    problemsSolved: 42,
    submissions: 78,
    joinedDate: "January 15, 2023",
    lastActive: "2 hours ago",
    location: "San Francisco, CA",
    bio: "Full-stack developer passionate about solving complex problems and building intuitive user interfaces.",
    recentActivity: [
        {
            id: "1",
            type: "problem_solved",
            problem: "Two Sum",
            date: "2023-10-15T14:30:00Z",
        },
        {
            id: "2",
            type: "comment",
            problem: "Binary Tree Level Order Traversal",
            date: "2023-10-12T09:15:00Z",
        },
        {
            id: "3",
            type: "problem_attempted",
            problem: "LRU Cache",
            date: "2023-10-10T16:45:00Z",
        },
    ],
}

// TODO: Modificar el componente para que muestre la información del usuario con el id que se recibe en los parámetros de la URL
// y permita editar la información del usuario. La información del usuario debe ser obtenida de un API REST.
// Prototipo: export default function UserDetailPage({ params }: { params: { id: string } })
export default function UserDetailPage() {

    const [userData, setUserData] = useState(user)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setUserData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSelectChange = (name: string, value: string) => {
        setUserData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false)
            toast("User updated", {
                description: "User information has been updated successfully.",
            })
        }, 1000)
    }

    return (
        <div className="container mx-auto py-6 px-4">
            <title>{user.name}</title>
            <div className="flex items-center mb-6">
                <Button variant="ghost" size="sm" asChild className="mr-2">
                    <Link to="/admin/users">
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back to Users
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold">User Details</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-1">
                    <CardHeader className="flex flex-col items-center text-center">
                        <Avatar className="h-24 w-24 mb-4">
                            <AvatarImage src={userData.avatar} alt={userData.name} />
                            <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <CardTitle>{userData.name}</CardTitle>
                        <CardDescription>{userData.email}</CardDescription>
                        <div className="flex space-x-2 mt-2">
                            <Badge
                                variant={
                                    userData.role === "Admin" ? "default" : userData.role === "Moderator" ? "outline" : "secondary"
                                }
                            >
                                {userData.role}
                            </Badge>
                            <Badge variant={userData.status === "Active" ? "default" : "destructive"}>{userData.status}</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <span className="text-sm text-muted-foreground">Joined</span>
                                <span>{userData.joinedDate}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm text-muted-foreground">Last Active</span>
                                <span>{userData.lastActive}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm text-muted-foreground">Problems Solved</span>
                                <span>{userData.problemsSolved}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm text-muted-foreground">Submissions</span>
                                <span>{userData.submissions}</span>
                            </div>
                        </div>
                        <div className="pt-4 border-t">
                            <h3 className="font-medium mb-2">Quick Actions</h3>
                            <div className="flex flex-col space-y-2">
                                <Button variant="outline" className="justify-start">
                                    <Shield className="mr-2 h-4 w-4" />
                                    {userData.role === "Admin" ? "Remove Admin Role" : "Make Admin"}
                                </Button>
                                <Button variant="outline" className="justify-start">
                                    <Ban className="mr-2 h-4 w-4" />
                                    {userData.status === "Active" ? "Deactivate Account" : "Activate Account"}
                                </Button>
                                <Button variant="outline" className="justify-start">
                                    <Activity className="mr-2 h-4 w-4" />
                                    View Activity Log
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Edit User Information</CardTitle>
                            <CardDescription>Update user details and permissions</CardDescription>
                        </CardHeader>
                        <form onSubmit={handleSubmit}>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input id="name" name="name" value={userData.name} onChange={handleChange} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" name="email" type="email" value={userData.email} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="role">Role</Label>
                                        <Select value={userData.role} onValueChange={(value) => handleSelectChange("role", value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="User">User</SelectItem>
                                                <SelectItem value="Moderator">Moderator</SelectItem>
                                                <SelectItem value="Admin">Admin</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="status">Status</Label>
                                        <Select value={userData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Active">Active</SelectItem>
                                                <SelectItem value="Inactive">Inactive</SelectItem>
                                                <SelectItem value="Suspended">Suspended</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="location">Location</Label>
                                    <Input id="location" name="location" value={userData.location} onChange={handleChange} />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" disabled={isSubmitting} className="mt-4 hover:bg-gray-500">
                                    <Save className="mr-2 h-4 w-4" />
                                    {isSubmitting ? "Saving..." : "Save Changes"}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {userData.recentActivity.map((activity) => (
                                    <div key={activity.id} className="flex items-start space-x-4 p-3 border rounded-md">
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium">
                                                {activity.type === "problem_solved" && "Solved problem: "}
                                                {activity.type === "comment" && "Commented on: "}
                                                {activity.type === "problem_attempted" && "Attempted problem: "}
                                                <span className="font-semibold">{activity.problem}</span>
                                            </p>
                                            <p className="text-xs text-muted-foreground">{new Date(activity.date).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

