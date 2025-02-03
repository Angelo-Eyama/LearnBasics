from typing import List
from pydantic import BaseModel, ConfigDict
from app.core.utils import RoleType

# Esquema Base
class RoleBase(BaseModel):
    name: RoleType
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