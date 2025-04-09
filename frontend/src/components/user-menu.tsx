import { memo } from "react";
import { NavLink } from "react-router";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button";
import { Menu, User } from "lucide-react";
import AuthButtons from "./authButtons";

export const DesktopUserMenu = memo(({ onLogout }: { onLogout: () => void }) => (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <User className="h-5 w-5" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
                <NavLink to="/profile">Mi perfil</NavLink>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
                <p onClick={onLogout}>Cerrar sesion</p>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
))

export const MobileUserMenu = memo(({ onLogout, isLoggedIn }: { onLogout: () => void, isLoggedIn:() => boolean }) => (
    <Sheet>
        <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Desplegar menu</span>
            </Button>
        </SheetTrigger>
        <SheetContent side="right">
            <nav className="flex flex-col gap-4 mt-8 justify-between text-center">
                <NavLink to="/playground" className="text-sm font-medium hover:underline underline-offset-4">
                    Editor
                </NavLink>
                {
                    isLoggedIn() && (
                        <>
                            <NavLink to="/private" className="text-sm font-medium hover:underline underline-offset-4">
                                Editor privado
                            </NavLink>
                            <NavLink to="/problems" className="text-sm font-medium hover:underline underline-offset-4">
                                Problemas
                            </NavLink>
                            <NavLink to="/admin" className="text-sm font-medium hover:underline underline-offset-4">
                                Admin
                            </NavLink>
                            <NavLink to="/about" className="text-sm font-medium hover:underline underline-offset-4">
                                Sobre nosotros
                            </NavLink>
                        </>
                    )
                }

                <div className="flex flex-col gap-2 mt-1 p-10 gap-y-4">
                    {isLoggedIn() ? (
                        <>
                            <NavLink to='/profile'>
                                <Button variant="outline" className="w-full cursor-pointer">
                                    Mi perfil
                                </Button>
                            </NavLink>
                            <Button variant="destructive" onClick={onLogout} className="w-full cursor-pointer">
                                Cerrar sesion
                            </Button>
                        </>
                    ) : (
                        <>
                            <AuthButtons />
                        </>
                    )}
                </div>
            </nav>
        </SheetContent>
    </Sheet>
))