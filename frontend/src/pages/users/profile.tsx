"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {Link} from "react-router-dom"
import { Edit, Github, Mail, MapPin, Calendar, Award, Code, FileCode } from "lucide-react"

// Mock user data - in a real app, this would come from your API
const user = {
    id: "1",
    name: "Jane Smith",
    username: "janesmith",
    email: "jane.smith@example.com",
    avatar: "/placeholder.svg?height=100&width=100",
    location: "San Francisco, CA",
    joinedDate: "January 2023",
    bio: "Full-stack developer passionate about solving complex problems and building intuitive user interfaces.",
    skills: ["JavaScript", "TypeScript", "React", "Node.js", "Python"],
    githubUsername: "janesmith",
    problemsSolved: 42,
    submissions: 78,
    rank: "Advanced",
}

export default function ProfilePage() {
    return (
        <div className="container mx-auto py-6 px-4">
            <title>Mi perfil</title>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Mi perfil</h1>
                <Button asChild>
                    <Link to="/edit-profile">
                        <Edit className="mr-2 h-4 w-4" />
                        Editar perfil
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-1">
                    <CardHeader className="flex flex-col items-center text-center">
                        <Avatar className="h-24 w-24 mb-4">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <CardTitle>{user.name}</CardTitle>
                        <CardDescription>@{user.username}</CardDescription>
                        <Badge className="mt-2">{user.rank}</Badge>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center">
                            <Mail className="mr-2 h-4 w-4 opacity-70" />
                            <span>{user.email}</span>
                        </div>
                        <div className="flex items-center">
                            <MapPin className="mr-2 h-4 w-4 opacity-70" />
                            <span>{user.location}</span>
                        </div>
                        <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4 opacity-70" />
                            <span>Joined {user.joinedDate}</span>
                        </div>
                        {user.githubUsername && (
                            <div className="flex items-center">
                                <Github className="mr-2 h-4 w-4 opacity-70" />
                                <a
                                    href={`https://github.com/${user.githubUsername}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline"
                                >
                                    {user.githubUsername}
                                </a>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Sobre mi</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>{user.bio}</p>
                            <div className="mt-4">
                                <h3 className="font-medium mb-2">Habilidades</h3>
                                <div className="flex flex-wrap gap-2">
                                    {user.skills.map((skill) => (
                                        <Badge key={skill} variant="secondary">
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Estadisticas</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                                    <Award className="h-8 w-8 mb-2 text-primary" />
                                    <span className="text-2xl font-bold">{user.rank}</span>
                                    <span className="text-sm text-muted-foreground">Rango actual</span>
                                </div>
                                <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                                    <Code className="h-8 w-8 mb-2 text-primary" />
                                    <span className="text-2xl font-bold">{user.problemsSolved}</span>
                                    <span className="text-sm text-muted-foreground">Problemas resueltos</span>
                                </div>
                                <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                                    <FileCode className="h-8 w-8 mb-2 text-primary" />
                                    <span className="text-2xl font-bold">{user.submissions}</span>
                                    <span className="text-sm text-muted-foreground">Total de entregas</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Actividad reciente</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-start space-x-4">
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium">Problema #{Math.floor(Math.random() * 100)} resuelto</p>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString()}
                                            </p>
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

