from sqlmodel import Session, select, func
from app.core.security import hash_password, verify_password

from app.models import User, Role
from app.schemas.user import UserCreate, UserUpdate, UsersRead
from app.core.utils import RoleType


def get_users(session: Session) -> UsersRead:
    count = session.exec(select(func.count(User.id))).one()
    users = session.exec(select(User)).all()
    return UsersRead( total=count, users=users )


def get_user_by_id(session: Session, user_id: int) -> User:
    user = session.get(User, user_id)
    return user


def create_user(session: Session, new_user: UserCreate) -> User:
    user_db = User.model_validate(
        new_user,
        update={"password": hash_password(new_user.password)}
    )
    # Por defecto, le añadimos el rol de estudiante por defecto
    role = session.get(Role, RoleType.USER)
    user_db.roles.append(role)
    
    session.add(user_db)
    session.commit()
    session.refresh(user_db)
    return user_db


def update_user(session: Session, db_user: User, user_in: UserUpdate) -> User:
    user_data = user_in.model_dump(exclude_unset=True)
    db_user.sqlmodel_update(user_data)
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user

def update_password(session: Session, db_user: User, password: str):    
    db_user.password = hash_password(password)
    session.add(db_user)
    session.commit()
    session.refresh(db_user)

def delete_user(session: Session, user_id: int) -> User:
    user = session.get(User, user_id)
    session.delete(user)
    session.commit()
    return user


def change_user_status(session: Session, db_user: User) -> User:
    db_user.active = not db_user.active
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user


def get_user_by_email(session: Session, email: str) -> User | None:
    return session.exec(select(User).where(User.email == email)).first()


def get_user_by_username(session: Session, username: str) -> User | None:
    return session.exec(select(User).where(User.username == username)).first()


def authenticate(*, session: Session, username: str, password: str) -> User | None:
    user = get_user_by_username(session=session, username=username)
    if not user:
        return None
    if not verify_password(password, user.password):
        return None
    return user
