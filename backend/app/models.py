import json
from typing import Any, Dict, List, Optional
from sqlmodel import JSON, TEXT, Column, SQLModel, Field, Relationship
from datetime import datetime, timezone

class UserRole(SQLModel, table=True):
    __tablename__ = "user_roles"
    
    userID: int = Field(foreign_key="users.id", primary_key=True, ondelete="CASCADE")
    roleName: str = Field(foreign_key="roles.name", primary_key=True, ondelete="CASCADE")

class User(SQLModel, table=True):
    __tablename__ = "users"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(sa_column_kwargs={"unique": True})
    password: str = Field(sa_column_kwargs={"comment": "La contraseña se guarda hasheada"})
    firstName: str
    lastName: str
    email: str
    score: Optional[int] = 0
    creationDate: Optional[datetime] = Field(
        default_factory=lambda: datetime.now(timezone.utc), 
        sa_column_kwargs={"nullable": True}
    )
    bio: Optional[str] = Field(default=None, sa_column_kwargs={"nullable": True})
    skills: Optional[str] = Field(default=None, sa_column_kwargs={"nullable": True})
    profilePicture: Optional[str] = Field(default=None, sa_column_kwargs={"nullable": True})
    github: Optional[str] = Field(default=None, sa_column_kwargs={"nullable": True})
    active: bool = Field(
        default=True, 
        description='Indica si el usuario puede acceder o no.', 
        sa_column_kwargs={"comment": 'Indica si el usuario puede acceder o no.'} 
    )
    isVerified: bool = Field(
        default=False, 
        description='Indica si el usuario ha verificado su cuenta.', 
        sa_column_kwargs={"comment": 'Indica si el usuario ha verificado su cuenta.'} 
    )
    
    roles: List["Role"] = Relationship(
        back_populates="users",
        link_model=UserRole, 
        sa_relationship_kwargs={"cascade": "all"}
        )
    comments: List["Comment"] = Relationship(
        back_populates="user", 
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
        )
    notifications: List["Notification"] = Relationship(
        back_populates="user", 
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
        )
    tokens: List["Token"] = Relationship(
        back_populates="user", 
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
        )
    submissions: List["Submission"] = Relationship(
        back_populates="user", 
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
        )

class Problem(SQLModel, table=True):
    __tablename__ = "problems"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    tags: str
    description: str
    hints: Optional[str] = Field(default=None, sa_column_kwargs={"nullable": True})
    difficulty: str
    score: int
    tags: str
    functionName: Optional[str] = Field(default=None, sa_column_kwargs={"nullable": True})
    authorID: int = Field(foreign_key="users.id")
    
    testCases: List["TestCase"] = Relationship(
        back_populates="problem",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )
    submissions: List["Submission"] = Relationship(
        back_populates="problem",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )
    comments: List["Comment"] = Relationship(
        back_populates="problem",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )

class Submission(SQLModel, table=True):
    __tablename__ = "submissions"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    code: str
    language: str
    status: str
    timeSubmitted: Optional[datetime] = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column_kwargs={"nullable": True}
    )
    suggestions: Optional[str] = Field(
            default=None,
            sa_column=Column(TEXT, nullable=True)
        )
    passed_tests: Optional[int] = Field(default=0, sa_column_kwargs={"nullable": True})
    total_tests: Optional[int] = Field(default=None, sa_column_kwargs={"nullable": True})
    compilation_error: Optional[str] = Field(default=None, sa_column_kwargs={"nullable": True})
    execution_time: Optional[float] = Field(default=None, sa_column_kwargs={"nullable": True})
    problemID: int = Field(foreign_key="problems.id", ondelete="CASCADE")
    userID: int = Field(foreign_key="users.id")
    
    user: User = Relationship(back_populates="submissions")
    problem: Problem = Relationship(back_populates="submissions")

class Role(SQLModel, table=True):
    __tablename__ = "roles"
    
    name: Optional[str] = Field(default=None, primary_key=True)
    description: str
    
    users: List[User] = Relationship(
        back_populates="roles", 
        link_model=UserRole,
        sa_relationship_kwargs={"cascade": "all"}
    )

class Token(SQLModel, table=True):
    __tablename__ = "tokens"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    userID: int = Field(foreign_key="users.id", ondelete="CASCADE")
    token: str = Field(sa_column_kwargs={"unique": True})
    expire_at: Optional[datetime] = Field(default=None, sa_column_kwargs={"nullable": True})
    # El tipo de token puede ser verify o recovery
    type: str = Field(sa_column_kwargs={"comment": "El tipo de token puede ser verify o recovery"})
    isValid: bool = Field(default=True, sa_column_kwargs={"comment": "Indica si el token es valido o no"})
    user: User = Relationship(back_populates="tokens")

class Comment(SQLModel, table=True):
    __tablename__ = "comments"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    content: str
    timePosted: Optional[datetime] = Field(default_factory=lambda: datetime.now(timezone.utc), sa_column_kwargs={"nullable": True})
    isApproved: bool = Field(default=True, sa_column_kwargs={"comment": "Indica si el comentario ha sido aprobado o no"})
    problemID: int = Field(foreign_key="problems.id")
    userID: int = Field(foreign_key="users.id")
    
    user: User = Relationship(back_populates="comments")
    problem: Problem = Relationship(back_populates="comments")

class Notification(SQLModel, table=True):
    __tablename__ = "notifications"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    description: str
    read: bool
    timePosted: Optional[datetime] = Field(default=None, sa_column_kwargs={"nullable": True})
    userID: int = Field(foreign_key="users.id", ondelete="CASCADE")
    
    user: User = Relationship(back_populates="notifications")

class Report(SQLModel, table=True):
    __tablename__ = "reports"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    content: str
    timePosted: Optional[datetime] = Field(default_factory=lambda: datetime.now(timezone.utc), sa_column_kwargs={"nullable": True})
    read: bool = Field(default=False)
    problemID: int = Field(foreign_key="problems.id", ondelete="CASCADE")
    userID: int = Field(foreign_key="users.id")

class TestCase(SQLModel, table=True):
    __tablename__ = "test_cases"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    problemID: int = Field(foreign_key="problems.id", ondelete="CASCADE")
    description: Optional[str] = Field(default=None, sa_column_kwargs={"nullable": True})
    inputs_json: Optional[str] = Field(
        default=None,
        sa_column=Column(JSON, nullable=True)
    )
    expected_output: str
    
    problem: Problem = Relationship(back_populates="testCases")
    
    @property
    def inputs(self) -> Optional[List[Dict[str, Any]]]:
        """Convierte el JSON almacenado a lista de Python."""
        if self.inputs_json:
            try:
                return json.loads(self.inputs_json)
            except:
                return None
        return None

    @inputs.setter
    def inputs(self, value: Optional[List[Dict[str, Any]]]):
        """Convierte la lista de Python a JSON para almacenar."""
        if value is not None:
            self.inputs_json = json.dumps(value)
        else:
            self.inputs_json = None