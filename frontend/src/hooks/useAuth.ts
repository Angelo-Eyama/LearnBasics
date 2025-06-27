import { useNavigate } from "react-router-dom"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import {
    BodyAuthLoginForAccessToken,
    registerUser,
    getCurrentUser,
    loginForAccessToken,
    type UserRegister,
} from "@/client";
import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query"
import { jwtDecode } from "jwt-decode";

const isLoggedIn = () => {
    return localStorage.getItem("access_token") !== null;
}

const getUserId = () => {
    const token = localStorage.getItem("access_token");
    if (!token) return null;

    try {
        const decoded: { sub: string, username: string } = jwtDecode(token);
        return decoded.sub;
    } catch (error) {
        console.error("Error decodificando token:", error);
        return null;
    }
}


const useAuth = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { data: user, isLoading } = useQuery({
        queryKey: ["currentUser"],
        queryFn: async () => {
            const response = await getCurrentUser();
            if(response.status !== 200){
                logout();
                throw new Error(`Error ${response.status} al obtener el usuario`);
            }
            return response.data;
        },
        enabled: isLoggedIn(),
        retry: false
    })

    const signUpMutation = useMutation({
        mutationFn: async (data: UserRegister) => {
            const response = await registerUser({body: data})
            if (response.status !== 200 || !("data" in response)) {
                if (response.status === 401) {
                    throw Error("Error al crear la cuenta, por favor intente de nuevo")
                }
            }
        },

        onSuccess: () => {
            navigate("/auth/login")
            toast.success("Cuenta creada", {
                description: "Su cuenta se ha creado con exito. Inicie sesion con sus credenciales"
            })
        },

        onError: (error) => {
            toast.error("Error", { description: error.message || "Error al crear la cuenta" })
        }
    })

    const loginMutation = useMutation({
        mutationFn: async (data: BodyAuthLoginForAccessToken) => {
            const response = await loginForAccessToken({body: data})
            if (response.status !== 200 || !("data" in response)) {
                if (response.status === 401) {
                    throw Error("Credenciales incorrectas, por favor intente de nuevo")
                } else if (response.status === 400){
                    throw Error("Su cuenta ha sido desactivada, por favor contacte con el administrador")
                }
            }
            if (response.data?.access_token){
                localStorage.setItem("access_token", response.data.access_token);
                queryClient.invalidateQueries({
                    queryKey: ["currentUser"],
                })
            }
            if(!response){
                toast.info("No se ha podido iniciar sesión, compruebe sus credenciales")
            }
        },

        onSuccess: () => {
            toast.success("Inicio de sesión exitoso")
        },

        onError: (error) => {
            toast.error("Error", {description: error.message || "Error al iniciar sesión"})
        },
    })

    const logout = () => {
        localStorage.removeItem("access_token");
        console.log("Logout")
        queryClient.invalidateQueries({
            queryKey: ["currentUser"],
            refetchType: "none",
        })
        navigate("/")
    }

    return {
        user,
        isLoading,
        loginMutation,
        signUpMutation,
        logout,
    }
}

export { isLoggedIn, getUserId }
export default useAuth