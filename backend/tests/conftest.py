from datetime import timedelta
import pytest
from fastapi.testclient import TestClient
from sqlmodel import SQLModel, create_engine, Session
from app.main import app
from app.core.security import create_access_token  # Para JWT
from app.api.deps import get_db 
from app.models import User
from app.core.config import settings

# Fixture: DB en memoria
@pytest.fixture(name="engine")
def engine_fixture():
    engine = create_engine("sqlite:///:memory:", echo=True)
    SQLModel.metadata.create_all(engine)
    yield engine
    SQLModel.metadata.drop_all(engine)

# Fixture: Sesión de DB
@pytest.fixture(name="session")
def session_fixture(engine):
    with Session(engine) as session:
        yield session

# Fixture: Cliente HTTP
@pytest.fixture(name="client")
def client_fixture(engine):
    def get_session_override():
        with Session(engine) as session:
            yield session

    app.dependency_overrides[get_db] = get_session_override  # Override de dependencias
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()

# Fixture: Usuario de prueba
@pytest.fixture(name="test_user")
def user_fixture(session):
    user = User(
        id=1,
        email="test@example.com",
        username="testuser",
        password="testpassword",  # Contraseña en texto plano para pruebas
                )
    session.add(user)
    session.commit()
    return user

# Fixture: Token JWT válido
@pytest.fixture(name="valid_token")
def token_fixture(test_user):
    return create_access_token(
        data={
            "sub": test_user.id,
            "username": test_user.username,
            }, 
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )