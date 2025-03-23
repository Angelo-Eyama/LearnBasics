"use client"

import { useState } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Notification {
    id: string
    title: string
    description: string
    time: string
    read: boolean
}

export default function NotificationsDropdown() {
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: "1",
            title: "New message",
            description: "You have received a new message from John Doe",
            time: "5 min ago",
            read: false,
        },
        {
            id: "2",
            title: "Project update",
            description: "Your project 'Dashboard' has been updated",
            time: "1 hour ago",
            read: false,
        },
        {
            id: "3",
            title: "Task completed",
            description: "Task 'Update documentation' has been completed",
            time: "2 hours ago",
            read: false,
        },
    ])

    const unreadCount = notifications.filter((notification) => !notification.read).length

    const markAsRead = (id: string) => {
        setNotifications(
            notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
        )
    }

    const markAllAsRead = () => {
        setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative hover:bg-accent transition-colors duration-200">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge
                            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                            variant="destructive"
                        >
                            {unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="font-medium">Notificaciones</h3>
                    {unreadCount > 0 && (
                        <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs hover:text-primary hover:underline cursor-pointer">
                            Marcar todas como leídas
                        </Button>
                    )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <DropdownMenuItem
                                key={notification.id}
                                className={cn(
                                    "flex flex-col items-start p-4 cursor-default border-b last:border-b-0",
                                    !notification.read && "bg-accent/20",
                                )}
                                onClick={() => markAsRead(notification.id)}
                            >
                                <div className="flex items-start justify-between w-full">
                                    <h4 className="font-medium">{notification.title}</h4>
                                    <span className="text-xs text-muted-foreground ml-2">{notification.time}</span>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">{notification.description}</p>
                            </DropdownMenuItem>
                        ))
                    ) : (
                        <div className="p-4 text-center text-muted-foreground">No notifications</div>
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

