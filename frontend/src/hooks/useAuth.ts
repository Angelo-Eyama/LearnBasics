import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { 
    BodyAuthLoginForAccessToken,
    registerUser,
    getCurrentUser,
    loginForAccessToken,
    type UserPublic,
    type UserRegister,
} from "@/client";

import { ErrorResponse } from "@/client";
import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query"

const isLoggedIn = () => {
    return localStorage.getItem("access_token") !== null;
}


const useAuth = () => {
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { data: user, isLoading } = useQuery<UserPublic | null, Error>({
        queryKey: ["currentUser"],
        queryFn: async () => {
            const response = await getCurrentUser();
            if ('data' in response) {
                return response.data as UserPublic;
            }
            toast("Error al obtener el usuario actual")
            throw new Error("Error al obtener el usuario actual");
        },
        enabled: isLoggedIn(), // Only fetch if the user is logged in
        
    })

    const signUpMutation = useMutation({
        mutationFn: (data: UserRegister) => 
            registerUser({ body: data }),

        onSuccess: () => {
            navigate("/auth/login")
            toast.success("Cuenta creada", {
                description: "Su cuenta se ha creado con exito. Inicie sesion con sus credenciales"
            })
        },
        onError: (error: ErrorResponse) => {
            let errorMessage = error?.detail || "Error al crear la cuenta";

            toast.error("Error", {
                description: errorMessage
            })
        },
        // onSettled is equivalent to finally in async/await
        // It runs after the mutation is either successful or fails
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["users"]})
        },
    })

    const login = async (data: BodyAuthLoginForAccessToken) => {
        const response = await loginForAccessToken({
            body: data,
        })
        if (response?.data?.access_token) {
            localStorage.setItem("access_token", response.data.access_token);
        } else {
            setError("Error: Access token is missing in the response")
            throw new Error( "Access token is missing in the response")
        }
    }

    const loginMutation = useMutation({
        mutationFn: login,

        onSuccess: () => {
            navigate("/")
        },

        onError: (error: Error) => {
            let errorMessage = error?.message || "Error al iniciar sesion";

            toast.error("Error", {
                description: errorMessage
            })
            // Just in case...
            setError(`Error: ${errorMessage}`)
        },
    })

    const logout = () => {
        localStorage.removeItem("access_token");
        queryClient.invalidateQueries({
            queryKey: ["currentUser"],
            // Do not refetch the current user after logging out
            refetchType: "none",
        })
        navigate("/auth/login")
    }

    return {
        user,
        isLoading,
        error,
        loginMutation,
        signUpMutation,
        logout,
        resetError: () => setError(null),
    }
}

export { isLoggedIn }
export default useAuth