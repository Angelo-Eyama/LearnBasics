import { Link, useNavigate } from "react-router";
import { ModeToggle } from "@/components/mode-toggle";
import NotificationsDropdown from "./notifications-dropdown";
import useAuth, { isLoggedIn } from "@/hooks/useAuth";
import { DesktopUserMenu, MobileUserMenu } from "./user-menu";
import AuthButtons from "./authButtons";
import { NavLinks } from "./nav-links";
export default function NavigationBar() {
    const { user, logout } = useAuth();
    const Navigate = useNavigate();
    const handleLogout = () => {
        logout();
        Navigate("/auth/login");
    }
    const isAdmin = user?.roles.some(role => role.name === "administrador");
    const isModerator = user?.roles.some(role => role.name === "moderador");
    const isStudent = user?.roles.some(role => role.name === "estudiante");
    const permissions = [isAdmin, isModerator, isStudent];
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <img src="https://fakerjs.dev/logo.svg" className="h-8" alt="Company's logo" />
                    <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Learn Basics</span>
                </Link>
                <nav className="hidden md:flex gap-10">
                    <NavLinks isLoggedIn={isLoggedIn} permissions={permissions} />
                </nav>
                <div className="flex items-center gap-2">
                    <ModeToggle />
                    {/* Desktop Menu */}
                    <div className="hidden md:flex gap-2">
                        {isLoggedIn() ? (
                            <>
                                <NotificationsDropdown />
                                <DesktopUserMenu onLogout={handleLogout} />
                            </>
                        ) : (
                            <AuthButtons />
                        )}
                    </div>

                    {/* Mobile Menu */}
                    <MobileUserMenu onLogout={handleLogout} isLoggedIn={isLoggedIn} permissions={permissions} />
                </div>
            </div>
        </header>
    )
}