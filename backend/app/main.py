from fastapi import FastAPI
from contextlib import asynccontextmanager
from .routers import users, submissions, problems, roles
from .database import create_db_and_tables, create_rows
from sqlalchemy.exc import IntegrityError


tags_metadata = [
    {
        "name": "Usuarios",
        "description": "Operaciones relacionadas con la gestion de los usuarios (CRUD). También están las acciones de iniciar, cerrar sesion, cambiar contraseña, etc.",
    },
    {
        "name": "Problemas",
        "description": "Operaciones relacionadas con la gestion de los problemas (CRUD). También están las acciones de ver problemas por bloque, ver problemas por usuario, etc.",
    },
    {
        "name": "Entregas",
        "description": "Conjunto de operaciones relacionadas con las entregas de los problemas.",
    },
    {
        "name": "Roles",
        "description": "Operaciones relacionadas con la gestion de los roles (CRUD), asignar y revocar roles.",
    }
]

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        # Acciones a realizar al inicio de la aplicacion
        print("La aplicación se está iniciando...")
        create_db_and_tables()
        yield
    finally:
        # Acciones a realizar al final de la aplicacion
        print("La aplicación se está apagando...")

app = FastAPI(
    title="Learn Basics Backend",
    description='''
    API para la aplicación de Learn Basics.
    Esta parte de la aplicacion representa el backend y ha sido desarrollada con FastAPI.
    En esta parte de la aplicacion se gestionan los datos recibidos desde el frontend y se realizan las operaciones necesarias para almacenarlos en la base de datos.
    Se ha utilizado **SQLModel** para la gestion de la base de datos.
    Desde la validacion de los tokens, el inicio de sesion, el registro de usuarios, la creacion de problemas, la realizacion de entregas, la gestion de comentarios y notificaciones, hasta la gestion de roles y permisos, todo se realiza en esta parte de la aplicacion.
    
    ''',
    contact={
        "name": "Learn Basics",
        "url": "https://sqlmodel.tiangolo.com",
        "email": "mail@mail.com  ",
    },
    version="0.0.0",
    openapi_tags=tags_metadata,
    lifespan=lifespan
)

@app.get("/")
def read_root():
    return {"message": "Bienvenido a la aplicación de FastAPI"}


app.include_router(users.router)
app.include_router(submissions.router)
app.include_router(problems.router)
app.include_router(roles.router)
