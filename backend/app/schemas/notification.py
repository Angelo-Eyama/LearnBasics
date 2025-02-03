from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict

class NotificationBase(BaseModel):
    content: str
    read: bool

class NotificationCreate(NotificationBase):
    userID: int

class NotificationRead(NotificationBase):
    id: int
    timePosted: Optional[datetime]
    
    model_config = ConfigDict(
        from_attributes=True
    )