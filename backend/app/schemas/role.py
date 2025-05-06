from typing import Optional
from pydantic import BaseModel, ConfigDict

# Esquema Base
class RoleNameBase(BaseModel):
    name: str
    model_config = ConfigDict(
        from_attributes=True
    )

class RoleBase(BaseModel):
    name: str
    description: str

# Esquema de Creación
class RoleCreate(RoleBase):
    pass

# Esquema de Actualización
class RoleUpdate(BaseModel):
    description: Optional[str] = None

# Esquema de Lectura
class RoleRead(RoleBase):
    model_config = ConfigDict(
        from_attributes=True
    )