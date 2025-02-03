from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict

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
    timeSubmitted: Optional[datetime] = None
    timeUpdated: Optional[datetime] = None

    model_config = ConfigDict(
        from_attributes=True
    )