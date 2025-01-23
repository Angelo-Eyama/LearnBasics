from .tests import session_fixture, client_fixture, TestClient


def test_main(client: TestClient):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Bienvenido a la aplicación de FastAPI"}
