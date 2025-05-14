from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, ConfigDict, HttpUrl
from sqlmodel import SQLModel
from app.schemas.role import RoleNameBase
from app.schemas.notification import NotificationBase

# User schemas
# Esquema base con los campos comunes
class UserBase(BaseModel):
    username: str
    firstName: str
    lastName: str
    email: EmailStr
    active: bool = True
    score: Optional[int] = 0

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
    roles: List[str]

# Esquema para lectura detallada de un usuario
class UserRead(UserBase):
    id: int
    creationDate: Optional[datetime]
    bio: Optional[str] = None
    github: Optional[HttpUrl] = None
    profilePicture: Optional[str] = None
    isVerified: bool = False
    skills: Optional[str] = None
    roles: List[RoleNameBase]
    notifications: List[str] = []
    
    model_config = ConfigDict(
        from_attributes=True
    )


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
class UserPublic(BaseModel):
    id: int
    username: str
    firstName: str
    lastName: str
    email: EmailStr
    isVerified: bool
    score: int
    bio: Optional[str] = None
    github: Optional[HttpUrl] = None
    skills: Optional[str] = None
    profilePicture: Optional[str] = None
    roles: List[RoleNameBase]
    notifications: List[NotificationBase] = []
    
    model_config = ConfigDict(
        from_attributes=True
    )


class UsersPublic(SQLModel):
    total: int
    users: List[UserPublic]
    model_config = ConfigDict(
        from_attributes=True
    )