from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict

class ReportBase(BaseModel):
    content: str
    read: bool
    problemID: int
    userID: int

class ReportCreate(ReportBase):
    pass

class ReportUpdate(BaseModel):
    content: Optional[str] = None
    read: Optional[bool] = None

class ReportRead(ReportBase):
    id: int
    timePosted: Optional[datetime] = None
    
    model_config = ConfigDict(
        from_attributes=True
    )