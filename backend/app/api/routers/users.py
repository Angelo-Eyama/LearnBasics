from fastapi import APIRouter, Depends, HTTPException, status
from app.api.deps import SessionDep, CurrentUser, verify_admin

from app.models import User
from app.api.controllers import users as users_controller
from app.schemas.user import UserCreate, UserUpdate, UserPublic, UserRegister, UsersPublic
from app.schemas.utils import ErrorResponse
from app.core.utils import RoleType

router = APIRouter(
    tags=["Usuarios"],
    prefix="/users"
)


@router.get(
    "/",
    response_model=UsersPublic,
    summary="Obtener todos los usuarios",
    description="Obtiene una lista con todos los usuarios registrados en el sistema.",
    response_description="Lista de usuarios.",
    responses={
        200: {"description": "Lista de usuarios obtenida", "model": UsersPublic},
        404: {"description": "No se encontraron usuarios", "model": ErrorResponse},
        401: {"description": "No autorizado", "model": ErrorResponse},
        403: {"description": "No tiene permisos para realizar esta acción","model": ErrorResponse},
    },
    dependencies=[Depends(verify_admin)]
)
def get_users(session: SessionDep):
    users = users_controller.get_users(session)
    if not users:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No se encontraron usuarios")
    return users


@router.get(
    "/me",
    response_model=UserPublic,
    summary="Obtener el usuario actual",
    description="Obtiene el usuario que ha iniciado sesión en el sistema.",
    response_description="El usuario actual.",
    responses={
        200: {"description": "Usuario actual obtenido"},
        403: {"model": ErrorResponse, "description": "No autorizado"},
    }
)
def get_current_user(current_user: CurrentUser):
    return current_user


@router.get(
    "/id:{user_id}",
    response_model=UserPublic,
    summary="Obtener un usuario por su ID",
    description="Obtiene un usuario del sistema utilizando su ID como clave.",
    response_description="El usuario obtenido.",
    responses={
        200: {"description": "Usuario encontrado"},
        404: {"model": ErrorResponse, "description": "Usuario no encontrado"},
    },
    dependencies=[Depends(verify_admin)]
)
def get_user_by_id(user_id: int, session: SessionDep):
    user = users_controller.get_user_by_id(session, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return user


@router.get(
    "/{username}",
    response_model=UserPublic,
    summary="Obtener un usuario por su nombre de usuario",
    description="Obtiene un usuario del sistema utilizando su nombre de usuario como clave.",
    response_description="El usuario obtenido.",
    responses={
        200: {"description": "Usuario encontrado"},
        404: {"model": ErrorResponse, "description": "Usuario no encontrado"},
    },
    dependencies=[Depends(verify_admin)]
)
def get_user_by_username(username: str, session: SessionDep):
    user = users_controller.get_user_by_username(session, username)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return user

@router.post(
    "/",
    response_model=UserCreate,
    summary="Crear un usuario",
    description="Crea un nuevo usuario en el sistema.",
    response_description="El usuario creado.",
    responses={
        200: {"description": "Usuario creado"},
        400: {"model": ErrorResponse, "description": "Nombre de usuario ya existente"},
    },
    dependencies=[Depends(verify_admin)]
)
def create_user(user: UserCreate, session: SessionDep):
    db_user = users_controller.get_user_by_username(session, user.username)
    if db_user:
        raise HTTPException(
            status_code=400, detail="Nombre de usuario ya existente")
    new_user = users_controller.create_user(session, User.from_orm(user))
    return new_user

@router.patch(
    "/me",
    response_model=UserUpdate,
    summary="Actualizar el usuario actual",
    description="Actualiza uno o varios campos del usuario que ha iniciado sesión en el sistema.",
    response_description="El usuario actualizado.",
    responses={
        200: {"description": "Usuario actualizado"},
        403: {"model": ErrorResponse, "description": "No autorizado"},
    }
    )
def update_current_user(user_update: UserUpdate, session: SessionDep, current_user: CurrentUser):
    updated_user = users_controller.update_user(
        session=session, db_user=current_user, user_in=user_update)
    return updated_user

@router.patch(
    "/{user_id}",
    response_model=UserUpdate,
    summary="Actualizar un usuario",
    description="Actualiza uno o varios campos de un usuario en el sistema utilizando su ID como clave.",
    response_description="El usuario actualizado.",
    responses={
        200: {"description": "Usuario actualizado"},
        404: {"model": ErrorResponse, "description": "Usuario no encontrado"},
    },
    dependencies=[Depends(verify_admin)]
)
def update_user(user_id: int, user_update: UserUpdate, session: SessionDep):
    user = users_controller.get_user_by_id(session, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    updated_user = users_controller.update_user(
        session=session, db_user=user, user_in=user_update)
    return updated_user

@router.delete(
    "/{user_id}",
    response_model=UserPublic,
    summary="Eliminar un usuario",
    description="Elimina un usuario del sistema utilizando su ID como clave.",
    response_description="El usuario eliminado.",
    responses={
        200: {"description": "Usuario eliminado"},
        404: {"model": ErrorResponse, "description": "Usuario no encontrado"},
    },
    dependencies=[Depends(verify_admin)]
)
def delete_user(user_id: int, session: SessionDep):
    user = users_controller.get_user_by_id(session, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    deleted_user = users_controller.delete_user(session, user_id)
    return deleted_user

# Eliminar mi propio usuario
@router.delete(
    "/me",
    response_model=UserPublic,
    summary="Eliminar el usuario actual",
    description="Elimina el usuario que ha iniciado sesión en el sistema.",
    response_description="El usuario eliminado.",
    responses={
        200: {"description": "Usuario eliminado"},
        403: {"model": ErrorResponse, "description": "No autorizado"},
    }
)
def delete_current_user(session: SessionDep, current_user: CurrentUser):
    if RoleType.ADMIN in [role.name for role in current_user.roles]:
        raise HTTPException(
            status_code=400, detail="un administrador no puede eliminarse a si mismo"
        )
    
    deleted_user = users_controller.delete_user(session, current_user.id)
    return deleted_user