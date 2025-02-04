from enum import Enum

class RoleType():
    ADMIN = "administrador"
    EDITOR = "moderador"
    USER = "estudiante"

tags_metadata = [
    {
        "name": "Login",
        "description": "Operaciones relacionadas con la autenticación y autorización de los usuarios.",
    }
    ,
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
    },
    {
        "name": "Comentarios",
        "description": "Operaciones relacionadas con la gestion de los comentarios (CRUD). También están las acciones de ver comentarios por usuario, etc.",
    },
    {
        "name": "Notificaciones",
        "description": "Conjunto de operaciones relacionadas con las notificaciones.",
    },
    {
        "name": "Reportes",
        "description": "Conjunto de operaciones relacionadas con los reportes. Los reportes son mensajes que los usuarios envian al administrador para reportar problemas, errores, etc.",
    },
    {
        "name": "Casos de prueba",
        "description": "Conjunto de operaciones relacionadas con los casos de prueba. Cada ejercicio tiene uno o varios casos de prueba que se utilizan para verificar la solucion del usuario.",
    }
]
