from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict
from app.schemas.problem import ProblemRead

# Esquema Base
class SubmissionBase(BaseModel):
    code: str
    language: str
    status: str
    suggestions: Optional[str] = None

# Esquema de Creación
class SubmissionCreate(SubmissionBase):
    problemID: int
    userID: int
    pass

# Esquema de Actualización
class SubmissionUpdate(BaseModel):
    code: Optional[str] = None
    language: Optional[str] = None
    status: Optional[str] = None
    suggestions: Optional[str] = None

# Esquema de Lectura
class SubmissionRead(SubmissionBase):
    id: int
    timeSubmitted: datetime
    problemID: int
    userID: int 
    problem: Optional[ProblemRead] = None  # Relación opcional con el problema

    model_config = ConfigDict(
        from_attributes=True
    )

class SubmissionList(BaseModel):
    total: int
    submissions: List[SubmissionRead]
    model_config = ConfigDict(
        from_attributes=True
    )