from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr
from app.core.utils import RoleType

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
    roles: List[RoleType]
    
    model_config = ConfigDict(
        from_attributes=True
    )

class UserUpdate(BaseModel):
    firstName: Optional[str]
    lastName: Optional[str]
    email: Optional[EmailStr]
    active: Optional[bool]
    score: Optional[int]

class UserRegister(SQLModel):
    firstName: str
    lastName: str
    email: EmailStr
    username: str
    password: str

# Propiedades a devolver en la respuesta de la autenticación
class UserPublic(UserBase):
    id: int
    
    model_config = ConfigDict(
        from_attributes=True
    )


class UsersPublic(SQLModel):
    data: list[UserPublic]