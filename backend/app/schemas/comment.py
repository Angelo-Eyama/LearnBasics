from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict
from app.schemas.user import UserBase

class CommentBase(BaseModel):
    content: str

class CommentCreate(CommentBase):
    problemID: int
    userID: int

class CommentUpdate(BaseModel):
    content: Optional[str] = None

class CommentRead(CommentBase):
    id: int
    timePosted: Optional[datetime]
    user: UserBase
    model_config = ConfigDict(
        from_attributes=True
    )
