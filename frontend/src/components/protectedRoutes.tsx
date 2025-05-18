import { Navigate, Outlet } from "react-router-dom";
import useAuth, { isLoggedIn } from "@/hooks/useAuth";
import NotFound from "@/pages/public/not-found";

interface ProtectedRoutesProps {
    adminRoute?: boolean;
    moderatorRoute?: boolean;
}

export const ProtectedRoutes: React.FC<ProtectedRoutesProps> = ({ 
    adminRoute = false, 
    moderatorRoute = false 
}) => {
    const { user } = useAuth();
    
    if (!isLoggedIn() || !user) {
        return <Navigate to="/auth/login" replace />;
    }
    
    const isAdmin = user.roles.some(role => role.name === "administrador");
    const isModerator = user.roles.some(role => role.name === "moderador");
    const isStudent = user.roles.some(role => role.name === "estudiante");
    
    
    if (isAdmin) {
        return <Outlet />;
    }    
    if (isModerator) {
        if (adminRoute) {
            // Los moderadores no pueden acceder a rutas exclusivas de administrador
            return <NotFound />;
        }
        return <Outlet />;
    }
    if (isStudent) {
        if (adminRoute || moderatorRoute) {
            return <NotFound />;
        }
        return <Outlet />;
    }
    // Si el usuario tiene un rol no reconocido, mostrar página de no encontrado
    return <NotFound />;
};

export default ProtectedRoutes;