from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session 
from typing import List
from ..database import get_session
from ..models import User
from ..controllers import users as users_controller
from ..schemas import UserCreate, UserRead, UserUpdate, UserWithRoles

router = APIRouter(tags=["Usuarios"])

@router.get("/users/", response_model=List[UserRead])
def get_users(session: Session = Depends(get_session)):
    users = users_controller.get_users(session)
    return users

@router.get("/users/id:{user_id}", response_model=UserWithRoles)
def get_user_by_id(user_id: int, session: Session = Depends(get_session)):
    user = users_controller.get_user_by_id(session, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return user

@router.get("/users/{username}", response_model=UserWithRoles)
def get_user_by_username(username: str, session: Session = Depends(get_session)):
    user = users_controller.get_user_by_username(session, username)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return user

@router.post("/users/", response_model=UserCreate)
def create_user(user: UserCreate, session: Session = Depends(get_session)):
    db_user = users_controller.get_user_by_username(session, user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Nombre de usuario ya existente")
    new_user = users_controller.create_user(session, User.from_orm(user))
    return new_user

@router.patch("/users/{user_id}", response_model=UserUpdate)
def update_user(user_id: int, user_update: UserUpdate, session: Session = Depends(get_session)):
    user = users_controller.get_user_by_id(session, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    updated_user = users_controller.update_user(session, user_id, user_update.dict(exclude_unset=True))
    return updated_user

@router.delete("/users/{user_id}", response_model=UserRead, summary="Eliminar un usuario", description="Elimina un usuario del sistema utilizando su ID.", response_description="El usuario eliminado.")
def delete_user(user_id: int, session: Session = Depends(get_session)):
    user = users_controller.get_user_by_id(session, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    deleted_user = users_controller.delete_user(session, user_id)
    return deleted_user
