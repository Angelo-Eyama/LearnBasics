import { useState, Suspense, lazy } from "react";
import { Loading } from "@/components/ui/loading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Download, Copy } from "lucide-react";
const MonacoEditor = lazy(() => import('@monaco-editor/react')); //Carga dinámica del componente

const languages = [
    { value: "javascript", label: "JavaScript", extension: "js" },
    { value: "typescript", label: "TypeScript", extension: "ts" },
    { value: "python", label: "Python", extension: "py" },
    { value: "cpp", label: "C++", extension: "cpp" },
];

const themes = [
    { value: "vs", label: "Claro" },
    { value: "vs-dark", label: "Oscuro" },
]

export default function PublicPlayground() {
    const [language, setLanguage] = useState("javascript");
    const [theme, setTheme] = useState("vs-dark");
    const [code, setCode] = useState(`console.log('Hola mundo')`);
    const [output, setOutput] = useState("Aquí se mostrará la salida del código...");
    const [isRunning, setIsRunning] = useState(false);

    const handleRunCode = () => {
        setIsRunning(true);
        setOutput("Ejecutando...");

        // TODO: Mandar a ejecutar el código
        setTimeout(() => {
            setOutput("Hola mundo");
            setIsRunning(false);
        }, 1000);
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

    return (
        <div className="container mx-auto py-6 px-4">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Editor de código</h1>
                <p className="text-muted-foreground">Escribe, compila y ejecuta tu código aquí</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Select value={language} onValueChange={setLanguage}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select language" />
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
                                    <SelectValue placeholder="Select theme" />
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

                    <Card className="border rounded-md overflow-hidden h-[calc(100vh-250px)]">
                        <Suspense fallback={<Loading />}> 
                        <MonacoEditor
                            height="100%"
                            language={language}
                            theme={theme}
                            value={code}
                            onChange={(value) => setCode(value || "")}
                            options={{
                                minimap: { enabled: false },
                                scrollBeyondLastLine: false,
                                fontSize: 14,
                                automaticLayout: true,
                            }}
                        />
                        </Suspense>
                    </Card>
                </div>

                <div className="flex flex-col space-y-4">
                    <div className="flex items-center justify-between">
                    </div>
                    <Card className="border rounded-md overflow-hidden h-[calc(100vh-250px)]">
                        <div className="p-4 h-full bg-black text-white font-mono text-sm overflow-auto whitespace-pre-wrap">
                            {output || "Ejecuta el código para ver los resultados..."}
                        </div>
                        <Button size="sm" variant="outline" onClick={() => setOutput("")} className="p-4 mx-1">
                            Limpiar terminal
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    )
}