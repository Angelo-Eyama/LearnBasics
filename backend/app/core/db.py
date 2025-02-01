from sqlmodel import Session, create_engine, select
from app.controllers import users
from app.core.config import settings
from app.core.utils import RoleType
from app.models import User, Role, UserRole
from app.schemas import UserCreate

DATABASE_URL = f"{settings.DATABASE_SCHEME}://{settings.DATABASE_USER}:{settings.DATABASE_PASSWORD}@{settings.DATABASE_SERVER}:{settings.DATABASE_PORT}/{settings.DATABASE_NAME}"
engine = create_engine(DATABASE_URL, pool_pre_ping=True)

# En este punto, es importante que los modelos ya hayan sido creados
# antes de iniciar la base de datos. En caso de no hacerlo correctamente,
# se generará un error.
# Mas detalles: https://github.com/fastapi/full-stack-fastapi-template/issues/28

def init_db(session: Session) -> None:
    '''
    Al usar las migraciones de Alembic, no es necesario crear las tablas.
    Pero si no se usan migraciones, es necesario crearlas.
    Para añadir las tablas manualmente, descomenta las lineas de abajo.
    '''
    # from sqlmodel import SQLModel
    # SQLModel.metadata.create_all(engine)
    
    # Con los modelos creados, añadimos datos a la base de datos
    role = Session.get(Role, RoleType.ADMIN)
    if not role:
        role = Role(name=RoleType.ADMIN, description="Administrador del sistema")
        session.add(role)
        session.commit()
    
    user = session.exec(
        select(User).where(User.email == settings.FIRST_SUPERUSER)
    ).first()
    if not user:
        user = UserCreate(
            username=settings.FIRST_SUPERUSER,
            email=f"{settings.FIRST_SUPERUSER}@mail.com",
            password=settings.FIRST_SUPERUSER_PASSWORD,
            firstName="Super",
            lastName="User",
            roles=[role]
        )
        users.create_user(session, user)
