import { NavLink } from "react-router-dom";


export const NavLinks = ({ isLoggedIn }: { isLoggedIn:() => boolean }) => {
    return (
        <>
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
                        </NavLink> {/* Solo visible para administradores y moderadores */}
                        <NavLink to="/about" className="text-sm font-medium hover:underline underline-offset-4">
                            Sobre nosotros
                        </NavLink>
                    </>
                )
            }
        </>
    );
}