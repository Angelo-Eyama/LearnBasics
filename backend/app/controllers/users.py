from sqlmodel import Session, select
import bcrypt
from ..models import User
from datetime import datetime

def generate_password_hash(password: bytes) -> bytes:
    return bcrypt.hashpw(password, bcrypt.gensalt())

def verify_password(password: str, hashed_password: bytes) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password)

def validate_password(password: str) -> bool:
    # Verificar que la contraseña tenga al menos 8 caracteres, una letra mayuscula y un numero
    return len(password) >= 8 and any(char.isupper() for char in password) and any(char.isdigit() for char in password)

def change_password(session: Session, user_id: int, old_password: str, new_password: str):
    user = session.get(User, user_id)
    if not verify_password(old_password, user.password):
        return False
    user.password = generate_password_hash(new_password)
    session.commit()
    session.refresh(user)
    return True

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
def create_user(session: Session, user: User):
    user.creationDate = datetime.now()
    user.password = generate_password_hash(user.password) # Convertir la contraseña a bytes
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

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