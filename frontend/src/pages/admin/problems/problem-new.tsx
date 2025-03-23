"use client"

import type React from "react"

import { useState } from "react"
import {Link} from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Plus, X } from "lucide-react"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { Badge } from "@/components/ui/badge"

export default function NewProblemPage() {
    const navigate = useNavigate()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [newTag, setNewTag] = useState("")
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        difficulty: "Medium",
        tags: [] as string[],
        starterCode: {
            javascript: "function solution() {\n  // Your code here\n}",
            python: "def solution():\n    # Your code here\n    pass",
        },
        testCases: "",
        status: "Draft",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleCodeChange = (language: string, code: string) => {
        setFormData((prev) => ({
            ...prev,
            starterCode: {
                ...prev.starterCode,
                [language]: code,
            },
        }))
    }

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const addTag = () => {
        if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
            setFormData((prev) => ({
                ...prev,
                tags: [...prev.tags, newTag.trim()],
            }))
            setNewTag("")
        }
    }

    const removeTag = (tagToRemove: string) => {
        setFormData((prev) => ({
            ...prev,
            tags: prev.tags.filter((tag) => tag !== tagToRemove),
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false)
            toast.success("Problem created",{
                description: "The problem has been created successfully.",
            })
            navigate("/admin/problems")
        }, 1000)
    }

    return (
        <div className="container mx-auto py-6">
            <title>Nuevo problema</title>
            <div className="flex items-center mb-6">
                <Button variant="ghost" size="sm" asChild className="mr-2">
                    <Link to="/admin/problems">
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back to Problems
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold">Create New Problem</h1>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Problem Details</CardTitle>
                                <CardDescription>Basic information about the problem</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        rows={10}
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                        placeholder="Provide a detailed description of the problem, including examples and constraints."
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Starter Code</CardTitle>
                                <CardDescription>Provide starter code for different languages</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="javascript">JavaScript</Label>
                                    <Textarea
                                        id="javascript"
                                        rows={6}
                                        value={formData.starterCode.javascript}
                                        onChange={(e) => handleCodeChange("javascript", e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="python">Python</Label>
                                    <Textarea
                                        id="python"
                                        rows={6}
                                        value={formData.starterCode.python}
                                        onChange={(e) => handleCodeChange("python", e.target.value)}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Test Cases</CardTitle>
                                <CardDescription>Add test cases to validate solutions</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Textarea
                                    id="testCases"
                                    name="testCases"
                                    rows={6}
                                    value={formData.testCases}
                                    onChange={handleChange}
                                    placeholder="Input: nums = [2,7,11,15], target = 9
Output: [0,1]

Input: nums = [3,2,4], target = 6
Output: [1,2]"
                                />
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Problem Settings</CardTitle>
                                <CardDescription>Configure problem properties</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="difficulty">Difficulty</Label>
                                    <Select
                                        value={formData.difficulty}
                                        onValueChange={(value) => handleSelectChange("difficulty", value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select difficulty" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Easy">Easy</SelectItem>
                                            <SelectItem value="Medium">Medium</SelectItem>
                                            <SelectItem value="Hard">Hard</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Draft">Draft</SelectItem>
                                            <SelectItem value="Published">Published</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Tags</Label>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {formData.tags.map((tag) => (
                                            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                                                {tag}
                                                <button
                                                    type="button"
                                                    onClick={() => removeTag(tag)}
                                                    className="text-muted-foreground hover:text-foreground"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <Input
                                            value={newTag}
                                            onChange={(e) => setNewTag(e.target.value)}
                                            placeholder="Add a tag"
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault()
                                                    addTag()
                                                }
                                            }}
                                        />
                                        <Button type="button" size="sm" onClick={addTag}>
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Publish</CardTitle>
                                <CardDescription>Save or publish your problem</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-4">
                                    You can save as draft to continue editing later, or publish immediately to make it available to users.
                                </p>
                                <div className="flex gap-2">
                                    <Button type="submit" disabled={isSubmitting} className="flex-1">
                                        <Save className="mr-2 h-4 w-4" />
                                        {isSubmitting ? "Saving..." : "Save Problem"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </div>
    )
}

