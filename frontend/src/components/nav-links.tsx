import { NavLink } from "react-router-dom";


export const NavLinks = ({ isLoggedIn, permissions }: { isLoggedIn: () => boolean, permissions: Array<boolean | undefined> }) => {
    const [isAdmin, isModerator, _] = permissions;
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
                        {(isAdmin || isModerator) && (
                            <NavLink to="/admin" className="text-sm font-medium hover:underline underline-offset-4">
                                Admin
                            </NavLink>
                        )
                        }
                        <NavLink to="/about" className="text-sm font-medium hover:underline underline-offset-4">
                            Sobre nosotros
                        </NavLink>
                    </>
                )
            }
        </>
    );
}