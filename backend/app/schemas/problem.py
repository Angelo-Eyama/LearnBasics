from typing import List, Optional
from pydantic import BaseModel, ConfigDict

# Esquema Base
class ProblemBase(BaseModel):
    title: str
    block: str
    description: str
    difficulty: str
    score: int
    expectedOutput: str

# Esquema de Creación
class ProblemCreate(ProblemBase):
    authorID: int

# Esquema de Actualización
class ProblemUpdate(BaseModel):
    title: Optional[str] = None
    block: Optional[str] = None
    description: Optional[str] = None
    difficulty: Optional[str] = None
    score: Optional[int] = None
    expectedOutput: Optional[str] = None

# Esquema de Lectura
class ProblemRead(ProblemBase):
    id: int

    model_config = ConfigDict(
        from_attributes=True
    )