from typing import Optional
from pydantic import BaseModel, ConfigDict
from datetime import datetime

# # # # # # #  #
# user Schemas #
# # # # # # #  #
class UserBase(BaseModel):
    username: str
    email: str
    firstName: str
    lastName: str
    creationDate: Optional[datetime] = None
    

class UserCreate(UserBase):
    password: str

class UserRead(UserBase):
    id: int
    score: Optional[int] = None

    # A partir de la version 2.0 de Pydantic, se puede usar ConfigDict para configurar el modelo
    # Class config está obsoleto y se ha renombrado la propiedad a model_config
    # orm_mode ha sido renombrado a from_orm
    # https://docs.pydantic.dev/2.10/migration/#changes-to-config
    model_config = ConfigDict(
        from_attributes = True
    )

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
    block: str
    description: str
    difficulty: str
    score: int
    expectedOutput: str

class ProblemCreate(ProblemBase):
    authorID: int

class ProblemRead(ProblemBase):
    id: int

    model_config = ConfigDict(
        from_attributes = True
    )

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

    model_config = ConfigDict(
        from_attributes = True
    )

class SubmissionUpdate(BaseModel):
    code: Optional[str] = None
    language: Optional[str] = None
    status: Optional[str] = None
    timeSubmitted: Optional[datetime] = None
    timeUpdated: Optional[datetime] = None
    
    
## Role Schemas ##
class RoleBase(BaseModel):
    role: str
    
class RoleCreate(RoleBase):
    id: int

class RoleRead(RoleBase):
    description: str

    model_config = ConfigDict(
        from_attributes = True
    )
        
class RoleUpdate(BaseModel):
    role: Optional[str] = None
    description: Optional[str] = None
    
class UserWithRoles(UserRead):
    roles: list[RoleBase] | None = None
    
class RoleWithUsers(RoleRead):
    users: list[UserRead] | None = None
    
## Comment Schemas ##
class CommentBase(BaseModel):
    content: str
    
class CommentCreate(CommentBase):
    problemID: int
    userID: int
    
class CommentRead(CommentBase):
    id: int
    timePosted: Optional[datetime] = None

    model_config = ConfigDict(
        from_attributes = True
    )
        
class CommentUpdate(BaseModel):
    content: Optional[str] = None
    timePosted: Optional[datetime] = None
    
## Notification Schemas ##
class NotificationBase(BaseModel):
    content: str
    readed: bool
    
class NotificationCreate(NotificationBase):
    userID: int
    

class NotificationRead(NotificationBase):
    id: int
    timePosted: Optional[datetime] = None

    model_config = ConfigDict(
        from_attributes = True
    )
        
class NotificationUpdate(BaseModel):
    content: Optional[str] = None
    readed: Optional[bool] = None
    timePosted: Optional[datetime] = None
    
## Report Schemas ##

class ReportBase(BaseModel):
    content: str
    readed: bool
    
class ReportCreate(ReportBase):
    problemID: int
    userID: int
    
class ReportRead(ReportBase):
    id: int
    timePosted: Optional[datetime] = None

    model_config = ConfigDict(
        from_attributes = True
    )
        
class ReportUpdate(BaseModel):
    content: Optional[str] = None
    readed: Optional[bool] = None
    timePosted: Optional[datetime] = None

## Test case Schemas ##
class TestCaseBase(BaseModel):
    input: str
    output: str
    
class TestCaseCreate(TestCaseBase):
    problemID: int
    
class TestCaseRead(TestCaseBase):
    id: int

    model_config = ConfigDict(
        from_attributes = True
    )
        
class TestCaseUpdate(BaseModel):
    input: Optional[str] = None
    output: Optional[str] = None
    
