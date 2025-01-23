from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session 
from typing import List
from ..database import get_session
from ..models import Role
from ..controllers import roles as roles_controller
from ..schemas import RoleCreate, RoleRead, RoleUpdate, UserWithRoles, RoleWithUsers
from sqlalchemy.exc import IntegrityError

router = APIRouter(tags=["Roles"])

@router.get("/roles/", response_model=List[RoleRead], summary="Obtener todos los roles", description="Obtiene todos los roles del sistema.")
def get_roles(session: Session = Depends(get_session)):
    roles = roles_controller.get_roles(session)
    return roles

@router.get("/roles/{role_id}", response_model=RoleRead, summary="Obtener un rol por su ID", description="Obtiene un rol del sistema utilizando su ID.")
def get_role_by_id(role_id: int, session: Session = Depends(get_session)):
    role = roles_controller.get_role_by_id(session, role_id)
    if not role:
        raise HTTPException(status_code=404, detail="Rol no encontrado")
    return role

@router.post("/roles/", response_model=RoleCreate, summary="Crear un rol", description="Crea un nuevo rol en el sistema.")
def create_role(role: RoleCreate, session: Session = Depends(get_session)):
    db_role = roles_controller.get_role_by_name(session, role.name)
    if db_role:
        raise HTTPException(status_code=400, detail="Nombre de rol ya existente")
    new_role = roles_controller.create_role(session, Role.from_orm(role))
    return new_role

@router.patch("/roles/{role_id}", response_model=RoleUpdate, summary="Actualizar un rol", description="Actualiza un rol del sistema utilizando su ID.")
def update_role(role_id: int, role_update: RoleUpdate, session: Session = Depends(get_session)):
    role = roles_controller.get_role_by_id(session, role_id)
    if not role:
        raise HTTPException(status_code=404, detail="Rol no encontrado")
    updated_role = roles_controller.update_role(session, role_id, role_update.dict(exclude_unset=True))
    return updated_role

@router.delete("/roles/{role_id}", response_model=RoleRead, summary="Eliminar un rol", description="Elimina un rol del sistema utilizando su ID.", response_description="El rol eliminado.")
def delete_role(role_id: int, session: Session = Depends(get_session)):
    role = roles_controller.get_role_by_id(session, role_id)
    if not role:
        raise HTTPException(status_code=404, detail="Rol no encontrado")
    deleted_role = roles_controller.delete_role(session, role_id)
    return deleted_role

@router.post("/roles/{role_id}/assign/{user_id}", response_model=UserWithRoles, summary="Asignar un rol a un usuario", description="Asigna un rol a un usuario.")
def assign_role(role_id: int, user_id: int, session: Session = Depends(get_session)):
    role = roles_controller.get_role_by_id(session, role_id)
    if not role:
        raise HTTPException(status_code=404, detail="Rol no encontrado")
    try:
        user = roles_controller.assign_role(session, user_id, role_id)
        if not user:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
    except IntegrityError as e:
        raise HTTPException(status_code=400, detail="El usuario ya tiene asignado el rol")
    
    return user

@router.post("/roles/{role_id}/revoke/{user_id}", response_model=UserWithRoles, summary="Revocar un rol a un usuario", description="Revoca un rol a un usuario.")
def revoke_role(role_id: int, user_id: int, session: Session = Depends(get_session)):
    role = roles_controller.get_role_by_id(session, role_id)
    if not role:
        raise HTTPException(status_code=404, detail="Rol no encontrado")
    
    try:
        user = roles_controller.revoke_role(session, user_id, role_id)
        if not user:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    return user

@router.get("/roles/user/{user_id}", response_model=List[RoleWithUsers], summary="Obtener todos los roles de un usuario", description="Obtiene todos los roles de un usuario.")
def get_user_roles(user_id: int, session: Session = Depends(get_session)):
    roles = roles_controller.get_user_roles(session, user_id)
    if not roles:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return roles

@router.get("/roles/{role_id}/users", response_model=List[UserWithRoles], summary="Obtener todos los usuarios de un rol", description="Obtiene todos los usuarios de un rol.")
def get_role_users(role_id: int, session: Session = Depends(get_session)):
    users = roles_controller.get_role_users(session, role_id)
    if not users:
        raise HTTPException(status_code=404, detail="Rol no encontrado")
    return users