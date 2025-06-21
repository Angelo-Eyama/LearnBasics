"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function VerifyRegisterPage() {
	const [searchParams,] = useSearchParams();
	const token = searchParams?.get("token");

	const [verificationState, setVerificationState] = useState<"loading" | "success" | "error">("loading");

	useEffect(() => {
		if (!token) {
			setVerificationState("error");
			return;
		}

		// Simulamos una verificación de token
		const verifyToken = setTimeout(() => {
			// Por ahora, simulamos una verificación exitosa si el token comienza con "valid"
			if (token.startsWith("valid")) {
				setVerificationState("success");
				toast.success("Cuenta verificada", {
					description: "Su cuenta ha sido verificada con éxito. Ahora puede iniciar sesión en su cuenta.",
				});
			} else {
				setVerificationState("error");
				toast.error("Error en la verificación", {
					description: "El enlace de verificación es inválido o ha expirado. Por favor solicite un nuevo enlace de verificación.",
				});
			}
		}, 2000);

		return () => clearTimeout(verifyToken);
	}, [token, toast]);

	return (
		<div className="container flex h-screen w-screen flex-col items-center justify-center">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
						{verificationState === "loading" && (
							<Loader2 className="h-6 w-6 text-primary animate-spin" />
						)}
						{verificationState === "success" && (
							<CheckCircle className="h-6 w-6 text-green-600" />
						)}
						{verificationState === "error" && (
							<XCircle className="h-6 w-6 text-destructive" />
						)}
					</div>
					<CardTitle className="text-2xl">
						{verificationState === "loading" && "Verificando cuenta..."}
						{verificationState === "success" && "Cuente verificada"}
						{verificationState === "error" && "Verificación fallida"}
					</CardTitle>
					<CardDescription>
						{verificationState === "loading" &&
							"Por favor, espere mientras verificamos su cuenta..."}
						{verificationState === "success" &&
							"Su cuenta ha sido verificada con éxito. Ahora puede iniciar sesión en su cuenta."}
						{verificationState === "error" &&
							"El enlace de verificación es inválido o ha expirado. Por favor solicite un nuevo enlace de verificación."}
					</CardDescription>
				</CardHeader>
				<CardFooter className="flex flex-col space-y-2">
					{verificationState === "success" && (
						<Button asChild className="w-full">
							<Link to="/auth/login">Volver a login</Link>
						</Button>
					)}
					{verificationState === "error" && (
						<>
							<Button
								onClick={() => {
									toast.info("Funcionalidad no implementada", {
										description: "Pero pendiente para un futuro cercano 😅",
									})
								}}
								className="w-full"
							>
								Reenviar correo de Verificación
							</Button>
							<Button variant="outline" asChild className="w-full">
								<Link to="/auth/login">Volver a login</Link>
							</Button>
						</>
					)}
					{verificationState === "loading" && (
						<div className="w-full text-center text-sm text-muted-foreground">
							Espere un momento...
						</div>
					)}
				</CardFooter>
			</Card>
		</div>
	);
}
