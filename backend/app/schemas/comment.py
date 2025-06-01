from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict
from app.schemas.user import UserBase

class CommentBase(BaseModel):
    content: str
    isApproved: bool = False

class CommentCreate(CommentBase):
    problemID: int
    userID: int

class CommentUpdate(BaseModel):
    content: Optional[str] = None
    isApproved: Optional[bool] = None

class CommentRead(CommentBase):
    id: int
    userID: int
    problemID: int
    timePosted: Optional[datetime]
    user: UserBase
    model_config = ConfigDict(
        from_attributes=True
    )

class CommentList(CommentRead):
    total: int
    comments: list[CommentRead]
    model_config = ConfigDict(
        from_attributes=True
    )