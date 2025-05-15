"use client"

import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useNotifications } from "@/hooks/useNotifications"
import { formatDate } from "@/utils/utils"

export default function NotificationsDropdown() {

    const {
        notifications,
        markNotificationAsRead,
        markAllAsRead,
    } = useNotifications()

    const unreadCount = notifications.filter((notification) => !notification.read).length


    const customScrollbarStyles = `max-h-60 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500`
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
                <div className={`flex items-center justify-between p-4 border-b`} >
                    <h3 className="font-medium">Notificaciones</h3>
                    {unreadCount > 0 && (
                        <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs hover:text-primary hover:underline cursor-pointer">
                            Marcar todas como leídas
                        </Button>
                    )}
                </div>
                <div className={`${customScrollbarStyles}`}>
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <DropdownMenuItem
                                key={notification.id}
                                className={cn(
                                    "flex flex-col items-start p-4 cursor-default border-b last:border-b-0",
                                    !notification.read && "bg-accent/20",
                                )}
                                onClick={() => markNotificationAsRead(notification.id)}
                            >
                                <div className="flex items-start justify-between w-full">
                                    <h4 className="font-medium">{notification.title}</h4>
                                    <span className="text-xs text-muted-foreground ml-2">{formatDate(notification.timePosted)}</span>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">{notification.description}</p>
                            </DropdownMenuItem>
                        ))
                    ) : (
                        <div className="p-4 text-center text-muted-foreground">Sin notificaciones</div>
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

