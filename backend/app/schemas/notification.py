from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict

class NotificationBase(BaseModel):
    title: str
    description: str
    read: bool

class NotificationCreate(NotificationBase):
    userID: int

class NotificationUpdate(NotificationBase):
    title: Optional[str] = None
    description: Optional[str] = None
    read: Optional[bool] = False

class NotificationRead(NotificationBase):
    id: int
    timePosted: Optional[datetime]
    
    model_config = ConfigDict(
        from_attributes=True
    )

class NotificationsList(BaseModel):
    total: int
    notifications: list[NotificationRead]