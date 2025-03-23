// TODO: Crear componente para mostrar el detalle de un problema
// Parecida a la vista de editar problema, pero sin botones de edición

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

// y con un botón para volver a la lista de problemas
export default function ProblemDetailPage() {
    return (
        <div className="container mx-auto py-6">
            <title>Detalle del problema</title>
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Problem Detail</h1>
                <p className="text-muted-foreground">View problem details</p>
            </div>

            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-xl">Problem Name</CardTitle>
                    <CardDescription>Problem description</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-between items-center">
                        <div className="text-3xl font-bold">Problem Content</div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button asChild className="w-full mt-4">
                        <Link to="/admin/problems">Back to Problems</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}