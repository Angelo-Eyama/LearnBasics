import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// 1. Obtener la ruta del archivo actual
const __filename = fileURLToPath(import.meta.url);

// 2. Obtener el directorio del archivo actual
const __dirname = path.dirname(__filename);

// 3. Obtener el directorio superior (padre)
const parentDir = path.dirname(__dirname);

// 4. ubir dos niveles y luego navegar a client/client.gen.ts
const targetFilePath = path.join(parentDir, 'src', 'client', 'client.gen.ts');

console.log(`Ruta del archivo destino: ${targetFilePath}`);

const linesToAppend = `
// Agregamos un interceptor para manejar el token de acceso
client.instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) config.headers.Authorization = \`Bearer \${token}\`;
    return config;
});

`;

fs.access(targetFilePath, fs.constants.F_OK, (err) => {
    if (err) {
        console.error(`El archivo ${targetFilePath} no existe.`);
        process.exit(1);
    }

    fs.appendFile(targetFilePath, linesToAppend, (err) => {
        if (err) {
            console.error(`Hubo un problema al pegar las lineas en el directorio ${targetFilePath}:`, err);
            process.exit(1);
        }

        console.log('Cliente personalizado correctamente modificado.');
    });
});