# Learn Basics Frontend

Learn Basics es una aplicación educativa diseñada para ayudar a estudiantes de todos los niveles a practicar los conceptos fundamentales de programación. 

La plataforma ofrece una experiencia interactiva con ejercicios, desafíos de código y retroalimentación instantánea sobre el código escrito.


## 🚀 Tecnologías utilizadas

- **React 18** - Biblioteca para construir interfaces de usuario
- **TypeScript** - Lenguaje de programación tipado que se compila a JavaScript
- **Vite** - Herramienta de compilación que proporciona un entorno de desarrollo más rápido
- **React Router** - Enrutamiento declarativo para aplicaciones React
- **Tailwind CSS** - Framework de CSS utilizado para el diseño
- **Shadcn/UI** - Componentes reutilizables y accesibles para React
- **Monaco Editor** - Editor de código similar a VS Code integrado en la aplicación
- **TanStack Query** - Biblioteca para gestión de estado y caché de datos
- **Lucide React** - Conjunto de iconos para React

## ⚙️ Requisitos previos

- [Node.js](https://nodejs.org/en/download) (versión 16 o superior)
- [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) o [pnpm](https://www.npmjs.com/package/pnpm)

## 🛠️ Instalación

1. Clona el repositorio
   ```bash
   git clone https://github.com/Angelo-Eyama/LearnBasics
   cd learnbasics/frontend
   ```

2. Instala las dependencias
   ```bash
   npm install
   # o con pnpm
   pnpm install
   ```

3. Inicia el servidor de desarrollo
   ```bash
   npm run dev
   # o con pnpm
   pnpm dev
   ```

4. Abre tu navegador en `http://localhost:5173`

## 📋 Características

- **Playground de código**: Editor interactivo que soporta múltiples lenguajes (JavaScript, Python, C++)
- **Problemas con test cases**: Ejercicios prácticos con verificación automática
- **Panel de administración**: Gestión de problemas, usuarios y comentarios
- **Autenticación de usuarios**: Registro, inicio de sesión y perfiles personalizados
- **Diseño responsive**: Optimizado para dispositivos móviles y pantallas grandes

## 📁 Estructura del proyecto

```
frontend/
├── public/         # Assets estáticos
├── src/
│   ├── assets/     # Imágenes y recursos
│   ├── client/     # Cliente API generado
│   ├── components/ # Componentes reutilizables
│   │   └── ui/     # Componentes de UI básicos (Shadcn)
│   ├── hooks/      # Custom hooks de React
│   ├── lib/        # Utilidades y configuraciones
│   ├── pages/      # Componentes de página
│   └── utils/      # Funciones utilitarias
└── scripts/        # Scripts de desarrollo
```

## 🔧 Scripts disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Compila la aplicación para producción
- `npm run preview` - Previsualiza la versión compilada
- `npm run lint` - Ejecuta el linter

## 📖 Documentación adicional

Para más información sobre las tecnologías utilizadas:

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Shadcn/UI](https://ui.shadcn.com/)

## 💼 Créditos
- El logo de la aplicación fue creado por el diseñador [Juicy's Fish](https://www.flaticon.com/authors/juicy-fish) y se encuentra disponible en [Flaticon](https://www.flaticon.com/free-icons/refactoring).