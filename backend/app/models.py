from typing import List, Optional
from sqlmodel import SQLModel, Field, Relationship, Session
from datetime import datetime

class User(SQLModel, table=True):
    __tablename__ = "users"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(sa_column_kwargs={"unique": True})
    password: str
    firstName: str
    lastName: str
    email: str
    score: Optional[int] = 0
    creationDate: Optional[datetime] = Field(default=None, sa_column_kwargs={"nullable": True})
    
class Problem(SQLModel, table=True):
    __tablename__ = "problems"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    block: str
    description: str
    difficulty: str
    score: int
    expectedOutput: str
    authorID: int = Field(foreign_key="users.id")
    
class Submission(SQLModel, table=True):
    __tablename__ = "subbmissions"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    code: str
    language: str
    status: str
    timeSubmitted: Optional[datetime] = Field(default=None, sa_column_kwargs={"nullable": True})
    timeUpdated: Optional[datetime] = Field(default=None, sa_column_kwargs={"nullable": True})
    suggestions: Optional[str] = None
    problemID: int = Field(foreign_key="problems.id")
    userID: int = Field(foreign_key="users.id")
    
class Role(SQLModel, table=True):
    __tablename__ = "roles"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    role: str
    description: str
    
class UserRole(SQLModel, table=True):
    __tablename__ = "user_roles"
    
    userID: int = Field(foreign_key="users.id", primary_key=True)
    roleID: int = Field(foreign_key="roles.id", primary_key=True)

class Comment(SQLModel, table=True):
    __tablename__ = "comments"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    content: str
    timePosted: Optional[datetime] = Field(default=None, sa_column_kwargs={"nullable": True})
    problemID: int = Field(foreign_key="problems.id")
    userID: int = Field(foreign_key="users.id")
    
class Notification(SQLModel, table=True):
    __tablename__ = "notifications"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    content: str
    readed: bool
    timePosted: Optional[datetime] = Field(default=None, sa_column_kwargs={"nullable": True})
    userID: int = Field(foreign_key="users.id")
    
class Report(SQLModel, table=True):
    __tablename__ = "reports"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    content: str
    timePosted: Optional[datetime] = Field(default=None, sa_column_kwargs={"nullable": True})
    problemID: int = Field(foreign_key="problems.id")
    userID: int = Field(foreign_key="users.id")
    
class testCases(SQLModel, table=True):
    __tablename__ = "test_cases"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    problemID: int = Field(foreign_key="problems.id")
    input: str
    output: str