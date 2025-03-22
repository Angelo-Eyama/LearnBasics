import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {Link} from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Users, BookText, MessageSquare, BarChart } from "lucide-react"

export default function AdminDashboardPage() {
    return (
        <div className="container mx-auto py-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground">Manage your platform's content and users</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xl">Users</CardTitle>
                        <CardDescription>Manage user accounts</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center">
                            <div className="text-3xl font-bold">128</div>
                            <Users className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <Button asChild className="w-full mt-4">
                            <Link to="/admin/users">Manage Users</Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xl">Problems</CardTitle>
                        <CardDescription>Manage coding problems</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center">
                            <div className="text-3xl font-bold">42</div>
                            <BookText className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <Button asChild className="w-full mt-4">
                            <Link to="/admin/problems">Manage Problems</Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xl">Comments</CardTitle>
                        <CardDescription>Moderate user comments</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center">
                            <div className="text-3xl font-bold">256</div>
                            <MessageSquare className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <Button asChild className="w-full mt-4">
                            <Link to="/admin/comments">Manage Comments</Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xl">Analytics</CardTitle>
                        <CardDescription>View platform statistics</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center">
                            <div className="text-3xl font-bold">-</div>
                            <BarChart className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <Button asChild className="w-full mt-4">
                            <Link to="/admin/analytics">View Analytics</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

