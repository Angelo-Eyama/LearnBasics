# Documentación Backend - LearnBasics

## Descripción
Esta parte del proyecto representa el backend de la aplicación **LearnBasics**, una plataforma para aprender programación a través de ejercicios prácticos. El backend proporciona todos los servicios necesarios para la lógica de negocio, autenticación, evaluación de código y comunicación con la base de datos.

## Tecnologías y Características

### Frameworks y Librerías Principales
- **FastAPI**: Framework de Python de alto rendimiento para construir APIs
- **SQLModel**: ORM que combina SQLAlchemy y Pydantic para tipado estático
- **MySQL**: Sistema de gestión de bases de datos relacional
- **Alembic**: Herramienta para migraciones de bases de datos
- **JWT**: Implementación de JSON Web Tokens para autenticación segura

### Características Destacadas
- **Sistema de autenticación**: Basado en JWT con tokens de acceso y refresco
- **Evaluación automática de código**: A través de microservicios Docker para distintos lenguajes
- **Migraciones de bases de datos**: Gestionadas con Alembic para control de versiones
- **Procesamiento en segundo plano**: Para tareas como evaluación de código y revisión
- **API documentada**: Con Swagger UI integrado a través de FastAPI

## Requisitos previos
- Python 3.10 o superior
- MySQL 8.0 o superior
- Docker y Docker Compose (para los servicios de compilación)
- Git

## Instalación

### 1. Preparar el entorno virtual
Crea y activa un entorno virtual de Python:

```bash
# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
source venv/bin/activate  # Linux/macOS
.\venv\Scripts\activate   # Windows
```

### 2. Instalar dependencias
Con el entorno activado, instala todas las dependencias:

```bash
pip install -r requirements.txt
```

### 3. Configurar variables de entorno
Copia el archivo de ejemplo y configura tus variables de entorno:

```bash
cp .env.example .env
```

Edita el archivo `.env` con la siguiente información:

```
# Configuración de la base de datos
DB_HOST=localhost
DB_PORT=3306
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=learnbasics

# Configuración de JWT
SECRET_KEY=una_clave_secreta_larga_y_segura
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Configuración de la aplicación
APP_NAME=LearnBasics
BACKEND_CORS_ORIGINS=["http://localhost:3000","http://localhost:8000"]

# Configuración de servicios AI (opcional)
OPENAI_API_KEY=tu_clave_api
```

### 4. Configurar la base de datos
Asegúrate de tener MySQL en ejecución y crea la base de datos:

```bash
# Accede a MySQL y crea la base de datos
mysql -u tu_usuario -p
CREATE DATABASE learnbasics;
```

### 5. Ejecutar migraciones
Utiliza Alembic para crear todas las tablas necesarias:

```bash
# Verificar que el motor de base de datos está en ejecución
alembic upgrade head
```

### 6. Iniciar los compiladores (opcional si desarrollas problemas de código)
Los servicios de compilación se ejecutan en contenedores Docker:

```bash
# Inicia los servicios con el script proporcionado
python start_compilers.py

# Para reconstruir las imágenes si has hecho cambios
python start_compilers.py --rebuild
```

## Ejecución del servidor

Para iniciar el servidor de desarrollo:

```bash
# Opción 1: Usando uvicorn directamente
uvicorn app.main:app --reload

# Opción 2: Usando el CLI de FastAPI (si está instalado)
fastapi dev app/main.py
```

Accede a la documentación interactiva en [http://localhost:8000/docs](http://localhost:8000/docs)

## Estructura del Proyecto

```
backend/
├── alembic/                    # Migraciones de la base de datos
├── app/
│   ├── api/                    # Controladores y enrutadores de la API
│   ├── core/                   # Configuración, seguridad y utilidades
│   ├── models/                 # Modelos de la base de datos (SQLModel)
│   ├── schemas/                # Esquemas Pydantic para validación
│   └── services/               # Servicios externos (Docker, IA)
├── tests/                      # Tests unitarios y de integración
├── .env                        # Variables de entorno (no incluido en git)
├── .env.example                # Ejemplo de variables de entorno
├── alembic.ini                 # Configuración de Alembic
├── requirements.txt            # Dependencias del proyecto
└── start_compilers.py          # Script para iniciar servicios Docker
```
