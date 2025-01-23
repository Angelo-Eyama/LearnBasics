from sqlmodel import Session, select
from ..models import Role, User
from sqlalchemy.exc import IntegrityError


def get_roles(session: Session) -> list[Role]:
    roles = session.exec(select(Role)).all()
    return roles

def get_role_by_id(session: Session, role_id: int) -> Role:
    role = session.get(Role, role_id)
    return role

def get_role_by_name(session: Session, role_name: str) -> Role:
    role = session.exec(select(Role).where(Role.role == role_name)).first()
    return role

def create_role(session: Session, role: Role) -> Role:
    session.add(role)
    session.commit()
    session.refresh(role)
    return role

def update_role(session: Session, role_id: int, role_data) -> Role:
    role = session.get(Role, role_id)
    for key, value in role_data.items():
        setattr(role, key, value)
    session.commit()
    session.refresh(role)
    return role

def delete_role(session: Session, role_id: int) -> Role:
    role = session.get(Role, role_id)
    session.delete(role)
    session.commit()
    return role

## USER_ROLE CONTROLLER

def assign_role(session: Session, user_id: int, role_id: int) -> User:
    user = session.get(User, user_id)
    role = session.get(Role, role_id)
    
    if not user or not role:
        return None

    user.roles.append(role)
    try:
        session.commit()
    except IntegrityError as e:
        session.rollback()
        raise e
    
    
    return user

def revoke_role(session: Session, user_id: int, role_id: int) -> User:
    user = session.get(User, user_id)
    role = session.get(Role, role_id)
    
    if not user or not role:
        return None
    try:
        user.roles.remove(role)
        session.commit()
    except ValueError:
        session.rollback()
        raise ValueError("El usuario no tiene asignado el rol")
    
    return user

# Funcion para obtener todos los roles de un usuario
def get_user_roles(session: Session, user_id: int):
    user = session.get(User, user_id)
    if not user:
        return None
    
    return user.roles

# Funcion para obtener todos los usuarios de un rol
def get_role_users(session: Session, role_id: int):
    role = session.get(Role, role_id)
    if not role:
        return None
    return role.users