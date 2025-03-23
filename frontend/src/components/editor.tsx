import { lazy, Suspense } from "react";
import { Loading } from "./ui/loading";
const MonacoEditor = lazy(() => import('@monaco-editor/react')); //Carga dinámica del componente

interface EditorProps {
    language: string;
    code: string;
    theme: string;
    setCode: (value: string) => void;
}

export default function Editor ({ language, code, theme, setCode}: EditorProps)  {
    return (
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
    );
}