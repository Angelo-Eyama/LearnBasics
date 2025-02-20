import { Extension } from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { javascript } from '@codemirror/lang-javascript';
import { cpp } from '@codemirror/lang-cpp';

export const languageExtensions: { [key: string]: [extension: Extension, defaultCode: string] } = {
    'python': [python(), `print('Hello, World in Python language!')`],
    'javascript': [javascript(), `console.log('Hello, World in JavaScript language!')`],
    'c': [cpp(), `#include <stdio.h>\n\nint main() {\n\tprintf("Hello, World in C language!\\n");\n\treturn 0;\n}`],
    // Agregar más lenguajes y sus extensiones aquí
};

