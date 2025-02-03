from typing import Optional
from pydantic import BaseModel, ConfigDict, EmailStr, Field
from datetime import datetime

# # # # # # #  #
# user Schemas #
# # # # # # #  #

class RoleBase(BaseModel):
    name: str
    description: str
    
    model_config = ConfigDict(
        from_attributes=True
    )

class UserBase(BaseModel):
    username: str
    email: EmailStr
    firstName: str
    lastName: str
    active: bool = True


# Propiedades a recibir via la API para crear un usuario
class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=30)
    creationDate: Optional[datetime] = datetime.now()


# Propiedades a recibir via API para editar un usuario (todos los campos son opcionales)
class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    password: Optional[str] = None


class UpdatePassword(BaseModel):
    current_password: str = Field(min_length=8, max_length=30)
    new_password: str = Field(min_length=8, max_length=30)

# Propiedades a devolver via API, el id es un campo obligatorio
class UserPublic(UserBase):
    id: int
    roles: list[RoleBase]

    # A partir de la version 2.0 de Pydantic, se puede usar ConfigDict para configurar el modelo
    # Class config está obsoleto y se ha renombrado la propiedad a model_config
    # orm_mode ha sido renombrado a from_orm
    # https://docs.pydantic.dev/2.10/migration/#changes-to-config
    model_config = ConfigDict(
        from_attributes=True
    )


class UsersPublic(UserBase):
    users: list[UserPublic]
    count: int

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
        from_attributes=True
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
        from_attributes=True
    )


class SubmissionUpdate(BaseModel):
    code: Optional[str] = None
    language: Optional[str] = None
    status: Optional[str] = None
    timeSubmitted: Optional[datetime] = None
    timeUpdated: Optional[datetime] = None


## Role Schemas ##

class RoleUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None


class RoleWithUsers(RoleBase):
    users: list[UserPublic] | None = None

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
        from_attributes=True
    )


class CommentUpdate(BaseModel):
    content: Optional[str] = None
    timePosted: Optional[datetime] = None

## Notification Schemas ##


class NotificationBase(BaseModel):
    content: str
    read: bool


class NotificationCreate(NotificationBase):
    userID: int


class NotificationRead(NotificationBase):
    id: int
    timePosted: Optional[datetime] = None

    model_config = ConfigDict(
        from_attributes=True
    )


class NotificationUpdate(BaseModel):
    content: Optional[str] = None
    read: Optional[bool] = None
    timePosted: Optional[datetime] = None

## Report Schemas ##


class ReportBase(BaseModel):
    content: str
    read: bool


class ReportCreate(ReportBase):
    problemID: int
    userID: int


class ReportRead(ReportBase):
    id: int
    timePosted: Optional[datetime] = None

    model_config = ConfigDict(
        from_attributes=True
    )


class ReportUpdate(BaseModel):
    content: Optional[str] = None
    read: Optional[bool] = None
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
        from_attributes=True
    )


class TestCaseUpdate(BaseModel):
    input: Optional[str] = None
    output: Optional[str] = None
