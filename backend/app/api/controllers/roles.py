from sqlmodel import Session, select
from app.models import Role, User
from app.core.utils import RoleType
from app.schemas.role import RoleCreate, RoleUpdate
from sqlalchemy.exc import IntegrityError


def get_role_by_name(session: Session, name: RoleType) -> Role:
    role = session.exec(select(Role).where(Role.name == name)).first()
    return role

def create_role(*, session: Session, new_role: RoleCreate) -> Role:
    role_db = Role.model_validate(new_role)
    session.add(role_db)
    session.commit()
    session.refresh(role_db)
    return role_db

def update_role(*, session: Session, db_role: Role, role_in: RoleUpdate) -> Role:
    role_data = role_in.model_dump(exclude_unset=True)
    db_role.sqlmodel_update(role_data)
    session.add(db_role)
    session.commit()
    session.refresh(db_role)
    return db_role


## USER_ROLE CONTROLLER ACTIONS
#TODO: Probar estas funciones
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
    if not user:
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