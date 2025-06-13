from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, ConfigDict, HttpUrl
from sqlmodel import SQLModel
from app.schemas.role import RoleNameBase

# User schemas
# Esquema base con los campos comunes
class UserBase(BaseModel):
    username: str
    firstName: str
    lastName: str
    email: EmailStr
    active: bool = True
    score: Optional[int] = 0
    isVerified: bool

# Esquema para el registro de usuarios
class UserRegister(SQLModel):
    firstName: str
    lastName: str
    email: EmailStr
    username: str
    password: str

# Esquema para crear un usuario (solo para admins)
class UserCreate(UserBase):
    password: str 
    roles: List[RoleNameBase] = []


# Esquema para la actualización de un usuario (todos los campos opcionales)
class UserUpdate(BaseModel):
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    email: Optional[EmailStr] = None
    bio: Optional[str] = None
    github: Optional[str] = None
    profilePicture: Optional[str] = None
    skills: Optional[str] = None
    model_config = ConfigDict(
        from_attributes=True
    )

# Propiedades a devolver en la respuesta de la autenticación
class UserPublic(UserBase):
    bio: Optional[str] = None
    github: Optional[str] = None
    skills: Optional[str] = None
    profilePicture: Optional[str] = None
    roles: List[RoleNameBase]
    
    model_config = ConfigDict(
        from_attributes=True
    )

# Esquema para lectura detallada de un usuario
class UserRead(UserPublic):
    id: int
    creationDate: Optional[datetime]
    
    model_config = ConfigDict(
        from_attributes=True
    )

class UsersRead(SQLModel):
    total: int
    users: List[UserRead]
    model_config = ConfigDict(
        from_attributes=True
    )