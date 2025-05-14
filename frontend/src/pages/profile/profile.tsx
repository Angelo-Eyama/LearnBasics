"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Link } from "react-router-dom"
import { Eye, Edit, Mail, Award, Code, FileCode, Bell, CheckCircle, CircleX } from "lucide-react"
import { FaGithub } from "react-icons/fa";
import useAuth from "@/hooks/useAuth"
import { parseServerString, decideRank, formatDate } from "@/utils/utils"
import { readNotification } from "@/client"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
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
    verified: true,
}

// Mock submissions data
const submissions = [
    {
        id: "1",
        problemId: "1",
        problemTitle: "Two Sum",
        language: "JavaScript",
        status: "Accepted",
        runtime: "76ms",
        memory: "42.1MB",
        submittedAt: "2023-10-15T14:30:00Z",
        code: `function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
      const complement = target - nums[i];
      if (map.has(complement)) {
        return [map.get(complement), i];
      }
      map.set(nums[i], i);
    }
    return [];
  }`,
    },
    {
        id: "2",
        problemId: "2",
        problemTitle: "Reverse Linked List",
        language: "Python",
        status: "Accepted",
        runtime: "32ms",
        memory: "16.5MB",
        submittedAt: "2023-10-12T09:15:00Z",
        code: `def reverseList(self, head):
      prev = None
      current = head
      while current:
          next_temp = current.next
          current.next = prev
          prev = current
          current = next_temp
      return prev`,
    },
    {
        id: "3",
        problemId: "3",
        problemTitle: "Binary Tree Level Order Traversal",
        language: "JavaScript",
        status: "Wrong Answer",
        runtime: "N/A",
        memory: "N/A",
        submittedAt: "2023-10-10T16:45:00Z",
        code: `function levelOrder(root) {
    if (!root) return [];
    const result = [];
    const queue = [root];
    
    while (queue.length > 0) {
      const levelSize = queue.length;
      const currentLevel = [];
      
      for (let i = 0; i < levelSize; i++) {
        const node = queue.shift();
        currentLevel.push(node.val);
        
        if (node.left) queue.push(node.left);
        if (node.right) queue.push(node.right);
      }
      
      result.push(currentLevel);
    }
    
    return result;
  }`,
    },
    {
        id: "4",
        problemId: "5",
        problemTitle: "LRU Cache",
        language: "TypeScript",
        status: "Time Limit Exceeded",
        runtime: "N/A",
        memory: "N/A",
        submittedAt: "2023-10-05T08:30:00Z",
        code: `class LRUCache {
    private capacity: number;
    private cache: Map<number, number>;
  
    constructor(capacity: number) {
      this.capacity = capacity;
      this.cache = new Map();
    }
  
    get(key: number): number {
      if (!this.cache.has(key)) return -1;
      
      const value = this.cache.get(key)!;
      this.cache.delete(key);
      this.cache.set(key, value);
      return value;
    }
  
    put(key: number, value: number): void {
      if (this.cache.has(key)) {
        this.cache.delete(key);
      } else if (this.cache.size >= this.capacity) {
        const firstKey = this.cache.keys().next().value;
        this.cache.delete(firstKey);
      }
      
      this.cache.set(key, value);
    }
  }`,
    },
    {
        id: "5",
        problemId: "4",
        problemTitle: "Merge K Sorted Lists",
        language: "JavaScript",
        status: "Runtime Error",
        runtime: "N/A",
        memory: "N/A",
        submittedAt: "2023-09-28T11:20:00Z",
        code: `function mergeKLists(lists) {
    if (!lists || lists.length === 0) return null;
    
    return mergeLists(lists, 0, lists.length - 1);
  }
  
  function mergeLists(lists, start, end) {
    if (start === end) return lists[start];
    
    const mid = Math.floor((start + end) / 2);
    const left = mergeLists(lists, start, mid);
    const right = mergeLists(lists, mid + 1, end);
    
    return mergeTwoLists(left, right);
  }
  
  function mergeTwoLists(l1, l2) {
    const dummy = new ListNode(0);
    let current = dummy;
    
    while (l1 && l2) {
      if (l1.val < l2.val) {
        current.next = l1;
        l1 = l1.next;
      } else {
        current.next = l2;
        l2 = l2.next;
      }
      current = current.next;
    }
    
    current.next = l1 || l2;
    
    return dummy.next;
  }`,
    },
]

export default function ProfilePage() {
    const toggleNotificationRead = async (notificationId: number) => {
        const response = await readNotification({
            path: {
                notification_id: notificationId,
            }
        })
        if (!('data' in response)) {
            toast.error("Error al cambiar el estado de la notificacion")
            throw new Error("Error al cambiar el estado de la notificacion")
        }
    }

    const { mutate: markNotificationAsRead } = useMutation({
        mutationFn: toggleNotificationRead,
        onSuccess: () => {
            toast.success("Notificacion marcada como leida")
        },
        onError: () => {
            toast.error("Error al marcar la notificacion como leida")
        }
    })
    const { user: userData } = useAuth()
    const [selectedSubmission, setSelectedSubmission] = useState<(typeof submissions)[0] | null>(null)
    const [notificationsTab, setNotificationsTab] = useState("all")
    const [userNotifications, setUserNotifications] = useState(userData?.notifications || [])
    if (!userData) return null


    const handleToggleRead = (notificationId: number) => {
        markNotificationAsRead(notificationId)
        // Actualizamos el estado local de las notificaciones
        setUserNotifications((prev) =>
            prev.map((notification) =>
                notification.id === notificationId ? { ...notification, read: !notification.read } : notification
            )
        )
    }

    const markAllAsRead = () => {
        // Llamamos a la mutación para marcar todas las notificaciones como leídas
        userNotifications.forEach((notification) => {
            if (!notification.read) {
                markNotificationAsRead(notification.id)
                // Actualizamos el estado local de las notificaciones
                setUserNotifications((prev) =>
                    prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
                )
            }
        })
    }

    const filteredNotifications = userNotifications.filter((notification) => {
        if (notificationsTab === "all") return true
        if (notificationsTab === "unread") return !notification.read
        if (notificationsTab === "read") return notification.read
        return true
    })
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
                            <AvatarImage src={`https://randomuser.me/api/portraits/med/men/${Math.floor(Math.random() * 100)}.jpg`} alt={user.name} />
                            <AvatarFallback>{userData?.username?.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <CardTitle>{`${userData?.firstName} ${userData?.lastName}`}</CardTitle>
                        <CardDescription>@{userData?.username}</CardDescription>
                        <div className="flex gap-2 mt-2">
                            <Badge className="mt-2">{decideRank(userData.score)}</Badge>
                            {userData?.isVerified ? (
                                <Badge variant="default" className="mt-2 flex items-center gap-1 bg-green-500">
                                    <CheckCircle className="h-3 w-3" />
                                    Verificado
                                </Badge>
                            )
                                :
                                (
                                    <Badge variant="destructive" className="mt-2 flex items-center gap-1">
                                        <CircleX className="h-3 w-3" />
                                        No Verificado
                                    </Badge>
                                )
                            }
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center">
                            <Mail className="mr-2 h-4 w-4 opacity-70" />
                            <span>{userData?.email}</span>
                        </div>

                        {userData?.github && (
                            <div className="flex items-center">
                                <FaGithub className="mr-2 h-4 w-4 opacity-70" />
                                <a
                                    href={`${userData.github}`}
                                    target="_blank"
                                    className="text-primary hover:underline"
                                >
                                    {userData?.github.split("/").pop()}
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
                            <p>{userData?.bio || "Sin descripcion"}</p>
                            <div className="mt-4">
                                <h3 className="font-medium mb-2">Habilidades</h3>
                                <div className="flex flex-wrap gap-2">
                                    {parseServerString(userData?.skills).map((skill) => (
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
                                    <span className="text-2xl font-bold">{decideRank(userData?.score)}</span>
                                    <span className="text-sm text-muted-foreground">Rango actual</span>
                                </div>
                                <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                                    <Code className="h-8 w-8 mb-2 text-primary" />
                                    <span className="text-2xl font-bold">{user.problemsSolved}</span>
                                    <span className="text-sm text-muted-foreground">Problemas resueltos</span>
                                </div>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <div className="flex flex-col items-center p-4 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors">
                                            <FileCode className="h-8 w-8 mb-2 text-primary" />
                                            <span className="text-2xl font-bold">{user.submissions}</span>
                                            <span className="text-sm text-muted-foreground">Total de entregas</span>
                                        </div>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="max-w-xl">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Historial de entregas</AlertDialogTitle>
                                        </AlertDialogHeader>
                                        <div className="max-h-[80vh]  overflow-auto">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Problema</TableHead>
                                                        <TableHead>Lenguaje</TableHead>
                                                        <TableHead>Estado</TableHead>
                                                        <TableHead>T. Ejecucion</TableHead>
                                                        <TableHead>Memoria</TableHead>
                                                        <TableHead>Entregado</TableHead>
                                                        <TableHead className="text-right">Acciones</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {submissions.map((submission) => (
                                                        <TableRow key={submission.id}>
                                                            <TableCell>
                                                                <Link
                                                                    to={`/problems/${submission.problemId}`}
                                                                    className="text-primary hover:underline"
                                                                >
                                                                    {submission.problemTitle}
                                                                </Link>
                                                            </TableCell>
                                                            <TableCell>{submission.language}</TableCell>
                                                            <TableCell>
                                                                <Badge
                                                                    variant={
                                                                        submission.status === "Accepted"
                                                                            ? "outline"
                                                                            : submission.status === "Wrong Answer"
                                                                                ? "destructive"
                                                                                : "secondary"
                                                                    }
                                                                >
                                                                    {submission.status}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell>{submission.runtime}</TableCell>
                                                            <TableCell>{submission.memory}</TableCell>
                                                            <TableCell>{formatDate(submission.submittedAt)}</TableCell>
                                                            <TableCell className="text-right">
                                                                <Button variant="outline" size="sm" onClick={() => setSelectedSubmission(submission)}>
                                                                    <Eye className="h-4 w-4 mr-1" />
                                                                    Ver
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cerrar</AlertDialogCancel>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>

                                {/* TODO: (Code Splitting) Dialog de detalles de entregas */}
                                {selectedSubmission && (
                                    <AlertDialog
                                        open={!!selectedSubmission}
                                        onOpenChange={(open) => !open && setSelectedSubmission(null)}
                                    >
                                        <AlertDialogContent className="max-w-4xl">
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Detalles de entregas</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    {selectedSubmission.problemTitle} - {formatDate(selectedSubmission.submittedAt)}
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <p className="text-sm font-medium">Estado</p>
                                                        <Badge
                                                            variant={
                                                                selectedSubmission.status === "Accepted"
                                                                    ? "outline"
                                                                    : selectedSubmission.status === "Wrong Answer"
                                                                        ? "destructive"
                                                                        : "secondary"
                                                            }
                                                            className="mt-1"
                                                        >
                                                            {selectedSubmission.status}
                                                        </Badge>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">Lenguaje</p>
                                                        <p className="mt-1">{selectedSubmission.language}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">T. Ejecucion</p>
                                                        <p className="mt-1">{selectedSubmission.runtime}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">Memoria</p>
                                                        <p className="mt-1">{selectedSubmission.memory}</p>
                                                    </div>
                                                </div>

                                                <div>
                                                    <p className="text-sm font-medium mb-2">Codigo</p>
                                                    <div className="bg-muted p-4 rounded-md overflow-auto max-h-[400px]">
                                                        <pre className="text-sm font-mono whitespace-pre-wrap">{selectedSubmission.code}</pre>
                                                    </div>
                                                </div>
                                            </div>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cerrar</AlertDialogCancel>
                                                <AlertDialogAction asChild>
                                                    <Link to={`/problems/${selectedSubmission.problemId}`}>Ir al problema</Link>
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notificaciones */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center">
                                <Bell className="h-5 w-5 mr-2" />
                                Notificaciones
                            </CardTitle>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={markAllAsRead}
                                disabled={!userNotifications.some((n) => !n.read)}
                            >
                                Marcar todas como leidas
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="all" value={notificationsTab} onValueChange={setNotificationsTab}>
                                <TabsList className="mb-4">
                                    <TabsTrigger value="all">Todas</TabsTrigger>
                                    <TabsTrigger value="unread">
                                        No leídas
                                        {userNotifications.filter((n) => !n.read).length > 0 && (
                                            <Badge variant="secondary" className="ml-2">
                                                {userNotifications.filter((n) => !n.read).length}
                                            </Badge>
                                        )}
                                    </TabsTrigger>
                                    <TabsTrigger value="read">Leídas</TabsTrigger>
                                </TabsList>

                                <div className="space-y-4">
                                    {filteredNotifications.length > 0 ? (
                                        filteredNotifications.map((notification) => (
                                            <div
                                                key={notification.id}
                                                className={`p-4 border rounded-lg ${!notification.read ? "bg-muted/50 border-primary/20" : ""}`}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="font-medium">{notification.title}</h4>
                                                        <p className="text-sm text-muted-foreground mt-1">{notification.description}</p>
                                                    </div>
                                                    {!notification.read && (
                                                        <Button variant="ghost" size="sm" onClick={() => handleToggleRead(notification.id)}>
                                                            Marcar como leída
                                                        </Button>
                                                    )}
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-2">{formatDate(notification.timePosted)}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-muted-foreground">No hay notificaciones</div>
                                    )}
                                </div>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

