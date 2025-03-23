import { Link, useNavigate } from "react-router";
import { ModeToggle } from "@/components/mode-toggle";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Menu, User } from "lucide-react";
import NotificationsDropdown from "./notifications-dropdown";
import { useAuth } from "@/context/useAuth";

export default function Navigation() {
    const { logout, isLoggedIn } = useAuth();
    const Navigate = useNavigate();
    const handleLogout = () => {
        logout();
        Navigate("/login");
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <img src="https://fakerjs.dev/logo.svg" className="h-8" alt="The Logo" />
                    <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Learn Basics</span>
                </Link>
                <nav className="hidden md:flex gap-10">
                    <Link to="/playground" className="text-sm font-medium hover:underline underline-offset-4">
                        Editor
                    </Link>
                    <Link to="/private" className="text-sm font-medium hover:underline underline-offset-4">
                        Editor privado
                    </Link>
                    <Link to="/problems" className="text-sm font-medium hover:underline underline-offset-4">
                        Problemas
                    </Link>
                    <Link to="/admin" className="text-sm font-medium hover:underline underline-offset-4">
                        Admin
                    </Link>
                    <Link to="/about" className="text-sm font-medium hover:underline underline-offset-4">
                        Sobre nosotros
                    </Link>
                </nav>
                <div className="flex items-center gap-2">
                    <ModeToggle />
                    {/* Desktop Menu */}
                    <div className="hidden md:flex gap-2">
                        {isLoggedIn ? (
                            <>
                            <NotificationsDropdown />
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                        <User className="h-5 w-5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                        <Link to="/profile">Mi perfil</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <p onClick={handleLogout}>Cerrar sesion</p>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            </>
                        ) : (
                            <>
                                <Link to='/login'>
                                    <Button variant="outline" className="w-full cursor-pointer">
                                        Iniciar sesion
                                    </Button>
                                </Link>
                                <Link to='/register'>
                                    <Button className="w-full cursor-pointer">
                                        Registrarse
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="md:hidden">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Desplegar menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right">
                            <nav className="flex flex-col gap-4 mt-8 justify-between text-center">
                                <Link to="/playground" className="text-sm font-medium hover:underline underline-offset-4">
                                    Editor
                                </Link>
                                <Link to="/private" className="text-sm font-medium hover:underline underline-offset-4">
                                    Editor privado
                                </Link>
                                <Link to="/problems" className="text-sm font-medium hover:underline underline-offset-4">
                                    Problemas
                                </Link>
                                <Link to="/admin" className="text-sm font-medium hover:underline underline-offset-4">
                                    Admin
                                </Link>
                                <Link to="/about" className="text-sm font-medium hover:underline underline-offset-4">
                                    Sobre nosotros
                                </Link>
                                <div className="flex flex-col gap-2 mt-1 p-10 gap-y-4">
                                    {isLoggedIn ? (
                                        <>
                                        <Link to='/profile'>
                                            <Button variant="outline" className="w-full cursor-pointer">
                                                    Mi perfil
                                            </Button>
                                        </Link>
                                        <Button variant="outline" onClick={handleLogout} className="w-full cursor-pointer">
                                                    Mi perfil
                                        </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Link to='/login'>
                                                <Button variant="outline" className="w-full cursor-pointer">
                                                    Iniciar sesion
                                                </Button>
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    )
}