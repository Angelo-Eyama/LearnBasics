from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, ConfigDict
from sqlmodel import SQLModel
from app.schemas.role import RoleNameBase

# User schemas
class UserBase(BaseModel):
    username: str
    firstName: str
    lastName: str
    email: EmailStr
    active: bool
    score: Optional[int] = 0

class UserCreate(UserBase):
    password: str  # La contraseña se recibe en texto plano antes de ser hasheada

class UserRead(UserBase):
    id: int
    creationDate: Optional[datetime]
    roles: List[RoleNameBase]
    
    model_config = ConfigDict(
        from_attributes=True
    )

class UserResponse(BaseModel):
    users: List[UserRead]

class UserUpdate(BaseModel):
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    email: Optional[EmailStr] = None
    active: Optional[bool] = None
    score: Optional[int] = None

class UserRegister(SQLModel):
    firstName: str
    lastName: str
    email: EmailStr
    username: str
    password: str

# Propiedades a devolver en la respuesta de la autenticación
class UserPublic(UserBase):
    id: int
    roles: List[RoleNameBase]
    
    model_config = ConfigDict(
        from_attributes=True
    )


class UsersPublic(SQLModel):
    data: list[UserPublic]