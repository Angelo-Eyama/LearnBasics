import { NavLink } from "react-router";
import { Button } from "@/components/ui/button";

const AuthButtons = () => {
    return (
        <>
            <NavLink to='/auth/login'>
                <Button variant="outline" className="w-full cursor-pointer">
                    Iniciar sesion
                </Button>
            </NavLink>
            <NavLink to='/auth/register'>
                <Button className="w-full cursor-pointer">
                    Registrarse
                </Button>
            </NavLink>
        </>
    )
}
export default AuthButtons;