import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool
from app.database import get_session, create_engine
from app.main import app


#Funcion que crea datos de prueba
def create_rows(engine):
    from app.models import User, Role, UserRole
    from datetime import datetime
    #Creamos una fecha generica distinta para cada usuario
    genericDate = datetime(2021, 10, 12, hour=10, minute=30, second=0)
    
    
    with Session(engine) as session:
        #Creamos roles
        admin_role = Role(role="Administrador", description="Administrador de la aplicacion, tiene acceso ilimitado a cualquier recurso")
        moderator_role = Role(role="Moderador", description="Moderador de la aplicacion, tiene acceso limitado a ciertos recursos")
        user_role = Role(role="Usuario", description="Usuario normal de la aplicacion")
        session.commit()
        
        try:
            #Creamos los usuarios
            user1 = User(
                username="admin", 
                password="password123", 
                firstName="Admin", 
                lastName="Admin", 
                email="admin@mail.com", 
                creationDate=genericDate,
                roles=[admin_role]
                )
            
            user2 = User(
                username="moderator", 
                password="password123", 
                firstName="Moderator", 
                lastName="Moderator", 
                email="moderator@mail.com" ,
                creationDate=genericDate,
                roles=[moderator_role]
                )
            
            user3 = User(
                username="user", 
                password="password123", 
                firstName="User", 
                lastName="User", 
                email="user@mail.com", 
                creationDate=genericDate,
                roles=[user_role]
                )
            #Añadimos los usuarios (e indirectamente los roles)
            session.add(user1)
            session.add(user2)
            session.add(user3)
            session.commit()
        except IntegrityError as e:
            print(f"Error en la creacion de datos de prueba. Lo mas probable es que los datos ya existan")
            session.rollback()


@pytest.fixture(name="session") # This fixture will be used in the test functions
def session_fixture():
    engine = create_engine(
        "sqlite://", # Using an in-memory SQLite database
        connect_args={"check_same_thread": False},
        poolclass=StaticPool, echo=True
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        create_rows(engine)
        yield session
        
@pytest.fixture(name="client") # This fixture will be used in the test functions
def client_fixture(session: Session):
    def get_session_override():
        yield session
    app.dependency_overrides[get_session] = get_session_override
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()