from typing import Optional
from pydantic import BaseModel, ConfigDict

class TestCaseBase(BaseModel):
    problemID: int
    input: str
    output: str

class TestCaseCreate(TestCaseBase):
    pass

class TestCaseUpdate(BaseModel):
    input: Optional[str] = None
    output: Optional[str] = None

class TestCaseRead(TestCaseBase):
    id: int

    model_config = ConfigDict(
        from_attributes=True
    )