from sqlmodel import Session, select
from ..models import User
from datetime import datetime
from app.core.security import hash_password, verify_password
from app.schemas import UserCreate


# Funcion para obtener todos los usuarios
def get_users(session: Session):
    users = session.exec(select(User)).all()
    return users

# Funcion para obtener un usuario por su id
def get_user_by_id(session: Session, user_id: int) -> User:
    user = session.get(User, user_id)
    return user

# Funcion para obtener un usuario por su nombre de usuario
def get_user_by_username(session: Session, username: str) -> User:
    user = session.exec(select(User).where(User.username == username)).first()
    return user

# Funcion para crear un usuario
def create_user(session: Session, user: UserCreate):
    user.model_validate(
        user,
        update={"password": hash_password(user.password)}
    )
    session.add(valide_user)
    session.commit()
    session.refresh(valide_user)
    return valide_user

# Funcion para actualizar un usuario
def update_user(session: Session, user_id: int, user_data):
    user = session.get(User, user_id)
    for key, value in user_data.items():
        setattr(user, key, value)
    session.commit()
    session.refresh(user)
    return user

# Funcion para eliminar un usuario
def delete_user(session: Session, user_id: int):
    user = session.get(User, user_id)
    session.delete(user)
    session.commit()
    return user