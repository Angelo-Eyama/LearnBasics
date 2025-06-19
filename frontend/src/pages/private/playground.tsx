import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Download, Copy, MessageSquare } from "lucide-react";
import Editor from "@/components/editor";
import { useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { compileCode, getFeedback } from "@/client";
const languages = [
    { value: "javascript", label: "JavaScript", extension: "js" },
    { value: "python", label: "Python", extension: "py" },
    { value: "c", label: "C", extension: "cpp" },
];

const themes = [
    { value: "vs", label: "Claro" },
    { value: "vs-dark", label: "Oscuro" },
]
//TODO: Refactorizar los dos editores extrayendo los componentes y props comunes

export function PublicPlayground() {
    const [language, setLanguage] = useState("javascript");
    const [theme, setTheme] = useState("vs-dark");
    const [code, setCode] = useState(`console.log('Hola mundo')`);
    const [output, setOutput] = useState("Aquí se mostrará la salida del código...");
    const [inputs, setInputs] = useState("");
    const [isRunning, setIsRunning] = useState(false);


    // Mutacion para ejecutar código
    const compileCodeMutation = useMutation({
        mutationFn: async () => {
            setIsRunning(true);
            const response = await compileCode({
                body: {
                    code: code,
                    language: language,
                    input_data: inputs,
                }
            });
            if (response.status !== 200 || !("data" in response)) {
                toast.error(`Error ${response.status}`, {
                    description: Array.isArray(response.error?.detail)
                        ? response.error.detail.map((err: any) => err.msg || JSON.stringify(err)).join(", ")
                        : (response.error?.detail || "Error al enviar código")
                });
                throw new Error(`Error ${response.status} al enviar el código`);
            }
            return response.data;
        },
        onSuccess: (data) => {
            if(!data) {
                setOutput("Error: No se recibió respuesta del servidor");
                return;
            }
            if (data.success) {
                setOutput(`${data.output}\n\nTiempo de ejecución: ${data.execution_time.toFixed(3)}s`);
            } else {
                setOutput(`${data.error || 'Error desconocido'}\n\nTiempo de ejecución: ${data.execution_time.toFixed(3)}s`);
            }
        },
        onError: (error: Error) => {
            setOutput(`Error de conexión: ${error.message}`);
        },
        onSettled: () => {
            setIsRunning(false);
        }
    });

    const handleRunCode = () => {
        compileCodeMutation.mutateAsync();
    }

    const handleCopyCode = () => {
        navigator.clipboard.writeText(code);
    }

    const handleDownloadCode = () => {
        const blob = new Blob([code], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `code.${languages.find((lang) => lang.value === language)?.extension ?? 'txt'}`;
        a.click();
        document.body.removeChild(a);
    }

    const handleChangeLanguage = (value: string) => {
        setLanguage(value);
        setCode(`${value == 'python' ? '#' : '//'} Escribe tu código aquí en ${languages.find((lang) => lang.value === value)?.label || 'JavaScript'}`);
        setOutput("Aquí se mostrará la salida del código...");
    }

    return (
        <div className="container mx-auto py-6 px-4">
            <title>Editor</title>
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Editor de código</h1>
                <p className="text-muted-foreground">Escribe, compila y ejecuta tu código aquí</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Select value={language} onValueChange={handleChangeLanguage}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Seleccione lenguaje" />
                                </SelectTrigger>
                                <SelectContent>
                                    {languages.map((lang) => (
                                        <SelectItem key={lang.value} value={lang.value}>
                                            {lang.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={theme} onValueChange={setTheme}>
                                <SelectTrigger className="w-[120px]">
                                    <SelectValue placeholder="Seleccione tema" />
                                </SelectTrigger>
                                <SelectContent>
                                    {themes.map((t) => (
                                        <SelectItem key={t.value} value={t.value}>
                                            {t.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline" onClick={handleCopyCode}>
                                <Copy className="h-4 w-4 mr-2" />
                                Copiar
                            </Button>
                            <Button size="sm" variant="outline" onClick={handleDownloadCode}>
                                <Download className="h-4 w-4 mr-2" />
                                Descargar
                            </Button>
                            <Button size="sm" variant="default" onClick={handleRunCode} disabled={isRunning}>
                                <Play className="h-4 w-4 mr-2" />
                                Ejecutar
                            </Button>
                        </div>
                    </div>
                    <Card className="border rounded-md h-[calc(100vh-250px)] pb-2 pt-0.5 px-0.5">
                        <Editor language={language} theme={theme} code={code} setCode={setCode} />
                        <Input
                            type="text"
                            placeholder="Parametros de entrada"
                            className="border-2 mt-1"
                            onChange={(e) => setInputs(e.target.value)}
                        />
                    </Card>

                </div>

                <div className="flex flex-col space-y-4">
                    <div className="flex items-center justify-between">
                    </div>
                    <Card className="px-0.5 py-1.5 border rounded-md overflow-hidden h-[calc(100vh-250px)]">
                        <div className="pb-0 p-4 h-full bg-black text-white font-mono text-sm overflow-auto whitespace-pre-wrap">
                            {output || "Ejecuta el código para ver los resultados..."}
                        </div>
                        <Button size="sm" variant="outline" onClick={() => setOutput("")} className="p-4 mx-1 hover:bg-red-700 cursor-pointer">
                            Limpiar terminal
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export function PrivatePlayground() {
    const [language, setLanguage] = useState("javascript")
    const [theme, setTheme] = useState("vs-dark")
    const [code, setCode] = useState("console.log('Hola mundo')")
    const [output, setOutput] = useState("")
    const [feedback, setFeedback] = useState("")
    const [isRunning, setIsRunning] = useState(false)
    const [isGettingFeedback, setIsGettingFeedback] = useState(false)
    const [activeTab, setActiveTab] = useState("output")
    const [inputs, setInputs] = useState("")

    // Mutacion para ejecutar código
    const compileCodeMutation = useMutation({
        mutationFn: async () => {
            setIsRunning(true);
            const response = await compileCode({
                body: {
                    code: code,
                    language: language,
                    input_data: inputs,
                }
            });
            if (response.status !== 200 || !("data" in response)) {
                toast.error(`Error ${response.status}`, {
                    description: Array.isArray(response.error?.detail)
                        ? response.error.detail.map((err: any) => err.msg || JSON.stringify(err)).join(", ")
                        : (response.error?.detail || "Error al enviar código")
                });
                throw new Error(`Error ${response.status} al enviar el código`);
            }
            return response.data;
        },
        onSuccess: (data) => {
            if(!data) {
                setOutput("Error: No se recibió respuesta del servidor");
                return;
            }
            if (data.success) {
                setOutput(`${data.output}\n\nTiempo de ejecución: ${data.execution_time.toFixed(3)}s`);
            } else {
                setOutput(`${data.error || 'Error desconocido'}\n\nTiempo de ejecución: ${data.execution_time.toFixed(3)}s`);
            }
        },
        onError: (error: Error) => {
            setOutput(`Error de conexión: ${error.message}`);
        },
        onSettled: () => {
            setIsRunning(false);
        }
    });

    //Mutacion para pedir feedback
    const getFeedbackMutation = useMutation({
        mutationFn: async () => {
            setIsGettingFeedback(true);
            setFeedback("Analizando código...\n");
            const response = await getFeedback({
                body: {
                    code: code,
                    language: language,
                    output: output,
                }
            });
            if (response.status !== 200 || !("data" in response)) {
                toast.error(`Error ${response.status}`, {
                    description: Array.isArray(response.error?.detail)
                        ? response.error.detail.map((err: any) => err.msg || JSON.stringify(err)).join(", ")
                        : (response.error?.detail || "Error al obtener feedback")
                });
                throw new Error(`Error ${response.status} al obtener feedback`);
            }
            setFeedback(response.data || "No se recibió feedback");
        },
        onSettled: () => {
            setIsGettingFeedback(false);
        }
    })

    const handleRunCode = () => {
        compileCodeMutation.mutateAsync();
    }

    const handleGetFeedback = () => {
        setActiveTab("feedback")
        getFeedbackMutation.mutateAsync()
    }

    const handleCopyCode = () => {
        navigator.clipboard.writeText(code)
    }

    const handleDownloadCode = () => {
        const element = document.createElement("a")
        const file = new Blob([code], { type: "text/plain" })
        element.href = URL.createObjectURL(file)
        element.download = `code.${languages.find((lang) => lang.value === language)?.extension ?? 'txt'}`;
        document.body.appendChild(element)
        element.click()
        document.body.removeChild(element)
    }

    const handleChangeLanguage = (value: string) => {
        setLanguage(value);
        setCode(`${value == 'python' ? '#' : '//'} Escribe tu código aquí en ${languages.find((lang) => lang.value === value)?.label || 'JavaScript'}`);
        setOutput("Aquí se mostrará la salida del código...");
    }

    return (
        <div className="container mx-auto py-6 px-4">
            <title>Editor privado</title>
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Editor de código</h1>
                <p className="text-muted-foreground">Escribe, compila y ejecuta tu código aquí</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Select value={language} onValueChange={handleChangeLanguage}>
                                <SelectTrigger className="w-[120px]">
                                    <SelectValue placeholder="Seleccione lenguaje" />
                                </SelectTrigger>
                                <SelectContent>
                                    {languages.map((lang) => (
                                        <SelectItem key={lang.value} value={lang.value}>
                                            {lang.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={theme} onValueChange={setTheme}>
                                <SelectTrigger className="w-[100px]">
                                    <SelectValue placeholder="Seleccione tema" />
                                </SelectTrigger>
                                <SelectContent>
                                    {themes.map((t) => (
                                        <SelectItem key={t.value} value={t.value}>
                                            {t.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline" onClick={handleCopyCode}>
                                <Copy className="h-4 w-4 mr-2" />
                                Copiar
                            </Button>
                            <Button size="sm" variant="outline" onClick={handleDownloadCode}>
                                <Download className="h-4 w-4 mr-2" />
                                Descargar
                            </Button>
                            <Button size="sm" variant="default" onClick={handleRunCode} disabled={isRunning}>
                                <Play className="h-4 w-4 mr-2" />
                                Ejecutar
                            </Button>
                        </div>
                    </div>

                    <Card className="border rounded-md h-[calc(100vh-250px)] pb-2 pt-0.5 px-0.5">
                        <Editor language={language} theme={theme} code={code} setCode={setCode} />
                        <Input
                            type="text"
                            placeholder="Parametros de entrada"
                            className="border-2 mt-1"
                            onChange={(e) => setInputs(e.target.value)}
                        />
                    </Card>
                </div>

                <div className="flex flex-col space-y-4 mx-2">
                    <div className="flex items-center justify-between">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <div className="flex items-center justify-between w-full">
                                <TabsList>
                                    <TabsTrigger value="output">Salida</TabsTrigger>
                                    <TabsTrigger value="feedback">AI Feedback</TabsTrigger>
                                </TabsList>
                                <div className="flex items-center space-x-2">
                                    {activeTab === "output" ? (
                                        <Button size="sm" variant="outline" onClick={() => setOutput("")}>
                                            Limpiar
                                        </Button>
                                    ) : (
                                        <Button size="sm" variant="default" onClick={handleGetFeedback} disabled={isGettingFeedback}>
                                            <MessageSquare className="h-4 w-4 mr-2" />
                                            Obtener feedback
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </Tabs>
                    </div>

                    <Card className="px-0.5 pb-0 pt-1 border rounded-md overflow-hidden h-[calc(100vh-250px)]">
                        <Tabs defaultValue="output" value={activeTab} className="w-full h-full">
                            <TabsContent value="output" className="h-full m-0">
                                <div className="h-full bg-black text-white font-mono text-sm overflow-auto whitespace-pre-wrap">
                                    {output || "Ejecute el código para ver la salida aquí..."}
                                </div>
                            </TabsContent>
                            <TabsContent value="feedback" className="h-full m-0">
                                <div className="p-4 h-full bg-card text-card-foreground overflow-auto whitespace-pre-wrap">
                                    {
                                    feedback.trim() ?  
                                        <pre className="whitespace-pre-wrap"> {feedback} </pre>
                                        : "Pulsa 'Obtener feedback' para recibir respuesta del análisis de nuestra IA..."
                                    }
                                </div>
                            </TabsContent>
                        </Tabs>
                    </Card>
                </div>
            </div>
        </div>
    )
}