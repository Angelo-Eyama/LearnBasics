from fastapi import APIRouter, HTTPException, Depends
from typing import List

from app.api.deps import SessionDep, verify_admin, get_current_user
from app.api.controllers import roles as roles_controller

from app.models import Role
from app.schemas.role import RoleBase, RoleUpdate
from app.schemas.user import UserPublic
from app.schemas.utils import ErrorResponse


router = APIRouter(
                    tags=["Roles"],
                    dependencies=[Depends(get_current_user), Depends(verify_admin)]
    )


@router.get(
    "/roles/",
    response_model=List[RoleBase],
    summary="Obtener todos los roles",
    description="Obtiene todos los roles del sistema.",
    response_description="Lista de roles.",
    responses={
        200: {"description": "Lista de roles obtenida"},
        404: {"model": ErrorResponse, "description": "No se encontraron roles"},
    }
)
def get_roles(session: SessionDep):
    roles = roles_controller.get_roles(session)
    return roles


@router.get(
    "/roles/{role_name}",
    response_model=RoleBase,
    summary="Obtener un rol por su ID",
    description="Obtiene un rol del sistema utilizando su ID.",
    response_description="El rol obtenido.",
    responses={
        200: {"description": "Rol encontrado"},
        404: {"model": ErrorResponse, "description": "Rol no encontrado"},
    }
)
def get_role_by_name(role_name: str, session: SessionDep):
    role = roles_controller.get_role_by_name(session, role_name)
    if not role:
        raise HTTPException(status_code=404, detail="Rol no encontrado")
    return role


@router.post(
    "/roles/",
    response_model=RoleBase,
    summary="Crear un rol",
    description="Crea un nuevo rol en el sistema.",
    response_description="Rol creado.",
    responses={
        200: {"description": "Rol creado"},
        400: {"model": ErrorResponse, "description": "Error en los datos enviados"},
    }
)
def create_role(role: RoleBase, session: SessionDep):
    db_role = roles_controller.get_role_by_name(session, role.name)
    if db_role:
        raise HTTPException(
            status_code=400, detail="Nombre de rol ya existente")
    new_role = roles_controller.create_role(session, Role.from_orm(role))
    if not new_role:
        raise HTTPException(status_code=400, detail="Error en la creacion del rol")
    return new_role


@router.patch(
    "/roles/{role_name}",
    response_model=RoleUpdate,
    summary="Actualizar un rol",
    description="Actualiza un rol del sistema utilizando su ID.",
    response_description="Rol actualizado.",
    responses={
        200: {"description": "Rol actualizado"},
        404: {"model": ErrorResponse, "description": "Rol no encontrado"},
    }
)
def update_role(role_name: str, role_update: RoleUpdate, session: SessionDep):
    role = roles_controller.get_role_by_name(session, role_name)
    if not role:
        raise HTTPException(status_code=404, detail="Rol no encontrado")
    updated_role = roles_controller.update_role(
        session=session, db_role=role, role_in=role_update)
    if not updated_role:
        raise HTTPException(
            status_code=400, detail="Error en la actualizacion del rol")
    return updated_role


@router.delete(
    "/roles/{role_name}",
    response_model=RoleBase,
    summary="Eliminar un rol",
    description="Elimina un rol del sistema utilizando su ID.",
    response_description="El rol eliminado.",
    responses={
        200: {"description": "Rol eliminado"},
        404: {"model": ErrorResponse, "description": "Rol no encontrado"},
    }
)
def delete_role(role_name: str, session: SessionDep):
    role = roles_controller.get_role_by_name(session, role_name)
    if not role:
        raise HTTPException(status_code=404, detail="Rol no encontrado")
    deleted_role = roles_controller.delete_role(session, role_name)
    if not deleted_role:
        raise HTTPException(
            status_code=400, detail="Error en la eliminacion del rol")
    return deleted_role


@router.post(
    "/roles/{role_name}/assign/{user_id}",
    response_model=UserPublic,
    summary="Asignar un rol a un usuario",
    description="Asigna un rol a un usuario.",
    response_description="Usuario con el nuevo rol asignado.",
    responses={
        200: {"description": "Rol asignado"},
        404: {"model": ErrorResponse, "description": "Usuario no encontrado"},
        400: {"model": ErrorResponse, "description": "El usuario ya tiene asignado el rol"},
    }
)
def assign_role(role_name: str, user_id: int, session: SessionDep):
    role = roles_controller.get_role_by_name(session, role_name)
    if not role:
        raise HTTPException(status_code=404, detail="Rol no encontrado")
    user = roles_controller.assign_role(session, user_id, role_name)
    return user


@router.post(
    "/roles/{role_name}/revoke/{user_id}",
    response_model=UserPublic,
    summary="Revocar un rol a un usuario",
    description="Revoca un rol a un usuario.",
    response_description="Usuario con el rol revocado.",
    responses={
        200: {"description": "Rol revocado"},
        404: {"model": ErrorResponse, "description": "Usuario no encontrado"},
        400: {"model": ErrorResponse, "description": "El usuario no tiene asignado el rol"},
    }
)
def revoke_role(role_name: str, user_id: int, session: SessionDep):
    role = roles_controller.get_role_by_name(session, role_name)
    if not role:
        raise HTTPException(status_code=404, detail="Rol no encontrado")
    user = roles_controller.revoke_role(session, user_id, role_name)
    return user



@router.get(
    "/roles/user/{user_id}",
    response_model=List[UserPublic],
    summary="Obtener todos los roles de un usuario",
    description="Obtiene todos los roles de un usuario.",
    response_description="Lista de roles del usuario identificado.",
    responses={
        200: {"description": "Lista de roles obtenida"},
        404: {"model": ErrorResponse, "description": "Usuario no encontrado"},
    }
)
def get_user_roles(user_id: int, session: SessionDep):
    roles = roles_controller.get_user_roles(session, user_id)
    if not roles:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return roles


@router.get(
    "/roles/{role_name}/users",
    response_model=List[UserPublic],
    summary="Obtener todos los usuarios de un rol",
    description="Obtiene todos los usuarios de un rol.",
    response_description="Listado de usuarios del rol identificado.",
    responses={
        200: {"description": "Lista de usuarios obtenida"},
        404: {"model": ErrorResponse, "description": "Rol no encontrado"},
    }
)
def get_role_users(role_name: str, session: SessionDep):
    users = roles_controller.get_role_users(session, role_name)
    if not users:
        raise HTTPException(status_code=404, detail="Rol no encontrado")
    return users
