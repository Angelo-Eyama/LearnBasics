import pytest
from fastapi.testclient import TestClient
from sqlmodel import SQLModel, Session, create_engine
from sqlmodel.pool import StaticPool

from app.main import app
from app.api.deps import get_session, get_current_user
from app.models import User, Role, UserRole


@pytest.fixture(scope="session")
def test_engine():
    """Crea un motor SQLAlchemy para las pruebas con base de datos en memoria"""
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    yield engine


@pytest.fixture(scope="function")
def session(test_engine):
    """Crea una sesión de base de datos para cada prueba"""
    with Session(test_engine) as session:
        yield session


@pytest.fixture(scope="function")
def client(session):
    """Cliente de prueba de FastAPI con base de datos en memoria"""
    
    # Sobrescribir la dependencia de la sesión para usar la sesión de prueba
    def override_get_session():
        yield session
    
    app.dependency_overrides[get_session] = override_get_session
    
    # Crear el cliente de prueba
    with TestClient(app) as client:
        yield client
    
    # Limpiar después de la prueba
    app.dependency_overrides.clear()


@pytest.fixture(scope="function")
def test_roles(session):
    """Crea roles de prueba en la base de datos"""
    roles = [
        Role(name="administrador", description="Administrador del sistema"),
        Role(name="moderador", description="Editor de contenido"),
        Role(name="estudiante", description="Usuario normal sin permisos especiales")
    ]
    for role in roles:
        session.add(role)
    
    session.commit()
    return roles


@pytest.fixture(scope="function")
def test_admin_user(session, test_roles):
    """Crea un usuario administrador para pruebas"""
    from app.core.security import hash_password
    
    admin = User(
        username="admin",
        password=hash_password("adminpass"),
        firstName="Admin",
        lastName="User",
        email="admin@example.com",
        active=True
    )
    session.add(admin)
    session.commit()
    
    # Asignar rol de administrador
    admin_role = session.query(Role).filter(Role.name == "administrador").first()
    user_role = UserRole(userID=admin.id, roleName=admin_role.name)
    session.add(user_role)
    session.commit()
    
    return admin


@pytest.fixture(scope="function")
def test_regular_user(session, test_roles):
    """Crea un usuario normal para pruebas"""
    from app.core.security import hash_password
    
    user = User(
        username="testuser",
        password=hash_password("testpass"),
        firstName="Test",
        lastName="User",
        email="test@example.com",
        active=True
    )
    session.add(user)
    session.commit()
    
    # Asignar rol de estudiante
    role = session.query(Role).filter(Role.name == "estudiante").first()
    user_role = UserRole(userID=user.id, roleName=role.name)
    session.add(user_role)
    session.commit()
    
    return user


@pytest.fixture(scope="function")
def authenticated_client(client, test_admin_user):
    """Cliente autenticado con token JWT para pruebas"""
    from app.core.security import create_access_token
    
    # Generar token de acceso
    access_token = create_access_token(
        data={"sub": str(test_admin_user.id), "username": test_admin_user.username}
    )
    
    # Sobrescribir la dependencia get_current_user
    def override_get_current_user():
        return test_admin_user
    
    app.dependency_overrides[get_current_user] = override_get_current_user
    
    # Configurar el cliente con el token
    client.headers = {
        **client.headers,
        "Authorization": f"Bearer {access_token}"
    }
    
    return client


@pytest.fixture(scope="function")
def regular_authenticated_client(client, test_regular_user):
    """Cliente autenticado con un usuario normal para pruebas"""
    from app.core.security import create_access_token
    
    # Generar token de acceso
    access_token = create_access_token(
        data={"sub": str(test_regular_user.id), "username": test_regular_user.username}
    )
    
    # Sobrescribir la dependencia get_current_user
    def override_get_current_user():
        return test_regular_user
    
    app.dependency_overrides[get_current_user] = override_get_current_user
    
    # Configurar el cliente con el token
    client.headers = {
        **client.headers,
        "Authorization": f"Bearer {access_token}"
    }
    
    return client