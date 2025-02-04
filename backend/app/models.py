from typing import List, Optional
from sqlmodel import SQLModel, Field, Relationship, Column, LargeBinary
from datetime import datetime
from app.core.utils import RoleType

class UserRole(SQLModel, table=True):
    __tablename__ = "user_roles"
    
    userID: int = Field(foreign_key="users.id", primary_key=True, ondelete="CASCADE")
    roleName: RoleType = Field(foreign_key="roles.name", primary_key=True, ondelete="CASCADE")

class User(SQLModel, table=True):
    __tablename__ = "users"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(sa_column_kwargs={"unique": True})
    password: bytes = Field(sa_column=Column(LargeBinary))
    firstName: str
    lastName: str
    email: str
    score: Optional[int] = 0
    creationDate: Optional[datetime] = Field(default_factory=datetime.utcnow, sa_column_kwargs={"nullable": True})
    active: bool = Field(default=True, description='Indica si el usuario puede acceder o no.', sa_column_kwargs={"comment": 'Indica si el usuario puede acceder o no.'} )
    
    roles: List["Role"] = Relationship(back_populates="users",link_model=UserRole)
    comments: List["Comment"] = Relationship(back_populates="user")
    notifications: List["Notification"] = Relationship(back_populates="user")
    
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
    
    testCases: List["TestCase"] = Relationship(back_populates="problem", cascade_delete=True)
    
class Submission(SQLModel, table=True):
    __tablename__ = "submissions"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    code: str
    language: str
    status: str
    timeSubmitted: Optional[datetime] = Field(default_factory=datetime.utcnow , sa_column_kwargs={"nullable": True})
    timeUpdated: Optional[datetime] = Field(default_factory=datetime.utcnow, sa_column_kwargs={"nullable": True})
    suggestions: Optional[str] = Field(default=None, sa_column_kwargs={"nullable": True})
    problemID: int = Field(foreign_key="problems.id", ondelete="CASCADE")
    userID: int = Field(foreign_key="users.id")
    
class Role(SQLModel, table=True):
    __tablename__ = "roles"
    name: Optional[RoleType] = Field(default=None, primary_key=True)
    description: str
    
    users: List[User] = Relationship(back_populates="roles", link_model=UserRole)

class Comment(SQLModel, table=True):
    __tablename__ = "comments"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    content: str
    timePosted: Optional[datetime] = Field(default_factory=datetime.utcnow, sa_column_kwargs={"nullable": True})
    problemID: int = Field(foreign_key="problems.id")
    userID: int = Field(foreign_key="users.id")
    
    user: User = Relationship(back_populates="comments")
    
class Notification(SQLModel, table=True):
    __tablename__ = "notifications"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    content: str
    read: bool
    timePosted: Optional[datetime] = Field(default=None, sa_column_kwargs={"nullable": True})
    userID: int = Field(foreign_key="users.id", ondelete="CASCADE")
    
    user: User = Relationship(back_populates="notifications")
    
class Report(SQLModel, table=True):
    __tablename__ = "reports"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    content: str
    timePosted: Optional[datetime] = Field(default_factory=datetime.utcnow, sa_column_kwargs={"nullable": True})
    read: bool = Field(default=False)
    problemID: int = Field(foreign_key="problems.id", ondelete="CASCADE")
    userID: int = Field(foreign_key="users.id")
    
class TestCase(SQLModel, table=True):
    __tablename__ = "test_cases"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    problemID: int = Field(foreign_key="problems.id", ondelete="CASCADE")
    input: str
    output: str
    
    problem: Optional[Problem] = Relationship(back_populates="testCases")