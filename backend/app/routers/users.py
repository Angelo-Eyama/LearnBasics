from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from typing import List
from ..database import get_session
from ..models import User
from ..controllers import users as users_controller
from ..schemas import UserCreate, UserRead, UserUpdate, UserWithRoles

router = APIRouter(tags=["Usuarios"])


@router.get(
    "/users/",
    response_model=List[UserRead],
    summary="Obtener todos los usuarios",
    description="Obtiene una lista con todos los usuarios registrados en el sistema.",
    response_description="Lista de usuarios.",
    responses={
        200: {"description": "Lista de usuarios obtenida"},
        404: {"description": "No se encontraron usuarios"},
    }
)
def get_users(session: Session = Depends(get_session)):
    users = users_controller.get_users(session)
    return users


@router.get(
    "/users/id:{user_id}",
    response_model=UserWithRoles,
    summary="Obtener un usuario por su ID",
    description="Obtiene un usuario del sistema utilizando su ID como clave.",
    response_description="El usuario obtenido.",
    responses={
        200: {"description": "Usuario encontrado"},
        404: {"description": "Usuario no encontrado"},
    },
)
def get_user_by_id(user_id: int, session: Session = Depends(get_session)):
    user = users_controller.get_user_by_id(session, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return user


@router.get(
    "/users/{username}",
    response_model=UserWithRoles,
    summary="Obtener un usuario por su nombre de usuario",
    description="Obtiene un usuario del sistema utilizando su nombre de usuario como clave.",
    response_description="El usuario obtenido.",
    responses={
        200: {"description": "Usuario encontrado"},
        404: {"description": "Usuario no encontrado"},
    },
)
def get_user_by_username(username: str, session: Session = Depends(get_session)):
    user = users_controller.get_user_by_username(session, username)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return user


@router.post(
    "/users/",
    response_model=UserCreate,
    summary="Crear un usuario",
    description="Crea un nuevo usuario en el sistema.",
    response_description="El usuario creado.",
    responses={
        200: {"description": "Usuario creado"},
        400: {"description": "Nombre de usuario ya existente"},
    }
)
def create_user(user: UserCreate, session: Session = Depends(get_session)):    
    db_user = users_controller.get_user_by_username(session, user.username)
    if db_user:
        raise HTTPException(
            status_code=400, detail="Nombre de usuario ya existente")
    new_user = users_controller.create_user(session, User.from_orm(user))
    return new_user


@router.patch(
    "/users/{user_id}",
    response_model=UserUpdate,
    summary="Actualizar un usuario",
    description="Actualiza uno o varios campos de un usuario en el sistema utilizando su ID como clave.",
    response_description="El usuario actualizado.",
    responses={
        200: {"description": "Usuario actualizado"},
        404: {"description": "Usuario no encontrado"},
    }
)
def update_user(user_id: int, user_update: UserUpdate, session: Session = Depends(get_session)):
    user = users_controller.get_user_by_id(session, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    updated_user = users_controller.update_user(
        session, user_id, user_update.dict(exclude_unset=True))
    return updated_user


@router.delete(
    "/users/{user_id}",
    response_model=UserRead,
    summary="Eliminar un usuario",
    description="Elimina un usuario del sistema utilizando su ID como clave.",
    response_description="El usuario eliminado.",
    responses={
        200: {"description": "Usuario eliminado"},
        404: {"description": "Usuario no encontrado"},
    }
)
def delete_user(user_id: int, session: Session = Depends(get_session)):
    user = users_controller.get_user_by_id(session, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    deleted_user = users_controller.delete_user(session, user_id)
    return deleted_user


@router.post(
    "/users/login",
    response_model=UserWithRoles,
    summary="Iniciar sesión",
    description="Inicia sesión en el sistema.",
    response_description="Usuario logueado.",
    responses={
        200: {"description": "Usuario logueado"},
        401: {"description": "Usuario o contraseña incorrectos"},
    }
)
def login(username: str, password: str, session: Session = Depends(get_session)):
    user = users_controller.get_user_by_username(session, username)
    if not user:
        raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos")
    if not users_controller.verify_password(password, user.password):
        raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos")
    return user