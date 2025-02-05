from fastapi import HTTPException
from sqlmodel import Session, select
from sqlalchemy.exc import IntegrityError
from app.models import Role, User
from app.schemas.role import RoleCreate, RoleUpdate


def get_roles(session: Session) -> list[Role]:
    roles = session.exec(select(Role)).all()
    return roles


def get_role_by_name(session: Session, name: str) -> Role:
    role = session.exec(select(Role).where(Role.name == name)).first()
    return role


def create_role(session: Session, new_role: RoleCreate) -> Role:
    role_db = Role.model_validate(new_role)
    session.add(role_db)
    try:
        session.commit()
    except IntegrityError:
        session.rollback()
        return None
    session.refresh(role_db)
    return role_db


def update_role(session: Session, db_role: Role, role_in: RoleUpdate) -> Role:
    role_data = role_in.model_dump(exclude_unset=True)
    db_role.sqlmodel_update(role_data)
    session.add(db_role)
    try:
        session.commit()
    except IntegrityError:
        session.rollback()
        return None
    session.refresh(db_role)
    return db_role


def delete_role(session: Session, role_name: str) -> Role:
    role = session.get(Role, role_name)
    if not role:
        return None
    session.delete(role)
    try:
        session.commit()
    except IntegrityError:
        session.rollback()
        return None
    return role

# USER_ROLE CONTROLLER ACTIONS


def assign_role(session: Session, user_id: int, role_name: str) -> User:
    ''' 
    Asigna un rol a un usuario.'''
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    role = session.get(Role, role_name)
    user.roles.append(role)
    try:
        session.commit()
    except IntegrityError:
        session.rollback()
        raise HTTPException(
            status_code=400, detail=f"El usuario ya tiene asignado el rol de {role_name}")
    return user


def revoke_role(session: Session, user_id: int, role_name: str) -> User:
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")


    role = session.get(Role, role_name)
    user.roles.remove(role)
    try:
        session.commit()
    except IntegrityError:
        session.rollback()
        raise HTTPException(
            status_code=400, detail=f"El usuario no tiene asignado el rol de {role_name}")

    return user

# Funcion para obtener todos los roles de un usuario


def get_user_roles(session: Session, user_id: int):
    user = session.get(User, user_id)
    if not user:
        return None

    return user.roles

# Funcion para obtener todos los usuarios de un rol


def get_role_users(session: Session, role_name: str):
    role = session.get(Role, role_name)
    if not role:
        return None
    return role.users
