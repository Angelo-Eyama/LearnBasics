from .tests import session_fixture, client_fixture, TestClient
from app.database import Session, create_engine
from app.models import User, UserRole, Role
from datetime import datetime 

users = [
    {
    "username": "admin",
    "firstName": "Admin",
    "lastName": "Admin",
    "email": "admin@mail.com",
    "creationDate": datetime(2021, 10, 12, hour=10, minute=30, second=0).isoformat(),
    },
    {
        "username": "moderator",
        "firstName": "Moderator",
        "lastName": "Moderator",
        "email": "moderator@mail.com",
        "creationDate": datetime(2021, 10, 12, hour=10, minute=30, second=0).isoformat(),
    },
    {
        "username": "user",
        "firstName": "User",
        "lastName": "User",
        "email": "user@mail.com",
        "creationDate": datetime(2021, 10, 12, hour=10, minute=30, second=0).isoformat(),
    }
]

class TestUsers:

    def test_get_users(session: Session, client: TestClient):
        
        response = client.get("/users/")
        assert response.status_code == 200
        
        # Convertir la respuesta JSON en un diccionario de Python
        response_data = response.json()

        # Comprobar que la respuesta es correcta
        assert len(response_data) > 0
        
        # Verificar que cada usuario esperado esté presente en la respuesta
        for expected_user in users:
            # Buscar el usuario correspondiente en la respuesta
            user_in_response = next((user for user in response_data if user["username"] == expected_user["username"]), None)
            assert user_in_response is not None, f"Usuario {expected_user['username']} no encontrado en la respuesta"
            
            # Comparar los atributos del usuario
            for key in expected_user:
                assert user_in_response[key] == expected_user[key], f"El atributo {key} del usuario {expected_user['username']} no coincide"


    # Get an existing user by id
    def test_get_user(session: Session, client: TestClient):
        response = client.get("/users/id:1")
        assert response.status_code == 200
        
        # Convertir la respuesta JSON en un diccionario de Python
        response_data = response.json()
        
        # Comprobar que la respuesta es correcta
        assert response_data is not None
        
        # Verificar que el usuario esperado esté presente en la respuesta
        expected_user = users[0]
        for key in expected_user:
            assert response_data[key] == expected_user[key], f"El atributo {key} del usuario {expected_user['username']} no coincide"

    # Get an existing user by username
    def test_get_user_by_username(session: Session, client: TestClient):
        response = client.get("/users/admin")
        assert response.status_code == 200
        
        # Convertir la respuesta JSON en un diccionario de Python
        response_data = response.json()
        
        # Comprobar que la respuesta es correcta
        assert response_data is not None
        
        # Verificar que el usuario esperado esté presente en la respuesta
        expected_user = users[0]
        for key in expected_user:
            assert response_data[key] == expected_user[key], f"El atributo {key} del usuario {expected_user['username']} no coincide"

    # Get a non-existing user by id
    def test_get_non_existing_user(session: Session, client: TestClient):
        response = client.get("/users/id:100")
        assert response.status_code == 404
        assert response.json() == {"detail": "Usuario no encontrado"}   

    # Get a non-existing user by username
    def test_get_non_existing_user_by_username(session: Session, client: TestClient):
        response = client.get("/users/non_existing_user")
        assert response.status_code == 404
        assert response.json() == {"detail": "Usuario no encontrado"}


