from datetime import datetime
from pydantic import BaseModel

class TokenBase(BaseModel):
    userID: int
    token: str
    expire_at: datetime | None = None
    type: str
    isValid: bool = True

class TokenUpdate(BaseModel):
    userID: int | None = None
    token: str | None = None
    expire_at: datetime | None = None
    type: str | None = None
    isValid: bool | None = None
