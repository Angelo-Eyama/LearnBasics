import CodeMirror, { Extension } from '@uiw/react-codemirror';
import { vscodeDark, vscodeLight } from '@uiw/codemirror-theme-vscode';

type ThemeType = typeof vscodeDark | typeof vscodeLight;

interface EditorProps {
    code: string;
    language: string;
    extension: Extension;
    theme: ThemeType;
    onChange: (value: string) => void;
}

export function Editor({ code, theme, extension, onChange }: EditorProps) {
    return (
        <CodeMirror
            value={code}
            height='350px'
            // REMINDER: The 'c-like' languages are not supported by the CodeMirror library
            extensions={[ extension]} 
            theme={theme}
            onChange={onChange}
            className="rounded-lg overflow-hidden border border-gray-700"
        />
    );
}