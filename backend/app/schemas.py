from typing import Optional
from pydantic import BaseModel
from datetime import datetime

# # # # # # #  #
# user Schemas #
# # # # # # #  #
class UserBase(BaseModel):
    username: str
    email: str
    firstName: str
    lastName: str

class UserCreate(UserBase):
    password: str

class UserRead(UserBase):
    id: int
    score: Optional[int] = None
    creationDate: Optional[datetime] = None

    class Config:
        orm_mode: True

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    password: Optional[str] = None
    score: Optional[int] = None
    creationDate: Optional[datetime] = None

# # # # # # # # # #
# Problem Schemas #
# # # # # # # # # #

class ProblemBase(BaseModel):
    title: str
    description: str
    difficulty: str
    score: int
    expectedOutput: str

class ProblemCreate(ProblemBase):
    authorID: int

class ProblemRead(ProblemBase):
    id: int

    class Config:
        orm_mode: True

class ProblemUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    difficulty: Optional[str] = None
    score: Optional[int] = None
    expectedOutput: Optional[str] = None


# # # # # # # # # # # #
# Submission Schemas  #
# # # # # # # # # # # #
class SubmissionBase(BaseModel):
    code: str
    language: str
    status: str

class SubmissionCreate(SubmissionBase):
    pass

class SubmissionRead(SubmissionBase):
    id: int
    timeSubmitted: Optional[datetime] = None
    timeUpdated: Optional[datetime] = None

    class Config:
        orm_mode: True

class SubmissionUpdate(BaseModel):
    code: Optional[str] = None
    language: Optional[str] = None
    status: Optional[str] = None
    timeSubmitted: Optional[datetime] = None
    timeUpdated: Optional[datetime] = None