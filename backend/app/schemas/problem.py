from typing import Optional
from pydantic import BaseModel, ConfigDict

# Esquema Base
class ProblemBase(BaseModel):
    title: str
    tags: str
    description: str
    difficulty: str
    hints: str
    score: int

# Esquema de Creación
class ProblemCreate(ProblemBase):
    authorID: int

# Esquema de Actualización
class ProblemUpdate(BaseModel):
    title: Optional[str] = None
    tags: Optional[str] = None
    description: Optional[str] = None
    difficulty: Optional[str] = None
    hints: Optional[str] = None
    score: Optional[int] = None

# Esquema de Lectura
class ProblemRead(ProblemBase):
    id: int
    authorID: int

    model_config = ConfigDict(
        from_attributes=True
    )