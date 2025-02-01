from enum import Enum

class RoleType(str, Enum):
    ADMIN = "administrador"
    EDITOR = "moderador"
    USER = "usuario"